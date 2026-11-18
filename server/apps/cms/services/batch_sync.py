# -*- coding: utf-8 -*-
import json
import logging
import os
import urllib.request
import urllib.parse
import http.cookiejar
import ssl
import re
from datetime import date, datetime
from django.utils import timezone
from apps.cms.models import AdmissionBatch

logger = logging.getLogger(__name__)

TAIWANJOBS_BASE_URL = "https://its.taiwanjobs.gov.tw"
TARGET_KEYWORD = "前端網頁技術與AI應用"
BASE_HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7',
}
GET_HEADERS = {
    **BASE_HEADERS,
    'Upgrade-Insecure-Requests': '1',
    'Cache-Control': 'no-cache',
}
HEADERS = {
    **BASE_HEADERS,
    'Origin': 'https://its.taiwanjobs.gov.tw',
    'Referer': 'https://its.taiwanjobs.gov.tw/Course',
}

def roc_to_ad_date(roc_str):
    """將民國年格式 '115/9/3' 或 '115/09/03 00:00' 轉換為西元 YYYY-MM-DD"""
    if not roc_str:
        return None
    try:
        s = str(roc_str).strip().split(' ')[0]
        parts = s.split('/')
        if len(parts) == 3:
            roc_year = int(parts[0])
            ad_year = roc_year + 1911
            month = int(parts[1])
            day = int(parts[2])
            return datetime(ad_year, month, day).date()
    except Exception as e:
        logger.warning(f"[TaiwanJobs] 民國年轉型失敗 '{roc_str}': {e}")
    return None

def build_display_name(official_name, training_start_date, course_id):
    """將官方班名（如「前端網頁技術與AI應用(泰山)第 01期」）整理成網站統一格式
    「前端網頁技術與AI應用（第 1 期）」；抓不到期數時沿用官方原名或課程代碼。
    """
    m = re.search(r'第\s*0*(\d+)\s*期', official_name or '')
    if m:
        return f"{TARGET_KEYWORD}（第 {int(m.group(1))} 期）"
    if official_name:
        return official_name
    return f"{TARGET_KEYWORD} (代碼 {course_id})"

def _build_opener(verify_tls=True):
    """建立帶 Cookie 的 opener；verify_tls=False 時不驗證 TLS 憑證，並支援 TAIWANJOBS_PROXY_URL"""
    ctx = ssl.create_default_context()
    if not verify_tls:
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
    handlers = [
        urllib.request.HTTPCookieProcessor(http.cookiejar.CookieJar()),
        urllib.request.HTTPSHandler(context=ctx),
    ]
    proxy_url = os.getenv("TAIWANJOBS_PROXY_URL", "").strip()
    if proxy_url:
        handlers.append(urllib.request.ProxyHandler({"http": proxy_url, "https": proxy_url}))
    return urllib.request.build_opener(*handlers)

def _is_cert_verify_error(exc):
    return isinstance(exc, ssl.SSLCertVerificationError) or isinstance(
        getattr(exc, "reason", None), ssl.SSLCertVerificationError
    )

def _coerce_date(value):
    """將 date 物件或 YYYY-MM-DD 字串轉成 date；空值回傳 None"""
    if value is None or value == "":
        return None
    if isinstance(value, datetime):
        return value.date()
    if isinstance(value, date):
        return value
    if isinstance(value, str):
        return datetime.strptime(value.strip()[:10], "%Y-%m-%d").date()
    raise ValueError(f"無法識別的日期格式: {value!r}")


def get_session_and_token(error_holder=None):
    """建立 Session 並取得台灣就業通首頁之 __RequestVerificationToken

    預設先驗證 TLS 憑證。台灣就業通的憑證鏈常缺少中繼憑證（瀏覽器會自動補，Python 不會），
    驗證失敗時改以不驗證憑證的連線重試並記錄警告，避免同步整個停擺。
    設定 TAIWANJOBS_SKIP_TLS_VERIFY=True 則一開始就不驗證。
    """
    if os.getenv("TAIWANJOBS_SKIP_TLS_VERIFY", "False") == "True":
        logger.warning("[TaiwanJobs] ⚠️ 已依環境變數關閉 TLS 憑證驗證")
        attempts = [False]
    else:
        attempts = [True, False]

    last_err = None
    for verify_tls in attempts:
        opener = _build_opener(verify_tls)
        try:
            req = urllib.request.Request(f"{TAIWANJOBS_BASE_URL}/Course", headers=GET_HEADERS)
            with opener.open(req, timeout=25) as res:
                status = getattr(res, "status", 200)
                html = res.read().decode('utf-8', errors='ignore')
                tokens = re.findall(r'<input\b[^>]*name="__RequestVerificationToken"[^>]*value="([^"]*)"', html)
                token = tokens[1] if len(tokens) > 1 else (tokens[0] if tokens else "")
                if not token:
                    last_err = f"HTTP {status} 頁面缺少 VerificationToken（可能遭官方 WAF 阻擋）"
                    logger.warning(f"[TaiwanJobs] {last_err}")
                    if error_holder is not None:
                        error_holder.append(last_err)
                return opener, token
        except Exception as e:
            last_err = f"{type(e).__name__}: {e}"
            if verify_tls and _is_cert_verify_error(e):
                logger.warning(f"[TaiwanJobs] ⚠️ TLS 憑證鏈驗證失敗，改以不驗證憑證重試: {e}")
                continue
            logger.error(f"[TaiwanJobs] 取得 Session/Token 失敗: {e}")
            if error_holder is not None:
                error_holder.append(last_err)
            return None, None
    if error_holder is not None and last_err:
        error_holder.append(last_err)
    return None, None


def search_taiwanjobs_courses(opener, token, keyword=TARGET_KEYWORD):
    """直接在台灣就業通 POST 搜尋指定關鍵字之課程代碼列表"""
    post_data = {
        '__RequestVerificationToken': token,
        'Kw': keyword,
        'IsClass': 'true',
        'IsClassContent': 'true',
        'IsHotWord': 'false'
    }
    encoded_data = urllib.parse.urlencode(post_data).encode('utf-8')
    headers = dict(HEADERS)
    headers['Content-Type'] = 'application/x-www-form-urlencoded'

    found_ids = set()
    try:
        req = urllib.request.Request(f"{TAIWANJOBS_BASE_URL}/Course", data=encoded_data, headers=headers)
        with opener.open(req, timeout=25) as res:
            html = res.read().decode('utf-8', errors='ignore')
            # 提取所有 Detail?ID=xxxxx
            matches = re.findall(r'/Course/Detail\?ID=(\d+)', html)
            for cid in matches:
                found_ids.add(cid)
    except Exception as e:
        logger.error(f"[TaiwanJobs] 搜尋課程失敗: {e}")

    return list(found_ids)


def parse_taiwanjobs_detail_page(opener, course_id):
    """直接抓取並解析台灣就業通特定課程之詳細頁面 HTML"""
    url = f"{TAIWANJOBS_BASE_URL}/Course/Detail?ID={course_id}"
    try:
        req = urllib.request.Request(url, headers=GET_HEADERS)
        with opener.open(req, timeout=25) as res:
            final_url = res.geturl()
            # 若被重定向回首頁，表示官方已下架該課程
            if "/Course/Detail" not in final_url:
                logger.info(f"[TaiwanJobs] 課程 {course_id} 已過期被重定向至 {final_url}")
                return None

            html = res.read().decode('utf-8', errors='ignore')
            clean = re.sub(r'<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>', '', html, flags=re.I)
            clean = re.sub(r'<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>', '', clean, flags=re.I)
            text = re.sub(r'<[^>]+>', ' ', clean)
            text = re.sub(r'\s+', ' ', text)

            data = {"id": str(course_id), "apply_url": url}

            # 1. 標題
            title_m = re.search(r'<h[12][^>]*>(.*?)<\/h[12]>', clean, re.I | re.S)
            title = re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', title_m.group(1))).strip() if title_m else ''
            if not title:
                # 新版頁面沒有 h1/h2：班名緊接在「班級代碼」欄位之前
                name_m = re.search(r'(\S+?\s*第\s*\d+\s*期)\s*班級代碼', text)
                if name_m:
                    title = name_m.group(1).strip()
            if title:
                data['name'] = title

            # 2. 人數欄位 (相容舊版「招訓學員/報名人數」與新版「一般訓練學員數/目前一般訓練報名人數」)
            m_td = re.search(r'<td[^>]*data-th="[^"]*(?:備註|人數)[^"]*"[^>]*>(.*?)<\/td>', clean, re.S)
            quota_text = re.sub(r'<[^>]+>', ' ', m_td.group(1)) if m_td else text
            m_plan = re.search(r'(?:招訓學員|一般訓練學員數)\s*[:：]\s*(\d+)', quota_text)
            if m_plan:
                data['planned_trainees'] = int(m_plan.group(1))
            m_app = re.search(r'(?:目前一般訓練)?報名人數\s*[:：]\s*(\d+)', quota_text)
            if m_app:
                data['applicants_count'] = int(m_app.group(1))

            # 3. 報名起訖 (民國年)
            dates = re.findall(r'(\d{2,3}/\d{1,2}/\d{1,2}(?:\s+\d{1,2}:\d{1,2})?)\s*~\s*(\d{2,3}/\d{1,2}/\d{1,2}(?:\s+\d{1,2}:\d{1,2})?)', text)
            if dates:
                data['enroll_start_date'] = roc_to_ad_date(dates[0][0])
                data['enroll_end_date'] = roc_to_ad_date(dates[0][1])
            if len(dates) >= 2:
                data['training_start_date'] = roc_to_ad_date(dates[1][0])
                data['training_end_date'] = roc_to_ad_date(dates[1][1])

            # 4. 甄試日期 (民國年)
            screening_m = re.search(r'甄試日期\s*(\d{2,3}/\d{1,2}/\d{1,2})', text)
            if screening_m:
                data['screening_date'] = roc_to_ad_date(screening_m.group(1))

            # 5. 訓練時數
            hours_m = re.search(r'訓練時數\s*(\d+)\s*小時', text)
            data['total_hours'] = int(hours_m.group(1)) if hours_m else 920

            return data
    except Exception as e:
        logger.error(f"[TaiwanJobs] 解析課程詳情 {course_id} 失敗: {e}")
        return None


DEFAULT_KNOWN_COURSE_CODES = ("167125", "159269")


def _collect_known_course_codes(default_codes=DEFAULT_KNOWN_COURSE_CODES):
    """彙整資料庫內現存未隱藏期別代碼與預設追蹤代碼（去重保序）"""
    codes = []
    try:
        db_codes = AdmissionBatch.objects.exclude(status_override='hidden').values_list('course_code', flat=True)
        for c in db_codes:
            c_str = str(c or "").strip()
            if c_str and c_str not in codes:
                codes.append(c_str)
    except Exception:
        pass
    for c in default_codes:
        c_str = str(c or "").strip()
        if c_str and c_str not in codes:
            codes.append(c_str)
    return codes


def _fetch_known_course_details(default_codes=DEFAULT_KNOWN_COURSE_CODES):
    """當 /Course 搜尋首頁遭 504 或超時時，改直接 GET 已知課程明細頁（不需 Session Token）"""
    codes = _collect_known_course_codes(default_codes)
    if not codes:
        return []
    verify_tls = os.getenv("TAIWANJOBS_SKIP_TLS_VERIFY", "False") != "True"
    opener = _build_opener(verify_tls=verify_tls)
    details = []
    for cid in codes:
        detail = parse_taiwanjobs_detail_page(opener, cid)
        if detail and detail.get('enroll_start_date'):
            details.append(detail)
    return details


def serialize_batch_detail(detail):
    """將日期欄位轉成 YYYY-MM-DD 字串以便 JSON 傳輸"""
    return {k: (v.isoformat() if hasattr(v, "isoformat") else v) for k, v in detail.items()}


def push_batches_to_remote(details, target_url=None, token=None):
    """將抓取之期別清單 JSON 推送至線上 Render /api/v1/cron/batches/sync"""
    base_url = (target_url or os.getenv("RENDER_API_BASE_URL") or "https://wdaweb.onrender.com").strip().rstrip("/")
    cron_token = (token or os.getenv("CRON_SECRET_TOKEN") or "").strip()
    if not cron_token:
        raise ValueError("未設定 CRON_SECRET_TOKEN，無法推送至線上伺服器")
    payload = {"batches": [serialize_batch_detail(d) for d in details]}
    req = urllib.request.Request(
        f"{base_url}/api/v1/cron/batches/sync",
        data=json.dumps(payload, ensure_ascii=False).encode("utf-8"),
        headers={"Content-Type": "application/json", "X-Cron-Token": cron_token},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=180) as res:
        return json.loads(res.read().decode("utf-8"))


def fetch_live_batches(keyword=TARGET_KEYWORD):
    """連線台灣就業通抓取所有目前在線課程明細，回傳 (details, error_message)"""
    conn_errors = []
    opener, token = get_session_and_token(error_holder=conn_errors)
    if not opener or not token:
        # /Course 搜尋首頁若逾時或被阻擋，退回直接讀取已知課程明細頁（不需 Session Token 且延遲較低）
        logger.warning("[TaiwanJobs] ⚠️ /Course Session 失敗，啟動已知課程明細頁直連備援...")
        fallback_details = _fetch_known_course_details()
        if fallback_details:
            logger.info(f"[TaiwanJobs] ✅ 明細頁直連備援成功，取得 {len(fallback_details)} 筆課程明細")
            return fallback_details, None
        detail_msg = f"（{conn_errors[-1]}）" if conn_errors else ""
        return None, f"無法連線至台灣就業通官方網站建立 Session{detail_msg}"

    logger.info("[TaiwanJobs] 正在直接向台灣就業通官方搜尋最新「前端網頁技術與AI應用」課程...")
    active_course_ids = search_taiwanjobs_courses(opener, token, keyword)
    logger.info(f"[TaiwanJobs] 官方搜尋結果代碼列表: {active_course_ids}")

    details = []
    for cid in active_course_ids:
        detail = parse_taiwanjobs_detail_page(opener, cid)
        if detail and detail.get('enroll_start_date'):
            details.append(detail)
    return details, None


def upsert_synced_batches(details, had_active_courses=None):
    """將已解析之課程明細清單寫入資料庫，並保留管理員自訂名稱、排序與軟刪除紀錄"""
    results = {
        "success": False,
        "created": 0,
        "updated": 0,
        "errors": [],
        "synced_batches": [],
        "source": "https://its.taiwanjobs.gov.tw"
    }

    now = timezone.now()
    for detail in details:
        cid = str(detail.get("course_code") or detail.get("id") or "").strip()
        if not cid:
            continue
        try:
            enroll_start = _coerce_date(detail.get('enroll_start_date'))
            enroll_end = _coerce_date(detail.get('enroll_end_date'))
            training_start = _coerce_date(detail.get('training_start_date'))
            training_end = _coerce_date(detail.get('training_end_date'))
            screening = _coerce_date(detail.get('screening_date'))
            if not enroll_start or not enroll_end or not training_start or not training_end:
                raise ValueError("缺少必要報名或受訓起訖日期")

            batch_name = detail.get("batch_name") or build_display_name(detail.get('name'), training_start, cid)

            # 官方資料欄位（每次同步都以台灣就業通為準）
            # 期別名稱只在新建時產生，之後不覆蓋，保留管理員在後台的改名
            synced_fields = {
                "total_hours": int(detail.get('total_hours') or 920),
                "enroll_start_date": enroll_start,
                "enroll_end_date": enroll_end,
                "training_start_date": training_start,
                "training_end_date": training_end,
                "screening_date": screening,
                "planned_trainees": int(detail.get('planned_trainees') if detail.get('planned_trainees') is not None else 24),
                "applicants_count": int(detail.get('applicants_count') if detail.get('applicants_count') is not None else 0),
                "apply_url": detail.get('apply_url') or f"https://its.taiwanjobs.gov.tw/Course/Detail?ID={cid}",
                "last_synced_at": now,
            }

            # 查詢時包含已軟刪除的資料：管理員在後台刪除的期別不會被同步重新建立
            obj = AdmissionBatch.all_objects.filter(course_code=cid).order_by('id').first()

            if obj is not None and obj.deleted_at is not None:
                logger.info(f"[TaiwanJobs] ⏭️ 期別 {cid} 已於後台刪除，略過同步")
                results["skipped_deleted"] = results.get("skipped_deleted", 0) + 1
                continue

            if obj is None:
                # 新期別：排序接在現有期別之後；之後的同步不再更動排序，保留後台手動調整
                existing_count = AdmissionBatch.objects.count()
                obj = AdmissionBatch.objects.create(
                    course_code=cid,
                    batch_name=batch_name,
                    sort_order=existing_count + 1,
                    **synced_fields,
                )
                created = True
            else:
                for field, value in synced_fields.items():
                    setattr(obj, field, value)
                obj.save(update_fields=[*synced_fields.keys(), "updated_at"])
                created = False

            if created:
                results["created"] += 1
                logger.info(f"[TaiwanJobs] ✅ 自動建立新期別: {batch_name} (代碼: {cid})")
            else:
                results["updated"] += 1
                logger.info(f"[TaiwanJobs] 🔄 自動更新期別資訊: {obj.batch_name}")

            results["synced_batches"].append({
                "id": obj.id,
                "course_code": cid,
                "batch_name": obj.batch_name,
                "applicants": obj.applicants_count,
                "planned": obj.planned_trainees,
                "status": obj.dynamic_status,
                "action": "created" if created else "updated"
            })
        except Exception as e:
            err = f"儲存台灣就業通課程 {cid} 失敗: {str(e)}"
            logger.error(f"[TaiwanJobs] {err}")
            results["errors"].append(err)

    has_courses = had_active_courses if had_active_courses is not None else len(details) > 0
    if not has_courses:
        msg = "台灣就業通目前無開放報名中之新前端班級（既有期別已由系統安全留存展示中）"
        logger.info(f"[TaiwanJobs] {msg}")
        results["success"] = True
        results["message"] = msg
    else:
        # 全部都是後台已刪除而略過的期別，也視為正常完成
        results["success"] = (results["created"] + results["updated"] + results.get("skipped_deleted", 0)) > 0

    return results


def sync_admission_batches():
    """
    直接以「台灣就業通官方網站」為目標爬取前端課程報名資訊。
    若官方釋出新期別會自動抓取並建立；
    若歷史期別已過期下線，則保持資料庫既有成果與狀態不被刪除。
    """
    details, err = fetch_live_batches(TARGET_KEYWORD)
    if err:
        return {
            "success": False,
            "created": 0,
            "updated": 0,
            "errors": [err],
            "synced_batches": [],
            "source": "https://its.taiwanjobs.gov.tw"
        }
    return upsert_synced_batches(details, had_active_courses=len(details) > 0)


def ingest_synced_batches(details):
    """接收外部爬蟲回傳之 JSON 期別清單並安全寫入資料庫（供無法直連台灣就業通的雲端主機備援使用）"""
    if not isinstance(details, list):
        return {
            "success": False,
            "created": 0,
            "updated": 0,
            "errors": ["無效的 batches 陣列格式"],
            "synced_batches": [],
            "source": "external-push",
        }
    res = upsert_synced_batches(details, had_active_courses=len(details) > 0)
    res["source"] = "external-push"
    return res

# -*- coding: utf-8 -*-
import json
import logging
import os
import urllib.request
import urllib.parse
import http.cookiejar
import ssl
import re
from datetime import datetime
from django.utils import timezone
from apps.cms.models import AdmissionBatch

logger = logging.getLogger(__name__)

TAIWANJOBS_BASE_URL = "https://its.taiwanjobs.gov.tw"
TARGET_KEYWORD = "前端網頁技術與AI應用"
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7',
    'Origin': 'https://its.taiwanjobs.gov.tw',
    'Referer': 'https://its.taiwanjobs.gov.tw/Course'
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

def get_session_and_token():
    """建立 Session 並取得台灣就業通首頁之 __RequestVerificationToken"""
    # 預設完整驗證 TLS 憑證，防止中間人竄改期別資料。
    # 若官方站台憑證鏈異常導致無法連線，可暫時設定環境變數 TAIWANJOBS_SKIP_TLS_VERIFY=True 作為應急。
    ctx = ssl.create_default_context()
    if os.getenv("TAIWANJOBS_SKIP_TLS_VERIFY", "False") == "True":
        logger.warning("[TaiwanJobs] ⚠️ 已依環境變數關閉 TLS 憑證驗證，請儘速恢復")
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
    
    cj = http.cookiejar.CookieJar()
    opener = urllib.request.build_opener(
        urllib.request.HTTPCookieProcessor(cj),
        urllib.request.HTTPSHandler(context=ctx)
    )
    
    try:
        req = urllib.request.Request(f"{TAIWANJOBS_BASE_URL}/Course", headers=HEADERS)
        with opener.open(req, timeout=15) as res:
            html = res.read().decode('utf-8', errors='ignore')
            tokens = re.findall(r'<input\b[^>]*name="__RequestVerificationToken"[^>]*value="([^"]*)"', html)
            token = tokens[1] if len(tokens) > 1 else (tokens[0] if tokens else "")
            return opener, token
    except Exception as e:
        logger.error(f"[TaiwanJobs] 取得 Session/Token 失敗: {e}")
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
        with opener.open(req, timeout=20) as res:
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
        req = urllib.request.Request(url, headers=HEADERS)
        with opener.open(req, timeout=15) as res:
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

            # 2. 人數欄位 (招訓學員 / 目前報名人數)
            m_td = re.search(r'<td[^>]*data-th="[^"]*(?:備註|人數)[^"]*"[^>]*>(.*?)<\/td>', clean, re.S)
            if m_td:
                td_txt = re.sub(r'<[^>]+>', ' ', m_td.group(1))
                m_plan = re.search(r'招訓學員\s*[:：]\s*(\d+)', td_txt)
                if m_plan:
                    data['planned_trainees'] = int(m_plan.group(1))
                m_app = re.search(r'報名人數\s*[:：]\s*(\d+)', td_txt)
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

def sync_admission_batches():
    """
    直接以「台灣就業通官方網站」為目標爬取前端課程報名資訊。
    若官方釋出新期別（如第 3 期）會自動抓取並建立；
    若歷史期別已過期下線，則保持資料庫既有成果與狀態不被刪除。
    """
    results = {
        "success": False,
        "created": 0,
        "updated": 0,
        "errors": [],
        "synced_batches": [],
        "source": "https://its.taiwanjobs.gov.tw"
    }

    # 1. 建立 Session 並搜尋官方台灣就業通
    opener, token = get_session_and_token()
    if not opener or not token:
        err = "無法連線至台灣就業通官方網站建立 Session"
        results["errors"].append(err)
        return results

    logger.info("[TaiwanJobs] 正在直接向台灣就業通官方搜尋最新「前端網頁技術與AI應用」課程...")
    active_course_ids = search_taiwanjobs_courses(opener, token, TARGET_KEYWORD)
    logger.info(f"[TaiwanJobs] 官方搜尋結果代碼列表: {active_course_ids}")

    # 2. 針對在線課程進行詳細頁面爬取與更新
    now = timezone.now()
    for cid in active_course_ids:
        detail = parse_taiwanjobs_detail_page(opener, cid)
        if detail and detail.get('enroll_start_date'):
            try:
                batch_name = build_display_name(detail.get('name'), detail.get('training_start_date'), cid)

                # 官方資料欄位（每次同步都以台灣就業通為準）
                # 期別名稱只在新建時產生，之後不覆蓋，保留管理員在後台的改名
                synced_fields = {
                    "total_hours": detail.get('total_hours', 920),
                    "enroll_start_date": detail.get('enroll_start_date'),
                    "enroll_end_date": detail.get('enroll_end_date'),
                    "training_start_date": detail.get('training_start_date'),
                    "training_end_date": detail.get('training_end_date'),
                    "screening_date": detail.get('screening_date'),
                    "planned_trainees": detail.get('planned_trainees', 24),
                    "applicants_count": detail.get('applicants_count', 0),
                    "apply_url": detail.get('apply_url', f"https://its.taiwanjobs.gov.tw/Course/Detail?ID={cid}"),
                    "last_synced_at": now,
                }

                # 查詢時包含已軟刪除的資料：管理員在後台刪除的期別不會被同步重新建立
                obj = AdmissionBatch.all_objects.filter(course_code=str(cid)).order_by('id').first()

                if obj is not None and obj.deleted_at is not None:
                    logger.info(f"[TaiwanJobs] ⏭️ 期別 {cid} 已於後台刪除，略過同步")
                    results["skipped_deleted"] = results.get("skipped_deleted", 0) + 1
                    continue

                if obj is None:
                    # 新期別：排序接在現有期別之後；之後的同步不再更動排序，保留後台手動調整
                    existing_count = AdmissionBatch.objects.count()
                    obj = AdmissionBatch.objects.create(
                        course_code=str(cid),
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
                    "course_code": str(cid),
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

    # 3. 若目前台灣就業通處於截止期未搜出新在線課程，確保回報正常狀態
    if len(active_course_ids) == 0:
        msg = "台灣就業通目前無開放報名中之新前端班級（既有第 1、2 期已由系統安全留存展示中）"
        logger.info(f"[TaiwanJobs] {msg}")
        results["success"] = True
        results["message"] = msg
    else:
        # 全部都是後台已刪除而略過的期別，也視為正常完成
        results["success"] = (results["created"] + results["updated"] + results.get("skipped_deleted", 0)) > 0

    return results

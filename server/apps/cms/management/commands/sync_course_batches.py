import json
import os
import urllib.request
from django.core.management.base import BaseCommand
from apps.cms.services.batch_sync import fetch_live_batches, sync_admission_batches


def _serialize_detail(detail):
    """將日期欄位轉成 YYYY-MM-DD 字串以便 JSON 傳輸"""
    out = {}
    for k, v in detail.items():
        out[k] = v.isoformat() if hasattr(v, "isoformat") else v
    return out


class Command(BaseCommand):
    help = "從台灣就業通追蹤系統同步前端網頁技術與AI應用課程報名最新資訊（支援 --push 推入遠端 Render）"

    def add_arguments(self, parser):
        parser.add_argument(
            "--push",
            action="store_true",
            help="在本地抓取台灣就業通後，透過 CRON_SECRET_TOKEN 推送更新線上 Render 資料庫",
        )
        parser.add_argument(
            "--target",
            type=str,
            default=os.getenv("RENDER_API_BASE_URL", "https://wdaweb.onrender.com"),
            help="目標線上伺服器網址（預設 https://wdaweb.onrender.com）",
        )
        parser.add_argument(
            "--dump-json",
            action="store_true",
            help="僅爬取並輸出 JSON 陣列（供自動化工作流備援推送使用，不寫入本地資料庫）",
        )

    def handle(self, *args, **options):
        if options["dump_json"] or options["push"]:
            details, err = fetch_live_batches()
            if err:
                raise SystemExit(f"[ERROR] 抓取台灣就業通失敗: {err}")
            payload = {"batches": [_serialize_detail(d) for d in details]}
            if options["dump_json"]:
                self.stdout.write(json.dumps(payload, ensure_ascii=False))
                return

            token = os.getenv("CRON_SECRET_TOKEN", "").strip()
            if not token:
                raise SystemExit("[ERROR] 使用 --push 前必須設定 CRON_SECRET_TOKEN 環境變數")
            target_url = f"{options['target'].rstrip('/')}/api/v1/cron/batches/sync"
            req = urllib.request.Request(
                target_url,
                data=json.dumps(payload, ensure_ascii=False).encode("utf-8"),
                headers={
                    "Content-Type": "application/json",
                    "X-Cron-Token": token,
                },
                method="POST",
            )
            with urllib.request.urlopen(req, timeout=180) as res:
                resp_data = json.loads(res.read().decode("utf-8"))
            if resp_data.get("success"):
                self.stdout.write(self.style.SUCCESS(f"[SUCCESS] 遠端推送成功：{resp_data.get('message')}"))
            else:
                raise SystemExit(f"[ERROR] 遠端寫入失敗: {resp_data.get('message')}")
            return

        self.stdout.write(self.style.NOTICE("[INFO] 開始同步「前端網頁技術與AI應用」期別報名資訊..."))
        result = sync_admission_batches()
        if result["success"]:
            self.stdout.write(self.style.SUCCESS(
                f"[SUCCESS] 同步成功！新增 {result['created']} 筆，更新 {result['updated']} 筆。"
            ))
            for b in result["synced_batches"]:
                self.stdout.write(
                    f"   - [{b['action'].upper()}] {b['batch_name']} (代碼: {b['course_code']}) | 報名人數: {b['applicants']}/{b['planned']} | 狀態: {b['status']}"
                )
        else:
            self.stdout.write(self.style.ERROR(
                f"[ERROR] 同步失敗: {', '.join(result['errors'])}"
            ))

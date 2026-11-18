import json
import os
import sys
from django.core.management.base import BaseCommand
from apps.cms.services.batch_sync import (
    fetch_live_batches,
    push_batches_to_remote,
    serialize_batch_detail,
    sync_admission_batches,
)


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
                self.stderr.write(f"[NETWORK_BLOCKED] 抓取台灣就業通失敗: {err}")
                sys.exit(2)
            payload = {"batches": [serialize_batch_detail(d) for d in details]}
            if options["dump_json"]:
                self.stdout.write(json.dumps(payload, ensure_ascii=False))
                return

            try:
                resp_data = push_batches_to_remote(details, target_url=options["target"])
            except Exception as e:
                raise SystemExit(f"[ERROR] 遠端推送失敗: {e}")

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

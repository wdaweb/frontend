import hashlib
from io import StringIO
from pathlib import Path

from django.core import serializers
from django.core.management.base import BaseCommand, CommandError
from django.core.management.color import no_style
from django.db import connection, transaction

from apps.cms.models import AdmissionBatch, StudentProject


class Command(BaseCommand):
    help = (
        "匯入 cms_data_backup.json 至資料庫（部署時由 build.sh 呼叫）。"
        "與 loaddata 不同之處：保留線上累計的點擊/瀏覽次數，且不以較舊的備份覆蓋較新的爬蟲同步資料。"
    )

    def add_arguments(self, parser):
        parser.add_argument("fixture", type=str, help="備份檔路徑，例如 ../cms_data_backup.json")

    def handle(self, *args, **options):
        fixture_path = Path(options["fixture"])
        if not fixture_path.exists():
            raise CommandError(f"找不到備份檔：{fixture_path}")

        raw = fixture_path.read_text(encoding="utf-8")
        digest = hashlib.sha256(raw.encode("utf-8")).hexdigest()[:12]

        try:
            objects = list(serializers.deserialize("json", StringIO(raw)))
        except Exception as e:
            raise CommandError(f"備份檔格式錯誤，無法解析：{e}")

        created = updated = 0
        touched_models = set()

        with transaction.atomic():
            for deserialized in objects:
                instance = deserialized.object
                model = instance.__class__
                touched_models.add(model)

                # 一律使用不過濾軟刪除的 manager 查詢，避免主鍵衝突
                base_manager = model._base_manager
                existing = base_manager.filter(pk=instance.pk).first() if instance.pk is not None else None

                if existing is not None:
                    self._preserve_live_fields(instance, existing)
                    updated += 1
                else:
                    created += 1

                # raw 儲存：不觸發 Model.save() 內的圖片壓縮流程（行為與 loaddata 一致）
                deserialized.save()

            self._reset_sequences(touched_models)

        self.stdout.write(self.style.SUCCESS(
            f"[OK] CMS 備份匯入完成（版本 {digest}）：新增 {created} 筆、更新 {updated} 筆，線上計數與較新的爬蟲資料已保留"
        ))

    @staticmethod
    def _preserve_live_fields(instance, existing):
        """保留只會在線上累積或由線上爬蟲更新的欄位"""
        if isinstance(instance, StudentProject):
            instance.view_count = max(existing.view_count or 0, instance.view_count or 0)

        elif isinstance(instance, AdmissionBatch):
            instance.click_count = max(existing.click_count or 0, instance.click_count or 0)

            # 線上爬蟲同步時間較新（或備份無同步時間）時，保留線上的官方期別資料
            live_synced = existing.last_synced_at
            backup_synced = instance.last_synced_at
            if live_synced and (backup_synced is None or live_synced > backup_synced):
                for field in (
                    "batch_name", "total_hours",
                    "enroll_start_date", "enroll_end_date", "screening_date",
                    "training_start_date", "training_end_date",
                    "planned_trainees", "applicants_count",
                    "apply_url", "last_synced_at",
                ):
                    setattr(instance, field, getattr(existing, field))

    @staticmethod
    def _reset_sequences(models):
        """指定主鍵寫入後重設 PostgreSQL 序列，避免後續新增資料時主鍵衝突"""
        if not models:
            return
        sql_list = connection.ops.sequence_reset_sql(no_style(), list(models))
        if sql_list:
            with connection.cursor() as cursor:
                for sql in sql_list:
                    cursor.execute(sql)

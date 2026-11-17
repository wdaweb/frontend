"""
CMS 核心邏輯測試：期別狀態判定、台灣就業通爬蟲解析與同步、部署用備份匯入。
執行方式：cd server && python manage.py test
"""
import json
import tempfile
from datetime import date, datetime, timedelta
from pathlib import Path
from unittest import mock
from zoneinfo import ZoneInfo

from django.core.management import call_command
from django.test import TestCase
from django.utils import timezone

from apps.cms.models import AdmissionBatch, StudentProject
from apps.cms.services import batch_sync, startup_sync

TAIPEI = ZoneInfo("Asia/Taipei")


def make_batch(**overrides):
    """建立一筆標準期別：報名 3/1~3/31、甄試 4/10、訓練 5/1~12/31"""
    data = dict(
        batch_name="第 1 期",
        enroll_start_date=date(2026, 3, 1),
        enroll_end_date=date(2026, 3, 31),
        screening_date=date(2026, 4, 10),
        training_start_date=date(2026, 5, 1),
        training_end_date=date(2026, 12, 31),
        apply_url="https://its.taiwanjobs.gov.tw/Course/Detail?ID=159268",
        course_code="159268",
    )
    data.update(overrides)
    return AdmissionBatch.objects.create(**data)


class DynamicStatusTests(TestCase):
    """AdmissionBatch.dynamic_status 各日期邊界"""

    def status_on(self, batch, day, hour=10, minute=0):
        moment = datetime(day.year, day.month, day.day, hour, minute, tzinfo=TAIPEI)
        with mock.patch("apps.cms.models.timezone.localdate", return_value=day), \
             mock.patch("apps.cms.models.timezone.localtime", return_value=moment):
            return batch.dynamic_status

    def test_before_enrollment_is_upcoming(self):
        self.assertEqual(self.status_on(make_batch(), date(2026, 2, 28)), "upcoming")

    def test_enrollment_open(self):
        batch = make_batch()
        self.assertEqual(self.status_on(batch, date(2026, 3, 1)), "open")
        self.assertEqual(self.status_on(batch, date(2026, 3, 23)), "open")

    def test_last_seven_days_is_closing_soon(self):
        batch = make_batch()
        self.assertEqual(self.status_on(batch, date(2026, 3, 24)), "closing_soon")
        self.assertEqual(self.status_on(batch, date(2026, 3, 31)), "closing_soon")

    def test_until_screening_day_is_screening(self):
        batch = make_batch()
        self.assertEqual(self.status_on(batch, date(2026, 4, 1)), "screening")
        self.assertEqual(self.status_on(batch, date(2026, 4, 10)), "screening")

    def test_after_screening_is_preparing(self):
        self.assertEqual(self.status_on(make_batch(), date(2026, 4, 11)), "preparing")

    def test_without_screening_date_is_preparing(self):
        self.assertEqual(self.status_on(make_batch(screening_date=None), date(2026, 4, 2)), "preparing")

    def test_training_period(self):
        batch = make_batch()
        self.assertEqual(self.status_on(batch, date(2026, 5, 1)), "training")
        self.assertEqual(self.status_on(batch, date(2026, 12, 31), hour=16, minute=34), "training")

    def test_last_day_after_class_ends_is_ended(self):
        self.assertEqual(self.status_on(make_batch(), date(2026, 12, 31), hour=16, minute=35), "ended")

    def test_after_training_is_ended(self):
        self.assertEqual(self.status_on(make_batch(), date(2027, 1, 1)), "ended")

    def test_manual_override_wins(self):
        batch = make_batch(status_override="full")
        self.assertEqual(self.status_on(batch, date(2026, 3, 10)), "full")


class RocDateTests(TestCase):
    def test_converts_roc_year(self):
        self.assertEqual(batch_sync.roc_to_ad_date("115/9/3"), date(2026, 9, 3))

    def test_ignores_time_part(self):
        self.assertEqual(batch_sync.roc_to_ad_date("115/09/03 00:00"), date(2026, 9, 3))

    def test_invalid_returns_none(self):
        self.assertIsNone(batch_sync.roc_to_ad_date("not-a-date"))
        self.assertIsNone(batch_sync.roc_to_ad_date(""))
        self.assertIsNone(batch_sync.roc_to_ad_date("115/13/40"))


SAMPLE_DETAIL_HTML = """
<html><head><script>var x = '<h1>假標題</h1>';</script></head>
<body>
  <h1>前端網頁技術與AI應用班第3期</h1>
  <table><tr>
    <td data-th="報名日期">115/10/01 09:00 ~ 115/10/31 17:00</td>
    <td data-th="訓練期間">115/12/01 ~ 116/08/31</td>
    <td data-th="甄試日期">甄試日期 115/11/10</td>
    <td data-th="訓練時數">訓練時數 920 小時</td>
    <td data-th="人數備註">招訓學員：30 人 / 報名人數：12 人</td>
  </tr></table>
</body></html>
"""


class FakeResponse:
    def __init__(self, html, url):
        self._html = html.encode("utf-8")
        self._url = url

    def read(self):
        return self._html

    def geturl(self):
        return self._url

    def __enter__(self):
        return self

    def __exit__(self, *exc):
        return False


class FakeOpener:
    def __init__(self, html, final_url=None):
        self.html = html
        self.final_url = final_url

    def open(self, req, timeout=None):
        return FakeResponse(self.html, self.final_url or req.full_url)


class ParseDetailPageTests(TestCase):
    def test_parses_all_fields(self):
        data = batch_sync.parse_taiwanjobs_detail_page(FakeOpener(SAMPLE_DETAIL_HTML), "170001")
        self.assertEqual(data["name"], "前端網頁技術與AI應用班第3期")
        self.assertEqual(data["enroll_start_date"], date(2026, 10, 1))
        self.assertEqual(data["enroll_end_date"], date(2026, 10, 31))
        self.assertEqual(data["training_start_date"], date(2026, 12, 1))
        self.assertEqual(data["training_end_date"], date(2027, 8, 31))
        self.assertEqual(data["screening_date"], date(2026, 11, 10))
        self.assertEqual(data["total_hours"], 920)
        self.assertEqual(data["planned_trainees"], 30)
        self.assertEqual(data["applicants_count"], 12)
        self.assertEqual(data["apply_url"], "https://its.taiwanjobs.gov.tw/Course/Detail?ID=170001")

    def test_redirect_away_means_course_removed(self):
        opener = FakeOpener(SAMPLE_DETAIL_HTML, final_url="https://its.taiwanjobs.gov.tw/Course")
        self.assertIsNone(batch_sync.parse_taiwanjobs_detail_page(opener, "170001"))


class SyncAdmissionBatchesTests(TestCase):
    """sync_admission_batches 的資料庫行為（外部連線以 mock 取代）"""

    def run_sync(self, course_ids, detail_by_id):
        with mock.patch.object(batch_sync, "get_session_and_token", return_value=(object(), "token")), \
             mock.patch.object(batch_sync, "search_taiwanjobs_courses", return_value=course_ids), \
             mock.patch.object(batch_sync, "parse_taiwanjobs_detail_page",
                               side_effect=lambda _opener, cid: detail_by_id.get(cid)):
            return batch_sync.sync_admission_batches()

    @staticmethod
    def detail(cid, applicants=5):
        return {
            "id": cid,
            "name": f"前端班 {cid}",
            "apply_url": f"https://its.taiwanjobs.gov.tw/Course/Detail?ID={cid}",
            "enroll_start_date": date(2026, 10, 1),
            "enroll_end_date": date(2026, 10, 31),
            "training_start_date": date(2026, 12, 1),
            "training_end_date": date(2027, 8, 31),
            "screening_date": date(2026, 11, 10),
            "total_hours": 920,
            "planned_trainees": 30,
            "applicants_count": applicants,
        }

    def test_creates_new_batch_after_existing_ones(self):
        make_batch(course_code="159268", sort_order=1)
        make_batch(course_code="159269", sort_order=2, batch_name="第 2 期")
        result = self.run_sync(["170001"], {"170001": self.detail("170001")})
        self.assertTrue(result["success"])
        self.assertEqual(result["created"], 1)
        new_batch = AdmissionBatch.objects.get(course_code="170001")
        self.assertEqual(new_batch.sort_order, 3)
        self.assertEqual(new_batch.applicants_count, 5)

    def test_update_keeps_manual_sort_order(self):
        batch = make_batch(course_code="170001", sort_order=9)
        result = self.run_sync(["170001"], {"170001": self.detail("170001", applicants=21)})
        self.assertEqual(result["updated"], 1)
        batch.refresh_from_db()
        self.assertEqual(batch.sort_order, 9)
        self.assertEqual(batch.applicants_count, 21)
        self.assertIsNotNone(batch.last_synced_at)

    def test_soft_deleted_batch_is_not_recreated(self):
        batch = make_batch(course_code="170001")
        batch.delete()  # 軟刪除
        result = self.run_sync(["170001"], {"170001": self.detail("170001")})
        self.assertTrue(result["success"])
        self.assertEqual(result["created"], 0)
        self.assertEqual(AdmissionBatch.all_objects.filter(course_code="170001").count(), 1)
        self.assertFalse(AdmissionBatch.objects.filter(course_code="170001").exists())

    def test_no_courses_found_is_still_success(self):
        result = self.run_sync([], {})
        self.assertTrue(result["success"])
        self.assertEqual(result["created"] + result["updated"], 0)


# 真實備份檔（dumpdata 產生）都帶有時間戳欄位
STAMPS = {"created_at": "2026-09-01T00:00:00Z", "updated_at": "2026-09-01T00:00:00Z"}


class LoadCmsBackupTests(TestCase):
    """部署時使用的 load_cms_backup：保留線上計數與較新的爬蟲資料"""

    def write_fixture(self, objects):
        tmp = tempfile.NamedTemporaryFile("w", suffix=".json", delete=False, encoding="utf-8")
        json.dump(objects, tmp, ensure_ascii=False)
        tmp.close()
        self.addCleanup(Path(tmp.name).unlink)
        return tmp.name

    def test_keeps_live_counters_and_newer_sync_data(self):
        project = StudentProject.objects.create(
            student_name="王小明", batch_tag="第 1 期", project_name="舊名稱",
            demo_url="https://example.com", view_count=50,
        )
        synced_at = timezone.now()
        batch = make_batch(click_count=40, applicants_count=28)
        AdmissionBatch.objects.filter(pk=batch.pk).update(last_synced_at=synced_at)

        fixture = self.write_fixture([
            {"model": "cms.studentproject", "pk": project.pk, "fields": {
                "student_name": "王小明", "batch_tag": "第 1 期", "project_name": "本地新名稱",
                "demo_url": "https://example.com", "view_count": 3, **STAMPS,
            }},
            {"model": "cms.admissionbatch", "pk": batch.pk, "fields": {
                "batch_name": "第 1 期", "enroll_start_date": "2026-03-01", "enroll_end_date": "2026-03-31",
                "training_start_date": "2026-05-01", "training_end_date": "2026-12-31",
                "apply_url": "https://its.taiwanjobs.gov.tw/Course/Detail?ID=159268", "course_code": "159268",
                "click_count": 1, "applicants_count": 10,
                "last_synced_at": (synced_at - timedelta(days=30)).isoformat(), **STAMPS,
            }},
        ])
        call_command("load_cms_backup", fixture, stdout=mock.MagicMock())

        project.refresh_from_db()
        self.assertEqual(project.project_name, "本地新名稱")  # 內容以本地備份為準
        self.assertEqual(project.view_count, 50)              # 線上瀏覽數保留

        batch.refresh_from_db()
        self.assertEqual(batch.click_count, 40)               # 線上點擊數保留
        self.assertEqual(batch.applicants_count, 28)          # 線上較新的爬蟲資料保留

    def test_creates_missing_objects(self):
        fixture = self.write_fixture([
            {"model": "cms.studentproject", "pk": 500, "fields": {
                "student_name": "李小華", "batch_tag": "第 2 期", "project_name": "新作品",
                "demo_url": "https://example.com/new", **STAMPS,
            }},
        ])
        call_command("load_cms_backup", fixture, stdout=mock.MagicMock())
        self.assertTrue(StudentProject.objects.filter(pk=500, project_name="新作品").exists())


class StartupSyncTests(TestCase):
    """伺服器喚醒時的自動補抓"""

    def test_only_enabled_for_gunicorn_in_production(self):
        with mock.patch.dict("os.environ", {}, clear=False):
            import os
            os.environ.pop("BATCH_SYNC_ON_STARTUP", None)
            with self.settings(DEBUG=False):
                self.assertTrue(startup_sync.is_startup_sync_enabled(["/usr/bin/gunicorn", "core.wsgi"]))
                self.assertFalse(startup_sync.is_startup_sync_enabled(["manage.py", "test"]))
            with self.settings(DEBUG=True):
                self.assertFalse(startup_sync.is_startup_sync_enabled(["/usr/bin/gunicorn"]))

    def test_env_flag_overrides(self):
        with mock.patch.dict("os.environ", {"BATCH_SYNC_ON_STARTUP": "False"}):
            self.assertFalse(startup_sync.is_startup_sync_enabled(["/usr/bin/gunicorn"]))
        with mock.patch.dict("os.environ", {"BATCH_SYNC_ON_STARTUP": "True"}):
            self.assertTrue(startup_sync.is_startup_sync_enabled(["manage.py"]))

    def test_stale_detection(self):
        self.assertTrue(startup_sync.is_sync_stale())  # 沒有任何期別
        batch = make_batch()
        self.assertTrue(startup_sync.is_sync_stale())  # 從未同步
        AdmissionBatch.objects.filter(pk=batch.pk).update(last_synced_at=timezone.now() - timedelta(hours=1))
        self.assertFalse(startup_sync.is_sync_stale())
        AdmissionBatch.objects.filter(pk=batch.pk).update(last_synced_at=timezone.now() - timedelta(hours=7))
        self.assertTrue(startup_sync.is_sync_stale())

    def test_runs_sync_only_when_stale(self):
        batch = make_batch(last_synced_at=timezone.now())
        with mock.patch.object(batch_sync, "sync_admission_batches") as sync:
            self.assertIsNone(startup_sync.run_startup_sync())
            sync.assert_not_called()
        AdmissionBatch.objects.filter(pk=batch.pk).update(last_synced_at=timezone.now() - timedelta(days=30))
        with mock.patch.object(batch_sync, "sync_admission_batches",
                               return_value={"success": True, "created": 1, "updated": 0, "errors": []}) as sync:
            result = startup_sync.run_startup_sync()
            sync.assert_called_once()
            self.assertEqual(result["created"], 1)

    def test_sync_errors_never_raise(self):
        with mock.patch.object(batch_sync, "sync_admission_batches", side_effect=RuntimeError("network down")):
            self.assertIsNone(startup_sync.run_startup_sync())


NEW_LAYOUT_DETAIL_HTML = """
<html><body>
  <nav>首頁 課程查詢 瀏覽課程明細</nav>
  <div class="title">前端網頁技術與AI應用(泰山)第 01期</div>
  <table><tr><th>班級代碼</th><td>167125</td></tr><tr>
    <td data-th="報名日期">115/11/16 00:00 ~ 116/2/16 23:59</td>
    <td data-th="訓練期間">116/4/1 ~ 116/9/20</td>
    <td data-th="人數備註">一般訓練學員數:24 目前一般訓練報名人數:0</td>
  </tr></table>
</body></html>
"""


class BatchNamingTests(TestCase):
    """新版頁面班名解析、統一命名格式，且不覆蓋後台改名"""

    run_sync = SyncAdmissionBatchesTests.run_sync
    detail = staticmethod(SyncAdmissionBatchesTests.detail)

    def test_parses_title_without_heading_tag(self):
        data = batch_sync.parse_taiwanjobs_detail_page(FakeOpener(NEW_LAYOUT_DETAIL_HTML), "167125")
        self.assertEqual(data["name"], "前端網頁技術與AI應用(泰山)第 01期")
        self.assertEqual(data["training_start_date"], date(2027, 4, 1))

    def test_build_display_name_normalizes_number(self):
        self.assertEqual(
            batch_sync.build_display_name("前端網頁技術與AI應用(泰山)第 01期", date(2027, 4, 1), "167125"),
            "前端網頁技術與AI應用（第 1 期）",
        )

    def test_build_display_name_fallbacks(self):
        self.assertEqual(batch_sync.build_display_name("某課程", date(2027, 4, 1), "1"), "某課程")
        self.assertEqual(
            batch_sync.build_display_name(None, None, "167125"), "前端網頁技術與AI應用 (代碼 167125)"
        )

    def test_new_batch_gets_display_name(self):
        detail = self.detail("167125")
        detail["name"] = "前端網頁技術與AI應用(泰山)第 01期"
        self.run_sync(["167125"], {"167125": detail})
        self.assertEqual(
            AdmissionBatch.objects.get(course_code="167125").batch_name,
            "前端網頁技術與AI應用（第 1 期）",
        )

    def test_update_keeps_admin_batch_name(self):
        make_batch(course_code="167125", sort_order=3, batch_name="管理員自訂名稱")
        detail = self.detail("167125", applicants=7)
        detail["name"] = "前端網頁技術與AI應用(泰山)第 01期"
        self.run_sync(["167125"], {"167125": detail})
        batch = AdmissionBatch.objects.get(course_code="167125")
        self.assertEqual(batch.batch_name, "管理員自訂名稱")
        self.assertEqual(batch.applicants_count, 7)

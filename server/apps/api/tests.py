"""
API 端點測試：公開讀取、轉換追蹤、排程密鑰驗證與後台權限。
執行方式：cd server && python manage.py test
"""
import os
from datetime import date
from unittest import mock

from django.contrib.auth.models import User
from django.test import TestCase

from apps.cms.models import AdmissionBatch, StudentProject

CRON_URL = "/api/v1/cron/batches/sync"
SYNC_OK = {"success": True, "created": 0, "updated": 2, "errors": []}


class PublicApiTests(TestCase):
    def setUp(self):
        self.batch = AdmissionBatch.objects.create(
            batch_name="第 1 期",
            enroll_start_date=date(2026, 3, 1), enroll_end_date=date(2026, 3, 31),
            training_start_date=date(2026, 5, 1), training_end_date=date(2026, 12, 31),
            apply_url="https://its.taiwanjobs.gov.tw/Course/Detail?ID=159268", course_code="159268",
        )
        self.project = StudentProject.objects.create(
            student_name="王小明", batch_tag="第 1 期", project_name="作品", demo_url="https://example.com",
        )

    def test_public_endpoints_respond(self):
        for path in ["site-settings", "carousels", "batches", "curriculum/modules",
                     "curriculum/tech-cards", "facilities", "projects", "faqs"]:
            with self.subTest(path=path):
                self.assertEqual(self.client.get(f"/api/v1/public/{path}").status_code, 200)

    def test_hidden_batch_not_listed(self):
        AdmissionBatch.objects.filter(pk=self.batch.pk).update(status_override="hidden")
        self.assertEqual(self.client.get("/api/v1/public/batches").json(), [])

    def test_click_and_view_counters(self):
        self.client.post(f"/api/v1/public/batches/{self.batch.pk}/click")
        self.client.post(f"/api/v1/public/projects/{self.project.pk}/view")
        self.batch.refresh_from_db()
        self.project.refresh_from_db()
        self.assertEqual(self.batch.click_count, 1)
        self.assertEqual(self.project.view_count, 1)

    def test_counter_on_missing_object_is_404(self):
        self.assertEqual(self.client.post("/api/v1/public/batches/99999/click").status_code, 404)


@mock.patch("apps.cms.services.batch_sync.sync_admission_batches", return_value=SYNC_OK)
class CronEndpointTests(TestCase):
    def post(self, **kwargs):
        return self.client.post(CRON_URL, **kwargs)

    def test_rejects_when_token_not_configured(self, _sync):
        with mock.patch.dict(os.environ, {}, clear=False):
            os.environ.pop("CRON_SECRET_TOKEN", None)
            # 舊版寫死在程式碼中的預設密鑰必須失效
            res = self.post(headers={"X-Cron-Token": "wdaweb-cron-sync-token-2026"})
        self.assertEqual(res.status_code, 403)
        _sync.assert_not_called()

    @mock.patch.dict(os.environ, {"CRON_SECRET_TOKEN": "s3cret"})
    def test_rejects_wrong_or_missing_token(self, _sync):
        self.assertEqual(self.post(headers={"X-Cron-Token": "wrong"}).status_code, 403)
        self.assertEqual(self.post().status_code, 403)
        _sync.assert_not_called()

    @mock.patch.dict(os.environ, {"CRON_SECRET_TOKEN": "s3cret"})
    def test_rejects_token_in_query_string(self, _sync):
        self.assertEqual(self.client.post(f"{CRON_URL}?token=s3cret").status_code, 403)

    @mock.patch.dict(os.environ, {"CRON_SECRET_TOKEN": "s3cret"})
    def test_get_not_allowed(self, _sync):
        self.assertEqual(self.client.get(CRON_URL, headers={"X-Cron-Token": "s3cret"}).status_code, 405)

    @mock.patch.dict(os.environ, {"CRON_SECRET_TOKEN": "s3cret"})
    def test_accepts_header_and_bearer(self, _sync):
        res = self.post(headers={"X-Cron-Token": "s3cret"})
        self.assertEqual(res.status_code, 200)
        self.assertTrue(res.json()["success"])
        self.assertEqual(self.post(headers={"Authorization": "Bearer s3cret"}).status_code, 200)


@mock.patch("apps.cms.services.batch_sync.sync_admission_batches", return_value=SYNC_OK)
class AdminSyncEndpointTests(TestCase):
    URL = "/api/v1/admin/batches/sync"

    def test_anonymous_rejected(self, _sync):
        self.assertEqual(self.client.post(self.URL).status_code, 401)
        _sync.assert_not_called()

    def test_non_staff_rejected(self, _sync):
        User.objects.create_user("member", password="pw-12345678")
        self.client.login(username="member", password="pw-12345678")
        self.assertEqual(self.client.post(self.URL).status_code, 403)
        _sync.assert_not_called()

    def test_staff_allowed(self, _sync):
        User.objects.create_user("editor", password="pw-12345678", is_staff=True)
        self.client.login(username="editor", password="pw-12345678")
        res = self.client.post(self.URL)
        self.assertEqual(res.status_code, 200)
        self.assertTrue(res.json()["success"])

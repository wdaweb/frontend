from django.apps import AppConfig

class CmsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.cms'
    verbose_name = '泰山職訓招生內容管理'

    def ready(self):
        # 伺服器（Gunicorn）喚醒時，於背景自動補抓過舊的台灣就業通期別資料
        from apps.cms.services.startup_sync import start_background_sync
        start_background_sync()

"""
伺服器喚醒時自動補抓台灣就業通期別

背景：Render 免費方案閒置後會休眠，線上 SQLite 在喚醒時會還原成部署當時的狀態，
排程（每天 08:00、17:00）抓到的新期別可能因此消失，直到下一次排程才再出現。
做法：Gunicorn 工作程序啟動（即伺服器喚醒）後，於背景執行緒檢查最後同步時間，
若超過門檻即自動同步一次，不阻塞網站回應。

環境變數：
- BATCH_SYNC_ON_STARTUP：設為 False 可關閉（預設在 Gunicorn 正式環境開啟）
- BATCH_SYNC_STALE_HOURS：最後同步距今超過幾小時才補抓（預設 6）
- BATCH_SYNC_STARTUP_DELAY：啟動後延遲幾秒再檢查（預設 5）
"""
import logging
import os
import sys
import threading
import time
from datetime import timedelta

from django.conf import settings
from django.core.cache import cache
from django.db import close_old_connections
from django.db.models import Max
from django.utils import timezone

logger = logging.getLogger(__name__)

SYNC_LOCK_KEY = "lock:batch_sync_trigger"
_started = False


def _env_float(name: str, default: float) -> float:
    try:
        return float(os.getenv(name, default))
    except (TypeError, ValueError):
        return default


def is_startup_sync_enabled(argv=None) -> bool:
    """只在 Gunicorn 啟動的正式環境執行；manage.py 指令、測試與本地開發都不觸發"""
    flag = os.getenv("BATCH_SYNC_ON_STARTUP", "").strip()
    if flag:
        return flag == "True"
    argv = sys.argv if argv is None else argv
    program = os.path.basename(argv[0]) if argv else ""
    return "gunicorn" in program and not settings.DEBUG


def is_sync_stale(now=None) -> bool:
    """所有未刪除期別中最新的同步時間超過門檻（或從未同步）即視為過舊"""
    from apps.cms.models import AdmissionBatch

    stale_hours = _env_float("BATCH_SYNC_STALE_HOURS", 6)
    latest = AdmissionBatch.objects.aggregate(latest=Max("last_synced_at"))["latest"]
    if latest is None:
        return True
    now = now or timezone.now()
    return now - latest > timedelta(hours=stale_hours)


def run_startup_sync() -> dict | None:
    """檢查並視需要執行同步；回傳同步結果（未執行時回傳 None）"""
    from apps.cms.services.batch_sync import sync_admission_batches

    close_old_connections()
    try:
        if not is_sync_stale():
            logger.info("[StartupSync] 期別資料仍在有效期內，略過喚醒同步")
            return None
        if not cache.add(SYNC_LOCK_KEY, True, timeout=120):
            logger.info("[StartupSync] 其他同步作業進行中，略過")
            return None
        try:
            logger.info("[StartupSync] 期別資料過舊，開始自動補抓台灣就業通")
            result = sync_admission_batches()
            logger.info(
                "[StartupSync] 完成：success=%s 新增 %s 筆、更新 %s 筆 %s",
                result.get("success"), result.get("created"), result.get("updated"),
                "；".join(result.get("errors", [])),
            )
            return result
        finally:
            cache.delete(SYNC_LOCK_KEY)
    except Exception:
        logger.exception("[StartupSync] 喚醒同步發生異常（不影響網站運作）")
        return None
    finally:
        close_old_connections()


def start_background_sync() -> bool:
    """於背景執行緒啟動喚醒同步；同一工作程序只會啟動一次"""
    global _started
    if _started or not is_startup_sync_enabled():
        return False
    _started = True
    delay = _env_float("BATCH_SYNC_STARTUP_DELAY", 5)

    def _worker():
        time.sleep(delay)
        run_startup_sync()

    threading.Thread(target=_worker, name="batch-startup-sync", daemon=True).start()
    logger.info("[StartupSync] 已排程喚醒同步檢查（%s 秒後）", delay)
    return True

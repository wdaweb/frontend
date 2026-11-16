#!/usr/bin/env bash
# exit on error
set -o errexit

pip install -r requirements.txt

python manage.py collectstatic --no-input
python manage.py migrate
# 匯入本地 CMS 備份：保留線上的點擊/瀏覽計數與較新的爬蟲資料；匯入失敗會中止部署（舊版本維持上線）
if [ -f "../cms_data_backup.json" ]; then
    python manage.py load_cms_backup ../cms_data_backup.json
fi

python seed_data.py

# Deployment trigger: 2026-09-24 16:45:37

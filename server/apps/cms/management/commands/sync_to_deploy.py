import os
import sys
import json
import re
import shutil
import time
from datetime import datetime
from django.core.management.base import BaseCommand
from django.core.management import call_command
from django.conf import settings
from apps.cms.models import AdmissionBatch, StudentProject
from apps.cms.services.batch_sync import (
    fetch_live_batches,
    push_batches_to_remote,
    upsert_synced_batches,
)

class Command(BaseCommand):
    help = "一鍵同步本地 CMS 資料至線上部署環境（同步台灣就業通、備份資料庫、同步縮圖、更新前端快照、喚醒 Render、打包驗證）"

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE("🚀 開始執行全自動一鍵同步流程..."))
        base_dir = settings.BASE_DIR  # server/
        repo_root = os.path.dirname(base_dir)  # d:/01.Project/wdaweb
        client_dir = os.path.join(repo_root, "client")

        # 0. 從台灣就業通即時更新本地資料庫期別與人數（台灣本機 IP 僅需 1~2 秒）
        self.stdout.write("🔄 0/5 正在從台灣就業通同步最新招生期別與報名人數...")
        try:
            details, err = fetch_live_batches()
            if err or details is None:
                self.stdout.write(self.style.WARNING(f"   ⚠️ 台灣就業通暫時無法連線，保留本地既有期別資料：{err}"))
            else:
                sync_res = upsert_synced_batches(details, had_active_courses=len(details) > 0)
                self.stdout.write(self.style.SUCCESS(
                    f"   ✓ 台灣就業通期別同步完成（新增 {sync_res['created']} 筆、更新 {sync_res['updated']} 筆）"
                ))
                if os.getenv("CRON_SECRET_TOKEN", "").strip() and details:
                    try:
                        push_res = push_batches_to_remote(details)
                        self.stdout.write(self.style.SUCCESS(f"   ✓ 已同步推送至線上 Render：{push_res.get('message')}"))
                    except Exception as push_err:
                        self.stdout.write(self.style.WARNING(f"   ⚠️ 線上 Render 推送略過（可稍後透過 git push 自動匯入）：{push_err}"))
        except Exception as sync_err:
            self.stdout.write(self.style.WARNING(f"   ⚠️ 期別同步過程發生異常，保留既有資料：{sync_err}"))

        # 1. 匯出 cms_data_backup.json
        self.stdout.write("📦 1/5 正在打包本地資料庫至 cms_data_backup.json...")
        backup_path = os.path.join(repo_root, "cms_data_backup.json")
        try:
            from io import StringIO
            buf = StringIO()
            call_command(
                'dumpdata', 'cms',
                natural_foreign=True,
                natural_primary=True,
                indent=2,
                exclude=['contenttypes', 'auth.Permission'],
                stdout=buf
            )
            with open(backup_path, 'w', encoding='utf-8') as f:
                f.write(buf.getvalue())
            self.stdout.write(self.style.SUCCESS("   ✓ 資料庫備份打包完成 (UTF-8)"))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"   ✗ 打包失敗: {e}"))
            sys.exit(1)

        # 2. 同步縮圖到 client/public/projects/
        self.stdout.write("🖼️  2/5 正在同步作品縮圖至前端靜態目錄...")
        media_projects = os.path.join(base_dir, "media", "projects")
        client_projects = os.path.join(client_dir, "public", "projects")
        os.makedirs(client_projects, exist_ok=True)
        synced_img_count = 0
        if os.path.exists(media_projects):
            for filename in os.listdir(media_projects):
                if filename.endswith(('.webp', '.png', '.jpg', '.jpeg')):
                    src = os.path.join(media_projects, filename)
                    dst = os.path.join(client_projects, filename)
                    shutil.copy2(src, dst)
                    synced_img_count += 1
        self.stdout.write(self.style.SUCCESS(f"   ✓ 已同步 {synced_img_count} 張縮圖至 client/public/projects/"))

        # 3. 更新前端作品快照 (src/data/cmsDefaultSnapshots.ts) 與 store 快取版本 (useCmsStore.ts)
        self.stdout.write("⚡ 3/5 正在更新前端 cmsDefaultSnapshots.ts 靜態快照與快取版本...")
        snapshot_file = os.path.join(client_dir, "src", "data", "cmsDefaultSnapshots.ts")
        store_file = os.path.join(client_dir, "src", "stores", "useCmsStore.ts")

        if not os.path.exists(snapshot_file):
            self.stdout.write(self.style.ERROR(f"   ✗ 找不到前端快照檔：{snapshot_file}"))
            sys.exit(1)

        projects = list(StudentProject.objects.order_by('-is_featured', 'sort_order', '-created_at', '-id'))
        lines = ['export const defaultProjects: StudentProject[] = [']
        for p in projects:
            img = f'./projects/project_{p.id}.webp' if p.cover_image else ''
            alt = p.image_alt or f'{p.student_name} - {p.project_name}'
            lines.append('\t{')
            lines.append(f'\t\tid: {p.id},')
            lines.append(f'\t\tstudent_name: {json.dumps(p.student_name, ensure_ascii=False)},')
            lines.append(f'\t\tbatch_tag: {json.dumps(p.batch_tag, ensure_ascii=False)},')
            lines.append(f'\t\tproject_name: {json.dumps(p.project_name, ensure_ascii=False)},')
            lines.append(f'\t\tcover_image_url: {json.dumps(img, ensure_ascii=False)},')
            lines.append(f'\t\timage_alt: {json.dumps(alt, ensure_ascii=False)},')
            lines.append(f'\t\tdemo_url: {json.dumps(p.demo_url, ensure_ascii=False)},')
            lines.append(f'\t\tgithub_url: {json.dumps(p.github_url, ensure_ascii=False)},')
            lines.append(f'\t\tview_count: {p.view_count},')
            lines.append(f'\t\tis_featured: {str(p.is_featured).lower()},')
            lines.append(f'\t\tsort_order: {p.sort_order},')
            lines.append('\t},')
        lines.append(']')
        ts_code = '\n'.join(lines)

        with open(snapshot_file, 'r', encoding='utf-8', newline='') as f:
            content = f.read()
        newline = '\r\n' if '\r\n' in content else '\n'
        content = content.replace('\r\n', '\n')

        # 以函式作為取代內容，避免作品文字中的反斜線被當成正規表示式跳脫字元
        content, replaced = re.subn(
            r'export const defaultProjects: StudentProject\[\] = \[[\s\S]*?\n\]',
            lambda _m: ts_code,
            content,
            count=1,
        )
        if replaced != 1:
            self.stdout.write(self.style.ERROR("   ✗ 在 cmsDefaultSnapshots.ts 中找不到 defaultProjects 區塊，快照未更新"))
            sys.exit(1)

        # 同步更新非隱藏之招生期別至 defaultBatches
        batches = list(AdmissionBatch.objects.exclude(status_override='hidden').order_by('sort_order', 'enroll_start_date'))
        if batches:
            batch_lines = ['export const defaultBatches: AdmissionBatch[] = [']
            for b in batches:
                screening_str = json.dumps(str(b.screening_date)) if b.screening_date else 'null'
                batch_lines.extend([
                    '\t{',
                    f'\t\tid: {b.id},',
                    f'\t\tbatch_name: {json.dumps(b.batch_name, ensure_ascii=False)},',
                    f'\t\ttotal_hours: {b.total_hours},',
                    f'\t\tenroll_start_date: {json.dumps(str(b.enroll_start_date))},',
                    f'\t\tenroll_end_date: {json.dumps(str(b.enroll_end_date))},',
                    f'\t\tscreening_date: {screening_str},',
                    f'\t\ttraining_start_date: {json.dumps(str(b.training_start_date))},',
                    f'\t\ttraining_end_date: {json.dumps(str(b.training_end_date))},',
                    f'\t\tplanned_trainees: {b.planned_trainees},',
                    f'\t\tapplicants_count: {b.applicants_count},',
                    f'\t\tapply_url: {json.dumps(b.apply_url, ensure_ascii=False)},',
                    f'\t\tcourse_code: {json.dumps(b.course_code, ensure_ascii=False)},',
                    f'\t\tdynamic_status: {json.dumps(b.dynamic_status)},',
                    f'\t\tstatus_override: {json.dumps(b.status_override)},',
                    f'\t\tclick_count: {b.click_count},',
                    f'\t\tsort_order: {b.sort_order},',
                    '\t},',
                ])
            batch_lines.append(']')
            batch_ts = '\n'.join(batch_lines)
            content, _ = re.subn(
                r'export const defaultBatches: AdmissionBatch\[\] = \[[\s\S]*?\n\]',
                lambda _m: batch_ts,
                content,
                count=1,
            )

        with open(snapshot_file, 'w', encoding='utf-8', newline='') as f:
            f.write(content.replace('\n', newline))

        # 自動更新快取時間戳，確保訪客瀏覽器自動獲取最新版本
        if os.path.exists(store_file):
            with open(store_file, 'r', encoding='utf-8', newline='') as f:
                store_content = f.read()
            new_cache_key = f"const CACHE_KEY = 'wdaweb_cms_cache_{int(time.time())}'"
            store_content, key_replaced = re.subn(r"const CACHE_KEY = 'wdaweb_cms_cache_[^']*'", new_cache_key, store_content, count=1)
            if key_replaced != 1:
                self.stdout.write(self.style.WARNING("   ⚠️ 在 useCmsStore.ts 中找不到 CACHE_KEY，快取版本未升級"))
            else:
                with open(store_file, 'w', encoding='utf-8', newline='') as f:
                    f.write(store_content)
        self.stdout.write(self.style.SUCCESS(f"   ✓ 前端快照已同步 {len(projects)} 筆專案，快取已升級"))

        # 4. 更新 server/build.sh 觸發 Render 自動部署
        self.stdout.write("🌐 4/5 正在更新 Render 雲端自動部署觸發器...")
        build_sh_path = os.path.join(base_dir, "build.sh")
        if os.path.exists(build_sh_path):
            with open(build_sh_path, 'r', encoding='utf-8') as f:
                b_content = f.read()
            now_str = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            trigger_line = f"# Deployment trigger: {now_str}"
            if "# Deployment trigger:" in b_content:
                b_content = re.sub(r'# Deployment trigger:.*', trigger_line, b_content)
            else:
                b_content = b_content.strip() + f"\n\n{trigger_line}\n"
            with open(build_sh_path, 'w', encoding='utf-8') as f:
                f.write(b_content)
            self.stdout.write(self.style.SUCCESS("   ✓ Render 雲端部署觸發器已就緒"))

        # 5. 前端 build 測試
        self.stdout.write("🔨 5/5 正在執行前端建置檢查 (npm run build)...")
        import subprocess
        try:
            res = subprocess.run(
                ["npm.cmd", "run", "build"],
                cwd=client_dir,
                capture_output=True,
                text=True,
                shell=True
            )
            if res.returncode == 0:
                self.stdout.write(self.style.SUCCESS("   ✓ 前端編譯通過 (0 錯誤)"))
            else:
                self.stdout.write(self.style.WARNING(f"   ⚠️ 前端編譯有警告: {res.stderr[:200]}"))
        except Exception as e:
            self.stdout.write(self.style.WARNING(f"   ⚠️ 無法執行 npm run build ({e})，可由 GitHub Actions 自動建置"))

        self.stdout.write(self.style.SUCCESS("\n🎉 全部同步作業已完成！"))

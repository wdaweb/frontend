import os
from pathlib import Path
from django.urls import reverse_lazy
from django.templatetags.static import static
import dj_database_url
from django.core.exceptions import ImproperlyConfigured

BASE_DIR = Path(__file__).resolve().parent.parent

# 自動讀取本地 .env 設定檔 (支援 server/ 與根目錄，免額外套件依賴)
for _env_path in [BASE_DIR / '.env', BASE_DIR.parent / '.env']:
    if _env_path.exists():
        try:
            with open(_env_path, 'r', encoding='utf-8') as _ef:
                for _line in _ef:
                    _line = _line.strip()
                    if _line and not _line.startswith('#') and '=' in _line:
                        _k, _v = _line.split('=', 1)
                        # 系統環境變數優先，.env 僅補上尚未設定的項目
                        os.environ.setdefault(_k.strip(), _v.strip())
        except Exception:
            pass

def _env_list(name: str) -> list[str]:
    return [v.strip() for v in os.getenv(name, '').split(',') if v.strip()]

# 安全預設：未明確設定 DEBUG=True 時一律視為正式環境（本地開發請於 server/.env 加上 DEBUG=True）
DEBUG = os.getenv('DEBUG', 'False') == 'True'

SECRET_KEY = os.getenv('SECRET_KEY', '')
if not SECRET_KEY:
    if DEBUG:
        # 僅限本地開發使用的固定金鑰，正式環境必須由環境變數提供
        SECRET_KEY = 'django-insecure-local-dev-only-key'
    else:
        raise ImproperlyConfigured('正式環境必須設定 SECRET_KEY 環境變數')

# 允許的主機：環境變數 ALLOWED_HOSTS（逗號分隔）＋ Render 自動提供的對外主機名稱
RENDER_EXTERNAL_HOSTNAME = os.getenv('RENDER_EXTERNAL_HOSTNAME', '').strip()
ALLOWED_HOSTS = [h for h in _env_list('ALLOWED_HOSTS') if h != '*']
if RENDER_EXTERNAL_HOSTNAME and RENDER_EXTERNAL_HOSTNAME not in ALLOWED_HOSTS:
    ALLOWED_HOSTS.append(RENDER_EXTERNAL_HOSTNAME)
if DEBUG:
    ALLOWED_HOSTS += ['localhost', '127.0.0.1', '[::1]']
elif not ALLOWED_HOSTS:
    ALLOWED_HOSTS = ['wdaweb.onrender.com']

INSTALLED_APPS = [
    'unfold',
    'unfold.contrib.filters',
    'unfold.contrib.forms',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'cloudinary_storage',
    'cloudinary',
    'corsheaders',
    'apps.cms',
    'apps.api',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.locale.LocaleMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'core.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'core.wsgi.application'

# Database: 優先使用 Render DATABASE_URL (PostgreSQL)，若無則使用 SQLite
DATABASE_URL = os.getenv('DATABASE_URL')
if DATABASE_URL:
    DATABASES = {
        'default': dj_database_url.config(default=DATABASE_URL, conn_max_age=600)
    }
elif not DEBUG and os.getenv('ALLOW_SQLITE_IN_PRODUCTION', 'False') != 'True':
    # Render 的磁碟為暫存性質，正式環境靜默退回 SQLite 會在重啟後遺失全部資料
    raise ImproperlyConfigured('正式環境必須設定 DATABASE_URL 環境變數（PostgreSQL）')
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

LANGUAGE_CODE = 'zh-hant'
TIME_ZONE = 'Asia/Taipei'
USE_I18N = True
USE_TZ = True

STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_DIRS = [BASE_DIR / 'static']

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# 媒體檔案儲存架構 (智慧雙軌設計：自動偵測 Cloudinary 雲端圖床環境變數)
import urllib.parse

def _clean_env_val(val: str | None) -> str:
    if not val:
        return ""
    val = str(val).strip()
    if (val.startswith('"') and val.endswith('"')) or (val.startswith("'") and val.endswith("'")):
        val = val[1:-1].strip()
    return val

# 支援兩種 Cloudinary 設定模式：
# 模式 A：直接貼上 Cloudinary Dashboard 官方提供的 CLOUDINARY_URL (cloudinary://<api_key>:<api_secret>@<cloud_name>)
# 模式 B：分開填寫 CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
_raw_c_url = _clean_env_val(os.getenv('CLOUDINARY_URL'))
CLOUDINARY_CLOUD_NAME = _clean_env_val(os.getenv('CLOUDINARY_CLOUD_NAME'))
CLOUDINARY_API_KEY = _clean_env_val(os.getenv('CLOUDINARY_API_KEY'))
CLOUDINARY_API_SECRET = _clean_env_val(os.getenv('CLOUDINARY_API_SECRET'))

if _raw_c_url:
    try:
        _parsed_c_url = urllib.parse.urlparse(_raw_c_url)
        if _parsed_c_url.scheme == 'cloudinary':
            CLOUDINARY_CLOUD_NAME = CLOUDINARY_CLOUD_NAME or _parsed_c_url.hostname or ''
            CLOUDINARY_API_KEY = CLOUDINARY_API_KEY or _parsed_c_url.username or ''
            CLOUDINARY_API_SECRET = CLOUDINARY_API_SECRET or _parsed_c_url.password or ''
    except Exception:
        pass

IS_CLOUDINARY_CONFIGURED = bool(
    CLOUDINARY_CLOUD_NAME and CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET
)

# 始終配置 CLOUDINARY_STORAGE 字典，避免 django-cloudinary-storage 套件載入時拋出 ImproperlyConfigured
CLOUDINARY_STORAGE = {
    'CLOUD_NAME': CLOUDINARY_CLOUD_NAME or 'placeholder_cloud',
    'API_KEY': CLOUDINARY_API_KEY or '000000000000000',
    'API_SECRET': CLOUDINARY_API_SECRET or 'placeholder_secret',
}

# 靜態檔案儲存架構 (智慧雙軌設計：本地開發熱重載 vs 生產環境快取壓縮防禦)
# 本地開發模式 (DEBUG=True)：採用原生 StaticFilesStorage，支援即時讀取，徹底杜絕缺少 manifest 的 500 錯誤。
# 生產環境 (DEBUG=False)：採用寬鬆型 WhiteNoise Manifest 儲存，壓縮檔案並開啟 manifest_strict=False 容錯防護。
if DEBUG:
    STATICFILES_STORAGE_BACKEND = "django.contrib.staticfiles.storage.StaticFilesStorage"
else:
    STATICFILES_STORAGE_BACKEND = "apps.cms.storage.RobustCompressedManifestStaticFilesStorage"

WHITENOISE_MANIFEST_STRICT = False

if IS_CLOUDINARY_CONFIGURED:
    import cloudinary
    cloudinary.config(
        cloud_name=CLOUDINARY_CLOUD_NAME,
        api_key=CLOUDINARY_API_KEY,
        api_secret=CLOUDINARY_API_SECRET,
        secure=True,
    )
    DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'
    STORAGES = {
        "default": {
            "BACKEND": "cloudinary_storage.storage.MediaCloudinaryStorage",
        },
        "staticfiles": {
            "BACKEND": STATICFILES_STORAGE_BACKEND,
        },
    }
else:
    DEFAULT_FILE_STORAGE = 'django.core.files.storage.FileSystemStorage'
    STORAGES = {
        "default": {
            "BACKEND": "django.core.files.storage.FileSystemStorage",
        },
        "staticfiles": {
            "BACKEND": STATICFILES_STORAGE_BACKEND,
        },
    }

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# CORS & CSRF 配置 (支援 GitHub Pages 與 Render)
# 僅允許正式前台網域呼叫 API；可用環境變數 CORS_ALLOWED_ORIGINS（逗號分隔）追加
CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOW_CREDENTIALS = False
CORS_ALLOWED_ORIGINS = [
    'https://wdaweb.github.io',
    'https://powerkaifu.github.io',
] + _env_list('CORS_ALLOWED_ORIGINS')
if DEBUG:
    CORS_ALLOWED_ORIGINS += [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
    ]

# 反向代理與 HTTPS 安全配置 (Render 部署必備，防止 CSRF 與登入失效)
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

# CSRF 信任來源僅列出實際使用的完整網域（不使用萬用字元）
CSRF_TRUSTED_ORIGINS = ['https://wdaweb.onrender.com'] + _env_list('CSRF_TRUSTED_ORIGINS')
if RENDER_EXTERNAL_HOSTNAME:
    _render_origin = f'https://{RENDER_EXTERNAL_HOSTNAME}'
    if _render_origin not in CSRF_TRUSTED_ORIGINS:
        CSRF_TRUSTED_ORIGINS.append(_render_origin)
if DEBUG:
    CSRF_TRUSTED_ORIGINS += [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://localhost:8000',
        'http://127.0.0.1:8000',
    ]

# 正式環境 HTTPS 強化（Render 邊緣已強制 HTTP 轉 HTTPS，故不另設 SECURE_SSL_REDIRECT 以免影響內部健康檢查）
if not DEBUG:
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_HSTS_SECONDS = 31536000
    SECURE_CONTENT_TYPE_NOSNIFF = True
    SILENCED_SYSTEM_CHECKS = ['security.W008']

UNFOLD = {
    'SITE_TITLE': '泰山職訓－前端網頁技術與AI應用',
    'SITE_HEADER': '前端班 CMS 內容管理後台',
    'SITE_URL': '/',
    'SITE_ICON': lambda request: static('images/logo.png'),
    'SITE_LOGO': lambda request: static('images/logo.png'),
    'SITE_FAVICONS': [
        {
            'rel': 'icon',
            'sizes': '32x32',
            'type': 'image/png',
            'href': lambda request: static('images/logo.png'),
        },
    ],
    'SHOW_HISTORY': False,
    'SHOW_VIEW_ON_SITE': True,
    'COLORS': {
        'primary': {
            '50': '236 254 255',
            '100': '207 250 254',
            '200': '165 243 252',
            '300': '103 232 249',
            '400': '34 211 238',
            '500': '6 182 212',
            '600': '8 145 178',
            '700': '14 116 144',
            '800': '21 94 117',
            '900': '22 78 99',
            '950': '8 51 68',
        },
    },
    'SIDEBAR': {
        'show_search': False,
        'show_all_applications': False,
        'navigation': [
            {
                'title': '課程特色 (首頁管理)',
                'separator': False,
                'collapsible': False,
                'items': [
                    {
                        'title': '首頁輪播圖管理',
                        'icon': 'view_carousel',
                        'link': lambda request: reverse_lazy('admin:cms_carousel_changelist'),
                    },
                    {
                        'title': '核心技術卡片管理',
                        'icon': 'code',
                        'link': lambda request: reverse_lazy('admin:cms_techcard_changelist'),
                    },
                    {
                        'title': '教學設備設施管理',
                        'icon': 'devices',
                        'link': lambda request: reverse_lazy('admin:cms_facility_changelist'),
                    },
                ],
            },
            {
                'title': '學員專題成果',
                'separator': True,
                'collapsible': False,
                'items': [
                    {
                        'title': '學員作品集管理',
                        'icon': 'folder_special',
                        'link': lambda request: reverse_lazy('admin:cms_studentproject_changelist'),
                    },
                ],
            },
            {
                'title': '招生期別與報名',
                'separator': True,
                'collapsible': False,
                'items': [
                    {
                        'title': '招生期別 (🤖 爬蟲自動同步)',
                        'icon': 'event_available',
                        'link': lambda request: reverse_lazy('admin:cms_admissionbatch_changelist'),
                    },
                ],
            },
            {
                'title': 'Discord 線上諮詢',
                'separator': True,
                'collapsible': False,
                'items': [
                    {
                        'title': 'Discord 社群與全域宣傳設定',
                        'icon': 'forum',
                        'link': lambda request: reverse_lazy('admin:cms_sitesetting_changelist'),
                    },
                ],
            },
            {
                'title': '常見問題 FAQ',
                'separator': True,
                'collapsible': False,
                'items': [
                    {
                        'title': '常見問答 (FAQ) 管理',
                        'icon': 'quiz',
                        'link': lambda request: reverse_lazy('admin:cms_faq_changelist'),
                    },
                ],
            },
            {
                'title': '系統管理與權限',
                'separator': True,
                'collapsible': True,
                'items': [
                    {
                        'title': '管理員帳號',
                        'icon': 'admin_panel_settings',
                        'link': lambda request: reverse_lazy('admin:auth_user_changelist'),
                    },
                ],
            },
        ],
    },
}

# 全域日誌配置 (確保 Render 終端機與本地可完整輸出 500 錯誤之 Exception Traceback)
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '[{asctime}] {levelname} [{name}:{lineno}] {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
    'loggers': {
        'django.request': {
            'handlers': ['console'],
            'level': 'ERROR',
            'propagate': False,
        },
        'apps': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': False,
        },
        'cloudinary': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': False,
        },
    },
}

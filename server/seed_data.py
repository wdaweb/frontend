import os
import sys
sys.stdout.reconfigure(encoding='utf-8')
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

from django.contrib.auth.models import User
from apps.cms.models import (
    Carousel, AdmissionBatch, CurriculumModule, TechCard,
    Facility, StudentProject, FAQ, SiteSetting
)
from datetime import date

print("=== 開始植入種子資料 ===")

# 1. 超級管理員帳號（密碼只能由環境變數提供，程式碼內不保留任何預設密碼）
#    - 帳號不存在：以 DJANGO_SUPERUSER_PASSWORD 建立
#    - 帳號已存在：預設不更動密碼，後台自行修改的密碼不會被部署覆蓋
#    - 需要強制重設時：額外設定 DJANGO_SUPERUSER_RESET_PASSWORD=True 部署一次，完成後請移除
admin_user = os.getenv("DJANGO_SUPERUSER_USERNAME", "admin")
admin_email = os.getenv("DJANGO_SUPERUSER_EMAIL", "admin@wdaweb.gov.tw")
admin_pass = os.getenv("DJANGO_SUPERUSER_PASSWORD", "")
force_reset = os.getenv("DJANGO_SUPERUSER_RESET_PASSWORD", "False") == "True"

existing_admin = User.objects.filter(username=admin_user).first()
if existing_admin is None:
    if admin_pass:
        User.objects.create_superuser(username=admin_user, email=admin_email, password=admin_pass)
        print(f"[OK] 管理員帳號建立成功：{admin_user}")
    else:
        print("[SKIP] 未設定 DJANGO_SUPERUSER_PASSWORD，略過建立管理員帳號（可改用 python manage.py createsuperuser）")
elif force_reset and admin_pass:
    existing_admin.set_password(admin_pass)
    existing_admin.is_staff = True
    existing_admin.is_superuser = True
    existing_admin.is_active = True
    existing_admin.save()
    print(f"[OK] 已依 DJANGO_SUPERUSER_RESET_PASSWORD 重設管理員密碼：{admin_user}（完成後請移除該環境變數）")
else:
    print(f"[OK] 管理員帳號已存在，密碼維持不變：{admin_user}")

# 2. 全域站台設定 (確保 GA4 評估 ID 與全站預設對齊)
setting, _ = SiteSetting.objects.get_or_create(
    id=1,
    defaults={
        "site_title": "泰山職訓－前端網頁技術與AI應用",
        "seo_description": "勞動部勞動力發展署北基宜花金馬分署－泰山職業訓練場「前端網頁技術與AI應用」專班。920 小時紮實養成、待業者享 100% 全額免費培訓與每月職訓生活津貼補助，一人配置獨立雙螢幕電腦，輔導專題實作與轉職就業。官方諮詢專線：(02) 2901-8274。",
        "seo_keywords": "泰山職訓, 前端網頁技術與AI應用, 泰山職業訓練場, 勞動部職訓, 前端工程師培訓, 網頁設計課程, 免費職訓課程, 職訓生活津貼, 待業者全額免費, Vue3課程, TypeScript職訓, AI網頁開發, 轉職前端工程師, 青年職訓補助, 台灣就業通, 北分署職訓",
        "announcement_bar_enabled": True,
        "announcement_text": "🔥 第 1 期熱烈招生中！待業民眾享全額免費受訓與生活津貼補助！",
        "announcement_link": "#batches",
        "contact_phone": "(02) 2901-8274",
        "contact_address": "新北市泰山區貴子里致遠新村 55 之 1 號",
        "footer_copyright": "本網站為前端班師資自主推廣與學員成果展示網頁",
        "ga4_measurement_id": "G-BYR7TFXX2P"
    }
)
if setting.ga4_measurement_id != "G-BYR7TFXX2P":
    setting.ga4_measurement_id = "G-BYR7TFXX2P"
    setting.save()
print(f"[OK] 站台全域設定已對齊 (GA4: {setting.ga4_measurement_id})")

# 3. 首頁輪播圖 (僅在完全無輪播圖時建立預設 3 筆)
if not Carousel.objects.exists():
    carousels_data = [
        (1, "從零開始的前端工程師養成", "政府自辦 920 小時職業訓練｜符合資格者免費參訓｜就業輔導｜生活津貼", "泰山職訓前端網頁技術與AI應用班主視覺", "立即線上報名", "#batches", 1),
        (2, "現代前端框架與 AI 協同開發", "一人兩機雙螢幕教學設備 ｜ 打造 AI 應用的優秀作品集 ｜ 跨領域轉職最佳起點", "泰山職訓雙螢幕教室實境", "立即線上報名", "#batches", 2),
        (3, "打造專屬的個人全端作品集", "獨立完成全端架構 ｜ 實踐 AI 工具輔助開發 ｜ 累積求職競爭力的實戰作品集", "泰山職訓跨領域轉職前端網頁成果", "立即線上報名", "#batches", 3),
    ]
    for cid, title, sub, alt, cta, link, order in carousels_data:
        Carousel.objects.create(
            id=cid,
            title=title,
            subtitle=sub,
            image_alt=alt,
            cta_text=cta,
            cta_link=link,
            cta_target="_self",
            sort_order=order,
            is_active=True
        )
    print("[OK] 首頁 3 筆黃金輪播圖建立完成")
else:
    print("[INFO] 首頁輪播圖已存在，保留既有設定")

# 4. 招生期別 (僅在完全無期別時建立預設官方數據)
if not AdmissionBatch.objects.exists():
    AdmissionBatch.objects.create(
        course_code="167125",
        batch_name="前端網頁技術與AI應用（第 1 期）",
        total_hours=920,
        enroll_start_date=date(2026, 11, 16),
        enroll_end_date=date(2027, 2, 16),
        screening_date=date(2027, 2, 25),
        training_start_date=date(2027, 4, 1),
        training_end_date=date(2027, 9, 20),
        planned_trainees=24,
        applicants_count=0,
        apply_url="https://its.taiwanjobs.gov.tw/Course/Detail?ID=167125",
        status_override="auto",
        sort_order=1
    )
    AdmissionBatch.objects.create(
        course_code="159269",
        batch_name="前端網頁技術與AI應用（第 2 期）",
        total_hours=920,
        enroll_start_date=date(2026, 5, 7),
        enroll_end_date=date(2026, 8, 21),
        screening_date=date(2026, 9, 3),
        training_start_date=date(2026, 9, 23),
        training_end_date=date(2027, 3, 24),
        planned_trainees=24,
        applicants_count=38,
        apply_url="https://its.taiwanjobs.gov.tw/Course/Detail?ID=159269",
        status_override="auto",
        sort_order=2
    )
    print("[OK] 招生期別官方預設資料建立完成")
else:
    # 確保歷史第 1 期 (159268) 於前台保持隱藏
    b1 = AdmissionBatch.objects.filter(course_code="159268").first()
    if b1 and b1.status_override not in ("ended", "hidden"):
        b1.status_override = "hidden"
        b1.save(update_fields=["status_override"])
    print("[INFO] 招生期別已存在，既有設定已保留")

# 5. 7 大課程模組 (僅在完全無模組時建立預設值)
if not CurriculumModule.objects.exists():
    modules = [
        ("M1", "一般與共同課程", 53, "基礎與設計", "就業市場分析、勞動法規與權益、性別主流化與職場倫理、職涯資源與求職準備。"),
        ("M2", "網頁排版編輯", 160, "基礎與設計", "HTML5 語意化結構、CSS3 現代排版佈局、Bootstrap 響應式框架、RWD 跨裝置自適應設計、VS Code 開發環境配置。"),
        ("M3", "視覺影像設計", 120, "基礎與設計", "Adobe Photoshop 數位影像編修、網頁版面視覺規劃與調色修圖、Adobe Illustrator 貝茲曲線繪圖、向量圖標與 Web Icon 製作。"),
        ("M4", "數位媒體應用", 107, "基礎與設計", "視覺傳達設計基礎、UI/UX 介面設計與使用者體驗流程、原型設計工具應用、企業參訪與業界職場體驗。"),
        ("M5", "網頁動態技術", 240, "前端核心與框架", "JavaScript 核心語法與 ES6+、DOM 原生操作與前端動態互動、RESTful API 非同步資料串接、Git 版本控制與 GitHub 協同開發、Vue.js 漸進式框架與 Pinia 狀態管理。"),
        ("M6", "資料庫程式設計", 80, "後端與資料庫", "NoSQL 資料庫概念與操作、MongoDB 資料管理與塑模、Node.js 執行環境、NPM 套件管理與基礎後端 API 整合測試。"),
        ("M7", "網頁設計實務", 160, "專案實務與作品", "前端專案專題製作、前後端 API 整合實務、GitHub Pages 雲端部署發布、成果簡報發表與作品集指導。")
    ]
    for idx, (num, name, hrs, cat, desc) in enumerate(modules, 1):
        CurriculumModule.objects.create(
            module_number=num,
            module_name=name,
            hours=hrs,
            category_tab=cat,
            description=desc,
            sort_order=idx
        )
    print("[OK] 7 大課程模組建立完成")
else:
    print("[INFO] 課程模組已存在，保留既有設定")

# 6. 技術單元卡片
if not TechCard.objects.exists():
    techs = [
        ("基礎與排版", "HTML5 & CSS3", "現代網頁語意標籤與進階排版"),
        ("基礎與排版", "Bootstrap & Tailwind", "現代前端 UI 框架、快速建立高質感響應式 (RWD) 介面"),
        ("視覺與設計", "Adobe Photoshop & AI", "影像處理修圖、Icon 圖示設計與 UI/UX 視覺傳達流程"),
        ("核心動態技術", "JavaScript (ES6+)", "原生 DOM 操作、非同步 Promise / Async-Await 與現代語法"),
        ("核心動態技術", "Vue.js 3 & Pinia", "組件化架構、Composition API、Vue Router 路由與狀態管理"),
        ("核心動態技術", "RESTful API & Axios", "前後端分離資料串接、JSON 處理與非同步請求處理"),
        ("環境與資料管理", "Node.js & MongoDB", "Node.js 執行環境、NoSQL 資料庫設計與基礎 API 開發"),
        ("協同開發", "Git & GitHub", "版本控制、分支管理、團隊協同開發與 GitHub Pages 部署")
    ]
    for idx, (cat, name, desc) in enumerate(techs, 1):
        TechCard.objects.create(
            category_tab=cat,
            tech_name=name,
            image_alt=f"{name} 技術圖標",
            description=desc,
            sort_order=idx
        )
    print("[OK] 核心技術卡片建立完成")

# 7. 教學設施 (僅在完全無設施時建立預設值)
if not Facility.objects.exists():
    Facility.objects.create(
        sort_order=1,
        facility_name="寬敞明亮專屬實作空間",
        subtitle="雙螢幕教學設備",
        description="專屬獨立座位，一人配置雙螢幕電腦，可邊看講師示範邊同步動手實作。",
        image="facilities/learning_ijciKln_09KM7k0_ddXbwFz.webp",
        image_alt="寬敞明亮專屬實作空間、雙螢幕教學設備",
        is_active=True,
    )
    Facility.objects.create(
        sort_order=2,
        facility_name="整潔舒適專屬用餐空間",
        subtitle="完善生活休憩設施",
        description="寬敞木質長桌搭配舒適空調，現場備有冷藏冰箱與多功能收納書櫃。",
        image="facilities/lunch_g71Ci6n_NsJ8XsZ_mJ12g5T.webp",
        image_alt="整潔舒適專屬用餐空間、完善生活休憩設施",
        is_active=True,
    )
    print("[OK] 教學環境設施建立完成")
else:
    print("[INFO] 教學環境設施已存在，保留既有設定")

# 8. 14 組前後端分離＋資料庫學員專案作品
if not StudentProject.objects.exists():
    projects = [
        ("蔡昀容", "夢百貨", "https://blackcat0708.github.io/DreamDepartmentStore-front/#/", True),
        ("董元琪", "Matching TRPG", "https://chichitung.github.io/MatchingTRPG-front/#/", True),
        ("仲崇安", "Voice Land", "https://josh19961201.github.io/VoiceLand_front/#/", True),
        ("楊詠茜", "桌下吧", "https://cloris222.github.io/quasar-project/#/", True),
        ("黃姿瑄", "團購趣", "https://a733181.github.io/2022-buytogether/#/", False),
        ("許凱炫", "一個地方", "https://qweasd333ee.github.io/a-place-bar-front/", False),
        ("徐嘉伶", "AZ.ZERO", "https://lisia229.github.io/AZFront/#/", False),
        ("郭思緯", "Show Time", "https://kkone0275.github.io/top-free-time-front/#/", False),
        ("王政文", "Ocean", "https://nailshort.github.io/Ocean-front/#/", False),
        ("胡俊宇", "揪遊 (JoYo)", "https://lilmax922.github.io/JoYo-Front/#/", False),
        ("張雅涵", "Sunday", "https://vvn719.github.io/SUNDAY-vue-project/#/", False),
        ("黃佳琦", "綠善生活農場", "https://gagiherdesign.github.io/susi-front/#/", False),
        ("蔡文瑜", "BCoffee", "https://pato830729.github.io/BCcoffee-front/#/", False),
        ("蘇俞甄", "MAUNA COFFEE", "https://a5a5aa.github.io/TSFP-front/#/", False),
    ]
    for idx, (name, title, demo, feat) in enumerate(projects, 1):
        StudentProject.objects.create(
            student_name=name,
            batch_tag="前端專班結訓成果",
            project_name=title,
            image_alt=f"{name} 專案作品 - {title}",
            demo_url=demo,
            is_featured=feat,
            sort_order=idx
        )
    print("[OK] 14 組前後端分離＋資料庫學員專題作品建立完成")

# 9. FAQ 常見問答
if not FAQ.objects.exists():
    faqs = [
        ("參訓資格", "完全沒有寫過程式或設計背景適合報名嗎？", "非常適合！本專班專為零基礎及跨領域轉職者量身打造，只要您對程式設計與 AI 應用抱持濃厚興趣即可報名。課程從最基礎的 HTML/CSS 排版與視覺設計教起，循序漸進至 JavaScript 與 Vue 3 動態框架，並深度結合生成式 AI 輔助開發，全力培養能靈活運用 AI 賦能的跨領域現代網頁設計與前端實戰人才！"),
        ("參訓費用", "參加本訓練需要負擔學費或材料費嗎？", "待業者完全免費！本課程為勞動部自辦職前訓練，政府全額補助學費與材料費。"),
        ("生活津貼", "受訓期間可以申請職業訓練生活津貼嗎？申請流程為何？", "符合特定對象資格（如非自願離職者、中高齡待業者、身心障礙者、原住民、低收入戶等），受訓期間每月可申請基本工資 60% 之職業訓練生活津貼，最高補助 6 個月。\n\n⚠️ 特別提醒（非自願離職者請注意）：欲請領職訓生活津貼之非自願離職勞工，請務必於報名截止日前，先親自前往各地公立就業服務機構（就服站）辦理求職登記並開立「職業訓練推介單」，再行完成報名程序，以確保津貼請領權益！"),
        ("甄試流程", "完全沒有程式底子，甄試（筆試與口試）該怎麼準備？", "本班錄取採公開甄試作業（筆試 50%、口試 50%）：\n\n1. 筆試內容（50%）：以「基礎電腦常識與基本邏輯推理測驗」為主（選擇題），絕對不會考複雜的程式碼撰寫！即使是零基礎的朋友，具備一般電腦基本操作概念即可正常應考。\n2. 口試評分（50%）：著重於評估您的「參訓動機、全勤學習決心、人際溝通態度與結訓後轉職規劃」，而非您現在具備多少技術。只要展現對新技能的學習熱忱與轉職決心，零基礎一樣具備極高的錄取優勢！"),
        ("出勤規範", "受訓期間可以請假或兼職打工嗎？", "本專班為全日制（週一至週五 08:10 ~ 16:35）密集實體培訓：\n\n1. 出勤紀律：勞動部對公費職訓專班有嚴格出勤規定，曠課或事病假累積達法定時數上限（約總時數 10%）將依法退訓，請務必確認半年期間能全心投入。\n2. 兼職打工：具待業身分參訓者，受訓期間原則上不得具有勞工保險（勞保）加保紀錄，以免喪失政府全額學費補助資格與生活津貼請領權益。"),
        ("設備環境", "上課需要自己準備筆記型電腦嗎？", "完全不需要！\n\n1. 課堂設備：教室內已為每位學員配置專屬獨立工位，一人一套高效能電腦主機搭配「專屬雙螢幕」，在訓期間更提供每月 Claude AI 輔助開發資源，上方看講師示範、下方同步與 AI 協作敲代碼實作。\n2. 課後複習：若課後想在家自主練習或做專案，只要家中有一般可正常上網的個人電腦或文書筆電即可，無需額外添購昂貴的高階電競設備。"),
        ("上課時間", "上課時間與地點為何？", "週一至週五 08:10 ~ 16:35（全日制培訓），上課地點於勞動部泰山職業訓練場（新北市泰山區致遠新村 55 之 1 號）。"),
        ("就業輔導", "結訓前會提供履歷健檢與作品集指導嗎？", "會的！課程最後階段會由專業師資個別提供一對一履歷健檢、作品集面試優化指導，並舉辦專題成果發表會，協助學員以具備競爭力的完整作品集底氣十足接軌就業市場。（目前未提供廠商媒合資訊）"),
        ("住宿申請", "外縣市或遠道學員有提供宿舍住宿嗎？申請資格與費用為何？", "有提供！泰山職業訓練場備有學員宿舍，提供符合條件之遠道待業學員申請：\n\n1. 申請資格：以戶籍地距離訓練場較遠（通常為 30 公里以上）之外縣市遠道學員優先，因床位有限需依規定名額審查分配。\n2. 費用規定：免收房間住宿費（免房費），僅需自付基本耗能費（如冷氣費依規定計收）及繳交住宿保證金（結訓無損點交後無息退還）。\n3. 宿舍環境：多為 4 人團體寢室，需自備個人盥洗用品與寢具，並遵守場區宿舍生活管理要點。\n\n※ 實際申請流程與床位分配，請一律以錄取報到通知單及訓練場最新公告為準。\n泰山職訓場洽詢電話：(02) 2901-8274")
    ]
    for idx, (cat, q, a) in enumerate(faqs, 1):
        FAQ.objects.create(
            category=cat,
            question=q,
            answer=a,
            sort_order=idx
        )
    print("[OK] 常見問答 (FAQ 9 題) 資料建立完成")

print("=== 所有種子資料植入成功 ===")

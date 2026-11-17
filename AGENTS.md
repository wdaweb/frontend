# 泰山職訓「前端網頁技術與AI應用」招生系統 全專案 AI 代理人核心準則

> activation: always_on
> scope: 全專案（client/ 與 server/ 均繼承本規則）

---

## 1. 系統核心定位（不可偏離）

本系統為**純招生推廣宣傳展示網站**，核心功能是：

1. 展示「前端網頁技術與AI應用」課程內容與學員成果。
2. 將訪客導引至官方「台灣就業通」平台完成報名。
3. **不收集、不留存任何民眾個人資料**（無留單表單）。

---

## 2. 官方核心資料（禁止自行修改，需向使用者確認）

| 資料項目                 | 值                                                    |
| :----------------------- | :---------------------------------------------------- |
| 116 年第 1 期課程代碼    | 167125                                                |
| 116 年第 1 期報名連結    | https://its.taiwanjobs.gov.tw/Course/Detail?ID=167125 |
| 115 年第 2 期課程代碼    | 159269                                                |
| 115 年第 2 期報名連結    | https://its.taiwanjobs.gov.tw/Course/Detail?ID=159269 |
| 歷史第 1 期（已結訓隱藏）| 159268                                                |
| 招生諮詢專線    | (02) 2901-8274                                        |
| Discord         | https://discord.gg/TrerFKG                            |
| 訓練場地址      | 新北市泰山區貴子里致遠新村 55 之 1 號                 |
| 總訓練時數      | 920 小時                                              |
| 後台管理帳號    | 預設 admin（密碼由環境變數或後台安全設定）            |

---

## 3. 技術棧快速索引

| 層級     | 技術棧                                                  |
| :------- | :------------------------------------------------------ |
| 前台     | Vue 3 + Vite + TypeScript + Pinia + Tailwind CSS        |
| 後端     | Python 3.12 + Django 6.1 + Django Ninja + Django Unfold |
| 資料庫   | SQLite（本地）/ Render PostgreSQL（生產）               |
| 前台部署 | GitHub Pages + GitHub Actions CI/CD                     |
| 後端部署 | Render Web Service（Gunicorn + WhiteNoise）             |

---

## 4. 語言與溝通規範

- 對話語言：一律使用繁體中文（zh-TW）。
- 程式碼命名：變數、函式、類別一律使用英文（camelCase / PascalCase）。
- 程式碼註解：一律使用繁體中文。
- Git Commit 訊息：一律使用繁體中文。
- 禁止自動執行 git push，Commit 後由使用者手動推送。

---

## 5. 修改前的影響範圍分析（強制執行）

修改任何核心模組前，必須使用 grep_search 掃描全專案確認所有依賴端：

- 修改 client/src/types/index.ts 時，需同步更新 api/client.ts 與所有使用該型別的組件
- 修改 server/apps/cms/models.py 時，需同步更新 schemas.py、routers.py、admin.py 與 seed_data.py
- 修改 API 路由路徑時，需同步更新前台 api/client.ts 對應的請求方法

---

## 6. Multi-Agents 角色索引

| 角色名稱             | 負責範疇                                       |
| :------------------- | :--------------------------------------------- |
| frontend-architect   | Vue 3 整體組件架構、Pinia Store 設計           |
| ui-component-builder | 建立 Tailwind + shadcn-vue 規範的 Section 組件 |
| a11y-guardian        | WCAG 2.1 AA 無障礙全站稽核與修復               |
| backend-architect    | Django Model/API 架構設計與 Migration 管理     |
| cms-content-manager  | CMS Model 欄位維護、Admin 設定、種子資料       |
| deploy-ops           | GitHub Pages + Render 雲端部署診斷             |

---

## 7. 後台 CMS 動態連動與資料治理規範（強制遵循）

- **單一真實來源（Single Source of Truth）**：
  所有前台展示之動態資訊（期別、時數、課綱、成果作品、問答、輪播、電話、地址、社群連結）必須以 Django CMS 模型為唯一真實資料來源，**嚴格禁止在 Vue 組件中硬編碼**。
- **異動 8 步驟完整鏈路 SOP**：
  `Model (models.py)` ➔ `Migration` ➔ `Admin (admin.py)` ➔ `Schema (schemas.py)` ➔ `Router (routers.py)` ➔ `Types (index.ts)` ➔ `Store (useCmsStore.ts)` ➔ `View (Section.vue)`
- **前台防禦性 Fallback 設計**：
  前台所有動態資料欄位均需配置合理 Fallback 與 LocalStorage 離線快取，確保 Render 冷啟動時 0.01 秒秒開且 100% 容錯不破版。

---

## 8. 全域文字字級大小設定守則（最高強制力）

- **單一真實字級來源（Single Source of Scale）**：
  全站所有文字大小必須嚴格綁定 `client/src/style.css` 中定義的 `:root` 原生變數系統（`--font-size-xs` 至 `--font-size-6xl`）。
- **嚴禁任意極小硬編碼字級**：
  **嚴格禁止**在任何組件中撰寫 `text-[10px]`、`text-[11px]` 或任何小於 `12px` 的隨意硬編碼字級。
- **全站標準字級對照階梯**：
  - `text-xs`（12px / 0.75rem）：全站最小字級底線，僅用於輔助標籤、狀態徽章（Badge）、微小提示。
  - `text-sm`（14px / 0.875rem）：次要內文、卡片說明描述、次要按鈕。
  - `text-base`（16px / 1rem）：標準正文、一般段落、主要內文。
  - `text-lg`（18px / 1.125rem）~ `text-xl`（20px / 1.25rem）：卡片標題、強調按鈕。
  - `text-2xl`（24px / 1.5rem）~ `text-3xl`（30px / 1.875rem）：模組小標題 H3、區塊大標題 H2。
  - `text-4xl`（36px）~ `text-6xl`（60px）：主要頁面標題與 Hero 巨幅標題。
- **調整字級之標準途徑**：若需全站等比調整某層級文字大小，必須修改 `client/src/style.css` 中的變數，禁止在個別組件中自行微調縮小。

---

## 9. 中高齡與老花眼友善閱讀底線（Accessibility & Legibility）

- **正文大字基準**：全站所有重要內文、卡片說明、反思文字與收穫標籤**一律維持 `text-base`（16px）或以上**，嚴禁任意縮小至 14px 以下。
- **行高寬闊舒緩**：全域 `body` 行高維持 `1.7`，段落 `p` 行高維持 `1.8`，行距寬闊舒展，徹底消除 45 歲以上長輩與老花眼讀者閱讀長文的視覺疲勞。

---

## 10. 全站中西文字型分流系統（Font Pairing & Glyph Fallback）

- **繁體中文（全站文字）**：一律由 Google Fonts **思源黑體（`Noto Sans TC` / `Source Han Sans TC`）**渲染，筆畫剛健端正、大器清晰。
- **英文字母與阿拉伯數字**：一律優先由 Google Fonts **`Plus Jakarta Sans`** 渲染，呈現現代前端科技感與 AI 未來感；數字飽滿圓潤。
- **程式碼與等寬序號水印**：一律由 **`JetBrains Mono`** 渲染，彰顯軟體工程專業感。
- **CSS 字符分流堆疊**：`--font-sans: 'Plus Jakarta Sans', 'Noto Sans TC', 'Source Han Sans TC', 'PingFang TC', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Microsoft JhengHei', sans-serif;`

---

## 11. 大器單行標題、網格寬敞度與 Hero 輪播頂部定錨防抖動

- **大器單行標題原則**：全站區塊大標題（14~20字）在桌機寬螢幕上一律以「大器單行」呈現，**嚴格禁止隨意加入 `<br class="hidden sm:inline" />` 或將標題強行拆切成兩行**。
- **4 欄網格防窄防碎**：多卡片網格（如起點軌道、核心技術、實體價值）必須推遲至 **`xl:grid-cols-4`**（1280px+）啟用，在 1024px~1279px 筆電螢幕維持 2 欄寬版佈局；卡片 Padding 精簡為 `p-5 sm:p-6`；內文字數嚴格精煉至 40~50 字黃金 2~3 行，杜絕垂直窄條折返閱讀。
- **Hero 輪播頂部定錨防抖動**：輪播文字容器必須採用「頂部座標定錨（`absolute inset-x-0 top-0`）與響應式固定安全高度階梯（`h-[260px] sm:h-[220px] lg:h-[200px] xl:h-[185px]`）」，**嚴禁使用 `justify-center`**，確保標題首行位置 100% 絕對靜止，下方按鈕與指標絕不上下抽動。

/**
 * 打包後處理（npm run build 最後一步）
 *
 * 1. 為每個分頁產生 dist/<route>/index.html：
 *    GitHub Pages 遇到 /frontend/admission/ 會直接回傳這份檔案（HTTP 200），
 *    搜尋引擎因此能個別收錄各分頁，不再被 404.html 擋下。
 *    每份檔案各自帶有正確的 <title>、description、canonical 與 og:url。
 * 2. 依實際部署路徑設定 404.html 的轉址層數。
 * 3. 以當天日期重新產生 sitemap.xml。
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DIST = path.join(ROOT, 'dist')
const VIEWS = path.join(ROOT, 'src', 'views')

// 正式網址（canonical 與 sitemap 一律指向這裡，與 src/composables/useSeoMeta.ts 一致）
const SITE_URL = 'https://wdaweb.github.io/frontend'
const SITE_NAME = '泰山職訓「前端網頁技術與AI應用」專班'

// 需要獨立網址的分頁（路徑需與 src/router/index.ts 一致）
const ROUTES = [
  { path: 'admission', view: 'AdmissionView.vue', sitemap: { changefreq: 'daily', priority: '0.9' }, keepFaqJsonLd: false },
  { path: 'showcase', view: 'ShowcaseView.vue', sitemap: { changefreq: 'weekly', priority: '0.8' }, keepFaqJsonLd: false },
  { path: 'faq', view: 'FaqView.vue', sitemap: { changefreq: 'weekly', priority: '0.8' }, keepFaqJsonLd: true },
  { path: 'community', view: 'CommunityView.vue', sitemap: { changefreq: 'monthly', priority: '0.7' }, keepFaqJsonLd: false },
  // 實驗室頁面不列入 sitemap，且標示不索引
  { path: 'kaifu-lab', view: 'GlowLabView.vue', sitemap: null, keepFaqJsonLd: false, noindex: true },
]

function escapeHtml(text) {
  return text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

/** 從分頁元件的 useSeoMeta 設定中讀出 title 與 description（單引號字串） */
function readViewSeo(viewFile) {
  const source = fs.readFileSync(path.join(VIEWS, viewFile), 'utf8')
  const block = source.slice(source.indexOf('useSeoMeta('))
  const pick = (key) => {
    const m = block.match(new RegExp(`${key}:\\s*'((?:[^'\\\\]|\\\\.)*)'`))
    return m ? m[1].replace(/\\'/g, "'") : null
  }
  // description 若為動態組合，改讀元件內的靜態常數 SEO_DESCRIPTION
  const constMatch = source.match(/const SEO_DESCRIPTION\s*=\s*'((?:[^'\\]|\\.)*)'/)
  const staticDescription = constMatch ? constMatch[1].replace(/\\'/g, "'") : null
  return { title: pick('title'), description: pick('description') || staticDescription }
}

function replaceOrWarn(html, pattern, replacement, label, routePath) {
  if (!pattern.test(html)) {
    console.warn(`  ⚠️ ${routePath}：找不到 ${label}，略過`)
    return html
  }
  return html.replace(pattern, replacement)
}

function buildRouteHtml(baseHtml, route) {
  const { title, description } = readViewSeo(route.view)
  const url = `${SITE_URL}/${route.path}/`
  let html = baseHtml

  if (title) {
    const fullTitle = escapeHtml(title.includes('泰山職訓') ? title : `${title} ｜ ${SITE_NAME}`)
    html = replaceOrWarn(html, /<title>[\s\S]*?<\/title>/, `<title>${fullTitle}</title>`, '<title>', route.path)
    html = replaceOrWarn(html, /(<meta property="og:title" content=")[^"]*(")/, `$1${fullTitle}$2`, 'og:title', route.path)
    html = replaceOrWarn(html, /(<meta name="twitter:title" content=")[^"]*(")/, `$1${fullTitle}$2`, 'twitter:title', route.path)
  } else {
    console.warn(`  ⚠️ ${route.path}：${route.view} 未找到固定的 title，沿用首頁標題`)
  }

  if (description) {
    const desc = escapeHtml(description)
    html = replaceOrWarn(html, /(<meta name="description" content=")[^"]*(")/, `$1${desc}$2`, 'description', route.path)
    html = replaceOrWarn(html, /(<meta property="og:description" content=")[^"]*(")/, `$1${desc}$2`, 'og:description', route.path)
    html = replaceOrWarn(html, /(<meta name="twitter:description" content=")[^"]*(")/, `$1${desc}$2`, 'twitter:description', route.path)
  }

  html = replaceOrWarn(html, /(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`, 'canonical', route.path)
  html = replaceOrWarn(html, /(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`, 'og:url', route.path)

  if (route.noindex) {
    html = replaceOrWarn(html, /(<meta name="robots" content=")[^"]*(")/, '$1noindex, nofollow$2', 'robots', route.path)
  }

  if (!route.keepFaqJsonLd) {
    html = html.replace(/\s*<!-- FAQPage 結構化資料[^>]*-->\s*<script type="application\/ld\+json" id="static-faq-jsonld">[\s\S]*?<\/script>/, '')
  }
  return html
}

function main() {
  const indexPath = path.join(DIST, 'index.html')
  if (!fs.existsSync(indexPath)) {
    console.error('❌ 找不到 dist/index.html，請先執行 vite build')
    process.exit(1)
  }
  const baseHtml = fs.readFileSync(indexPath, 'utf8')

  // 1. 各分頁獨立 index.html
  for (const route of ROUTES) {
    const outDir = path.join(DIST, route.path)
    fs.mkdirSync(outDir, { recursive: true })
    fs.writeFileSync(path.join(outDir, 'index.html'), buildRouteHtml(baseHtml, route))
  }
  console.log(`✓ 已產生 ${ROUTES.length} 個分頁的獨立 index.html`)

  // 2. 404.html 轉址層數：依部署路徑（/frontend/ → 1 層，/ → 0 層）
  const notFoundPath = path.join(DIST, '404.html')
  if (fs.existsSync(notFoundPath)) {
    const basePath = (process.env.VITE_BASE_PATH || '/').trim()
    const segments = basePath.split('/').filter(Boolean).length
    const html = fs.readFileSync(notFoundPath, 'utf8').replace(/var pathSegmentsToKeep = \d+;/, `var pathSegmentsToKeep = ${segments};`)
    fs.writeFileSync(notFoundPath, html)
    console.log(`✓ 404.html 轉址層數設為 ${segments}（部署路徑 ${basePath}）`)
  }

  // 3. sitemap.xml（日期為打包當天）
  const today = new Date().toISOString().slice(0, 10)
  const entries = [
    { loc: `${SITE_URL}/`, changefreq: 'daily', priority: '1.0' },
    ...ROUTES.filter((r) => r.sitemap).map((r) => ({ loc: `${SITE_URL}/${r.path}/`, ...r.sitemap })),
  ]
  const sitemap = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries.map((e) => `  <url>\n    <loc>${e.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`),
    '</urlset>',
    '',
  ].join('\n')
  fs.writeFileSync(path.join(DIST, 'sitemap.xml'), sitemap)
  console.log(`✓ sitemap.xml 已更新（${entries.length} 個網址，日期 ${today}）`)
}

main()

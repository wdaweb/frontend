import { watchEffect, onUnmounted } from 'vue'

export interface SeoMetaOptions {
  title: string
  description?: string
  canonicalPath?: string
  robots?: string
  jsonLd?: Record<string, any> | Array<Record<string, any>>
}

const BASE_URL = 'https://wdaweb.github.io/frontend'
const SITE_NAME = '泰山職訓「前端網頁技術與AI應用」專班'

/**
 * 輕量純淨的 SEO 與結構化資料管理 Composable
 * 負責在各分頁動態維護 Title, Description, Canonical, OG 與 JSON-LD
 */
export function useSeoMeta(options: SeoMetaOptions | (() => SeoMetaOptions)) {
  const SCRIPT_ID = 'page-specific-jsonld'

  function updateMetaTag(name: string, content: string, isProperty = false) {
    const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`
    let el = document.querySelector(selector) as HTMLMetaElement | null
    if (!el) {
      el = document.createElement('meta')
      if (isProperty) {
        el.setAttribute('property', name)
      } else {
        el.setAttribute('name', name)
      }
      document.head.appendChild(el)
    }
    el.setAttribute('content', content)
  }

  function updateCanonical(url: string) {
    let el = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
    if (!el) {
      el = document.createElement('link')
      el.setAttribute('rel', 'canonical')
      document.head.appendChild(el)
    }
    el.setAttribute('href', url)
  }

  function updateJsonLd(schema: Record<string, any> | Array<Record<string, any>> | undefined) {
    let el = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null
    if (!schema) {
      if (el) el.remove()
      return
    }

    if (!el) {
      el = document.createElement('script')
      el.id = SCRIPT_ID
      el.type = 'application/ld+json'
      document.head.appendChild(el)
    }

    const payload = Array.isArray(schema)
      ? { '@context': 'https://schema.org', '@graph': schema }
      : { '@context': 'https://schema.org', ...schema }

    el.textContent = JSON.stringify(payload, null, 2)
  }

  watchEffect(() => {
    const opts = typeof options === 'function' ? options() : options

    // 1. Title
    const fullTitle = opts.title.includes('泰山職訓')
      ? opts.title
      : `${opts.title} ｜ ${SITE_NAME}`
    document.title = fullTitle

    // 2. Canonical & OG URL
    // 子頁網址一律以斜線結尾（GitHub Pages 會把 /admission 轉址到 /admission/）
    const rawPath = opts.canonicalPath || '/'
    const withLeading = rawPath.startsWith('/') ? rawPath : `/${rawPath}`
    const normalizedPath = withLeading.endsWith('/') ? withLeading : `${withLeading}/`
    const canonicalUrl = `${BASE_URL}${normalizedPath}`
    updateCanonical(canonicalUrl)
    updateMetaTag('og:url', canonicalUrl, true)

    // 3. Description
    if (opts.description) {
      updateMetaTag('description', opts.description)
      updateMetaTag('og:description', opts.description, true)
      updateMetaTag('twitter:description', opts.description)
    }

    // 4. OG Title
    updateMetaTag('og:title', fullTitle, true)
    updateMetaTag('twitter:title', fullTitle)

    // 5. Robots
    const robots = opts.robots || 'index, follow'
    updateMetaTag('robots', robots)

    // 6. JSON-LD
    updateJsonLd(opts.jsonLd)
  })

  onUnmounted(() => {
    const el = document.getElementById(SCRIPT_ID)
    if (el) {
      el.remove()
    }
  })
}

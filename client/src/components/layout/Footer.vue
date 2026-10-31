<template>
  <footer class="relative z-10 py-12 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 text-slate-300 text-base shadow-[0_-10px_25px_rgba(0,0,0,0.85),0_-35px_80px_rgba(2,6,23,0.95)] overflow-hidden">
    <!-- ========================================================================= -->
    <!-- 頁尾極光雷射一體化運動光艙 (100% 絕對物理鎖定同步 - 內部背光 + 1px 頂部光絲) -->
    <!-- ========================================================================= -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      <div
        class="absolute inset-y-0 w-[280px] sm:w-[380px] lg:w-[460px] pointer-events-none"
        :class="`footer-glow-${activeGlowPreset}`"
      >
        <!-- 1. 內部漫射背光穿透氣團 (滿版覆蓋 Footer 內部，z-0) -->
        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/15 via-blue-500/10 to-transparent blur-2xl pointer-events-none"></div>

        <!-- 2. 頂部 1px 邊框微光絲 (精準居中座落於運動艙正頂部，z-20) -->
        <div class="absolute top-0 inset-x-0 h-[4px] -translate-y-[2px] flex flex-col items-center pointer-events-none z-20">
          <!-- 緊湊 2px 微光暈 (居中寬度 80%) -->
          <div class="w-4/5 h-[3px] translate-y-[1px] bg-gradient-to-r from-transparent via-cyan-400/90 via-blue-400/70 to-transparent blur-[2px] rounded-full"></div>
          <!-- 1px 核心微光絲 (居中寬度 60%，雷射核心) -->
          <div class="w-3/5 h-[1px] translate-y-[2px] bg-gradient-to-r from-transparent via-cyan-100 via-cyan-300 to-transparent shadow-[0_0_8px_#22d3ee]"></div>
        </div>
      </div>
    </div>

    <div class="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 relative z-10 w-full">
      <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 lg:gap-8">
        <!-- 品牌與官方聯絡資訊區 (Logo 始終座落於標題左側，手機與桌機皆維持橫向對齊) -->
        <div class="flex flex-row items-start sm:items-center gap-3 sm:gap-4 w-full lg:w-auto">
          <img
            :src="store.settings?.site_logo_url || defaultLogo"
            :alt="store.settings?.site_title || '泰山職訓－前端網頁技術與AI應用班 Logo'"
            @error="handleLogoError"
            class="h-8 sm:h-10 w-auto max-w-[120px] sm:max-w-[150px] object-contain rounded flex-shrink-0 mt-0.5 sm:mt-0"
          />
          <div class="min-w-0 flex-1">
            <div class="font-extrabold text-white text-lg sm:text-xl tracking-tight leading-snug">
              <template v-if="brandParts.sub">
                <span class="inline-block">{{ brandParts.main }}－</span><span class="inline-block">{{ brandParts.sub }}</span>
              </template>
              <template v-else>
                {{ brandParts.main }}
              </template>
            </div>
            <div class="text-sm text-slate-300 mt-1.5 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 leading-relaxed">
              <span>地址：{{ store.settings?.contact_address || '新北市泰山區貴子里致遠新村 55 之 1 號' }}</span>
              <span class="hidden sm:inline text-slate-600" aria-hidden="true">｜</span>
              <span>電話：<a :href="`tel:${(store.settings?.contact_phone || '(02) 2901-8274').replace(/[^0-9]/g, '')}`" class="hover:text-cyan-400 transition-colors underline-offset-2">{{ store.settings?.contact_phone || '(02) 2901-8274' }}</a></span>
            </div>
          </div>
        </div>

        <!-- 頁尾快速導覽連結群 (手機版採整齊自適應網格，平板桌機採單行並排，大字好讀) -->
        <div class="grid grid-cols-2 xs:grid-cols-3 sm:flex sm:flex-wrap items-center gap-2.5 sm:gap-x-5 sm:gap-y-2 text-base font-medium text-slate-300 w-full lg:w-auto pt-2 lg:pt-0 border-t border-slate-800/60 lg:border-t-0">
          <router-link to="/" class="hover:text-cyan-400 transition-colors py-1.5 focus-visible:ring-2 focus-visible:ring-cyan-400 focus:outline-none rounded">課程特色</router-link>
          <span class="hidden sm:inline text-slate-600" aria-hidden="true">•</span>
          <router-link to="/showcase" class="hover:text-cyan-400 transition-colors py-1.5 focus-visible:ring-2 focus-visible:ring-cyan-400 focus:outline-none rounded">學員專題成果</router-link>
          <span class="hidden sm:inline text-slate-600" aria-hidden="true">•</span>
          <router-link to="/admission" class="hover:text-cyan-400 transition-colors py-1.5 focus-visible:ring-2 focus-visible:ring-cyan-400 focus:outline-none rounded">招生期別與報名</router-link>
          <span class="hidden sm:inline text-slate-600" aria-hidden="true">•</span>
          <router-link to="/community" class="hover:text-cyan-400 transition-colors py-1.5 focus-visible:ring-2 focus-visible:ring-cyan-400 focus:outline-none rounded">Discord 線上諮詢</router-link>
          <span class="hidden sm:inline text-slate-600" aria-hidden="true">•</span>
          <router-link to="/faq" class="hover:text-cyan-400 transition-colors py-1.5 focus-visible:ring-2 focus-visible:ring-cyan-400 focus:outline-none rounded">常見問題 FAQ</router-link>
        </div>
      </div>

      <!-- 底部免責聲明與版權宣告 (師資推廣宣傳免責說明，精簡好讀防壓迫) -->
      <div class="mt-8 pt-6 border-t border-slate-800/80 text-center space-y-1.5 text-xs text-slate-400">
        <p class="leading-relaxed max-w-3xl mx-auto">
          <span class="inline-block">本網站為前端班師資推廣宣傳網頁，非勞動部官方網站；</span>
          <span class="inline-block">招生資訊與各項規範皆以「台灣就業通」公告為準。</span>
        </p>
        <p class="text-slate-400 font-mono pt-0.5">
          © {{ currentYear }} 泰山職業訓練場 ｜ 前端網頁技術與AI應用班
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCmsStore } from '@/stores/useCmsStore'
import { useThemeStore } from '@/stores/useThemeStore'
import defaultLogo from '@/assets/logo.png'

const store = useCmsStore()
const themeStore = useThemeStore()
const currentYear = new Date().getFullYear()

// 防禦性讀取全站極光預設，保障 HMR 熱重載與初始載入 100% 穩定
const activeGlowPreset = computed(() => themeStore?.activeGlowPreset || 'cosmic')

// 智慧拆分主標題（支援手機版雙行點狀保護與字級放大）
const brandParts = computed(() => {
  const title = store.settings?.site_title || '泰山職訓－前端網頁技術與AI應用'
  const dashIndex = title.indexOf('－') !== -1 ? title.indexOf('－') : title.indexOf('-')
  if (dashIndex !== -1) {
    return {
      main: title.slice(0, dashIndex),
      sub: title.slice(dashIndex + 1),
    }
  }
  return {
    main: title,
    sub: '',
  }
})

// 雙重防禦：遠端 Logo 載入失敗時無縫降級回傳預設本地 Logo
function handleLogoError(e: Event) {
  const img = e.target as HTMLImageElement
  if (img && img.src !== defaultLogo) {
    img.src = defaultLogo
  }
}
</script>



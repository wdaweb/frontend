<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-white relative overflow-x-hidden w-full max-w-[100vw]">
    <!-- 無障礙跳至主要內容快速錨點 (WCAG 2.1 AA 核心指標) -->
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2.5 focus:bg-cyan-400 focus:text-slate-950 focus:font-bold focus:rounded-xl focus:shadow-2xl focus:ring-2 focus:ring-white focus:outline-none"
    >
      跳至主要內容區 (Skip to main content)
    </a>

    <!-- 0. 課程特色頁面（首頁）專屬動態背景 (依 GlowLabView 設定的動畫即時渲染，其他分頁不顯示) -->
    <GlobalDynamicBackground />

    <!-- 2. 右下角微型科技 HUD 滾動進度與 GSAP ScrollToPlugin 一鍵回頂 (測試頁隱藏) -->
    <div
      v-if="!isLabPage"
      id="global-scroll-top-hud"
      class="fixed bottom-6 right-6 z-50 flex items-center transition-all duration-300 select-none"
      :class="[
        isHudVisible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-4 pointer-events-none'
      ]"
    >
      <button
        type="button"
        @click.stop="handleScrollToTop"
        aria-label="回到頁面最頂端"
        class="px-3.5 py-2 rounded-2xl bg-slate-900/90 hover:bg-slate-850 border border-cyan-500/40 hover:border-cyan-400 text-cyan-400 shadow-2xl shadow-cyan-950/60 backdrop-blur-md flex items-center space-x-1.5 text-xs font-mono font-bold transition-all hover:scale-105 active:scale-95 group focus-visible:ring-2 focus-visible:ring-cyan-400 focus:outline-none cursor-pointer"
      >
        <span class="group-hover:-translate-y-0.5 transition-transform pointer-events-none select-none">⚡</span>
        <span class="text-white font-mono font-extrabold pointer-events-none select-none">{{ Math.round(scrollProgressPercent) }}%</span>
        <span class="text-cyan-400/70 group-hover:text-cyan-300 transition-colors pointer-events-none select-none">TOP ↑</span>
      </button>
    </div>

    <!-- 頂部導覽列 (測試頁隱藏) -->
    <Navbar />

    <main id="main-content" class="flex-grow relative z-10 bg-transparent" tabindex="-1">
      <router-view v-slot="{ Component, route }">
        <transition name="page" mode="out-in">
          <component :is="Component" :key="route.path" />
        </transition>
      </router-view>
    </main>

    <!-- 頁尾 (測試頁隱藏) -->
    <Footer v-if="!isLabPage" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { smoothScrollToTop } from '@/utils/motion'
import { useCmsStore } from '@/stores/useCmsStore'
import GlobalDynamicBackground from '@/components/common/GlobalDynamicBackground.vue'
import Navbar from '@/components/layout/Navbar.vue'
import Footer from '@/components/layout/Footer.vue'
import defaultFavicon from '@/assets/favicon.png'

const route = useRoute()
const router = useRouter()
const store = useCmsStore()
const scrollProgressPercent = ref(0)
const isHudVisible = ref(false)
const isLabPage = computed(() => route.name === 'kaifu-lab' || route.path === '/kaifu-lab' || route.path === '/glow-lab')

let rafId: number | null = null

// 高精度即時計算當前視圖之真實滾動百分比 (支援任意長度頁面與 SPA 路由切換)
function updateScrollProgress() {
  if (rafId !== null) return
  rafId = requestAnimationFrame(() => {
    rafId = null
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || 0
    const docHeight = document.documentElement.scrollHeight
    const winHeight = window.innerHeight || document.documentElement.clientHeight
    const maxScroll = docHeight - winHeight

    if (maxScroll > 10) {
      const progress = (scrollTop / maxScroll) * 100
      scrollProgressPercent.value = Math.min(100, Math.max(0, progress))
    } else {
      scrollProgressPercent.value = 0
    }

    // 滾動超過 80px 時平滑浮現 HUD，回頂時優雅隱藏
    isHudVisible.value = scrollTop > 80
  })
}

function handleScrollToTop() {
  // 透過 GSAP ScrollToPlugin 進行平滑慣性回頂 (0.8 秒悠揚曲線)
  smoothScrollToTop(0.8)
}

onMounted(() => {
  store.fetchAll()
  window.addEventListener('scroll', updateScrollProgress, { passive: true })
  window.addEventListener('resize', updateScrollProgress, { passive: true })
  nextTick(() => {
    updateScrollProgress()
  })
})

// 路由切換後重置滾動位置並重新精準計算新分頁長度
router.afterEach(() => {
  window.scrollTo(0, 0)
  scrollProgressPercent.value = 0
  isHudVisible.value = false
  nextTick(() => {
    setTimeout(() => {
      updateScrollProgress()
    }, 80)
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateScrollProgress)
  window.removeEventListener('resize', updateScrollProgress)
  if (rafId !== null) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
})

// 動態同步網站 Favicon (Title 則由各分頁 useSeoMeta 精準維護)
watchEffect(() => {
  const customFavicon = store.settings?.favicon_url
  // 若後端有獨立設定 favicon_url 且非空才動態套用；否則一律維持本地打包之官方 defaultFavicon，杜絕遠端 404 或格式衝突
  const iconUrl = customFavicon || defaultFavicon
  if (iconUrl) {
    let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']")
    if (!link) {
      link = document.createElement('link')
      link.rel = 'icon'
      document.head.appendChild(link)
    }
    // 依檔案後綴精準設定 MIME Type，避免瀏覽器解析衝突
    if (iconUrl.endsWith('.svg')) {
      link.type = 'image/svg+xml'
    } else if (iconUrl.endsWith('.png')) {
      link.type = 'image/png'
    } else if (iconUrl.endsWith('.webp')) {
      link.type = 'image/webp'
    } else {
      link.removeAttribute('type')
    }
    link.href = iconUrl
  }
})
</script>

<style scoped>
/* 頁面切換優雅淡入淡出動效 */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>

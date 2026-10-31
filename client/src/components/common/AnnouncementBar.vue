<template>
  <!-- 頂部最新快訊跑馬燈 (使用 translate-y 向下微移，100% 絕不推擠下方內容) -->
  <div
    v-if="showAnnouncementBar"
    class="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 w-full flex-shrink-0 translate-y-3 sm:translate-y-5 lg:translate-y-6"
  >
    <a
      v-if="isExternalUrl(store.settings?.announcement_link)"
      :href="store.settings.announcement_link"
      target="_blank"
      rel="noopener noreferrer"
      class="group flex items-center justify-between p-2.5 sm:p-3.5 rounded-2xl bg-gradient-to-r from-cyan-950/80 via-blue-950/80 to-slate-900/80 border border-cyan-500/30 hover:border-cyan-500/60 shadow-lg shadow-cyan-950/30 backdrop-blur-md transition-all"
    >
      <div class="flex items-center space-x-3 overflow-hidden">
        <span class="flex-shrink-0 px-2.5 py-1 text-xs sm:text-sm font-bold uppercase rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
          最新快訊
        </span>
        <span class="text-sm md:text-base font-medium text-slate-200 truncate group-hover:text-cyan-300 transition-colors">
          {{ dynamicAnnouncementText }}
        </span>
      </div>
      <span class="hidden sm:inline-flex items-center text-xs font-semibold text-cyan-400 group-hover:translate-x-1 transition-transform">
        查看詳情 →
        <span class="sr-only">（另開新分頁）</span>
      </span>
    </a>
    <router-link
      v-else
      :to="resolveLink(store.settings?.announcement_link || '/admission')"
      class="group flex items-center justify-between p-2.5 sm:p-3.5 rounded-2xl bg-gradient-to-r from-cyan-950/80 via-blue-950/80 to-slate-900/80 border border-cyan-500/30 hover:border-cyan-500/60 shadow-lg shadow-cyan-950/30 backdrop-blur-md transition-all"
    >
      <div class="flex items-center space-x-3 overflow-hidden">
        <span class="flex-shrink-0 px-2.5 py-1 text-xs sm:text-sm font-bold uppercase rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
          最新快訊
        </span>
        <span class="text-sm md:text-base font-medium text-slate-200 truncate group-hover:text-cyan-300 transition-colors">
          {{ dynamicAnnouncementText }}
        </span>
      </div>
      <span class="hidden sm:inline-flex items-center text-xs font-semibold text-cyan-400 group-hover:translate-x-1 transition-transform">
        查看詳情 →
      </span>
    </router-link>
  </div>
  <!-- 佔位符確保無快訊時保持上下空間平衡 -->
  <div v-else class="h-1 flex-shrink-0"></div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCmsStore } from '@/stores/useCmsStore'

const store = useCmsStore()

// 智慧快訊動態期別與顯隱邏輯：自動判斷當前開放第幾期 (每年 2 期)，無須硬編碼年度
const activeBatches = computed(() => {
  if (!store.batches || store.batches.length === 0) return []
  return store.batches.filter(b => {
    const status = b.status_override && b.status_override !== 'auto' ? b.status_override : b.dynamic_status
    return status === 'open' || status === 'closing_soon'
  })
})

const hasActiveAdmission = computed(() => {
  return activeBatches.value.length > 0
})

const dynamicAnnouncementText = computed(() => {
  const customText = store.settings?.announcement_text?.trim()
  const defaultAnnouncement = '🔥 115 年度第 1 期熱烈招生中！待業民眾享全額免費受訓與生活津貼補助！'
  // 若管理員在後台明確自訂快訊，100% 優先尊重管理員設定
  if (customText && customText !== defaultAnnouncement) {
    return customText
  }
  if (activeBatches.value.length > 0) {
    const batchLabels = activeBatches.value.map(b => {
      const match = b.batch_name.match(/第\s*\d+\s*期/)
      return match ? match[0] : b.batch_name
    })
    const batchSummary = batchLabels.join(' & ')
    return `🔥 ${batchSummary}熱烈招生中！待業民眾享全額免費受訓與生活津貼補助！`
  }
  return customText || '🔥 熱烈招生中！待業民眾享全額免費受訓與生活津貼補助！'
})

const showAnnouncementBar = computed(() => {
  if (!store.settings?.announcement_bar_enabled) return false
  return hasActiveAdmission.value
})

function isExternalUrl(url?: string): boolean {
  if (!url) return false
  return url.startsWith('http://') || url.startsWith('https://')
}

function resolveLink(link?: string): string {
  if (!link) return '/admission'
  if (link === '#batches' || link === 'batches') return '/admission'
  if (link === '#showcase' || link === 'showcase') return '/showcase'
  if (link === '#curriculum' || link === 'curriculum') return '/curriculum'
  if (link === '#community' || link === 'community') return '/community'
  if (link === '#faq' || link === 'faq') return '/faq'
  return link.startsWith('/') ? link : `/${link}`
}
</script>

<template>
  <!-- 即時報名狀態指示看板 (電腦版採 sm:w-fit 貼合內容寬度並確保說明單行不換行) -->
  <div class="mt-5 mx-auto w-full sm:w-fit sm:max-w-4xl px-2 sm:px-0">
    <div
      class="relative rounded-2xl p-4 sm:px-6 sm:py-4 border backdrop-blur-xl transition-all duration-300 overflow-hidden shadow-xl"
      :class="
        notice.isOpen
          ? 'bg-emerald-950/40 border-emerald-500/40 hover:border-emerald-400/70 shadow-emerald-950/50 cursor-pointer'
          : 'bg-slate-900/85 border-amber-500/30 shadow-slate-950/60'
      "
      :role="notice.isOpen ? 'button' : undefined"
      :tabindex="notice.isOpen ? 0 : undefined"
      :aria-label="notice.isOpen ? '捲動至下方招生期別卡片進行報名' : undefined"
      @click="scrollToCards"
      @keydown.enter.prevent="scrollToCards"
      @keydown.space.prevent="scrollToCards"
    >
      <!-- 頂部流光微線 -->
      <div
        class="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent"
        :class="notice.isOpen ? 'via-emerald-400/50 to-transparent' : 'via-amber-400/40 to-transparent'"
      ></div>

      <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 text-left">
        <!-- 狀態標籤 Pill Badge -->
        <div class="flex-shrink-0">
          <span
            class="inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-bold tracking-wide whitespace-nowrap"
            :class="
              notice.isOpen
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
            "
          >
            <span
              class="w-2 h-2 rounded-full mr-1.5"
              :class="notice.isOpen ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'"
            ></span>
            {{ notice.badgeText }}
          </span>
        </div>

        <!-- 核心標題與引導說明 -->
        <div class="flex-grow min-w-0">
          <div
            class="text-base sm:text-lg font-bold tracking-tight"
            :class="notice.isOpen ? 'text-white' : 'text-amber-200'"
          >
            {{ notice.headline }}
          </div>
          <p class="mt-1 text-sm sm:text-base text-slate-300 leading-relaxed md:whitespace-nowrap">
            {{ notice.subline }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { EnrollmentNotice } from '@/utils/batchStatus'

const props = defineProps<{
  notice: EnrollmentNotice
}>()

function scrollToCards() {
  if (!props.notice.isOpen || typeof document === 'undefined') return
  const target = document.getElementById('batches-cards-grid')
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
</script>

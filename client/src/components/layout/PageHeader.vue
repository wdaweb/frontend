<template>
  <section class="pt-28 pb-12 sm:pt-32 sm:pb-14 lg:pt-36 lg:pb-16 bg-gradient-to-b from-slate-950/90 via-slate-900/70 to-slate-950 backdrop-blur-md border-b border-slate-800/80 text-center relative overflow-hidden">
    <!-- 發光背景光暈 -->
    <div
      class="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-36 rounded-full blur-3xl pointer-events-none"
      :class="glowColorClass"
    ></div>

    <div class="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 relative z-10 space-y-4">
      <!-- 頂部徽章標籤 -->
      <div
        v-if="badge"
        class="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-bold border"
        :class="badgeColorClass"
      >
        <span>{{ badge }}</span>
      </div>

      <!-- 頁面主標題 H1 (支援 GSAP SplitText 逐字升起動畫) -->
      <h1 ref="titleRef" class="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
        {{ title }}
      </h1>

      <!-- 頁面說明引言 (支援換行顯示或 slot 自訂顏色排版) -->
      <slot name="subtitle">
        <p v-if="subtitle" class="text-slate-300 text-base sm:text-lg max-w-5xl mx-auto leading-relaxed whitespace-pre-line text-center">
          {{ subtitle }}
        </p>
      </slot>

      <slot name="extra" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    badge?: string
    title: string
    subtitle?: string
    theme?: 'cyan' | 'blue' | 'indigo' | 'emerald'
  }>(),
  {
    theme: 'cyan'
  }
)



const glowColorClass = computed(() => {
  switch (props.theme) {
    case 'blue':
      return 'bg-blue-500/15'
    case 'indigo':
      return 'bg-indigo-500/15'
    case 'emerald':
      return 'bg-emerald-500/15'
    case 'cyan':
    default:
      return 'bg-cyan-500/15'
  }
})

const badgeColorClass = computed(() => {
  switch (props.theme) {
    case 'blue':
      return 'bg-blue-500/10 text-blue-400 border-blue-500/30'
    case 'indigo':
      return 'bg-indigo-500/15 text-[#8ea1e1] border-[#5865F2]/40'
    case 'emerald':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
    case 'cyan':
    default:
      return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
  }
})
</script>


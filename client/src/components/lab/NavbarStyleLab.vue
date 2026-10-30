<template>
  <section id="sec-navbar" class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
      <div>
        <div class="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 mb-2">
          <span>SECTION 01</span>
          <span>｜</span>
          <span>NAVBAR STYLES</span>
        </div>
        <h2 class="text-2xl sm:text-3xl font-black text-white tracking-tight">
          01. 導覽列設計風格測試與選擇
        </h2>
        <p class="text-sm text-slate-400 mt-1">
          當前選中：<span class="text-cyan-300 font-bold">{{ currentNavbarInfo.name }}</span>（{{ currentNavbarInfo.tagline }}）
        </p>
      </div>

      <div class="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-3 py-1.5 rounded-xl border border-cyan-500/30 self-start sm:self-auto">
        ⚡ 點擊卡片直接切換
      </div>
    </div>

    <!-- 2 大方案大卡片並列 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div
        v-for="s in navbarStyles"
        :key="s.id"
        @click="store.setNavbarStyle(s.id)"
        class="p-5 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between group relative overflow-hidden"
        :class="[
          store.activeNavbarStyle === s.id
            ? 'bg-gradient-to-br from-cyan-950/60 via-slate-900/90 to-slate-950 border-cyan-500/70 shadow-2xl shadow-cyan-950/60 text-white'
            : 'bg-slate-900/60 hover:bg-slate-850 border-slate-800 text-slate-300'
        ]"
      >
        <div
          v-if="store.activeNavbarStyle === s.id"
          class="absolute left-0 top-0 bottom-0 w-1.5 bg-cyan-400 shadow-[0_0_12px_#22d3ee]"
        ></div>

        <div>
          <div class="flex items-center justify-between mb-3">
            <span class="text-3xl p-2 rounded-2xl bg-slate-800/80 border border-slate-700/60">
              {{ s.icon }}
            </span>
            <span
              class="text-xs font-mono font-bold px-2.5 py-1 rounded-full"
              :class="store.activeNavbarStyle === s.id ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-slate-800 text-slate-400'"
            >
              {{ store.activeNavbarStyle === s.id ? 'ACTIVE ✓' : '點擊選擇' }}
            </span>
          </div>

          <h3 class="font-extrabold text-base text-white mb-1.5">
            {{ s.name }}
          </h3>

          <p class="text-xs text-slate-400 leading-relaxed">
            {{ s.tagline }}
          </p>
        </div>

        <div class="pt-4 mt-4 border-t border-slate-800/80 text-xs font-mono flex items-center justify-between">
          <span :class="store.activeNavbarStyle === s.id ? 'text-cyan-400 font-bold' : 'text-slate-500'">
            {{ store.activeNavbarStyle === s.id ? '● 已套用為全站風格' : '點此套用' }}
          </span>
          <span class="text-slate-500">→</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore, type NavbarStyleType } from '@/stores/useThemeStore'

const store = useThemeStore()

const navbarStyles: { id: NavbarStyleType; name: string; tagline: string; icon: string }[] = [
  { id: 'smart_morph', name: '方案 1: 雙態智能變形 × 能量雷射光軌 (旗艦基準)', tagline: '置頂 100% 滿版通透 ➔ 滾動絲滑收縮圓角膠囊 ＋ 頂部天幕消隱', icon: '💎' },
  { id: 'full_autohide', name: '方案 2: 滿版全景 × 底部神祕光刃 (滿版常駐)', tagline: '全程 100% 滿版大氣常駐 ＋ 底部非線性微型流星由左至右穿梭', icon: '🌊' },
]

const currentNavbarInfo = computed(() => {
  const opt = navbarStyles.find(s => s.id === store.activeNavbarStyle)
  return opt || navbarStyles[0]
})
</script>

<template>
  <div class="min-h-screen bg-transparent text-slate-100 relative overflow-x-hidden">
    <!-- 1. 純粹無側邊欄・由上而下垂直測試工作台 (Top-to-Bottom Studio Flow) -->
    <main class="relative z-10 max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 pt-24 sm:pt-28 pb-16 space-y-20">

      <!-- 頂部：實驗室標頭與一鍵返回官網 (Studio Header) -->
      <section class="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-2xl shadow-2xl shadow-cyan-950/40">
        <div class="space-y-3 max-w-2xl">
          <div class="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <span class="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            <span>KAIFU DESIGN & MOTION LAB ｜ 視覺動效工作台</span>
          </div>

          <h1 class="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Kaifu 視覺與動效實驗室
          </h1>

          <p class="text-sm sm:text-base text-slate-300 leading-relaxed">
            由上而下逐區切換測試，點選設定自動全域持久化儲存，點擊返回招生官網立即生效！
          </p>
        </div>

        <div class="flex flex-col sm:flex-row gap-3 flex-shrink-0">
          <router-link
            to="/"
            class="px-6 py-3.5 rounded-2xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-xl shadow-cyan-500/25 hover:scale-105 active:scale-95 transition-all text-center flex items-center justify-center space-x-2 group"
          >
            <span class="group-hover:-translate-x-1 transition-transform">←</span>
            <span>返回招生官網（即刻生效）</span>
          </router-link>
        </div>
      </section>

      <!-- 區域 00：Hero 右側視覺方案切換實驗室 -->
      <HeroVisualLab />

      <!-- 區域 01：導覽列設計風格測試與選擇 -->
      <NavbarStyleLab />

      <!-- 區域 02：導覽列與頁尾 1px 邊框光芒物理動態與速度調校 -->
      <BorderGlowLab />

      <!-- 區域 03、03.5、03.6：全域背景氛圍、360° 天球流星、AI 量子思維與代碼彩蛋 -->
      <BackgroundLab />

      <!-- 區域 04：UI 卡片與 3D 微互動展演區 -->
      <MicroInteractionsLab />

      <!-- 底部：一鍵返回官網檢驗 (Bottom Action Hub) -->
      <section class="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-cyan-500/30 shadow-2xl text-center space-y-4">
        <h3 class="text-xl font-extrabold text-white">
          測試完畢？所有選擇皆已全域同步生效！
        </h3>
        <p class="text-sm text-slate-400">
          當前配置：導覽列【<span class="text-cyan-300 font-bold">{{ store.activeNavbarStyle }}</span>】 ｜ 邊框動效【<span class="text-cyan-300 font-bold">{{ store.activeGlowPreset }}</span>】 ｜ 速度【<span class="text-cyan-300 font-mono font-bold">{{ store.glowSpeedMultiplier }}x</span>】
        </p>
        <div class="pt-2 flex justify-center">
          <router-link
            to="/"
            class="px-8 py-4 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-xl shadow-cyan-500/25 hover:scale-105 active:scale-95 transition-all inline-flex items-center space-x-2"
          >
            <span>← 返回招生官網驗收全域效果</span>
          </router-link>
        </div>
      </section>

    </main>
  </div>
</template>

<script setup lang="ts">
import { useThemeStore } from '@/stores/useThemeStore'
import { useSeoMeta } from '@/composables/useSeoMeta'
import HeroVisualLab from '@/components/lab/HeroVisualLab.vue'
import NavbarStyleLab from '@/components/lab/NavbarStyleLab.vue'
import BorderGlowLab from '@/components/lab/BorderGlowLab.vue'
import BackgroundLab from '@/components/lab/BackgroundLab.vue'
import MicroInteractionsLab from '@/components/lab/MicroInteractionsLab.vue'

useSeoMeta({
  title: 'Kaifu 視覺與動效實驗室',
  robots: 'noindex, nofollow',
  canonicalPath: '/kaifu-lab'
})

const store = useThemeStore()
</script>

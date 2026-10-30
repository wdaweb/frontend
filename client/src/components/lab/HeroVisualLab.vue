<template>
  <section id="sec-hero-visual" class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
      <div>
        <div class="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 mb-2">
          <span>SECTION 00</span>
          <span>｜</span>
          <span>HERO RIGHT VISUAL LAB</span>
        </div>
        <h2 class="text-2xl sm:text-3xl font-black text-white tracking-tight">
          00. Hero Banner 右側視覺方案切換
        </h2>
        <p class="text-sm text-slate-400 mt-1">
          當前方案：<span class="text-cyan-300 font-bold">{{ heroVariantInfo.name }}</span>（{{ heroVariantInfo.tagline }}）
        </p>
      </div>

      <div class="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-3 py-1.5 rounded-xl border border-cyan-500/30 self-start sm:self-auto">
        🎨 點擊卡片即時套用至官網
      </div>
    </div>

    <!-- 2 大方案卡片 + 即時預覽 雙欄佈局 -->
    <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <!-- 左側：2 大方案卡片選擇器 -->
      <div class="lg:col-span-2 grid grid-cols-1 gap-4">
        <div
          v-for="v in heroVariants"
          :key="v.id"
          @click="store.setHeroRightVariant(v.id)"
          class="p-5 rounded-3xl border transition-all cursor-pointer flex items-start gap-4 group relative overflow-hidden"
          :class="[
            store.heroRightVariant === v.id
              ? 'bg-gradient-to-br from-cyan-950/60 via-slate-900/90 to-slate-950 border-cyan-500/70 shadow-2xl shadow-cyan-950/60 text-white'
              : 'bg-slate-900/60 hover:bg-slate-850 border-slate-800 text-slate-300 hover:border-slate-700'
          ]"
        >
          <!-- 選中左側光邊 -->
          <div
            v-if="store.heroRightVariant === v.id"
            class="absolute left-0 top-0 bottom-0 w-1.5 bg-cyan-400 shadow-[0_0_12px_#06b6d4]"
          ></div>

          <!-- 圖示 -->
          <span class="text-3xl p-2.5 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex-shrink-0">
            {{ v.icon }}
          </span>

          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between mb-1">
              <h3 class="font-extrabold text-base text-white">{{ v.name }}</h3>
              <span
                class="text-xs font-mono font-bold px-2 py-0.5 rounded-full flex-shrink-0 ml-2"
                :class="store.heroRightVariant === v.id ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-slate-800 text-slate-400'"
              >
                {{ store.heroRightVariant === v.id ? 'ACTIVE ✓' : '點擊選擇' }}
              </span>
            </div>
            <p class="text-xs text-slate-400 leading-relaxed">{{ v.tagline }}</p>

            <!-- 特色標籤 -->
            <div class="mt-2.5 flex flex-wrap gap-1.5">
              <span
                v-for="tag in v.tags"
                :key="tag"
                class="px-2 py-0.5 rounded-full text-xs font-mono"
                :class="store.heroRightVariant === v.id ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/25' : 'bg-slate-800/80 text-slate-500 border border-slate-700/40'"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 右側：即時預覽窗格 -->
      <div class="lg:col-span-3 flex flex-col gap-4">
        <!-- 預覽標題 -->
        <div class="flex items-center justify-between">
          <span class="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400">
            📺 Hero 右側即時預覽
          </span>
          <span class="text-xs font-mono text-slate-500">
            點擊「返回官網」查看實際效果
          </span>
        </div>

        <div class="relative rounded-3xl overflow-hidden border border-slate-800/80 bg-slate-950/60 shadow-2xl shadow-slate-950/60 backdrop-blur-xl" style="height: 280px;">
          <!-- 背景量子大氣微光層 -->
          <div class="absolute -top-12 -right-12 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none"></div>
          <div class="absolute -bottom-12 -left-12 w-64 h-64 bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>

          <!-- scale 容器：固定 700px 寬的組件縮放到容器內 -->
          <div class="absolute top-2 left-2 right-2 bottom-2 overflow-hidden rounded-2xl">
            <div style="width: 700px; transform: scale(0.54); transform-origin: top left;">
              <component :is="previewComponent" />
            </div>
          </div>

          <!-- 預覽 Overlay 標示 -->
          <div class="absolute top-4 left-4 pointer-events-none z-10">
            <span class="px-2 py-1 rounded-lg text-xs font-mono font-bold bg-slate-950/80 text-cyan-300 border border-cyan-500/30 backdrop-blur-sm">
              🔍 縮圖預覽
            </span>
          </div>
        </div>

        <!-- 方案說明卡 -->
        <div class="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <h4 class="font-bold text-sm text-white flex items-center gap-2">
            <span>{{ heroVariantInfo.icon }}</span>
            <span>{{ heroVariantInfo.name }} — 設計理念</span>
          </h4>
          <p class="text-xs text-slate-400 leading-relaxed">{{ heroVariantInfo.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore, type HeroRightVariant } from '@/stores/useThemeStore'
import AiChatWindow from '@/components/common/AiChatWindow.vue'
import AiCodeWindow from '@/components/common/AiCodeWindow.vue'

const store = useThemeStore()

const heroVariants: {
  id: HeroRightVariant
  name: string
  tagline: string
  icon: string
  tags: string[]
  description: string
}[] = [
  {
    id: 'code_window',
    name: 'VS Code 程式碼視窗',
    tagline: '模擬 AI 即時生成代碼，強調技術氛圍與 920h 課程深度',
    icon: '⚡',
    tags: ['語法高亮', '打字機動畫', 'AI Generating'],
    description: '現有旗艦方案。Mac 風格視窗搭配 Vue 3 語法高亮程式碼，AI 狀態列顯示「Generating」，強調課程的工程深度與 AI 整合特色。適合吸引技術背景的潛在學員。'
  },
  {
    id: 'ai_chat',
    name: 'AI 學習助教對話視窗',
    tagline: '模擬 Cursor AI 問答，親切貼近非工程師背景的目標族群',
    icon: '🤖',
    tags: ['打字機動畫', '輪播問答', '0 基礎友善'],
    description: '方案一。模擬 AI 助教即時回答學員問題的對話介面，輪播展示「0 基礎能學嗎？」「補助怎麼申請？」等真實疑問，降低非技術背景訪客的心理門檻，提升報名意願。'
  }
]

const heroVariantInfo = computed(() => {
  return heroVariants.find(v => v.id === store.heroRightVariant) || heroVariants[0]
})

const previewComponent = computed(() => {
  return store.heroRightVariant === 'ai_chat' ? AiChatWindow : AiCodeWindow
})
</script>

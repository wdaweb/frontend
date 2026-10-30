<template>
  <section id="sec-glow-motion" class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
      <div>
        <div class="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 mb-2">
          <span>SECTION 02</span>
          <span>｜</span>
          <span>BORDER GLOW MOTION LAB</span>
        </div>
        <h2 class="text-2xl sm:text-3xl font-black text-white tracking-tight">
          02. 導覽列與頁尾 1px 邊框光芒物理動態與速度調校
        </h2>
        <p class="text-sm text-slate-400 mt-1">
          當前預設：<span class="text-cyan-300 font-bold">{{ currentGlowInfo.name }}</span> ｜ 速度倍率：<span class="text-cyan-400 font-mono font-bold">{{ store.glowSpeedMultiplier }}x</span>
        </p>
      </div>

      <div class="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-3 py-1.5 rounded-xl border border-cyan-500/30 self-start sm:self-auto">
        🚀 4 大頂級非線性物理預設
      </div>
    </div>

    <!-- 速度倍率即時調節控制台 -->
    <div class="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-xl space-y-5">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="flex items-center space-x-2">
            <span class="text-lg">⏱️</span>
            <h3 class="font-extrabold text-base text-white">
              全站動效速度倍率調節器 (Dynamic Velocity Slider)
            </h3>
          </div>
          <p class="text-xs text-slate-400 mt-1">
            直接改變 CSS 全域變數 <code class="text-cyan-300 font-mono">--glow-speed-mult</code>，毫秒級即時更新導覽列、頁尾與實驗室全部動畫！
          </p>
        </div>

        <!-- 快速倍率按鈕組 -->
        <div class="flex flex-wrap gap-2">
          <button
            v-for="opt in speedOptions"
            :key="opt.value"
            type="button"
            @click="store.setGlowSpeedMultiplier(opt.value)"
            class="px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer"
            :class="[
              Math.abs(store.glowSpeedMultiplier - opt.value) < 0.01
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/30 scale-105'
                : 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700/60'
            ]"
          >
            {{ opt.label }}
          </button>
        </div>
      </div>

      <!-- 精密滑桿控制 -->
      <div class="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center pt-2 border-t border-slate-800/80">
        <div class="sm:col-span-8 flex items-center space-x-4">
          <span class="text-xs font-mono text-slate-400 min-w-[36px]">0.5x</span>
          <input
            type="range"
            min="0.5"
            max="2.0"
            step="0.05"
            :value="store.glowSpeedMultiplier"
            @input="e => store.setGlowSpeedMultiplier(parseFloat((e.target as HTMLInputElement).value))"
            class="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          <span class="text-xs font-mono text-slate-400 min-w-[36px]">2.0x</span>
        </div>

        <div class="sm:col-span-4 flex items-center justify-between sm:justify-end space-x-3">
          <div class="px-3 py-1 rounded-xl bg-slate-950 border border-cyan-500/40 text-cyan-300 font-mono font-black text-sm shadow-inner">
            {{ store.glowSpeedMultiplier.toFixed(2) }}x 速度
          </div>
          <button
            type="button"
            @click="store.setGlowSpeedMultiplier(1.0)"
            class="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700/60 transition-colors cursor-pointer"
          >
            重設 1.0x
          </button>
        </div>
      </div>
    </div>

    <!-- 4 大動效風格卡片網格 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
        v-for="g in glowPresets"
        :key="g.id"
        @click="store.setGlowPreset(g.id)"
        class="p-6 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between group relative overflow-hidden"
        :class="[
          store.activeGlowPreset === g.id
            ? 'bg-gradient-to-br from-cyan-950/60 via-slate-900/90 to-slate-950 border-cyan-500/70 shadow-2xl shadow-cyan-950/60 text-white'
            : 'bg-slate-900/60 hover:bg-slate-850 border-slate-800 text-slate-300'
        ]"
      >
        <div
          v-if="store.activeGlowPreset === g.id"
          class="absolute left-0 top-0 bottom-0 w-1.5 bg-cyan-400 shadow-[0_0_12px_#22d3ee]"
        ></div>

        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2.5">
              <span class="text-2xl p-2 rounded-2xl bg-slate-800/80 border border-slate-700/60">
                {{ g.icon }}
              </span>
              <div>
                <span class="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  {{ g.badge }}
                </span>
              </div>
            </div>
            <span
              class="text-xs font-mono font-bold px-3 py-1 rounded-full"
              :class="store.activeGlowPreset === g.id ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-slate-800 text-slate-400'"
            >
              {{ store.activeGlowPreset === g.id ? 'ACTIVE ✓' : '點擊切換' }}
            </span>
          </div>

          <div>
            <h3 class="font-black text-lg text-white mb-1">
              {{ g.name }}
            </h3>
            <p class="text-xs text-cyan-300/80 font-mono leading-relaxed">
              {{ g.tagline }}
            </p>
          </div>

          <!-- 動效物理參數規格表 -->
          <div class="grid grid-cols-2 gap-2 text-xs font-mono">
            <div class="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-0.5">
              <div class="text-xs text-slate-500">週期時間</div>
              <div class="text-cyan-300 font-bold truncate">{{ g.duration }}</div>
            </div>
            <div class="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-0.5">
              <div class="text-xs text-slate-500">佔空留白比</div>
              <div class="text-emerald-400 font-bold truncate">{{ g.dutyCycle }}</div>
            </div>
            <div class="col-span-2 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-0.5">
              <div class="text-xs text-slate-500">運動曲線 (Easing)</div>
              <div class="text-purple-300 font-bold font-mono text-xs truncate">{{ g.easing }}</div>
            </div>
          </div>

          <p class="text-xs text-slate-400 leading-relaxed">
            {{ g.description }}
          </p>

          <!-- 卡片內置即時單軌預覽 -->
          <div class="pt-2">
            <div class="text-xs font-mono text-slate-500 mb-1.5 flex justify-between">
              <span>單軌動效即時預覽：</span>
              <span class="text-cyan-400">100vw 視窗等比模擬</span>
            </div>
            <div class="relative h-6 bg-slate-950/90 rounded-xl border border-slate-800/80 overflow-hidden flex items-center px-2">
              <div class="w-full h-[1px] bg-slate-800/80 absolute inset-x-0"></div>
              <div
                class="w-32 h-2 bg-gradient-to-r from-transparent via-cyan-400/90 via-blue-400/70 to-transparent blur-[2px] rounded-full pointer-events-none"
                :class="`glow-stream-${g.id}`"
              ></div>
              <div
                class="w-24 h-[1px] bg-gradient-to-r from-transparent via-cyan-100 via-cyan-300 to-transparent shadow-[0_0_6px_#22d3ee] pointer-events-none"
                :class="`glow-stream-${g.id}`"
              ></div>
            </div>
          </div>
        </div>

        <div class="pt-4 mt-4 border-t border-slate-800/80 text-xs font-mono flex items-center justify-between">
          <span :class="store.activeGlowPreset === g.id ? 'text-cyan-400 font-bold' : 'text-slate-500'">
            {{ store.activeGlowPreset === g.id ? '● 已套用至全站導覽列與頁尾' : '點此套用此動態物理方案' }}
          </span>
          <span class="text-slate-500">→</span>
        </div>
      </div>
    </div>

    <!-- 天地呼應即時對位模擬器 -->
    <div class="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-2xl space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center text-xl">
            🌌
          </div>
          <div>
            <h3 class="font-black text-lg text-white">
              天地呼應與相位對位即時監控台 (Navbar 天 ｜ Footer 地 雙軌同步)
            </h3>
            <p class="text-xs text-slate-400 mt-0.5">
              觀測頂部導覽列光束與頁尾光束在時間軸上的交錯對位律動（Polyphonic Counterpoint）
            </p>
          </div>
        </div>

        <div class="text-xs font-mono px-3 py-1.5 rounded-xl bg-slate-950 border border-cyan-500/30 text-cyan-300">
          當前模式：{{ currentGlowInfo.name }}
        </div>
      </div>

      <!-- 雙軌視覺展示 -->
      <div class="space-y-4">
        <!-- 頂部 Navbar 軌道 -->
        <div class="space-y-1.5">
          <div class="flex items-center justify-between text-xs font-mono">
            <span class="text-cyan-400 font-bold flex items-center space-x-1.5">
              <span>🔺 天：頂部導覽列 (Navbar Precision 1px Line)</span>
            </span>
            <span class="text-slate-500">相位 0.0s 始發基準</span>
          </div>
          <div class="relative h-10 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex items-center">
            <div class="w-full h-[1px] bg-slate-800/80 absolute inset-x-0"></div>
            <div
              class="absolute inset-y-0 w-80 pointer-events-none flex flex-col items-center justify-center"
              :class="`glow-stream-${store.activeGlowPreset}`"
            >
              <div class="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/25 via-blue-500/20 to-transparent blur-md"></div>
              <div class="w-4/5 h-[3px] bg-gradient-to-r from-transparent via-cyan-400/90 via-blue-400/70 to-transparent blur-[2px] rounded-full"></div>
              <div class="w-3/5 h-[1.5px] -translate-y-[1px] bg-gradient-to-r from-transparent via-white via-cyan-300 to-transparent shadow-[0_0_8px_#22d3ee]"></div>
            </div>
          </div>
        </div>

        <!-- 底部 Footer 軌道 -->
        <div class="space-y-1.5">
          <div class="flex items-center justify-between text-xs font-mono">
            <span class="text-blue-400 font-bold flex items-center space-x-1.5">
              <span>🔻 地：底部頁尾 (Footer Precision 1px Line)</span>
            </span>
            <span class="text-slate-500">相位交錯延遲呼應中</span>
          </div>
          <div class="relative h-10 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex items-center">
            <div class="w-full h-[1px] bg-slate-800/80 absolute inset-x-0"></div>
            <div
              class="absolute inset-y-0 w-80 pointer-events-none flex flex-col items-center justify-center"
              :class="`footer-glow-${store.activeGlowPreset}`"
            >
              <div class="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/25 via-blue-500/20 to-transparent blur-md"></div>
              <div class="w-4/5 h-[3px] bg-gradient-to-r from-transparent via-cyan-400/90 via-blue-400/70 to-transparent blur-[2px] rounded-full"></div>
              <div class="w-3/5 h-[1.5px] -translate-y-[1px] bg-gradient-to-r from-transparent via-white via-cyan-300 to-transparent shadow-[0_0_8px_#22d3ee]"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore, type GlowMotionPreset } from '@/stores/useThemeStore'

const store = useThemeStore()

const glowPresets: {
  id: GlowMotionPreset;
  name: string;
  tagline: string;
  icon: string;
  badge: string;
  duration: string;
  easing: string;
  dutyCycle: string;
  description: string;
}[] = [
  {
    id: 'cosmic_pulse',
    name: '方案 A【靈動星際流星 (Cosmic Pulse)】',
    tagline: '非對稱疾速穿梭 ➔ 柔和拖尾 ➔ 4.5s 深沉暗態留白呼吸',
    icon: '🌠',
    badge: '👑 大師強烈推薦・旗艦首選',
    duration: '8.0s (穿梭 3.5s + 留白 4.5s)',
    easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
    dutyCycle: '44% 行進 / 56% 靜默呼吸',
    description: '打破 linear 機械勻速感，賦予光芒蓄勢破空與優雅減速的流星生命感。長達 4.5 秒的靜息留白營造崇高的神秘感與期待感，天地對位交錯 2.4 秒。'
  },
  {
    id: 'gentle_aurora',
    name: '方案 B【柔和悠揚極光 (Gentle Aurora)】',
    tagline: '10s 溫柔平滑往返 Ping-Pong，兩端微停頓柔焦撫過',
    icon: '🌌',
    badge: '🌿 平穩寧靜・沉浸閱讀',
    duration: '10.0s (左右平滑往返)',
    easing: 'cubic-bezier(0.45, 0.05, 0.55, 0.95)',
    dutyCycle: '100% 柔和常在 (無完全熄滅)',
    description: '經典正弦波平滑來回撫動，光芒在端點處溫和放慢駐留 0.8 秒，如北極光在天際漫漫舒展，極度安撫視覺，適合長時間專注文檔閱讀。'
  },
  {
    id: 'quantum_radar',
    name: '方案 C【量子雷達巡航 (Quantum Radar)】',
    tagline: '5s 週期單向高速巡弋，1.2s 短暫暗態蓄能脈衝',
    icon: '⚡',
    badge: '🚀 科技感十足・敏捷銳利',
    duration: '5.0s (巡航 3.8s + 蓄能 1.2s)',
    easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
    dutyCycle: '76% 巡弋 / 24% 蓄能',
    description: '節奏明快的高動量掃描線，模擬量子雷達巡航波，光芒穿透力強，自帶高飽和科技光暈，展現極致運算性能與敏捷活力。'
  },
  {
    id: 'hyperdrive_warp',
    name: '方案 D【深空星芒脈衝 (Hyperdrive Warp)】',
    tagline: '1.8s 曲速光束掠過，5.2s 冷卻蓄能深空夜色',
    icon: '💫',
    badge: '🛸 瞬態躍遷・超時空感',
    duration: '7.0s (躍遷 1.8s + 冷卻 5.2s)',
    easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
    dutyCycle: '26% 躍遷 / 74% 深邃黑夜',
    description: '靈感來自科幻曲速引擎（Warp Drive），極短時間內以超高速閃耀劃過視窗並伴隨光學拉伸，隨後進入超長深空靜息，戲劇張力拉滿。'
  }
]

const currentGlowInfo = computed(() => {
  const opt = glowPresets.find(g => g.id === store.activeGlowPreset)
  return opt || glowPresets[0]
})

const speedOptions = [
  { label: '0.5x (慢速微觀)', value: 0.5 },
  { label: '0.75x (悠閒節奏)', value: 0.75 },
  { label: '1.0x (標準黃金)', value: 1.0 },
  { label: '1.25x (輕快躍動)', value: 1.25 },
  { label: '1.5x (敏捷雷射)', value: 1.5 },
  { label: '2.0x (疾速穿梭)', value: 2.0 }
]
</script>

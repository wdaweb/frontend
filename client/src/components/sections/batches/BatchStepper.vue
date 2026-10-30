<template>
  <div class="mb-7 p-3.5 sm:p-6 rounded-2xl bg-slate-950/80 border border-slate-800/90 shadow-inner overflow-hidden">
    <!-- 5 階段節點步進軸 (直線與圓心 100% 絕對幾何居中) -->
    <div class="relative px-0.5 min-[400px]:px-2 sm:px-4">
      <!-- 圓圈與導軌線專用排 (高度固定 h-7，導軌線嚴格穿過圓心) -->
      <div class="relative h-7 flex items-center justify-between">
        <!-- 導軌專屬通道 (left-3.5 至 right-3.5：嚴格鎖定在第 1 個與第 5 個圓心之間，永不右溢) -->
        <div class="absolute left-3.5 right-3.5 top-1/2 -translate-y-1/2 h-0.5 overflow-hidden -z-0">
          <!-- 背景灰色導軌線 -->
          <div class="w-full h-full bg-slate-800"></div>
          <!-- 走過的發光進度線 (結訓時為沉靜暗灰，活躍時為青綠流光) -->
          <div
            class="absolute left-0 top-0 h-full transition-all duration-700"
            :class="
              isEnded
                ? 'bg-slate-700'
                : 'bg-gradient-to-r from-emerald-500 to-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.6)]'
            "
            :style="{ width: getLifecycleLineWidth(batch) }"
          ></div>
        </div>

        <!-- 5 個圓圈節點 (直徑 28px，中心正好在 14px) -->
        <div
          v-for="(step, sIndex) in lifecycleSteps"
          :key="step.key"
          class="relative z-10 w-7 h-7 flex items-center justify-center flex-shrink-0"
        >
          <!-- 100% 實心遮光底座 (徹底阻斷後方導軌線與進度條穿透) -->
          <div class="absolute inset-0 rounded-full bg-slate-950"></div>

          <!-- 節點圓圈本體 (100% 實心不透明) -->
          <div
            class="relative z-10 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-all duration-300"
            :class="getStepNodeClass(batch, sIndex + 1)"
          >
            <span v-if="getStepStatus(batch, sIndex + 1) === 'completed'">✓</span>
            <span v-else>{{ sIndex + 1 }}</span>
          </div>
        </div>
      </div>

      <!-- 5 個文字標籤專用排 (垂直完全對齊上方圓圈) -->
      <div class="flex items-center justify-between mt-2.5">
        <div v-for="(step, sIndex) in lifecycleSteps" :key="step.key" class="w-7 flex justify-center">
          <span
            class="text-xs sm:text-sm font-semibold transition-colors duration-300 whitespace-nowrap text-center select-none"
            :class="getStepTextClass(batch, sIndex + 1)"
          >
            {{ step.label }}
          </span>
        </div>
      </div>
    </div>

    <!-- 生命週期動態焦點看板 (單行大器展示，自適應字級防折行) -->
    <div
      class="mt-4 pt-3.5 border-t border-slate-800/80 text-xs sm:text-sm lg:text-base flex items-center text-slate-200 min-w-0"
    >
      <div class="flex items-center space-x-2 min-w-0 overflow-hidden">
        <span class="flex-shrink-0 text-sm sm:text-base">{{ getLifecycleDetailNotice(batch).icon }}</span>
        <span class="leading-relaxed font-medium whitespace-nowrap overflow-hidden text-ellipsis">{{
          getLifecycleDetailNotice(batch).text
        }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AdmissionBatch } from '@/types'

defineProps<{
  batch: AdmissionBatch
  isEnded: boolean
  lifecycleSteps: Array<{ key: string; label: string }>
  getLifecycleLineWidth: (batch: AdmissionBatch) => string
  getStepNodeClass: (batch: AdmissionBatch, stepIndex: number) => string
  getStepStatus: (batch: AdmissionBatch, stepIndex: number) => string
  getStepTextClass: (batch: AdmissionBatch, stepIndex: number) => string
  getLifecycleDetailNotice: (batch: AdmissionBatch) => { icon: string; text: string }
}>()
</script>

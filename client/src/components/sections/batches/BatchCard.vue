<template>
  <div
    class="batch-card group relative rounded-3xl p-4 sm:p-8 lg:p-11 backdrop-blur-xl border transition-all duration-300 flex flex-col justify-between overflow-hidden transform-gpu cursor-default w-full"
    :class="[
      isEnded
        ? 'border-slate-800/80 bg-slate-900/70 hover:bg-slate-900/85 shadow-lg shadow-slate-950/40'
        : isUrgentClosing
          ? 'border-amber-500/70 bg-slate-900/90 shadow-2xl shadow-amber-950/60 ring-1 ring-amber-400/50'
          : 'card-subsurface-glow bg-slate-900/70 hover:bg-slate-900/90 border-slate-800/90 shadow-xl shadow-slate-950/60',
    ]"
  >
    <!-- 頂部流光光暈線 (緊急倒數琥珀金光、活躍班級青色微光) -->
    <div
      v-if="isUrgentClosing"
      class="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_14px_rgba(251,191,36,0.9)] pointer-events-none"
    ></div>
    <div
      v-else-if="!isEnded"
      class="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
    ></div>

    <!-- 角落序號水印 (01, 02) -->
    <div
      class="absolute -right-2 -bottom-4 text-7xl font-mono font-black select-none pointer-events-none transition-colors"
      :class="
        isEnded
          ? 'text-slate-800/30'
          : 'text-slate-800/20 group-hover:text-cyan-500/10'
      "
    >
      {{ String(index + 1).padStart(2, '0') }}
    </div>

    <!-- 官方完訓認證印章水印 (僅已結訓期別顯現，極具公信力與授證質感) -->
    <div
      v-if="isEnded"
      class="absolute top-4 right-4 sm:top-6 sm:right-6 pointer-events-none select-none z-10 opacity-75 sm:opacity-85"
    >
      <div
        class="transform rotate-12 border-2 border-slate-700/80 rounded-2xl px-3 py-1.5 sm:px-4 sm:py-2 bg-slate-900/90 backdrop-blur-md flex flex-col items-center justify-center shadow-xl shadow-black/60"
      >
        <span class="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase">
          TAISHAN WDA · 920H
        </span>
        <span class="text-xs sm:text-sm font-black tracking-wider text-slate-200 flex items-center space-x-1 mt-0.5">
          <span>★</span>
          <span>圓滿結訓</span>
          <span>★</span>
        </span>
      </div>
    </div>

    <!-- 上方資訊區 -->
    <div>
      <h3
        class="text-xl sm:text-2xl lg:text-3xl font-extrabold mb-4 sm:mb-5 flex items-center space-x-2.5 transition-colors break-words pr-24 sm:pr-28"
        :class="[
          isEnded
            ? 'text-slate-300 group-hover:text-white'
            : 'text-white group-hover:text-cyan-300',
        ]"
      >
        <span>{{ batch.batch_name }}</span>
      </h3>

      <!-- 參訓學員陣容 / 報名熱度 / 結訓成果進度看板 -->
      <div
        v-if="batch.applicants_count !== undefined && batch.applicants_count !== null"
        class="mb-5 p-3.5 sm:p-4 rounded-2xl bg-slate-950/70 border border-slate-800/90 shadow-inner"
      >
        <div class="flex items-center justify-between text-xs sm:text-sm font-semibold mb-2">
          <span class="text-slate-300 font-medium">{{ applicantsSummary.label }}</span>
          <div class="flex items-center space-x-2">
            <span class="font-mono font-bold" :class="isEnded ? 'text-slate-300' : 'text-cyan-400'">
              {{ applicantsSummary.countText }}
            </span>
            <span class="text-slate-400 text-xs font-normal hidden sm:inline">
              ({{ applicantsSummary.detailText }})
            </span>
          </div>
        </div>
        <div class="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
          <div
            class="h-full rounded-full transition-all duration-1000"
            :class="applicantsSummary.barClass"
            :style="{
              width: `${applicantsSummary.percent}%`,
            }"
          ></div>
        </div>
      </div>

      <!-- 課程生命週期 5 階段流程步進軸 -->
      <BatchStepper
        :batch="batch"
        :is-ended="isEnded"
        :lifecycle-steps="lifecycleSteps"
        :get-lifecycle-line-width="getLifecycleLineWidth"
        :get-step-node-class="getStepNodeClass"
        :get-step-status="getStepStatus"
        :get-step-text-class="getStepTextClass"
        :get-lifecycle-detail-notice="getLifecycleDetailNotice"
      />

      <div class="space-y-4 text-base text-slate-300 mb-8">
        <!-- 報名期間 (手機版直式/橫式自適應) -->
        <div
          class="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-slate-800/80 gap-1 sm:gap-0"
        >
          <span class="text-slate-400 flex items-center space-x-1.5 text-base">
            <span>📅 報名起訖期間</span>
          </span>
          <div class="text-left sm:text-right">
            <span
              class="font-medium font-mono text-base"
              :class="isBatchClosed(batch) ? 'text-slate-300' : 'text-white'"
            >
              {{ batch.enroll_start_date }} ～ {{ batch.enroll_end_date }}
            </span>
          </div>
        </div>

        <!-- 甄試日期 (若有，手機版自適應不擠出) -->
        <div
          v-if="batch.screening_date"
          class="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-slate-800/80 gap-1 sm:gap-0"
        >
          <span class="text-slate-400 flex items-center space-x-1.5 text-base">
            <span>📝 甄試辦理日期</span>
          </span>
          <div class="text-left sm:text-right flex items-center flex-wrap gap-1.5">
            <span class="font-medium font-mono text-slate-200 text-base">
              {{ batch.screening_date }}
            </span>
            <span
              v-if="isBatchScreeningOrPreparing(batch)"
              class="text-sm px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold"
              >{{ isScreeningEnded(batch) ? '已甄試完畢' : '今日甄試中' }}</span
            >
          </div>
        </div>

        <!-- 訓練期間 (時程清單末項，手機版自適應) -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-0">
          <span class="text-slate-400 text-base">🚀 正式訓練期間</span>
          <div class="text-left sm:text-right">
            <span
              class="font-medium font-mono text-base"
              :class="
                isEnded
                  ? 'text-slate-400 font-medium'
                  : isTraining
                    ? 'text-emerald-300 font-bold'
                    : isBatchScreeningOrPreparing(batch)
                      ? 'text-cyan-300 font-bold'
                      : 'text-white'
              "
            >
              {{ batch.training_start_date }} ～ {{ batch.training_end_date }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 下方行動按鈕區 -->
    <div class="pt-4 border-t border-slate-800/80">
      <!-- 1. 報名中 (最後 72h 倒數升級為琥珀金信標按鈕) -->
      <a
        v-if="isBatchEnrolling(batch)"
        :href="batch.apply_url"
        target="_blank"
        rel="noopener noreferrer"
        @click="$emit('applyClick', batch)"
        class="w-full py-3.5 sm:py-4 px-3 rounded-2xl text-center font-bold text-white shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all duration-200 flex items-center justify-center space-x-2 text-base lg:text-lg cursor-pointer"
        :class="
          isUrgentClosing
            ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 shadow-amber-500/40 hover:shadow-amber-500/60'
            : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-cyan-500/30 hover:shadow-cyan-500/50'
        "
      >
        <span v-if="isUrgentClosing">⚠️ 席次倒數 · 立即前往台灣就業通報名</span>
        <span v-else>🔥 立即至<span class="inline-block">台灣就業通</span>報名</span>
        <svg class="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
      </a>

      <!-- 2. 已結訓 (保留沉靜灰色按鈕面板，不可點選) -->
      <div
        v-else-if="isEnded"
        class="w-full py-3.5 sm:py-4 px-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-inner flex items-center justify-center space-x-2 select-none text-base lg:text-lg cursor-default"
      >
        <span class="text-lg sm:text-xl opacity-60">🎓</span>
        <span class="text-slate-400 font-semibold tracking-wide">920h 培訓完成 · 邁向職場</span>
      </div>

      <!-- 3. 正全力培訓衝刺中 -->
      <div
        v-else-if="isTraining"
        class="w-full py-3.5 sm:py-4 px-3 rounded-2xl text-center font-semibold text-emerald-300 bg-slate-900/90 border border-emerald-500/30 shadow-inner flex items-center justify-center space-x-2 select-none text-base lg:text-lg"
      >
        <span class="text-base sm:text-lg">🟢</span>
        <span>本期 920h 全力培訓衝刺中</span>
      </div>

      <!-- 3. 甄試結束待開訓 -->
      <div
        v-else-if="isBatchScreeningOrPreparing(batch)"
        class="w-full py-3.5 sm:py-4 px-3 rounded-2xl text-center font-semibold text-cyan-300 bg-slate-900/90 border border-cyan-500/30 shadow-inner flex flex-wrap items-center justify-center gap-1.5 select-none text-base lg:text-lg"
      >
        <svg class="w-5 h-5 text-cyan-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span class="text-center">✨ 甄試結束 · 待開訓 ({{ batch.training_start_date }} 開課)</span>
      </div>

      <!-- 4. 尚未開放報名 -->
      <div
        v-else-if="isBatchUpcoming(batch)"
        class="w-full py-3.5 sm:py-4 px-3 rounded-2xl text-center font-semibold text-purple-300/90 bg-slate-900/90 border border-purple-500/30 shadow-inner flex items-center justify-center space-x-2 select-none text-base lg:text-lg"
      >
        <svg class="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>⏳ 尚未開放報名（敬請期待）</span>
      </div>

      <!-- 5. 報名截止 -->
      <div
        v-else
        class="w-full py-3.5 sm:py-4 px-3 rounded-2xl text-center font-semibold text-slate-400 bg-slate-900/90 border border-slate-800 shadow-inner flex items-center justify-center space-x-2 select-none text-base lg:text-lg"
      >
        <svg class="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
          />
        </svg>
        <span>⛔ 本期報名已截止受理</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { AdmissionBatch } from '@/types'
import {
  isBatchClosed,
  isBatchEnrolling,
  isBatchScreeningOrPreparing,
  isBatchUpcoming,
} from '@/utils/batchStatus'
import BatchStepper from './BatchStepper.vue'

const props = defineProps<{
  batch: AdmissionBatch
  index: number
  isEnded: boolean
  isTraining: boolean
  isUrgentClosing: boolean
  lifecycleSteps: Array<{ key: string; label: string }>
  getApplicantsSummary: (batch: AdmissionBatch) => {
    label: string
    countText: string
    detailText: string
    percent: number
    barClass: string
  }
  getLifecycleLineWidth: (batch: AdmissionBatch) => string
  getStepNodeClass: (batch: AdmissionBatch, stepIndex: number) => string
  getStepStatus: (batch: AdmissionBatch, stepIndex: number) => string
  getStepTextClass: (batch: AdmissionBatch, stepIndex: number) => string
  getLifecycleDetailNotice: (batch: AdmissionBatch) => { icon: string; text: string }
  isScreeningEnded: (batch: AdmissionBatch) => boolean
}>()

defineEmits<{
  (e: 'applyClick', batch: AdmissionBatch): void
}>()

const applicantsSummary = computed(() => props.getApplicantsSummary(props.batch))
</script>

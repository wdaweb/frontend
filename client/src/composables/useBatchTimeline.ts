import { ref, computed, toValue, type MaybeRefOrGetter } from 'vue'
import type { AdmissionBatch } from '@/types'
import { defaultBatches } from '@/stores/useCmsStore'
import {
  isBatchEnrolling,
  isBatchUpcoming,
  isBatchTraining,
  isBatchEnded as rawIsBatchEnded,
  isBatchScreeningOrPreparing,
  getTrainingEndTime,
} from '@/utils/batchStatus'

/** 全域可控的結訓慶典模擬狀態 (支援 URL 參數 ?preview=celebration 或點擊開關即時切換) */
export const isCelebrationSimulated = ref(
  typeof window !== 'undefined' &&
  (new URLSearchParams(window.location.search).get('preview') === 'celebration' ||
   window.location.hash.includes('preview=celebration'))
)

export interface LifecycleStep {
  key: string
  label: string
}

export interface TrainingProgress {
  elapsedDays: number
  totalDays: number
  percent: number
  remainingDays: number
}

export interface ApplicantsSummary {
  label: string
  countText: string
  detailText: string
  barClass: string
  percent: number
}

export interface DetailNotice {
  icon: string
  text: string
}



/**
 * 招生期別時序與生命週期演算 Composable
 * 遵循 SRP 與 SoC 原則，將期別推導、雙期別智慧輪替、5 階段步進節點、進度條百分比完全抽離封裝
 * 同時配置防禦性 defaultBatches 兜底防線，確保任何異常情境下 100% 絕對有卡片呈現
 */
export function useBatchTimeline(batchesInput: MaybeRefOrGetter<AdmissionBatch[]>) {
  const lifecycleSteps: LifecycleStep[] = [
    { key: 'register', label: '1.報名' },
    { key: 'screening', label: '2.甄試' },
    { key: 'preparing', label: '3.待訓' },
    { key: 'training', label: '4.培訓' },
    { key: 'graduation', label: '5.結訓' }
  ]

  /**
   * 取得期別的時間軸絕對權重時間戳 (用於精確時序排序，避免日期欄位缺失導致亂序)
   */
  function getBatchTimeValue(batch: AdmissionBatch): number {
    if (batch.training_start_date) {
      const t = new Date(batch.training_start_date.replace(/-/g, '/')).getTime()
      if (!isNaN(t)) return t
    }
    if (batch.enroll_start_date) {
      const t = new Date(batch.enroll_start_date.replace(/-/g, '/')).getTime()
      if (!isNaN(t)) return t
    }
    return (batch.sort_order || 0) * 1000000000000
  }

  /**
   * 取得期別生命週期的活躍優先權重 (Liveness Priority)：
   * - 4: 火熱報名中 (open / closing_soon) ➔ 核心主角，絕對優先上首頁！
   * - 3: 待開訓或甄試中 (screening / preparing) ➔ 緊湊進行中，優先保留！
   * - 2: 正式受訓中 (training) ➔ 現役衝刺班，優先保留！
   * - 1: 即將開放籌備中 (upcoming) ➔ 次要保留
   * - 0: 已圓滿結訓 (ended) ➔ 最先被輪替歸檔！
   */
  function getBatchLivenessPriority(batch: AdmissionBatch): number {
    if (isBatchEnrolling(batch)) return 4
    if (isBatchScreeningOrPreparing(batch)) return 3
    if (isBatchTraining(batch)) return 2
    if (isBatchUpcoming(batch)) return 1
    return 0
  }

  /**
   * 智慧自適應期別輪替與位置錨定 (Smart Adaptive Batch Slotting)：
   * 1. 總數 > 2 時，依活躍優先級篩選，優先淘汰已結訓舊班
   * 2. 嚴格依時間序列「左舊進行中、右新即將到來/報名中」自然流向排列
   * 3. 雙重防禦保底：若無資料自動使用 defaultBatches，確保期別卡片 100% 絕對存在
   */
  const sortedBatches = computed(() => {
    const rawList = toValue(batchesInput)
    const list = Array.isArray(rawList) && rawList.length > 0 ? rawList : defaultBatches
    const visibleBatches = [...list].filter(b => b.status_override !== 'hidden')

    if (visibleBatches.length <= 2) {
      return visibleBatches.sort((a, b) => getBatchTimeValue(a) - getBatchTimeValue(b))
    }

    const prioritized = [...visibleBatches].sort((a, b) => {
      const pDiff = getBatchLivenessPriority(b) - getBatchLivenessPriority(a)
      if (pDiff !== 0) return pDiff
      return getBatchTimeValue(b) - getBatchTimeValue(a)
    })

    const selectedTwo = prioritized.slice(0, 2)
    return selectedTwo.sort((a, b) => getBatchTimeValue(a) - getBatchTimeValue(b))
  })

  function getScreeningEndTime(screeningDateStr?: string | null): number {
    if (!screeningDateStr) return 0
    try {
      const base = new Date(screeningDateStr.replace(/-/g, '/')).getTime()
      // 甄試結束精準時間點：當天 16:35:00
      return base + (16 * 60 + 35) * 60 * 1000
    } catch {
      return 0
    }
  }

  function isScreeningEnded(batch: AdmissionBatch): boolean {
    if (!batch.screening_date) return false
    const endTime = getScreeningEndTime(batch.screening_date)
    return endTime > 0 && Date.now() >= endTime
  }

  function isBatchEnded(batch: AdmissionBatch): boolean {
    if (isCelebrationSimulated.value && batch.id === 1) return true
    return rawIsBatchEnded(batch)
  }

  function getStepStatus(batch: AdmissionBatch, stepNumber: number): 'completed' | 'active' | 'pending' {
    if (isCelebrationSimulated.value && batch.id === 1) {
      return 'completed'
    }
    const now = Date.now()
    const enrollEnd = batch.enroll_end_date ? new Date(batch.enroll_end_date.replace(/-/g, '/')).getTime() + 24 * 60 * 60 * 1000 - 1000 : 0
    const screeningEndTime = getScreeningEndTime(batch.screening_date)
    const trainStart = batch.training_start_date ? new Date(batch.training_start_date.replace(/-/g, '/')).getTime() : 0
    const trainEnd = getTrainingEndTime(batch.training_end_date)

    if (stepNumber === 1) {
      if (now > enrollEnd && enrollEnd > 0) return 'completed'
      if (isBatchEnrolling(batch)) return 'active'
      return 'pending'
    }
    if (stepNumber === 2) {
      if (screeningEndTime > 0 && now >= screeningEndTime) return 'completed'
      if (now > enrollEnd && (screeningEndTime === 0 || now < screeningEndTime)) return 'active'
      return 'pending'
    }
    if (stepNumber === 3) {
      if (now >= trainStart && trainStart > 0) return 'completed'
      if (screeningEndTime > 0 && now >= screeningEndTime && now < trainStart) return 'active'
      return 'pending'
    }
    if (stepNumber === 4) {
      if (now >= trainEnd && trainEnd > 0) return 'completed'
      if (now >= trainStart && (trainEnd === 0 || now < trainEnd)) return 'active'
      return 'pending'
    }
    if (stepNumber === 5) {
      if (now >= trainEnd && trainEnd > 0) return 'completed'
      return 'pending'
    }
    return 'pending'
  }

  /**
   * 智慧判定該期別是否具備「結訓慶典榮耀資格」：
   * 1. 該期別已結訓 (isBatchEnded)
   * 2. 且該期別為全站「最新結訓的榮耀代表」（在後端下一期資料出現並輪替前，始終維持慶典氛圍）
   */
  function isCelebrationBatch(batch: AdmissionBatch): boolean {
    if (isCelebrationSimulated.value && batch.id === 1) return true
    if (!isBatchEnded(batch)) return false
    const rawList = toValue(batchesInput)
    const list = Array.isArray(rawList) && rawList.length > 0 ? rawList : defaultBatches
    const endedBatches = list.filter(isBatchEnded)
    if (endedBatches.length === 0) return false

    // 依結訓日期降序排列，最新結訓者排首位
    const latestEnded = [...endedBatches].sort((a, b) => {
      const timeA = a.training_end_date ? new Date(a.training_end_date.replace(/-/g, '/')).getTime() : 0
      const timeB = b.training_end_date ? new Date(b.training_end_date.replace(/-/g, '/')).getTime() : 0
      return timeB - timeA
    })[0]

    return latestEnded.id === batch.id
  }



  function getApplicantsSummary(batch: AdmissionBatch): ApplicantsSummary {
    const planned = batch.planned_trainees || 24
    const count = batch.applicants_count || 0

    if (isBatchEnded(batch)) {
      return {
        label: '🏆 招訓與參訓成果',
        countText: `圓滿結訓 ${planned} 名`,
        detailText: `累計報名 ${count} 人甄試 (超額 ${Math.round((count / planned) * 100)}%)`,
        barClass: 'bg-slate-700',
        percent: 100
      }
    }

    if (isBatchTraining(batch) || isBatchScreeningOrPreparing(batch)) {
      return {
        label: '👥 正式參訓學員陣容',
        countText: `正取參訓 ${planned} 名`,
        detailText: `累計報名 ${count} 人甄試 (超額選拔)`,
        barClass: 'bg-gradient-to-r from-cyan-500 to-emerald-400 shadow-[0_0_8px_rgba(6,182,212,0.5)]',
        percent: 100
      }
    }

    if (isBatchEnrolling(batch)) {
      const pct = Math.min(100, Math.round((count / planned) * 100))
      return {
        label: '🔥 即時報名熱度',
        countText: `已報名 ${count} 人`,
        detailText: `招訓 ${planned} 名 (${pct >= 100 ? '已額滿甄試' : '席次迅速遞減中'})`,
        barClass: 'bg-gradient-to-r from-cyan-500 to-emerald-400 shadow-[0_0_8px_rgba(6,182,212,0.5)]',
        percent: pct
      }
    }

    return {
      label: '📋 預定招訓規模',
      countText: `招訓 ${planned} 名`,
      detailText: '零基礎雙螢幕教學',
      barClass: 'bg-slate-800',
      percent: 0
    }
  }

  function getLifecycleLineWidth(batch: AdmissionBatch): string {
    if (getStepStatus(batch, 5) === 'completed') return '100%'
    if (getStepStatus(batch, 4) === 'active') return '75%'
    if (getStepStatus(batch, 3) === 'active') return '50%'
    if (getStepStatus(batch, 2) === 'active') return '25%'
    if (getStepStatus(batch, 1) === 'active') return '0%'
    return '0%'
  }

  function getStepNodeClass(batch: AdmissionBatch, stepNumber: number): string {
    if (isBatchEnded(batch)) {
      return 'bg-slate-800 text-slate-400 border border-slate-700/80'
    }
    const status = getStepStatus(batch, stepNumber)
    if (status === 'completed') {
      return 'bg-emerald-500 text-slate-950 shadow-[0_0_10px_rgba(16,185,129,0.4)]'
    }
    if (status === 'active') {
      return 'bg-cyan-400 text-slate-950 font-black ring-4 ring-cyan-400/40 shadow-[0_0_16px_rgba(6,182,212,0.85)]'
    }
    return 'bg-slate-800 text-slate-500 border border-slate-700/80'
  }

  function getStepTextClass(batch: AdmissionBatch, stepNumber: number): string {
    if (isBatchEnded(batch)) return 'text-slate-500'
    const status = getStepStatus(batch, stepNumber)
    if (status === 'completed') return 'text-emerald-400 font-semibold'
    if (status === 'active') return 'text-cyan-300 font-bold'
    return 'text-slate-500'
  }

  function getTrainingProgress(batch: AdmissionBatch): TrainingProgress {
    if (!batch.training_start_date || !batch.training_end_date) {
      return { elapsedDays: 0, totalDays: 169, percent: 0, remainingDays: 0 }
    }
    try {
      // 依台灣本地日曆天對齊至當日 00:00:00，徹底消除 Math.round 四捨五入晚 12 小時跳日的缺陷
      const sDate = new Date(batch.training_start_date.replace(/-/g, '/'))
      sDate.setHours(0, 0, 0, 0)
      const sMid = sDate.getTime()

      const eDate = new Date(batch.training_end_date.replace(/-/g, '/'))
      eDate.setHours(0, 0, 0, 0)
      const eMid = eDate.getTime()

      const nowDate = new Date()
      nowDate.setHours(0, 0, 0, 0)
      const nMid = nowDate.getTime()

      const MS_PER_DAY = 1000 * 60 * 60 * 24

      // 總日曆天數（首尾皆算在內，例如 3/25~9/10 共 170 天）
      const totalDays = Math.max(1, Math.round((eMid - sMid) / MS_PER_DAY) + 1)

      // 已受訓天數（當天一踏入午夜 0 點即算入當天）
      let elapsedDays = 0
      if (nMid >= sMid) {
        elapsedDays = Math.min(totalDays, Math.round((nMid - sMid) / MS_PER_DAY) + 1)
      }

      // 距結訓天數（倒數計日）：
      // 9/9 距 9/10 結訓日剩 1 天；
      // 一過台灣時間 9/9 24:00 (即 9/10 00:00:00 結訓日當天)，距結訓立刻精準變成 0 天！
      const remainingDays = Math.max(0, Math.round((eMid - nMid) / MS_PER_DAY))
      const percent = Math.min(100, Math.round((elapsedDays / totalDays) * 100))

      return { elapsedDays, totalDays, percent, remainingDays }
    } catch {
      return { elapsedDays: 0, totalDays: 169, percent: 0, remainingDays: 0 }
    }
  }

  function formatShortDate(dateStr?: string): string {
    if (!dateStr) return ''
    const parts = dateStr.split('-')
    if (parts.length === 3) {
      return `${Number(parts[1])}/${Number(parts[2])}`
    }
    return dateStr
  }

  function getLifecycleDetailNotice(batch: AdmissionBatch): DetailNotice {
    if (isBatchEnded(batch)) {
      return {
        icon: '🎓',
        text: '920 小時全期訓練已圓滿完成 · 邁向專業前端與 AI 職場！'
      }
    }
    if (isBatchTraining(batch)) {
      const prog = getTrainingProgress(batch)
      if (prog.remainingDays <= 14) {
        const remainNotice = prog.remainingDays === 0
          ? '距結訓剩 0 天（今日結訓）！'
          : `距結訓剩 ${prog.remainingDays} 天！`
        return {
          icon: '⏳',
          text: `受訓倒數衝刺 · 已受訓 ${prog.elapsedDays}/${prog.totalDays} 天 · ${remainNotice}`
        }
      }
      return {
        icon: '🎓',
        text: `920h 培訓進行中 · 已完成 ${prog.elapsedDays}/${prog.totalDays} 天`
      }
    }
    if (isBatchScreeningOrPreparing(batch)) {
      return {
        icon: '✨',
        text: `甄試已結束 · 名單造冊中，預計 ${formatShortDate(batch.training_start_date)} 正式開訓！`
      }
    }
    if (isBatchEnrolling(batch)) {
      return {
        icon: '🔥',
        text: `官方熱烈報名中 · 把握 100% 全額補助！`
      }
    }
    if (isBatchUpcoming(batch)) {
      return {
        icon: '⏳',
        text: `新一期別籌備中 · 開訓日期即將公布`
      }
    }
    return {
      icon: '🏁',
      text: `本期訓練已正式結訓 · 報名已截止受理`
    }
  }

  return {
    lifecycleSteps,
    sortedBatches,
    getStepStatus,
    isScreeningEnded,
    isCelebrationBatch,
    getApplicantsSummary,
    getLifecycleLineWidth,
    getStepNodeClass,
    getStepTextClass,
    getTrainingProgress,
    getLifecycleDetailNotice,
    isCelebrationSimulated
  }
}

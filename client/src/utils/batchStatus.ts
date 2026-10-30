import type { AdmissionBatch } from '@/types'

/**
 * 判斷期別是否正在火熱開放報名中
 */
export function isBatchEnrolling(batch: AdmissionBatch): boolean {
  if (batch.status_override === 'open' || batch.status_override === 'closing_soon') return true
  if (batch.status_override === 'ended' || batch.status_override === 'training' || batch.status_override === 'full' || batch.status_override === 'upcoming') return false
  if (batch.dynamic_status === 'open' || batch.dynamic_status === 'closing_soon') return true
  if (!batch.enroll_start_date || !batch.enroll_end_date) return false
  try {
    const start = new Date(batch.enroll_start_date.replace(/-/g, '/')).getTime()
    const end = new Date(batch.enroll_end_date.replace(/-/g, '/')).getTime() + 24 * 60 * 60 * 1000 - 1000
    const now = Date.now()
    return now >= start && now <= end
  } catch {
    return false
  }
}

/**
 * 判斷期別是否為新班籌備中 (尚未開放報名)
 */
export function isBatchUpcoming(batch: AdmissionBatch): boolean {
  if (batch.status_override === 'upcoming') return true
  if (batch.status_override === 'open' || batch.status_override === 'closing_soon' || batch.status_override === 'training' || batch.status_override === 'ended') return false
  if (batch.dynamic_status === 'upcoming') return true
  if (!batch.enroll_start_date) return false
  try {
    const start = new Date(batch.enroll_start_date.replace(/-/g, '/')).getTime()
    return Date.now() < start
  } catch {
    return false
  }
}

/**
 * 取得結訓當天的正式結訓精確時間戳（結訓當日下午 16:35 下課時間）
 */
export function getTrainingEndTime(trainingEndDateStr?: string): number {
  if (!trainingEndDateStr) return 0
  try {
    const d = new Date(trainingEndDateStr.replace(/-/g, '/'))
    d.setHours(16, 35, 0, 0)
    return d.getTime()
  } catch {
    return 0
  }
}

/**
 * 判斷期別是否正在實體培訓進行中
 */
export function isBatchTraining(batch: AdmissionBatch): boolean {
  if (batch.status_override === 'training') return true
  if (batch.status_override === 'ended' || batch.status_override === 'open' || batch.status_override === 'closing_soon' || batch.status_override === 'upcoming') return false
  
  // 若已超過結訓日 16:35 下課時間，一律進入結訓狀態，不再視為培訓中
  if (batch.training_end_date) {
    const trainEnd = getTrainingEndTime(batch.training_end_date)
    if (trainEnd > 0 && Date.now() > trainEnd) return false
  }

  if (batch.dynamic_status === 'training') return true
  
  if (batch.training_start_date && batch.training_end_date) {
    try {
      const trainStart = new Date(batch.training_start_date.replace(/-/g, '/')).getTime()
      const trainEnd = getTrainingEndTime(batch.training_end_date)
      const now = Date.now()
      return now >= trainStart && now <= trainEnd
    } catch {
      return false
    }
  }
  return false
}

/**
 * 判斷期別是否已圓滿結訓（以結訓當日下午 16:35 為正式結訓切換點）
 */
export function isBatchEnded(batch: AdmissionBatch): boolean {
  if (batch.status_override === 'ended') return true
  if (batch.status_override === 'training') return false
  if (batch.dynamic_status === 'ended') return true
  if (!batch.training_end_date) return false
  try {
    const end = getTrainingEndTime(batch.training_end_date)
    return Date.now() > end
  } catch {
    return false
  }
}

/**
 * 判斷期別是否處於甄試中或待開訓階段 (報名已截止，正式開訓前)
 */
export function isBatchScreeningOrPreparing(batch: AdmissionBatch): boolean {
  if (isBatchTraining(batch)) return false
  if (batch.status_override === 'screening' || batch.status_override === 'preparing') return true
  if (batch.status_override === 'open' || batch.status_override === 'closing_soon' || batch.status_override === 'upcoming') return false
  if (batch.dynamic_status === 'screening' || batch.dynamic_status === 'preparing') return true
  
  if (batch.enroll_end_date && batch.training_start_date) {
    try {
      const end = new Date(batch.enroll_end_date.replace(/-/g, '/')).getTime() + 24 * 60 * 60 * 1000 - 1000
      const trainStart = new Date(batch.training_start_date.replace(/-/g, '/')).getTime()
      const now = Date.now()
      return now > end && now < trainStart
    } catch {
      return false
    }
  }
  return false
}

/**
 * 判斷期別是否已截止報名
 */
export function isBatchClosed(batch: AdmissionBatch): boolean {
  if (isBatchTraining(batch) || isBatchScreeningOrPreparing(batch)) return true
  if (batch.status_override === 'ended' || batch.status_override === 'full') return true
  if (batch.status_override === 'open' || batch.status_override === 'closing_soon') return false
  if (batch.dynamic_status === 'ended' || batch.dynamic_status === 'training' || batch.dynamic_status === 'full' || batch.dynamic_status === 'screening' || batch.dynamic_status === 'preparing') return true
  if (!batch.enroll_end_date) return false
  try {
    const end = new Date(batch.enroll_end_date.replace(/-/g, '/')).getTime() + 24 * 60 * 60 * 1000 - 1000
    return Date.now() > end
  } catch {
    return false
  }
}

/**
 * 格式化報名倒數文字
 */
function getCountdownText(endDateStr?: string): string {
  if (!endDateStr) return '熱烈招生中'
  try {
    const end = new Date(endDateStr.replace(/-/g, '/')).getTime() + 24 * 60 * 60 * 1000 - 1000
    const diff = end - Date.now()
    if (diff <= 0) return '報名已截止'
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    if (days === 0) {
      const hours = Math.floor(diff / (1000 * 60 * 60))
      return `⏳ 最後 ${hours} 小時！`
    }
    return `⏳ 倒數 ${days} 天截止`
  } catch {
    return '熱烈招生中'
  }
}

/**
 * 從完整班名提取精簡期別字樣（例如 "第 1 期"、"第 2 期"）
 */
function getShortBatchName(name: string): string {
  const match = name.match(/第\s*\d+\s*期/)
  return match ? match[0] : name
}

export interface EnrollmentNotice {
  isOpen: boolean
  targetBatch: AdmissionBatch | null
  badgeText: string
  headline: string
  subline: string
  theme: 'emerald' | 'amber'
}

/**
 * 全面分析當前所有期別的報名狀態，產出讓民眾一眼秒懂的狀態摘要
 */
export function getBatchEnrollmentNotice(batches: AdmissionBatch[]): EnrollmentNotice {
  if (!batches || batches.length === 0) {
    return {
      isOpen: false,
      targetBatch: null,
      badgeText: '期別資訊載入中',
      headline: '正在同步最新招生時程...',
      subline: '請稍候，或直接參考下方期別卡片資訊。',
      theme: 'amber'
    }
  }

  // 尋找當前正在開放報名的期別（依 sort_order 排序，優先取第一順位開放者）
  const sorted = [...batches].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
  const enrollingBatches = sorted.filter(isBatchEnrolling)

  if (enrollingBatches.length > 0) {
    const target = enrollingBatches[0]
    const shortName = getShortBatchName(target.batch_name)
    const countdown = getCountdownText(target.enroll_end_date)
    return {
      isOpen: true,
      targetBatch: target,
      badgeText: '🔥 報名中',
      headline: `目前開放報名：【${shortName}】（代碼：${target.course_code || '請見卡片'}）`,
      subline: `截止至 ${target.enroll_end_date || '即日起'}（${countdown}），點擊下方卡片即可報名。`,
      theme: 'emerald'
    }
  }

  // 若無開放報名，檢查是否有即將開放報名的新班
  const upcomingBatches = sorted.filter(isBatchUpcoming)
  if (upcomingBatches.length > 0) {
    const target = upcomingBatches[0]
    const shortName = getShortBatchName(target.batch_name)
    return {
      isOpen: false,
      targetBatch: target,
      badgeText: '⏳ 籌備中',
      headline: `下一期（${shortName}）即將開放報名`,
      subline: `預計報名起始日：${target.enroll_start_date || '即將公布'}，敬請期待。`,
      theme: 'amber'
    }
  }

  // 若所有既有班級均已截止（如目前：第 1 期培訓中、第 2 期待開訓）
  const trainingBatches = sorted.filter(isBatchTraining)
  const screeningBatches = sorted.filter(isBatchScreeningOrPreparing)

  const statusDetails: string[] = []
  if (trainingBatches.length > 0) {
    const names = trainingBatches.map(b => getShortBatchName(b.batch_name)).join('、')
    statusDetails.push(`${names}培訓中`)
  }
  if (screeningBatches.length > 0) {
    const names = screeningBatches.map(b => getShortBatchName(b.batch_name)).join('、')
    statusDetails.push(`${names}待開訓`)
  }

  const statusSummary = statusDetails.length > 0 ? `（${statusDetails.join(' · ')}）` : ''

  return {
    isOpen: false,
    targetBatch: null,
    badgeText: '📢 暫無開放',
    headline: `目前期別報名皆已截止 ${statusSummary}`,
    subline: '新期別招生時程籌備中，敬請留意官方最新公告。',
    theme: 'amber'
  }
}

export interface NavbarAdmissionBadge {
  text: string
  fullText: string
  class: string
  dotClass: string
  hasDot: boolean
  ctaText: string
  isEnrolling: boolean
}

/**
 * 針對導覽列 Navbar 的招生期別項目產出精巧狀態微徽章
 * 核心規則：僅在「有期別開放報名」時才顯現徽章提示，其餘狀態保持純文字導覽列不打擾
 */
export function getNavbarAdmissionBadge(batches: AdmissionBatch[]): NavbarAdmissionBadge | null {
  if (!batches || batches.length === 0) {
    return null
  }

  const sorted = [...batches].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
  const enrollingBatches = sorted.filter(isBatchEnrolling)

  // 只有當前有期別開放報名時，才在導覽列顯示提示徽章
  if (enrollingBatches.length > 0) {
    const target = enrollingBatches[0]
    const shortName = getShortBatchName(target.batch_name)
    return {
      text: `${shortName}報名中`,
      fullText: `${shortName} 火熱報名中`,
      class: 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 shadow-[0_0_8px_rgba(16,185,129,0.35)]',
      dotClass: 'bg-emerald-400 animate-ping',
      hasDot: true,
      ctaText: '立即線上報名',
      isEnrolling: true
    }
  }

  // 無任何期別開放報名時，不顯示任何徽章
  return null
}



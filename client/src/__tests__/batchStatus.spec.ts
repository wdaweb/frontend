import { describe, expect, it } from 'vitest'
import type { AdmissionBatch } from '../types'
import {
  getBatchEnrollmentNotice,
  getNavbarAdmissionBadge,
  getTrainingEndTime,
  isBatchClosed,
  isBatchEnded,
  isBatchEnrolling,
  isBatchScreeningOrPreparing,
  isBatchTraining,
  isBatchUpcoming
} from '../utils/batchStatus'

// 輔助函式：建立模擬期別資料
function createMockBatch(overrides: Partial<AdmissionBatch> = {}): AdmissionBatch {
  return {
    id: 1,
    batch_name: '前端網頁技術與AI應用 第 1 期',
    total_hours: 920,
    enroll_start_date: '2026-01-01',
    enroll_end_date: '2026-02-15',
    screening_date: '2026-02-20',
    training_start_date: '2026-03-01',
    training_end_date: '2026-08-15',
    apply_url: 'https://its.taiwanjobs.gov.tw/Course/Detail?ID=159268',
    course_code: '159268',
    dynamic_status: 'open',
    status_override: '',
    click_count: 0,
    sort_order: 1,
    ...overrides
  }
}

describe('batchStatus 雙期別狀態判定核心測試', () => {
  describe('isBatchEnrolling 報名中狀態判定', () => {
    it('當 status_override 為 open 時應回傳 true', () => {
      const batch = createMockBatch({ status_override: 'open' })
      expect(isBatchEnrolling(batch)).toBe(true)
    })

    it('當 status_override 為 closing_soon 時應回傳 true', () => {
      const batch = createMockBatch({ status_override: 'closing_soon' })
      expect(isBatchEnrolling(batch)).toBe(true)
    })

    it('當 status_override 為 ended 或 training 時應回傳 false', () => {
      expect(isBatchEnrolling(createMockBatch({ status_override: 'ended' }))).toBe(false)
      expect(isBatchEnrolling(createMockBatch({ status_override: 'training' }))).toBe(false)
    })

    it('無 status_override 時依 dynamic_status 為 open 回傳 true', () => {
      const batch = createMockBatch({ status_override: '', dynamic_status: 'open' })
      expect(isBatchEnrolling(batch)).toBe(true)
    })
  })

  describe('isBatchUpcoming 籌備中狀態判定', () => {
    it('當 status_override 為 upcoming 時應回傳 true', () => {
      const batch = createMockBatch({ status_override: 'upcoming' })
      expect(isBatchUpcoming(batch)).toBe(true)
    })

    it('當 status_override 為 open 或 training 時應回傳 false', () => {
      expect(isBatchUpcoming(createMockBatch({ status_override: 'open' }))).toBe(false)
      expect(isBatchUpcoming(createMockBatch({ status_override: 'training' }))).toBe(false)
    })
  })

  describe('getTrainingEndTime 結訓時刻計算', () => {
    it('應將結訓日期準確計算至當日下午 16:35:00', () => {
      const timestamp = getTrainingEndTime('2026-10-30')
      const date = new Date(timestamp)
      expect(date.getFullYear()).toBe(2026)
      expect(date.getMonth()).toBe(9) // 10 月為 index 9
      expect(date.getDate()).toBe(30)
      expect(date.getHours()).toBe(16)
      expect(date.getMinutes()).toBe(35)
      expect(date.getSeconds()).toBe(0)
    })

    it('若日期為空應回傳 0', () => {
      expect(getTrainingEndTime(undefined)).toBe(0)
      expect(getTrainingEndTime('')).toBe(0)
    })
  })

  describe('isBatchTraining 實體培訓中判定', () => {
    it('當 status_override 為 training 時應回傳 true', () => {
      const batch = createMockBatch({ status_override: 'training' })
      expect(isBatchTraining(batch)).toBe(true)
    })

    it('當 status_override 為 ended 時應回傳 false', () => {
      const batch = createMockBatch({ status_override: 'ended' })
      expect(isBatchTraining(batch)).toBe(false)
    })
  })

  describe('isBatchEnded 圓滿結訓判定', () => {
    it('當 status_override 為 ended 時應回傳 true', () => {
      const batch = createMockBatch({ status_override: 'ended' })
      expect(isBatchEnded(batch)).toBe(true)
    })

    it('當 dynamic_status 為 ended 時應回傳 true', () => {
      const batch = createMockBatch({ dynamic_status: 'ended' })
      expect(isBatchEnded(batch)).toBe(true)
    })

    it('若結訓時間已過下午 16:35 應判定為結訓', () => {
      // 傳入過去的時間
      const batch = createMockBatch({
        status_override: '',
        dynamic_status: 'training',
        training_end_date: '2020-01-01'
      })
      expect(isBatchEnded(batch)).toBe(true)
    })
  })

  describe('isBatchScreeningOrPreparing 待開訓或甄試中判定', () => {
    it('當 status_override 為 screening 或 preparing 時應回傳 true', () => {
      expect(isBatchScreeningOrPreparing(createMockBatch({ status_override: 'screening' }))).toBe(true)
      expect(isBatchScreeningOrPreparing(createMockBatch({ status_override: 'preparing' }))).toBe(true)
    })
  })

  describe('isBatchClosed 報名截止判定', () => {
    it('若期別已結訓或培訓中應判定為截止', () => {
      expect(isBatchClosed(createMockBatch({ status_override: 'ended' }))).toBe(true)
      expect(isBatchClosed(createMockBatch({ status_override: 'training' }))).toBe(true)
    })

    it('若期別開放報名中應判定為未截止', () => {
      expect(isBatchClosed(createMockBatch({ status_override: 'open' }))).toBe(false)
    })
  })

  describe('getBatchEnrollmentNotice 雙期別看板綜合摘要', () => {
    it('空期別陣列應具備防禦性兜底，不引發例外崩潰', () => {
      const notice = getBatchEnrollmentNotice([])
      expect(notice.isOpen).toBe(false)
      expect(notice.badgeText).toContain('載入中')
    })

    it('當第 1 期培訓中、第 2 期待開訓時，看板應顯示報名皆已截止之友善提示', () => {
      const batch1 = createMockBatch({
        id: 1,
        batch_name: '前端網頁技術與AI應用 第 1 期',
        status_override: 'training'
      })
      const batch2 = createMockBatch({
        id: 2,
        batch_name: '前端網頁技術與AI應用 第 2 期',
        status_override: 'preparing'
      })

      const notice = getBatchEnrollmentNotice([batch1, batch2])
      expect(notice.isOpen).toBe(false)
      expect(notice.badgeText).toContain('暫無開放')
      expect(notice.headline).toContain('目前期別報名皆已截止')
      expect(notice.theme).toBe('amber')
    })

    it('當有期別開放報名時，應優先擷取該期別資訊與倒數狀態', () => {
      const batch1 = createMockBatch({
        id: 1,
        batch_name: '前端網頁技術與AI應用 第 1 期',
        status_override: 'ended'
      })
      const batch2 = createMockBatch({
        id: 2,
        batch_name: '前端網頁技術與AI應用 第 2 期',
        status_override: 'open',
        course_code: '159269'
      })

      const notice = getBatchEnrollmentNotice([batch1, batch2])
      expect(notice.isOpen).toBe(true)
      expect(notice.badgeText).toContain('報名中')
      expect(notice.headline).toContain('第 2 期')
      expect(notice.headline).toContain('159269')
      expect(notice.theme).toBe('emerald')
    })
  })

  describe('getNavbarAdmissionBadge 導覽列提示徽章', () => {
    it('當無任何期別開放報名時應回傳 null（保持純文字不打擾）', () => {
      const batch1 = createMockBatch({ status_override: 'training' })
      const batch2 = createMockBatch({ status_override: 'preparing' })
      const badge = getNavbarAdmissionBadge([batch1, batch2])
      expect(badge).toBeNull()
    })

    it('當有期別開放報名時應回傳對應的導覽列徽章', () => {
      const batch1 = createMockBatch({ status_override: 'ended' })
      const batch2 = createMockBatch({
        batch_name: '第 2 期',
        status_override: 'open'
      })
      const badge = getNavbarAdmissionBadge([batch1, batch2])
      expect(badge).not.toBeNull()
      expect(badge?.isEnrolling).toBe(true)
      expect(badge?.text).toContain('第 2 期報名中')
      expect(badge?.ctaText).toBe('立即線上報名')
    })
  })
})

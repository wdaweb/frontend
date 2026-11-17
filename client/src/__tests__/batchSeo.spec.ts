/**
 * 招生期別 SEO 產生器測試：新期別上線時，描述與結構化資料需自動帶出最新課程代碼
 */
import { describe, expect, it } from 'vitest'
import type { AdmissionBatch } from '../types'
import { buildBatchSeoSummary, buildCourseJsonLd, pickSeoBatches, shortBatchName } from '../utils/batchSeo'

function batch(overrides: Partial<AdmissionBatch>): AdmissionBatch {
  return {
    id: 1,
    batch_name: '前端網頁技術與AI應用（第 1 期）',
    total_hours: 920,
    enroll_start_date: '2025-12-04',
    enroll_end_date: '2026-02-25',
    screening_date: null,
    training_start_date: '2026-03-25',
    training_end_date: '2026-09-10',
    apply_url: 'https://its.taiwanjobs.gov.tw/Course/Detail?ID=159268',
    course_code: '159268',
    dynamic_status: 'ended',
    status_override: 'auto',
    click_count: 0,
    sort_order: 1,
    ...overrides,
  }
}

const batch1 = batch({})
const batch2 = batch({
  id: 2, batch_name: '前端網頁技術與AI應用（第 2 期）', course_code: '159269',
  enroll_start_date: '2026-05-07', enroll_end_date: '2026-08-21',
  apply_url: 'https://its.taiwanjobs.gov.tw/Course/Detail?ID=159269',
})
const batch3 = batch({
  id: 3, batch_name: '前端網頁技術與AI應用班第3期', course_code: '170001',
  enroll_start_date: '2099-12-01', enroll_end_date: '2099-12-31',
  training_start_date: '2100-02-01', training_end_date: '2100-08-01',
  apply_url: 'https://its.taiwanjobs.gov.tw/Course/Detail?ID=170001', dynamic_status: 'upcoming',
})

describe('招生期別 SEO 產生器', () => {
  it('期數名稱統一為「第 N 期」', () => {
    expect(shortBatchName('前端網頁技術與AI應用（第 1 期）')).toBe('第 1 期')
    expect(shortBatchName('前端網頁技術與AI應用班第3期')).toBe('第 3 期')
    expect(shortBatchName('特別班')).toBe('特別班')
  })

  it('只取最新兩期，並排除前台隱藏的期別', () => {
    const picked = pickSeoBatches([batch1, batch2, batch3, batch({ id: 9, course_code: '999', enroll_start_date: '2100-01-01', status_override: 'hidden' })])
    expect(picked.map((b) => b.course_code)).toEqual(['170001', '159269'])
  })

  it('新期別出現時，描述自動帶出新課程代碼與報名期間', () => {
    const summary = buildBatchSeoSummary([batch1, batch2, batch3])
    expect(summary).toBe('第 3 期（課程代碼 170001，報名 2099/12/01～2099/12/31）、第 2 期（課程代碼 159269，報名 2026/05/07～2026/08/21）')
    expect(summary).not.toContain('159268')
  })

  it('沒有期別資料時回傳空字串與 null', () => {
    expect(buildBatchSeoSummary([])).toBe('')
    expect(buildBatchSeoSummary(null)).toBe('')
    expect(buildCourseJsonLd([])).toBeNull()
  })

  it('結構化資料包含各期 CourseInstance 與報名狀態', () => {
    const jsonLd = buildCourseJsonLd([batch2, batch3]) as any
    expect(jsonLd['@type']).toBe('Course')
    expect(jsonLd.hasCourseInstance).toHaveLength(2)
    const upcoming = jsonLd.hasCourseInstance.find((i: any) => i.offers.url.includes('170001'))
    expect(upcoming.offers.availability).toBe('https://schema.org/PreOrder')
    expect(upcoming.offers.validFrom).toBe('2099-12-01')
    expect(upcoming.startDate).toBe('2100-02-01')
    const ended = jsonLd.hasCourseInstance.find((i: any) => i.offers.url.includes('159269'))
    expect(ended.offers.availability).toBe('https://schema.org/SoldOut')
  })
})

import type { AdmissionBatch } from '@/types'
import { isBatchEnrolling, isBatchUpcoming } from '@/utils/batchStatus'

/**
 * 招生期別 SEO 文字與結構化資料產生器
 * 期別資料一律來自後台（爬蟲自台灣就業通同步），新期別上線時頁面描述與 Course 結構化資料會自動更新，
 * 不需手動修改任何課程代碼或日期。
 */

const SITE_URL = 'https://wdaweb.github.io/frontend'
const MAX_SEO_BATCHES = 2

/** 前台實際顯示的期別（排除隱藏），依報名開始日新到舊，取最近的兩期 */
export function pickSeoBatches(batches: AdmissionBatch[] | null | undefined): AdmissionBatch[] {
  if (!Array.isArray(batches)) return []
  return batches
    .filter((b) => b && b.status_override !== 'hidden' && b.course_code)
    .sort((a, b) => (b.enroll_start_date || '').localeCompare(a.enroll_start_date || ''))
    .slice(0, MAX_SEO_BATCHES)
}

/** 「前端網頁技術與AI應用（第 3 期）」→「第 3 期」；無期數時沿用原名 */
export function shortBatchName(name: string): string {
  const match = (name || '').match(/第\s*(\d+)\s*期/)
  return match ? `第 ${match[1]} 期` : name
}

function formatDate(value?: string | null): string {
  return value ? value.replace(/-/g, '/') : ''
}

/** 例：「第 3 期（課程代碼 170001，報名 2026/12/01～2026/12/31）、第 2 期（…）」 */
export function buildBatchSeoSummary(batches: AdmissionBatch[] | null | undefined): string {
  return pickSeoBatches(batches)
    .map((b) => {
      const period = b.enroll_start_date && b.enroll_end_date
        ? `，報名 ${formatDate(b.enroll_start_date)}～${formatDate(b.enroll_end_date)}`
        : ''
      return `${shortBatchName(b.batch_name)}（課程代碼 ${b.course_code}${period}）`
    })
    .join('、')
}

function availabilityOf(batch: AdmissionBatch): string {
  if (isBatchEnrolling(batch)) return 'https://schema.org/InStock'
  if (isBatchUpcoming(batch)) return 'https://schema.org/PreOrder'
  return 'https://schema.org/SoldOut'
}

/** 依期別資料產生 schema.org Course（含各期 CourseInstance 與報名期間） */
export function buildCourseJsonLd(batches: AdmissionBatch[] | null | undefined): Record<string, any> | null {
  const list = pickSeoBatches(batches)
  if (list.length === 0) return null
  return {
    '@type': 'Course',
    '@id': `${SITE_URL}/admission/#course`,
    name: '前端網頁技術與AI應用',
    description: '勞動部勞動力發展署北基宜花金馬分署泰山職業訓練場自辦 920 小時前端網頁技術與 AI 應用職前訓練。',
    provider: { '@id': `${SITE_URL}/#organization` },
    hasCourseInstance: list.map((b) => ({
      '@type': 'CourseInstance',
      name: b.batch_name,
      courseMode: 'Onsite',
      courseWorkload: `PT${b.total_hours || 920}H`,
      ...(b.training_start_date ? { startDate: b.training_start_date } : {}),
      ...(b.training_end_date ? { endDate: b.training_end_date } : {}),
      offers: {
        '@type': 'Offer',
        category: 'Free',
        price: '0',
        priceCurrency: 'TWD',
        url: b.apply_url,
        availability: availabilityOf(b),
        ...(b.enroll_start_date ? { validFrom: b.enroll_start_date } : {}),
        ...(b.enroll_end_date ? { validThrough: b.enroll_end_date } : {}),
      },
    })),
  }
}

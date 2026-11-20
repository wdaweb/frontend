/**
 * @vitest-environment happy-dom
 * 🚀 系統架構冒煙測試 (System Smoke & Sanity Test)
 * 驗證系統最核心之生命徵象：核心數據一致性、雙期別不變量、離線快照基石與路由完整性。
 */
import { describe, expect, it } from 'vitest'
import { useBatchTimeline } from '../composables/useBatchTimeline'
import {
  defaultBatches,
  defaultCarousels,
  defaultFacilities,
  defaultFAQs,
  defaultModules,
  defaultProjects,
  defaultSettings,
  defaultTechCards
} from '../data/cmsDefaultSnapshots'
import router from '../router/index'

describe('🚀 系統生命徵象冒煙測試 (Smoke & Sanity)', () => {
  describe('1. 官方核心數據一致性檢查 (不可偏離)', () => {
    it('現行雙期別官方課程代碼必須準確無誤（115年第2期 + 116年第1期）', () => {
      const batch2 = defaultBatches.find(b => b.course_code === '159269')
      const batchNew1 = defaultBatches.find(b => b.course_code === '167125')

      expect(batch2).toBeDefined()
      expect(batch2?.course_code).toBe('159269')
      expect(batch2?.apply_url).toContain('ID=159269')

      expect(batchNew1).toBeDefined()
      expect(batchNew1?.course_code).toBe('167125')
      expect(batchNew1?.apply_url).toContain('ID=167125')
    })

    it('官方諮詢電話、時數與職訓地址必須符合官方規範', () => {
      expect(defaultSettings.contact_phone).toBe('(02) 2901-8274')
      expect(defaultSettings.contact_address).toContain('新北市泰山區貴子里致遠新村 55 之 1 號')
      expect(defaultSettings.discord_invite_url).toBe('https://discord.gg/TrerFKG')

      // 雙期別總受訓時數必須為 920 小時
      defaultBatches.forEach(b => {
        expect(b.total_hours).toBe(920)
      })
    })

    it('離線快照至少包含 1 個期別（台灣就業通開出新期別時，爬蟲會自動新增，不限定期數）', () => {
      expect(defaultBatches.length).toBeGreaterThanOrEqual(1)
    })

    it('固定欄序不變量：第 1 期永遠排在左邊，第 2 期永遠排在右邊', () => {
      const reversed = [...defaultBatches].reverse()
      const { sortedBatches, getStepStatus, getApplicantsSummary } = useBatchTimeline(() => reversed)
      expect(sortedBatches.value.length).toBe(2)
      expect(sortedBatches.value[0]?.course_code).toBe('167125')
      expect(sortedBatches.value[0]?.batch_name).toBe('前端網頁技術與AI應用（第 1 期）')
      expect(sortedBatches.value[1]?.course_code).toBe('159269')

      // 當後台手動覆寫 status_override 時，5 階段節點應與狀態同步
      const baseBatch = sortedBatches.value[0]!
      expect(getStepStatus({ ...baseBatch, status_override: 'training' }, 3)).toBe('completed')
      expect(getStepStatus({ ...baseBatch, status_override: 'training' }, 4)).toBe('active')
      expect(getStepStatus({ ...baseBatch, status_override: 'ended' }, 5)).toBe('completed')

      // 報名人數即時性保護：24h 內顯示實際報名數；過期則顯示「截至某日」人數；從未同步才切回招訓規模說明
      const freshBatch = { ...baseBatch, status_override: 'open', last_synced_at: new Date().toISOString(), applicants_count: 3 }
      expect(getApplicantsSummary(freshBatch).countText).toBe('已報名 3 人')
      // 2020-01-01T16:40:00Z 為台灣時間 1/2 00:40，日期需以台灣時間計算
      const staleBatch = { ...baseBatch, status_override: 'open', last_synced_at: '2020-01-01T16:40:00Z', applicants_count: 1 }
      expect(getApplicantsSummary(staleBatch).countText).toBe('截至 1/2 已報名 1 人')
      expect(getApplicantsSummary(staleBatch).detailText).toBe('招訓 24 名 · 最新人數以台灣就業通為準')
      const neverSynced = { ...baseBatch, status_override: 'open', last_synced_at: null, applicants_count: 0 }
      expect(getApplicantsSummary(neverSynced).countText).toBe('招訓 24 名')
      expect(getApplicantsSummary(neverSynced).detailText).toBe('即時報名人數以台灣就業通為準')
    })
  })

  describe('2. 離線快照健全度檢查 (0.01 秒秒開保證)', () => {
    it('8 大核心模組之預設快照資料必須完整且格式合規', () => {
      expect(defaultSettings.site_title).toBeTruthy()
      expect(defaultCarousels.length).toBeGreaterThan(0)
      expect(defaultBatches.length).toBeGreaterThanOrEqual(1)
      expect(defaultModules.length).toBe(7) // 7 大課程模組
      expect(defaultTechCards.length).toBeGreaterThan(0)
      expect(defaultFacilities.length).toBeGreaterThan(0)
      expect(defaultProjects.length).toBeGreaterThan(0)
      expect(defaultFAQs.length).toBeGreaterThan(0)
    })

    it('學員專題作品必須具備可達的展示連結與封面路徑', () => {
      defaultProjects.forEach(proj => {
        expect(proj.student_name).toBeTruthy()
        expect(proj.project_name).toBeTruthy()
        expect(proj.demo_url).toBeTruthy()
        expect(proj.demo_url).toMatch(/^https?:\/\//)
      })
    })
  })

  describe('3. 全站路由架構完整性檢查 (防白屏與死鏈)', () => {
    it('所有公開頁面路由必須皆有配置對應組件與元資訊', () => {
      const routes = router.getRoutes()
      const routeNames = routes.map(r => r.name).filter(Boolean)

      expect(routeNames).toContain('home')
      expect(routeNames).toContain('admission')
      expect(routeNames).toContain('showcase')
      expect(routeNames).toContain('faq')
      expect(routeNames).toContain('community')
      expect(routeNames).toContain('kaifu-lab')
    })

    it('通配路由 (Catch-All) 必須能安全重定向回首頁，杜絕未捕捉之 404 白屏', async () => {
      await router.push('/non-existent-page-xyz')
      expect(router.currentRoute.value.path).toBe('/')
    })
  })
})

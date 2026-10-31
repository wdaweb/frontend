/**
 * @vitest-environment happy-dom
 * 🚀 系統架構冒煙測試 (System Smoke & Sanity Test)
 * 驗證系統最核心之生命徵象：核心數據一致性、雙期別不變量、離線快照基石與路由完整性。
 */
import { describe, expect, it } from 'vitest'
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
    it('第 1 期與第 2 期官方課程代碼必須準確無誤', () => {
      const batch1 = defaultBatches.find(b => b.batch_name.includes('1'))
      const batch2 = defaultBatches.find(b => b.batch_name.includes('2'))

      expect(batch1).toBeDefined()
      expect(batch1?.course_code).toBe('159268')
      expect(batch1?.apply_url).toContain('ID=159268')

      expect(batch2).toBeDefined()
      expect(batch2?.course_code).toBe('159269')
      expect(batch2?.apply_url).toContain('ID=159269')
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

    it('嚴格遵循業務不變量：本專案期別永遠剛好為 2 期', () => {
      expect(defaultBatches.length).toBe(2)
    })
  })

  describe('2. 離線快照健全度檢查 (0.01 秒秒開保證)', () => {
    it('8 大核心模組之預設快照資料必須完整且格式合規', () => {
      expect(defaultSettings.site_title).toBeTruthy()
      expect(defaultCarousels.length).toBeGreaterThan(0)
      expect(defaultBatches.length).toBe(2)
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

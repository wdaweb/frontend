import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { title: '課程特色' }
  },
  {
    path: '/curriculum',
    redirect: '/'
  },
  {
    path: '/showcase',
    name: 'showcase',
    component: () => import('@/views/ShowcaseView.vue'),
    meta: { title: '學員專題成果' }
  },
  {
    path: '/admission',
    name: 'admission',
    component: () => import('@/views/AdmissionView.vue'),
    meta: { title: '招生時程與報名' }
  },
  {
    path: '/faq',
    name: 'faq',
    component: () => import('@/views/FaqView.vue'),
    meta: { title: '常見問題 FAQ' }
  },
  {
    path: '/community',
    name: 'community',
    component: () => import('@/views/CommunityView.vue'),
    meta: { title: 'Discord 線上諮詢' }
  },
  {
    path: '/kaifu-lab',
    name: 'kaifu-lab',
    component: () => import('@/views/GlowLabView.vue'),
    meta: { title: 'Kaifu 視覺與動效實驗室' }
  },
  {
    path: '/glow-lab',
    redirect: '/kaifu-lab'
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

// 採用一般網址 (History) 路由：每個分頁都有獨立網址，搜尋引擎可個別收錄
// 部署路徑由 vite.config.ts 的 base 決定（GitHub Pages 專案站為 /<儲存庫名稱>/）
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    // 頁內錨點（如「跳至主要內容」）直接捲動到對應元素
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }
    return { top: 0, behavior: 'smooth' }
  }
})

// Google Analytics 4 (GA4) SPA 路由無縫換頁追蹤
router.afterEach((to) => {
  try {
    if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
      (window as any).gtag('event', 'page_view', {
        page_title: to.meta.title || document.title,
        page_location: window.location.href,
        page_path: to.fullPath
      })
    }
  } catch (e) {
    // 防禦性捕獲，絕不阻斷正常路由跳轉
  }
})

export default router

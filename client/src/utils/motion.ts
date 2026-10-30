import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

/**
 * 全域動效單一標準配置 (Global Unified Motion Standards)
 * 全站所有 Section 與卡片的滾動進場動畫，強制 100% 共用此參數！
 */
const GLOBAL_MOTION = {
  // 核心進場位移 (優雅微升，嚴禁過度位移或 scale 膨脹突變)
  yOffset: 28,
  // 核心動畫時長 (溫潤沉穩，保證極致絲滑)
  duration: 1.0,
  // 列表/卡片交錯間隔
  stagger: 0.08,
  // 全站統一緩動曲線 (Quad 溫和減速，起步初速度低，杜絕猛衝突快感)
  ease: 'power1.out',
  // ScrollTrigger 統一觸發點 (元素頂部進入視窗 88% 時自然浮現)
  scrollTrigger: {
    start: 'top 88%',
    once: true
  }
} as const

export interface ScrollStaggerOptions {
  yOffset?: number
  duration?: number
  stagger?: number
  ease?: string
  start?: string
  once?: boolean
}

/**
 * 全站統一的滾動交錯進場調度函式
 * @param targets 目標選擇器或元素集合 (例如: '.highlight-card', '.tech-card')
 * @param trigger 觸發容器選擇器或元素 (例如: '#highlights-cards-grid')
 * @param options 選填覆寫參數
 * @returns gsap.Context 實例，供 onUnmounted 中呼叫 ctx.revert()
 */
export function createScrollStagger(
  targets: gsap.DOMTarget,
  trigger: gsap.DOMTarget,
  options?: ScrollStaggerOptions
): gsap.Context {
  return gsap.context(() => {
    // 無障礙減動偵測
    const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const y = options?.yOffset ?? GLOBAL_MOTION.yOffset
    const duration = options?.duration ?? GLOBAL_MOTION.duration
    const stagger = options?.stagger ?? GLOBAL_MOTION.stagger
    const ease = options?.ease ?? GLOBAL_MOTION.ease
    const start = options?.start ?? GLOBAL_MOTION.scrollTrigger.start
    const once = options?.once ?? GLOBAL_MOTION.scrollTrigger.once

    gsap.fromTo(
      targets,
      {
        y,
        opacity: 0
      },
      {
        y: 0,
        opacity: 1,
        duration,
        stagger,
        ease,
        scrollTrigger: {
          trigger,
          start,
          once
        },
        clearProps: 'transform,opacity'
      }
    )
  })
}

/**
 * 透過原生硬體加速平滑滾動進行極速平滑回頂
 * 徹底解決 GSAP ScrollToPlugin autoKill 在 CSS scroll-behavior: smooth 下被誤殺中斷之衝突
 * @param _duration 保留函式簽名相容性
 */
export function smoothScrollToTop(_duration = 0.8) {
  if (typeof window === 'undefined') return

  // 1. 優先透過標準原生平滑滾動 (配合 html { scroll-behavior: smooth } 享受 GPU 合成器線程硬體加速)
  try {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    })
  } catch {
    window.scrollTo(0, 0)
  }

  // 2. 備援防禦：相容個別行動端/WebKit/Gecko 瀏覽器可能獨立滾動 documentElement 或 body 的情境
  if (document.documentElement && document.documentElement.scrollTop > 0) {
    try {
      document.documentElement.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    } catch {
      document.documentElement.scrollTop = 0
    }
  }
  if (document.body && document.body.scrollTop > 0) {
    try {
      document.body.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    } catch {
      document.body.scrollTop = 0
    }
  }
}

export { gsap, ScrollTrigger, ScrollToPlugin }


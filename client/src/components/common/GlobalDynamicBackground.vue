<template>
  <div class="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
    <!-- 1. 底層 WebGL 3D 宇宙星雲與恆星微粒 -->
    <canvas ref="canvasRef" class="w-full h-full block absolute inset-0"></canvas>
    <!-- 2. 頂層 Awwwards 級 360° 天球仰望偶發流星光學層 -->
    <canvas ref="meteorCanvasRef" class="w-full h-full block absolute inset-0 pointer-events-none"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useThemeStore } from '@/stores/useThemeStore'
import type { ThreeNebulaEngine } from '@/engines/background/threeNebulaEngine'
import { MeteorCanvasSystem } from '@/engines/background/meteorCanvasSystem'

const canvasRef = ref<HTMLCanvasElement | null>(null)
const meteorCanvasRef = ref<HTMLCanvasElement | null>(null)
const store = useThemeStore()
const route = useRoute()

let threeEngine: ThreeNebulaEngine | null = null
let meteorSystem: MeteorCanvasSystem | null = null

let animId: number | null = null
let isMobileDevice = false
let prefersReducedMotion = false
let isPageHidden = false

function updateDeviceCapabilities() {
  if (typeof window === 'undefined') return
  isMobileDevice = window.innerWidth < 768 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
  prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function handleMouseMove(e: MouseEvent) {
  threeEngine?.handleMouseMove(e)
}

function handleResize() {
  updateDeviceCapabilities()
  const w = window.innerWidth
  const h = window.innerHeight
  const dpr = threeEngine ? threeEngine.getOptimalDpr() : 1

  threeEngine?.resize(w, h, dpr)
  meteorSystem?.resize(w, h, dpr)
}

function handleVisibilityChange() {
  if (typeof document === 'undefined') return
  if (document.hidden) {
    isPageHidden = true
    if (animId) {
      cancelAnimationFrame(animId)
      animId = null
    }
  } else {
    isPageHidden = false
    threeEngine?.resetClock()
    if (!animId) {
      renderLoop()
    }
  }
}

let lastTimestamp = 0
let lowFpsFrames = 0
let isComponentMounted = true
let threeInitTimer: ReturnType<typeof setTimeout> | null = null

// 非同步動態加載 Three.js 星雲物理引擎 (首屏極速秒開，延遲非阻塞加載 500kB 3D 核心)
async function initThreeNebulaAsync() {
  if (!isComponentMounted || !canvasRef.value || threeEngine) return
  try {
    const { ThreeNebulaEngine } = await import('@/engines/background/threeNebulaEngine')
    if (!isComponentMounted || !canvasRef.value) return
    threeEngine = new ThreeNebulaEngine({
      canvas: canvasRef.value,
      store,
      getIsMobile: () => isMobileDevice,
      getPrefersReducedMotion: () => prefersReducedMotion
    })
    threeEngine.init()
    const w = window.innerWidth
    const h = window.innerHeight
    const dpr = threeEngine.getOptimalDpr()
    threeEngine.resize(w, h, dpr)
  } catch (err) {
    console.warn('Three.js 背景星雲異步載入提示:', err)
  }
}

function renderLoop(timestamp: number = performance.now()) {
  if (isPageHidden) return
  animId = requestAnimationFrame(renderLoop)

  const rawDt = lastTimestamp ? (timestamp - lastTimestamp) / 1000 : 0.016
  const dt = Math.min(rawDt, 0.1)
  lastTimestamp = timestamp

  // 動態 FPS 感知調頻：若偵測到連續掉幀 (如手機劇烈滾動或低階省電模式)，隔幀渲染以保護主執行緒
  if (rawDt > 0.033) {
    lowFpsFrames = Math.min(lowFpsFrames + 1, 10)
  } else if (lowFpsFrames > 0) {
    lowFpsFrames--
  }

  // 1. 渲染 3D 宇宙星雲 (平滑保護機制)
  if (lowFpsFrames < 4 || (Math.floor(timestamp / 16) % 2 === 0)) {
    threeEngine?.render()
  }

  // 2. 尊重無障礙「減少動態效果」偏好：若開啟則跳過高頻流星與波動物理演算
  if (!prefersReducedMotion) {
    meteorSystem?.updateAndRenderMeteors(dt)
  }
}

watch(
  () => store.nebulaFeatures.scrollParallax,
  (enabled) => {
    threeEngine?.setScrollParallaxEnabled(enabled)
  }
)

watch(
  () => route?.path,
  () => {
    setTimeout(() => {
      threeEngine?.refreshScrollTrigger()
    }, 150)
  }
)

onMounted(() => {
  if (!canvasRef.value || !meteorCanvasRef.value) return

  isComponentMounted = true
  updateDeviceCapabilities()

  // 1. 輕量 2D Canvas 流星系統 0ms 瞬間掛載，享受秒開極速
  meteorSystem = new MeteorCanvasSystem({
    canvas: meteorCanvasRef.value,
    store,
    getIsMobile: () => isMobileDevice
  })

  const w = window.innerWidth
  const h = window.innerHeight
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  meteorSystem.resize(w, h, dpr)

  if (typeof document !== 'undefined' && 'fonts' in document) {
    document.fonts.load('bold 14px "JetBrains Mono"').catch(() => {})
  }

  window.addEventListener('resize', handleResize)
  window.addEventListener('mousemove', handleMouseMove, { passive: true })
  document.addEventListener('visibilitychange', handleVisibilityChange)

  renderLoop()

  // 2. 利用 requestIdleCallback 或微延遲，非阻塞動態載入 Three.js 3D 星雲
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    (window as any).requestIdleCallback(() => initThreeNebulaAsync(), { timeout: 1200 })
  } else {
    threeInitTimer = setTimeout(() => initThreeNebulaAsync(), 200)
  }
})

onUnmounted(() => {
  isComponentMounted = false
  if (threeInitTimer) {
    clearTimeout(threeInitTimer)
    threeInitTimer = null
  }

  window.removeEventListener('resize', handleResize)
  window.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('visibilitychange', handleVisibilityChange)

  if (animId) {
    cancelAnimationFrame(animId)
    animId = null
  }

  threeEngine?.dispose()
  threeEngine = null

  meteorSystem?.dispose()
  meteorSystem = null
})
</script>

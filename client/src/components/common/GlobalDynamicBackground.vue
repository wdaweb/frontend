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
import { ThreeNebulaEngine } from '@/engines/background/threeNebulaEngine'
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

function renderLoop(timestamp: number = performance.now()) {
  if (isPageHidden) return
  animId = requestAnimationFrame(renderLoop)

  const dt = lastTimestamp ? Math.min((timestamp - lastTimestamp) / 1000, 0.1) : 0.016
  lastTimestamp = timestamp

  // 1. 渲染 3D 宇宙星雲與微星
  threeEngine?.render()

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

  updateDeviceCapabilities()

  threeEngine = new ThreeNebulaEngine({
    canvas: canvasRef.value,
    store,
    getIsMobile: () => isMobileDevice,
    getPrefersReducedMotion: () => prefersReducedMotion
  })
  threeEngine.init()

  meteorSystem = new MeteorCanvasSystem({
    canvas: meteorCanvasRef.value,
    store,
    getIsMobile: () => isMobileDevice
  })

  const w = window.innerWidth
  const h = window.innerHeight
  const dpr = threeEngine.getOptimalDpr()
  meteorSystem.resize(w, h, dpr)

  if (typeof document !== 'undefined' && 'fonts' in document) {
    document.fonts.load('bold 14px "JetBrains Mono"').catch(() => {})
  }

  window.addEventListener('resize', handleResize)
  window.addEventListener('mousemove', handleMouseMove, { passive: true })
  document.addEventListener('visibilitychange', handleVisibilityChange)

  renderLoop()
})

onUnmounted(() => {
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

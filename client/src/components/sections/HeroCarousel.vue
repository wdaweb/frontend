<template>
  <!-- 全裝置首屏極致自適應架構 (手機與桌機滿版定錨，筆電矮螢幕高度自然呼吸防截斷) -->
  <section id="hero" class="relative min-h-[100dvh] lg:min-h-[100dvh] lg:h-auto xl:h-[100dvh] xl:max-h-[100dvh] flex flex-col justify-between pt-20 sm:pt-24 lg:pt-24 xl:pt-28 2xl:pt-32 pb-6 sm:pb-8 lg:pb-8 xl:pb-10 overflow-hidden bg-transparent">
    <!-- Background Decorative Glow -->
    <div class="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute top-1/2 -right-40 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>

    <!-- 1. Top Section: Announcement Bar (抽離獨立子組件) -->
    <AnnouncementBar />

    <!-- 2. Middle Section: Hero Content Carousel (內容向上微調上提，視覺重心更佳) -->
    <div class="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 w-full relative z-10 flex-1 flex items-center my-auto -translate-y-1 sm:-translate-y-2 lg:-translate-y-2 xl:-translate-y-4">
      <div v-if="currentSlide" class="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center py-2 sm:py-4">
        <!-- Left Text Content (8pt 垂直律動與格式塔群組精準重構，平板端居中穩健) -->
        <div id="hero-left-content" class="w-full max-w-3xl mx-auto lg:mx-0 lg:max-w-none lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left self-center transform-gpu will-change-transform">
          <!-- 1. 頂部認證標籤 Badge (權威背書 + 每月 Claude AI 資源) -->
          <div class="inline-flex flex-wrap items-center justify-center lg:justify-start gap-x-2 gap-y-1 px-3.5 py-1.5 rounded-2xl sm:rounded-full bg-slate-900/90 border border-cyan-500/30 text-xs sm:text-sm font-bold text-cyan-400 shadow-sm shadow-cyan-950/40 mb-2.5 sm:mb-3.5 lg:mb-4">
            <span>✨ 勞動部自辦職前訓練 ｜ <span class="inline-block">920h 實體培訓</span></span>
            <span class="hidden sm:inline text-slate-600" aria-hidden="true">｜</span>
            <span class="inline-flex items-center gap-1 text-amber-300">
              <svg
                class="w-3.5 h-3.5 text-amber-400 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.4"
                stroke-linecap="round"
                aria-hidden="true"
              >
                <line x1="12" y1="2.5" x2="12" y2="21.5" />
                <line x1="2.5" y1="12" x2="21.5" y2="12" />
                <line x1="5.3" y1="5.3" x2="18.7" y2="18.7" />
                <line x1="18.7" y1="5.3" x2="5.3" y2="18.7" />
                <line x1="8.4" y1="3.2" x2="15.6" y2="20.8" />
                <line x1="3.2" y1="8.4" x2="20.8" y2="15.6" />
              </svg>
              <span>每月 Claude AI 資源</span>
            </span>
          </div>

          <!-- 2. 主標題與副標題固定安全高度容器 (頂部定錨 0 抖動，精密貼合文案階梯高度) -->
          <div class="relative h-[148px] sm:h-[150px] lg:h-[158px] xl:h-[178px] w-full [perspective:1000px]">
            <div class="absolute inset-x-0 top-0 text-center lg:text-left [perspective:800px]">
              <h1 id="hero-main-title" class="text-3xl sm:text-4xl lg:text-4xl xl:text-5xl font-extrabold text-white tracking-tight leading-[1.2] sm:leading-[1.18] xl:leading-[1.15] [transform-style:preserve-3d] text-balance">
                <template v-for="(token, tIdx) in splitTitleTokens" :key="`token-${currentIndex}-${tIdx}`">
                  <span v-if="token.isWord" class="inline-block whitespace-nowrap">
                    <span
                      v-for="(char, cIdx) in token.chars"
                      :key="`c-${tIdx}-${cIdx}`"
                      class="hero-char inline-block will-change-transform [transform-origin:50%_100%_-10px]"
                    >{{ char }}</span>
                  </span>
                  <span
                    v-else
                    class="hero-char inline-block will-change-transform [transform-origin:50%_100%_-10px]"
                  >{{ token.chars[0] === ' ' ? '\u00A0' : token.chars[0] }}</span>
                </template>
              </h1>

              <p ref="subtitleRef" class="mt-3 sm:mt-3.5 lg:mt-3.5 xl:mt-4 text-base sm:text-base xl:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed text-pretty will-change-transform">
                <template v-if="subtitleChunks.length > 1">
                  <!-- 具有「｜」三段式副標：手機端語意塊自然斷詞＋隱藏「｜」；桌機端大器單行 -->
                  <template v-for="(chunk, idx) in subtitleChunks" :key="`sub-chunk-${currentIndex}-${idx}`">
                    <span class="inline-block">{{ chunk }}</span>
                    <!-- 桌機顯示優雅「｜」分隔線 -->
                    <span
                      v-if="idx < subtitleChunks.length - 1"
                      class="hidden sm:inline text-slate-500 mx-2 select-none"
                      aria-hidden="true"
                    >｜</span>
                    <!-- 手機端：若為第一塊則自然換行，使版面呈現乾淨整齊的兩行 -->
                    <span
                      v-if="idx === 0 && subtitleChunks.length > 2"
                      class="sm:hidden block h-1"
                      aria-hidden="true"
                    ></span>
                    <!-- 手機端：若為第二塊與第三塊之間，以精緻微點「·」銜接 -->
                    <span
                      v-else-if="idx < subtitleChunks.length - 1"
                      class="sm:hidden text-cyan-400 mx-1.5 font-bold select-none"
                      aria-hidden="true"
                    >·</span>
                  </template>
                </template>
                <template v-else>
                  {{ currentSlide.subtitle }}
                </template>
              </p>
            </div>
          </div>

          <!-- 3. 行動按鈕列 (黃金間距滑落，大器飽滿) -->
          <div class="w-full sm:w-auto flex items-center justify-center lg:justify-start mt-4 sm:mt-6 lg:mt-6 xl:mt-7">
            <a
              v-if="isExternalUrl(currentSlide.cta_link)"
              :href="currentSlide.cta_link"
              :target="currentSlide.cta_target || '_blank'"
              rel="noopener noreferrer"
              class="w-full sm:w-auto px-8 py-3.5 sm:px-9 sm:py-4 rounded-2xl text-base font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/45 hover:-translate-y-0.5 active:scale-95 transition-all text-center flex items-center justify-center space-x-2 group"
            >
              <span>{{ currentSlide.cta_text || '立即查看招生期別與報名資訊' }}</span>
              <span class="group-hover:translate-x-1 transition-transform">→</span>
            </a>
            <router-link
              v-else
              :to="resolveLink(currentSlide.cta_link || '/admission')"
              class="w-full sm:w-auto px-8 py-3.5 sm:px-9 sm:py-4 rounded-2xl text-base font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/45 hover:-translate-y-0.5 active:scale-95 transition-all text-center flex items-center justify-center space-x-2 group"
            >
              <span>{{ currentSlide.cta_text || '立即查看招生期別與報名資訊' }}</span>
              <span class="group-hover:translate-x-1 transition-transform">→</span>
            </router-link>
          </div>

          <!-- 4. 信任底座：4 大核心指標 (抽離獨立子組件) -->
          <HeroMetrics />
        </div>

        <!-- Right Hero Visual (桌機 lg: 展現旗艦科技視窗，手機端隱藏) -->
        <div id="hero-right-content" class="hidden lg:flex lg:col-span-6 w-full relative self-center items-center justify-center transform-gpu will-change-transform">
          <!-- 🌟 方案 B【量子能量科技光艙】：雙色溫環境大氣光暈 + 重力底座 (僅桌機 lg: 渲染，手機 0 負擔) -->
          <div class="absolute -inset-4 sm:-inset-6 lg:-inset-8 -z-10 pointer-events-none overflow-visible select-none">
            <!-- 右上角：電光青高能光核 (7s 深空有機呼吸) -->
            <div class="absolute -top-10 -right-10 w-72 h-72 sm:w-88 sm:h-88 rounded-full bg-gradient-to-br from-cyan-400/22 via-cyan-500/14 to-transparent blur-[85px] animate-hero-ambient-pulse transform-gpu"></div>

            <!-- 左下角：深邃科技藍底座光核 (180° 相位對沖延遲呼吸) -->
            <div class="absolute -bottom-10 -left-10 w-72 h-72 sm:w-88 sm:h-88 rounded-full bg-gradient-to-tr from-blue-600/25 via-indigo-600/12 to-transparent blur-[95px] animate-hero-ambient-pulse-delayed transform-gpu"></div>

            <!-- 下方立體懸浮重力接觸陰影 (Contact Shadow) -->
            <div class="absolute inset-x-12 -bottom-4 h-10 bg-cyan-950/40 blur-2xl rounded-full"></div>
          </div>

          <Transition name="fade-slide" mode="out-in">
            <!-- 優先：若有輪播自訂圖片且載入正常，顯示圖片 -->
            <div v-if="currentSlide.image_url && !brokenSlideImages.has(currentSlide.id)" :key="currentSlide.image_url" class="w-full relative rounded-3xl overflow-hidden border border-slate-800/80 bg-slate-900/60 p-3 shadow-2xl shadow-cyan-950/40 backdrop-blur-xl group">
              <div class="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-800 flex items-center justify-center">
                <img
                  :src="currentSlide.image_url"
                  :alt="currentSlide.image_alt"
                  @error="handleSlideImgError(currentSlide.id)"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
            <!-- 次選：AI 學習助教對話視窗 -->
            <AiChatWindow v-else-if="themeStore.heroRightVariant === 'ai_chat'" key="ai-chat" />
            <!-- 備選：VS Code 程式碼視窗 (code_window) -->
            <AiCodeWindow v-else key="ai-window" />
          </Transition>
        </div>

      </div>
    </div>

  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useCmsStore } from '@/stores/useCmsStore'
import { useThemeStore } from '@/stores/useThemeStore'
import AiCodeWindow from '@/components/common/AiCodeWindow.vue'
import AiChatWindow from '@/components/common/AiChatWindow.vue'
import AnnouncementBar from '@/components/common/AnnouncementBar.vue'
import HeroMetrics from '@/components/common/HeroMetrics.vue'

gsap.registerPlugin(ScrollTrigger)

const store = useCmsStore()
const themeStore = useThemeStore()

const currentIndex = ref(0)
const brokenSlideImages = ref<Set<number>>(new Set())

// 雙重防禦：若輪播自訂圖片 404 或載入失敗，自動優雅退回展示頂級科技感 AiCodeWindow
function handleSlideImgError(id?: number) {
  if (id !== undefined) {
    brokenSlideImages.value.add(id)
  }
}
let timer: ReturnType<typeof setInterval> | null = null

function isExternalUrl(url?: string): boolean {
  if (!url) return false
  return url.startsWith('http://') || url.startsWith('https://')
}

function resolveLink(link?: string): string {
  if (!link) return '/admission'
  if (link === '#batches' || link === 'batches') return '/admission'
  if (link === '#showcase' || link === 'showcase') return '/showcase'
  if (link === '#curriculum' || link === 'curriculum') return '/curriculum'
  if (link === '#community' || link === 'community') return '/community'
  if (link === '#faq' || link === 'faq') return '/faq'
  return link.startsWith('/') ? link : `/${link}`
}

const currentSlide = computed(() => {
  if (store.carousels.length === 0) {
    return {
      id: 0,
      title: '你不需要一開始就會寫程式。重要的是，你願不願意從第一行開始。',
      subtitle: '從零開始，不代表只能靠自己摸索。在 920 小時的實體陪伴中，循序建立能真正動手完成作品的扎實能力。',
      cta_text: '立即線上報名',
      cta_link: '#batches',
      cta_target: '_self',
      image_url: '',
      image_alt: '泰山職訓前端網頁技術與AI應用班主視覺'
    }
  }
  return store.carousels[currentIndex.value]
})

// 智慧 SplitText 資料結構：中英單字混合智能拆分，防止英文單字中斷
interface SplitToken {
  isWord: boolean
  chars: string[]
}

const splitTitleTokens = computed<SplitToken[]>(() => {
  const text = currentSlide.value?.title || ''
  const regex = /([a-zA-Z0-9_#+.-]+|[\s\S])/g
  const matches = text.match(regex) || []

  return matches.map(token => ({
    isWord: /^[a-zA-Z0-9_#+.-]+$/.test(token),
    chars: token.split('')
  }))
})

// 智慧解析副標題為語意分塊（支援手機端自然分行與「｜」分隔符響應式隱藏）
const subtitleChunks = computed(() => {
  const raw = currentSlide.value?.subtitle || ''
  if (!raw) return []
  if (raw.includes('｜') || raw.includes('|')) {
    const separator = raw.includes('｜') ? '｜' : '|'
    return raw.split(separator).map(s => s.trim()).filter(Boolean)
  }
  return [raw]
})

const subtitleRef = ref<HTMLElement | null>(null)
let isSwitching = false
let currentTimeline: gsap.core.Timeline | null = null

// 切換至指定 Slide (帶 GSAP SplitText 3D 字符矩陣翻轉動畫)
const switchSlide = (targetIndex: number) => {
  if (targetIndex === currentIndex.value || isSwitching) return
  if (targetIndex < 0 || targetIndex >= store.carousels.length) return

  isSwitching = true
  resetTimer()

  const chars = document.querySelectorAll('#hero-main-title .hero-char')
  const subtitle = subtitleRef.value

  if (currentTimeline) currentTimeline.kill()
  currentTimeline = gsap.timeline({
    onComplete: () => {
      currentIndex.value = targetIndex
      nextTick(() => {
        animateSlideIn()
      })
    }
  })

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  // 1. 舊字元 3D 翻轉 + 向上微移 + 粒子模糊消散 (手機端停用昂貴的 DOM filter blur)
  currentTimeline
    .to(chars, {
      y: -20,
      rotateX: 60,
      opacity: 0,
      filter: isMobile ? 'none' : 'blur(5px)',
      stagger: {
        each: isMobile ? 0.005 : 0.007,
        from: 'start'
      },
      duration: 0.32,
      ease: 'power2.in'
    }, 0)
    .to(subtitle, {
      y: -10,
      opacity: 0,
      filter: isMobile ? 'none' : 'blur(4px)',
      duration: 0.25,
      ease: 'power2.in'
    }, 0.04)
}

// 新 Slide 字元 3D 翻正升起 + 晶透光澤浮現
const animateSlideIn = () => {
  const chars = document.querySelectorAll('#hero-main-title .hero-char')
  const subtitle = subtitleRef.value
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  if (currentTimeline) currentTimeline.kill()
  currentTimeline = gsap.timeline({
    onComplete: () => {
      isSwitching = false
    }
  })

  currentTimeline
    .fromTo(chars, {
      y: 18,
      rotateX: -55,
      opacity: 0,
      filter: isMobile ? 'none' : 'blur(6px)',
      scale: 0.96
    }, {
      y: 0,
      rotateX: 0,
      opacity: 1,
      filter: 'none',
      scale: 1,
      stagger: {
        each: isMobile ? 0.012 : 0.016,
        from: 'start'
      },
      duration: 0.52,
      ease: 'power3.out'
    }, 0)
    .fromTo(subtitle, {
      y: 12,
      opacity: 0,
      filter: isMobile ? 'none' : 'blur(4px)'
    }, {
      y: 0,
      opacity: 1,
      filter: 'none',
      duration: 0.42,
      ease: 'power2.out'
    }, 0.14)
}

const startTimer = () => {
  timer = setInterval(() => {
    if (store.carousels.length > 1) {
      const nextIdx = (currentIndex.value + 1) % store.carousels.length
      switchSlide(nextIdx)
    }
  }, 8000)
}

const resetTimer = () => {
  if (timer) clearInterval(timer)
  startTimer()
}

let scrollTriggerCtx: gsap.Context | null = null

onMounted(() => {
  // 啟動輪播計時器
  startTimer()

  // 首頁載入時觸發初次進場 3D 字符動畫
  nextTick(() => {
    animateSlideIn()
  })

  // GSAP 滾動 Smooth Ease 速率差視差動畫
  scrollTriggerCtx = gsap.context(() => {
    // 1. 左側文字區塊速率差 (y: -40px, scrub: 1)
    gsap.to('#hero-left-content', {
      y: -40,
      ease: 'power1.out',
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      }
    })

    // 2. 右側 AI Code 視窗速率差 (僅在桌機 lg: 螢幕啟用，手機端完全不註冊以保持極致 FPS)
    if (window.innerWidth >= 1024) {
      gsap.to('#hero-right-content', {
        y: -20,
        ease: 'power1.out',
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1.2
        }
      })
    }
  })
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
  if (currentTimeline) currentTimeline.kill()
  if (scrollTriggerCtx) scrollTriggerCtx.revert()
})
</script>

<style scoped>
/* 標題與副標題極致絲滑的頂部定錨交叉淡入淡出 (0.4s，無高低差，無文字抖動) */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(6px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* 🌟 方案 B：7s 深空悠揚微呼吸動畫 (僅動 opacity 與 scale，純 GPU 合成無重繪) */
@keyframes heroAmbientPulse {
  0%, 100% {
    opacity: 0.18;
    transform: scale(0.98) translate3d(0, 0, 0);
  }
  50% {
    opacity: 0.32;
    transform: scale(1.06) translate3d(0, -4px, 0);
  }
}

.animate-hero-ambient-pulse {
  animation: heroAmbientPulse 7s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite;
  will-change: transform, opacity;
}

.animate-hero-ambient-pulse-delayed {
  animation: heroAmbientPulse 7s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite;
  animation-delay: -3.5s;
  will-change: transform, opacity;
}

/* 無障礙守護：開啟減少動態時轉為靜態柔和常駐 */
@media (prefers-reduced-motion: reduce) {
  .animate-hero-ambient-pulse,
  .animate-hero-ambient-pulse-delayed {
    animation: none !important;
    opacity: 0.22 !important;
  }
}
</style>


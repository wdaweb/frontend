<template>
  <section id="showcase" :class="hideHeader ? 'pt-8 pb-20 sm:pb-24 bg-transparent relative' : 'py-24 bg-slate-900/40 border-t border-slate-800/60 relative'">
    <div class="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12">
      <div v-if="!hideHeader" class="text-center max-w-5xl mx-auto mb-14">
        <span class="px-3.5 py-1.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-sm font-bold uppercase tracking-wider">
          Student Portfolio
        </span>
        <h2 class="text-3xl sm:text-4xl font-extrabold text-white mt-4 tracking-tight">
          歷屆學員 Web 專題成果展示
        </h2>
        <p class="mt-4 text-slate-300 text-base sm:text-lg leading-relaxed text-center">
          所有專案皆為學員於 920 小時培訓期間，<span class="text-cyan-400 font-bold">100% 獨立開發的前後端分離＋資料庫 Web 專案</span>。歷經一個月專題實戰，從期初企劃報告到期末成果展，完整淬鍊實戰能力！
        </p>
      </div>

      <!-- 作品網格清單 (以頁碼 key 驅動平滑淡入淡出轉場) -->
      <Transition name="page-fade" mode="out-in">
        <div id="showcase-cards-grid" :key="currentPage" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div
            v-for="(project, index) in displayedProjects"
            :key="project.id"
            class="showcase-card h-84 perspective-1000 group cursor-pointer rounded-3xl transform-gpu"
            @click="toggleFlip(project.id)"
          >
            <!-- 無障礙：卡片外層僅供滑鼠點擊翻轉；鍵盤與讀屏使用者改由正面的「查看 Demo」按鈕操作，避免互動元素巢狀 -->
            <!-- 翻轉內層容器 -->
            <div
              class="relative w-full h-full duration-500 transform-style-3d transition-transform rounded-3xl shadow-xl"
              :class="flippedIds.has(project.id) ? 'rotate-y-180' : ''"
            >
              <!-- 1. 卡片正面 (對齊全站深色科技主題與極光流光線) -->
              <div
                :aria-hidden="flippedIds.has(project.id)"
                class="card-subsurface-glow absolute inset-0 w-full h-full backface-hidden rounded-3xl overflow-hidden bg-slate-900/70 hover:bg-slate-900/90 backdrop-blur-xl border border-slate-800/90 flex flex-col justify-between shadow-xl shadow-slate-950/60">
                <!-- 頂部流光光暈線 (Hover 時優雅顯現) -->
                <div class="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-20"></div>

                <!-- 封面圖片相框 -->
                <div class="relative h-44 bg-slate-800 overflow-hidden">
                  <img
                    v-if="project.cover_image_url && !brokenProjectImages.has(project.id)"
                    :src="getProjectImageUrl(project)"
                    :alt="project.image_alt || project.project_name || '學員專題作品成果縮圖'"
                    loading="lazy"
                    decoding="async"
                    @error="handleImgError(project)"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br from-slate-800 to-slate-900 text-cyan-400 font-black">
                    💻
                  </div>

                  <div class="absolute bottom-2 right-2 px-2.5 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-sm text-slate-200 font-mono">
                    👁️ {{ project.view_count }} 次瀏覽
                  </div>
                </div>

                <!-- 正面資訊區塊 -->
                <div class="p-5 flex-1 flex flex-col justify-between relative z-10">
                  <div>
                    <h3 class="font-extrabold text-white text-base truncate mb-1 group-hover:text-cyan-300 transition-colors">
                      {{ project.project_name }}
                    </h3>
                    <div class="text-sm text-slate-300 font-medium">
                      開發者：{{ project.student_name }}
                    </div>
                  </div>

                  <div class="flex items-center justify-between pt-3 border-t border-slate-800/80">
                    <span class="text-sm text-slate-300 font-semibold">
                      {{ project.batch_tag }}
                    </span>
                    <button
                      type="button"
                      :tabindex="flippedIds.has(project.id) ? -1 : 0"
                      :aria-expanded="flippedIds.has(project.id)"
                      :aria-label="`查看 ${project.project_name}（作者 ${project.student_name}）的專案詳情與 Demo 連結`"
                      @click.stop="toggleFlipAndFocus(project.id, $event, 'a')"
                      class="text-sm text-cyan-400 font-bold group-hover:translate-x-0.5 transition-transform flex items-center space-x-1 rounded-md focus-visible:ring-2 focus-visible:ring-cyan-400 focus:outline-none"
                    >
                      <span>查看 Demo</span>
                      <span aria-hidden="true">↷</span>
                    </button>
                  </div>
                </div>
              </div>

              <!-- 2. 卡片背面 (展示詳細資訊與 Demo 連結，加入滾動防呆保護) -->
              <div
                :aria-hidden="!flippedIds.has(project.id)"
                class="card-subsurface-glow absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-3xl p-5 sm:p-6 bg-slate-900/95 backdrop-blur-xl border border-cyan-500/40 flex flex-col justify-between shadow-2xl shadow-cyan-950/60 overflow-y-auto no-scrollbar">
                <!-- 頂部流光光暈線 -->
                <div class="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>

                <!-- 角落序號水印 (01~08) -->
                <div aria-hidden="true" class="absolute -right-2 -bottom-4 text-7xl font-mono font-black text-slate-800/20 group-hover:text-cyan-500/10 transition-colors select-none pointer-events-none">
                  {{ String(index + 1).padStart(2, '0') }}
                </div>

                <div class="relative z-10">
                  <span class="px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-sm font-bold">
                    專案詳情
                  </span>
                  <h3 class="text-lg font-extrabold text-white mt-3 mb-1">
                    {{ project.project_name }}
                  </h3>
                  <div class="text-sm text-slate-300 mb-2">
                    作者：<strong class="text-white">{{ project.student_name }}</strong>
                  </div>
                  <div class="text-sm text-slate-300 font-medium">
                    所屬期別：{{ project.batch_tag }}
                  </div>
                </div>

                <div class="space-y-2 pt-2 relative z-10">
                  <a
                    :href="project.demo_url"
                    target="_blank"
                    rel="noopener noreferrer"
                    :tabindex="flippedIds.has(project.id) ? 0 : -1"
                    :aria-label="`${project.project_name} 線上即時展示 Demo（另開新分頁）`"
                    @click.stop="handleView(project.id)"
                    class="w-full py-2.5 rounded-xl text-center font-bold text-sm text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-md shadow-cyan-500/20 transition-all flex items-center justify-center space-x-1.5 focus-visible:ring-2 focus-visible:ring-white focus:outline-none cursor-pointer"
                  >
                    <span>🌐 線上即時展示 (Demo) ↗</span>
                  </a>
                  <button
                    type="button"
                    :tabindex="flippedIds.has(project.id) ? 0 : -1"
                    aria-label="返回正面卡片"
                    @click.stop="toggleFlipAndFocus(project.id, $event, 'button[aria-expanded]')"
                    class="w-full py-1.5 rounded-xl text-center font-medium text-sm text-slate-300 hover:text-white bg-slate-800/40 hover:bg-slate-800 transition-colors focus-visible:ring-2 focus-visible:ring-cyan-400 focus:outline-none"
                  >
                    返回正面
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>

      <!-- 8 個為一頁之極致科技感分頁控制器 (當非首頁 limit 模式且總頁數 > 1 時顯示) -->
      <div
        v-if="!props.limit && totalPages > 1"
        class="mt-14 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-6"
      >
        <!-- 頁面資訊摘要標籤 -->
        <div class="text-xs sm:text-sm text-slate-400 font-medium order-2 sm:order-1 flex items-center space-x-2">
          <span class="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span>共 <strong class="text-white font-mono font-bold">{{ store.projects.length }}</strong> 件專題作品 ｜ 每頁 8 件 ｜ 第 <strong class="text-cyan-400 font-mono">{{ currentPage }}</strong> / {{ totalPages }} 頁</span>
        </div>

        <!-- 分頁切換按鈕群 (WAI-ARIA 導航規範) -->
        <nav class="flex items-center space-x-2 order-1 sm:order-2" aria-label="專案成果分頁導航">
          <!-- 上一頁按鈕 -->
          <button
            type="button"
            @click="goToPage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all border flex items-center space-x-1"
            :class="[
              currentPage === 1
                ? 'bg-slate-900/50 border-slate-800 text-slate-600 cursor-not-allowed'
                : 'bg-slate-900 hover:bg-slate-850 border-slate-800 hover:border-cyan-500/40 text-slate-200 hover:text-cyan-300 shadow-md'
            ]"
            aria-label="前往上一頁專案列表"
          >
            <span>←</span>
            <span>上一頁</span>
          </button>

          <!-- 數字頁碼按鈕組 -->
          <div class="flex items-center space-x-1.5">
            <button
              v-for="page in totalPages"
              :key="page"
              type="button"
              @click="goToPage(page)"
              :aria-current="currentPage === page ? 'page' : undefined"
              :aria-label="`前往第 ${page} 頁`"
              class="w-10 h-10 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center font-mono"
              :class="[
                currentPage === page
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30 ring-2 ring-cyan-400 scale-105'
                  : 'bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300'
              ]"
            >
              {{ page }}
            </button>
          </div>

          <!-- 下一頁按鈕 -->
          <button
            type="button"
            @click="goToPage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all border flex items-center space-x-1"
            :class="[
              currentPage === totalPages
                ? 'bg-slate-900/50 border-slate-800 text-slate-600 cursor-not-allowed'
                : 'bg-slate-900 hover:bg-slate-850 border-slate-800 hover:border-cyan-500/40 text-slate-200 hover:text-cyan-300 shadow-md'
            ]"
            aria-label="前往下一頁專案列表"
          >
            <span>下一頁</span>
            <span>→</span>
          </button>
        </nav>
      </div>

      <!-- 若有設定 limit 且總作品數超過 limit，顯示查看全部按鈕 (供首頁使用) -->
      <div v-if="props.limit && store.projects.length > props.limit" class="mt-12 text-center">
        <router-link
          to="/showcase"
          class="inline-flex items-center justify-center px-8 py-4 rounded-2xl font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700/80 shadow-lg hover:border-cyan-500/50 hover:text-cyan-300 transition-all focus-visible:ring-2 focus-visible:ring-cyan-400 focus:outline-none"
        >
          查看全部學員專題成果作品集 →
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { createScrollStagger, gsap } from '@/utils/motion'
import { useCmsStore } from '@/stores/useCmsStore'
import type { StudentProject } from '@/types'

const PAGE_SIZE = 8 // 每頁固定 8 個學員專案

const props = withDefaults(
  defineProps<{
    limit?: number
    hideHeader?: boolean
  }>(),
  {
    hideHeader: false
  }
)

const store = useCmsStore()
const currentPage = ref(1)
const flippedIds = ref(new Set<number>())
const brokenProjectImages = ref(new Set<number>())
const fallbackMap = ref<Record<number, string>>({})

// 統一靜態資產與遠端 CDN 縮圖網址解析 (支援本地降級)
function getProjectImageUrl(project: StudentProject): string {
  const customUrl = fallbackMap.value[project.id] || project.cover_image_url
  if (!customUrl) return ''
  if (customUrl.startsWith('http://') || customUrl.startsWith('https://') || customUrl.startsWith('data:')) {
    return customUrl
  }
  const cleanPath = customUrl.replace(/^\.?\//, '')
  return `${import.meta.env.BASE_URL}${cleanPath}`
}

// 多階智慧防禦：遠端 CDN 載入失敗時優先自動切換至打包之本地 WebP，若皆失敗才降級為占位卡片
function handleImgError(project: StudentProject) {
  const localFallback = `./projects/project_${project.id}.webp`
  if (fallbackMap.value[project.id] !== localFallback) {
    fallbackMap.value[project.id] = localFallback
  } else {
    brokenProjectImages.value.add(project.id)
  }
}
let scrollTriggerCtx: ReturnType<typeof createScrollStagger> | null = null

// 總頁數計算 (每 8 個為一頁)
const totalPages = computed(() => {
  return Math.ceil(store.projects.length / PAGE_SIZE) || 1
})

// 當前頁面展示之專案清單 (8 個為一頁)
const displayedProjects = computed(() => {
  if (props.limit && props.limit > 0) {
    return store.projects.slice(0, props.limit)
  }
  const startIndex = (currentPage.value - 1) * PAGE_SIZE
  return store.projects.slice(startIndex, startIndex + PAGE_SIZE)
})

function initStaggerAnimation() {
  if (scrollTriggerCtx) {
    scrollTriggerCtx.revert()
    scrollTriggerCtx = null
  }
  nextTick(() => {
    // 專題成果卡片統一由全域工廠函式調度 (滾動到達時 100% 依序 stagger 微升)
    scrollTriggerCtx = createScrollStagger(
      '#showcase-cards-grid .showcase-card',
      '#showcase-cards-grid',
      { stagger: 0.08 }
    )
  })
}

function animatePageChange() {
  nextTick(() => {
    // 分頁切換時，新一頁的 8 張卡片依序溫潤微升
    gsap.fromTo(
      '#showcase-cards-grid .showcase-card',
      { y: 28, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.06, ease: 'power1.out', clearProps: 'transform,opacity' }
    )
  })
}

onMounted(() => {
  initStaggerAnimation()
})

// 當非同步取得後端作品資料時，重新精準綁定滾動動畫
watch(
  () => store.projects.length,
  () => {
    initStaggerAnimation()
  }
)

// 當切換分頁時，觸發新一頁的微升動態
watch(currentPage, () => {
  animatePageChange()
})

onUnmounted(() => {
  if (scrollTriggerCtx) scrollTriggerCtx.revert()
})

function toggleFlip(id: number) {
  if (flippedIds.value.has(id)) {
    flippedIds.value.delete(id)
  } else {
    flippedIds.value.add(id)
  }
}

// 鍵盤操作翻轉後，把焦點移到翻轉後可見的那一面，避免焦點停在已隱藏的元素上
function toggleFlipAndFocus(id: number, event: Event, targetSelector: string) {
  toggleFlip(id)
  const card = (event.currentTarget as HTMLElement | null)?.closest('.showcase-card')
  nextTick(() => {
    const target = card?.querySelector<HTMLElement>(targetSelector)
    target?.focus({ preventScroll: true })
  })
}

function handleView(id: number) {
  store.trackProjectView(id)
}

function goToPage(page: number) {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  flippedIds.value.clear() // 切換分頁時重置翻轉狀態
  // 平滑滾動至作品牆頂部
  const el = document.getElementById('showcase')
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
</script>

<style scoped>
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.page-fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>

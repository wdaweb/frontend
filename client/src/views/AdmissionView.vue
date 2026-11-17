<template>
  <div class="flex-grow">
    <!-- 標準化頂部 Header -->
    <PageHeader
      badge="官方自辦職前訓練"
      title="招生期別與報名"
      theme="cyan"
    >
      <template #subtitle>
        <div class="hidden sm:block max-w-4xl mx-auto leading-relaxed space-y-1.5 sm:space-y-2 text-center px-1">
          <p class="text-slate-300 text-base lg:text-lg">
            本專班為勞動部自辦訓練，待業民眾享 100% 全額免費培訓。
          </p>
          <p class="text-slate-300 text-base lg:text-lg">
            請直接點擊下方期別連結至「台灣就業通」官方網站完成報名。
          </p>
        </div>
      </template>

      <!-- 即時期別報名狀態指示看板 (讓民眾一眼秒懂當前報名狀態) -->
      <template #extra>
        <div class="mt-5 max-w-xl mx-auto w-full px-2 sm:px-0">
          <div
            class="relative rounded-2xl p-3.5 sm:p-4.5 border backdrop-blur-xl transition-all duration-300 overflow-hidden shadow-xl"
            :class="notice.isOpen
              ? 'bg-emerald-950/40 border-emerald-500/40 shadow-emerald-950/50'
              : 'bg-slate-900/85 border-amber-500/30 shadow-slate-950/60'"
          >
            <!-- 頂部流光微線 -->
            <div
              class="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent"
              :class="notice.isOpen ? 'via-emerald-400/50 to-transparent' : 'via-amber-400/40 to-transparent'"
            ></div>

            <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 text-left">
              <!-- 狀態標籤 Pill Badge -->
              <div class="flex-shrink-0">
                <span
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold tracking-wide"
                  :class="notice.isOpen
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'"
                >
                  <span
                    class="w-2 h-2 rounded-full mr-1.5"
                    :class="notice.isOpen ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'"
                  ></span>
                  {{ notice.badgeText }}
                </span>
              </div>

              <!-- 核心標題與引導說明 -->
              <div class="flex-grow">
                <div
                  class="text-base sm:text-lg font-bold tracking-tight"
                  :class="notice.isOpen ? 'text-white' : 'text-amber-200'"
                >
                  {{ notice.headline }}
                </div>
                <p class="mt-1 text-sm sm:text-base text-slate-300 leading-relaxed">
                  {{ notice.subline }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </template>
    </PageHeader>

    <!-- 期別卡片 (支援一鍵複製代碼與倒數計時，由 PageHeader 統一引導) -->
    <BatchesSection hide-header />

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useSeoMeta } from '@/composables/useSeoMeta'
import { useCmsStore } from '@/stores/useCmsStore'
import { getBatchEnrollmentNotice } from '@/utils/batchStatus'
import { buildBatchSeoSummary, buildCourseJsonLd } from '@/utils/batchSeo'
import PageHeader from '@/components/layout/PageHeader.vue'
import BatchesSection from '@/components/sections/BatchesSection.vue'

const store = useCmsStore()
const notice = computed(() => getBatchEnrollmentNotice(store.batches))


// 靜態描述（不含任何課程代碼，打包時 scripts/postbuild.mjs 會讀取這段寫入 /admission/index.html）
const SEO_DESCRIPTION = '【政府全額補助前端課程報名】泰山職訓「前端網頁技術與AI應用」專班最新招生期別、報名起訖日、甄試時程與開課日期，以及台灣就業通課程代碼與報名連結。待業者享 100% 全額免費培訓與職訓生活津貼補助，請直接點選連結至台灣就業通官方網站報名。招生專線：(02) 2901-8274。'

// 期別資料來自後台（爬蟲自台灣就業通同步），新期別上線後描述與結構化資料會自動更新
const batchSummary = computed(() => buildBatchSeoSummary(store.batches))
const courseJsonLd = computed(() => buildCourseJsonLd(store.batches))

useSeoMeta(() => ({
  title: '招生期別與報名時程 ｜ 泰山職訓前端課程 ｜ 台灣就業通線上報名代碼',
  description: batchSummary.value ? `${SEO_DESCRIPTION}最新期別：${batchSummary.value}。` : SEO_DESCRIPTION,
  canonicalPath: '/admission',
  robots: 'index, follow',
  jsonLd: [
    {
      '@type': 'BreadcrumbList',
      'itemListElement': [
        {
          '@type': 'ListItem',
          'position': 1,
          'name': '首頁',
          'item': 'https://wdaweb.github.io/frontend/'
        },
        {
          '@type': 'ListItem',
          'position': 2,
          'name': '招生期別與報名',
          'item': 'https://wdaweb.github.io/frontend/admission/'
        }
      ]
    },
    ...(courseJsonLd.value ? [courseJsonLd.value] : [])
  ]
}))
</script>

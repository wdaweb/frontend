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
        <BatchEnrollmentBanner :notice="notice" />
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
import BatchEnrollmentBanner from '@/components/sections/batches/BatchEnrollmentBanner.vue'

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

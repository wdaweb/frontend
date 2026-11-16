<template>
	<section
		id="facilities"
		:class="[
			hideHeader
				? 'py-6 sm:py-10 bg-transparent relative'
				: 'py-16 sm:py-20 lg:py-24 xl:py-28 bg-transparent relative overflow-hidden',
		]"
	>
		<!-- 頂部與底部環境發光微暈 -->
		<div
			class="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"
		></div>
		<div
			class="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none"
		></div>

		<div class="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 relative z-10 w-full">
			<!-- 區塊標題 -->
			<div v-if="!hideHeader" class="text-center max-w-5xl mx-auto mb-4 sm:mb-12 lg:mb-14">
				<div
					class="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-sm font-bold uppercase tracking-wider shadow-sm mb-3"
				>
					<span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
					<span>Learning Environment ｜ 實體環境</span>
				</div>
				<h2
					class="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black text-white tracking-tight leading-tight text-balance"
				>
					<span class="block">接下來的半年，</span>
					<span
						class="block mt-1 sm:mt-1.5 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-emerald-400"
						>在這樣安心專注的環境中學習</span
					>
				</h2>
				<p
					class="hidden sm:block text-slate-400 mt-4 text-base sm:text-lg max-w-none mx-auto leading-relaxed text-pretty"
				>
					專注的空間、一起學習的人，以及一段真正投入的時間。
				</p>
			</div>

			<!-- 手機端橫向滑動提示 (平板與桌機隱藏) -->
			<div
				v-if="!hideHeader"
				class="flex md:hidden items-center justify-center gap-2 text-base font-bold text-cyan-400 mt-8 mb-5"
			>
				<span>👈 左右滑動瀏覽教學環境實景 👉</span>
			</div>

			<!-- 教室環境實景展示清單 (手機橫向滑軌，平板與桌機 md: 2 欄) -->
			<div
				id="facilities-cards-grid"
				tabindex="0"
				role="region"
				aria-label="教學設施卡片（手機版可左右滑動）"
				class="flex md:grid md:grid-cols-2 overflow-x-auto md:overflow-x-visible snap-x snap-mandatory scroll-smooth no-scrollbar -mx-4 px-4 md:mx-auto md:px-0 gap-4 sm:gap-6 xl:gap-8 max-w-6xl pb-4 md:pb-0"
			>
				<div
					v-for="(fac, index) in displayFacilities"
					:key="fac.id || index"
					class="facility-card card-subsurface-glow relative rounded-3xl overflow-hidden bg-slate-900/80 backdrop-blur-xl border border-slate-800/90 shadow-xl shadow-slate-950/60 flex flex-col justify-between transform-gpu cursor-default w-[80vw] sm:w-[460px] max-w-[500px] shrink-0 snap-start md:w-full md:max-w-none md:shrink"
				>
					<!-- 角落序號水印 (01, 02) -->
					<div aria-hidden="true"
						class="absolute -right-2 -bottom-4 text-7xl font-mono font-black text-slate-800/20 select-none pointer-events-none z-20"
					>
						{{ String(index + 1).padStart(2, '0') }}
					</div>

					<!-- 圖片展示相框 (固定 16:10 比例) -->
					<div class="aspect-[16/10] bg-slate-800/80 relative overflow-hidden flex items-center justify-center">
						<img
							:src="fac.displayImage"
							:alt="fac.image_alt || fac.displayTitle"
							@error="handleFacilityImgError(fac.id)"
							class="w-full h-full object-cover"
						/>

						<!-- 底部微光漸層遮罩 -->
						<div
							class="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60"
						></div>
					</div>

					<!-- 說明區塊 -->
					<div class="p-5 sm:p-8 flex-1 flex flex-col relative z-10">
						<h3 class="mb-2 sm:mb-3">
							<span class="block text-xl sm:text-2xl font-black text-white tracking-tight leading-snug text-balance">
								{{ fac.displayTitle }}
							</span>
							<span
								v-if="fac.displaySubtitle"
								class="block text-base sm:text-lg font-bold text-cyan-400 tracking-wide mt-1 leading-snug text-balance"
							>
								{{ fac.displaySubtitle }}
							</span>
						</h3>
						<p class="text-slate-200 leading-relaxed text-base sm:text-lg text-pretty text-justify">
							{{ fac.description }}
						</p>
					</div>
				</div>
			</div>

			<!-- 教學環境核心收束金句 (單行不換行，文字極致精煉) -->
			<div class="mt-8 sm:mt-12 text-center">
				<div
					class="inline-block px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md shadow-lg max-w-full"
				>
					<p class="text-sm sm:text-base text-slate-200 whitespace-nowrap">
						🏫 <span class="text-cyan-300 font-bold">專屬且安心的空間，</span>是走完 920 小時的踏實後盾。
					</p>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
import facility1Img from '@/assets/facilities/learning_ijciKln_09KM7k0_ddXbwFz.webp'
import facility2Img from '@/assets/facilities/lunch_g71Ci6n_NsJ8XsZ_mJ12g5T.webp'
import { useScrollStagger } from '@/composables/useScrollStagger'
import { useCmsStore } from '@/stores/useCmsStore'
import { computed, ref } from 'vue'

const defaultFacilityImages = [facility1Img, facility2Img]
const brokenFacilityIds = ref<Set<number>>(new Set())

function getFacilityImage(fac: { id?: number; image_url?: string }, index: number) {
	// 若該設施圖片已被標記載入失敗，或後端未提供有效圖片路徑，100% 穩定回傳本地高畫質實景資產
	if ((fac.id && brokenFacilityIds.value.has(fac.id)) || !fac.image_url) {
		return defaultFacilityImages[index % defaultFacilityImages.length]
	}
	return fac.image_url
}

// 雙重防禦：遠端圖片 404 或載入失敗時，立即觸發響應式降級，切換至本地實景照片
function handleFacilityImgError(facId?: number) {
	if (facId !== undefined) {
		brokenFacilityIds.value.add(facId)
	}
}

// 智慧解析主標與副標：優先使用 subtitle，若無則依頓號自動拆分（雙重防禦相容）
function getFacilityTitles(fac?: { facility_name?: string; subtitle?: string }) {
	if (!fac) return { title: '', subtitle: '' }
	if (fac.subtitle) {
		return {
			title: fac.facility_name || '',
			subtitle: fac.subtitle,
		}
	}
	const name = fac.facility_name || ''
	const parts = name.split('、')
	if (parts.length > 1) {
		return {
			title: parts[0],
			subtitle: parts.slice(1).join('、'),
		}
	}
	return {
		title: name,
		subtitle: '',
	}
}

withDefaults(
	defineProps<{
		hideHeader?: boolean
	}>(),
	{
		hideHeader: false,
	},
)

const store = useCmsStore()

// 防禦性預處理設施清單，兼顧主副標智慧解析與安全圖片綁定，杜絕 template 重複呼叫
const displayFacilities = computed(() => {
	return (store.facilities || []).map((fac, index) => {
		const titles = getFacilityTitles(fac)
		return {
			...fac,
			displayTitle: titles.title,
			displaySubtitle: titles.subtitle,
			displayImage: getFacilityImage(fac, index),
		}
	})
})

// 兩大設施卡片統一由通用 Composable 調度 (100% 全站標準一致)
useScrollStagger(
	'#facilities-cards-grid .facility-card',
	'#facilities',
	{ stagger: 0.1 },
	() => store.facilities.length,
)
</script>

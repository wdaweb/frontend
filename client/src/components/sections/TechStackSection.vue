<template>
	<section
		id="tech-stack"
		:class="[
			hideHeader
				? 'py-6 sm:py-10 bg-transparent relative'
				: 'py-16 sm:py-20 lg:py-24 xl:py-28 bg-transparent relative overflow-hidden',
		]"
	>
		<!-- 背景光暈 -->
		<div
			class="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"
		></div>
		<div
			class="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"
		></div>

		<div class="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 relative z-10 w-full">
			<!-- 區塊標題 (僅在未隱藏標頭時渲染) -->
			<div v-if="!hideHeader" class="text-center max-w-4xl mx-auto mb-4 sm:mb-12 lg:mb-14">
				<div
					class="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-sm font-bold uppercase tracking-wider shadow-sm mb-3"
				>
					<span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
					<span>Development Tools ｜ 技術與工具</span>
				</div>
				<h2 class="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight text-balance">
					這半年掌握哪些核心技術？
				</h2>
				<p
					class="hidden sm:block text-slate-400 mt-4 text-base sm:text-lg max-w-4xl xl:max-w-5xl mx-auto leading-relaxed text-pretty text-center"
				>
					不用死背這些英文單字。這些是你做作品時會用到的工具，我們會依照學習進度，帶你一步步親手使用。
				</p>
			</div>

			<!-- 手機端橫向滑動提示 (桌機隱藏) -->
			<div
				v-if="!hideHeader"
				class="flex sm:hidden items-center justify-center gap-2 text-base font-bold text-cyan-400 mt-8 mb-5"
			>
				<span>👈 左右滑動瀏覽 8 大核心技術 👉</span>
			</div>

			<!-- 1. 8 大核心技術卡片網格 (手機橫向滑軌，桌機 xl: 4 欄) -->
			<div
				id="tech-cards-grid"
				tabindex="0"
				role="region"
				aria-label="核心技術卡片（手機版可左右滑動）"
				class="flex sm:grid sm:grid-cols-2 xl:grid-cols-4 overflow-x-auto sm:overflow-x-visible snap-x snap-mandatory scroll-smooth no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 gap-4 sm:gap-6 pb-4 sm:pb-0 mb-8"
			>
				<div
					v-for="(card, index) in store.techCards"
					:key="card.id"
					class="tech-card card-subsurface-glow relative rounded-3xl p-5 sm:p-6 bg-slate-900/80 backdrop-blur-xl border border-slate-800/90 shadow-xl shadow-slate-950/60 flex flex-col justify-between overflow-hidden cursor-default w-[78vw] max-w-[320px] shrink-0 snap-start sm:w-full sm:max-w-none sm:shrink"
				>
					<!-- 角落序號水印 (01~08) -->
					<div aria-hidden="true"
						class="absolute -right-2 -bottom-4 text-6xl sm:text-7xl font-mono font-black text-slate-800/20 select-none pointer-events-none"
					>
						{{ String(index + 1).padStart(2, '0') }}
					</div>

					<div>
						<div class="flex items-center justify-between mb-5">
							<div
								class="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700/80 flex items-center justify-center text-2xl shadow-inner"
							>
								{{ getTechIcon(card.tech_name) }}
							</div>
							<span
								class="px-3.5 py-1 rounded-2xl bg-cyan-500/10 text-cyan-300 font-bold text-sm border border-cyan-500/30 tracking-wide"
							>
								{{ card.category_tab || '核心必修' }}
							</span>
						</div>

						<h3 class="text-xl font-extrabold text-white mb-2.5 tracking-tight">
							{{ card.tech_name }}
						</h3>

						<p class="text-base text-slate-300 leading-relaxed text-pretty text-justify">
							{{ card.description }}
						</p>
					</div>
				</div>
			</div>

			<!-- 技術工具核心收束金句 (單行不換行，文字極致精煉) -->
			<div class="mt-8 sm:mt-12 text-center">
				<div
					class="inline-block px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md shadow-lg max-w-full"
				>
					<p class="text-sm sm:text-base text-slate-200 whitespace-nowrap">
						🛠️ <span class="text-cyan-300 font-bold">工具只是手段，</span>做出能解決問題的作品才是核心。
					</p>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
import { useScrollStagger } from '@/composables/useScrollStagger'
import { useCmsStore } from '@/stores/useCmsStore'

withDefaults(
	defineProps<{
		hideHeader?: boolean
	}>(),
	{
		hideHeader: false,
	},
)

const store = useCmsStore()

// 8 大技術棧卡片一氣呵成交錯波浪微升 (透過通用 Composable 統一調度生命週期與快取更新)
useScrollStagger(
	'#tech-cards-grid .tech-card',
	'#tech-stack',
	{
		yOffset: 28,
		duration: 0.85,
		stagger: 0.06,
		ease: 'power1.out',
		start: 'top 85%',
	},
	() => store.techCards.length,
)

function getTechIcon(name: string): string {
	if (name.includes('HTML') || name.includes('CSS')) return '🌐'
	if (name.includes('Tailwind') || name.includes('Bootstrap')) return '🎨'
	if (name.includes('Photoshop') || name.includes('Adobe') || name.includes('視覺')) return '🖌️'
	if (name.includes('JavaScript') || name.includes('ES6')) return '⚡'
	if (name.includes('Vue') || name.includes('Pinia')) return '💚'
	if (name.includes('API') || name.includes('Axios')) return '🔄'
	if (name.includes('Node') || name.includes('MongoDB')) return '🟩'
	if (name.includes('Git') || name.includes('GitHub')) return '🐙'
	return '🚀'
}
</script>

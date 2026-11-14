<template>
	<div>
		<!-- 1. Hero 首頁動態輪播與核心價值定錨 (回歸人性的溫暖開場) -->
		<HeroCarousel />

		<!-- 2. 受眾心聲共鳴 (你心中可能也有這些猶豫……這些不安，我們都懂) -->
		<AudienceSection />

		<!-- 3. 四大起點圖譜 (你的起點不同，但不代表從零開始) -->
		<TracksSection />

		<!-- 5. 實體沉浸價值 ｜ 當你真的卡住時 (解決問題視角：拆問題/雙螢幕/同儕/920h) -->
		<HighlightsSection />

		<!-- 6. 核心技術工具 (你會接觸到哪些技術) -->
		<TechStackSection />

		<!-- 8. 現代人機協同實務 (AI 輔助應用：讓 AI 成為你的專業開發副駕駛) -->
		<AiWorkflowSection />

		<!-- 9. 從第一行程式碼開始，一步一步完成自己的作品 (四階段能力蛻變路徑) -->
		<LearningPathSection />

		<!-- 10. 他們也是從第一行開始 (學員成果心理信任橋樑，定稿版核心章節) -->
		<section class="py-16 sm:py-20 lg:py-24 xl:py-28 bg-slate-950/50 text-center relative overflow-hidden">
			<!-- 柔和微光 -->
			<div
				class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"
			></div>

			<div class="max-w-5xl xl:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-6 relative z-10">
				<div
					class="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-sm font-bold uppercase tracking-wider shadow-sm"
				>
					<span>Student Showcase ｜ 學員專題成果</span>
				</div>

				<h2 class="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black text-white tracking-tight leading-tight">
					<span class="block">不用先相信自己一定能做到。</span>
					<span
						class="block mt-1 sm:mt-1.5 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-emerald-400"
						>先看看曾經相同起點的人，做出了什麼。</span
					>
				</h2>

				<p
					class="hidden sm:block text-slate-300 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed text-pretty text-center"
				>
					每一個作品的開始，都不是一個完整的工程師，而是一個願意從不熟悉的第一行開始學習的人。
				</p>

				<div class="pt-2">
					<router-link
						to="/showcase"
						class="inline-flex items-center space-x-2 px-8 py-3.5 rounded-2xl text-base font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:-translate-y-0.5 active:scale-95 transition-all"
					>
						<span>查看歷屆學員專題成果</span>
						<span>→</span>
					</router-link>
				</div>
			</div>
		</section>

		<!-- 11. 結訓真實收穫 ｜ 結訓最後帶走的，不只是一張結訓證明 -->
		<OutcomesSection />

		<!-- 12. 教學環境與設施 ｜ 接下來的半年，在這樣安心專注的環境中學習 -->
		<FacilitiesSection />

		<!-- 13. 誠懇安心行動召喚：自主決定與三大入口 -->
		<section
			class="py-16 sm:py-20 lg:py-24 xl:py-28 bg-gradient-to-b from-slate-950/60 via-slate-900/40 to-slate-950 text-center relative overflow-hidden"
		>
			<!-- 柔和環境光暈 -->
			<div
				class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"
			></div>

			<div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5 sm:space-y-7 relative z-10">
				<div
					class="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-sm font-bold uppercase tracking-wider shadow-sm"
				>
					<span>Make Your Choice ｜ 自主決定</span>
				</div>

				<h2
					class="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black text-white tracking-tight leading-tight lg:whitespace-nowrap"
				>
					<span class="block sm:inline">先看清楚、想明白，</span>
					<span
						class="block sm:inline mt-1 sm:mt-0 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-emerald-400"
						>再跨出屬於自己的下一步。</span
					>
				</h2>

				<!-- 誠懇安心說明文字 (精煉單一版本，手機與桌機皆舒適閱讀) -->
				<p class="text-slate-300 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed text-pretty text-center">
					920 小時扎實培訓，課程費用全額補助。當你準備好了，為自己爭取一次改變的機會。
				</p>

				<!-- 底部三軌按鈕群組 (手機直式堆疊，平板與桌機橫向排開) -->
				<div class="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-2xl mx-auto">
					<router-link
						to="/admission"
						class="w-full sm:w-auto px-8 py-3.5 rounded-2xl text-base font-extrabold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center space-x-2"
					>
						<span>立即查看招生期別與報名流程</span>
						<span>→</span>
					</router-link>

					<router-link
						to="/faq"
						class="w-full sm:w-auto px-6 py-3.5 rounded-2xl text-base font-bold text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800/90 border border-slate-700/80 hover:border-slate-600 transition-all flex items-center justify-center space-x-2"
					>
						<span>常見問答 FAQ</span>
					</router-link>

					<router-link
						to="/community"
						class="w-full sm:w-auto px-6 py-3.5 rounded-2xl text-base font-bold text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800/90 border border-slate-700/80 hover:border-slate-600 transition-all flex items-center justify-center space-x-2"
					>
						<span>交通與諮詢</span>
					</router-link>
				</div>

				<!-- 溫馨提示與免責聲明 (電腦版大器單行不斷行，手機版自適應換行) -->
				<div class="pt-6 border-t border-slate-800/60 max-w-5xl mx-auto">
					<p class="text-base text-slate-400 font-medium whitespace-normal lg:whitespace-nowrap">
						💡 正式報名一律透過勞動部「台灣就業通」官方網站辦理，本站為純招生推廣宣傳展示，不收集任何個人資料。
					</p>
				</div>
			</div>
		</section>
	</div>
</template>

<script setup lang="ts">
import AiWorkflowSection from '@/components/sections/AiWorkflowSection.vue'
import AudienceSection from '@/components/sections/AudienceSection.vue'
import FacilitiesSection from '@/components/sections/FacilitiesSection.vue'
import HeroCarousel from '@/components/sections/HeroCarousel.vue'
import HighlightsSection from '@/components/sections/HighlightsSection.vue'
import LearningPathSection from '@/components/sections/LearningPathSection.vue'
import OutcomesSection from '@/components/sections/OutcomesSection.vue'
import TechStackSection from '@/components/sections/TechStackSection.vue'
import TracksSection from '@/components/sections/TracksSection.vue'
import { useSeoMeta } from '@/composables/useSeoMeta'

useSeoMeta({
	title: '泰山職訓「前端網頁技術與AI應用」前端課程｜920 小時政府全額補助實體培訓',
	description:
		'【政府全額補助前端課程】勞動部泰山職訓場「前端網頁技術與AI應用專班」招生中！920 小時實體密集培訓，一人獨立雙螢幕實作、培訓期間享每月專屬 Claude AI 實戰資源，涵蓋 Vue 3、TypeScript、AI 輔助開發與專案作品集。待業民眾享 100% 全額免費受訓與生活津貼補助，正式報名請至台灣就業通官方網站。諮詢專線：(02) 2901-8274。',
	canonicalPath: '/',
	robots: 'index, follow',
})
</script>

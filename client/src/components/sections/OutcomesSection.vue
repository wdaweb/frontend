<template>
	<section id="outcomes" class="py-16 sm:py-20 lg:py-24 xl:py-28 bg-transparent relative overflow-hidden">
		<!-- 背景環境光暈 -->
		<div
			class="absolute top-1/2 left-1/3 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"
		></div>
		<div
			class="absolute top-1/2 right-1/3 -translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"
		></div>

		<div class="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 relative z-10 w-full">
			<!-- 區塊前導標題 -->
			<div class="text-center max-w-4xl mx-auto mb-4 sm:mb-12 lg:mb-14">
				<div
					class="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-sm font-bold uppercase tracking-wider shadow-sm mb-3"
				>
					<span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
					<span>Real Takeaways ｜ 結訓真實收穫</span>
				</div>
				<h2
					class="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black text-white tracking-tight leading-tight text-balance"
				>
					<span class="block sm:inline">結訓最後帶走的，</span>
					<span
						class="block sm:inline mt-1 sm:mt-0 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-emerald-400"
						>不只是一張結訓證明</span
					>
				</h2>
				<p
					class="hidden sm:block text-slate-400 mt-4 text-base sm:text-lg max-w-3xl lg:max-w-none mx-auto leading-relaxed text-center whitespace-normal lg:whitespace-nowrap"
				>
					<span class="inline-block">920 小時</span
					>的學習，目的不是讓你記住更多技術名詞，而是希望你離開教室後，仍然帶著可以繼續使用的實戰能力。
				</p>
			</div>

			<!-- 手機端橫向滑動提示 (桌機隱藏) -->
			<div class="flex md:hidden items-center justify-center gap-2 text-base font-bold text-cyan-400 mt-8 mb-5">
				<span>👈 左右滑動瀏覽 6 大真實收穫 👉</span>
			</div>

			<!-- 6 大真實收穫網格 (手機橫向滑軌，桌機 md: 2 欄 / lg: 3 欄) -->
			<div
				id="outcomes-cards-grid"
				tabindex="0"
				role="region"
				aria-label="學習成果卡片（手機版可左右滑動）"
				class="flex md:grid md:grid-cols-2 lg:grid-cols-3 overflow-x-auto md:overflow-x-visible snap-x snap-mandatory scroll-smooth no-scrollbar -mx-4 px-4 md:mx-0 md:px-0 gap-4 sm:gap-6 pb-4 md:pb-0"
			>
				<!-- 收穫 1 -->
				<div
					class="outcome-card card-subsurface-glow relative rounded-3xl p-5 sm:p-7 bg-slate-900/80 backdrop-blur-xl border border-slate-800/90 shadow-xl shadow-slate-950/60 flex flex-col justify-between overflow-hidden cursor-default w-[78vw] sm:w-[320px] max-w-[340px] shrink-0 snap-start md:w-full md:max-w-none md:shrink"
				>
					<div>
						<div class="flex items-center gap-2.5 mb-2.5 sm:mb-3">
							<span class="text-2xl sm:text-3xl shrink-0">🌐</span>
							<h3 class="text-xl font-extrabold text-white tracking-tight">真正做出屬於自己的作品</h3>
						</div>
						<p class="text-base text-slate-200 leading-relaxed text-pretty text-justify">
							不套用現成模板。做出能實際展示與使用的個人代表作，面試時能清楚說明自己的作品與技術。
						</p>
					</div>
					<div class="pt-4 mt-4 sm:mt-5 border-t border-slate-800/80 text-base font-bold text-cyan-400">
						✓ 擁有專屬專案代表作
					</div>
				</div>

				<!-- 收穫 2 -->
				<div
					class="outcome-card card-subsurface-blue relative rounded-3xl p-5 sm:p-7 bg-slate-900/80 backdrop-blur-xl border border-slate-800/90 shadow-xl shadow-slate-950/60 flex flex-col justify-between overflow-hidden cursor-default w-[78vw] sm:w-[320px] max-w-[340px] shrink-0 snap-start md:w-full md:max-w-none md:shrink"
				>
					<div>
						<div class="flex items-center gap-2.5 mb-2.5 sm:mb-3">
							<span class="text-2xl sm:text-3xl shrink-0">🔍</span>
							<h3 class="text-xl font-extrabold text-white tracking-tight">建立拆解與解決問題的能力</h3>
						</div>
						<p class="text-base text-slate-200 leading-relaxed text-pretty text-justify">
							遇到報錯不慌張。學會看懂 Console 錯誤資訊，能自己動手一步一步找出 Bug 根因。
						</p>
					</div>
					<div class="pt-4 mt-4 sm:mt-5 border-t border-slate-800/80 text-base font-bold text-blue-400">
						✓ 具備獨立除錯思維
					</div>
				</div>

				<!-- 收穫 3 -->
				<div
					class="outcome-card card-subsurface-glow relative rounded-3xl p-5 sm:p-7 bg-slate-900/80 backdrop-blur-xl border border-slate-800/90 shadow-xl shadow-slate-950/60 flex flex-col justify-between overflow-hidden cursor-default w-[78vw] sm:w-[320px] max-w-[340px] shrink-0 snap-start md:w-full md:max-w-none md:shrink"
				>
					<div>
						<div class="flex items-center gap-2.5 mb-2.5 sm:mb-3">
							<span class="text-2xl sm:text-3xl shrink-0">🤖</span>
							<h3 class="text-xl font-extrabold text-white tracking-tight">理解如何與 AI 深度協作</h3>
						</div>
						<p class="text-base text-slate-200 leading-relaxed text-pretty text-justify">
							把 AI 當成高產能的開發助手，由你掌握主導權，提問、驗證並把關程式品質。
						</p>
					</div>
					<div class="pt-4 mt-4 sm:mt-5 border-t border-slate-800/80 text-base font-bold text-purple-400">
						✓ 人機協同判斷力
					</div>
				</div>

				<!-- 收穫 4 -->
				<div
					class="outcome-card card-subsurface-glow relative rounded-3xl p-5 sm:p-7 bg-slate-900/80 backdrop-blur-xl border border-slate-800/90 shadow-xl shadow-slate-950/60 flex flex-col justify-between overflow-hidden cursor-default w-[78vw] sm:w-[320px] max-w-[340px] shrink-0 snap-start md:w-full md:max-w-none md:shrink"
				>
					<div>
						<div class="flex items-center gap-2.5 mb-2.5 sm:mb-3">
							<span class="text-2xl sm:text-3xl shrink-0">🏗️</span>
							<h3 class="text-xl font-extrabold text-white tracking-tight">建立前端與系統整合基礎</h3>
						</div>
						<p class="text-base text-slate-200 leading-relaxed text-pretty text-justify">
							不只切版排版。學會把前端畫面、API 資料與資料庫串聯起來，完成整套系統交付。
						</p>
					</div>
					<div class="pt-4 mt-4 sm:mt-5 border-t border-slate-800/80 text-base font-bold text-emerald-400">
						✓ 系統全貌整合能力
					</div>
				</div>

				<!-- 收穫 5 -->
				<div
					class="outcome-card card-subsurface-glow relative rounded-3xl p-5 sm:p-7 bg-slate-900/80 backdrop-blur-xl border border-slate-800/90 shadow-xl shadow-slate-950/60 flex flex-col justify-between overflow-hidden cursor-default w-[78vw] sm:w-[320px] max-w-[340px] shrink-0 snap-start md:w-full md:max-w-none md:shrink"
				>
					<div>
						<div class="flex items-center gap-2.5 mb-2.5 sm:mb-3">
							<span class="text-2xl sm:text-3xl shrink-0">🤝</span>
							<h3 class="text-xl font-extrabold text-white tracking-tight">認識一起學習成長的夥伴</h3>
						</div>
						<p class="text-base text-slate-200 leading-relaxed text-pretty text-justify">
							半年朝夕相處的同學，成為彼此交流、分享資訊與持續成長的夥伴。
						</p>
					</div>
					<div class="pt-4 mt-4 sm:mt-5 border-t border-slate-800/80 text-base font-bold text-amber-400">
						✓ 累積第一批軟體業人脈
					</div>
				</div>

				<!-- 收穫 6 (靈魂總結卡片：特殊微光突顯) -->
				<div
					class="outcome-card card-subsurface-glow relative rounded-3xl p-5 sm:p-7 bg-gradient-to-br from-cyan-950/40 via-slate-900/90 to-slate-900/80 backdrop-blur-xl border border-cyan-500/40 shadow-xl shadow-cyan-950/40 flex flex-col justify-between overflow-hidden cursor-default w-[78vw] sm:w-[320px] max-w-[340px] shrink-0 snap-start md:w-full md:max-w-none md:shrink"
				>
					<div>
						<div class="flex items-center gap-2.5 mb-2.5 sm:mb-3">
							<span class="text-2xl sm:text-3xl shrink-0">🧭</span>
							<h3 class="text-xl font-extrabold text-white tracking-tight">更清楚自己是否適合走這條路</h3>
						</div>
						<p class="text-base text-slate-100 leading-relaxed text-pretty text-justify">
							六個月認真試過一次，更了解自己是否喜歡這樣的工作，也更有方向做下一個選擇。
						</p>
					</div>
					<div class="pt-4 mt-4 sm:mt-5 border-t border-cyan-500/30 text-base font-extrabold text-cyan-300">
						✨ 最誠實、最寶貴的人生收穫
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
import { useScrollStagger } from '@/composables/useScrollStagger'

// 6 大核心收穫卡片統一由通用 Composable 調度
useScrollStagger('#outcomes-cards-grid .outcome-card', '#outcomes-cards-grid', {
	yOffset: 28,
	duration: 0.85,
	stagger: 0.08,
	ease: 'power1.out',
	start: 'top 85%',
})
</script>

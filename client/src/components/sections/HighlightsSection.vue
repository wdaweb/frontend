<template>
	<section id="highlights" class="py-16 sm:py-20 lg:py-24 xl:py-28 bg-transparent relative overflow-hidden">
		<!-- 背景流光點綴 -->
		<div
			class="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"
		></div>
		<div
			class="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none"
		></div>

		<div class="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 relative z-10 w-full">
			<!-- 區塊前導標題 -->
			<div class="text-center max-w-4xl mx-auto mb-4 sm:mb-12 lg:mb-14">
				<div
					class="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-sm font-bold uppercase tracking-wider shadow-sm mb-3"
				>
					<span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
					<span>In-Person Value ｜ 實體沉浸價值</span>
				</div>
				<h2
					class="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black text-white tracking-tight leading-tight text-balance"
				>
					<span class="block">真正遇到卡關時，</span>
					<span
						class="block mt-1 sm:mt-1.5 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400"
						>差別在身邊有沒有能一起解題的人</span
					>
				</h2>
				<p
					class="hidden sm:block text-slate-400 mt-4 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed text-pretty text-center"
				>
					自學可以走得很遠。但當你面對一個看不懂的錯誤訊息時，有人可以一起討論、有同學可以交流，往往能讓你少繞很多彎路。這也是實體學習真正的價值。
				</p>
			</div>

			<!-- 手機端橫向滑動提示 (桌機隱藏) -->
			<div class="flex md:hidden items-center justify-center gap-2 text-base font-bold text-cyan-400 mt-8 mb-5">
				<span>👈 左右滑動瀏覽 4 大實體價值 👉</span>
			</div>

			<div
				id="highlights-cards-grid"
				tabindex="0"
				role="region"
				aria-label="課程亮點卡片（手機版可左右滑動）"
				class="flex md:grid md:grid-cols-2 xl:grid-cols-4 overflow-x-auto md:overflow-x-visible snap-x snap-mandatory scroll-smooth no-scrollbar -mx-4 px-4 md:mx-0 md:px-0 gap-4 sm:gap-6 pb-4 md:pb-0"
			>
				<!-- 1. 老師陪你拆解問題 (Cyan Theme) -->
				<div
					class="highlight-card card-subsurface-glow relative rounded-3xl p-5 sm:p-6 bg-slate-900/80 backdrop-blur-xl border border-slate-800/90 shadow-xl shadow-slate-950/60 flex flex-col justify-between overflow-hidden cursor-default w-[78vw] sm:w-[320px] max-w-[340px] shrink-0 snap-start md:w-full md:max-w-none md:shrink"
				>
					<div aria-hidden="true"
						class="absolute -right-2 -bottom-4 text-7xl font-mono font-black text-slate-800/20 select-none pointer-events-none"
					>
						01
					</div>

					<div>
						<div class="flex items-center justify-between mb-4 sm:mb-6">
							<div
								class="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(6,182,212,0.2)]"
							>
								👨‍🏫
							</div>
							<span
								class="px-3 py-1 rounded-xl bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-mono font-extrabold text-sm tracking-wider"
							>
								MENTOR
							</span>
						</div>

						<h3 class="text-xl font-extrabold text-white mb-2 sm:mb-3 tracking-tight">老師陪你拆解問題</h3>
						<p class="text-base text-slate-200 leading-relaxed text-pretty text-justify">
							遇到紅字報錯不用慌。老師坐在你身邊，帶你看懂錯誤訊息，教你以後自己也能解開。
						</p>
					</div>
				</div>

				<!-- 2. 專屬雙螢幕實作環境 (Blue Theme) -->
				<div
					class="highlight-card card-subsurface-blue relative rounded-3xl p-5 sm:p-6 bg-slate-900/80 backdrop-blur-xl border border-slate-800/90 shadow-xl shadow-slate-950/60 flex flex-col justify-between overflow-hidden cursor-default w-[78vw] sm:w-[320px] max-w-[340px] shrink-0 snap-start md:w-full md:max-w-none md:shrink"
				>
					<div aria-hidden="true"
						class="absolute -right-2 -bottom-4 text-7xl font-mono font-black text-slate-800/20 select-none pointer-events-none"
					>
						02
					</div>

					<div>
						<div class="flex items-center justify-between mb-4 sm:mb-6">
							<div
								class="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-500/40 text-blue-300 flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(59,130,246,0.2)]"
							>
								🖥️
							</div>
							<span
								class="px-3 py-1 rounded-xl bg-blue-500/10 text-blue-300 border border-blue-500/30 font-mono font-extrabold text-sm tracking-wider"
							>
								2X MONITORS
							</span>
						</div>

						<h3 class="text-xl font-extrabold text-white mb-2 sm:mb-3 tracking-tight">
							專屬<span class="inline-block">雙螢幕實作環境</span>
						</h3>
						<p class="text-base text-slate-200 leading-relaxed text-pretty text-justify">
							一人一台專屬電腦配雙螢幕。上方看老師示範、下方跟著敲代碼，當場做、當場搞懂。
						</p>
					</div>
				</div>

				<!-- 3. 同儕一起學習成長 (Purple Theme) -->
				<div
					class="highlight-card card-subsurface-glow relative rounded-3xl p-5 sm:p-6 bg-slate-900/80 backdrop-blur-xl border border-slate-800/90 shadow-xl shadow-slate-950/60 flex flex-col justify-between overflow-hidden cursor-default w-[78vw] sm:w-[320px] max-w-[340px] shrink-0 snap-start md:w-full md:max-w-none md:shrink"
				>
					<div aria-hidden="true"
						class="absolute -right-2 -bottom-4 text-7xl font-mono font-black text-slate-800/20 select-none pointer-events-none"
					>
						03
					</div>

					<div>
						<div class="flex items-center justify-between mb-4 sm:mb-6">
							<div
								class="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/40 text-purple-300 flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(168,85,247,0.2)]"
							>
								🤝
							</div>
							<span
								class="px-3 py-1 rounded-xl bg-purple-500/10 text-purple-300 border border-purple-500/30 font-mono font-extrabold text-sm tracking-wider"
							>
								PEER LEARNING
							</span>
						</div>

						<h3 class="text-xl font-extrabold text-white mb-2 sm:mb-3 tracking-tight">同儕一起學習成長</h3>
						<p class="text-base text-slate-200 leading-relaxed text-pretty text-justify">
							你不是一個人在戰鬥。身邊同學都在同一個進度上，互相提問討論，卡關更容易走出來。
						</p>
					</div>
				</div>

				<!-- 4. 920 小時集中沉浸 (Emerald Theme) -->
				<div
					class="highlight-card card-subsurface-glow relative rounded-3xl p-5 sm:p-6 bg-slate-900/80 backdrop-blur-xl border border-slate-800/90 shadow-xl shadow-slate-950/60 flex flex-col justify-between overflow-hidden cursor-default w-[78vw] sm:w-[320px] max-w-[340px] shrink-0 snap-start md:w-full md:max-w-none md:shrink"
				>
					<div aria-hidden="true"
						class="absolute -right-2 -bottom-4 text-7xl font-mono font-black text-slate-800/20 select-none pointer-events-none"
					>
						04
					</div>

					<div>
						<div class="flex items-center justify-between mb-4 sm:mb-6">
							<div
								class="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(16|185|129|0.2)]"
							>
								⏳
							</div>
							<span
								class="px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-mono font-extrabold text-sm tracking-wider"
							>
								920 HOURS
							</span>
						</div>

						<h3 class="text-xl font-extrabold text-white mb-2 sm:mb-3 tracking-tight">
							<span class="inline-block">920 小時</span>集中沉浸
						</h3>
						<p class="text-base text-slate-200 leading-relaxed text-pretty text-justify">
							整整半年專心衝刺，課程費用全額補助。不用下班疲累自學，每天有完整 8 小時把技術練扎實。
						</p>
					</div>
				</div>
			</div>

			<!-- 實體價值核心收束金句 (單行不換行，文字極致精煉) -->
			<div class="mt-8 sm:mt-12 text-center">
				<div
					class="inline-block px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md shadow-lg max-w-full"
				>
					<p class="text-sm sm:text-base text-slate-200 whitespace-nowrap">
						🤝 <span class="text-purple-300 font-bold">卡住時隨時有人可問，</span>學習就不用孤軍奮戰。
					</p>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
import { useScrollStagger } from '@/composables/useScrollStagger'

// 4 張核心優勢卡片統一由通用 Composable 調度 (全站 power1.out 絲滑手感 100% 對齊)
useScrollStagger('#highlights-cards-grid .highlight-card', '#highlights-cards-grid', {
	yOffset: 28,
	duration: 0.85,
	stagger: 0.08,
	ease: 'power1.out',
	start: 'top 85%',
})
</script>

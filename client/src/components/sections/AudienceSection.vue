<template>
	<section id="audience-resonance" class="py-16 sm:py-20 lg:py-24 xl:py-28 bg-transparent relative overflow-hidden">
		<!-- 背景流光點綴 -->
		<div
			class="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"
		></div>
		<div
			class="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"
		></div>

		<div class="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 relative z-10 w-full">
			<!-- 受眾心聲共鳴標頭 -->
			<div class="text-center max-w-5xl xl:max-w-6xl mx-auto mb-4 sm:mb-12 lg:mb-14">
				<div
					class="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-sm font-bold uppercase tracking-wider shadow-sm mb-3"
				>
					<span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
					<span>Facing Reality ｜ 面對問題</span>
				</div>
				<h2
					class="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black text-white tracking-tight leading-tight lg:whitespace-nowrap text-balance"
				>
					<span class="block sm:inline">面對轉職，</span
					><span class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 block sm:inline"
						>也許不只是「要不要學程式」</span
					>
				</h2>
				<p
					class="hidden sm:block text-slate-400 mt-4 text-base sm:text-lg max-w-none mx-auto leading-relaxed text-pretty text-center xl:whitespace-nowrap"
				>
					踏入陌生的科技領域，害怕跟不上、害怕選錯方向，都很正常。這些不是你一個人的疑慮，而是許多轉職者都曾面對的問題。
				</p>
			</div>

			<!-- 手機端橫向滑動提示 (桌機隱藏) -->
			<div class="flex md:hidden items-center justify-center gap-2 text-base font-bold text-cyan-400 mt-8 mb-5">
				<span>👈 左右滑動瀏覽 3 大轉職困惑 👉</span>
			</div>

			<!-- 三大對話式反思卡片 (手機露邊橫向滑軌，桌機 md: 3 欄) -->
			<div
				id="resonance-cards-grid"
				tabindex="0"
				role="region"
				aria-label="學員心聲卡片（手機版可左右滑動）"
				class="flex md:grid md:grid-cols-3 overflow-x-auto md:overflow-x-visible snap-x snap-mandatory scroll-smooth no-scrollbar -mx-4 px-4 md:mx-0 md:px-0 gap-4 sm:gap-6 pb-4 md:pb-0"
			>
				<!-- 卡片 1 -->
				<div
					class="resonance-card card-subsurface-glow relative rounded-3xl p-5 sm:p-7 bg-slate-900/80 backdrop-blur-xl border border-slate-800/90 shadow-xl shadow-slate-950/60 flex flex-col justify-between overflow-hidden hover:border-cyan-500/50 transition-[border-color,box-shadow] duration-300 cursor-default w-[78vw] sm:w-full max-w-[340px] md:max-w-none shrink-0 snap-start md:shrink"
				>
					<div>
						<!-- 提問者標籤 -->
						<div class="flex items-center space-x-3 mb-3 sm:mb-4">
							<div
								class="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 flex items-center justify-center text-lg sm:text-xl shadow-[0_0_16px_rgba(6,182,212,0.2)] flex-shrink-0"
							>
								❓
							</div>
							<div class="text-xs sm:text-sm font-mono font-bold text-cyan-400 uppercase tracking-wider">
								COMMON DOUBT 01
							</div>
						</div>
						<h3 class="text-lg xl:text-xl font-extrabold text-white mb-3 tracking-tight">
							完全沒寫過程式，我真的學得會嗎？
						</h3>
						<p class="text-base text-slate-200 leading-relaxed text-pretty text-justify">
							別擔心，許多歷屆學員都是從零開始。老師會從最基礎的網頁開始帶你動手寫程式，每天親手練，一步步把不會變會。
						</p>
					</div>
				</div>

				<!-- 卡片 2 -->
				<div
					class="resonance-card card-subsurface-blue relative rounded-3xl p-5 sm:p-7 bg-slate-900/80 backdrop-blur-xl border border-slate-800/90 shadow-xl shadow-slate-950/60 flex flex-col justify-between overflow-hidden cursor-default w-[78vw] sm:w-full max-w-[340px] md:max-w-none shrink-0 snap-start md:shrink"
				>
					<div>
						<div class="flex items-center space-x-3 mb-3 sm:mb-4">
							<div
								class="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-blue-500/15 border border-blue-500/40 text-blue-300 flex items-center justify-center text-lg sm:text-xl shadow-[0_0_16px_rgba(59,130,246,0.2)] flex-shrink-0"
							>
								🤖
							</div>
							<div class="text-xs sm:text-sm font-mono font-bold text-blue-400 uppercase tracking-wider">
								COMMON DOUBT 02
							</div>
						</div>
						<h3 class="text-lg xl:text-xl font-extrabold text-white mb-3 tracking-tight">
							現在才學寫程式，會不會馬上被 AI 取代？
						</h3>
						<p class="text-base text-slate-200 leading-relaxed text-pretty text-justify">
							AI 可以快速產生程式碼，但真正重要的是，你能看懂、找出問題、驗證並善用 AI
							加速，把需求一步步變成真正能運作的產品。
						</p>
					</div>
				</div>

				<!-- 卡片 3 -->
				<div
					class="resonance-card card-subsurface-glow relative rounded-3xl p-5 sm:p-7 bg-slate-900/80 backdrop-blur-xl border border-slate-800/90 shadow-xl shadow-slate-950/60 flex flex-col justify-between overflow-hidden cursor-default w-[78vw] sm:w-full max-w-[340px] md:max-w-none shrink-0 snap-start md:shrink"
				>
					<div>
						<div class="flex items-center space-x-3 mb-3 sm:mb-4">
							<div
								class="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-purple-500/15 border border-purple-500/40 text-purple-300 flex items-center justify-center text-lg sm:text-xl shadow-[0_0_16px_rgba(168,85,247,0.2)] flex-shrink-0"
							>
								🏫
							</div>
							<div class="text-xs sm:text-sm font-mono font-bold text-purple-400 uppercase tracking-wider">
								COMMON DOUBT 03
							</div>
						</div>
						<h3 class="text-lg xl:text-xl font-extrabold text-white mb-3 tracking-tight">
							自學資源這麼多，為什麼需要來職訓？
						</h3>
						<p class="text-base text-slate-200 leading-relaxed text-pretty text-justify">
							看教學影片卡在一個 Bug 三天就想放棄對吧？在職訓，轉頭就能問老師和同學，不用一個人孤軍奮戰。
						</p>
					</div>
				</div>
			</div>

			<!-- 核心收束金句 (單行不換行，文字極致精煉) -->
			<div class="mt-8 sm:mt-12 text-center">
				<div
					class="inline-block px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md shadow-lg max-w-full"
				>
					<p class="text-sm sm:text-base text-slate-200 whitespace-nowrap">
						💬 <span class="text-cyan-400 font-bold">有猶豫很正常，</span>先把問題想清楚，再決定要不要開始。
					</p>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
import { useScrollStagger } from '@/composables/useScrollStagger'

// 3 大內在共鳴卡片統一由通用 Composable 調度
useScrollStagger('#resonance-cards-grid .resonance-card', '#resonance-cards-grid', {
	yOffset: 28,
	duration: 0.85,
	stagger: 0.08,
	ease: 'power1.out',
	start: 'top 85%',
})
</script>

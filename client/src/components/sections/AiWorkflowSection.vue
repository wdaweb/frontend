<template>
	<section id="ai-workflow" class="py-12 sm:py-20 lg:py-24 xl:py-28 bg-transparent relative overflow-hidden flex flex-col justify-center">
		<!-- 背景微光 -->
		<div
			class="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"
		></div>
		<div
			class="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"
		></div>

		<div class="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 relative z-10 w-full">
			<!-- 大區塊標題區 (標準一級 Section 規格，升級為靈魂核心) -->
			<div class="text-center max-w-5xl mx-auto mb-3 sm:mb-12 lg:mb-14">
				<div
					class="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 text-sm font-bold uppercase tracking-wider shadow-sm mb-3"
				>
					<span class="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping"></span>
					<span>AI Workflow ｜ 現代人機協同</span>
				</div>
				<h2
					class="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight text-balance lg:whitespace-nowrap"
				>
					<span class="block sm:inline">在 AI 時代，</span>
					<span
						class="block sm:inline mt-1 sm:mt-0 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400"
						>我們培養的是能完成產品的人</span
					>
				</h2>
				<p
					class="hidden sm:block text-slate-400 mt-4 text-base sm:text-lg max-w-4xl xl:max-w-5xl mx-auto leading-relaxed text-pretty text-center"
				>
					AI 可以加速開發，但無法取代需求分析與架構思考。培訓期間提供學員每月 Claude AI
					實戰資源，讓頂尖 AI 成為你的副駕駛，由你主導設計、驗證與除錯，最終完成前後端整合與真正可交付的專案。
				</p>
			</div>

			<!-- 手機端橫向滑動提示 (桌機隱藏，對稱勻稱的上下間距) -->
			<div class="flex md:hidden items-center justify-center gap-2 text-base font-bold text-cyan-400 my-4">
				<span>👈 左右滑動瀏覽 3 大 AI 協同場景 👉</span>
			</div>

			<!-- 旗艦 AI 實務應用外層卡片容器 (自適應垂直居中) -->
			<div
				class="relative rounded-3xl p-4 sm:p-8 lg:p-10 bg-gradient-to-br from-slate-900/95 via-slate-900/85 to-slate-950/95 border border-cyan-500/30 hover:border-cyan-500/50 transition-all duration-300 backdrop-blur-xl shadow-2xl shadow-slate-950/70 overflow-hidden group flex flex-col justify-center"
			>
				<!-- 頂部高光流線 -->
				<div
					class="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent opacity-70 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
				></div>

				<!-- 背景科技光暈微光 -->
				<div
					class="absolute -top-24 -right-24 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"
				></div>
				<div
					class="absolute -bottom-24 -left-24 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"
				></div>

				<div class="relative z-10 flex flex-col justify-center space-y-0 sm:space-y-6">
					<!-- 3 大核心 AI 輔助應用卡片 (手機橫向滑軌避免堆疊 750px，桌機 3 欄並排大氣) -->
					<div
						class="flex md:grid md:grid-cols-3 overflow-x-auto md:overflow-x-visible snap-x snap-mandatory scroll-smooth no-scrollbar -mx-1 px-1 md:mx-0 md:px-0 gap-4 sm:gap-6 py-1 md:py-0 items-stretch"
					>
						<!-- 卡片 1 -->
						<div
							class="p-6 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-cyan-500/40 transition-colors flex flex-col justify-between w-[80vw] max-w-[320px] shrink-0 snap-start md:w-auto md:max-w-none md:shrink"
						>
							<div>
								<div class="flex items-center gap-2.5 mb-2.5">
									<span class="text-2xl sm:text-3xl shrink-0">💡</span>
									<h3 class="text-xl font-bold text-white tracking-tight">想法轉化為程式雛型</h3>
								</div>
								<p class="text-base text-slate-300 leading-relaxed text-pretty text-justify">
									用精確 Prompt 讓 AI 快速生成版面與雛型，大幅縮短從零摸索的時間。
								</p>
							</div>
							<div class="pt-4 mt-5 border-t border-slate-800/70 flex flex-wrap gap-2">
								<span
									class="px-3 py-1 rounded-lg bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 text-sm font-medium"
								>
									#加速起步
								</span>
								<span
									class="px-3 py-1 rounded-lg bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 text-sm font-medium"
								>
									#需求轉譯
								</span>
							</div>
						</div>

						<!-- 卡片 2 -->
						<div
							class="p-6 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-blue-500/40 transition-colors flex flex-col justify-between w-[80vw] max-w-[320px] shrink-0 snap-start md:w-auto md:max-w-none md:shrink"
						>
							<div>
								<div class="flex items-center gap-2.5 mb-2.5">
									<span class="text-2xl sm:text-3xl shrink-0">🔍</span>
									<h3 class="text-xl font-bold text-white tracking-tight">報錯解讀與輔助除錯</h3>
								</div>
								<p class="text-base text-slate-300 leading-relaxed text-pretty text-justify">
									看不懂報錯時請 AI 翻譯成白話、分析原因，提供多元解題思路。
								</p>
							</div>
							<div class="pt-4 mt-5 border-t border-slate-800/70 flex flex-wrap gap-2">
								<span
									class="px-3 py-1 rounded-lg bg-blue-500/15 text-blue-300 border border-blue-500/30 text-sm font-medium"
								>
									#白話報錯
								</span>
								<span
									class="px-3 py-1 rounded-lg bg-blue-500/15 text-blue-300 border border-blue-500/30 text-sm font-medium"
								>
									#快速定位
								</span>
							</div>
						</div>

						<!-- 卡片 3 -->
						<div
							class="p-6 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-emerald-500/40 transition-colors flex flex-col justify-between w-[80vw] max-w-[320px] shrink-0 snap-start md:w-auto md:max-w-none md:shrink"
						>
							<div>
								<div class="flex items-center gap-2.5 mb-2.5">
									<span class="text-2xl sm:text-3xl shrink-0">🛡️</span>
									<h3 class="text-xl font-bold text-white tracking-tight">批判審核與把關驗證</h3>
								</div>
								<p class="text-base text-slate-300 leading-relaxed text-pretty text-justify">
									AI 也會犯錯。培養逐行審閱與除錯驗證能力，掌握專案最終主導權。
								</p>
							</div>
							<div class="pt-4 mt-5 border-t border-slate-800/70 flex flex-wrap gap-2">
								<span
									class="px-3 py-1 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-sm font-medium"
								>
									#主導權在人
								</span>
								<span
									class="px-3 py-1 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-sm font-medium"
								>
									#抗AI幻覺
								</span>
							</div>
						</div>
					</div>

					<!-- 底部核心共鳴收束引言 (手機版隱藏，平板與桌機 sm:flex 呈現) -->
					<div
						class="hidden sm:flex pt-4 sm:pt-5 border-t border-slate-800/80 flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 text-sm sm:text-base leading-relaxed"
					>
						<span class="text-slate-200 font-medium"
							>💡 核心理念：AI 敲鍵盤再快，企業需要的，不只是會使用 AI，而是能看懂程式碼、抓出
							Bug、交付完整產品的人</span
						>
						<span class="text-cyan-400 font-bold tracking-wide">🎯 培養獨立解決問題與系統交付的能力</span>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
// 純展示型現代人機協同實務大區塊，包含 3 大核心實踐場景卡片
</script>

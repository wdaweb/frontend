<template>
	<section id="engineering-mindset" class="py-16 sm:py-20 lg:py-24 xl:py-28 bg-transparent relative overflow-hidden">
		<!-- 背景微光 -->
		<div
			class="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"
		></div>
		<div
			class="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"
		></div>

		<div class="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 relative z-10 w-full">
			<!-- 大區塊標題區 (標準一級 Section 規格) -->
			<div class="text-center max-w-5xl mx-auto mb-4 sm:mb-12 lg:mb-14">
				<div
					class="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-sm font-bold uppercase tracking-wider shadow-sm mb-3"
				>
					<span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
					<span>Engineering Mindset ｜ 工程思維核心</span>
				</div>
				<h2 class="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight text-balance">
					<span class="block">在 AI 時代，</span>
					<span
						class="block mt-1 sm:mt-1.5 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300"
						>我們培養的是能完成產品的人</span
					>
				</h2>
				<p
					class="hidden sm:block text-slate-400 mt-4 text-base sm:text-lg max-w-4xl xl:max-w-5xl mx-auto leading-relaxed text-pretty text-center"
				>
					AI 能在幾秒內生成程式碼，卻無法替你定義需求、拆解架構與確保品質。我們更重視的，是培養理解需求、拆解模組、AI 協作、驗證除錯、系統整合的完整工程能力。
				</p>
			</div>

			<!-- 旗艦工程思維展台卡片 (手機端單一框框呈現) -->
			<div
				class="relative rounded-2xl sm:rounded-3xl p-3.5 sm:p-8 lg:p-10 bg-gradient-to-br from-slate-900/95 via-slate-900/85 to-slate-950/95 border border-cyan-500/30 hover:border-cyan-500/50 transition-all duration-300 backdrop-blur-xl shadow-2xl shadow-slate-950/70 overflow-hidden group"
			>
				<!-- 頂部高光流線 -->
				<div
					class="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent opacity-70 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
				></div>

				<!-- 背景科技光暈微光 -->
				<div
					class="absolute -top-24 -right-24 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"
				></div>
				<div
					class="absolute -bottom-24 -left-24 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"
				></div>

				<div class="relative z-10 space-y-4 sm:space-y-6">
					<!-- ========================================================================= -->
					<!-- 工程思維核心理念看板 (跨裝置自適應資訊量分流：手機2x2 / 平板雙欄 / 筆電橫向管線 / 桌機旗艦展台) -->
					<!-- ========================================================================= -->

					<!-- 1. 📱 手機端 (sm:hidden)：單一框框表示，徹底消除外框包內框的嵌套厚重感，釋放空間 -->
					<div class="sm:hidden space-y-3">
						<div class="space-y-1">
							<div class="inline-flex items-center space-x-1.5 text-xs font-bold text-cyan-400 font-mono">
								<span class="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
								<span>CORE CAPABILITY</span>
							</div>
							<div class="text-base font-extrabold text-white">
								AI 時代，更重要的是工程能力
							</div>
							<div class="text-xs text-cyan-300 font-medium flex items-center space-x-1 pt-0.5">
								<span class="font-bold">✓</span>
								<span>看懂背後邏輯 · 自主除錯驗證 · 整合前後端交付產品</span>
							</div>
						</div>
						<!-- 5 步心智流程清單 (去除右側冗餘標籤，大字清晰通透) -->
						<div class="pt-2 border-t border-slate-800/80 space-y-2">
							<div
								v-for="step in mindsetSteps"
								:key="`m-step-${step.num}`"
								class="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between text-base shadow-sm"
							>
								<div class="inline-flex items-center space-x-2 shrink-0">
									<span class="text-xl font-black text-cyan-400 leading-none font-sans">{{ step.num }}</span>
									<span class="text-base font-bold text-cyan-300">{{ step.title }}</span>
								</div>
								<span class="text-white font-bold text-base text-right">{{ step.mobileQuestion || step.question }}</span>
							</div>
						</div>
					</div>

					<!-- 2. 📟 平板端 (hidden sm:block lg:hidden)：雙欄對比，留白舒適 -->
					<div class="hidden sm:block lg:hidden p-5 rounded-3xl bg-slate-950/80 border border-cyan-500/30 shadow-xl">
						<div class="grid grid-cols-2 gap-5 items-stretch">
							<div
								class="space-y-3 p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 flex flex-col justify-center"
							>
								<div>
									<div class="inline-flex items-center space-x-1.5 text-xs font-bold text-cyan-400 font-mono mb-1.5">
										<span class="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
										<span>CORE CAPABILITY</span>
									</div>
									<h4 class="text-lg font-extrabold text-white leading-snug mb-3">
										AI 時代，<br /><span class="text-cyan-300">更重要的是工程能力</span>
									</h4>
									<ul class="space-y-2.5 text-sm sm:text-base text-slate-200">
										<li v-for="(cap, cIdx) in coreCapabilities" :key="`tab-cap-${cIdx}`" class="flex items-start space-x-2">
											<span class="text-cyan-400 font-bold">✓</span>
											<span>{{ cap }}</span>
										</li>
									</ul>
								</div>
							</div>

							<div
								class="space-y-3 p-5 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 flex flex-col justify-between"
							>
								<div>
									<div class="inline-flex items-center space-x-1.5 text-xs font-bold text-cyan-400 font-mono mb-1">
										<span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
										<span>5-STAGE ENGINEERING MINDSET</span>
									</div>
									<h4 class="text-base sm:text-lg font-extrabold text-cyan-300">我們培養：能完成產品的人</h4>
									<div class="space-y-2.5 mt-3">
										<div
											v-for="step in mindsetSteps"
											:key="`tab-step-${step.num}`"
											class="p-3 rounded-xl bg-slate-900/90 border border-slate-800/80 flex items-center justify-between shadow-sm"
										>
											<div class="inline-flex items-center space-x-2">
												<span class="text-xl sm:text-2xl font-black text-cyan-400 leading-none">{{ step.num }}</span>
												<span class="text-base sm:text-lg font-bold text-cyan-300">{{ step.title }}</span>
											</div>
											<span class="text-white font-bold text-base sm:text-lg">{{ step.question }}</span>
											<span class="text-xs sm:text-sm text-slate-300 font-medium">{{ step.tag }}</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					<!-- 3. 💻 筆電端 (hidden lg:block xl:hidden)：橫向 5 步水平流水線，矮螢幕一覽無遺 -->
					<div
						class="hidden lg:block xl:hidden p-4 rounded-3xl bg-slate-950/80 border border-cyan-500/30 shadow-xl space-y-3"
					>
						<div class="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
							<div class="flex items-center space-x-2">
								<span
									class="px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 text-xs font-bold font-mono"
									>核心能力</span
								>
								<span class="text-sm font-bold text-white">AI 時代，更重要的是工程能力</span>
							</div>
							<span class="text-xs font-mono text-cyan-400/80 font-bold">➔ 5 階段工程心智自問 ➔</span>
							<div class="flex items-center space-x-2">
								<span
									class="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-bold font-mono"
									>結訓具備</span
								>
								<span class="text-sm font-extrabold text-emerald-300">能完成產品的現代工程師</span>
							</div>
						</div>
						<div class="grid grid-cols-5 gap-2.5 items-stretch text-center">
							<div
								v-for="step in mindsetSteps"
								:key="`lap-step-${step.num}`"
								class="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between shadow-md"
							>
								<div class="inline-flex items-center justify-center space-x-1">
									<span class="text-xl sm:text-2xl font-black text-cyan-400 leading-none font-sans">{{ step.num }}</span>
									<span class="text-base font-bold text-cyan-300 tracking-wider">{{ step.title }}</span>
								</div>
								<div class="text-base sm:text-lg font-extrabold text-white my-1.5 leading-snug">{{ step.question }}</div>
								<span class="text-xs sm:text-sm text-slate-300 font-bold">{{ step.tag }}</span>
							</div>
						</div>
					</div>

					<!-- 4. 🖥️ 桌機端 (hidden xl:block)：旗艦科技對照展台 (左 3 欄精實展台 + 右 9 欄寬版 5 步流水線，確保字字單行) -->
					<div class="hidden xl:block p-6 rounded-3xl bg-slate-950/85 border border-cyan-500/30 shadow-2xl">
						<div class="grid grid-cols-12 gap-5 2xl:gap-6 items-stretch">
							<!-- 左側 3 欄：核心工程能力展台 (精實凝練) -->
							<div
								class="col-span-3 p-5 rounded-2xl bg-slate-900/70 border border-slate-800/90 flex flex-col justify-center space-y-3"
							>
								<div class="space-y-2.5">
									<div
										class="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-xs font-bold font-mono"
									>
										<span class="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
										<span>CORE CAPABILITY</span>
									</div>
									<h4 class="text-xl font-extrabold text-white leading-snug">
										<span class="block">AI 時代，</span>
										<span class="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300"
											>更重要的是工程能力</span
										>
									</h4>
									<ul class="space-y-2.5 text-base text-slate-200">
										<li v-for="(cap, cIdx) in coreCapabilities" :key="`dt-cap-${cIdx}`" class="flex items-start space-x-2">
											<span class="text-cyan-400 mt-0.5 font-bold">✓</span>
											<span class="leading-relaxed">{{ cap }}</span>
										</li>
									</ul>
								</div>
							</div>

							<!-- 右側 9 欄：5 階段心智自問工程管線 (9 欄寬敞舒展，5 步驟文字 100% 單行不折行) -->
							<div
								class="col-span-9 p-5 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 flex flex-col justify-between"
							>
								<div class="flex items-center justify-between mb-3">
									<div
										class="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 text-xs font-bold font-mono"
									>
										<span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
										<span>5-STAGE ENGINEERING MINDSET</span>
									</div>
									<span class="text-base font-extrabold text-cyan-300">我們真正培養的 5 大核心工程心智</span>
								</div>

								<div class="grid grid-cols-5 gap-2 2xl:gap-3 items-stretch text-center">
									<div
										v-for="step in mindsetSteps"
										:key="`dt-step-${step.num}`"
										class="py-4 px-1.5 2xl:px-3 rounded-2xl bg-slate-900/90 border border-slate-800/90 flex flex-col justify-between hover:border-cyan-500/40 transition-colors shadow-lg"
									>
										<div class="inline-flex items-center justify-center space-x-1.5">
											<span class="text-2xl 2xl:text-3xl text-cyan-400 font-black leading-none font-sans">{{ step.num }}</span>
											<span class="text-base 2xl:text-lg text-cyan-300 font-bold tracking-wider">{{ step.title }}</span>
										</div>
										<div class="text-base 2xl:text-lg font-black text-white my-2.5 leading-snug whitespace-nowrap">{{ step.question }}</div>
										<span class="text-sm 2xl:text-base font-bold text-slate-300 whitespace-nowrap">{{ step.tag }}</span>
									</div>
								</div>
							</div>
						</div>
					</div>

					<!-- 底部心智理念收束引言 (手機版隱藏，平板與桌機 sm:flex 呈現) -->
					<div
						class="hidden sm:flex pt-3.5 sm:pt-5 border-t border-slate-800/80 flex-col lg:flex-row lg:items-center justify-between gap-2.5 sm:gap-4 text-base sm:text-lg leading-relaxed"
					>
						<span class="text-slate-200 font-medium">💡 核心理念：AI 敲鍵盤再快，企業真正花錢僱用的，是能看懂程式碼、抓出 Bug、把產品完整做出來的人</span>
						<span class="text-cyan-400 font-bold tracking-wide">🎯 培養獨立解決問題與系統交付的能力</span>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
interface MindsetStep {
	num: string
	title: string
	question: string
	mobileQuestion?: string
	tag: string
}

const coreCapabilities = [
	'看懂 AI 給的程式，掌握背後邏輯',
	'能自主分析問題，完成除錯與驗證',
	'能整合前後端，完成可交付的產品',
]

const mindsetSteps: MindsetStep[] = [
	{ num: '①', title: '理解', question: '需求到底是什麼？', tag: '需求定義' },
	{ num: '②', title: '拆解', question: '這個問題怎麼拆？', tag: '架構拆解' },
	{ num: '③', title: '協作', question: '如何讓 AI 幫我加速？', tag: '精準協同' },
	{ num: '④', title: '驗證', question: 'AI 做的是對的嗎？', tag: '修改與 Debug' },
	{ num: '⑤', title: '整合', question: '如何真正運作？', mobileQuestion: '如何把功能真正串起來？', tag: '完成產品的人' },
]
</script>

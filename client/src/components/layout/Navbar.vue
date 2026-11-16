<template>
	<header class="fixed z-50 transition-all duration-500 ease-out" :class="navbarContainerClasses">
		<!-- ========================================================================= -->
		<!-- 頂部外圍全息漸層毛玻璃消隱天幕 (Ambient Frosted Glass Curtain - 方案 1 & 2 專用) -->
		<!-- ========================================================================= -->
		<div
			v-if="isScrolled && activeNavbarStyle === 'smart_morph'"
			class="fixed top-0 inset-x-0 h-28 sm:h-32 pointer-events-none -z-20 transition-opacity duration-500 ambient-glass-curtain"
		></div>

		<!-- ========================================================================= -->
		<!-- 方案 1：雙態智能變形 × 能量雷射光軌 (Smart Morph × Laser Rail) -->
		<!-- ========================================================================= -->
		<div
			v-if="activeNavbarStyle === 'smart_morph'"
			class="w-full transition-all duration-500 ease-out relative"
			:class="[isScrolled ? 'px-2.5 sm:px-4 lg:px-6 2xl:px-8 pt-2 sm:pt-3' : 'px-0 pt-0']"
		>
			<nav
				class="relative flex items-center justify-between gap-2 transition-all duration-500 ease-out overflow-hidden"
				:class="[
					isScrolled
						? 'w-full max-w-[1536px] 2xl:max-w-[1680px] mx-auto h-16 sm:h-18 px-3 sm:px-6 lg:px-8 rounded-2xl bg-slate-900/90 backdrop-blur-2xl border border-cyan-500/40 shadow-2xl shadow-cyan-950/70'
						: 'w-full h-20 bg-slate-950/70 backdrop-blur-md border-b border-slate-800/80 px-3 sm:px-6 lg:px-8 2xl:px-12 rounded-none',
				]"
			>
				<!-- ========================================================================= -->
				<!-- 方案 1 一體化運動光艙 (內部背光 + 頂部雷射光斑 100% 同步) -->
				<!-- ========================================================================= -->
				<div class="absolute inset-0 pointer-events-none overflow-hidden">
					<div
						class="absolute inset-y-0 w-80 sm:w-96 pointer-events-none"
						:class="`glow-laser-${activeGlowPreset}`"
					>
						<!-- 1. 內部漫射背光穿透氣團 (z-0) -->
						<div
							class="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/15 via-blue-500/10 to-transparent blur-xl pointer-events-none"
						></div>

						<!-- 2. 頂部能量雷射光斑 (居中對齊頂部，z-20) -->
						<div
							class="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/90 to-transparent shadow-[0_0_16px_#22d3ee] pointer-events-none z-20"
						></div>
					</div>
				</div>

				<!-- Left: Official Logo -->
				<div class="flex items-center justify-start flex-1 min-w-0">
					<router-link to="/" class="flex items-center space-x-1.5 sm:space-x-3 group relative z-10 min-w-0">
						<div class="flex-shrink-0 flex items-center justify-center">
							<img
								:src="store.settings?.site_logo_url || defaultLogo"
								:alt="store.settings?.site_title || '泰山職訓 Logo'"
								@error="handleLogoError"
								class="h-7 sm:h-9 md:h-10 w-auto max-w-[100px] sm:max-w-[160px] object-contain rounded-lg drop-shadow-md group-hover:scale-105 transition-transform"
							/>
						</div>
						<div class="flex flex-col min-w-0 justify-center">
							<!-- 官方全名完整呈現（大字階梯：手機端 16px text-base，移除 truncate 絕無省略號 ...） -->
							<div class="flex items-center space-x-2 min-w-0">
								<span
									class="font-extrabold tracking-tighter sm:tracking-tight text-white group-hover:text-cyan-400 transition-colors leading-tight whitespace-nowrap text-sm min-[375px]:text-base sm:text-lg lg:text-xl shrink-0"
								>
									{{ store.settings?.site_title || '泰山職訓－前端網頁技術與AI應用' }}
								</span>
							</div>
							<div class="flex items-center flex-wrap gap-x-1.5 gap-y-0.5 text-xs sm:text-sm text-slate-400 font-medium leading-tight mt-0.5 sm:mt-1">
								<span class="hidden 2xl:inline shrink-0">泰山職業訓練場 ｜</span>
								<span class="inline-flex items-center gap-1 text-amber-300 font-bold min-w-0">
									<svg
										class="w-3.5 h-3.5 text-amber-400 shrink-0"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2.4"
										stroke-linecap="round"
										aria-hidden="true"
									>
										<line x1="12" y1="2.5" x2="12" y2="21.5" />
										<line x1="2.5" y1="12" x2="21.5" y2="12" />
										<line x1="5.3" y1="5.3" x2="18.7" y2="18.7" />
										<line x1="18.7" y1="5.3" x2="5.3" y2="18.7" />
										<line x1="8.4" y1="3.2" x2="15.6" y2="20.8" />
										<line x1="3.2" y1="8.4" x2="20.8" y2="15.6" />
									</svg>
									<span>培訓享每月 Claude AI 資源</span>
								</span>
							</div>
						</div>
					</router-link>
				</div>

				<!-- Center: Nav Items with Magnetic Pill (水平正中間絕對置中，維持大字階梯 text-sm xl:text-base font-bold) -->
				<div
					class="hidden lg:flex items-center justify-center flex-shrink-0 relative z-10 px-1 xl:px-3"
				>
					<div
						class="flex items-center space-x-1 xl:space-x-1.5 p-1.5 px-2.5 xl:px-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 backdrop-blur-md"
					>
						<router-link
							v-for="item in navItems"
							:key="item.path"
							:to="item.path"
							class="relative px-2.5 xl:px-3.5 py-1.5 xl:py-2 rounded-xl text-xs lg:text-sm xl:text-base font-bold transition-all duration-200 flex items-center space-x-1.5"
							:class="[
								$route.path === item.path
									? 'text-cyan-300 font-extrabold'
									: 'text-slate-300 hover:text-white hover:bg-slate-800/60',
							]"
						>
							<!-- 磁吸微光膠囊底塊 -->
							<span
								v-if="$route.path === item.path"
								class="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-cyan-500/20 border border-cyan-400/40 shadow-sm shadow-cyan-500/30 -z-10 animate-fade-in"
							></span>
							<span>{{ item.name }}</span>
							<!-- 招生狀態小徽章 -->
							<span
								v-if="item.path === '/admission' && admissionBadge"
								class="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-bold leading-none ml-0.5"
								:class="admissionBadge.class"
							>
								<span
									v-if="admissionBadge.hasDot"
									class="w-1.5 h-1.5 rounded-full mr-1"
									:class="admissionBadge.dotClass"
								></span>
								<span>{{ admissionBadge.text }}</span>
							</span>
						</router-link>
					</div>
				</div>

				<!-- Right: Action Button (窄平板顯示簡短文案，平板以上展開大字，筆電端空間自適應) -->
				<div class="flex items-center justify-end shrink-0 lg:flex-1 lg:min-w-0 space-x-2 relative z-10">
					<router-link
						to="/admission"
						class="hidden sm:inline-flex items-center font-extrabold text-xs md:text-sm xl:text-base text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-md shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105 active:scale-95 transition-all flex-shrink-0 px-3 md:px-4 xl:px-5 py-2 xl:py-2.5 rounded-xl"
					>
						<span class="md:hidden">招生報名</span>
						<span class="hidden md:inline">立即查看招生期別</span>
						<span class="ml-1">→</span>
					</router-link>

					<button
						type="button"
						@click="isOpen = !isOpen"
						class="lg:hidden p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-slate-300 hover:text-white bg-slate-800/80 border border-slate-700/60 focus:outline-none flex-shrink-0"
						aria-label="主要導覽選單開關"
					>
						<span v-if="!isOpen">☰</span>
						<span v-else>✕</span>
					</button>
				</div>
			</nav>
		</div>

		<!-- ========================================================================= -->
		<!-- 方案 2：滿版全景 × 實心不透明導覽列 × 底部神祕漫射極光 (Mysterious Bottom Underglow) -->
		<!-- ========================================================================= -->
		<div v-else-if="activeNavbarStyle === 'full_autohide'" class="w-full relative">
			<nav
				class="w-full h-20 transition-all duration-300 relative z-20 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 shadow-2xl shadow-black/90 overflow-hidden"
			>
				<!-- 導覽列極光雷射一體化運動光艙 (100% 絕對物理鎖定同步 - 內部背光 + 1px 邊框光絲) -->
				<div class="absolute inset-0 pointer-events-none overflow-hidden">
					<div
						class="absolute inset-y-0 w-[280px] sm:w-[380px] lg:w-[460px] pointer-events-none"
						:class="`glow-stream-${activeGlowPreset}`"
					>
						<!-- 1. 內部漫射背光穿透氣團 (滿版覆蓋 Navbar 內部，z-0) -->
						<div
							class="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/18 via-blue-500/12 to-transparent blur-xl pointer-events-none"
						></div>

						<!-- 2. 底部 1px 邊框微光絲 (精準居中座落於運動艙正底部，z-20) -->
						<div
							class="absolute bottom-0 inset-x-0 h-[4px] translate-y-[2px] flex flex-col items-center pointer-events-none z-20"
						>
							<!-- 緊湊 2px 微光暈 (居中寬度 80%) -->
							<div
								class="w-4/5 h-[3px] -translate-y-[1px] bg-gradient-to-r from-transparent via-cyan-400/90 via-blue-400/70 to-transparent blur-[2px] rounded-full"
							></div>
							<!-- 1px 核心微光絲 (居中寬度 60%，雷射核心) -->
							<div
								class="w-3/5 h-[1px] -translate-y-[2px] bg-gradient-to-r from-transparent via-cyan-100 via-cyan-300 to-transparent shadow-[0_0_8px_#22d3ee]"
							></div>
						</div>
					</div>
				</div>

				<div
					class="max-w-[1536px] mx-auto px-3 sm:px-6 lg:px-8 2xl:px-12 h-full flex items-center justify-between gap-2 relative z-10"
				>
					<!-- Left: Official Logo + AI Pulse -->
					<div class="flex items-center justify-start flex-1 min-w-0">
						<router-link to="/" class="flex items-center space-x-1.5 sm:space-x-3 group relative z-10 min-w-0">
							<div class="flex-shrink-0 flex items-center justify-center">
								<img
									:src="store.settings?.site_logo_url || defaultLogo"
									:alt="store.settings?.site_title || '泰山職訓 Logo'"
									@error="handleLogoError"
									class="h-7 sm:h-9 md:h-10 w-auto max-w-[100px] sm:max-w-[160px] object-contain rounded-lg drop-shadow-md group-hover:scale-105 transition-transform"
								/>
							</div>
							<div class="flex flex-col min-w-0 justify-center">
								<!-- 官方全名完整呈現（大字階梯：手機端 16px text-base，移除 truncate 絕無省略號 ...） -->
								<div class="flex items-center space-x-2 min-w-0">
									<span
										class="font-extrabold tracking-tighter sm:tracking-tight text-white group-hover:text-cyan-400 transition-colors leading-tight whitespace-nowrap text-sm min-[375px]:text-base sm:text-lg lg:text-xl shrink-0"
									>
										{{ store.settings?.site_title || '泰山職訓－前端網頁技術與AI應用' }}
									</span>
								</div>
								<div class="flex items-center flex-wrap gap-x-1.5 gap-y-0.5 text-xs sm:text-sm text-slate-400 font-medium leading-tight mt-0.5 sm:mt-1">
									<span class="hidden 2xl:inline shrink-0">泰山職業訓練場 ｜</span>
									<span class="inline-flex items-center gap-1 text-amber-300 font-bold min-w-0">
										<svg
											class="w-3.5 h-3.5 text-amber-400 shrink-0"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2.4"
											stroke-linecap="round"
											aria-hidden="true"
										>
											<line x1="12" y1="2.5" x2="12" y2="21.5" />
											<line x1="2.5" y1="12" x2="21.5" y2="12" />
											<line x1="5.3" y1="5.3" x2="18.7" y2="18.7" />
											<line x1="18.7" y1="5.3" x2="5.3" y2="18.7" />
											<line x1="8.4" y1="3.2" x2="15.6" y2="20.8" />
											<line x1="3.2" y1="8.4" x2="20.8" y2="15.6" />
										</svg>
										<span>培訓享每月 Claude AI 資源</span>
									</span>
								</div>
							</div>
						</router-link>
					</div>

					<!-- Center: Nav Items with Magnetic Pill (水平正中間置中) -->
					<div
						class="hidden lg:flex items-center justify-center flex-shrink-0 relative z-10 px-1 xl:px-3"
					>
						<div
							class="flex items-center space-x-1 xl:space-x-1.5 p-1.5 px-2.5 xl:px-3 rounded-2xl bg-slate-950/50 border border-slate-800/80 backdrop-blur-md"
						>
							<router-link
								v-for="item in navItems"
								:key="item.path"
								:to="item.path"
								class="relative px-3 xl:px-3.5 py-1.5 xl:py-2 rounded-xl text-sm xl:text-base font-bold transition-all duration-200 flex items-center space-x-1.5"
								:class="[
									$route.path === item.path
										? 'text-cyan-300 font-extrabold'
										: 'text-slate-300 hover:text-white hover:bg-slate-800/60',
								]"
							>
								<span
									v-if="$route.path === item.path"
									class="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-cyan-500/20 border border-cyan-400/40 shadow-sm shadow-cyan-500/30 -z-10 animate-fade-in"
								></span>
								<span>{{ item.name }}</span>
								<span
									v-if="item.path === '/admission' && admissionBadge"
									class="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-bold leading-none ml-0.5"
									:class="admissionBadge.class"
								>
									<span
										v-if="admissionBadge.hasDot"
										class="w-1.5 h-1.5 rounded-full mr-1"
										:class="admissionBadge.dotClass"
									></span>
									<span>{{ admissionBadge.text }}</span>
								</span>
							</router-link>
						</div>
					</div>

					<!-- Right: Action Button -->
					<div class="flex items-center justify-end shrink-0 lg:flex-1 lg:min-w-0 space-x-2 relative z-10">
						<router-link
							to="/admission"
							class="hidden sm:inline-flex items-center px-4 xl:px-5 py-2 xl:py-2.5 rounded-xl font-extrabold text-sm xl:text-base text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-md shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105 active:scale-95 transition-all flex-shrink-0"
						>
							<span>{{ admissionBadge ? admissionBadge.ctaText : '立即查看招生資訊' }}</span>
							<span class="ml-1">→</span>
						</router-link>

						<button
							type="button"
							@click="isOpen = !isOpen"
							class="lg:hidden p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-slate-300 hover:text-white bg-slate-800/80 border border-slate-700/60 focus:outline-none flex-shrink-0"
							aria-label="主要導覽選單開關"
						>
							<span v-if="!isOpen">☰</span>
							<span v-else>✕</span>
						</button>
					</div>
				</div>
			</nav>
		</div>

		<!-- ========================================================================= -->
		<!-- Mobile Backdrop Overlay (點擊選單外部快速關閉) -->
		<!-- ========================================================================= -->
		<Transition name="fade-in">
			<div
				v-if="isOpen"
				@click="isOpen = false"
				class="lg:hidden fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-40"
			></div>
		</Transition>

		<!-- ========================================================================= -->
		<!-- Mobile Drawer (全模式共用優質手機/平板版選單，平板端居中限寬更精緻) -->
		<!-- ========================================================================= -->
		<Transition name="fade-slide">
			<div
				v-if="isOpen"
				class="lg:hidden fixed inset-x-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-lg top-[76px] sm:top-[88px] p-5 sm:p-6 rounded-3xl bg-slate-900/95 backdrop-blur-2xl border border-slate-800 shadow-2xl shadow-black/80 space-y-2 z-50 max-h-[calc(100dvh-100px)] overflow-y-auto"
			>
				<router-link
					v-for="item in navItems"
					:key="item.path"
					:to="item.path"
					@click="isOpen = false"
					class="flex items-center justify-between px-5 py-4 rounded-2xl text-lg font-extrabold transition-all"
					:class="[
						$route.path === item.path
							? 'text-cyan-300 bg-cyan-500/20 border border-cyan-400/40 shadow-sm shadow-cyan-500/20'
							: 'text-slate-200 hover:text-white hover:bg-slate-800/80',
					]"
				>
					<span class="tracking-tight">{{ item.name }}</span>
					<span
						v-if="item.path === '/admission' && admissionBadge"
						class="inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-bold tracking-wide"
						:class="admissionBadge.class"
					>
						<span
							v-if="admissionBadge.hasDot"
							class="w-2 h-2 rounded-full mr-1.5"
							:class="admissionBadge.dotClass"
						></span>
						<span>{{ admissionBadge.fullText }}</span>
					</span>
				</router-link>

				<div class="pt-3.5">
					<router-link
						to="/admission"
						@click="isOpen = false"
						class="block w-full text-center py-4 rounded-2xl text-lg sm:text-xl font-black tracking-wide text-white bg-gradient-to-r from-cyan-500 to-blue-600 shadow-xl shadow-cyan-500/25 active:scale-[0.98] transition-transform"
					>
						{{ admissionBadge ? admissionBadge.ctaText : '立即查看招生資訊' }}
					</router-link>
				</div>
			</div>
		</Transition>
	</header>
</template>

<script setup lang="ts">
import defaultLogo from '@/assets/logo.png'
import { useCmsStore } from '@/stores/useCmsStore'
import { useThemeStore } from '@/stores/useThemeStore'
import { getNavbarAdmissionBadge } from '@/utils/batchStatus'
import { computed, onMounted, onUnmounted, ref } from 'vue'

const store = useCmsStore()
const themeStore = useThemeStore()

// 防禦性讀取全站主題設定，保障 HMR 熱重載與初始載入 100% 穩定
const activeNavbarStyle = computed(() => themeStore?.activeNavbarStyle || 'smart_morph')
const activeGlowPreset = computed(() => themeStore?.activeGlowPreset || 'cosmic')

const isScrolled = ref(false)
const isOpen = ref(false)
const scrollDirection = ref<'up' | 'down'>('up')
let lastScrollY = 0


// 雙重防禦：當遠端 Logo 網址 404 或載入失敗時，立即無縫降級回傳本地官方高畫質 Logo
function handleLogoError(e: Event) {
	const img = e.target as HTMLImageElement
	if (img && img.src !== defaultLogo) {
		img.src = defaultLogo
	}
}

const admissionBadge = computed(() => getNavbarAdmissionBadge(store.batches))

const navItems = [
	{ name: '課程特色介紹', path: '/' },
	{ name: '學員專題成果', path: '/showcase' },
	{ name: '招生期別與報名', path: '/admission' },
	{ name: 'Discord 線上諮詢', path: '/community' },
	{ name: '常見問題 FAQ', path: '/faq' },
]

const navbarContainerClasses = computed(() => {
	return 'top-0 inset-x-0'
})

function handleScroll() {
	const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0

	// 滾動方向感應 (Scroll Direction Detection)
	if (scrollY > lastScrollY && scrollY > 60) {
		scrollDirection.value = 'down'
	} else if (scrollY < lastScrollY) {
		scrollDirection.value = 'up'
	}
	lastScrollY = Math.max(0, scrollY)

	// 靈敏雙態變形閾值（滾動 > 20px 立即變形為懸浮膠囊，回頂 <= 10px 恢復滿版大氣）
	if (scrollY > 20 && !isScrolled.value) {
		isScrolled.value = true
	} else if (scrollY <= 10 && isScrolled.value) {
		isScrolled.value = false
	}
}

onMounted(() => {
	handleScroll()
	window.addEventListener('scroll', handleScroll, { passive: true })
	window.addEventListener('resize', handleScroll, { passive: true })
})

onUnmounted(() => {
	window.removeEventListener('scroll', handleScroll)
	window.removeEventListener('resize', handleScroll)
})
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
	transition:
		opacity 0.25s ease,
		transform 0.25s ease;
}

.fade-slide-enter-from {
	opacity: 0;
	transform: translateY(-8px);
}

.fade-slide-leave-to {
	opacity: 0;
	transform: translateY(-8px);
}

.ambient-glass-curtain {
	backdrop-filter: blur(16px);
	-webkit-backdrop-filter: blur(16px);
	background: linear-gradient(to bottom, rgba(2, 6, 23, 0.75) 0%, rgba(2, 6, 23, 0.35) 65%, transparent 100%);
	mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.8) 60%, rgba(0, 0, 0, 0) 100%);
	-webkit-mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.8) 60%, rgba(0, 0, 0, 0) 100%);
}

@keyframes fadeIn {
	from {
		opacity: 0;
		transform: scale(0.95);
	}
	to {
		opacity: 1;
		transform: scale(1);
	}
}

.animate-fade-in {
	animation: fadeIn 0.25s ease-out forwards;
}
</style>

import { api } from '@/api/client'
import {
	defaultBatches,
	defaultCarousels,
	defaultFacilities,
	defaultFAQs,
	defaultModules,
	defaultProjects,
	defaultSettings,
	defaultTechCards,
} from '@/data/cmsDefaultSnapshots'
import type {
	AdmissionBatch,
	CarouselItem,
	CurriculumModule,
	Facility,
	FAQItem,
	SiteSetting,
	StudentProject,
	TechCard,
} from '@/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'

// 向後相容導出預設期別
export { defaultBatches } from '@/data/cmsDefaultSnapshots'
export type { GlowMotionPreset, MeteorConfig, NavbarStyleType, NebulaFeatures } from './useThemeStore'

const CACHE_KEY = 'wdaweb_cms_cache_1790239537'
const CACHE_TTL_MS = 24 * 60 * 60 * 1000 // 24 小時快取效期

interface CmsCachePayload {
	settings?: SiteSetting
	carousels?: CarouselItem[]
	batches?: AdmissionBatch[]
	modules?: CurriculumModule[]
	techCards?: TechCard[]
	facilities?: Facility[]
	projects?: StudentProject[]
	faqs?: FAQItem[]
	savedAt?: number
}

export const useCmsStore = defineStore('cms', () => {
	// 優先從 localStorage 讀取快取（含 24h TTL 檢查），若無或過期則使用預設快照 (0.01 秒秒開)
	let cachedData: CmsCachePayload | null = null
	try {
		const raw = localStorage.getItem(CACHE_KEY)
		if (raw) {
			const parsed = JSON.parse(raw) as CmsCachePayload
			if (parsed.savedAt && Date.now() - parsed.savedAt < CACHE_TTL_MS) {
				cachedData = parsed
			}
		}
	} catch (e) {}

	const settings = ref<SiteSetting>(cachedData?.settings || defaultSettings)
	const carousels = ref<CarouselItem[]>(cachedData?.carousels || defaultCarousels)
	const batches = ref<AdmissionBatch[]>(cachedData?.batches || defaultBatches)
	const modules = ref<CurriculumModule[]>(cachedData?.modules || defaultModules)
	const techCards = ref<TechCard[]>(cachedData?.techCards || defaultTechCards)
	const facilities = ref<Facility[]>(cachedData?.facilities || defaultFacilities)
	const initialProjects = (cachedData?.projects || defaultProjects).map((p) => ({
		...p,
		cover_image_url: p.cover_image_url || `./projects/project_${p.id}.webp`,
	}))
	const projects = ref<StudentProject[]>(initialProjects)
	const faqs = ref<FAQItem[]>(cachedData?.faqs || defaultFAQs)

	const isLiveConnected = ref(false)
	const isLoading = ref(false)
	const error = ref<string | null>(null)

	// 背景靜默非同步喚醒後端 API 並更新最新狀態
	async function fetchAll() {
		isLoading.value = true
		error.value = null
		try {
			const [settingsRes, carouselsRes, batchesRes, modulesRes, techCardsRes, facilitiesRes, projectsRes, faqsRes] =
				await Promise.all([
					api.getSiteSettings().catch(() => null),
					api.getCarousels().catch(() => null),
					api.getBatches().catch(() => null),
					api.getCurriculumModules().catch(() => null),
					api.getTechCards().catch(() => null),
					api.getFacilities().catch(() => null),
					api.getProjects().catch(() => null),
					api.getFAQs().catch(() => null),
				])

			if (settingsRes) settings.value = settingsRes
			if (Array.isArray(carouselsRes)) carousels.value = carouselsRes
			if (Array.isArray(batchesRes)) batches.value = batchesRes
			if (Array.isArray(modulesRes)) modules.value = modulesRes
			if (Array.isArray(techCardsRes)) techCards.value = techCardsRes
			if (Array.isArray(facilitiesRes)) facilities.value = facilitiesRes
			if (Array.isArray(projectsRes)) {
				projects.value = projectsRes.map((p) => ({
					...p,
					cover_image_url: p.cover_image_url || `./projects/project_${p.id}.webp`,
				}))
			}
			if (Array.isArray(faqsRes)) faqs.value = faqsRes

			const hasValidData = !!(settingsRes || batchesRes || carouselsRes)
			isLiveConnected.value = hasValidData

			// 儲存最新快照到 localStorage
			try {
				const payload: CmsCachePayload = {
					settings: settings.value,
					carousels: carousels.value,
					batches: batches.value,
					modules: modules.value,
					techCards: techCards.value,
					facilities: facilities.value,
					projects: projects.value,
					faqs: faqs.value,
					savedAt: Date.now(),
				}
				localStorage.setItem(CACHE_KEY, JSON.stringify(payload))
			} catch (e) {}
		} catch (err: unknown) {
			error.value = err instanceof Error ? err.message : '後端 API 連線異常'
			console.warn('CMS API 背景載入提示（目前使用即時離線快照呈現）:', err)
		} finally {
			isLoading.value = false
		}
	}

	async function trackBatchClick(id: number) {
		try {
			await api.trackBatchClick(id)
			const target = batches.value.find((b) => b.id === id)
			if (target) target.click_count++
		} catch (e) {}
	}

	async function trackProjectView(id: number) {
		try {
			await api.trackProjectView(id)
			const target = projects.value.find((p) => p.id === id)
			if (target) target.view_count++
		} catch (e) {}
	}

	return {
		settings,
		carousels,
		batches,
		modules,
		techCards,
		facilities,
		projects,
		faqs,
		isLiveConnected,
		isLoading,
		error,
		fetchAll,
		trackBatchClick,
		trackProjectView,
	}
})

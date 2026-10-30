<template>
	<section
		id="batches"
		class="relative overflow-hidden w-full max-w-[100vw]"
		:class="[hideHeader ? 'pt-8 pb-20 sm:pb-24 bg-transparent' : 'py-24 bg-transparent']"
	>
		<!-- 頂部與底部環境發光微暈 -->
		<div
			class="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"
		></div>
		<div
			class="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none"
		></div>

		<div class="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 relative z-10 w-full overflow-hidden">
			<!-- 區塊標題 (僅在首頁等未隱藏標頭時渲染) -->
			<div v-if="!hideHeader" class="text-center max-w-5xl mx-auto mb-14">
				<div
					class="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-sm font-bold uppercase tracking-wider shadow-sm mb-3"
				>
					<span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
					<span>Admission Batches ｜ 招生期別</span>
				</div>
				<h2 class="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">招生期別與報名</h2>
				<p class="text-slate-400 mt-4 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed text-center">
					把握政府自辦 100% 全額補助參訓機會，點擊「立即線上報名」直通台灣就業通官方報名系統。
				</p>

				<!-- 即時報名狀態指示看板 -->
				<div class="mt-5 max-w-xl mx-auto w-full px-2 sm:px-0">
					<div
						class="relative rounded-2xl p-3.5 sm:p-4.5 border backdrop-blur-xl transition-all duration-300 overflow-hidden shadow-xl"
						:class="
							notice.isOpen
								? 'bg-emerald-950/40 border-emerald-500/40 shadow-emerald-950/50'
								: 'bg-slate-900/85 border-amber-500/30 shadow-slate-950/60'
						"
					>
						<div
							class="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent"
							:class="notice.isOpen ? 'via-emerald-400/50 to-transparent' : 'via-amber-400/40 to-transparent'"
						></div>

						<div class="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 text-left">
							<div class="flex-shrink-0">
								<span
									class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold font-mono tracking-wide"
									:class="
										notice.isOpen
											? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
											: 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
									"
								>
									<span
										class="w-2 h-2 rounded-full mr-1.5"
										:class="notice.isOpen ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'"
									></span>
									{{ notice.badgeText }}
								</span>
							</div>

							<div class="flex-grow">
								<div
									class="text-base sm:text-lg font-bold tracking-tight"
									:class="notice.isOpen ? 'text-white' : 'text-amber-200'"
								>
									{{ notice.headline }}
								</div>
								<p class="mt-1 text-xs sm:text-sm text-slate-300 leading-relaxed text-justify">
									{{ notice.subline }}
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- 期別卡片網格清單 -->
			<div
				id="batches-cards-grid"
				class="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-10 max-w-2xl lg:max-w-[1360px] mx-auto w-full"
			>
				<BatchCard
					v-for="(batch, index) in displayBatches"
					:key="batch.id"
					:batch="batch"
					:index="index"
					:is-ended="isBatchEnded(batch)"
					:is-training="isBatchTraining(batch)"
					:is-urgent-closing="isBatchUrgentClosing(batch)"
					:lifecycle-steps="lifecycleSteps"
					:get-applicants-summary="getApplicantsSummary"
					:get-lifecycle-line-width="getLifecycleLineWidth"
					:get-step-node-class="getStepNodeClass"
					:get-step-status="getStepStatus"
					:get-step-text-class="getStepTextClass"
					:get-lifecycle-detail-notice="getLifecycleDetailNotice"
					:is-screening-ended="isScreeningEnded"
					@apply-click="handleApplyClick"
				/>
			</div>

			<!-- 錯過本期之轉化與諮詢引導列 -->
			<div
				class="mt-12 p-5 sm:p-7 rounded-3xl backdrop-blur-xl border max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-5 transition-all duration-300 w-full overflow-hidden relative"
				:class="
					!hasEnrollingBatch
						? 'bg-gradient-to-br from-slate-900/95 via-cyan-950/20 to-slate-900/95 border-cyan-500/40 shadow-2xl shadow-cyan-950/60 ring-1 ring-cyan-400/30'
						: 'bg-slate-900/60 border-slate-800/80 shadow-xl shadow-slate-950/40'
				"
			>
				<div
					v-if="!hasEnrollingBatch"
					class="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent shadow-[0_0_10px_rgba(6,182,212,0.6)] pointer-events-none"
				></div>

				<div class="flex items-start sm:items-center space-x-3.5 text-slate-300 text-sm w-full sm:w-auto">
					<div
						class="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
						:class="
							!hasEnrollingBatch
								? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
								: 'bg-slate-800/80 text-amber-300'
						"
					>
						<span class="text-xl">💡</span>
					</div>
					<div class="text-left">
						<div class="flex items-center space-x-2">
							<span class="font-bold text-white text-base sm:text-lg">錯過本期報名？</span>
							<span
								v-if="!hasEnrollingBatch"
								class="px-2 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
								>下一梯次籌備中</span
							>
						</div>
						<p class="mt-0.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
							新梯次正密集籌備中，歡迎預先加入 Discord 或致電諮詢，鎖定第一手簡訊通知！
						</p>
					</div>
				</div>

				<div class="grid grid-cols-2 gap-2.5 shrink-0 w-full sm:w-auto sm:flex sm:space-x-3 justify-end">
					<a
						:href="`tel:${(store.settings?.contact_phone || '(02) 2901-8274').replace(/[^0-9]/g, '')}`"
						class="px-4 py-2.5 rounded-xl text-sm font-bold text-cyan-300 bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 hover:border-cyan-300 transition-all flex items-center justify-center space-x-1.5 shadow-sm active:scale-95 cursor-pointer"
					>
						<span>📞 招生專線</span>
					</a>
					<a
						:href="store.settings?.discord_invite_url || 'https://discord.gg/TrerFKG'"
						target="_blank"
						rel="noopener noreferrer"
						class="px-4 py-2.5 rounded-xl text-sm font-bold text-indigo-300 bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/40 hover:border-indigo-300 transition-all flex items-center justify-center space-x-1.5 shadow-sm active:scale-95 cursor-pointer"
					>
						<span>💬 官方 Discord</span>
					</a>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useBatchTimeline } from '@/composables/useBatchTimeline'
import { useScrollStagger } from '@/composables/useScrollStagger'
import { useCmsStore } from '@/stores/useCmsStore'
import type { AdmissionBatch } from '@/types'
import {
	getBatchEnrollmentNotice,
	isBatchEnrolling,
	isBatchEnded as rawIsBatchEnded,
	isBatchTraining as rawIsBatchTraining,
} from '@/utils/batchStatus'
import BatchCard from './batches/BatchCard.vue'

const props = withDefaults(
	defineProps<{
		hideHeader?: boolean
	}>(),
	{
		hideHeader: false,
	},
)

const store = useCmsStore()
const notice = computed(() => getBatchEnrollmentNotice(store.batches))

const {
	lifecycleSteps,
	sortedBatches,
	getStepStatus,
	isScreeningEnded,
	getApplicantsSummary,
	getLifecycleLineWidth,
	getStepNodeClass,
	getStepTextClass,
	getLifecycleDetailNotice,
	isCelebrationSimulated,
} = useBatchTimeline(() => store.batches)

const displayBatches = computed(() => {
	return sortedBatches.value.length > 0 ? sortedBatches.value : store.batches
})

function isBatchEnded(batch: AdmissionBatch): boolean {
	if (isCelebrationSimulated.value && batch.id === 1) return true
	return rawIsBatchEnded(batch)
}

function isBatchTraining(batch: AdmissionBatch): boolean {
	if (isBatchEnded(batch)) return false
	return rawIsBatchTraining(batch)
}

const hasEnrollingBatch = computed(() => {
	return displayBatches.value.some((b) => isBatchEnrolling(b))
})

function isBatchUrgentClosing(batch: AdmissionBatch): boolean {
	if (!isBatchEnrolling(batch)) return false
	if (batch.status_override === 'closing_soon' || batch.dynamic_status === 'closing_soon') return true
	if (!batch.enroll_end_date) return false
	try {
		const end = new Date(batch.enroll_end_date.replace(/-/g, '/')).getTime() + 24 * 60 * 60 * 1000 - 1000
		const now = Date.now()
		const diffHours = (end - now) / (1000 * 60 * 60)
		return diffHours > 0 && diffHours <= 72
	} catch {
		return false
	}
}

function handleApplyClick(batch: AdmissionBatch) {
	store.trackBatchClick(batch.id)
	try {
		if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
			;(window as any).gtag('event', 'conversion_apply_click', {
				event_category: 'outbound_apply',
				event_label: batch.batch_name,
				course_code: batch.course_code,
			})
		}
	} catch (e) {}
}

if (!props.hideHeader) {
	useScrollStagger(
		'#batches-cards-grid .batch-card',
		'#batches-cards-grid',
		{ stagger: 0.1 },
		() => store.batches.length,
	)
}
</script>

<template>
  <!-- 方案一：AI Copilot 對話視窗 — 模擬 Cursor / ChatGPT 即時對話訊息串流 -->
  <div
    class="relative w-full h-[395px] sm:h-[430px] lg:h-[440px] xl:h-[485px] 2xl:h-[500px] rounded-2xl sm:rounded-3xl overflow-hidden border border-cyan-500/35 hover:border-cyan-400/50 bg-slate-900/90 shadow-[0_25px_60px_-15px_rgba(2,6,23,0.95),0_0_40px_-5px_rgba(6,182,212,0.18)] backdrop-blur-xl flex flex-col justify-between transition-colors duration-500"
  >
    <!-- 1px 頂部晶鑽鏡面反光倒角 (Specular Rim Light) -->
    <div class="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent z-30 pointer-events-none"></div>

    <!-- 背景流光發光層 -->
    <div class="absolute -top-24 -right-24 w-64 h-64 bg-cyan-500/12 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-600/12 rounded-full blur-3xl pointer-events-none"></div>

    <!-- 1. Mac 風格視窗標題列 -->
    <div class="h-[44px] sm:h-[48px] lg:h-[50px] px-3 sm:px-4 lg:px-5 bg-slate-950/85 border-b border-slate-800 flex items-center justify-between flex-shrink-0 z-20">
      <!-- 視窗控制按鈕 -->
      <div class="flex items-center space-x-1.5 sm:space-x-2 overflow-hidden mr-2">
        <div class="w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-3.5 lg:h-3.5 rounded-full bg-red-500/80 flex-shrink-0"></div>
        <div class="w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-3.5 lg:h-3.5 rounded-full bg-amber-500/80 flex-shrink-0"></div>
        <div class="w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-3.5 lg:h-3.5 rounded-full bg-emerald-500/80 flex-shrink-0"></div>
        <span class="ml-1.5 sm:ml-2.5 text-sm sm:text-base font-mono text-slate-300 font-semibold flex items-center space-x-1.5 truncate">
          <span class="text-cyan-400 flex-shrink-0 text-base">🤖</span>
          <span class="truncate max-w-[140px] xs:max-w-[180px] sm:max-w-none">AI 學習助教 — 泰山職訓問答</span>
        </span>
      </div>

      <!-- 狀態標籤與當前輪數統計 -->
      <div class="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
        <span class="hidden xs:inline-flex text-xs sm:text-sm font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
          題庫 {{ currentDisplayRound }}/{{ conversations.length }}
        </span>
        <div class="flex items-center space-x-1.5">
          <span class="relative flex h-2.5 w-2.5">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span class="text-sm sm:text-base font-mono text-emerald-300 font-bold tracking-wide">
            <span class="hidden sm:inline">線上 </span>Live
          </span>
        </div>
      </div>
    </div>

    <!-- 2. 對話訊息列表區（無限往上移動滾動，不清空畫面） -->
    <div class="relative flex-1 overflow-hidden">
      <!-- 頂部平滑消隱遮罩：往上滾動的歷史訊息優雅漸漸融入深色背景 -->
      <div class="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-slate-900 via-slate-900/60 to-transparent pointer-events-none z-10"></div>

      <!-- 滾動容器 -->
      <div
        ref="scrollContainerRef"
        class="h-full overflow-y-auto px-3.5 sm:px-5 lg:px-5 xl:px-6 py-4 space-y-3 sm:space-y-4 scroll-smooth custom-scrollbar"
      >
        <!-- 訊息串列 -->
        <TransitionGroup name="chat-msg" tag="div" class="space-y-3 sm:space-y-4">
          <div
            v-for="msg in chatHistory"
            :key="msg.id"
            class="flex items-start gap-2.5 sm:gap-3"
            :class="msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'"
          >
            <!-- 頭像 -->
            <div
              class="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-sm sm:text-base flex-shrink-0 font-bold shadow-md select-none mt-0.5"
              :class="msg.role === 'user'
                ? 'bg-gradient-to-tr from-slate-600 to-slate-700 text-slate-200'
                : 'bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-cyan-500/30'"
            >
              {{ msg.role === 'user' ? '你' : '🤖' }}
            </div>

            <!-- 訊息泡泡 (放大字級：手機 text-sm 14px，桌機 text-base 16px 大字舒暢閱讀) -->
            <div
              class="max-w-[85%] sm:max-w-[82%] px-4 py-3 sm:px-5 sm:py-3.5 rounded-2xl text-sm sm:text-base leading-relaxed tracking-wide shadow-sm"
              :class="msg.role === 'user'
                ? 'bg-slate-700/85 text-slate-100 rounded-tr-sm border border-slate-600/50'
                : 'bg-gradient-to-br from-slate-900 via-slate-900/95 to-cyan-950/40 border border-cyan-500/30 text-slate-100 rounded-tl-sm'"
            >
              <!-- 提問人 / AI 助教標籤 -->
              <div
                class="text-xs sm:text-sm font-mono font-semibold mb-1.5 select-none flex items-center gap-2"
                :class="msg.role === 'user' ? 'text-slate-300 justify-end' : 'text-cyan-300'"
              >
                <span>{{ msg.role === 'user' ? '轉職諮詢訪客' : '泰山職訓 AI 助教' }}</span>
                <span v-if="msg.tag" class="px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-200 text-xs font-medium border border-cyan-500/25">
                  {{ msg.tag }}
                </span>
              </div>

              <!-- 內容顯示：AI 最新一條訊息支援打字串流光標 -->
              <div class="whitespace-pre-line text-slate-100 text-sm sm:text-base leading-relaxed">
                <template v-if="msg.role === 'assistant' && msg.id === currentTypingMsgId">
                  <span>{{ typingDisplayText }}</span>
                  <span class="inline-block w-2 h-4 sm:h-5 bg-cyan-400 animate-pulse ml-0.5 align-middle"></span>
                </template>
                <template v-else>
                  {{ msg.content }}
                </template>
              </div>
            </div>
          </div>
        </TransitionGroup>

        <!-- 思考中脈衝指示器 (AI 正在運算回應時推進畫面) -->
        <div v-if="showThinking" class="flex items-start gap-2.5 sm:gap-3">
          <div class="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center text-sm sm:text-base flex-shrink-0 shadow-md shadow-cyan-500/30 select-none mt-0.5">
            🤖
          </div>
          <div class="px-4 py-3 rounded-2xl rounded-tl-sm bg-gradient-to-br from-slate-900 to-cyan-950/40 border border-cyan-500/30">
            <div class="flex items-center space-x-2 py-0.5">
              <span class="text-xs sm:text-sm font-mono text-cyan-300 mr-1.5">AI 思考回覆中</span>
              <span class="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style="animation-delay:0ms"></span>
              <span class="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style="animation-delay:160ms"></span>
              <span class="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style="animation-delay:320ms"></span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 3. 底部輸入模擬列 -->
    <div class="h-[60px] sm:h-[64px] lg:h-[68px] px-3 sm:px-4 lg:px-5 bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950/40 border-t border-cyan-500/25 flex items-center space-x-2.5 sm:space-x-3 flex-shrink-0 z-20">
      <!-- 模擬輸入框（動態顯示下一題提示） -->
      <div class="flex-1 h-10 sm:h-11 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-cyan-500/40 px-3.5 flex items-center overflow-hidden transition-colors">
        <span class="text-cyan-400 font-mono text-sm sm:text-base mr-2 font-bold select-none">💬</span>
        <span class="text-sm sm:text-base text-slate-200 truncate font-sans">{{ currentQuestionPreview }}</span>
        <span class="inline-block w-2 h-4 sm:h-5 bg-cyan-400 animate-pulse ml-1 flex-shrink-0"></span>
      </div>

      <!-- 下一題按鈕（手動加速快轉） -->
      <button
        type="button"
        @click="fastForwardNext"
        class="h-10 sm:h-11 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white flex items-center justify-center space-x-1.5 text-xs sm:text-sm font-bold shadow-md shadow-cyan-500/30 hover:scale-105 active:scale-95 transition-all flex-shrink-0 cursor-pointer"
        title="立即跳至下一個民眾關心議題"
      >
        <span>下一題</span>
        <span class="text-sm sm:text-base leading-none">→</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAiChatPlayer } from '@/composables/useAiChatPlayer'

const scrollContainerRef = ref<HTMLElement | null>(null)

const {
  conversations,
  chatHistory,
  showThinking,
  currentTypingMsgId,
  typingDisplayText,
  currentQuestionPreview,
  currentDisplayRound,
  fastForwardNext
} = useAiChatPlayer(scrollContainerRef)
</script>

<style scoped>
/* 專屬極致暗黑低調滾動條 */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(6, 182, 212, 0.25);
  border-radius: 9999px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(6, 182, 212, 0.5);
}

/* 訊息進入過渡動畫：由下往上平滑推入 */
.chat-msg-enter-active {
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
.chat-msg-enter-from {
  opacity: 0;
  transform: translateY(18px) scale(0.98);
}
.chat-msg-leave-active {
  transition: all 0.25s ease-out;
}
.chat-msg-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}
</style>

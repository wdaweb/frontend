import { ref, nextTick, onMounted, onUnmounted, type Ref } from 'vue'
import {
  aiChatConversations,
  type ChatMessage,
  type QAItem
} from '@/data/aiChatConversations'

export function useAiChatPlayer(scrollContainerRef: Ref<HTMLElement | null>) {
  const conversations: QAItem[] = aiChatConversations

  // 狀態管理
  const chatHistory = ref<ChatMessage[]>([])
  const showThinking = ref(false)
  const currentTypingMsgId = ref<string | null>(null)
  const typingDisplayText = ref('')
  const currentQuestionPreview = ref('')
  const currentDisplayRound = ref(1)

  // 洗牌抽樣隊列（不重複顯示直至全部抽完，再重啟新一輪）
  let unvisitedIndices: number[] = []
  let activeTimer: ReturnType<typeof setTimeout> | null = null
  let typingInterval: ReturnType<typeof setInterval> | null = null

  // 隨機不重複取得下一個問題索引
  function getNextIndex(): number {
    if (unvisitedIndices.length === 0) {
      unvisitedIndices = Array.from({ length: conversations.length }, (_, i) => i)
      // Fisher-Yates 洗牌演算法
      for (let i = unvisitedIndices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[unvisitedIndices[i], unvisitedIndices[j]] = [unvisitedIndices[j], unvisitedIndices[i]]
      }
    }
    // 計算當前輪次已展示題數（1 ~ N）
    currentDisplayRound.value = conversations.length - unvisitedIndices.length + 1
    return unvisitedIndices.pop()!
  }

  // 平滑自動捲動到底部
  function scrollToBottom(smooth = true) {
    nextTick(() => {
      if (scrollContainerRef.value) {
        scrollContainerRef.value.scrollTo({
          top: scrollContainerRef.value.scrollHeight,
          behavior: smooth ? 'smooth' : 'auto'
        })
      }
    })
  }

  // 逐字打字動畫
  function streamText(fullText: string, onDone: () => void) {
    if (typingInterval) clearInterval(typingInterval)
    typingDisplayText.value = ''
    let charIdx = 0

    typingInterval = setInterval(() => {
      if (charIdx < fullText.length) {
        typingDisplayText.value += fullText[charIdx]
        charIdx++
        if (charIdx % 3 === 0) {
          scrollToBottom(false)
        }
      } else {
        if (typingInterval) clearInterval(typingInterval)
        typingInterval = null
        scrollToBottom(true)
        onDone()
      }
    }, 24)
  }

  // 推進一輪新的問答（不刷新既有畫面，只往上堆疊）
  function triggerNextQA() {
    clearTimers()

    const qIndex = getNextIndex()
    const qa = conversations[qIndex]

    // 1. 底部輸入框顯示即將發送的問題
    currentQuestionPreview.value = qa.question

    // 延遲 600ms 送出提問，模擬訪客輸入完送出
    activeTimer = setTimeout(() => {
      const userMsgId = `user-${Date.now()}`
      chatHistory.value.push({
        id: userMsgId,
        role: 'user',
        content: qa.question,
        tag: qa.tag
      })

      // 防爆保護：如果歷史訊息過多（> 18 則），移除最前頭最早的 2 則以保證極致效能
      if (chatHistory.value.length > 18) {
        chatHistory.value.splice(0, 2)
      }

      scrollToBottom(true)

      // 2. 顯示 AI 正在思考
      activeTimer = setTimeout(() => {
        showThinking.value = true
        scrollToBottom(true)

        // 3. 思考 1.1 秒後，AI 開始生成回覆
        activeTimer = setTimeout(() => {
          showThinking.value = false

          const aiMsgId = `ai-${Date.now()}`
          currentTypingMsgId.value = aiMsgId

          chatHistory.value.push({
            id: aiMsgId,
            role: 'assistant',
            content: qa.answer,
            tag: qa.tag
          })

          scrollToBottom(true)

          // 4. 打字機串流輸出
          streamText(qa.answer, () => {
            currentTypingMsgId.value = null

            // 打字完成後，留出 5.5 秒讓使用者舒適閱讀，隨後自動觸發下一則
            activeTimer = setTimeout(() => {
              triggerNextQA()
            }, 5500)
          })
        }, 1100)
      }, 700)
    }, 600)
  }

  // 手動快速切換到下一題
  function fastForwardNext() {
    clearTimers()
    if (currentTypingMsgId.value) {
      const activeMsg = chatHistory.value.find(m => m.id === currentTypingMsgId.value)
      if (activeMsg) {
        const found = conversations.find(c => c.answer.startsWith(typingDisplayText.value.slice(0, 8)))
        if (found) {
          activeMsg.content = found.answer
        }
      }
      currentTypingMsgId.value = null
    }
    showThinking.value = false
    triggerNextQA()
  }

  function clearTimers() {
    if (activeTimer) {
      clearTimeout(activeTimer)
      activeTimer = null
    }
    if (typingInterval) {
      clearInterval(typingInterval)
      typingInterval = null
    }
  }

  onMounted(() => {
    // 初次掛載時先預先置入一組歷史對話
    const firstIdx = getNextIndex()
    const firstQA = conversations[firstIdx]

    chatHistory.value.push(
      {
        id: 'init-1',
        role: 'user',
        content: firstQA.question,
        tag: firstQA.tag
      },
      {
        id: 'init-2',
        role: 'assistant',
        content: firstQA.answer,
        tag: firstQA.tag
      }
    )

    scrollToBottom(false)

    // 3.5 秒後自然推進下一題
    activeTimer = setTimeout(() => {
      triggerNextQA()
    }, 3500)
  })

  onUnmounted(() => {
    clearTimers()
  })

  return {
    conversations,
    chatHistory,
    showThinking,
    currentTypingMsgId,
    typingDisplayText,
    currentQuestionPreview,
    currentDisplayRound,
    fastForwardNext,
    scrollToBottom
  }
}

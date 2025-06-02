<template>
  <div class="bg-white border-t border-gray-200 px-4 py-3">
    <div class="max-w-4xl mx-auto">
      <!-- 自动回复选项 -->
      <div
        v-if="autoReplyOptions.length > 0"
        class="mb-3 flex flex-wrap gap-2"
      >
        <button
          v-for="option in autoReplyOptions"
          :key="option"
          @click="$emit('auto-reply', option)"
          class="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors duration-200"
        >
          {{ option }}
        </button>
      </div>

      <!-- 输入框 -->
      <div class="flex items-center space-x-2">
        <button
          class="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
          @click="toggleInputMode"
        >
          <svg
            v-if="isVoiceMode"
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
            />
          </svg>
          <svg
            v-else
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </button>

        <div class="flex-1 relative">
          <input
            v-if="!isVoiceMode"
            v-model="inputText"
            type="text"
            placeholder="输入消息..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            :disabled="loading"
            @keyup.enter="sendMessage"
          />
          <div
            v-else
            class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center"
          >
            <span class="text-gray-500">按住说话</span>
          </div>
        </div>

        <button
          class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="loading || (!isVoiceMode && !inputText.trim())"
          @click="sendMessage"
        >
          发送
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  loading: boolean
  autoReplyOptions: string[]
}>()

const emit = defineEmits<{
  (e: 'send', content: string): void
  (e: 'auto-reply', option: string): void
}>()

const inputText = ref('')
const isVoiceMode = ref(false)

const toggleInputMode = () => {
  isVoiceMode.value = !isVoiceMode.value
}

const sendMessage = () => {
  if (isVoiceMode.value) {
    // 处理语音输入
    return
  }

  if (!inputText.value.trim()) return

  emit('send', inputText.value)
  inputText.value = ''
}
</script> 
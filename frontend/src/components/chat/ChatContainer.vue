<template>
  <div
    class="h-full overflow-y-auto px-4 py-6 space-y-4"
    @scroll="handleScroll"
  >
    <!-- 系统消息 -->
    <div
      v-if="messages.length === 0"
      class="flex justify-center"
    >
      <div class="bg-gray-100 rounded-lg px-4 py-2 text-gray-600 text-sm">
        开始和角色对话吧
      </div>
    </div>

    <!-- 消息列表 -->
    <template v-for="message in messages" :key="message.id">
      <!-- 用户消息 -->
      <div
        v-if="message.role === 'user'"
        class="flex justify-end"
      >
        <div class="max-w-[70%] bg-blue-500 text-white rounded-lg px-4 py-2">
          {{ message.content }}
        </div>
      </div>

      <!-- 角色消息 -->
      <div
        v-else
        class="flex space-x-2"
      >
        <div class="flex-shrink-0">
          <img
            :src="characterAvatar"
            :alt="characterName"
            class="w-8 h-8 rounded-full"
          />
        </div>
        <div class="flex-1">
          <div class="bg-white rounded-lg px-4 py-2 shadow-sm">
            <div class="flex items-center space-x-2 mb-1">
              <span class="text-sm font-medium text-gray-900">{{ characterName }}</span>
              <button
                v-if="message.audioUrl"
                @click="playAudio(message.audioUrl)"
                class="text-gray-500 hover:text-gray-700"
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>
            </div>
            <p class="text-gray-800">{{ message.content }}</p>
          </div>
        </div>
      </div>
    </template>

    <!-- 加载状态 -->
    <div
      v-if="loading"
      class="flex justify-center"
    >
      <div class="animate-pulse flex space-x-2">
        <div class="w-2 h-2 bg-gray-400 rounded-full"></div>
        <div class="w-2 h-2 bg-gray-400 rounded-full"></div>
        <div class="w-2 h-2 bg-gray-400 rounded-full"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Message } from '../../types/chat'

const props = defineProps<{
  messages: Message[]
  loading: boolean
  characterAvatar?: string
  characterName?: string
}>()

const emit = defineEmits<{
  (e: 'scroll', event: Event): void
}>()

const handleScroll = (event: Event) => {
  emit('scroll', event)
}

const playAudio = (url: string) => {
  const audio = new Audio(url)
  audio.play()
}
</script> 
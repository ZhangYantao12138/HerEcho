<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
      <div class="p-6">
        <div class="flex justify-between items-start mb-4">
          <h2 class="text-2xl font-bold">{{ script.title }}</h2>
          <button
            @click="$emit('close')"
            class="text-gray-500 hover:text-gray-700"
          >
            <span class="sr-only">关闭</span>
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div class="aspect-w-16 aspect-h-9 mb-6">
          <img
            v-if="script.coverImage"
            :src="script.coverImage"
            :alt="script.title"
            class="object-cover w-full h-full rounded-lg"
          />
          <div
            v-else
            class="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg"
          >
            <span class="text-gray-400 text-lg">{{ script.title }}</span>
          </div>
        </div>

        <p class="text-gray-600 mb-6">{{ script.description }}</p>

        <div class="mb-6">
          <h3 class="text-lg font-semibold mb-3">选择角色</h3>
          <div class="grid grid-cols-2 gap-4">
            <div
              v-for="character in script.characters"
              :key="character.id"
              class="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
              :class="{ 'border-blue-500': selectedCharacter?.id === character.id }"
              @click="selectedCharacter = character"
            >
              <img
                :src="character.avatar"
                :alt="character.name"
                class="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h4 class="font-medium">{{ character.name }}</h4>
                <p class="text-sm text-gray-500 line-clamp-1">
                  {{ character.description }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-end">
          <button
            class="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="!selectedCharacter"
            @click="startChat"
          >
            开始对话
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Script, Character } from '../../types/script'

const props = defineProps<{
  script: Script
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'start-chat', characterId: string): void
}>()

const selectedCharacter = ref<Character | null>(null)

const startChat = () => {
  if (selectedCharacter.value) {
    emit('start-chat', selectedCharacter.value.id)
  }
}
</script> 
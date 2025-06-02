<template>
  <div
    class="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300"
    @click="$emit('click')"
  >
    <div class="aspect-w-16 aspect-h-9 bg-gray-200">
      <img
        v-if="script.coverImage"
        :src="script.coverImage"
        :alt="script.title"
        class="object-cover w-full h-full"
      />
      <div
        v-else
        class="w-full h-full flex items-center justify-center bg-gray-100"
      >
        <span class="text-gray-400 text-lg">{{ script.title }}</span>
      </div>
    </div>
    <div class="p-4">
      <h3 class="text-xl font-semibold mb-2">{{ script.title }}</h3>
      <p class="text-gray-600 line-clamp-2">{{ script.description }}</p>
      <div class="mt-4 flex items-center justify-between">
        <span class="text-sm text-gray-500">
          {{ script.characters.length }} 个角色
        </span>
        <button
          class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300"
        >
          开始对话
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Script } from '../../types/script'

defineProps<{
  script: Script
}>()

defineEmits<{
  (e: 'click'): void
}>()
</script> 
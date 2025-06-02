<template>
  <div class="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
    <div class="flex items-center space-x-4">
      <img
        :src="character?.avatar"
        :alt="character?.name"
        class="w-10 h-10 rounded-full object-cover"
      />
      <div>
        <h2 class="text-lg font-semibold">{{ character?.name }}</h2>
        <p class="text-sm text-gray-500">在线</p>
      </div>
    </div>

    <div class="flex items-center space-x-4">
      <button
        @click="$emit('toggle-settings')"
        class="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
      >
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
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Character } from '../../types/script'

defineProps<{
  character: Character | null
}>()

defineEmits<{
  (e: 'toggle-settings'): void
}>()
</script> 
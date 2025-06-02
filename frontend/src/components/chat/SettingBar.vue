<template>
  <div class="setting-bar">
    <div class="flex items-center justify-between p-4 bg-gray-100">
      <h2 class="text-lg font-semibold">设置</h2>
      <button class="p-2 hover:bg-gray-200 rounded-full">
        <span class="sr-only">关闭</span>
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
    <div class="p-4">
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium">深色模式</span>
          <button class="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200">
            <span class="sr-only">启用深色模式</span>
            <span class="inline-block h-4 w-4 transform rounded-full bg-white transition"></span>
          </button>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium">通知</span>
          <button class="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200">
            <span class="sr-only">启用通知</span>
            <span class="inline-block h-4 w-4 transform rounded-full bg-white transition"></span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isDarkMode = ref(false)
const isNotificationsEnabled = ref(true)

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
}

const toggleNotifications = () => {
  isNotificationsEnabled.value = !isNotificationsEnabled.value
}
</script>

<style scoped>
.setting-bar {
  @apply w-64 bg-white shadow-lg;
}
</style> 
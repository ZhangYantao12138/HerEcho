<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps<{
  title: string;
}>();
</script>

<template>
  <div class="dream-header">
    <div class="page-title">{{ title }}</div>
  </div>
</template>

<style scoped>
.dream-header {
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.page-title {
  font-size: 24px;
  font-weight: bold;
}
</style> 
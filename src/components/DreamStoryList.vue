<script setup lang="ts">
import { defineEmits } from 'vue';
import StoryCard from './StoryCard.vue';

// 定义故事类型
export interface DreamStory {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  isNew: boolean;
  isLocked?: boolean;
  progress: number;
  totalChapters?: number;
  completedChapters?: number;
  comingSoon?: boolean;
}

defineProps<{
  stories: DreamStory[]
}>();

const emit = defineEmits<{
  (e: 'select-story', story: DreamStory): void
}>();

// 选择故事
function selectStory(story: DreamStory) {
  emit('select-story', story);
}
</script>

<template>
  <div class="dream-stories-container">
    <StoryCard
      v-for="story in stories"
      :key="story.id"
      :story="story"
      @click="selectStory"
    />
  </div>
</template>

<style scoped>
.dream-stories-container {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style> 
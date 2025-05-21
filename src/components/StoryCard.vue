<script setup lang="ts">
import type { DreamStory } from './DreamStoryList.vue';

interface StoryCardProps {
  story: DreamStory
}

defineProps<StoryCardProps>();
defineEmits(['click']);
</script>

<template>
  <div 
    class="story-card"
    :class="{ 'locked': story.isLocked }"
    @click="$emit('click', story)"
  >
    <div class="story-cover">
      <img :src="story.coverImage" alt="故事封面" />
      <div v-if="story.isNew" class="new-badge">新</div>
      <div v-if="story.isLocked" class="lock-overlay">
        <div class="lock-icon">🔒</div>
        <div v-if="story.comingSoon" class="coming-soon">即将上线</div>
      </div>
    </div>
    <div class="story-info">
      <h3 class="story-title">{{ story.title }}</h3>
      <p class="story-description">{{ story.description }}</p>
      <div v-if="!story.isLocked" class="story-progress">
        <div class="progress-text">
          <span>已完成 {{ story.completedChapters || 0 }}/{{ story.totalChapters || 0 }} 章节</span>
          <span>{{ story.progress }}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: story.progress + '%' }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.story-card {
  background-color: #1e1e1e;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
}

.story-card:not(.locked):hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
}

.story-card.locked {
  opacity: 0.8;
}

.story-cover {
  height: 180px;
  position: relative;
  overflow: hidden;
}

.story-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.story-card:not(.locked):hover .story-cover img {
  transform: scale(1.05);
}

.new-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #e74c3c;
  color: white;
  font-size: 12px;
  font-weight: bold;
  padding: 4px 8px;
  border-radius: 12px;
  z-index: 2;
}

.lock-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 2;
}

.lock-icon {
  font-size: 40px;
  color: white;
  margin-bottom: 10px;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

.coming-soon {
  font-size: 16px;
  color: #f1c40f;
  font-weight: bold;
}

.story-info {
  padding: 15px;
}

.story-title {
  margin: 0 0 8px 0;
  font-size: 20px;
  color: white;
}

.story-description {
  margin: 0 0 15px 0;
  font-size: 14px;
  color: #bbb;
  line-height: 1.4;
}

.story-progress {
  margin-top: 10px;
}

.progress-text {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  font-size: 12px;
  color: #aaa;
}

.progress-bar {
  height: 4px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #e74c3c;
  border-radius: 2px;
}
</style> 
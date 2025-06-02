<script setup lang="ts">
import type { DreamStory } from './DreamStoryList.vue';

interface StoryDetailsModalProps {
  story: DreamStory | null;
  show: boolean;
}

const props = defineProps<StoryDetailsModalProps>();
const emit = defineEmits(['close', 'start', 'continue']);

function closeDetails() {
  emit('close');
}

function startGame() {
  if (!props.story) return;
  emit('start', props.story);
}

function continueGame() {
  if (!props.story) return;
  emit('continue', props.story);
}
</script>

<template>
  <div v-if="show && story" class="story-details-overlay" @click.self="closeDetails">
    <div class="story-details-modal">
      <div class="modal-header">
        <h2>{{ story.title }}</h2>
        <span class="close-button" @click="closeDetails">×</span>
      </div>
      <div class="modal-cover">
        <img :src="story.coverImage" alt="故事封面" />
      </div>
      <div class="modal-content">
        <p class="modal-description">{{ story.description }}</p>
        <div class="chapter-info">
          <span class="chapter-count">共{{ story.totalChapters || 0 }}章</span>
          <span class="chapter-progress">已完成: {{ story.completedChapters || 0 }}/{{ story.totalChapters || 0 }}</span>
        </div>
        <div class="story-progress">
          <div class="progress-text">
            <span>完成度</span>
            <span>{{ story.progress }}%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: story.progress + '%' }"></div>
          </div>
        </div>
      </div>
      <div class="modal-actions">
        <button v-if="story.progress > 0" class="continue-button" @click="continueGame">继续游戏</button>
        <button v-else class="start-button" @click="startGame">开始游戏</button>
        <button v-if="story.progress > 0" class="restart-button" @click="startGame">重新开始</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.story-details-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.85);
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.story-details-modal {
  width: 90%;
  max-width: 400px;
  background-color: #1a1a1a;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: #222;
}

.modal-header h2 {
  margin: 0;
  font-size: 20px;
  color: white;
}

.close-button {
  font-size: 24px;
  cursor: pointer;
  color: white;
}

.modal-cover {
  height: 180px;
  overflow: hidden;
}

.modal-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.modal-content {
  padding: 20px;
  flex-grow: 1;
  overflow-y: auto;
}

.modal-description {
  font-size: 15px;
  line-height: 1.5;
  color: #ddd;
  margin-bottom: 20px;
}

.chapter-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  font-size: 14px;
  color: #bbb;
}

.modal-actions {
  display: flex;
  gap: 10px;
  padding: 15px 20px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.continue-button, .start-button, .restart-button {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.continue-button, .start-button {
  background-color: #e74c3c;
  color: white;
}

.continue-button:hover, .start-button:hover {
  background-color: #c0392b;
}

.restart-button {
  background-color: #333;
  color: white;
}

.restart-button:hover {
  background-color: #444;
}
</style> 
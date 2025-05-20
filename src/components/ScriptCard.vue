<script setup lang="ts">
interface ScriptCardProps {
  script: {
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
}

defineProps<ScriptCardProps>();
defineEmits(['click']);
</script>

<template>
  <div 
    class="script-card"
    :class="{ 'locked': script.isLocked }"
    @click="$emit('click', script)"
  >
    <div class="script-cover">
      <img :src="script.coverImage" alt="剧本封面" />
      <div v-if="script.isNew" class="new-badge">新</div>
      <div v-if="script.isLocked" class="lock-overlay">
        <div class="lock-icon">🔒</div>
        <div v-if="script.comingSoon" class="coming-soon">即将上线</div>
      </div>
    </div>
    <div class="script-info">
      <h3 class="script-title">{{ script.title }}</h3>
      <p class="script-description">{{ script.description }}</p>
      <div v-if="!script.isLocked" class="script-progress">
        <div class="progress-text">
          <span>已完成 {{ script.completedChapters || 0 }}/{{ script.totalChapters || 0 }} 章节</span>
          <span>{{ script.progress }}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: script.progress + '%' }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.script-card {
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

.script-card:not(.locked):hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
}

.script-card.locked {
  opacity: 0.8;
}

.script-cover {
  height: 180px;
  position: relative;
  overflow: hidden;
}

.script-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.script-card:not(.locked):hover .script-cover img {
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

.script-info {
  padding: 15px;
}

.script-title {
  margin: 0 0 8px 0;
  font-size: 20px;
  color: white;
}

.script-description {
  margin: 0 0 15px 0;
  font-size: 14px;
  color: #bbb;
  line-height: 1.4;
}

.script-progress {
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
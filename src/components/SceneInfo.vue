<script setup lang="ts">
import { ref } from 'vue';
import { RiArrowDownSLine } from '@remixicon/vue';

defineProps({
  scene: {
    type: String,
    default: '（番外）你发现羌青瓷接近你别有目的'
  },
  stage: {
    type: String,
    default: '初步相识'
  },
  progress: {
    type: Number,
    default: 40
  }
});

const isCollapsed = ref(false);
const emit = defineEmits(['toggle-collapse']);

function toggleCollapse() {
  isCollapsed.value = !isCollapsed.value;
  emit('toggle-collapse', isCollapsed.value);
}
</script>

<template>
  <div class="scene-container">
    <div class="scene-info">
      <div class="scene-text">情节：{{ scene }}</div>
      <div class="scene-stage">{{ stage }}</div>
    </div>
    
    <div class="progress-section">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: `${progress}%` }"></div>
      </div>
      <div class="collapse-wrapper" @click="toggleCollapse">
        <div class="collapse-button">
          {{ isCollapsed ? '展开对话' : '收起对话' }}
        </div>
        <div class="arrow-icon" :class="{ 'rotate': isCollapsed }">
          <RiArrowDownSLine />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.scene-container {
  background-color: #1a2a2a;
  color: white;
  padding: 10px 15px;
  font-size: 14px;
}

.scene-info {
  margin-bottom: 8px;
}

.scene-text {
  font-weight: 500;
  margin-bottom: 5px;
}

.scene-stage {
  color: #cccccc;
  font-size: 12px;
}

.progress-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.progress-bar {
  flex: 1;
  height: 4px;
  background-color: #3a4a4a;
  border-radius: 2px;
  overflow: hidden;
  margin-right: 10px;
}

.progress-fill {
  height: 100%;
  background-color: #42b883;
  border-radius: 2px;
}

.collapse-wrapper {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.collapse-button {
  color: #cccccc;
  font-size: 12px;
  padding: 2px 5px;
}

.arrow-icon {
  display: flex;
  align-items: center;
  color: #cccccc;
  font-size: 16px;
  transition: transform 0.3s ease;
}

.arrow-icon.rotate {
  transform: rotate(180deg);
}

.collapse-wrapper:hover .collapse-button {
  text-decoration: underline;
}
</style> 
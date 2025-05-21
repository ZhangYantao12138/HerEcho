<script setup lang="ts">
import { ref, computed } from 'vue';
import type { ViewpointRelation } from '../types/viewpoint';

// 定义组件属性
const props = defineProps<{
  // 当前角色ID
  characterId: string;
  // 可用的视角关系列表
  viewpoints: ViewpointRelation[];
  // 当前选中的视角关系
  currentViewpoint?: ViewpointRelation;
}>();

// 定义事件
const emit = defineEmits<{
  // 选择视角时触发
  (e: 'select-viewpoint', viewpoint: ViewpointRelation): void;
}>();

// 是否显示选择器
const showSelector = ref(false);

// 选择视角
function selectViewpoint(viewpoint: ViewpointRelation) {
  emit('select-viewpoint', viewpoint);
  showSelector.value = false;
}

// 切换选择器显示状态
function toggleSelector() {
  showSelector.value = !showSelector.value;
}

// 关闭选择器
function closeSelector() {
  showSelector.value = false;
}

// 计算视角描述
const viewpointDescription = computed(() => {
  if (!props.currentViewpoint) {
    return '默认视角';
  }
  
  switch (props.currentViewpoint.promptKey) {
    case 'BJX_TO_CZL':
      return '蒋伯驾视角';
    case 'YS_TO_MHM':
      return '以撒视角';
    default:
      return '默认视角';
  }
});
</script>

<template>
  <div class="viewpoint-selector" @mouseleave="closeSelector">
    <div class="current-viewpoint" @click="toggleSelector">
      <span class="viewpoint-label">{{ viewpointDescription }}</span>
      <span class="viewpoint-arrow">▼</span>
    </div>
    
    <div v-if="showSelector" class="viewpoint-options">
      <div 
        v-for="viewpoint in viewpoints" 
        :key="`${viewpoint.characterId}-${viewpoint.viewpointId}`"
        class="viewpoint-option"
        :class="{ 'active': currentViewpoint && currentViewpoint.characterId === viewpoint.characterId }"
        @click="selectViewpoint(viewpoint)"
      >
        <span class="option-name">
          {{ viewpoint.promptKey === 'BJX_TO_CZL' ? '蒋伯驾视角' : 
             viewpoint.promptKey === 'YS_TO_MHM' ? '以撒视角' : '默认视角' }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.viewpoint-selector {
  position: relative;
  min-width: 120px;
}

.current-viewpoint {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 6px;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.2s ease;
}

.current-viewpoint:hover {
  background-color: rgba(0, 0, 0, 0.3);
}

.viewpoint-label {
  font-size: 14px;
  color: #f1f1f1;
}

.viewpoint-arrow {
  font-size: 10px;
  color: #aaa;
  margin-left: 6px;
}

.viewpoint-options {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  margin-top: 5px;
  background-color: #272727;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 10;
}

.viewpoint-option {
  padding: 10px 12px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.viewpoint-option:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.viewpoint-option.active {
  background-color: rgba(231, 76, 60, 0.2);
}

.option-name {
  font-size: 14px;
  color: #f1f1f1;
}
</style> 
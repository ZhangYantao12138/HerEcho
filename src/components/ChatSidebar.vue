<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { RiCloseLine } from '@remixicon/vue';
import ModelSelector from './ModelSelector.vue';
import ViewpointSelector from './ViewpointSelector.vue';
import type { ViewpointRelation } from '../types/viewpoint';
import type { AIModel } from '../types/chat';
import type { Character } from '../types/character';
import { getAvailableViewpoints, getCurrentViewpoint } from '../services/viewpointService';

const props = defineProps<{
  show: boolean;
  currentCharacter: Character;
}>();

const emit = defineEmits(['close', 'test-api', 'change-viewpoint', 'model-changed']);

// 获取可用的视角关系
const viewpoints = computed(() => {
  return getAvailableViewpoints(props.currentCharacter.id);
});

// 获取当前视角关系
const currentViewpoint = computed(() => {
  return getCurrentViewpoint(props.currentCharacter.id);
});

// 监听 show 属性变化
watch(() => props.show, (newValue, oldValue) => {
  console.log('ChatSidebar: show 属性变化:', { oldValue, newValue });
}, { immediate: true });

onMounted(() => {
  console.log('ChatSidebar: 组件已挂载');
  console.log('ChatSidebar: 初始 show 值:', props.show);
});

function handleClose() {
  console.log('ChatSidebar: 关闭按钮被点击');
  emit('close');
}

function handleTestApi() {
  emit('test-api');
}

function handleViewpointChange(viewpoint: ViewpointRelation) {
  emit('change-viewpoint', viewpoint);
}

function handleModelSelect(model: AIModel) {
  emit('model-changed', model);
}
</script>

<template>
  <Teleport to="body">
    <div 
      v-if="show"
      class="sidebar-overlay" 
      @click="handleClose"
    >
      <div class="sidebar" @click.stop>
        <div class="sidebar-header">
          <h3>设置</h3>
          <button class="close-button" @click="handleClose">
            <RiCloseLine />
          </button>
        </div>
        
        <div class="sidebar-content">
          <div class="section">
            <h4>模型选择</h4>
            <ModelSelector @select="handleModelSelect" />
          </div>
          
          <div class="section">
            <h4>视角设置</h4>
            <ViewpointSelector 
              :characterId="currentCharacter.id"
              :viewpoints="viewpoints"
              :currentViewpoint="currentViewpoint"
              @select-viewpoint="handleViewpointChange"
            />
          </div>
          
          <div class="section">
            <h4>API测试</h4>
            <button class="test-api-button" @click="handleTestApi">
              测试API连接
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  display: flex;
  justify-content: flex-end;
}

.sidebar {
  width: 280px;
  height: 100vh;
  background-color: #1a1a1a;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 10000;
  transform: translateX(0);
  transition: transform 0.3s ease;
}

/* 添加过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active .sidebar,
.fade-leave-active .sidebar {
  transition: transform 0.3s ease;
}

.fade-enter-from .sidebar,
.fade-leave-to .sidebar {
  transform: translateX(100%);
}

.sidebar-header {
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-header h3 {
  margin: 0;
  color: white;
  font-size: 18px;
}

.close-button {
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
}

.close-button:hover {
  color: white;
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.section {
  margin-bottom: 24px;
}

.section h4 {
  margin: 0 0 12px 0;
  color: #999;
  font-size: 14px;
  font-weight: 500;
}

.test-api-button {
  width: 100%;
  padding: 10px;
  background-color: #2c3e50;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.test-api-button:hover {
  background-color: #34495e;
}
</style> 
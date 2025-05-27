<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { RiArrowDownSLine } from '@remixicon/vue';
import { AIModel } from '../types/chat';
import { modelConfigs } from '../config/promptConfig';

const emit = defineEmits<{
  'select-model': [model: AIModel]
}>();

const showModelList = ref(false);
const modelSelectorRef = ref<HTMLElement | null>(null);
const currentModel = ref<AIModel>(AIModel.DEEPSEEK);

// 获取所有可用的模型
const availableModels = computed(() => {
  return Object.values(modelConfigs);
});

// 获取当前选择的模型配置
const selectedModelConfig = computed(() => {
  return modelConfigs[currentModel.value];
});

// 切换模型列表显示
function toggleModelList() {
  showModelList.value = !showModelList.value;
}

// 选择模型
function selectModel(model: AIModel) {
  currentModel.value = model;
  emit('select-model', model);
  showModelList.value = false;
}

// 处理点击外部区域关闭模型列表
function handleClickOutside(event: MouseEvent) {
  if (
    modelSelectorRef.value &&
    !modelSelectorRef.value.contains(event.target as Node)
  ) {
    showModelList.value = false;
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <div class="model-selector" @click="toggleModelList" ref="modelSelectorRef">
    <div class="selected-model">
      <div class="model-info">
        <div class="model-name">{{ selectedModelConfig.name }}</div>
        <div class="model-description">{{ selectedModelConfig.description }}</div>
      </div>
      <RiArrowDownSLine class="arrow" :class="{ 'rotated': showModelList }" />
    </div>

    <div class="model-list" v-if="showModelList">
      <div
        v-for="model in availableModels"
        :key="model.id"
        class="model-option"
        :class="{ 'selected': model.id === currentModel }"
        @click="selectModel(model.id)"
      >
        <div class="model-option-info">
          <div class="model-name">{{ model.name }}</div>
          <div class="model-description">{{ model.description }}</div>
        </div>
        <div class="model-status" v-if="model.id === currentModel">当前</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.model-selector {
  position: relative;
  cursor: pointer;
  min-width: 120px;
}

.selected-model {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 10px;
  border-radius: 6px;
  background-color: rgba(255, 255, 255, 0.05);
  transition: all 0.2s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.selected-model:hover {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
}

.model-info {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.model-name {
  color: #ffffff;
  font-size: 13px;
  font-weight: 500;
  line-height: 1.2;
}

.model-description {
  color: #999999;
  font-size: 11px;
  line-height: 1.2;
  margin-top: 1px;
}

.arrow {
  color: #cccccc;
  transition: transform 0.2s ease;
  margin-left: 6px;
  flex-shrink: 0;
}

.arrow.rotated {
  transform: rotate(180deg);
}

.model-list {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background-color: #1a1e1f;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 200;
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
}

.model-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.model-option:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.model-option.selected {
  background-color: rgba(255, 255, 255, 0.1);
}

.model-option:not(:last-child) {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.model-option-info {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.model-option-info .model-name {
  color: #ffffff;
  font-size: 13px;
  font-weight: 500;
  line-height: 1.2;
}

.model-option-info .model-description {
  color: #999999;
  font-size: 11px;
  line-height: 1.2;
  margin-top: 2px;
}

.model-status {
  color: #4ade80;
  font-size: 11px;
  font-weight: 500;
  background-color: rgba(74, 222, 128, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid rgba(74, 222, 128, 0.2);
}
</style> 
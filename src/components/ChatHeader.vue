<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { 
  RiArrowLeftSLine, 
  RiTestTubeLine
} from '@remixicon/vue';
import { characters } from '../config/characters';
import type { Character } from '../types/character';
import { 
  getViewpointDescription, 
  getAvailableViewpoints, 
  getCurrentViewpoint,
  VIEWPOINT_MAPPING
} from '../services/viewpointService';
import ViewpointSelector from './ViewpointSelector.vue';
import type { ViewpointRelation } from '../types/viewpoint';

const router = useRouter();

const props = defineProps<{
  currentCharacter: Character
}>();

const emit = defineEmits(['testApi', 'change-viewpoint']);

const showCharacterList = ref(false);
const characterSelectorRef = ref<HTMLElement | null>(null);

// 获取可用的视角关系
const availableViewpoints = computed(() => {
  return getAvailableViewpoints(props.currentCharacter.id);
});

// 获取当前视角关系
const currentViewpoint = computed(() => {
  return getCurrentViewpoint(props.currentCharacter.id);
});

// 处理视角切换
function handleViewpointChange(viewpoint: ViewpointRelation) {
  emit('change-viewpoint', viewpoint);
}

// 返回剧本选择页
function goBack() {
  router.push('/');
}

// 切换角色列表显示
function toggleCharacterList() {
  showCharacterList.value = !showCharacterList.value;
}

// 选择角色
function selectCharacter(character: Character) {
  router.push(`/chat/${character.id}`);
  showCharacterList.value = false;
}

// 处理点击外部区域关闭角色列表
function handleClickOutside(event: MouseEvent) {
  if (
    characterSelectorRef.value && 
    !characterSelectorRef.value.contains(event.target as Node)
  ) {
    showCharacterList.value = false;
  }
}

// 处理API测试
function handleTestApi() {
  emit('testApi');
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <header class="chat-header">
    <div class="left-section">
      <button class="back-button" @click="goBack">
        <RiArrowLeftSLine />
      </button>
      
      <div class="character-selector" @click="toggleCharacterList" ref="characterSelectorRef">
        <div class="selected-character">
          <div class="character-avatar">
            <img :src="currentCharacter.avatar" alt="">
          </div>
          <div class="character-info">
            <div class="name">{{ currentCharacter.name }}</div>
            <div class="scene">{{ currentCharacter.sceneInfo.title }}</div>
          </div>
        </div>
        
        <div class="character-list" v-if="showCharacterList">
          <div 
            v-for="character in characters" 
            :key="character.id"
            class="character-option"
            :class="{ 'selected': character.id === currentCharacter.id }"
            @click="selectCharacter(character)"
          >
            <div class="character-avatar">
              <img :src="character.avatar" alt="">
            </div>
            <div class="character-option-info">
              <div class="name">{{ character.name }}</div>
              <div class="title">{{ character.sceneInfo.title }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="header-actions">
      <!-- 视角选择器 -->
      <ViewpointSelector 
        v-if="availableViewpoints.length > 0"
        :characterId="currentCharacter.id"
        :viewpoints="availableViewpoints"
        :currentViewpoint="currentViewpoint"
        @select-viewpoint="handleViewpointChange"
        class="viewpoint-selector-container"
      />
      
      <div class="icon-button" @click="handleTestApi">
        <RiTestTubeLine />
      </div>
    </div>
  </header>
</template>

<style scoped>
.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  background-color: #111819;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.left-section {
  display: flex;
  align-items: center;
}

.back-button {
  background: none;
  border: none;
  color: #cccccc;
  cursor: pointer;
  padding: 5px;
  margin-right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  width: 32px;
  height: 32px;
}

.back-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.character-selector {
  position: relative;
  cursor: pointer;
}

.selected-character {
  display: flex;
  align-items: center;
  padding: 5px 10px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.selected-character:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.character-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.character-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.character-info {
  display: flex;
  flex-direction: column;
}

.character-info .name {
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
}

.character-info .scene {
  color: #999999;
  font-size: 12px;
}

.character-list {
  position: absolute;
  top: 100%;
  left: 0;
  width: 280px;
  max-height: 400px;
  overflow-y: auto;
  background-color: #1a1e1f;
  border-radius: 8px;
  margin-top: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 200;
}

.character-option {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.character-option:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.character-option.selected {
  background-color: rgba(255, 255, 255, 0.1);
}

.character-option-info {
  display: flex;
  flex-direction: column;
}

.character-option-info .name {
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
}

.character-option-info .title {
  color: #999999;
  font-size: 12px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.viewpoint-selector-container {
  margin-right: 5px;
}

.icon-button {
  color: #cccccc;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.icon-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}
</style>
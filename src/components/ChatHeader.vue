<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {
  RiArrowLeftSLine,
  RiMenuLine,
  RiSettings4Line,
  RiCloseLine
} from '@remixicon/vue';
import { characters } from '../config/characters';
import { getScriptById } from '../config/scripts';
import type { Character } from '../types/character';
import ModelSelector from './ModelSelector.vue';
import ViewpointSelector from './ViewpointSelector.vue';
import type { ViewpointRelation } from '../types/viewpoint';
import type { AIModel } from '../types/chat';
import { getAvailableViewpoints, getCurrentViewpoint } from '../services/viewpointService';

const router = useRouter();
const route = useRoute();

const props = defineProps<{
  currentCharacter: Character
}>();

const emit = defineEmits(['test-api', 'change-viewpoint', 'model-changed']);

const showCharacterList = ref(false);
const showSettingsMenu = ref(false);
const characterSelectorRef = ref<HTMLElement | null>(null);
const settingsMenuRef = ref<HTMLElement | null>(null);
const showSettings = ref(false);
const autoPlayTTS = ref(false);

// 获取当前剧本ID
const scriptId = computed(() => route.params.scriptId as string);

// 获取当前剧本可用的角色列表
const availableCharacters = computed(() => {
  const currentScript = getScriptById(scriptId.value);
  if (!currentScript) return characters;
  return characters.filter(character =>
    currentScript.characters.includes(character.id)
  );
});

// 返回剧本选择页
function goBack() {
  router.push('/');
}

// 切换角色列表显示
function toggleCharacterList() {
  showCharacterList.value = !showCharacterList.value;
  if (showCharacterList.value) {
    showSettingsMenu.value = false;
  }
}

// 切换设置菜单显示
function toggleSettingsMenu() {
  console.log('ChatHeader: 设置按钮被点击');
  showSettingsMenu.value = !showSettingsMenu.value;
  if (showSettingsMenu.value) {
    showCharacterList.value = false;
  }
}

// 选择角色
function selectCharacter(character: Character) {
  console.log(`用户选择了角色: ${character.name}(${character.id}), 剧本ID: ${scriptId.value}`);
  router.push(`/chat/${scriptId.value}/${character.id}`);
  showCharacterList.value = false;
}

// 处理点击外部区域关闭菜单
function handleClickOutside(event: MouseEvent) {
  if (
    characterSelectorRef.value &&
    !characterSelectorRef.value.contains(event.target as Node) &&
    settingsMenuRef.value &&
    !settingsMenuRef.value.contains(event.target as Node)
  ) {
    showCharacterList.value = false;
    showSettingsMenu.value = false;
  }
}

// 处理模型选择
function handleModelSelect(model: AIModel) {
  emit('model-changed', model);
  showSettingsMenu.value = false;
}

// 处理视角切换
function handleViewpointChange(viewpoint: ViewpointRelation) {
  emit('change-viewpoint', viewpoint);
  showSettingsMenu.value = false;
}

// 处理API测试
function handleTestApi() {
  emit('test-api');
  showSettingsMenu.value = false;
}

// 保存设置到本地存储
function saveSettings() {
  localStorage.setItem('autoPlayTTS', autoPlayTTS.value.toString());
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  const savedAutoPlay = localStorage.getItem('autoPlayTTS');
  if (savedAutoPlay !== null) {
    autoPlayTTS.value = savedAutoPlay === 'true';
  }
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
            <img :src="props.currentCharacter.avatar" alt="">
          </div>
          <div class="character-info">
            <div class="name">{{ props.currentCharacter.name }}</div>
            <div class="scene">{{ props.currentCharacter.sceneInfo.title }}</div>
          </div>
        </div>
        
        <div class="character-list" v-if="showCharacterList">
          <div
            v-for="character in availableCharacters"
            :key="character.id"
            class="character-item"
            @click="selectCharacter(character)"
          >
            <div class="character-avatar">
              <img :src="character.avatar" alt="">
            </div>
            <div class="character-info">
              <div class="name">{{ character.name }}</div>
              <div class="scene">{{ character.sceneInfo.title }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="right-section">
      <div class="settings-menu" ref="settingsMenuRef">
        <button class="menu-button" @click="toggleSettingsMenu">
          <RiSettings4Line />
        </button>
        
        <Transition name="fade">
          <div class="settings-dropdown" v-if="showSettingsMenu">
            <div class="settings-section">
              <h4>模型选择</h4>
              <ModelSelector @select="handleModelSelect" />
            </div>
            
            <div class="settings-section">
              <h4>视角设置</h4>
              <ViewpointSelector 
                :characterId="currentCharacter.id"
                :viewpoints="getAvailableViewpoints(currentCharacter.id)"
                :currentViewpoint="getCurrentViewpoint(currentCharacter.id)"
                @select-viewpoint="handleViewpointChange"
              />
            </div>
            
            <div class="settings-section">
              <h4>API测试</h4>
              <button class="test-api-button" @click="handleTestApi">
                测试API连接
              </button>
            </div>

            <div class="settings-item">
              <span>自动播放语音</span>
              <label class="switch">
                <input type="checkbox" v-model="autoPlayTTS" @change="saveSettings">
                <span class="slider round"></span>
              </label>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </header>
</template>

<style scoped>
.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background-color: rgba(26, 42, 42, 0.8);
  backdrop-filter: blur(10px);
  height: 50px;
  position: relative;
  z-index: 1000;
}

.left-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.back-button {
  background: none;
  border: none;
  color: #cccccc;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
}

.back-button:hover {
  color: white;
}

.character-selector {
  position: relative;
  cursor: pointer;
}

.selected-character {
  display: flex;
  align-items: center;
  gap: 8px;
}

.character-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
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

.name {
  font-size: 14px;
  font-weight: 500;
  color: white;
}

.scene {
  font-size: 12px;
  color: #cccccc;
}

.character-list {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 8px;
  background-color: rgba(26, 42, 42, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  min-width: 200px;
  max-height: 300px;
  overflow-y: auto;
}

.character-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.character-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.right-section {
  display: flex;
  align-items: center;
}

.settings-menu {
  position: relative;
}

.menu-button {
  background: none;
  border: none;
  color: #cccccc;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
}

.menu-button:hover {
  color: white;
}

.settings-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background-color: rgba(26, 42, 42, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  min-width: 280px;
  padding: 16px;
  z-index: 1001;
}

/* 添加过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.settings-section {
  margin-bottom: 20px;
}

.settings-section:last-child {
  margin-bottom: 0;
}

.settings-section h4 {
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

.settings-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  color: #fff;
}

.switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 20px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  transition: .4s;
}

input:checked + .slider {
  background-color: #42b883;
}

input:checked + .slider:before {
  transform: translateX(20px);
}

.slider.round {
  border-radius: 20px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>
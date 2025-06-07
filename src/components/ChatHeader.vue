<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {
  RiArrowLeftSLine,
  RiMenuLine,
  RiSettings4Line,
  RiCloseLine,
  RiArrowLeftLine
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
  currentCharacter: Character;
  isCollapsed: boolean;
  hasDynamicBackground: boolean;
  isDynamicBackground: boolean;
  autoPlayTTS: boolean;
  isStoryMode: boolean;
}>();

const emit = defineEmits<{
  (e: 'toggle-collapse'): void;
  (e: 'toggle-background'): void;
  (e: 'test-api'): void;
  (e: 'model-changed', model: AIModel): void;
  (e: 'change-viewpoint', viewpoint: ViewpointRelation): void;
  (e: 'auto-play-changed', value: boolean): void;
  (e: 'story-mode-changed', value: boolean): void;
}>();

const showCharacterList = ref(false);
const showSettingsMenu = ref(false);
const characterSelectorRef = ref<HTMLElement | null>(null);
const settingsMenuRef = ref<HTMLElement | null>(null);
const showSettings = ref(false);

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
        <RiArrowLeftLine />
      </button>

      <div class="character-selector" @click="toggleCharacterList" ref="characterSelectorRef">
        <div class="selected-character">
          <div class="character-avatar">
            <img :src="props.currentCharacter.avatar" alt="">
          </div>
          <div class="character-info">
            <div class="name">{{ props.currentCharacter.name }}</div>
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
                :characterId="props.currentCharacter.id"
                :viewpoints="getAvailableViewpoints(props.currentCharacter.id)"
                :currentViewpoint="getCurrentViewpoint(props.currentCharacter.id)"
                @select-viewpoint="handleViewpointChange"
              />
            </div>

            <div class="settings-section" v-if="props.hasDynamicBackground">
              <h4>背景设置</h4>
              <div class="settings-item">
                <span>动态背景</span>
                <label class="switch">
                  <input type="checkbox" 
                         :checked="props.isDynamicBackground"
                         @change="emit('toggle-background')">
                  <span class="slider round"></span>
                </label>
              </div>
            </div>
            
            <div class="settings-section">
              <h4>API测试</h4>
              <button class="test-api-button" @click="handleTestApi">
                测试API连接
              </button>
            </div>

            <div class="settings-section">
              <h4>语音设置</h4>
              <div class="settings-item">
                <span>自动播放语音</span>
                <label class="switch">
                  <input type="checkbox" 
                         :checked="props.autoPlayTTS"
                         @change="emit('auto-play-changed', !props.autoPlayTTS)">
                  <span class="slider round"></span>
                </label>
              </div>
            </div>

            <div class="settings-section">
              <h4>剧情设置</h4>
              <div class="settings-item">
                <span>剧情对话模式</span>
                <label class="switch">
                  <input type="checkbox" 
                         :checked="props.isStoryMode"
                         @change="emit('story-mode-changed', !props.isStoryMode)">
                  <span class="slider round"></span>
                </label>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </header>
</template>

<style scoped>
.chat-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background-color: rgba(26, 42, 42, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px;
  z-index: 100;
  max-width: 480px;
  margin: 0 auto;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.left-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.back-button {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s ease;
}

.back-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.character-selector {
  position: relative;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: background-color 0.2s ease;
}

.character-selector:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.selected-character {
  display: flex;
  align-items: center;
  gap: 10px;
}

.character-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  border: 2px solid rgba(255, 255, 255, 0.2);
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
  font-size: 16px;
  font-weight: 500;
  color: white;
  line-height: 1.2;
}

.character-list {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  width: 200px;
  background-color: rgba(26, 42, 42, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  z-index: 1000;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.character-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.character-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.right-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.menu-button {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s ease;
}

.menu-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.settings-menu {
  position: relative;
}

.settings-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 200px;
  background-color: rgba(26, 42, 42, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  z-index: 1000;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.settings-section {
  padding: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.settings-section:last-child {
  border-bottom: none;
}

.settings-section h4 {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #cccccc;
}

.settings-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  font-size: 14px;
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

.test-api-button {
  width: 100%;
  padding: 8px;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s ease;
}

.test-api-button:hover {
  background-color: #3aa876;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
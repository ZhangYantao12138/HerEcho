<script setup lang="ts">
import { ref, computed } from 'vue';
import { getCharacterById } from '../config/characters';
import type { Character } from '../types/character';

interface ScriptDetailsModalProps {
  script: {
    id: string;
    title: string;
    description: string;
    coverImage: string;
    characters: string[]; // 角色ID列表
  } | null;
  show: boolean;
}

const props = defineProps<ScriptDetailsModalProps>();
const emit = defineEmits(['close', 'start']);

// 获取当前剧本对应的角色列表
const availableCharacters = computed(() => {
  if (!props.script) return [];
  return props.script.characters
    .map(id => getCharacterById(id))
    .filter((char): char is Character => char !== undefined);
});

const selectedCharacter = ref<Character | null>(null);
const showDropdown = ref(false);

function closeDetails() {
  emit('close');
  // 重置选择状态
  selectedCharacter.value = null;
  showDropdown.value = false;
}

function startChat() {
  if (!props.script || !selectedCharacter.value) return;
  emit('start', { 
    script: props.script, 
    characterId: selectedCharacter.value.id 
  });
}

function selectCharacter(character: Character) {
  selectedCharacter.value = character;
  showDropdown.value = false;
}

function toggleDropdown() {
  showDropdown.value = !showDropdown.value;
}
</script>

<template>
  <div v-if="show && script" class="script-details-overlay" @click.self="closeDetails">
    <div class="script-details-modal">
      <div class="modal-header">
        <h2>{{ script.title }}</h2>
        <span class="close-button" @click="closeDetails">×</span>
      </div>
      <div class="modal-cover">
        <img :src="script.coverImage" alt="剧本封面" />
      </div>
      <div class="modal-content">
        <p class="modal-description">{{ script.description }}</p>
        
        <!-- 角色选择部分 -->
        <div class="character-selection">
          <h3>选择角色</h3>
          <div class="character-dropdown">
            <div class="selected-character" @click="toggleDropdown">
              <div class="character-avatar">
                <img 
                  v-if="selectedCharacter" 
                  :src="selectedCharacter.avatar" 
                  :alt="selectedCharacter.name"
                />
                <span v-else>👤</span>
              </div>
              <div class="character-name">
                {{ selectedCharacter ? selectedCharacter.name : '请选择角色' }}
              </div>
              <div class="dropdown-arrow">▼</div>
            </div>
            <div v-if="showDropdown" class="dropdown-menu">
              <div
                v-for="character in availableCharacters"
                :key="character.id"
                class="dropdown-item"
                @click="selectCharacter(character)"
              >
                <div class="character-avatar">
                  <img :src="character.avatar" :alt="character.name" />
                </div>
                <div class="character-name">{{ character.name }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-actions">
        <button 
          class="start-button" 
          @click="startChat"
          :disabled="!selectedCharacter"
        >与ta聊天</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.script-details-overlay {
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

.script-details-modal {
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

/* 角色选择样式 */
.character-selection {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.character-selection h3 {
  margin: 0 0 15px 0;
  font-size: 16px;
  color: white;
}

.character-dropdown {
  position: relative;
  width: 100%;
}

.selected-character {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background-color: #333;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.selected-character:hover {
  background-color: #444;
}

.character-avatar {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #222;
  border-radius: 50%;
  overflow: hidden;
}

.character-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.character-name {
  flex: 1;
  font-size: 14px;
  color: #ddd;
}

.dropdown-arrow {
  font-size: 12px;
  color: #999;
  transition: transform 0.2s ease;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 5px;
  background-color: #333;
  border-radius: 8px;
  overflow: hidden;
  z-index: 1;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.dropdown-item:hover {
  background-color: #444;
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

.continue-button:disabled, .start-button:disabled, .restart-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.continue-button, .start-button {
  background-color: #e74c3c;
  color: white;
}

.continue-button:hover:not(:disabled), .start-button:hover:not(:disabled) {
  background-color: #c0392b;
}

.restart-button {
  background-color: #333;
  color: white;
}

.restart-button:hover:not(:disabled) {
  background-color: #444;
}
</style> 
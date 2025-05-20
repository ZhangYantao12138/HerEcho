<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { characters } from '../config/characters';
import type { Character } from '../types/character';

defineProps<{
  currentCharacter: Character;
  onTestApi?: () => void;
  onChangeCharacter?: (characterId: string) => void;
}>();

const emit = defineEmits<{
  (e: 'testApi'): void;
  (e: 'changeCharacter', characterId: string): void;
}>();

const showCharacterList = ref(false);
const characterSelectorRef = ref<HTMLElement | null>(null);

const handleCharacterChange = (characterId: string) => {
  emit('changeCharacter', characterId);
  showCharacterList.value = false;
};

// 处理点击外部区域
const handleClickOutside = (event: MouseEvent) => {
  if (
    characterSelectorRef.value && 
    !characterSelectorRef.value.contains(event.target as Node) &&
    showCharacterList.value
  ) {
    showCharacterList.value = false;
  }
};

// 添加和移除事件监听器
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <div class="chat-header">
    <div 
      ref="characterSelectorRef"
      class="character-selector" 
      @click.stop="showCharacterList = !showCharacterList"
    >
      <img :src="currentCharacter.avatar" :alt="currentCharacter.name" class="character-avatar">
      <span class="character-name">{{ currentCharacter.name }}</span>
      <div class="dropdown-arrow" :class="{ 'active': showCharacterList }">▼</div>
      
      <!-- 角色列表下拉框 -->
      <div 
        v-if="showCharacterList" 
        class="character-list"
        @click.stop
      >
        <div
          v-for="character in characters"
          :key="character.id"
          class="character-item"
          :class="{ 'active': character.id === currentCharacter.id }"
          @click="handleCharacterChange(character.id)"
        >
          <img :src="character.avatar" :alt="character.name" class="character-avatar-small">
          <span>{{ character.name }}</span>
        </div>
      </div>
    </div>
    
    <div class="header-actions">
      <button class="test-api-btn" @click="emit('testApi')">
        测试API
      </button>
    </div>
  </div>
</template>

<style scoped>
.chat-header {
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px;
  background-color: rgba(26, 42, 42, 0.6);
  backdrop-filter: blur(10px);
  position: relative;
  z-index: 10;
}

.character-selector {
  display: flex;
  align-items: center;
  cursor: pointer;
  position: relative;
  padding: 5px;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.character-selector:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.character-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 10px;
}

.character-name {
  color: #ffffff;
  font-size: 16px;
  margin-right: 8px;
}

.dropdown-arrow {
  color: #ffffff;
  font-size: 12px;
  transition: transform 0.2s;
}

.dropdown-arrow.active {
  transform: rotate(180deg);
}

.character-list {
  position: absolute;
  top: 100%;
  left: 0;
  width: 200px;
  background-color: rgba(26, 42, 42, 0.95);
  border-radius: 8px;
  padding: 8px;
  margin-top: 5px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.character-item {
  display: flex;
  align-items: center;
  padding: 8px;
  border-radius: 6px;
  transition: background-color 0.2s;
  color: #ffffff;
}

.character-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.character-item.active {
  background-color: rgba(66, 184, 131, 0.2);
}

.character-avatar-small {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 8px;
}

.header-actions {
  display: flex;
  align-items: center;
}

.test-api-btn {
  background: none;
  border: none;
  color: #cccccc;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 4px;
  transition: all 0.2s;
  font-size: 14px;
}

.test-api-btn:hover {
  color: #ffffff;
  background-color: rgba(255, 255, 255, 0.1);
}
</style> 
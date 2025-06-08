<template>
  <div class="dating-view">
    <div class="topbar">
      <span class="logo">💜</span>
      <span class="title">角色聊天</span>
      <span class="menu-icon">☰</span>
    </div>
    <div class="card-container">
      <CharacterCard :character="currentCharacter" @cancel="showNextCharacter" @match="onMatch" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import CharacterCard from '../components/characterCard.vue';
import { characters } from '../config/characters';
import { useRouter } from 'vue-router';

const currentIndex = ref(0);
const currentCharacter = computed(() => characters[currentIndex.value]);
const router = useRouter();

function showNextCharacter() {
  currentIndex.value = (currentIndex.value + 1) % characters.length;
}

function onMatch() {
  const character = currentCharacter.value;
  router.push(`/chat/${character.book_id}/${character.id}`);
}
</script>

<style scoped>
.dating-view {
  background: #181828;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  position: relative;
  max-width: 480px;
  margin: 0 auto;
  width: 100%;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
}
.topbar {
  width: 100%;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #1e1e2f;
  padding: 0 20px;
  box-sizing: border-box;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}
.logo {
  font-size: 22px;
  color: #d893eb;
  font-weight: bold;
}
.title {
  font-size: 20px;
  color: #fff;
  font-weight: 600;
  letter-spacing: 1px;
}
.menu-icon {
  font-size: 22px;
  color: #fff;
  cursor: pointer;
}
.card-container {
  width: 90vw;
  max-width: 480px;
  height: 70vh;
  min-height: 520px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
    /* 新增：为顶部栏预留空间 */
    padding-top: 85px;
    box-sizing: border-box;
}
</style> 
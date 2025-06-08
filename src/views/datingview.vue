<template>
  <div class="dating-view">
    <div class="header">角色聊天</div>
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
  background: #f7f3ff;
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

.header {
  font-size: 24px;
  font-weight: bold;
  margin: 32px 0 24px 0;
  color: #7a4fff;
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
}
</style> 
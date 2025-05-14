<script setup lang="ts">
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const tabs = [
  { key: '叙梦', path: '/dream' },
  { key: '聊天', path: '/chat' },
  { key: '发现', path: '/discover' },
  { key: '我的', path: '/profile' }
];

const currentPath = computed(() => route.path);

function navigate(path: string) {
  router.push(path);
}
</script>

<template>
  <div class="nav-container">
    <div 
      v-for="tab in tabs" 
      :key="tab.key"
      class="nav-item"
      :class="{ active: currentPath === tab.path }"
      @click="navigate(tab.path)"
    >
      <div class="nav-text">{{ tab.key }}</div>
    </div>
  </div>
</template>

<style scoped>
.nav-container {
  display: flex;
  justify-content: space-around;
  background-color: #000000;
  border-top: 1px solid #222222;
  padding: 12px 0;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 30;
  height: 48px;
  box-sizing: border-box;
}

.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5px 0;
  cursor: pointer;
  color: #888888;
}

.nav-item.active {
  color: #ffffff;
}

.nav-text {
  font-size: 14px;
  font-weight: 500;
  text-align: center;
}
</style> 
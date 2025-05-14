<script setup lang="ts">
import { ref } from 'vue';

const activeTab = ref('聊天');
const tabs = [
  { key: '叙梦' },
  { key: '聊天' },
  { key: '发现' },
  { key: '我的' }
];

function setActiveTab(tab: string) {
  activeTab.value = tab;
}
</script>

<template>
  <div class="nav-container">
    <div 
      v-for="tab in tabs" 
      :key="tab.key"
      class="nav-item"
      :class="{ active: activeTab === tab.key }"
      @click="setActiveTab(tab.key)"
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
  position: sticky;
  bottom: 0;
  z-index: 10;
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
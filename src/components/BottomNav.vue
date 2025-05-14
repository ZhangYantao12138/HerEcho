<script setup lang="ts">
import { ref } from 'vue';

const activeTab = ref('聊天');
const tabs = [
  { key: '叙梦', icon: '💭' },
  { key: '聊天', icon: '💬' },
  { key: '发现', icon: '🔍' },
  { key: '我的', icon: '👤' }
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
      <div class="nav-icon">{{ tab.icon }}</div>
      <div class="nav-text">{{ tab.key }}</div>
    </div>
  </div>
</template>

<style scoped>
.nav-container {
  display: flex;
  background-color: white;
  border-top: 1px solid #e0e0e0;
  padding: 8px 0;
  position: sticky;
  bottom: 0;
  z-index: 10;
}

.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 5px 0;
  cursor: pointer;
  color: #888;
}

.nav-item.active {
  color: #42b883;
}

.nav-icon {
  font-size: 20px;
  margin-bottom: 2px;
}

.nav-text {
  font-size: 12px;
}
</style> 
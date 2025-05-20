<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import ScriptCard from './ScriptCard.vue';
import ScriptDetailsModal from './ScriptDetailsModal.vue';
import { scripts } from '../config/scripts';
import type { Script } from '../types/script';

const router = useRouter();

// 显示剧本详情弹窗
const showScriptDetails = ref(false);
const selectedScript = ref<Script | null>(null);

// 进入剧本
function enterScript(script: Script) {
  if (script.isLocked) {
    showLockedMessage(script);
    return;
  }
  
  selectedScript.value = script;
  showScriptDetails.value = true;
}

// 开始聊天
function startChat(data: { script: Script, characterId: string }) {
  if (!data.script) return;
  router.push(`/chat/${data.script.id}/${data.characterId}`);
  showScriptDetails.value = false;
}

// 继续聊天
function continueChat(data: { script: Script, characterId: string }) {
  if (!data.script) return;
  router.push(`/chat/${data.script.id}/${data.characterId}`);
  showScriptDetails.value = false;
}

// 显示锁定信息
function showLockedMessage(script: Script) {
  alert(`《${script.title}》尚未开放，敬请期待！`);
}

// 关闭详情弹窗
function closeDetails() {
  showScriptDetails.value = false;
}
</script>

<template>
  <div class="script-selection-container">
    <!-- 页面头部 -->
    <div class="script-header">
      <div class="page-title">剧本选择</div>
    </div>
    
    <!-- 剧本卡片列表 -->
    <div class="script-list-container">
      <ScriptCard
        v-for="script in scripts"
        :key="script.id"
        :script="script"
        @click="enterScript"
      />
    </div>
    
    <!-- 剧本详情弹窗 -->
    <ScriptDetailsModal
      :script="selectedScript"
      :show="showScriptDetails"
      @close="closeDetails"
      @start="startChat"
      @continue="continueChat"
    />
  </div>
</template>

<style scoped>
.script-selection-container {
  min-height: 100vh;
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
  background-color: #121212;
  color: white;
  padding-bottom: 60px;
  position: relative;
}

.script-header {
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  max-width: 480px;
  margin: 0 auto;
}

.page-title {
  font-size: 24px;
  font-weight: bold;
}

.script-list-container {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 480px;
  margin: 0 auto;
  width: 100%;
}
</style> 
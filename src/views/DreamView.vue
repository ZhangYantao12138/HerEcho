<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import BottomNav from '../components/BottomNav.vue';
import { useScenesStore } from '../stores/scenes';

// 获取分镜数据存储
const scenesStore = useScenesStore();

// 是否正在播放分镜动画
const isPlaying = ref(false);

// 处理选项选择
function selectOption(optionId: string) {
  // 选择后显示短暂的选择效果
  isPlaying.value = true;
  
  // 延迟后切换到下一个场景
  setTimeout(() => {
    // 调用store的selectOption方法处理选择逻辑
    const success = scenesStore.selectOption(optionId);
    if (success) {
      console.log(`跳转到分镜: ${scenesStore.currentSceneId}`);
    } else {
      console.log('无下一个场景，可能是结局或错误');
    }
    isPlaying.value = false;
  }, 800);
}

// 重播当前分镜
function replayScene() {
  // 设置动画播放状态
  isPlaying.value = true;
  
  // 调用store的重播方法
  scenesStore.replayCurrentScene();
  
  // 模拟动画播放结束
  setTimeout(() => {
    isPlaying.value = false;
  }, 1500);
}

// 组件挂载时，确保从第一个场景开始
onMounted(() => {
  // 如果需要，可以重置到初始场景
  // scenesStore.resetToStart();
});
</script>

<template>
  <div class="dream-container">
    <!-- 分镜内容区域 -->
    <div class="scene-content" :class="{ 'playing': isPlaying }">
      <div class="scene-image">
        <img :src="scenesStore.currentScene.image" alt="分镜场景" class="scene-img" />
      </div>
      
      <!-- 问题区域 -->
      <div class="question-container">
        <div class="question-text">{{ scenesStore.currentScene.title }}</div>
      </div>
      
      <!-- 回放按钮 -->
      <div v-if="scenesStore.currentScene.canReplay" 
           class="replay-button" 
           @click="replayScene">
        <span class="replay-icon">▶</span>
        <span class="replay-text">再看一遍</span>
      </div>
      
      <!-- 选项列表 -->
      <div class="options-container" :class="{ 'disabled': isPlaying }">
        <div 
          v-for="option in scenesStore.currentScene.options" 
          :key="option.id"
          class="option-item"
          @click="!isPlaying && selectOption(option.id)"
        >
          <div class="option-prefix">{{ option.id }}:</div>
          <div class="option-text">{{ option.text }}</div>
        </div>
      </div>
    </div>
    
    <!-- 底部导航栏 -->
    <BottomNav />
  </div>
</template>

<style scoped>
.dream-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #121a1a;
  color: white;
  padding-bottom: 48px; /* 为底部导航栏留出空间 */
}

.scene-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  transition: opacity 0.3s ease;
}

.scene-content.playing {
  opacity: 0.8;
}

.scene-image {
  flex: 1;
  width: 100%;
  position: relative;
  overflow: hidden;
}

.scene-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.question-container {
  position: absolute;
  bottom: 160px;
  left: 0;
  right: 0;
  padding: 15px;
  background-color: rgba(0, 0, 0, 0.7);
  text-align: center;
}

.question-text {
  font-size: 18px;
  font-weight: 500;
  line-height: 1.4;
}

.replay-button {
  position: absolute;
  bottom: 110px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 20px;
  padding: 8px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.replay-button:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

.replay-icon {
  margin-right: 5px;
  font-size: 14px;
}

.replay-text {
  font-size: 14px;
}

.options-container {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  padding: 15px;
  gap: 10px;
  transition: opacity 0.3s ease;
}

.options-container.disabled {
  pointer-events: none;
  opacity: 0.7;
}

.option-item {
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  padding: 15px;
  display: flex;
  color: #222;
  cursor: pointer;
  transition: transform 0.2s ease, background-color 0.2s ease;
}

.option-item:hover {
  transform: translateY(-2px);
  background-color: rgba(255, 255, 255, 1);
}

.option-item:active {
  transform: translateY(0);
}

.option-prefix {
  font-weight: bold;
  margin-right: 8px;
}

.option-text {
  flex: 1;
}
</style> 
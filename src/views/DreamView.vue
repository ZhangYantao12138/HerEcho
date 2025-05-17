<script setup lang="ts">
import { ref, onMounted, defineProps } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import BottomNav from '../components/BottomNav.vue';
import { useDreamStore } from '../stores/dreamStore';
import oneImage from '../assets/one.png';

// 定义 props
const props = defineProps<{
  storyId?: string
}>();

// 获取路由参数
const route = useRoute();
const router = useRouter();
const storyId = props.storyId || route.params.storyId as string;

// 获取叙梦数据
const dreamStore = useDreamStore();

// 动画状态
const isPlaying = ref(false);

// 是否显示特殊效果列表
const showEffectsList = ref(false);

// 处理选项选择
function selectOption(optionId: string) {
  const success = dreamStore.selectOption(optionId);
}

// 继续到下一个分镜
function continueToNextScene() {
  isPlaying.value = true;
  
  setTimeout(() => {
    const success = dreamStore.continueToNextScene();
    isPlaying.value = false;
    
    // 如果有结局，返回首页
    if (dreamStore.activeEnding) {
      setTimeout(() => {
        router.push('/dream');
      }, 3000);
    }
  }, 500);
}

// 切换特殊效果列表显示状态
function toggleEffectsList() {
  showEffectsList.value = !showEffectsList.value;
}

// 返回首页
function goBack() {
  router.push('/dream');
}

// 组件挂载时，重置到初始分镜
onMounted(() => {
  if (!storyId) {
    router.push('/dream');
    return;
  }
  
  // 根据故事ID初始化场景
  dreamStore.initializeStory(storyId);
});
</script>

<template>
  <div class="dream-container">
    <!-- 返回按钮 -->
    <div class="back-button" @click="goBack">
      <span class="back-icon">←</span>
    </div>
    
    <!-- 背景图片 -->
    <div class="background-image">
      <img :src="oneImage" alt="背景图片" />
    </div>
    
    <!-- 特殊效果按钮 -->
    <div class="effects-button" @click="toggleEffectsList">
      <span class="effects-icon">✨</span>
    </div>
    
    <!-- 特殊效果列表 -->
    <div v-if="showEffectsList" class="effects-list">
      <div class="effects-header">
        <h3>已解锁特殊效果</h3>
        <span class="close-button" @click="toggleEffectsList">×</span>
      </div>
      <div class="effects-content">
        <div v-if="dreamStore.unlockedEffects.length === 0" class="no-effects">
          尚未解锁任何特殊效果
        </div>
        <div v-else class="effect-item" v-for="(effect, index) in dreamStore.unlockedEffects" :key="index">
          {{ effect }}
        </div>
      </div>
    </div>
    
    <!-- 内容容器 -->
    <div class="content-container" :class="{ 'playing': isPlaying }">
      <!-- 标题和描述 -->
      <div class="dream-header">
        <h2 class="dream-title">{{ dreamStore.currentScene?.title || '加载中...' }}</h2>
        <p class="dream-description">{{ dreamStore.currentScene?.description || '请稍候...' }}</p>
      </div>
      
      <!-- 再次观看按钮 -->
      <div class="replay-button-container">
        <button class="replay-button">再次观看</button>
      </div>
      
      <!-- 选项列表 -->
      <div class="options-list">
        <div 
          v-for="option in dreamStore.currentScene?.options || []" 
          :key="option.id"
          class="option-item"
          @click="selectOption(option.id)"
        >
          <div class="option-text">{{ option.text }}</div>
        </div>
      </div>
    </div>
    
    <!-- 选项弹窗 -->
    <div v-if="dreamStore.showOptionDialog" class="option-dialog-overlay">
      <div class="option-dialog">
        <div class="dialog-content">
          <p>{{ dreamStore.currentOption?.content || '内容加载中...' }}</p>
          <div v-if="dreamStore.currentOption?.specialEffect" class="special-effect">
            <p class="effect-title">特殊效果：</p>
            <p class="effect-content">{{ dreamStore.currentOption.specialEffect }}</p>
          </div>
        </div>
        <div class="dialog-footer">
          <button class="continue-button" @click="continueToNextScene">继续</button>
        </div>
      </div>
    </div>
    
    <!-- 结局弹窗 -->
    <div v-if="dreamStore.activeEnding" class="ending-dialog-overlay">
      <div class="ending-dialog">
        <h2>结局：{{ dreamStore.endings.find(e => e.id === dreamStore.activeEnding)?.title }}</h2>
        <p>{{ dreamStore.endings.find(e => e.id === dreamStore.activeEnding)?.description }}</p>
        <div class="ending-footer">
          <p>3秒后返回首页...</p>
        </div>
      </div>
    </div>
    
    <!-- 底部导航栏 -->
    <BottomNav />
  </div>
</template>

<style scoped>
.dream-container {
  min-height: 100vh;
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  position: relative;
  background-color: #121212;
  color: white;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 1;
}

.background-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.effects-button {
  position: fixed;
  top: 15px;
  right: 15px;
  width: 40px;
  height: 40px;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.effects-icon {
  color: #f1c40f;
  font-size: 20px;
}

.effects-list {
  position: fixed;
  top: 65px;
  right: 15px;
  width: 280px;
  max-height: 70vh;
  background-color: rgba(0, 0, 0, 0.8);
  border-radius: 10px;
  z-index: 10;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
}

.effects-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background-color: rgba(231, 76, 60, 0.8);
}

.effects-header h3 {
  margin: 0;
  color: white;
  font-size: 16px;
}

.close-button {
  color: white;
  font-size: 20px;
  cursor: pointer;
}

.effects-content {
  padding: 15px;
  overflow-y: auto;
  max-height: calc(70vh - 50px);
}

.no-effects {
  color: #bbb;
  font-style: italic;
  text-align: center;
  padding: 20px 0;
}

.effect-item {
  color: #f1c40f;
  margin-bottom: 8px;
  padding: 8px;
  border-left: 2px solid #e74c3c;
  background-color: rgba(255, 255, 255, 0.1);
}

.content-container {
  position: absolute;
  bottom: 60px;
  left: 0;
  width: 100%;
  min-height: 33vh;
  max-height: 50vh;
  background-color: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(5px);
  display: flex;
  flex-direction: column;
  padding: 20px;
  transition: all 0.3s ease;
  z-index: 5;
  overflow-y: auto;
}

.content-container.playing {
  opacity: 0.7;
  transform: translateY(10px);
}

.dream-header {
  margin-bottom: 15px;
}

.dream-title {
  color: #ffffff;
  font-size: 24px;
  margin: 0 0 10px 0;
  font-weight: bold;
  line-height: 1.3;
}

.dream-description {
  color: #ffffff;
  font-size: 16px;
  line-height: 1.6;
  margin: 0;
  opacity: 0.9;
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 20px;
  padding-bottom: 10px;
}

.option-item {
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 15px;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
}

.option-item:hover {
  transform: translateY(-2px);
  background-color: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

.option-item:active {
  transform: translateY(0);
}

.option-text {
  color: #fff;
  font-size: 15px;
  line-height: 1.5;
}

.option-dialog-overlay {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 480px;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 20;
  padding: 20px;
  box-sizing: border-box;
}

.option-dialog {
  width: 90%;
  max-width: 500px;
  background-color: rgba(30, 30, 30, 0.95);
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.5);
  max-height: 80vh;
  overflow-y: auto;
}

.dialog-content {
  color: #ffffff;
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 25px;
}

.special-effect {
  margin-top: 20px;
  padding: 15px;
  background-color: rgba(231, 76, 60, 0.1);
  border-left: 3px solid #e74c3c;
  border-radius: 4px;
}

.effect-title {
  color: #e74c3c;
  font-weight: bold;
  margin: 0 0 8px 0;
}

.effect-content {
  margin: 0;
  color: #f1c40f;
  font-style: italic;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.continue-button {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.continue-button:hover {
  background-color: #c0392b;
  transform: translateY(-2px);
}

.continue-button:active {
  transform: translateY(0);
}

.back-button {
  position: absolute;
  top: 15px;
  left: 15px;
  width: 40px;
  height: 40px;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  transition: all 0.2s ease;
}

.back-button:hover {
  background-color: rgba(0, 0, 0, 0.8);
  transform: scale(1.1);
}

.back-button:active {
  transform: scale(1);
}

.back-icon {
  color: white;
  font-size: 20px;
}

.ending-dialog-overlay {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 480px;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  padding: 20px;
  box-sizing: border-box;
}

.ending-dialog {
  background-color: rgba(30, 30, 30, 0.95);
  border-radius: 15px;
  padding: 30px;
  width: 90%;
  max-width: 500px;
  text-align: center;
  color: white;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.ending-dialog h2 {
  color: #e74c3c;
  margin-bottom: 20px;
  font-size: 24px;
  line-height: 1.3;
}

.ending-dialog p {
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 25px;
  opacity: 0.9;
}

.ending-footer {
  margin-top: 30px;
  color: #666;
  font-style: italic;
}

.replay-button-container {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}

.replay-button {
  background-color: rgba(255, 255, 255, 0.1);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.replay-button:hover {
  background-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

.replay-button:active {
  transform: translateY(0);
}

@media (max-width: 768px) {
  .content-container {
    min-height: 40vh;
  }

  .option-dialog, .ending-dialog {
    width: 95%;
    padding: 20px;
  }

  .effects-list {
    width: calc(100% - 30px);
    right: 50%;
    transform: translateX(50%);
  }
}
</style> 
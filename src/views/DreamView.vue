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

// 调试信息
const debugInfo = ref({
  storyId,
  storeInitialized: !!dreamStore,
  currentSceneId: dreamStore.currentSceneId,
  hasCurrentScene: !!dreamStore.currentScene,
  sceneTitle: dreamStore.currentScene?.title || 'No title',
  sceneDescription: dreamStore.currentScene?.description || 'No description',
  optionsCount: dreamStore.currentScene?.options?.length || 0
});

// 处理选项选择
function selectOption(optionId: string) {
  const success = dreamStore.selectOption(optionId);
  console.log('选择选项结果:', success);
}

// 继续到下一个分镜
function continueToNextScene() {
  isPlaying.value = true;
  
  setTimeout(() => {
    const success = dreamStore.continueToNextScene();
    console.log('继续到下一个场景结果:', success);
    isPlaying.value = false;
    
    // 更新调试信息
    debugInfo.value = {
      storyId,
      storeInitialized: !!dreamStore,
      currentSceneId: dreamStore.currentSceneId,
      hasCurrentScene: !!dreamStore.currentScene,
      sceneTitle: dreamStore.currentScene?.title || 'No title',
      sceneDescription: dreamStore.currentScene?.description || 'No description',
      optionsCount: dreamStore.currentScene?.options?.length || 0
    };

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
  console.log('DreamView组件已挂载，故事ID:', storyId);
  if (!storyId) {
    router.push('/dream');
    return;
  }
  
  // 根据故事ID初始化场景
  dreamStore.initializeStory(storyId);
  console.log('当前分镜ID:', dreamStore.currentSceneId);
  console.log('当前分镜数据:', dreamStore.currentScene);
  
  // 更新调试信息
  debugInfo.value = {
    storyId,
    storeInitialized: !!dreamStore,
    currentSceneId: dreamStore.currentSceneId,
    hasCurrentScene: !!dreamStore.currentScene,
    sceneTitle: dreamStore.currentScene?.title || 'No title',
    sceneDescription: dreamStore.currentScene?.description || 'No description',
    optionsCount: dreamStore.currentScene?.options?.length || 0
  };
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
    
    <!-- 调试信息 -->
    <div class="debug-panel">
      <h3>调试信息</h3>
      <pre>{{ JSON.stringify(debugInfo, null, 2) }}</pre>
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
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: relative;
  overflow: hidden;
}

.background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.background-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.debug-panel {
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: rgba(0, 0, 0, 0.7);
  color: #11f011;
  padding: 10px;
  border-radius: 5px;
  font-size: 12px;
  max-width: 300px;
  overflow: auto;
  max-height: 300px;
  z-index: 999;
}

.debug-panel h3 {
  margin-top: 0;
  color: white;
}

.debug-panel pre {
  margin: 0;
  white-space: pre-wrap;
}

.effects-button {
  position: absolute;
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
  z-index: 5;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.effects-icon {
  color: #f1c40f;
  font-size: 20px;
}

.effects-list {
  position: absolute;
  top: 65px;
  right: 15px;
  width: 280px;
  max-height: 70vh;
  background-color: rgba(0, 0, 0, 0.8);
  border-radius: 10px;
  z-index: 5;
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
  max-height: 50vh;
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
  bottom: 48px; /* 为底部导航栏留出空间 */
  left: 0;
  width: 100%;
  height: 33vh; /* 占据屏幕下方1/3 */
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  display: flex;
  flex-direction: column;
  padding: 20px;
  transition: opacity 0.3s ease;
}

.content-container.playing {
  opacity: 0.7;
}

.dream-header {
  margin-bottom: 15px;
}

.dream-title {
  color: #ffffff;
  font-size: 20px;
  margin: 0 0 10px 0;
  font-weight: bold;
}

.dream-description {
  color: #ffffff;
  font-size: 16px;
  margin: 0;
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 15px;
  overflow-y: auto;
  flex: 1;
}

.option-item {
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  padding: 15px;
  cursor: pointer;
  transition: transform 0.2s ease, background-color 0.2s ease;
}

.option-item:hover {
  transform: translateY(-2px);
  background-color: #ffffff;
}

.option-text {
  color: #333;
  font-size: 15px;
}

.option-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.option-dialog {
  width: 80%;
  max-width: 500px;
  background-color: rgba(30, 30, 30, 0.9);
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.dialog-content {
  color: #ffffff;
  font-size: 16px;
  line-height: 1.5;
  margin-bottom: 20px;
}

.special-effect {
  margin-top: 20px;
  padding: 10px;
  background-color: rgba(231, 76, 60, 0.2);
  border-left: 3px solid #e74c3c;
  border-radius: 4px;
}

.effect-title {
  color: #e74c3c;
  font-weight: bold;
  margin: 0 0 5px 0;
}

.effect-content {
  margin: 0;
  color: #f1c40f;
  font-style: italic;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}

.continue-button {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s ease;
}

.continue-button:hover {
  background-color: #c0392b;
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
  z-index: 5;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.back-icon {
  color: white;
  font-size: 20px;
}

.ending-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.ending-dialog {
  background-color: rgba(30, 30, 30, 0.9);
  border-radius: 10px;
  padding: 30px;
  max-width: 80%;
  text-align: center;
  color: white;
}

.ending-dialog h2 {
  color: #e74c3c;
  margin-bottom: 20px;
}

.ending-footer {
  margin-top: 30px;
  color: #666;
  font-style: italic;
}
</style> 
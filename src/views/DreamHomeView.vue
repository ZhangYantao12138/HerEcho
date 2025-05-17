<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import BottomNav from '../components/BottomNav.vue';
import oneImage from '../assets/one.png';

const router = useRouter();

// 定义故事类型
interface DreamStory {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  isNew: boolean;
  isLocked?: boolean;
  progress: number;
  totalChapters?: number;
  completedChapters?: number;
  comingSoon?: boolean;
}

// 可用的叙梦故事
const dreamStories = ref<DreamStory[]>([
  {
    id: 'story1',
    title: '叙梦故事1',
    description: '古风故事',
    coverImage: oneImage,
    isNew: true,
    progress: 0,
    totalChapters: 4,
    completedChapters: 0
  },
  {
    id: 'story2',
    title: '叙梦故事2',
    description: '敬请期待...',
    coverImage: oneImage,
    isNew: false,
    isLocked: true,
    progress: 0,
    comingSoon: true
  },
  {
    id: 'story3',
    title: '叙梦故事3',
    description: '敬请期待...',
    coverImage: oneImage,
    isNew: false,
    isLocked: true,
    progress: 0,
    comingSoon: true
  }
]);

// 显示故事详情弹窗
const showStoryDetails = ref(false);
const selectedStory = ref<DreamStory | null>(null);

// 进入叙梦故事
function enterDreamStory(story: DreamStory) {
  if (story.isLocked) {
    // 处理锁定的故事
    showLockedMessage(story);
    return;
  }
  
  selectedStory.value = story;
  showStoryDetails.value = true;
}

// 开始游戏
function startGame() {
  if (!selectedStory.value) return;
  router.push(`/dream/scene/${selectedStory.value.id}`);
  showStoryDetails.value = false;
}

// 继续游戏
function continueGame() {
  if (!selectedStory.value) return;
  router.push(`/dream/scene/${selectedStory.value.id}`);
  showStoryDetails.value = false;
}

// 显示锁定信息
function showLockedMessage(story: DreamStory) {
  alert(`《${story.title}》尚未开放，敬请期待！`);
}

// 关闭详情弹窗
function closeDetails() {
  showStoryDetails.value = false;
}
</script>

<template>
  <div class="dream-home-container">
    <!-- 页面头部 -->
    <div class="dream-header">
      <div class="page-title">叙梦</div>
      <div class="header-icons">
        <span class="icon">🔍</span>
        <span class="icon">⚙️</span>
      </div>
    </div>
    
    <!-- 故事卡片列表 -->
    <div class="dream-stories-container">
      <div 
        v-for="story in dreamStories" 
        :key="story.id"
        class="story-card"
        :class="{ 'locked': story.isLocked }"
        @click="enterDreamStory(story)"
      >
        <div class="story-cover">
          <img :src="story.coverImage" alt="故事封面" />
          <div v-if="story.isNew" class="new-badge">新</div>
          <div v-if="story.isLocked" class="lock-overlay">
            <div class="lock-icon">🔒</div>
            <div v-if="story.comingSoon" class="coming-soon">即将上线</div>
          </div>
        </div>
        <div class="story-info">
          <h3 class="story-title">{{ story.title }}</h3>
          <p class="story-description">{{ story.description }}</p>
          <div v-if="!story.isLocked" class="story-progress">
            <div class="progress-text">
              <span>已完成 {{ story.completedChapters || 0 }}/{{ story.totalChapters || 0 }} 章节</span>
              <span>{{ story.progress }}%</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: story.progress + '%' }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 故事详情弹窗 -->
    <div v-if="showStoryDetails && selectedStory" class="story-details-overlay" @click.self="closeDetails">
      <div class="story-details-modal">
        <div class="modal-header">
          <h2>{{ selectedStory.title }}</h2>
          <span class="close-button" @click="closeDetails">×</span>
        </div>
        <div class="modal-cover">
          <img :src="selectedStory.coverImage" alt="故事封面" />
        </div>
        <div class="modal-content">
          <p class="modal-description">{{ selectedStory.description }}</p>
          <div class="chapter-info">
            <span class="chapter-count">共{{ selectedStory.totalChapters || 0 }}章</span>
            <span class="chapter-progress">已完成: {{ selectedStory.completedChapters || 0 }}/{{ selectedStory.totalChapters || 0 }}</span>
          </div>
          <div class="story-progress">
            <div class="progress-text">
              <span>完成度</span>
              <span>{{ selectedStory.progress }}%</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: selectedStory.progress + '%' }"></div>
            </div>
          </div>
        </div>
        <div class="modal-actions">
          <button v-if="selectedStory.progress > 0" class="continue-button" @click="continueGame">继续游戏</button>
          <button v-else class="start-button" @click="startGame">开始游戏</button>
          <button v-if="selectedStory.progress > 0" class="restart-button" @click="startGame">重新开始</button>
        </div>
      </div>
    </div>
    
    <!-- 底部导航栏 -->
    <BottomNav />
  </div>
</template>

<style scoped>
.dream-home-container {
  min-height: 100vh;
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
  background-color: #121212;
  color: white;
  padding-bottom: 60px;
  position: relative;
}

.dream-header {
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title {
  font-size: 24px;
  font-weight: bold;
}

.header-icons {
  display: flex;
  gap: 15px;
}

.icon {
  font-size: 20px;
  cursor: pointer;
}

.dream-stories-container {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.story-card {
  background-color: #1e1e1e;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.story-card:not(.locked):hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
}

.story-card.locked {
  opacity: 0.8;
}

.story-cover {
  height: 180px;
  position: relative;
  overflow: hidden;
}

.story-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.story-card:not(.locked):hover .story-cover img {
  transform: scale(1.05);
}

.new-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #e74c3c;
  color: white;
  font-size: 12px;
  font-weight: bold;
  padding: 4px 8px;
  border-radius: 12px;
  z-index: 2;
}

.lock-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 2;
}

.lock-icon {
  font-size: 40px;
  color: white;
  margin-bottom: 10px;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

.coming-soon {
  font-size: 16px;
  color: #f1c40f;
  font-weight: bold;
}

.story-info {
  padding: 15px;
}

.story-title {
  margin: 0 0 8px 0;
  font-size: 20px;
  color: white;
}

.story-description {
  margin: 0 0 15px 0;
  font-size: 14px;
  color: #bbb;
  line-height: 1.4;
}

.story-progress {
  margin-top: 10px;
}

.progress-text {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  font-size: 12px;
  color: #aaa;
}

.progress-bar {
  height: 4px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #e74c3c;
  border-radius: 2px;
}

/* 故事详情弹窗样式 */
.story-details-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.85);
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.story-details-modal {
  width: 90%;
  max-width: 400px;
  background-color: #1a1a1a;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: #222;
}

.modal-header h2 {
  margin: 0;
  font-size: 20px;
}

.close-button {
  font-size: 24px;
  cursor: pointer;
}

.modal-cover {
  height: 180px;
  overflow: hidden;
}

.modal-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.modal-content {
  padding: 20px;
  flex-grow: 1;
  overflow-y: auto;
}

.modal-description {
  font-size: 15px;
  line-height: 1.5;
  color: #ddd;
  margin-bottom: 20px;
}

.chapter-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  font-size: 14px;
  color: #bbb;
}

.modal-actions {
  display: flex;
  gap: 10px;
  padding: 15px 20px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.continue-button, .start-button, .restart-button {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.continue-button, .start-button {
  background-color: #e74c3c;
  color: white;
}

.continue-button:hover, .start-button:hover {
  background-color: #c0392b;
}

.restart-button {
  background-color: #333;
  color: white;
}

.restart-button:hover {
  background-color: #444;
}
</style> 
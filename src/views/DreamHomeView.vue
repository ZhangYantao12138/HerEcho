<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import BottomNav from '../components/BottomNav.vue';
import StoryDetailsModal from '../components/StoryDetailsModal.vue';
import DreamStoryList from '../components/DreamStoryList.vue';
import DreamHeader from '../components/DreamHeader.vue';
import type { DreamStory } from '../components/DreamStoryList.vue';
import oneImage from '../assets/one.png';

const router = useRouter();

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
    <!-- 页面头部组件 -->
    <DreamHeader title="叙梦" />
    
    <!-- 故事卡片列表组件 -->
    <DreamStoryList 
      :stories="dreamStories" 
      @select-story="enterDreamStory" 
    />
    
    <!-- 故事详情弹窗 -->
    <StoryDetailsModal
      :story="selectedStory"
      :show="showStoryDetails"
      @close="closeDetails"
      @start="startGame"
      @continue="continueGame"
    />
    
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
</style> 
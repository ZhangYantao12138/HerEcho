<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import BottomNav from '../components/BottomNav.vue';
import StoryDetailsModal from '../components/StoryDetailsModal.vue';
import DreamStoryList from '../components/DreamStoryList.vue';
import DreamHeader from '../components/DreamHeader.vue';
import type { DreamStory } from '../components/DreamStoryList.vue';
import { 
  getAllStories,
  showLockedMessage 
} from '../services/dreamStoryService';

const router = useRouter();

// 使用服务获取故事数据
const dreamStories = getAllStories();

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
  height: 100vh;
  width: 100%;
  max-width: 100%;
  overflow: hidden;
  background-color: #121212;
  color: white;
  position: relative;
  display: flex;
  flex-direction: column;
}
</style> 
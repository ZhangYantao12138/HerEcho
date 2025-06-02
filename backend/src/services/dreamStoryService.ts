import { ref } from 'vue';
import type { DreamStory } from '../components/DreamStoryList.vue';
import oneImage from '../assets/one.png';

// 可用的叙梦故事
export const dreamStories = ref<DreamStory[]>([
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

// 获取所有故事
export function getAllStories() {
  return dreamStories;
}

// 根据ID获取故事
export function getStoryById(id: string): DreamStory | undefined {
  return dreamStories.value.find(story => story.id === id);
}

// 更新故事进度
export function updateStoryProgress(id: string, progress: number): boolean {
  const story = getStoryById(id);
  if (story) {
    story.progress = progress;
    return true;
  }
  return false;
}

// 获取已解锁的故事
export function getUnlockedStories(): DreamStory[] {
  return dreamStories.value.filter(story => !story.isLocked);
}

// 显示锁定故事提示
export function showLockedMessage(story: DreamStory): void {
  alert(`《${story.title}》尚未开放，敬请期待！`);
} 
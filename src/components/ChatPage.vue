<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { RiArrowUpSLine } from '@remixicon/vue';
import ChatHeader from './ChatHeader.vue';
import ChatInput from './ChatInput.vue';
import BottomNav from './BottomNav.vue';

// 使用Vite的资源导入方式导入背景图片
import bgImageSrc from '../assets/bg.png';
const bgImage = bgImageSrc;

// 更新消息内容以匹配截图
const messages = ref([
  { 
    id: 1, 
    content: '(摇晃着盛满白葡萄酒的高脚杯，背对着你靠在桌前。听到脚步声后歪了歪唇，没有回头，只是抿了一口杯中的酒，随后轻轻地把酒杯放在桌子上，轻声笑了) "牵，你来了。"',
    isUser: false,
    hasAudio: true
  },
  { 
    id: 2, 
    content: '(伸手环住他的腰，将脸埋进他的后背)',
    isUser: true,
    hasAudio: false
  },
  { 
    id: 3, 
    content: '(轻笑一声，没有挣开你的怀抱，只是拿起酒杯又抿了一口酒，随后转身面对着你，微微俯身凑近你，温热的呼吸洒在你的脸上) "今天怎么这么粘人？"',
    isUser: false,
    hasAudio: true
  },
  { 
    id: 4, 
    content: '(伸手搭住他的膝子，凑近他的耳边轻声说) "我今天......有点想你。"',
    isUser: true,
    hasAudio: false
  },
  { 
    id: 5, 
    content: '(喉结滚动，轻笑着将你推开一些，与你四目相对，眼中带着笑意) "哦？是吗？我还以为你巴不得离我远点呢。"',
    isUser: false,
    hasAudio: true
  }
]);

// 情节信息
const sceneInfo = {
  title: '（番外）你发现羌青瓷接近你别有目的',
  stage: '初步相识',
  progress: 40
};

// 获取最新的两条消息用于收起状态显示
const latestUserMessage = computed(() => {
  const userMessages = messages.value.filter(m => m.isUser);
  return userMessages.length > 0 ? userMessages[userMessages.length - 1] : null;
});

const latestCharacterMessage = computed(() => {
  const characterMessages = messages.value.filter(m => !m.isUser);
  return characterMessages.length > 0 ? characterMessages[characterMessages.length - 1] : null;
});

const progress = ref(sceneInfo.progress);
const isCollapsed = ref(false); // 默认展开状态
const chatContainerRef = ref<HTMLElement | null>(null);

function sendMessage(text: string) {
  addUserMessage(text);
  setTimeout(() => {
    addCharacterResponse();
  }, 1000);
}

function selectOption(option: string) {
  addUserMessage(option);
  setTimeout(() => {
    addCharacterResponse();
  }, 1000);
}

function addUserMessage(text: string) {
  messages.value.push({
    id: Date.now(),
    content: text,
    isUser: true,
    hasAudio: false
  });
  updateProgress();
  scrollToBottom();
}

function addCharacterResponse() {
  const responses = [
    "嗯？怎么了？有心事吗？",
    "你今天看起来很不一样，告诉我发生了什么？",
    "看着你的眼睛，我能感觉到你有话想说...",
    "你靠得太近了，我的心跳有点加速...",
    "今天的你，格外吸引我..."
  ];
  
  const randomResponse = responses[Math.floor(Math.random() * responses.length)];
  
  messages.value.push({
    id: Date.now(),
    content: randomResponse,
    isUser: false,
    hasAudio: true
  });
  
  updateProgress();
  scrollToBottom();
}

function updateProgress() {
  if (progress.value < 95) {
    progress.value += 5;
  }
}

function scrollToBottom() {
  setTimeout(() => {
    if (chatContainerRef.value && !isCollapsed.value) {
      chatContainerRef.value.scrollTop = chatContainerRef.value.scrollHeight;
    }
  }, 100);
}

function toggleCollapse() {
  isCollapsed.value = !isCollapsed.value;
}

onMounted(() => {
  scrollToBottom();
});
</script>

<template>
  <div class="chat-page">
    <ChatHeader roleName="羌青瓷" />
    
    <div class="character-bg" v-if="isCollapsed">
      <img :src="bgImage" alt="羌青瓷" class="character-image" />
    </div>
    
    <!-- 情节信息区域 - 仅在展开状态显示 -->
    <div class="scene-container" v-if="!isCollapsed">
      <div class="scene-info">
        <div class="scene-text">情节：{{ sceneInfo.title }}</div>
        <div class="scene-stage">{{ sceneInfo.stage }}</div>
      </div>
      
      <div class="progress-section">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: `${progress}%` }"></div>
        </div>
      </div>
    </div>
    
    <div class="toggle-bar" @click="toggleCollapse">
      <span>{{ isCollapsed ? '展开对话' : '收起对话' }}</span>
      <div class="arrow-icon" :class="{ 'rotate': !isCollapsed }">
        <RiArrowUpSLine />
      </div>
    </div>
    
    <div 
      class="chat-container" 
      ref="chatContainerRef"
      :class="{ 'collapsed': isCollapsed }"
      v-if="!isCollapsed"
    >
      <div 
        v-for="message in messages" 
        :key="message.id"
        :class="['message-container', message.isUser ? 'user-message' : 'character-message']"
      >
        <div v-if="message.hasAudio && !message.isUser" class="audio-icon">🔊</div>
        <div class="message-bubble">
          <div class="message-content" v-html="message.content"></div>
        </div>
      </div>
    </div>
    
    <div class="collapsed-messages" v-if="isCollapsed">
      <div class="user-message" v-if="latestUserMessage">
        <div class="message-bubble">
          <div class="message-content" v-html="latestUserMessage.content"></div>
        </div>
      </div>
      <div class="character-message" v-if="latestCharacterMessage">
        <div v-if="latestCharacterMessage.hasAudio" class="audio-icon">🔊</div>
        <div class="message-bubble">
          <div class="message-content" v-html="latestCharacterMessage.content"></div>
        </div>
      </div>
    </div>
    
    <ChatInput 
      @send-message="sendMessage" 
      @select-option="selectOption" 
    />
    <BottomNav />
  </div>
</template>

<style scoped>
.chat-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #121a1a;
  padding-bottom: 110px; /* 为底部输入栏和导航栏留出空间 */
  box-sizing: border-box;
  position: relative;
}

.character-bg {
  flex: 1;
  position: relative;
  overflow: hidden;
  background-color: #1a2a2a;
}

.character-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

/* 情节信息样式 */
.scene-container {
  background-color: #1a2a2a;
  color: white;
  padding: 10px 15px;
  font-size: 14px;
}

.scene-info {
  margin-bottom: 8px;
}

.scene-text {
  font-weight: 500;
  margin-bottom: 5px;
}

.scene-stage {
  color: #cccccc;
  font-size: 12px;
}

.progress-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.progress-bar {
  flex: 1;
  height: 4px;
  background-color: #3a4a4a;
  border-radius: 2px;
  overflow: hidden;
  margin-right: 10px;
}

.progress-fill {
  height: 100%;
  background-color: #42b883;
  border-radius: 2px;
}

.toggle-bar {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 8px 15px;
  background-color: rgba(26, 42, 42, 0.8);
  color: #cccccc;
  font-size: 14px;
  cursor: pointer;
}

.arrow-icon {
  display: inline-flex;
  margin-left: 6px;
  font-size: 18px;
  transition: transform 0.3s ease;
}

.arrow-icon.rotate {
  transform: rotate(180deg);
}

.chat-container {
  width: 100%;
  background-color: rgba(26, 42, 42, 0.9);
  overflow-y: auto;
  padding: 10px 0;
  max-height: 60vh;
}

.collapsed-messages {
  width: 100%;
  background-color: rgba(26, 42, 42, 0.9);
  padding: 10px 15px;
}

.message-container, .user-message, .character-message {
  display: flex;
  margin: 8px 15px;
  align-items: flex-start;
}

.user-message {
  justify-content: flex-end;
}

.character-message {
  justify-content: flex-start;
}

.audio-icon {
  margin-right: 8px;
  color: #cccccc;
  font-size: 16px;
  margin-top: 5px;
}

.message-bubble {
  max-width: 80%;
  padding: 10px 12px;
  border-radius: 12px;
  word-break: break-word;
}

.user-message .message-bubble {
  background-color: #ffffff;
  color: #1a1a1a;
  border-top-right-radius: 0;
}

.character-message .message-bubble {
  background-color: #1a1a1a;
  color: #ffffff;
  border-top-left-radius: 0;
}

.message-content {
  font-size: 14px;
  line-height: 1.4;
}

/* 隐藏滚动条但保留功能 */
.chat-container::-webkit-scrollbar {
  width: 0px;
}
</style> 
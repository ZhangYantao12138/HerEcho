<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { RiArrowUpSLine, RiDeleteBin2Line, RiTestTubeLine } from '@remixicon/vue';
// import { Icon } from '@iconify/vue';
import ChatHeader from './ChatHeader.vue';
import ChatInput from './ChatInput.vue';
import BottomNav from './BottomNav.vue';
import { clearChatHistory, sendMessageToDeepSeek } from '../services/deepseekService';

// 使用Vite的资源导入方式导入背景图片
import bgImageSrc from '../assets/bg.png';
const bgImage = bgImageSrc;

// 更新消息内容以符合羌青瓷和程聿怀的角色扮演场景
const messages = ref([
  { 
    id: 1, 
    content: '(摇晃着盛满白葡萄酒的高脚杯，背对着你靠在桌前。听到脚步声后歪了歪唇，没有回头，只是抿了一口杯中的酒，随后轻轻地把酒杯放在桌子上，轻声笑了) "牵，你来了。"',
    isUser: false,
    hasAudio: true
  },
  { 
    id: 2, 
    content: '(伸手环住他的腰，将脸埋进他的后背) 羌青瓷，我来了。',
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
    content: '(伸手搭住他的肩膀，凑近他的耳边轻声说) "我今天......有点想你。"',
    isUser: true,
    hasAudio: false
  },
  { 
    id: 5, 
    content: '(喉结滚动，轻笑着将你推开一些，与你四目相对，眼中带着笑意) "哦？是吗？我还以为程医生巴不得离我远点呢。"',
    isUser: false,
    hasAudio: true
  }
]);

// 情节信息
const sceneInfo = {
  title: '（番外）你与羌青瓷重逢后的日常',
  stage: '相爱阶段',
  progress: 40
};

const progress = ref(sceneInfo.progress);
const isCollapsed = ref(false); // 默认展开状态
const chatContainerRef = ref<HTMLElement | null>(null);
const isKeyboardVisible = ref(false); // 添加键盘可见状态
const showClearConfirm = ref(false); // 添加清除确认对话框状态

// 添加测试API的功能
const isTestingApi = ref(false);

function sendMessage(text: string) {
  addUserMessage(text);
  // 不再需要这里的自动回复，因为会由AI响应事件处理
}

function selectOption(option: string) {
  addUserMessage(option);
  // 不再需要这里的自动回复，因为会由AI响应事件处理
}

function handleAIResponse(response: string) {
  messages.value.push({
    id: Date.now(),
    content: response,
    isUser: false,
    hasAudio: true
  });
  
  updateProgress();
  scrollToBottom();
}

function handleVoiceMessage(duration: number) {
  const voiceMessage = `(发送了一条 ${duration.toFixed(1)} 秒的语音消息)`;
  messages.value.push({
    id: Date.now(),
    content: voiceMessage,
    isUser: true,
    hasAudio: true
  });
  
  updateProgress();
  scrollToBottom();
  
  // 语音消息的AI响应会通过handleAIResponse处理，不需要在这里模拟
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

function handleKeyboardToggle(visible: boolean) {
  isKeyboardVisible.value = visible;
}

// 添加清除对话功能
function showClearDialog() {
  showClearConfirm.value = true;
}

function clearChat() {
  // 清除本地消息
  messages.value = [
    { 
      id: Date.now(), 
      content: '(优雅地站在窗边，看着窗外的风景，听到你进来的脚步声，转身微笑) "聿怀，你来了。有什么想和我聊的吗？"',
      isUser: false,
      hasAudio: true
    }
  ];
  
  // 清除DeepSeek API的对话历史
  clearChatHistory();
  
  // 重置进度
  progress.value = 10;
  
  // 隐藏确认对话框
  showClearConfirm.value = false;
  
  // 滚动到底部
  scrollToBottom();
}

function cancelClear() {
  showClearConfirm.value = false;
}

async function testApiConnection() {
  isTestingApi.value = true;
  try {
    const testMessage = "测试消息，请简短回复";
    const response = await sendMessageToDeepSeek(testMessage);
    
    // 显示测试成功消息
    messages.value.push({
      id: Date.now(),
      content: `<span style="color: #42b883;">API测试成功！</span><br>回复: ${response}`,
      isUser: false,
      hasAudio: false
    });
    
    // 清除测试消息的历史记录，避免污染正常对话
    clearChatHistory();
    
    scrollToBottom();
  } catch (error: any) {
    // 显示测试失败消息
    messages.value.push({
      id: Date.now(),
      content: `<span style="color: #e74c3c;">API测试失败！</span><br>错误: ${error?.message || '未知错误'}`,
      isUser: false,
      hasAudio: false
    });
    scrollToBottom();
  } finally {
    isTestingApi.value = false;
  }
}

onMounted(() => {
  scrollToBottom();
});
</script>

<template>
  <div class="chat-page">
    <ChatHeader roleName="羌青瓷" />
    
    <!-- 添加API测试按钮 -->
    <div class="test-api-button" @click="testApiConnection" v-if="!isTestingApi">
      <RiTestTubeLine />
      <span class="test-text">测试API</span>
    </div>
    <div class="test-api-button testing" v-else>
      <div class="loading-spinner"></div>
      <span class="test-text">测试中...</span>
    </div>
    
    <div 
      class="character-bg" 
      v-if="isCollapsed"
      :class="{ 'shrink': isKeyboardVisible }"
    >
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
    
    <div class="toggle-bar">
      <div class="clear-chat" @click="showClearDialog">
        <RiDeleteBin2Line />
      </div>
      <div class="toggle-section" @click="toggleCollapse">
        <span>{{ isCollapsed ? '展开对话' : '收起对话' }}</span>
        <div class="arrow-icon" :class="{ 'rotate': !isCollapsed }">
          <RiArrowUpSLine />
        </div>
      </div>
    </div>
    
    <div 
      class="chat-container" 
      ref="chatContainerRef"
      :class="{ 'collapsed': isCollapsed }"
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
    
    <ChatInput 
      @send-message="sendMessage" 
      @select-option="selectOption"
      @send-voice="handleVoiceMessage"
      @keyboard-toggle="handleKeyboardToggle"
      @ai-response="handleAIResponse"
      :isCollapsed="isCollapsed"
      :lastUserMessage="messages.length > 0 ? messages.filter(m => m.isUser).slice(-1)[0] || undefined : undefined"
      :lastCharacterMessage="messages.length > 0 ? messages.filter(m => !m.isUser).slice(-1)[0] || undefined : undefined"
    />
    <BottomNav />
    
    <!-- 清除对话确认对话框 -->
    <div class="confirm-dialog" v-if="showClearConfirm">
      <div class="confirm-content">
        <h3>清除对话</h3>
        <p>确定要清除所有对话记录吗？此操作不可恢复。</p>
        <div class="confirm-buttons">
          <button class="cancel-button" @click="cancelClear">取消</button>
          <button class="confirm-button" @click="clearChat">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chat-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #121a1a;
  padding-bottom: 48px; /* 底部导航栏高度 */
  box-sizing: border-box;
  position: relative;
  max-width: 480px;
  margin: 0 auto;
  width: 100%;
}

.character-bg {
  height: 50vh;
  position: relative;
  overflow: hidden;
  background-color: #1a2a2a;
  transition: height 0.3s ease;
}

.character-bg.shrink {
  height: 30vh;
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
  justify-content: space-between;
  padding: 8px 15px;
  background-color: rgba(26, 42, 42, 0.8);
  color: #cccccc;
  font-size: 14px;
  position: relative;
  z-index: 10;
}

.clear-chat {
  cursor: pointer;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  transition: color 0.2s ease;
}

.clear-chat:hover {
  color: #e74c3c;
}

.toggle-section {
  display: flex;
  align-items: center;
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
  transition: height 0.3s ease;
  position: relative;
  margin-bottom: 58px; /* 为输入框留出空间 */
}

.chat-container:not(.collapsed) {
  height: calc(100vh - 120px); /* 视口高度 - 其他元素高度 */
}

.chat-container.collapsed {
  height: calc(100vh - 60vh - 120px); /* 视口高度 - 背景图高度 - 其他元素高度 */
}

.message-container {
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

/* 确认对话框样式 */
.confirm-dialog {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.confirm-content {
  background-color: #1a2a2a;
  border-radius: 10px;
  padding: 20px;
  width: 80%;
  max-width: 300px;
}

.confirm-content h3 {
  margin-top: 0;
  color: #fff;
  font-size: 18px;
}

.confirm-content p {
  color: #ccc;
  font-size: 14px;
  margin-bottom: 20px;
}

.confirm-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.cancel-button, .confirm-button {
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  font-size: 14px;
  cursor: pointer;
}

.cancel-button {
  background-color: #333;
  color: #fff;
}

.confirm-button {
  background-color: #e74c3c;
  color: #fff;
}

/* 测试API按钮样式 */
.test-api-button {
  position: absolute;
  top: 15px;
  right: 70px;
  background-color: rgba(66, 184, 131, 0.2);
  color: #42b883;
  border: 1px solid #42b883;
  border-radius: 4px;
  padding: 5px 10px;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  z-index: 10;
  transition: all 0.2s ease;
}

.test-api-button:hover {
  background-color: rgba(66, 184, 131, 0.3);
}

.test-api-button.testing {
  background-color: rgba(66, 184, 131, 0.1);
  cursor: not-allowed;
}

.loading-spinner {
  width: 12px;
  height: 12px;
  border: 2px solid transparent;
  border-top-color: #42b883;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style> 
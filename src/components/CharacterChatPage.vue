<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { RiDeleteBin2Line } from '@remixicon/vue';
import ChatHeader from './ChatHeader.vue';
import ChatInput from './ChatInput.vue';
import BottomNav from './BottomNav.vue';
import { clearChatHistory, generateCharacterReply, setCurrentCharacter, generatePlayerReply } from '../services/chatService';
import { getDefaultCharacter, getCharacterById } from '../config/characters';
import type { Character, Message } from '../types/character';
import type { AIModel } from '../types/chat';
import { VIEWPOINT_MAPPING } from '../config/viewpointConfig';

// 获取路由参数
const route = useRoute();
const scriptId = route.params.scriptId as string;
const characterId = route.params.characterId as string;

// 验证路由参数
const router = useRouter();
if (!scriptId || !characterId) {
  router.push('/chat');
}

// 当前选中的角色
const currentCharacter = ref<Character>(getCharacterById(characterId) || getDefaultCharacter());

// 消息列表
const messages = ref<Message[]>([
  {
    id: Date.now(),
    content: `<div class="background-description">${currentCharacter.value.backgroundDescription}</div>`,
    isUser: false,
    hasAudio: false
  },
  ...currentCharacter.value.initialMessages
]);

// 添加计算属性获取最近的两条消息
const recentMessages = computed(() => {
  if (!isCollapsed.value) return messages.value;
  
  // 过滤掉背景描述消息
  const filteredMessages = messages.value.filter(msg => !msg.content.includes('background-description'));
  
  // 获取最近的两条消息
  return filteredMessages.slice(-2);
});

// 进度信息
const progress = ref(currentCharacter.value.sceneInfo.progress);
const isCollapsed = ref(false);
const chatContainerRef = ref<HTMLElement | null>(null);
const showClearConfirm = ref(false);

// 添加新的响应式变量
const isGenerating = ref(false);
const currentStreamingMessage = ref('');

// 监听路由参数变化
watch(() => route.params, async (newParams) => {
  const newCharacterId = newParams.characterId as string;
  const newCharacter = getCharacterById(newCharacterId);
  if (newCharacter) {
    // 设置新角色
    currentCharacter.value = newCharacter;
    setCurrentCharacter(newCharacter);
    
    // 清除历史记录
    clearChatHistory();
    
    // 重置消息列表
    messages.value = [
      {
        id: Date.now(),
        content: `<div class="background-description">${newCharacter.backgroundDescription}</div>`,
        isUser: false,
        hasAudio: false
      }
    ];
    
    // 检查是否有对应的玩家视角
    const viewpoint = VIEWPOINT_MAPPING.find(vp => vp.characterId === newCharacterId);
    if (viewpoint) {
      // 如果有玩家视角，生成玩家视角的初始消息
      try {
        const playerPrompt = `你现在是${newCharacter.name}，请用简短的话开始对话。`;
        const playerResponse = await generatePlayerReply(newCharacterId, playerPrompt);
        messages.value.push({
          id: Date.now(),
          content: playerResponse,
          isUser: false,
          hasAudio: true
        });
      } catch (error) {
        console.error('生成玩家视角消息失败:', error);
      }
    }
    
    // 添加角色的初始消息
    messages.value.push(...newCharacter.initialMessages);
    
    // 重置进度
    progress.value = newCharacter.sceneInfo.progress;
    scrollToBottom();
  }
}, { immediate: true });

// 监听角色变化
watch(() => currentCharacter.value, () => {
  clearChatHistory();
}, { deep: true });

// 修改handleAIResponse函数
async function handleAIResponse(response: string) {
  if (isGenerating.value) {
    // 如果是流式响应，直接更新当前消息
    currentStreamingMessage.value += response;
  } else {
    // 如果是完整响应，添加到消息列表
    messages.value.push({
      id: Date.now(),
      content: response,
      isUser: false,
      hasAudio: true
    });
  }
  
  updateProgress();
  scrollToBottom();
}

// 修改sendMessage函数
async function sendMessage(text: string) {
  // 添加用户消息
  addUserMessage(text);
  
  // 添加加载动画消息
  const loadingMessageId = Date.now();
  messages.value.push({
    id: loadingMessageId,
    content: '<div class="loading-dots"><span>.</span><span>.</span><span>.</span></div>',
    isUser: false,
    hasAudio: false
  });
  
  isGenerating.value = true;
  currentStreamingMessage.value = '';
  
  try {
    await generateCharacterReply(
      currentCharacter.value.id,
      text,
      (chunk) => {
        currentStreamingMessage.value += chunk;
        const lastMessage = messages.value[messages.value.length - 1];
        if (lastMessage) {
          lastMessage.content = currentStreamingMessage.value;
        }
      }
    );
  } catch (error) {
    console.error('获取AI回复失败:', error);
    // 移除加载消息
    messages.value = messages.value.filter(msg => msg.id !== loadingMessageId);
    // 添加错误消息
    messages.value.push({
      id: Date.now(),
      content: `(${currentCharacter.value.name}轻轻叹息) 我们的连接似乎出了些问题，能稍后再谈吗？`,
      isUser: false,
      hasAudio: true
    });
  } finally {
    isGenerating.value = false;
    currentStreamingMessage.value = '';
  }
  
  updateProgress();
  scrollToBottom();
}

function selectOption(option: string) {
  addUserMessage(option);
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

function showClearDialog() {
  showClearConfirm.value = true;
}

function clearChat() {
  messages.value = [
    {
      id: Date.now(),
      content: `<div class="background-description">${currentCharacter.value.backgroundDescription}</div>`,
      isUser: false,
      hasAudio: false
    },
    ...currentCharacter.value.initialMessages
  ];
  clearChatHistory();
  progress.value = currentCharacter.value.sceneInfo.progress;
  showClearConfirm.value = false;
  scrollToBottom();
}

function cancelClear() {
  showClearConfirm.value = false;
}

function handleModelChange(model: AIModel) {
  console.log(`模型已切换到: ${model}`);
}

async function testApiConnection() {
  try {
    const testMessage = "测试消息，请简短回复";
    const response = await generateCharacterReply(currentCharacter.value.id, testMessage);
    
    messages.value.push({
      id: Date.now(),
      content: `<span style="color: #42b883;">API测试成功！</span><br>回复: ${response}`,
      isUser: false,
      hasAudio: false
    });
    
    clearChatHistory();
    scrollToBottom();
  } catch (error: any) {
    messages.value.push({
      id: Date.now(),
      content: `<span style="color: #e74c3c;">API测试失败！</span><br>错误: ${error?.message || '未知错误'}`,
      isUser: false,
      hasAudio: false
    });
    scrollToBottom();
  }
}

onMounted(() => {
  scrollToBottom();
});
</script>

<template>
  <div class="chat-page">
    <!-- 固定背景图 -->
    <div class="background-fixed">
      <transition name="fade">
        <img 
          :key="currentCharacter.id"
          :src="currentCharacter.backgroundImage" 
          :alt="currentCharacter.name" 
        />
      </transition>
    </div>
    
    <div class="content-wrapper">
      <ChatHeader 
        :currentCharacter="currentCharacter"
        @test-api="testApiConnection"
        @model-changed="handleModelChange"
      />
      
      <!-- 情节信息区域 -->
      <div class="scene-container" v-if="!isCollapsed">
        <div class="scene-info">
          <div class="scene-text">情节：{{ currentCharacter.sceneInfo.title }}</div>
          <div class="scene-stage">{{ currentCharacter.sceneInfo.stage }}</div>
        </div>
        
        <div class="progress-section">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: `${progress}%` }"></div>
          </div>
        </div>
      </div>
      
      <!-- 聊天容器和控制栏的包装器 -->
      <div class="chat-wrapper" :class="{ 'collapsed': isCollapsed }">
        <div class="toggle-bar">
          <div class="clear-chat" @click="showClearDialog">
            <RiDeleteBin2Line />
          </div>
          <div class="toggle-section" @click="toggleCollapse">
            <span>{{ isCollapsed ? '展开对话' : '收起对话' }}</span>
            <div class="arrow-icon" :class="{ 'rotate': isCollapsed }">▼</div>
          </div>
        </div>
        
        <div 
          class="chat-container" 
          ref="chatContainerRef"
        >
          <div 
            v-for="message in (isCollapsed ? recentMessages : messages)" 
            :key="message.id"
            :class="[
              message.content.includes('background-description') 
                ? 'background-message-container' 
                : ['message-container', message.isUser ? 'user-message' : 'character-message']
            ]"
          >
            <template v-if="message.content.includes('background-description')">
              <div class="background-description">{{ currentCharacter.backgroundDescription }}</div>
            </template>
            <template v-else>
              <div v-if="message.hasAudio && !message.isUser" class="audio-icon">🔊</div>
              <div class="message-bubble">
                <div class="message-content" v-html="message.content"></div>
              </div>
            </template>
          </div>
        </div>
        
        <ChatInput 
          @send-message="sendMessage" 
          @select-option="selectOption"
          @send-voice="handleVoiceMessage"
          @ai-response="handleAIResponse"
          :isCollapsed="isCollapsed"
          :currentCharacter="currentCharacter"
          :lastUserMessage="messages.length > 0 ? messages.filter(m => m.isUser).slice(-1)[0] || undefined : undefined"
          :lastCharacterMessage="messages.length > 0 ? messages.filter(m => !m.isUser).slice(-1)[0] || undefined : undefined"
        />
      </div>
      
      <BottomNav />
    </div>
    
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
/* 基础布局 */
.chat-page {
  height: 100vh;
  position: relative;
  max-width: 480px;
  margin: 0 auto;
  width: 100%;
  overflow: hidden;
}

/* 背景相关 */
.background-fixed {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  height: 100vh;
  max-width: 480px;
  z-index: 1;
  pointer-events: none;
}

.background-fixed img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: opacity 0.3s ease;
}

/* 内容布局 */
.content-wrapper {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* 场景信息 */
.scene-container {
  background-color: rgba(26, 42, 42, 0.6);
  color: white;
  padding: 10px 15px;
  font-size: 14px;
  height: 80px;
  box-sizing: border-box;
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

/* 进度条 */
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

/* 聊天容器 */
.chat-wrapper {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  transition: height 0.3s ease;
  display: flex;
  flex-direction: column;
  background-color: rgba(18, 26, 26, 0.5);
}

.chat-wrapper:not(.collapsed) {
  height: calc(100% - 50px - 80px);
}

.chat-wrapper.collapsed {
  height: auto;
  min-height: 40%;
  max-height: 40%;
}

.chat-container {
  flex: 1;
  width: 100%;
  background-color: rgba(26, 42, 42, 0.3);
  overflow-y: auto;
  padding: 10px 0;
  margin-top: 36px;
  margin-bottom: 120px;
  transition: all 0.3s ease;
}

.chat-wrapper.collapsed .chat-container {
  margin-bottom: 80px;
}

/* 消息样式 */
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

.message-bubble {
  max-width: 80%;
  padding: 10px 12px;
  border-radius: 12px;
  word-break: break-word;
  backdrop-filter: blur(4px);
}

.user-message .message-bubble {
  background-color: rgba(255, 255, 255, 0.8);
  color: #1a1a1a;
  border-top-right-radius: 0;
}

.character-message .message-bubble {
  background-color: rgba(26, 26, 26, 0.7);
  color: #ffffff;
  border-top-left-radius: 0;
}

.message-content {
  font-size: 14px;
  line-height: 1.4;
}

/* 背景介绍 */
.background-message-container {
  display: flex;
  justify-content: center;
  margin: 16px 15px;
  width: calc(100% - 30px);
}

.background-description {
  font-size: 13px;
  color: #cccccc;
  line-height: 1.5;
  padding: 12px 16px;
  max-width: 85%;
  background-color: rgba(26, 26, 26, 0.4);
  border-radius: 12px;
  text-align: left;
  backdrop-filter: blur(4px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: inline-block;
  text-indent: 2em;
}

/* 控制栏 */
.toggle-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 15px;
  background-color: rgba(26, 42, 42, 0.3);
  color: #cccccc;
  font-size: 14px;
  position: absolute;
  width: 100%;
  box-sizing: border-box;
  z-index: 10;
  height: 36px;
}

.clear-chat {
  cursor: pointer;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  transition: color 0.2s ease;
  height: 20px;
}

.clear-chat:hover {
  color: #e74c3c;
}

.toggle-section {
  display: flex;
  align-items: center;
  cursor: pointer;
  height: 20px;
}

.arrow-icon {
  display: inline-flex;
  margin-left: 6px;
  font-size: 18px;
  transition: transform 0.3s ease;
  height: 20px;
  align-items: center;
}

.arrow-icon.rotate {
  transform: rotate(180deg);
}

/* 音频图标 */
.audio-icon {
  margin-right: 8px;
  color: #cccccc;
  font-size: 16px;
  margin-top: 5px;
}

/* 确认对话框 */
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

/* 动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 滚动条 */
.chat-container::-webkit-scrollbar {
  width: 0px;
}

.loading-dots {
  display: inline-flex;
  align-items: center;
  height: 24px;
}

.loading-dots span {
  animation: loading 1.4s infinite ease-in-out both;
  font-size: 24px;
  line-height: 1;
  margin: 0 2px;
}

.loading-dots span:nth-child(1) {
  animation-delay: -0.32s;
}

.loading-dots span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes loading {
  0%, 80%, 100% { 
    transform: scale(0);
  } 
  40% { 
    transform: scale(1.0);
  }
}
</style> 
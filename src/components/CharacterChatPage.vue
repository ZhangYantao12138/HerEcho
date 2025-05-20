<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { RiDeleteBin2Line } from '@remixicon/vue';
import ChatHeader from './ChatHeader.vue';
import ChatInput from './ChatInput.vue';
import BottomNav from './BottomNav.vue';
import { clearChatHistory, sendMessageToDeepSeek } from '../services/deepseekService';
import { getDefaultCharacter, getCharacterById } from '../config/characters';
import type { Character, Message } from '../types/character';

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
const messages = ref<Message[]>([...currentCharacter.value.initialMessages]);

// 进度信息
const progress = ref(currentCharacter.value.sceneInfo.progress);
const isCollapsed = ref(false);
const chatContainerRef = ref<HTMLElement | null>(null);
const showClearConfirm = ref(false);

// 监听路由参数变化
watch(() => route.params, (newParams) => {
  const newCharacterId = newParams.characterId as string;
  const newCharacter = getCharacterById(newCharacterId);
  if (newCharacter) {
    currentCharacter.value = newCharacter;
    messages.value = [...newCharacter.initialMessages];
    progress.value = newCharacter.sceneInfo.progress;
    scrollToBottom();
  }
}, { immediate: true });

// 监听角色变化
watch(() => currentCharacter.value, (newCharacter) => {
  clearChatHistory();
}, { deep: true });

function sendMessage(text: string) {
  addUserMessage(text);
}

function selectOption(option: string) {
  addUserMessage(option);
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
  messages.value = [...currentCharacter.value.initialMessages];
  clearChatHistory();
  progress.value = currentCharacter.value.sceneInfo.progress;
  showClearConfirm.value = false;
  scrollToBottom();
}

function cancelClear() {
  showClearConfirm.value = false;
}

async function testApiConnection() {
  try {
    const testMessage = "测试消息，请简短回复";
    const response = await sendMessageToDeepSeek(testMessage);
    
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
          @ai-response="handleAIResponse"
          :isCollapsed="isCollapsed"
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
.chat-page {
  height: 100vh;
  position: relative;
  max-width: 480px;
  margin: 0 auto;
  width: 100%;
  overflow: hidden;
}

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

.content-wrapper {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
}

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
  height: 40%;
}

.chat-container {
  flex: 1;
  width: 100%;
  background-color: rgba(26, 42, 42, 0.3);
  overflow-y: auto;
  padding: 10px 0;
  margin-top: 36px;
  margin-bottom: 120px;
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

.chat-container::-webkit-scrollbar {
  width: 0px;
}

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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style> 
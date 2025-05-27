<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
// 直接创建简单的头部组件，不使用复杂的ChatHeader
import { customCharacterService } from '../services/customCharacterService';
import type { CustomCharacterSession } from '../services/customCharacterService';

const route = useRoute();
const router = useRouter();

const sessionId = route.params.sessionId as string;
const session = ref<CustomCharacterSession | null>(null);
const messages = ref<any[]>([]);
const isLoading = ref(false);
const chatContainer = ref<HTMLElement>();
const inputText = ref('');

// 加载会话数据
onMounted(async () => {
  loadSession();
});

// 监听路由参数变化
watch(() => route.params.sessionId, () => {
  if (route.params.sessionId) {
    loadSession();
  }
});

// 加载会话
function loadSession() {
  const loadedSession = customCharacterService.getSession(sessionId);
  if (!loadedSession) {
    alert('会话不存在或已过期');
    router.push('/chat');
    return;
  }
  
  session.value = loadedSession;
  messages.value = loadedSession.messages.map(msg => ({
    id: msg.id,
    content: msg.content,
    sender: msg.sender,
    timestamp: msg.timestamp,
    isUser: msg.sender === 'user'
  }));
  
  nextTick(() => {
    scrollToBottom();
  });
}

// 发送消息
async function sendMessage(content: string) {
  if (!session.value || isLoading.value) return;
  
  isLoading.value = true;
  
  try {
    const response = await customCharacterService.sendMessage(sessionId, content);
    
    // 重新加载会话以获取最新消息
    loadSession();
    
    nextTick(() => {
      scrollToBottom();
    });
  } catch (error) {
    console.error('发送消息失败:', error);
    alert('发送消息失败，请重试');
  } finally {
    isLoading.value = false;
  }
}

// 滚动到底部
function scrollToBottom() {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
}

// 返回剧本选择页面
function goBack() {
  router.push('/chat');
}

// 格式化时间
function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('zh-CN', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
}

// 处理发送消息
function handleSend() {
  if (inputText.value.trim()) {
    sendMessage(inputText.value.trim());
    inputText.value = '';
  }
}

// 处理键盘事件
function handleKeyDown(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    handleSend();
  }
}
</script>

<template>
  <div class="custom-chat-page">
    <!-- 羌青瓷背景 -->
    <div class="chat-background"></div>
    
    <!-- 简化的聊天头部 -->
    <div v-if="session" class="simple-chat-header">
      <button class="back-button" @click="goBack">
        ←
      </button>
      <div class="header-info">
        <div class="character-name">{{ session.characterName }}</div>
        <div class="script-title">自建角色</div>
      </div>
    </div>
    
    <!-- 聊天消息区域 -->
    <div ref="chatContainer" class="chat-container">
      <div class="messages-wrapper">
        <!-- 角色介绍卡片 -->
        <div v-if="session" class="character-intro-card">
          <div class="intro-header">
            <div class="character-avatar">🎭</div>
            <div class="character-info">
              <div class="character-name">{{ session.characterName }}</div>
              <div class="character-type">自建角色</div>
            </div>
          </div>
          <div class="character-setting">
            <div class="setting-title">角色设定</div>
            <div class="setting-content">{{ session.characterSetting }}</div>
          </div>
          <div class="intro-footer">
            <div class="tip-text">💡 开始和你的专属角色对话吧！</div>
          </div>
        </div>
        
                 <!-- 聊天消息 -->
         <div v-for="message in messages" :key="message.id" class="message-item">
           <div class="custom-message" :class="{ 'user-message': message.isUser, 'character-message': !message.isUser }">
             <div class="message-bubble">
               <div class="message-content">{{ message.content }}</div>
               <div class="message-time">{{ formatTime(message.timestamp) }}</div>
             </div>
           </div>
         </div>
        
        <!-- 加载指示器 -->
        <div v-if="isLoading" class="loading-indicator">
          <div class="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div class="loading-text">{{ session?.characterName }}正在思考中...</div>
        </div>
      </div>
    </div>
    
    <!-- 简化的聊天输入框 -->
    <div class="simple-chat-input">
      <div class="input-container">
        <textarea
          v-model="inputText"
          @keydown="handleKeyDown"
          :disabled="isLoading"
          placeholder="输入消息与角色对话..."
          class="message-input"
          rows="1"
        ></textarea>
        <button 
          @click="handleSend"
          :disabled="isLoading || !inputText.trim()"
          class="send-button"
        >
          {{ isLoading ? '发送中...' : '发送' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-chat-page {
  position: relative;
  height: 100vh;
  overflow: hidden;
  background-color: #121212;
}

.chat-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 25%, #2c3e50 50%, #34495e 75%, #2c3e50 100%);
  background-size: 400% 400%;
  animation: gradientShift 15s ease infinite;
  opacity: 0.3;
  z-index: -1;
}

@keyframes gradientShift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.chat-container {
  height: calc(100vh - 120px);
  overflow-y: auto;
  padding: 20px;
  position: relative;
  z-index: 1;
}

.messages-wrapper {
  max-width: 600px;
  margin: 0 auto;
  padding-bottom: 20px;
}

.character-intro-card {
  background: rgba(30, 30, 30, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  backdrop-filter: blur(10px);
}

.intro-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.character-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(45deg, #3498db, #2ecc71);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-right: 12px;
}

.character-info {
  flex: 1;
}

.character-name {
  font-size: 18px;
  font-weight: bold;
  color: white;
  margin-bottom: 4px;
}

.character-type {
  font-size: 12px;
  color: #3498db;
  background: rgba(52, 152, 219, 0.2);
  padding: 2px 8px;
  border-radius: 12px;
  display: inline-block;
}

.character-setting {
  margin-bottom: 16px;
}

.setting-title {
  font-size: 14px;
  font-weight: 500;
  color: #bbb;
  margin-bottom: 8px;
}

.setting-content {
  font-size: 13px;
  color: #ddd;
  line-height: 1.5;
  background: rgba(255, 255, 255, 0.05);
  padding: 12px;
  border-radius: 8px;
  white-space: pre-wrap;
  max-height: 120px;
  overflow-y: auto;
}

.intro-footer {
  text-align: center;
}

.tip-text {
  font-size: 14px;
  color: #3498db;
  font-weight: 500;
}

.message-item {
  margin-bottom: 16px;
}

.loading-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  gap: 12px;
}

.loading-dots {
  display: flex;
  gap: 4px;
}

.loading-dots span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #3498db;
  animation: bounce 1.4s infinite both;
}

.loading-dots span:nth-child(1) {
  animation-delay: -0.32s;
}

.loading-dots span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

.loading-text {
  font-size: 14px;
  color: #bbb;
}

/* 滚动条样式 */
.chat-container::-webkit-scrollbar {
  width: 6px;
}

.chat-container::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
}

.chat-container::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.chat-container::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

.setting-content::-webkit-scrollbar {
  width: 4px;
}

.setting-content::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

.setting-content::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
}

/* 简化的聊天头部样式 */
.simple-chat-header {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  background-color: rgba(17, 24, 25, 0.9);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.back-button {
  background: none;
  border: none;
  color: #cccccc;
  cursor: pointer;
  padding: 8px;
  margin-right: 16px;
  font-size: 18px;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.back-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.header-info {
  flex: 1;
}

.character-name {
  font-size: 16px;
  font-weight: bold;
  color: white;
  margin-bottom: 2px;
}

.script-title {
  font-size: 12px;
  color: #3498db;
}

/* 自定义消息样式 */
.custom-message {
  display: flex;
  margin-bottom: 16px;
}

.custom-message.user-message {
  justify-content: flex-end;
}

.custom-message.character-message {
  justify-content: flex-start;
}

.message-bubble {
  max-width: 80%;
  padding: 12px 16px;
  border-radius: 16px;
  position: relative;
}

.user-message .message-bubble {
  background: linear-gradient(135deg, #3498db, #2ecc71);
  color: white;
  border-bottom-right-radius: 4px;
}

.character-message .message-bubble {
  background: rgba(30, 30, 30, 0.9);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-bottom-left-radius: 4px;
}

.message-content {
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 4px;
}

.message-time {
  font-size: 11px;
  opacity: 0.7;
  text-align: right;
}

/* 简化的聊天输入框样式 */
.simple-chat-input {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(17, 24, 25, 0.95);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 16px 20px;
  z-index: 100;
}

.input-container {
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  gap: 12px;
  align-items: flex-end;
}

.message-input {
  flex: 1;
  background: rgba(30, 30, 30, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 12px 16px;
  color: white;
  font-size: 14px;
  resize: none;
  min-height: 20px;
  max-height: 120px;
  transition: border-color 0.2s ease;
}

.message-input:focus {
  outline: none;
  border-color: #3498db;
}

.message-input::placeholder {
  color: #888;
}

.send-button {
  background: linear-gradient(45deg, #3498db, #2ecc71);
  color: white;
  border: none;
  border-radius: 20px;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.send-button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
}

.send-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}
</style> 
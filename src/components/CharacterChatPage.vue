<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { RiDeleteBin2Line } from '@remixicon/vue';
import ChatHeader from './ChatHeader.vue';
import ChatInput from './ChatInput.vue';
import BottomNav from './BottomNav.vue';
import { 
  clearChatHistory, 
  generateCharacterReply, 
  setCurrentCharacter, 
  generatePlayerReply,
  toggleStoryMode,
  advanceStory,
  updateProgress as updateStoryProgress,
  storyState
} from '../services/chatService';
import { getDefaultCharacter, getCharacterById } from '../config/characters';
import type { Character, Message } from '../types/character';
import type { AIModel } from '../types/chat';
import { VIEWPOINT_MAPPING } from '../config/viewpointConfig';
import { TTSService } from '../services/TTSService';

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

// 添加背景类型状态
const isDynamicBackground = ref(true);

// 计算属性：判断当前角色是否有动态背景
const hasDynamicBackground = computed(() => {
  return currentCharacter.value.backgroundImage.endsWith('.mp4');
});

// 计算属性：获取当前背景
const currentBackground = computed(() => {
  if (isDynamicBackground.value && hasDynamicBackground.value) {
    return currentCharacter.value.backgroundImage;
  }
  // 如果是静态背景，使用角色的头像作为背景
  return currentCharacter.value.avatar;
});

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
const currentAudioData = ref<Map<number, ArrayBuffer>>(new Map());
const isPlaying = ref<Map<number, boolean>>(new Map());
const autoPlayTTS = ref(localStorage.getItem('autoPlayTTS') === 'true');
const isGeneratingAudio = ref<Map<number, boolean>>(new Map());

// 添加剧情模式相关的状态
const isStoryMode = ref(currentCharacter.value.storyMode.enabled);
const canAdvanceStory = ref(false);

// 监听storyState变化
watch(() => storyState, (newState) => {
  isStoryMode.value = newState.isStoryMode;
  canAdvanceStory.value = newState.canAdvance;
}, { deep: true });

// 监听角色变化时更新剧情模式状态
watch(() => currentCharacter.value, (newCharacter) => {
  isStoryMode.value = newCharacter.storyMode.enabled;
  canAdvanceStory.value = storyState.canAdvance;
}, { deep: true });

// 添加autoPlayTTS的监听器
watch(autoPlayTTS, (newValue) => {
  console.log('[Chat] autoPlayTTS状态改变:', newValue);
  localStorage.setItem('autoPlayTTS', newValue.toString());
});

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
    
    // 重置消息列表，显示背景和初始消息
    messages.value = [
      {
        id: Date.now(),
        content: `<div class="background-description">${newCharacter.backgroundDescription}</div>`,
        isUser: false,
        hasAudio: false
      },
      ...newCharacter.initialMessages
    ];
    
    // 重置进度
    progress.value = newCharacter.sceneInfo.progress;
    scrollToBottom();
  }
}, { immediate: true });

// 监听角色变化
watch(() => currentCharacter.value, () => {
  clearChatHistory();
  isDynamicBackground.value = hasDynamicBackground.value;
}, { deep: true });

// 修改handleAIResponse函数
async function handleAIResponse(response: string) {
  console.log('[Chat] 收到AI响应:', response);
  
  // 添加消息到列表
  const messageId = Date.now();
  messages.value.push({
    id: messageId,
    content: response,
    isUser: false,
    hasAudio: true
  });

  // 生成TTS音频
  try {
    console.log('[Chat] 开始生成TTS音频, messageId:', messageId);
    const ttsService = TTSService.getInstance();
    const audioData = await ttsService.generateAudio(response, currentCharacter.value);
    
    if (!audioData || audioData.byteLength === 0) {
      throw new Error('生成的音频数据为空');
    }
    
    console.log('[Chat] TTS音频生成成功:', {
      messageId,
      audioDataSize: audioData.byteLength,
      hasAudioData: !!audioData
    });
    
    // 确保在设置数据之前先初始化Map
    if (!currentAudioData.value) {
      currentAudioData.value = new Map();
    }
    if (!isPlaying.value) {
      isPlaying.value = new Map();
    }
    
    // 缓存音频数据
    currentAudioData.value.set(messageId, audioData);
    isPlaying.value.set(messageId, false);
    
    // 如果启用了自动播放，则自动播放音频
    if (autoPlayTTS.value) {
      console.log('[Chat] 自动播放音频, messageId:', messageId);
      // 停止其他正在播放的音频
      for (const [id, playing] of isPlaying.value.entries()) {
        if (playing) {
          console.log('[Chat] 停止其他音频, messageId:', id);
          ttsService.stopAudio();
          isPlaying.value.set(id, false);
        }
      }
      
      // 设置播放结束回调
      ttsService.onAudioEnded(() => {
        console.log('[Chat] 音频播放结束, messageId:', messageId);
        isPlaying.value.set(messageId, false);
      });
      
      // 开始播放
      await ttsService.playAudio(audioData);
      isPlaying.value.set(messageId, true);
    }
  } catch (error) {
    console.error('[Chat] TTS生成失败:', error);
    messages.value.push({
      id: Date.now(),
      content: '语音生成失败，请重试',
      isUser: false,
      hasAudio: false
    });
  }
}

// 修改音频播放控制函数
async function toggleAudioPlayback(messageId: number) {
  const message = messages.value.find(msg => msg.id === messageId);
  if (!message) {
    console.warn('[Chat] 未找到消息:', messageId);
    return;
  }

  // 检查消息是否还在生成中
  if (isGenerating.value && messageId === messages.value[messages.value.length - 1].id) {
    return;
  }

  const audioData = currentAudioData.value.get(messageId);
  if (!audioData) {
    console.warn('[Chat] 未找到音频数据:', messageId);
    return;
  }

  const ttsService = TTSService.getInstance();
  const isCurrentlyPlaying = isPlaying.value.get(messageId);

  try {
    if (isCurrentlyPlaying) {
      console.log('[Chat] 停止播放音频, messageId:', messageId);
      ttsService.stopAudio();
      isPlaying.value.set(messageId, false);
    } else {
      // 停止其他正在播放的音频
      for (const [id, playing] of isPlaying.value.entries()) {
        if (playing && id !== messageId) {
          console.log('[Chat] 停止其他音频, messageId:', id);
          ttsService.stopAudio();
          isPlaying.value.set(id, false);
        }
      }

      console.log('[Chat] 开始播放音频, messageId:', messageId);
      // 设置播放结束回调
      ttsService.onAudioEnded(() => {
        console.log('[Chat] 音频播放结束, messageId:', messageId);
        isPlaying.value.set(messageId, false);
      });
      
      // 开始播放
      await ttsService.playAudio(audioData);
      isPlaying.value.set(messageId, true);
    }
  } catch (error) {
    console.error('[Chat] 音频播放失败:', error);
    isPlaying.value.set(messageId, false);
  }
}

// 修改sendMessage函数
const emit = defineEmits(['stream-complete']);

async function sendMessage(text: string) {
  // 添加用户消息
  addUserMessage(text);
  
  // 添加加载动画消息
  const loadingMessageId = Date.now();
  messages.value.push({
    id: loadingMessageId,
    content: '<div class="loading-dots"><span>.</span><span>.</span><span>.</span></div>',
    isUser: false,
    hasAudio: true
  });
  
  isGenerating.value = true;
  currentStreamingMessage.value = '';
  isGeneratingAudio.value.set(loadingMessageId, true);
  
  try {
    console.log('[Chat] 开始生成AI回复, autoPlayTTS:', autoPlayTTS.value);
    
    const response = await generateCharacterReply(
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

    // 消息生成完成后，生成TTS音频
    console.log('[Chat] AI回复生成完成，准备生成TTS音频');
    
    try {
      const ttsService = TTSService.getInstance();
      console.log('[Chat] 开始生成TTS音频, messageId:', loadingMessageId);
      
      const audioData = await ttsService.generateAudio(currentStreamingMessage.value, currentCharacter.value);
      
      if (!audioData || audioData.byteLength === 0) {
        throw new Error('生成的音频数据为空');
      }
      
      console.log('[Chat] TTS音频生成成功:', {
        messageId: loadingMessageId,
        audioDataSize: audioData.byteLength,
        hasAudioData: !!audioData
      });
      
      // 确保在设置数据之前先初始化Map
      if (!currentAudioData.value) {
        currentAudioData.value = new Map();
      }
      if (!isPlaying.value) {
        isPlaying.value = new Map();
      }
      
      currentAudioData.value.set(loadingMessageId, audioData);
      isPlaying.value.set(loadingMessageId, false);
      
      // 如果启用了自动播放，则自动播放音频
      if (autoPlayTTS.value) {
        console.log('[Chat] 自动播放音频, messageId:', loadingMessageId);
        // 停止其他正在播放的音频
        for (const [id, playing] of isPlaying.value.entries()) {
          if (playing) {
            console.log('[Chat] 停止其他音频, messageId:', id);
            ttsService.stopAudio();
            isPlaying.value.set(id, false);
          }
        }
        
        // 设置播放结束回调
        ttsService.onAudioEnded(() => {
          console.log('[Chat] 音频播放结束, messageId:', loadingMessageId);
          isPlaying.value.set(loadingMessageId, false);
        });
        
        // 开始播放
        await ttsService.playAudio(audioData);
        isPlaying.value.set(loadingMessageId, true);
      } else {
        console.log('[Chat] 自动播放已禁用，跳过音频播放');
      }
    } catch (error) {
      console.error('[Chat] TTS生成失败:', error);
      messages.value.push({
        id: Date.now(),
        content: '语音生成失败，请重试',
        isUser: false,
        hasAudio: false
      });
    }
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
    isGeneratingAudio.value.set(loadingMessageId, false);
  }
  
  updateProgress();
  scrollToBottom();
}

function selectOption(option: string) {
  sendMessage(option);
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
  if (isStoryMode.value) {
    updateStoryProgress();
    canAdvanceStory.value = storyState.canAdvance;
  } else {
    if (progress.value < 95) {
      progress.value += 5;
    }
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

function handleAutoPlayChange(value: boolean) {
  console.log('[Chat] 自动播放设置改变:', value);
  autoPlayTTS.value = value;
  localStorage.setItem('autoPlayTTS', value.toString());
  
  // 如果启用了自动播放，尝试播放当前消息的音频
  if (value && messages.value.length > 0) {
    const lastMessage = messages.value[messages.value.length - 1];
    if (!lastMessage.isUser && lastMessage.hasAudio) {
      const audioData = currentAudioData.value.get(lastMessage.id);
      if (audioData) {
        console.log('[Chat] 自动播放当前消息音频');
        const ttsService = TTSService.getInstance();
        ttsService.playAudio(audioData).then(() => {
          isPlaying.value.set(lastMessage.id, true);
        }).catch(error => {
          console.error('[Chat] 自动播放音频失败:', error);
        });
      }
    }
  }
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

// 切换背景类型
function toggleBackgroundType() {
  if (hasDynamicBackground.value) {
    isDynamicBackground.value = !isDynamicBackground.value;
  }
}

// 添加剧情模式切换处理函数
function handleStoryModeChange(value: boolean) {
  console.log('[Chat] 剧情模式设置改变:', value);
  isStoryMode.value = value;
  toggleStoryMode(value);
}

// 添加剧情推进处理函数
function handleAdvanceStory() {
  if (canAdvanceStory.value) {
    advanceStory();
    canAdvanceStory.value = false;
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
        <template v-if="isDynamicBackground && hasDynamicBackground">
          <video 
            :key="currentCharacter.id"
            :src="currentBackground" 
            autoplay
            loop
            muted
            playsinline
            class="background-video"
            preload="auto"
          />
        </template>
        <template v-else>
          <img 
            :key="currentCharacter.id"
            :src="currentBackground"
            class="background-image"
          />
        </template>
      </transition>
    </div>
    
    <div class="content-wrapper">
      <ChatHeader 
        :current-character="currentCharacter"
        :is-collapsed="isCollapsed"
        :has-dynamic-background="hasDynamicBackground"
        :is-dynamic-background="isDynamicBackground"
        :autoPlayTTS="autoPlayTTS"
        :is-story-mode="isStoryMode"
        @toggle-collapse="toggleCollapse"
        @toggle-background="toggleBackgroundType"
        @test-api="testApiConnection"
        @model-changed="handleModelChange"
        @auto-play-changed="handleAutoPlayChange"
        @story-mode-changed="handleStoryModeChange"
      />
      
      <!-- 修改情节信息区域 -->
      <div class="scene-container" v-if="!isCollapsed">
        <div class="scene-info">
          <div class="scene-text">
            {{ isStoryMode ? 
              `剧情：${currentCharacter.storyMode.stages[currentCharacter.storyMode.currentStage].stageName}` :
              `剧情：${currentCharacter.storyMode.stages[0].stageName}`
            }}
          </div>
          <div class="scene-stage">
            {{ isStoryMode ?
              `阶段：${currentCharacter.storyMode.currentStage + 1}/${currentCharacter.storyMode.stages.length}` :
              '日常对话'
            }}
          </div>
        </div>
        
        <div class="progress-section">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: `${isStoryMode ? 
              (storyState.currentProgress / currentCharacter.storyMode.stages[currentCharacter.storyMode.currentStage].requiredProgress * 100) : 
              100}%` }"></div>
          </div>
          <button 
            v-if="isStoryMode && canAdvanceStory" 
            class="advance-button"
            @click="handleAdvanceStory"
          >
            推进剧情
          </button>
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
              <div v-if="!message.isUser" class="character-avatar">
                <img :src="currentCharacter.avatar" :alt="currentCharacter.name" />
              </div>
              <div class="message-bubble">
                <div v-if="message.hasAudio && !message.isUser" 
                     class="audio-icon" 
                     @click="toggleAudioPlayback(message.id)"
                     :class="{ 
                       'playing': isPlaying.get(message.id),
                       'generating': isGeneratingAudio.get(message.id)
                     }">
                  <svg v-if="isGeneratingAudio.get(message.id)" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
                    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"/>
                    <path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
                    <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
                    <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" />
                  </svg>
                </div>
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
          :is-streaming="isGenerating"
        />
      </div>
      
      <div class="nav-placeholder"></div>
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
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
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
  overflow: hidden;
}

.background-fixed .background-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: opacity 0.3s ease;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.background-fixed .background-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: opacity 0.3s ease;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

/* 内容布局 */
.content-wrapper {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
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
  -webkit-overflow-scrolling: touch; /* 添加弹性滚动 */
  overscroll-behavior: contain; /* 防止滚动传播 */
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

.character-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 8px;
  flex-shrink: 0;
}

.character-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.message-bubble {
  max-width: 80%;
  padding: 10px 12px;
  border-radius: 12px;
  word-break: break-word;
  backdrop-filter: blur(4px);
  position: relative;
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
  position: absolute;
  top: -8px;
  left: -8px;
  width: 20px;
  height: 20px;
  background-color: rgba(26, 26, 26, 0.8);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #cccccc;
  cursor: pointer;
  transition: all 0.2s ease;
}

.audio-icon:hover {
  background-color: rgba(26, 26, 26, 0.9);
  color: #ffffff;
}

.audio-icon.playing {
  background-color: rgba(66, 184, 131, 0.8);
  color: #ffffff;
  animation: pulse 1.5s infinite;
}

.audio-icon.generating {
  background-color: rgba(66, 184, 131, 0.4);
  color: #ffffff;
  cursor: not-allowed;
  animation: spin 1s linear infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
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

.nav-placeholder {
  height: 48px;
  background-color: #000000;
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 30;
}

/* 添加推进按钮样式 */
.advance-button {
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.advance-button:hover {
  background-color: #3aa876;
}

.advance-button:disabled {
  background-color: #666;
  cursor: not-allowed;
}
</style> 
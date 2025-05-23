<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { 
  RiMic2Line, 
  RiKeyboardLine,
  RiMessage2Line, 
  RiAddCircleLine,
  RiLoader4Line 
} from '@remixicon/vue';
import { sendMessageToDeepSeek, getPlayerAutoResponse } from '../services/deepseekService';

const props = defineProps({
  isCollapsed: {
    type: Boolean,
    default: false
  },
  currentCharacter: {
    type: Object,
    required: true
  },
  lastUserMessage: {
    type: Object,
    default: undefined
  },
  lastCharacterMessage: {
    type: Object,
    default: undefined
  }
});

const inputText = ref('');
const showOptions = ref(false);
const isVoiceMode = ref(false);
const isRecording = ref(false);
const recordingDuration = ref(0);
const recordingTimer = ref<number | null>(null);
const isProcessing = ref(false);
const errorMessage = ref('');
const showError = ref(false);

const emit = defineEmits(['send-message', 'select-option', 'send-voice', 'ai-response']);

// 根据角色ID动态生成选项
const options = ref<string[]>([]);

// 错误类型映射
const errorTypes = {
  'network': '网络连接异常，请检查网络设置',
  'timeout': '请求超时，请稍后重试',
  'api': 'API/服务器响应异常，请稍后重试',
  'unknown': '发生未知错误，请稍后重试'
};

// 显示错误提示
function showErrorMessage(type: keyof typeof errorTypes) {
  errorMessage.value = errorTypes[type];
  showError.value = true;
  setTimeout(() => {
    showError.value = false;
  }, 3000);
}

// 更新对话选项
function updateDialogOptions() {
  switch (props.currentCharacter?.id) {
    case 'B001C001': // 羌青瓷
      options.value = [
        '羌青瓷，你还记得我们第一次相遇吗？',
        '(轻轻握住你的手) 我很想你...',
        '为什么当年你要消除我的记忆？',
        '你能告诉我更多关于莱诺家族的事吗？'
      ];
      break;
    case 'B001C005': // 黛利拉
      options.value = [
        '(小心翼翼地靠近) 能告诉我布雷诺的事吗？',
        '摩伊拉对你来说意味着什么？',
        '(注视她的刀) 你第一次拿起刀是什么时候？',
        '你觉得这个世界上有值得信任的人吗？'
      ];
      break;
    case 'B001C006': // 蒋伯驾
      options.value = [
        '(审视地看着他) 你打算如何进入缪家？',
        '蒋先生，你对缪宏谟了解多少？',
        '(微微皱眉) 你的计划会伤害到无辜的人吗？',
        '我想了解更多关于你过去的事'
      ];
      break;
    case 'B001C007': // 缪宏谟
      options.value = [
        '(盯着她的眼睛) 你知道布雷诺的战火燃到哪里了吗？',
        '缪家的赌场是怎么运作的？',
        '你是真的相信赌局的公平吗？',
        '(讲述一个布雷诺的故事)'
      ];
      break;
    default:
      options.value = [
        `${props.currentCharacter?.name}，你能告诉我更多关于自己的事吗？`,
        `(表情认真) 最近过得怎么样？`,
        `你对当前的处境有什么想法？`,
        `(安静地等待对方说些什么)`
      ];
  }
}

const inputContainerRef = ref<HTMLElement | null>(null);

function handleClickOutside(event: MouseEvent) {
  if (inputContainerRef.value && !inputContainerRef.value.contains(event.target as Node)) {
    showOptions.value = false;
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  updateDialogOptions();
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

// 监听角色变化，更新选项并处理自动回复
watch(() => props.currentCharacter, (newCharacter, oldCharacter) => {
  // 更新对话选项
  updateDialogOptions();
  
  // 如果新角色是羌青瓷 (B001C001) 并且旧角色是程聿怀之一 (B001C002或B001C003)
  if (newCharacter?.id === 'B001C001' && 
     (oldCharacter?.id === 'B001C002' || oldCharacter?.id === 'B001C003')) {
    const memoryQuestion = '为什么当年你要消除我的记忆？';
    
    // 自动选择该选项
    selectOption(memoryQuestion);
  }
}, { deep: true });

// 添加自动回复相关状态
const showAutoReply = ref(false);
const autoReplyOptions = ref<string[]>([]);
const isGeneratingAutoReply = ref(false);

// 生成自动回复选项
async function generateAutoReplyOptions() {
  if (!props.lastCharacterMessage || isGeneratingAutoReply.value) return;
  
  try {
    isGeneratingAutoReply.value = true;
    showAutoReply.value = true; // 立即显示面板，显示加载状态
    const response = await getPlayerAutoResponse(props.lastCharacterMessage.content);
    
    // 解析返回的选项（假设返回格式为 "选项1|选项2|选项3"）
    const options = response.split('|').map(opt => opt.trim()).filter(opt => opt);
    autoReplyOptions.value = options;
  } catch (error) {
    console.error('生成自动回复选项失败:', error);
    showAutoReply.value = false;
  } finally {
    isGeneratingAutoReply.value = false;
  }
}

// 监听角色消息变化，自动生成回复选项
watch(() => props.lastCharacterMessage, (newMessage) => {
  if (newMessage && !newMessage.isUser) {
    generateAutoReplyOptions();
  }
}, { immediate: true });

// 选择自动回复选项
async function selectAutoReply(option: string) {
  emit('send-message', option);
  showAutoReply.value = false;
  
  // 调用DeepSeek API获取回复
  try {
    isProcessing.value = true;
    const aiResponse = await sendMessageToDeepSeek(option);
    emit('ai-response', aiResponse);
  } catch (error: any) {
    console.error('获取AI回复失败:', error);
    
    // 根据错误类型显示不同的错误提示
    if (error.name === 'AbortError') {
      showErrorMessage('timeout');
    } else if (error.message?.includes('network')) {
      showErrorMessage('network');
    } else if (error.message?.includes('API')) {
      showErrorMessage('api');
    } else {
      showErrorMessage('unknown');
    }
    
    // 使用角色的fallback回复
    emit('ai-response', `(${props.currentCharacter.name}神情恍惚) 抱歉，我需要整理一下思绪...`);
  } finally {
    isProcessing.value = false;
  }
}

async function sendMessage() {
  if (inputText.value.trim()) {
    let userMessage = inputText.value.trim();
    
    // 检查是否只有括号没有正文
    const bracketOnlyRegex = /^\([^)]*\)$/;
    if (bracketOnlyRegex.test(userMessage)) {
      // 如果只有括号，添加一个默认的文本内容
      const characterName = props.currentCharacter?.name || '你';
      userMessage = `${userMessage} ${characterName}...`;
    }
    
    emit('send-message', userMessage);
    inputText.value = '';
    
    // 调用DeepSeek API获取回复
    try {
      isProcessing.value = true;
      const aiResponse = await sendMessageToDeepSeek(userMessage);
      emit('ai-response', aiResponse);
    } catch (error: any) {
      console.error('获取AI回复失败:', error);
      
      // 根据错误类型显示不同的错误提示
      if (error.name === 'AbortError') {
        showErrorMessage('timeout');
      } else if (error.message?.includes('network')) {
        showErrorMessage('network');
      } else if (error.message?.includes('API')) {
        showErrorMessage('api');
      } else {
        showErrorMessage('unknown');
      }
      
      // 使用角色的fallback回复
      emit('ai-response', `(${props.currentCharacter.name}神情恍惚) 抱歉，我需要整理一下思绪...`);
    } finally {
      isProcessing.value = false;
    }
  }
}

async function selectOption(option: string) {
  // 检查是否只有括号没有正文
  let userOption = option;
  const bracketOnlyRegex = /^\([^)]*\)$/;
  if (bracketOnlyRegex.test(userOption)) {
    // 如果只有括号，添加一个默认的文本内容
    const characterName = props.currentCharacter?.name || '你';
    userOption = `${userOption} ${characterName}...`;
  }
  
  emit('select-option', userOption);
  showOptions.value = false;
  
  // 调用DeepSeek API获取回复
  try {
    isProcessing.value = true;
    const aiResponse = await sendMessageToDeepSeek(userOption);
    emit('ai-response', aiResponse);
  } catch (error) {
    console.error('获取AI回复失败:', error);
    emit('ai-response', `(${props.currentCharacter.name}轻轻叹息) 我们的连接似乎出了些问题，能稍后再谈吗？`);
  } finally {
    isProcessing.value = false;
  }
}

function toggleOptions() {
  showOptions.value = !showOptions.value;
}

function toggleInputMode() {
  isVoiceMode.value = !isVoiceMode.value;
  if (isVoiceMode.value) {
    inputText.value = '';
  }
}

function startRecording() {
  if (!isVoiceMode.value) return;
  
  isRecording.value = true;
  recordingDuration.value = 0;
  recordingTimer.value = setInterval(() => {
    recordingDuration.value += 0.1;
  }, 100) as unknown as number;
}

async function stopRecording() {
  if (!isRecording.value) return;
  
  isRecording.value = false;
  if (recordingTimer.value) {
    clearInterval(recordingTimer.value);
    recordingTimer.value = null;
  }
  
  if (recordingDuration.value >= 0.5) { // 最少录音0.5秒
    emit('send-voice', recordingDuration.value);
    
    // 生成适用于当前角色的语音消息提示
    const voicePrompt = `您向${props.currentCharacter.name}发送了一段语音消息`;
    
    try {
      isProcessing.value = true;
      const aiResponse = await sendMessageToDeepSeek(voicePrompt);
      emit('ai-response', aiResponse);
    } catch (error) {
      console.error('获取AI回复失败:', error);
      // 使用角色名称定制错误信息
      emit('ai-response', `(${props.currentCharacter.name}似乎没有听清) 抱歉，你能再说一次吗？`);
    } finally {
      isProcessing.value = false;
    }
  }
  recordingDuration.value = 0;
}
</script>

<template>
  <div class="input-container" ref="inputContainerRef">
    <!-- 自动回复选项面板 -->
    <div v-if="showAutoReply" class="auto-reply-panel">
      <div class="auto-reply-header">
        <span>选择回复</span>
        <div class="close-button" @click="showAutoReply = false">×</div>
      </div>
      <div class="auto-reply-options">
        <template v-if="isGeneratingAutoReply">
          <div class="auto-reply-loading">
            <RiLoader4Line class="loading-icon" />
            <span>正在生成回复选项...</span>
          </div>
        </template>
        <template v-else>
          <div 
            v-for="(option, index) in autoReplyOptions" 
            :key="index"
            class="auto-reply-option"
            @click="selectAutoReply(option)"
          >
            {{ option }}
          </div>
        </template>
      </div>
    </div>
    
    <!-- 错误提示 -->
    <div class="error-message" v-if="showError" :class="{ 'show': showError }">
      {{ errorMessage }}
    </div>
    
    <div class="input-wrapper" :class="{ 'recording': isRecording }">
      <div class="voice-icon" @click="toggleInputMode">
        <RiMic2Line v-if="!isVoiceMode" />
        <RiKeyboardLine v-else />
      </div>
      
      <template v-if="!isVoiceMode">
        <input 
          type="text" 
          v-model="inputText" 
          placeholder=""
          @keyup.enter="sendMessage"
          @click="showOptions = false"
          :disabled="isProcessing"
        />
        <div class="action-buttons">
          <div 
            class="chat-options" 
            @click.stop="toggleOptions" 
            :class="{ 
              'disabled': isProcessing,
              'loading': isGeneratingAutoReply 
            }"
          >
            <RiLoader4Line v-if="isGeneratingAutoReply" class="loading-icon" />
            <RiMessage2Line v-else />
          </div>
          <div class="add-button" @click="sendMessage" :class="{ 'disabled': isProcessing }">
            <RiAddCircleLine />
          </div>
        </div>
      </template>
      
      <template v-else>
        <div 
          class="voice-input-area"
          @mousedown="startRecording"
          @mouseup="stopRecording"
          @touchstart.prevent="startRecording"
          @touchend.prevent="stopRecording"
          :class="{ 'disabled': isProcessing }"
        >
          {{ isRecording ? '松开发送' : (isProcessing ? `${props.currentCharacter.name}思考中...` : '按住说话') }}
          <div v-if="isRecording" class="recording-duration">
            {{ recordingDuration.toFixed(1) }}s
          </div>
        </div>
      </template>
    </div>
    
    <div v-if="showOptions" class="options-panel">
      <div 
        v-for="(option, index) in options" 
        :key="index" 
        class="option-item"
        @click="selectOption(option)"
        :class="{ 'disabled': isProcessing }"
      >
        {{ option }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.input-container {
  position: fixed;
  bottom: 48px;
  left: 0;
  right: 0;
  background-color: #121a1a;
  width: 100%;
  z-index: 20;
  max-width: 480px;
  margin: 0 auto;
}

.input-wrapper {
  display: flex;
  align-items: center;
  background-color: #2a2a2a;
  border-radius: 30px;
  padding: 8px 15px;
  color: #999;
  margin: 10px auto;
  width: calc(100% - 30px);
  transition: background-color 0.3s ease;
}

.input-wrapper.recording {
  background-color: #42b883;
}

.voice-icon {
  display: flex;
  align-items: center;
  margin-right: 10px;
  font-size: 20px;
  flex-shrink: 0;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.voice-icon:active {
  transform: scale(0.95);
}

input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 14px;
  padding: 8px 0;
  background: transparent;
  color: #eee;
  margin-right: 10px;
  min-width: 0;
  text-overflow: ellipsis;
  white-space: nowrap;
}

input::placeholder {
  color: #777;
}

input:disabled {
  opacity: 0.7;
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 15px;
  flex-shrink: 0;
}

.chat-options, .add-button {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 22px;
  flex-shrink: 0;
}

.chat-options.disabled, .add-button.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.options-panel {
  position: absolute;
  bottom: 100%;
  left: 0;
  right: 0;
  background-color: #2a2a2a;
  border-radius: 10px 10px 0 0;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.3);
  padding: 10px;
  z-index: 15;
  width: calc(100% - 30px);
  margin: 0 auto;
  left: 15px;
}

.option-item {
  padding: 12px;
  border-bottom: 1px solid #3a3a3a;
  font-size: 14px;
  cursor: pointer;
  color: #eee;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.option-item:last-child {
  border-bottom: none;
}

.option-item:hover {
  background-color: #333;
}

.option-item.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.voice-input-area {
  flex: 1;
  text-align: center;
  padding: 8px 0;
  font-size: 14px;
  color: #eee;
  cursor: pointer;
  user-select: none;
  position: relative;
}

.voice-input-area.disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.recording-duration {
  position: absolute;
  top: -24px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.7);
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  color: #fff;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.recording .voice-input-area {
  animation: pulse 1s infinite;
}

.error-message {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.8);
  color: #fff;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 14px;
  z-index: 1000;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  text-align: center;
  max-width: 80%;
}

.error-message.show {
  opacity: 1;
}

.auto-reply-panel {
  position: absolute;
  bottom: 100%;
  left: 0;
  right: 0;
  background-color: #2a2a2a;
  border-radius: 10px 10px 0 0;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.3);
  padding: 10px;
  z-index: 15;
  width: calc(100% - 30px);
  margin: 0 auto;
  left: 15px;
}

.auto-reply-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  border-bottom: 1px solid #3a3a3a;
  color: #ccc;
  font-size: 14px;
}

.close-button {
  cursor: pointer;
  font-size: 18px;
  color: #999;
  padding: 0 5px;
}

.close-button:hover {
  color: #fff;
}

.auto-reply-options {
  max-height: 200px;
  overflow-y: auto;
}

.auto-reply-option {
  padding: 12px;
  border-bottom: 1px solid #3a3a3a;
  font-size: 14px;
  cursor: pointer;
  color: #eee;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.auto-reply-option:last-child {
  border-bottom: none;
}

.auto-reply-option:hover {
  background-color: #333;
}

.loading-icon {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.auto-reply-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  color: #999;
  font-size: 14px;
  gap: 8px;
}

.auto-reply-loading .loading-icon {
  font-size: 18px;
}

.chat-options.loading {
  cursor: wait;
}

.chat-options.loading .loading-icon {
  font-size: 20px;
  color: #42b883;
}
</style> 
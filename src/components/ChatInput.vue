<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { 
  RiMic2Line, 
  RiKeyboardLine,
  RiMessage2Line, 
  RiAddCircleLine,
  RiLoader4Line 
} from '@remixicon/vue';
import { generateCharacterReply, generateAutoReplies } from '../services/chatService';
import type { Message } from '../types/chat';

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
    type: Object as () => Message | undefined,
    default: undefined
  },
  lastCharacterMessage: {
    type: Object as () => Message | undefined,
    default: undefined
  },
  isStreaming: {
    type: Boolean,
    default: false
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
const autoReplyOptions = ref<string[]>([]);
const isGenerating = ref(false);

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
  window.addEventListener('stream-complete', async () => {
    if (props.lastCharacterMessage) {
      await generateAutoReplyOptions();
    }
  });
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  window.removeEventListener('stream-complete', async () => {
    if (props.lastCharacterMessage) {
      await generateAutoReplyOptions();
    }
  });
});

// 监听角色变化，更新选项并处理自动回复
watch(() => props.currentCharacter, async (newCharacter, oldCharacter) => {
  // 更新对话选项
  updateDialogOptions();
  
  // 清空自动回复选项
  autoReplyOptions.value = [];
  
  // 如果新角色是羌青瓷 (B001C001) 并且旧角色是程聿怀之一 (B001C002或B001C003)
  if (newCharacter?.id === 'B001C001' && 
     (oldCharacter?.id === 'B001C002' || oldCharacter?.id === 'B001C003')) {
    const memoryQuestion = '为什么当年你要消除我的记忆？';
    
    // 自动选择该选项
    selectOption(memoryQuestion);
  }
}, { deep: true });

// 监听流式传输状态变化
watch(() => props.isStreaming, async (isStreaming) => {
  if (!isStreaming && props.lastCharacterMessage) {
    // 清空之前的自动回复选项
    autoReplyOptions.value = [];
    // 生成新的自动回复选项
    await generateAutoReplyOptions();
  }
});

// 生成自动回复选项
async function generateAutoReplyOptions() {
  if (!props.lastCharacterMessage || isGenerating.value) return;
  
  try {
    isGenerating.value = true;
    const options = await generateAutoReplies(
      props.currentCharacter.id, 
      props.lastCharacterMessage.content,
      props.lastUserMessage ? [props.lastUserMessage, props.lastCharacterMessage] : [props.lastCharacterMessage]
    );
    autoReplyOptions.value = options;
  } catch (error) {
    console.error('生成自动回复选项失败:', error);
    showErrorMessage('api');
  } finally {
    isGenerating.value = false;
  }
}

// 切换选项面板
async function toggleOptions() {
  showOptions.value = !showOptions.value;
  
  // 如果打开面板且还没有生成过选项，则开始生成
  if (showOptions.value && autoReplyOptions.value.length === 0) {
    await generateAutoReplyOptions();
  }
}

// 选择选项
async function selectOption(option: string) {
  // 检查是否只有括号没有正文
  let userOption = option;
  const bracketOnlyRegex = /^\([^)]*\)$/;
  if (bracketOnlyRegex.test(userOption)) {
    const characterName = props.currentCharacter?.name || '你';
    userOption = `${userOption} ${characterName}...`;
  }
  
  // 直接调用sendMessage函数
  inputText.value = userOption;
  await sendMessage();
  showOptions.value = false;
}

async function sendMessage() {
  if (inputText.value.trim()) {
    let userMessage = inputText.value.trim();
    
    // 检查是否只有括号没有正文
    const bracketOnlyRegex = /^\([^)]*\)$/;
    if (bracketOnlyRegex.test(userMessage)) {
      const characterName = props.currentCharacter?.name || '你';
      userMessage = `${userMessage} ${characterName}...`;
    }
    
    emit('send-message', userMessage);
    inputText.value = '';
  }
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
      const aiResponse = await generateCharacterReply(props.currentCharacter.id, voicePrompt);
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
    <!-- 选项面板 -->
    <div v-if="showOptions" class="options-panel">
      <template v-if="isGenerating">
        <div class="option-item loading">
          <RiLoader4Line class="loading-icon" />
          <span>正在生成回复选项...</span>
        </div>
      </template>
      <template v-else>
        <div 
          v-for="(option, index) in autoReplyOptions" 
          :key="index" 
          class="option-item"
          @click="selectOption(option)"
          :class="{ 'disabled': isProcessing }"
        >
          {{ option }}
        </div>
      </template>
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
              'loading': isGenerating 
            }"
          >
            <RiLoader4Line v-if="isGenerating" class="loading-icon" />
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

.option-item.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #999;
  cursor: wait;
}

.loading-icon {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.chat-options {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 22px;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.chat-options.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.chat-options.loading {
  cursor: wait;
}

.chat-options.loading .loading-icon {
  font-size: 20px;
  color: #42b883;
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
</style> 
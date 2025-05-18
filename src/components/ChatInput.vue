<script setup lang="ts">
import { ref } from 'vue';
import { 
  RiMic2Line, 
  RiKeyboardLine,
  RiMessage2Line, 
  RiAddCircleLine 
} from '@remixicon/vue';
import { sendMessageToDeepSeek } from '../services/deepseekService';

defineProps({
  isCollapsed: {
    type: Boolean,
    default: false
  },
  lastUserMessage: {
    type: Object,
    default: null
  },
  lastCharacterMessage: {
    type: Object,
    default: null
  }
});

const inputText = ref('');
const showOptions = ref(false);
const isVoiceMode = ref(false);
const isRecording = ref(false);
const recordingDuration = ref(0);
const recordingTimer = ref<number | null>(null);
const isKeyboardVisible = ref(false);
const isProcessing = ref(false);

const emit = defineEmits(['send-message', 'select-option', 'send-voice', 'keyboard-toggle', 'ai-response']);

const options = ref([
  '羌青瓷，你还记得我们第一次相遇吗？',
  '(轻轻握住你的手) 我很想你...',
  '为什么当年你要消除我的记忆？',
  '你能告诉我更多关于莱诺家族的事吗？'
]);

async function sendMessage() {
  if (inputText.value.trim()) {
    const userMessage = inputText.value.trim();
    emit('send-message', userMessage);
    inputText.value = '';
    hideKeyboard();
    
    // 调用DeepSeek API获取回复
    try {
      isProcessing.value = true;
      const aiResponse = await sendMessageToDeepSeek(userMessage);
      emit('ai-response', aiResponse);
    } catch (error) {
      console.error('获取AI回复失败:', error);
      emit('ai-response', '(神情黯淡) 抱歉，聿怀，我现在有些恍惚，可以稍后再谈吗？');
    } finally {
      isProcessing.value = false;
    }
  }
}

async function selectOption(option: string) {
  emit('select-option', option);
  showOptions.value = false;
  
  // 调用DeepSeek API获取回复
  try {
    isProcessing.value = true;
    const aiResponse = await sendMessageToDeepSeek(option);
    emit('ai-response', aiResponse);
  } catch (error) {
    console.error('获取AI回复失败:', error);
    emit('ai-response', '(轻轻叹息) 聿怀，我们的连接似乎出了些问题，能稍后再谈吗？');
  } finally {
    isProcessing.value = false;
  }
}

function toggleOptions() {
  showOptions.value = !showOptions.value;
  if (showOptions.value) {
    hideKeyboard();
  }
}

function toggleInputMode() {
  isVoiceMode.value = !isVoiceMode.value;
  if (isVoiceMode.value) {
    inputText.value = '';
    hideKeyboard();
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
    
    // 这里可以添加语音识别功能，将语音转为文本后调用DeepSeek API
    // 目前只是模拟一个简单的回复
    try {
      isProcessing.value = true;
      const aiResponse = await sendMessageToDeepSeek("程聿怀发送了一段语音消息，听起来很想念你");
      emit('ai-response', aiResponse);
    } catch (error) {
      console.error('获取AI回复失败:', error);
      emit('ai-response', '(微微歪头) 聿怀，你的声音有些模糊，能再说一次吗？');
    } finally {
      isProcessing.value = false;
    }
  }
  recordingDuration.value = 0;
}

function showKeyboard() {
  if (isVoiceMode.value) return;
  isKeyboardVisible.value = true;
  emit('keyboard-toggle', true);
}

function hideKeyboard() {
  if (isKeyboardVisible.value) {
    isKeyboardVisible.value = false;
    emit('keyboard-toggle', false);
  }
}
</script>

<template>
  <div class="input-container" :class="{ 'keyboard-active': isKeyboardVisible }">
    <div v-if="isCollapsed && lastUserMessage && lastCharacterMessage" class="collapsed-messages">
      <div class="user-message">
        <div class="message-bubble">
          <div class="message-content" v-html="lastUserMessage.content"></div>
        </div>
      </div>
      <div class="character-message">
        <div v-if="lastCharacterMessage.hasAudio" class="audio-icon">🔊</div>
        <div class="message-bubble">
          <div class="message-content" v-html="lastCharacterMessage.content"></div>
        </div>
      </div>
    </div>
    
    <div class="input-wrapper" :class="{ 'recording': isRecording, 'processing': isProcessing }">
      <div class="voice-icon" @click="toggleInputMode">
        <RiMic2Line v-if="!isVoiceMode" />
        <RiKeyboardLine v-else />
      </div>
      
      <template v-if="!isVoiceMode">
        <input 
          type="text" 
          v-model="inputText" 
          placeholder="以程聿怀的身份与羌青瓷对话..."
          @keyup.enter="sendMessage"
          @focus="showKeyboard"
          @blur="hideKeyboard"
          :disabled="isProcessing"
        />
        <div class="action-buttons">
          <div class="chat-options" @click="toggleOptions" :class="{ 'disabled': isProcessing }">
            <RiMessage2Line />
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
          {{ isRecording ? '松开发送' : (isProcessing ? '羌青瓷思考中...' : '按住说话') }}
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
  
  <!-- 虚拟键盘与输入框分离，使用fixed定位在底部 -->
  <div v-if="isKeyboardVisible" class="virtual-keyboard">
    <div class="keyboard-row">
      <div class="key">Q</div>
      <div class="key">W</div>
      <div class="key">E</div>
      <div class="key">R</div>
      <div class="key">T</div>
      <div class="key">Y</div>
      <div class="key">U</div>
      <div class="key">I</div>
      <div class="key">O</div>
      <div class="key">P</div>
    </div>
    <div class="keyboard-row">
      <div class="key">A</div>
      <div class="key">S</div>
      <div class="key">D</div>
      <div class="key">F</div>
      <div class="key">G</div>
      <div class="key">H</div>
      <div class="key">J</div>
      <div class="key">K</div>
      <div class="key">L</div>
    </div>
    <div class="keyboard-row">
      <div class="key wide">Shift</div>
      <div class="key">Z</div>
      <div class="key">X</div>
      <div class="key">C</div>
      <div class="key">V</div>
      <div class="key">B</div>
      <div class="key">N</div>
      <div class="key">M</div>
      <div class="key wide">删除</div>
    </div>
    <div class="keyboard-row">
      <div class="key">符号</div>
      <div class="key">123</div>
      <div class="key extra-wide">空格</div>
      <div class="key wide" @click="sendMessage" :class="{ 'disabled': isProcessing }">发送</div>
    </div>
  </div>
</template>

<style scoped>
.input-container {
  position: fixed;
  bottom: 48px; /* 底部导航栏的高度 */
  left: 0;
  right: 0;
  background-color: #121a1a;
  width: 100%;
  z-index: 20;
  transition: bottom 0.3s ease;
}

/* 当键盘激活时，移动输入框到键盘上方 */
.input-container.keyboard-active {
  bottom: 170px; /* 键盘高度 */
}

.collapsed-messages {
  padding: 0 15px 10px;
  background-color: #121a1a;
  display: flex;
  flex-direction: column;
}

.user-message, .character-message {
  display: flex;
  margin: 5px 0;
  align-items: flex-start;
}

.user-message {
  justify-content: flex-end;
}

.character-message {
  justify-content: flex-start;
}

.message-bubble {
  max-width: 85%;
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

.audio-icon {
  margin-right: 8px;
  color: #cccccc;
  font-size: 16px;
  margin-top: 5px;
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
  max-width: 480px;
  transition: background-color 0.3s ease;
}

.input-wrapper.recording {
  background-color: #42b883;
}

.input-wrapper.processing {
  background-color: #3498db;
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
  max-width: 480px;
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

.virtual-keyboard {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #2a2a2a;
  padding: 5px 0;
  z-index: 19; /* 确保键盘低于导航栏 */
  border-top: 1px solid #444;
  max-width: 480px;
  margin: 0 auto;
  height: 170px;
}

.keyboard-row {
  display: flex;
  justify-content: center;
  margin: 2px 0;
  padding: 0 5px;
}

.key {
  width: 30px;
  height: 36px;
  background-color: #3a3a3a;
  border-radius: 5px;
  margin: 0 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 14px;
  user-select: none;
  flex: 1;
  max-width: 10%;
  cursor: pointer;
}

.key:active {
  background-color: #555;
}

.key.wide {
  max-width: 15%;
}

.key.extra-wide {
  max-width: 40%;
}

.key.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style> 
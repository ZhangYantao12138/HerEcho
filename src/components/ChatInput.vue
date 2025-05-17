<script setup lang="ts">
import { ref } from 'vue';
import { 
  RiMic2Line, 
  RiKeyboardLine,
  RiMessage2Line, 
  RiAddCircleLine 
} from '@remixicon/vue';

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

const emit = defineEmits(['send-message', 'select-option', 'send-voice']);

const options = ref([
  '我今天...有点想你。',
  '真的吗？',
  '你靠近一点...'
]);

function sendMessage() {
  if (inputText.value.trim()) {
    emit('send-message', inputText.value.trim());
    inputText.value = '';
  }
}

function toggleOptions() {
  showOptions.value = !showOptions.value;
}

function selectOption(option: string) {
  emit('select-option', option);
  showOptions.value = false;
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

function stopRecording() {
  if (!isRecording.value) return;
  
  isRecording.value = false;
  if (recordingTimer.value) {
    clearInterval(recordingTimer.value);
    recordingTimer.value = null;
  }
  
  if (recordingDuration.value >= 0.5) { // 最少录音0.5秒
    emit('send-voice', recordingDuration.value);
  }
  recordingDuration.value = 0;
}
</script>

<template>
  <div class="input-container">
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
    
    <div class="input-wrapper" :class="{ 'recording': isRecording }">
      <div class="voice-icon" @click="toggleInputMode">
        <RiMic2Line v-if="!isVoiceMode" />
        <RiKeyboardLine v-else />
      </div>
      
      <template v-if="!isVoiceMode">
        <input 
          type="text" 
          v-model="inputText" 
          placeholder="输入或选择消息发给TA，5s后自动回复"
          @keyup.enter="sendMessage"
        />
        <div class="action-buttons">
          <div class="chat-options" @click="toggleOptions">
            <RiMessage2Line />
          </div>
          <div class="add-button" @click="sendMessage">
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
        >
          {{ isRecording ? '松开发送' : '按住说话' }}
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
      >
        {{ option }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.input-container {
  position: fixed;
  bottom: 48px; /* 底部导航栏的高度 */
  left: 0;
  right: 0;
  padding: 10px 0;
  background-color: #121a1a;
  width: 100%;
  z-index: 20;
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
  margin: 0 auto;
  width: calc(100% - 30px);
  max-width: 480px;
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

.options-panel {
  position: absolute;
  bottom: 100%;
  left: 0;
  right: 0;
  background-color: #2a2a2a;
  border-radius: 10px 10px 0 0;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.3);
  padding: 10px;
  z-index: 5;
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
}

.option-item:last-child {
  border-bottom: none;
}

.option-item:hover {
  background-color: #333;
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
</style> 
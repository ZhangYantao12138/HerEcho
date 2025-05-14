<script setup lang="ts">
import { ref, computed, defineProps } from 'vue';
import { 
  RiMic2Line, 
  RiMessage2Line, 
  RiAddCircleLine 
} from '@remixicon/vue';

const props = defineProps({
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

const emit = defineEmits(['send-message', 'select-option']);

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
    
    <div class="input-wrapper">
      <div class="voice-icon">
        <RiMic2Line />
      </div>
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
}

.voice-icon {
  display: flex;
  align-items: center;
  margin-right: 10px;
  font-size: 20px;
  flex-shrink: 0;
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
</style> 
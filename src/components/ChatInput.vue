<script setup lang="ts">
import { ref } from 'vue';

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
    <div class="input-wrapper">
      <div class="voice-icon">🎤</div>
      <input 
        type="text" 
        v-model="inputText" 
        placeholder="输入或选择消息发给TA，5s后自动回复"
        @keyup.enter="sendMessage"
      />
      <div class="action-buttons">
        <div class="chat-options" @click="toggleOptions">💬</div>
        <div class="send-button" @click="sendMessage">
          <span v-if="inputText.trim()">✓</span>
          <span v-else>+</span>
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
  position: relative;
  padding: 10px;
  background-color: #f5f5f5;
  border-top: 1px solid #e0e0e0;
}

.input-wrapper {
  display: flex;
  align-items: center;
  background-color: white;
  border-radius: 20px;
  padding: 5px 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.voice-icon {
  margin-right: 8px;
  color: #888;
  font-size: 18px;
}

input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 14px;
  padding: 8px 0;
}

.action-buttons {
  display: flex;
  align-items: center;
}

.chat-options, .send-button {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 50%;
  margin-left: 5px;
}

.send-button {
  background-color: #42b883;
  color: white;
  font-size: 16px;
}

.options-panel {
  position: absolute;
  bottom: 100%;
  left: 0;
  right: 0;
  background-color: white;
  border-radius: 10px 10px 0 0;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  padding: 10px;
  z-index: 5;
}

.option-item {
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 14px;
  cursor: pointer;
}

.option-item:last-child {
  border-bottom: none;
}

.option-item:hover {
  background-color: #f9f9f9;
}
</style> 
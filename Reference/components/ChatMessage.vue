<script setup lang="ts">
defineProps({
  isUser: {
    type: Boolean,
    default: false
  },
  message: {
    type: String,
    required: true
  },
  hasAudio: {
    type: Boolean,
    default: false
  }
});
</script>

<template>
  <div class="message-container" :class="{ 'user-message': isUser, 'character-message': !isUser }">
    <div v-if="hasAudio && !isUser" class="audio-icon">🔊</div>
    <div class="message-bubble">
      <div class="message-content" v-html="message"></div>
    </div>
  </div>
</template>

<style scoped>
.message-container {
  display: flex;
  margin: 10px 0;
  padding: 0 15px;
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
</style> 
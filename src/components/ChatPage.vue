<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ChatHeader from './ChatHeader.vue';
import SceneInfo from './SceneInfo.vue';
import ChatMessage from './ChatMessage.vue';
import ChatInput from './ChatInput.vue';
import BottomNav from './BottomNav.vue';

const messages = ref([
  { 
    id: 1, 
    content: '(摇晃着盛满白葡萄酒的高脚杯，背对着你靠在桌前。听到脚步声后歪了歪唇，没有回头，只是捧了一口杯中的酒，随后轻轻地把酒杯放在桌子上，轻声笑了) "串，你来了。"',
    isUser: false,
    hasAudio: true
  },
  { 
    id: 2, 
    content: '(伸手环住他的腰，将脸埋进他的后背)',
    isUser: true,
    hasAudio: false
  },
  { 
    id: 3, 
    content: '(轻笑一声，没有挣开你的怀抱，只是拿起酒杯又捧了一口酒，随后转身面对着你，微微俯身凑近你，温热的呼吸洒在你的脸上) "今天怎么这么黏人？"',
    isUser: false,
    hasAudio: true
  },
  { 
    id: 4, 
    content: '(伸手搭住他的脖子，凑近他的耳边轻声说) "我今天......有点想你。"',
    isUser: true,
    hasAudio: false
  },
  { 
    id: 5, 
    content: '(娇羞滚动，轻笑着将你推开一些，与你四目相对，眼中带着笑意) "啊？是吗？我还以为你巴不得离我远点呢。"',
    isUser: false,
    hasAudio: true
  }
]);

const progress = ref(40);
const chatContainerRef = ref<HTMLElement | null>(null);

function sendMessage(text: string) {
  addUserMessage(text);
  setTimeout(() => {
    addCharacterResponse();
  }, 1000);
}

function selectOption(option: string) {
  addUserMessage(option);
  setTimeout(() => {
    addCharacterResponse();
  }, 1000);
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

function addCharacterResponse() {
  const responses = [
    "嗯？怎么了？有心事吗？",
    "你今天看起来很不一样，告诉我发生了什么？",
    "看着你的眼睛，我能感觉到你有话想说...",
    "你靠得太近了，我的心跳有点加速...",
    "今天的你，格外吸引我..."
  ];
  
  const randomResponse = responses[Math.floor(Math.random() * responses.length)];
  
  messages.value.push({
    id: Date.now(),
    content: randomResponse,
    isUser: false,
    hasAudio: true
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
    if (chatContainerRef.value) {
      chatContainerRef.value.scrollTop = chatContainerRef.value.scrollHeight;
    }
  }, 100);
}

onMounted(() => {
  scrollToBottom();
});
</script>

<template>
  <div class="chat-page">
    <ChatHeader roleName="羌青瓷" />
    <SceneInfo :progress="progress" />
    
    <div class="chat-container" ref="chatContainerRef">
      <ChatMessage 
        v-for="message in messages" 
        :key="message.id"
        :message="message.content"
        :isUser="message.isUser"
        :hasAudio="message.hasAudio"
      />
    </div>
    
    <ChatInput @send-message="sendMessage" @select-option="selectOption" />
    <BottomNav />
  </div>
</template>

<style scoped>
.chat-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #121a1a;
}

.chat-container {
  flex: 1;
  overflow-y: auto;
  padding: 10px 0;
}

/* 隐藏滚动条但保留功能 */
.chat-container::-webkit-scrollbar {
  width: 0px;
}
</style> 
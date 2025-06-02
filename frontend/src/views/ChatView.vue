<template>
  <div class="h-screen flex flex-col">
    <!-- 顶部导航栏 -->
    <TopBar
      :character="currentCharacter"
      @toggle-settings="toggleSettings"
    />

    <!-- 设置栏 -->
    <SettingBar
      v-if="showSettings"
      :model="selectedModel"
      :auto-play="autoPlay"
      @model-change="changeModel"
      @auto-play-change="toggleAutoPlay"
      @test-api="testApi"
    />

    <!-- 聊天容器 -->
    <div class="flex-1 overflow-hidden relative">
      <div
        class="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
        :style="{ backgroundImage: `url(${currentCharacter?.avatar})` }"
      ></div>
      <ChatContainer
        :messages="messages"
        :loading="loading"
        @scroll="handleScroll"
      />
    </div>

    <!-- 输入区域 -->
    <InputArea
      :loading="loading"
      :auto-reply-options="autoReplyOptions"
      @send="sendMessage"
      @auto-reply="selectAutoReply"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import TopBar from '../components/chat/TopBar.vue'
import SettingBar from '../components/chat/SettingBar.vue'
import ChatContainer from '../components/chat/ChatContainer.vue'
import InputArea from '../components/chat/InputArea.vue'
import { useChatStore } from '../store/chat'
import { Character } from '../types/script'
import { Message } from '../types/chat'

const route = useRoute()
const chatStore = useChatStore()

const characterId = computed(() => route.params.characterId as string)
const currentCharacter = ref<Character | null>(null)
const messages = ref<Message[]>([])
const loading = ref(false)
const showSettings = ref(false)
const selectedModel = ref('deepseek')
const autoPlay = ref(true)
const autoReplyOptions = ref<string[]>([])

onMounted(async () => {
  await loadCharacter()
  await loadChatHistory()
})

const loadCharacter = async () => {
  currentCharacter.value = await chatStore.fetchCharacter(characterId.value)
}

const loadChatHistory = async () => {
  messages.value = await chatStore.fetchChatHistory(characterId.value)
}

const toggleSettings = () => {
  showSettings.value = !showSettings.value
}

const changeModel = (model: string) => {
  selectedModel.value = model
}

const toggleAutoPlay = (value: boolean) => {
  autoPlay.value = value
}

const testApi = async () => {
  try {
    await chatStore.testApiConnection(selectedModel.value)
  } catch (error) {
    console.error('API测试失败:', error)
  }
}

const sendMessage = async (content: string) => {
  if (!content.trim()) return

  loading.value = true
  try {
    const response = await chatStore.sendMessage({
      characterId: characterId.value,
      content,
      model: selectedModel.value
    })
    messages.value.push(response)
    if (autoPlay.value) {
      // 播放语音
    }
    // 生成自动回复选项
    autoReplyOptions.value = await chatStore.generateAutoReplyOptions(characterId.value)
  } catch (error) {
    console.error('发送消息失败:', error)
  } finally {
    loading.value = false
  }
}

const selectAutoReply = async (option: string) => {
  await sendMessage(option)
}

const handleScroll = async (event: Event) => {
  // 处理滚动加载历史消息
}
</script> 
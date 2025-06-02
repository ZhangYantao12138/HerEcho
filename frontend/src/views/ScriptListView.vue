<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">剧本列表</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <ScriptCard
        v-for="script in scripts"
        :key="script.id"
        :script="script"
        @click="openScriptDetail(script)"
      />
    </div>
    <ScriptDetailModal
      v-if="selectedScript"
      :script="selectedScript"
      @close="closeScriptDetail"
      @start-chat="startChat"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ScriptCard from '../components/common/ScriptCard.vue'
import ScriptDetailModal from '../components/common/ScriptDetailModal.vue'
import { useScriptStore } from '../store/script'

const router = useRouter()
const scriptStore = useScriptStore()
const scripts = ref([])
const selectedScript = ref(null)

onMounted(async () => {
  scripts.value = await scriptStore.fetchScripts()
})

const openScriptDetail = (script) => {
  selectedScript.value = script
}

const closeScriptDetail = () => {
  selectedScript.value = null
}

const startChat = (characterId: string) => {
  router.push(`/chat/${characterId}`)
}
</script> 
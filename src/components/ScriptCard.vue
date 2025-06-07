<script setup lang="ts">
interface ScriptCardProps {
  script: {
    id: string;
    title: string;
    description: string;
    coverImage: string;
    isNew: boolean;
    isLocked?: boolean;
    comingSoon?: boolean;
  }
}

defineProps<ScriptCardProps>();
defineEmits(['click']);
</script>

<template>
  <div 
    class="script-card"
    :class="{ 'locked': script.isLocked }"
    @click="$emit('click', script)"
  >
    <div class="script-cover">
      <img :src="script.coverImage" alt="剧本封面" />
      <div v-if="script.isNew" class="new-badge">新</div>
      <div v-if="script.isLocked" class="lock-overlay">
        <div class="lock-icon">🔒</div>
        <div v-if="script.comingSoon" class="coming-soon">即将上线</div>
      </div>
      <div class="script-title-bar">
        <span class="script-title">{{ script.title }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.script-card {
  width: 100%;
  max-width: 400px;
  aspect-ratio: 16/9;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0,0,0,0.25);
  margin: 0 auto;
  cursor: pointer;
  position: relative;
  background: #1e1e1e;
  transition: box-shadow 0.3s, transform 0.3s;
  display: flex;
}

.script-card:not(.locked):hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.4);
}

.script-card.locked {
  opacity: 0.8;
}

.script-cover {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: flex-end;
}

.script-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;
}

.new-badge, .lock-overlay {
  position: absolute;
  top: 14px;
  right: 14px;
  z-index: 3;
}

.lock-overlay {
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.lock-icon {
  font-size: 40px;
  color: white;
  margin-bottom: 10px;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

.coming-soon {
  font-size: 16px;
  color: #f1c40f;
  font-weight: bold;
}

.script-title-bar {
  width: 100%;
  position: absolute;
  left: 0;
  bottom: 0;
  z-index: 2;
  background: linear-gradient(0deg, rgba(30,30,30,0.85) 80%, rgba(30,30,30,0.1) 100%);
  padding: 16px 0 10px 0;
  display: flex;
  justify-content: center;
  align-items: flex-end;
}

.script-title {
  color: #fff;
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  line-height: 1.2;
  text-shadow: 0 2px 8px rgba(0,0,0,0.5);
  max-width: 90%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style> 
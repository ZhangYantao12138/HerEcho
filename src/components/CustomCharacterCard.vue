<script setup lang="ts">
defineEmits(['click']);
</script>

<template>
  <div 
    class="custom-character-card"
    @click="$emit('click')"
  >
    <div class="custom-character-cover">
      <div class="background-overlay"></div>
      <div class="content-wrapper">
        <div class="custom-icon">🎭</div>
        <div class="create-badge">自建</div>
      </div>
    </div>
    <div class="custom-character-info">
      <h3 class="custom-character-title">自建角色</h3>
      <p class="custom-character-description">创建属于你的专属角色，开启独特对话体验</p>
    </div>
  </div>
</template>

<style scoped>
.custom-character-card {
  background-color: #1e1e1e;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  border: 2px solid transparent;
}

.custom-character-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
  border-color: #3498db;
}

.custom-character-cover {
  height: 180px;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" patternUnits="userSpaceOnUse" width="100" height="100"><circle cx="20" cy="20" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="80" cy="40" r="1" fill="rgba(255,255,255,0.08)"/><circle cx="40" cy="70" r="1" fill="rgba(255,255,255,0.12)"/><circle cx="90" cy="90" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="10" cy="60" r="1" fill="rgba(255,255,255,0.09)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  opacity: 0.3;
}

.content-wrapper {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 2;
}

.custom-icon {
  font-size: 48px;
  margin-bottom: 10px;
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.3));
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.create-badge {
  background: linear-gradient(45deg, #3498db, #2ecc71);
  color: white;
  font-size: 14px;
  font-weight: bold;
  padding: 6px 12px;
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(52, 152, 219, 0.3);
}

.custom-character-info {
  padding: 15px;
}

.custom-character-title {
  margin: 0 0 8px 0;
  font-size: 20px;
  color: white;
  font-weight: bold;
}

.custom-character-description {
  margin: 0;
  font-size: 14px;
  color: #bbb;
  line-height: 1.4;
}
</style> 
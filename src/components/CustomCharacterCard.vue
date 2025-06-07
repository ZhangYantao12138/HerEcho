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
      <div class="create-badge">自建</div>
      <div class="custom-title-bar">
        <span class="custom-character-title">自建角色</span>
      </div>
      <div class="content-wrapper">
        <div class="custom-icon">🎭</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-character-card {
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

.custom-character-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.4);
}

.custom-character-cover {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: flex-end;
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
  z-index: 1;
}

.create-badge {
  position: absolute;
  top: 14px;
  right: 14px;
  z-index: 3;
  background: linear-gradient(45deg, #3498db, #2ecc71);
  color: white;
  font-size: 14px;
  font-weight: bold;
  padding: 6px 16px;
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(52, 152, 219, 0.3);
}

.content-wrapper {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 2;
  pointer-events: none;
}

.custom-icon {
  font-size: 54px;
  margin-bottom: 0;
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

.custom-title-bar {
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

.custom-character-title {
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
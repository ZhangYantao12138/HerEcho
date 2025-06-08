<template>
  <div class="character-card" :style="{ backgroundImage: `url(${character.avatar})` }">
    <div class="overlay">
      <div class="name">{{ character.name }}</div>
      <!-- 增加一条分割线 -->
      <div class="divider"></div>
      <div class="desc">{{ characterDesc }}</div>
      <div class="actions">
        <button class="btn skip" @click="$emit('cancel')">
          <span class="icon">✖</span>
          <span class="text"></span>
        </button>
        <button class="btn like" @click="$emit('match')">
          <span class="icon">❤</span>
          <span class="text"></span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
const props = defineProps({
  character: { type: Object, required: true }
});
const characterDesc = computed(() => {
  // 取角色的介绍信息，优先 backgroundDescription，没有则用 name
  return props.character.backgroundDescription || props.character.name;
});
</script>

<style scoped>
.character-card {
  width: 80vw;
  max-width: 400px;
  height: 40vw;
  max-height: 800px;
  aspect-ratio: 1 / 2;
  background-size: cover;
  background-position: center;
  border-radius: 32px;
  box-shadow: 0 8px 32px rgba(122, 79, 255, 0.18);
  position: relative;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
  border: 4px solid rgba(216, 147, 235, 0.7);
}
.overlay {
  width: 100%;
  padding: 36px 28px 32px 28px;
  background: linear-gradient(to top, rgba(0,0,0,1) 30%, rgba(0,0,0,0.0) 100%);
  color: #fff;
  position: absolute;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.name {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 1px;
  letter-spacing: 1px;
  text-align: left;
  text-shadow: 0 2px 8px rgba(0,0,0,0.18);
}
.divider {
  width: 90%;
  height: 1px;
  background-color: #f3eaff;
  /* 居中 */
  margin-left: auto;
  margin-right: auto;
  margin-top: 5px;
  margin-bottom: 5px;
}
.desc {
  font-size: 16px;
  color: #f3eaff;
  margin-bottom: 15px;
  text-align: left;
  text-shadow: 0 2px 8px rgba(0,0,0,0.18);
}
.actions {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 0 50px;
  gap: 18px;
}
.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 80px;
  padding: 18px 18px;
  height: 60px;
  border: none;
  border-radius: 22px;
  font-size: 17px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}
.btn .icon {
  font-size: 20px;
  margin-right: auto;
  margin-left: auto;
}
.skip {
  background: #f3f3f6;
  color: #888;
}
.skip:hover {
  background: #e0e0e6;
  color: #555;
}
.like {
  background: linear-gradient(90deg, #7a4fff 60%, #e85dff 100%);
  color: #fff;
}
.like:hover {
  background: linear-gradient(90deg, #6a3fd9 60%, #c84dcf 100%);
}
</style> 
<script setup lang="ts">
import { useRouter } from 'vue-router';
import { RiArrowLeftSLine } from '@remixicon/vue';

const router = useRouter();

function goBack() {
  router.back();
}
</script>

<template>
  <div class="discover-container">
    <div class="header">
      <button class="back-button" @click="goBack">
        <RiArrowLeftSLine />
      </button>
      <h1>发现页面</h1>
    </div>
    <p>这里是发现功能区域，待实现</p>
  </div>
</template>

<style scoped>
.discover-container {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 100vh;
  background-color: #1b3333;
  color: white;
}

.header {
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  position: relative;
}

.back-button {
  background: none;
  border: none;
  color: #cccccc;
  cursor: pointer;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  position: absolute;
  left: 0;
}

.back-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

h1 {
  width: 100%;
  text-align: center;
  margin: 0;
}
</style> 
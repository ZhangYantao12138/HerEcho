<script setup lang="ts">
</script>

<template>
  <div class="app-container">
    <router-view />
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'PingFang SC', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  -webkit-tap-highlight-color: transparent;
}

html, body {
  height: 100%;
  background-color: #121a1a;
  color: #333;
  overflow: hidden;
}

.app-container {
  height: 100vh;
  max-width: 480px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
}

/* 移动端适配 */
@media screen and (max-width: 480px) {
  .app-container {
    width: 100%;
  }
}
</style>

<script setup lang="ts">
// App root component
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <router-view></router-view>
  </div>
</template>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #1a1a1a;
  color: #ffffff;
}

#app {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

* {
  box-sizing: border-box;
}
</style>

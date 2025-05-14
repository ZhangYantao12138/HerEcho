<script setup lang="ts">
// 定义props
defineProps({
  roleName: {
    type: String,
    default: '羌青瓷'
  }
})
</script>

<template>
  <div class="header-container">
    <div class="back-button">
      <span>&lt;</span>
    </div>
    <div class="role-name">{{ roleName }}</div>
    <div class="power-icon">⚡️</div>
  </div>
</template>

<style scoped>
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background-color: #1e3a3a;
  color: white;
  font-size: 18px;
  position: sticky;
  top: 0;
  z-index: 10;
}

.back-button {
  font-size: 24px;
  cursor: pointer;
  width: 30px;
}

.role-name {
  font-weight: 600;
  flex-grow: 1;
  text-align: center;
}

.power-icon {
  width: 30px;
  text-align: right;
}
</style> 
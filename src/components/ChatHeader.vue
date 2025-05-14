<script setup lang="ts">
import { RiArrowLeftSLine, RiSearchLine, RiMoreLine } from '@remixicon/vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 定义props
defineProps({
  roleName: {
    type: String,
    default: '羌青瓷'
  }
});

function goBack() {
  router.go(-1);
}
</script>

<template>
  <div class="header-container">
    <div class="back-button" @click="goBack">
      <RiArrowLeftSLine />
    </div>
    <div class="role-name">{{ roleName }}</div>
    <div class="right-icons">
      <RiSearchLine class="icon" />
      <RiMoreLine class="icon" />
    </div>
  </div>
</template>

<style scoped>
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: #1b3333; /* 调整为深蓝绿色/深青色 */
  color: white;
  font-size: 18px;
  position: sticky;
  top: 0;
  z-index: 10;
  text-align: center;
  height: 50px;
  box-sizing: border-box;
}

.back-button {
  font-size: 24px;
  cursor: pointer;
  width: 30px;
  flex-shrink: 0;
  text-align: left;
}

.role-name {
  font-weight: 600;
  flex-grow: 1;
  text-align: center;
  font-size: 18px;
}

.right-icons {
  display: flex;
  gap: 15px;
  font-size: 22px;
}

.icon {
  cursor: pointer;
}
</style> 
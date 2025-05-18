<script setup lang="ts">
import { RiArrowLeftSLine } from '@remixicon/vue';
import { useRouter } from 'vue-router';
import { ref } from 'vue';

const router = useRouter();
const isTestingApi = ref(false);

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

async function testApiConnection() {
  isTestingApi.value = true;
  try {
    // 触发事件让父组件处理API测试
    emit('test-api');
  } finally {
    setTimeout(() => {
      isTestingApi.value = false;
    }, 2000);
  }
}

const emit = defineEmits(['test-api']);
</script>

<template>
  <div class="header-container">
    <div class="back-button" @click="goBack">
      <RiArrowLeftSLine />
    </div>
    <div class="role-name">{{ roleName }}</div>
    <div class="test-api-button" @click="testApiConnection" v-if="!isTestingApi">
      <span class="test-text">测试API</span>
    </div>
    <div class="test-api-button testing" v-else>
      <div class="loading-spinner"></div>
      <span class="test-text">测试中...</span>
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
  height: 50px;
  box-sizing: border-box;
  position: relative; /* 添加相对定位 */
}

.back-button {
  font-size: 24px;
  cursor: pointer;
  width: 30px;
  flex-shrink: 0;
  text-align: left;
  position: relative; /* 添加相对定位 */
  z-index: 2; /* 确保在role-name之上 */
}

.role-name {
  font-weight: 600;
  font-size: 18px;
  position: absolute; /* 使用绝对定位 */
  left: 50%; /* 水平居中 */
  top: 50%; /* 垂直居中 */
  transform: translate(-50%, -50%); /* 完全居中 */
  z-index: 1; /* 确保在底层 */
  width: auto; /* 自适应宽度 */
  white-space: nowrap; /* 防止文字换行 */
}

.test-api-button {
  background-color: rgba(66, 184, 131, 0.2);
  color: #42b883;
  border: 1px solid #42b883;
  border-radius: 4px;
  padding: 5px 12px; /* 稍微增加一点内边距补偿图标的移除 */
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center; /* 添加居中对齐 */
  transition: all 0.2s ease;
  flex-shrink: 0;
  position: relative;
  z-index: 2;
}

.test-api-button:hover {
  background-color: rgba(66, 184, 131, 0.3);
}

.test-api-button.testing {
  background-color: rgba(66, 184, 131, 0.1);
  cursor: not-allowed;
}

.loading-spinner {
  width: 12px;
  height: 12px;
  border: 2px solid transparent;
  border-top-color: #42b883;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.test-text {
  white-space: nowrap;
}
</style> 
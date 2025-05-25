import { createApp } from 'vue';
import { createPinia } from 'pinia';
import './style.css';
import App from './App.vue';
import router from './router';
// 创建Pinia实例
const pinia = createPinia();
// 创建Vue应用
const app = createApp(App);
// 使用插件
app.use(router);
app.use(pinia);
// 挂载应用
app.mount('#app');
console.log('应用已挂载，Pinia状态管理已初始化');

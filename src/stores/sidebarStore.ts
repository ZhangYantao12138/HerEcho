import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSidebarStore = defineStore('sidebar', () => {
    const isOpen = ref(false);

    function toggle() {
        console.log('SidebarStore: 切换侧边栏状态');
        isOpen.value = !isOpen.value;
        console.log('SidebarStore: 新的侧边栏状态:', isOpen.value);
    }

    function close() {
        console.log('SidebarStore: 关闭侧边栏');
        isOpen.value = false;
    }

    return {
        isOpen,
        toggle,
        close
    };
}); 
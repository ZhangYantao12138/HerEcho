import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach } from 'vitest';
import ChatView from '../views/ChatView.vue';
import { createPinia, setActivePinia } from 'pinia';
import { createRouter, createWebHistory } from 'vue-router';
import { useChatStore } from '../store/chat';

describe('ChatView', () => {
    const router = createRouter({
        history: createWebHistory(),
        routes: [
            {
                path: '/chat/:characterId',
                name: 'chat',
                component: ChatView
            }
        ]
    });

    beforeEach(async () => {
        setActivePinia(createPinia());
        await router.push('/chat/test-character');
    });

    const mountComponent = () => {
        return mount(ChatView, {
            global: {
                plugins: [createPinia(), router],
                stubs: {
                    TopBar: true,
                    SettingBar: true,
                    ChatContainer: true
                }
            }
        });
    };

    it('应该正确渲染聊天界面', () => {
        const wrapper = mountComponent();
        expect(wrapper.find('.h-screen').exists()).toBe(true);
        expect(wrapper.find('.flex-1').exists()).toBe(true);
    });

    it('应该能发送消息', async () => {
        const wrapper = mountComponent();
        const input = wrapper.find('input[type="text"]');
        await input.setValue('测试消息');
        await wrapper.find('form').trigger('submit');

        const chatStore = useChatStore();
        expect(Object.keys(chatStore.messages).length).toBeGreaterThan(0);
    });

    it('应该能切换角色', async () => {
        const wrapper = mountComponent();
        // 触发 TopBar 组件的 toggle-settings 事件
        await wrapper.findComponent({ name: 'TopBar' }).vm.$emit('toggle-settings');
        // 检查设置面板是否显示
        expect(wrapper.findComponent({ name: 'SettingBar' }).exists()).toBe(true);
    });

    it('应该能生成自动回复选项', async () => {
        const wrapper = mountComponent();
        const chatStore = useChatStore();
        const options = await chatStore.generateAutoReplyOptions('test-character');
        expect(options.length).toBeGreaterThan(0);
    });
}); 
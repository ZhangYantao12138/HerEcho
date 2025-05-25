/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, onMounted, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { RiDeleteBin2Line } from '@remixicon/vue';
import ChatHeader from './ChatHeader.vue';
import ChatInput from './ChatInput.vue';
import BottomNav from './BottomNav.vue';
import { clearChatHistory, generateCharacterReply, setCurrentCharacter, generatePlayerReply } from '../services/chatService';
import { getDefaultCharacter, getCharacterById } from '../config/characters';
import { VIEWPOINT_MAPPING } from '../config/viewpointConfig';
// 获取路由参数
const route = useRoute();
const scriptId = route.params.scriptId;
const characterId = route.params.characterId;
// 验证路由参数
const router = useRouter();
if (!scriptId || !characterId) {
    router.push('/chat');
}
// 当前选中的角色
const currentCharacter = ref(getCharacterById(characterId) || getDefaultCharacter());
// 消息列表
const messages = ref([
    {
        id: Date.now(),
        content: `<div class="background-description">${currentCharacter.value.backgroundDescription}</div>`,
        isUser: false,
        hasAudio: false
    },
    ...currentCharacter.value.initialMessages
]);
// 添加计算属性获取最近的两条消息
const recentMessages = computed(() => {
    if (!isCollapsed.value)
        return messages.value;
    // 过滤掉背景描述消息
    const filteredMessages = messages.value.filter(msg => !msg.content.includes('background-description'));
    // 获取最近的两条消息
    return filteredMessages.slice(-2);
});
// 进度信息
const progress = ref(currentCharacter.value.sceneInfo.progress);
const isCollapsed = ref(false);
const chatContainerRef = ref(null);
const showClearConfirm = ref(false);
// 监听路由参数变化
watch(() => route.params, async (newParams) => {
    const newCharacterId = newParams.characterId;
    const newCharacter = getCharacterById(newCharacterId);
    if (newCharacter) {
        // 设置新角色
        currentCharacter.value = newCharacter;
        setCurrentCharacter(newCharacter);
        // 清除历史记录
        clearChatHistory();
        // 重置消息列表
        messages.value = [
            {
                id: Date.now(),
                content: `<div class="background-description">${newCharacter.backgroundDescription}</div>`,
                isUser: false,
                hasAudio: false
            }
        ];
        // 检查是否有对应的玩家视角
        const viewpoint = VIEWPOINT_MAPPING.find(vp => vp.characterId === newCharacterId);
        if (viewpoint) {
            // 如果有玩家视角，生成玩家视角的初始消息
            try {
                const playerPrompt = `你现在是${newCharacter.name}，请用简短的话开始对话。`;
                const playerResponse = await generatePlayerReply(newCharacterId, playerPrompt);
                messages.value.push({
                    id: Date.now(),
                    content: playerResponse,
                    isUser: false,
                    hasAudio: true
                });
            }
            catch (error) {
                console.error('生成玩家视角消息失败:', error);
            }
        }
        // 添加角色的初始消息
        messages.value.push(...newCharacter.initialMessages);
        // 重置进度
        progress.value = newCharacter.sceneInfo.progress;
        scrollToBottom();
    }
}, { immediate: true });
// 监听角色变化
watch(() => currentCharacter.value, () => {
    clearChatHistory();
}, { deep: true });
function sendMessage(text) {
    addUserMessage(text);
}
function selectOption(option) {
    addUserMessage(option);
}
function handleAIResponse(response) {
    messages.value.push({
        id: Date.now(),
        content: response,
        isUser: false,
        hasAudio: true
    });
    updateProgress();
    scrollToBottom();
}
function handleVoiceMessage(duration) {
    const voiceMessage = `(发送了一条 ${duration.toFixed(1)} 秒的语音消息)`;
    messages.value.push({
        id: Date.now(),
        content: voiceMessage,
        isUser: true,
        hasAudio: true
    });
    updateProgress();
    scrollToBottom();
}
function addUserMessage(text) {
    messages.value.push({
        id: Date.now(),
        content: text,
        isUser: true,
        hasAudio: false
    });
    updateProgress();
    scrollToBottom();
}
function updateProgress() {
    if (progress.value < 95) {
        progress.value += 5;
    }
}
function scrollToBottom() {
    setTimeout(() => {
        if (chatContainerRef.value && !isCollapsed.value) {
            chatContainerRef.value.scrollTop = chatContainerRef.value.scrollHeight;
        }
    }, 100);
}
function toggleCollapse() {
    isCollapsed.value = !isCollapsed.value;
}
function showClearDialog() {
    showClearConfirm.value = true;
}
function clearChat() {
    messages.value = [
        {
            id: Date.now(),
            content: `<div class="background-description">${currentCharacter.value.backgroundDescription}</div>`,
            isUser: false,
            hasAudio: false
        },
        ...currentCharacter.value.initialMessages
    ];
    clearChatHistory();
    progress.value = currentCharacter.value.sceneInfo.progress;
    showClearConfirm.value = false;
    scrollToBottom();
}
function cancelClear() {
    showClearConfirm.value = false;
}
async function testApiConnection() {
    try {
        const testMessage = "测试消息，请简短回复";
        const response = await generateCharacterReply(currentCharacter.value.id, testMessage);
        messages.value.push({
            id: Date.now(),
            content: `<span style="color: #42b883;">API测试成功！</span><br>回复: ${response}`,
            isUser: false,
            hasAudio: false
        });
        clearChatHistory();
        scrollToBottom();
    }
    catch (error) {
        messages.value.push({
            id: Date.now(),
            content: `<span style="color: #e74c3c;">API测试失败！</span><br>错误: ${error?.message || '未知错误'}`,
            isUser: false,
            hasAudio: false
        });
        scrollToBottom();
    }
}
onMounted(() => {
    scrollToBottom();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['background-fixed']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['collapsed']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['collapsed']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-container']} */ ;
/** @type {__VLS_StyleScopedClasses['user-message']} */ ;
/** @type {__VLS_StyleScopedClasses['message-bubble']} */ ;
/** @type {__VLS_StyleScopedClasses['character-message']} */ ;
/** @type {__VLS_StyleScopedClasses['message-bubble']} */ ;
/** @type {__VLS_StyleScopedClasses['clear-chat']} */ ;
/** @type {__VLS_StyleScopedClasses['arrow-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['confirm-content']} */ ;
/** @type {__VLS_StyleScopedClasses['confirm-content']} */ ;
/** @type {__VLS_StyleScopedClasses['cancel-button']} */ ;
/** @type {__VLS_StyleScopedClasses['confirm-button']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-container']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "chat-page" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "background-fixed" },
});
const __VLS_0 = {}.transition;
/** @type {[typeof __VLS_components.Transition, typeof __VLS_components.transition, typeof __VLS_components.Transition, typeof __VLS_components.transition, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    name: "fade",
}));
const __VLS_2 = __VLS_1({
    name: "fade",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
    key: (__VLS_ctx.currentCharacter.id),
    src: (__VLS_ctx.currentCharacter.backgroundImage),
    alt: (__VLS_ctx.currentCharacter.name),
});
var __VLS_3;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "content-wrapper" },
});
/** @type {[typeof ChatHeader, ]} */ ;
// @ts-ignore
const __VLS_4 = __VLS_asFunctionalComponent(ChatHeader, new ChatHeader({
    ...{ 'onTestApi': {} },
    currentCharacter: (__VLS_ctx.currentCharacter),
}));
const __VLS_5 = __VLS_4({
    ...{ 'onTestApi': {} },
    currentCharacter: (__VLS_ctx.currentCharacter),
}, ...__VLS_functionalComponentArgsRest(__VLS_4));
let __VLS_7;
let __VLS_8;
let __VLS_9;
const __VLS_10 = {
    onTestApi: (__VLS_ctx.testApiConnection)
};
var __VLS_6;
if (!__VLS_ctx.isCollapsed) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "scene-container" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "scene-info" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "scene-text" },
    });
    (__VLS_ctx.currentCharacter.sceneInfo.title);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "scene-stage" },
    });
    (__VLS_ctx.currentCharacter.sceneInfo.stage);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "progress-section" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "progress-bar" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "progress-fill" },
        ...{ style: ({ width: `${__VLS_ctx.progress}%` }) },
    });
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "chat-wrapper" },
    ...{ class: ({ 'collapsed': __VLS_ctx.isCollapsed }) },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "toggle-bar" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ onClick: (__VLS_ctx.showClearDialog) },
    ...{ class: "clear-chat" },
});
const __VLS_11 = {}.RiDeleteBin2Line;
/** @type {[typeof __VLS_components.RiDeleteBin2Line, ]} */ ;
// @ts-ignore
const __VLS_12 = __VLS_asFunctionalComponent(__VLS_11, new __VLS_11({}));
const __VLS_13 = __VLS_12({}, ...__VLS_functionalComponentArgsRest(__VLS_12));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ onClick: (__VLS_ctx.toggleCollapse) },
    ...{ class: "toggle-section" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
(__VLS_ctx.isCollapsed ? '展开对话' : '收起对话');
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "arrow-icon" },
    ...{ class: ({ 'rotate': __VLS_ctx.isCollapsed }) },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "chat-container" },
    ref: "chatContainerRef",
});
/** @type {typeof __VLS_ctx.chatContainerRef} */ ;
for (const [message] of __VLS_getVForSourceType(((__VLS_ctx.isCollapsed ? __VLS_ctx.recentMessages : __VLS_ctx.messages)))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (message.id),
        ...{ class: ([
                message.content.includes('background-description')
                    ? 'background-message-container'
                    : ['message-container', message.isUser ? 'user-message' : 'character-message']
            ]) },
    });
    if (message.content.includes('background-description')) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "background-description" },
        });
        (__VLS_ctx.currentCharacter.backgroundDescription);
    }
    else {
        if (message.hasAudio && !message.isUser) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "audio-icon" },
            });
        }
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "message-bubble" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "message-content" },
        });
        __VLS_asFunctionalDirective(__VLS_directives.vHtml)(null, { ...__VLS_directiveBindingRestFields, value: (message.content) }, null, null);
    }
}
/** @type {[typeof ChatInput, ]} */ ;
// @ts-ignore
const __VLS_15 = __VLS_asFunctionalComponent(ChatInput, new ChatInput({
    ...{ 'onSendMessage': {} },
    ...{ 'onSelectOption': {} },
    ...{ 'onSendVoice': {} },
    ...{ 'onAiResponse': {} },
    isCollapsed: (__VLS_ctx.isCollapsed),
    currentCharacter: (__VLS_ctx.currentCharacter),
    lastUserMessage: (__VLS_ctx.messages.length > 0 ? __VLS_ctx.messages.filter(m => m.isUser).slice(-1)[0] || undefined : undefined),
    lastCharacterMessage: (__VLS_ctx.messages.length > 0 ? __VLS_ctx.messages.filter(m => !m.isUser).slice(-1)[0] || undefined : undefined),
}));
const __VLS_16 = __VLS_15({
    ...{ 'onSendMessage': {} },
    ...{ 'onSelectOption': {} },
    ...{ 'onSendVoice': {} },
    ...{ 'onAiResponse': {} },
    isCollapsed: (__VLS_ctx.isCollapsed),
    currentCharacter: (__VLS_ctx.currentCharacter),
    lastUserMessage: (__VLS_ctx.messages.length > 0 ? __VLS_ctx.messages.filter(m => m.isUser).slice(-1)[0] || undefined : undefined),
    lastCharacterMessage: (__VLS_ctx.messages.length > 0 ? __VLS_ctx.messages.filter(m => !m.isUser).slice(-1)[0] || undefined : undefined),
}, ...__VLS_functionalComponentArgsRest(__VLS_15));
let __VLS_18;
let __VLS_19;
let __VLS_20;
const __VLS_21 = {
    onSendMessage: (__VLS_ctx.sendMessage)
};
const __VLS_22 = {
    onSelectOption: (__VLS_ctx.selectOption)
};
const __VLS_23 = {
    onSendVoice: (__VLS_ctx.handleVoiceMessage)
};
const __VLS_24 = {
    onAiResponse: (__VLS_ctx.handleAIResponse)
};
var __VLS_17;
/** @type {[typeof BottomNav, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(BottomNav, new BottomNav({}));
const __VLS_26 = __VLS_25({}, ...__VLS_functionalComponentArgsRest(__VLS_25));
if (__VLS_ctx.showClearConfirm) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "confirm-dialog" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "confirm-content" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "confirm-buttons" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.cancelClear) },
        ...{ class: "cancel-button" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.clearChat) },
        ...{ class: "confirm-button" },
    });
}
/** @type {__VLS_StyleScopedClasses['chat-page']} */ ;
/** @type {__VLS_StyleScopedClasses['background-fixed']} */ ;
/** @type {__VLS_StyleScopedClasses['content-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['scene-container']} */ ;
/** @type {__VLS_StyleScopedClasses['scene-info']} */ ;
/** @type {__VLS_StyleScopedClasses['scene-text']} */ ;
/** @type {__VLS_StyleScopedClasses['scene-stage']} */ ;
/** @type {__VLS_StyleScopedClasses['progress-section']} */ ;
/** @type {__VLS_StyleScopedClasses['progress-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['progress-fill']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['collapsed']} */ ;
/** @type {__VLS_StyleScopedClasses['toggle-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['clear-chat']} */ ;
/** @type {__VLS_StyleScopedClasses['toggle-section']} */ ;
/** @type {__VLS_StyleScopedClasses['arrow-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['rotate']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-container']} */ ;
/** @type {__VLS_StyleScopedClasses['background-description']} */ ;
/** @type {__VLS_StyleScopedClasses['audio-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['message-bubble']} */ ;
/** @type {__VLS_StyleScopedClasses['message-content']} */ ;
/** @type {__VLS_StyleScopedClasses['confirm-dialog']} */ ;
/** @type {__VLS_StyleScopedClasses['confirm-content']} */ ;
/** @type {__VLS_StyleScopedClasses['confirm-buttons']} */ ;
/** @type {__VLS_StyleScopedClasses['cancel-button']} */ ;
/** @type {__VLS_StyleScopedClasses['confirm-button']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            RiDeleteBin2Line: RiDeleteBin2Line,
            ChatHeader: ChatHeader,
            ChatInput: ChatInput,
            BottomNav: BottomNav,
            currentCharacter: currentCharacter,
            messages: messages,
            recentMessages: recentMessages,
            progress: progress,
            isCollapsed: isCollapsed,
            chatContainerRef: chatContainerRef,
            showClearConfirm: showClearConfirm,
            sendMessage: sendMessage,
            selectOption: selectOption,
            handleAIResponse: handleAIResponse,
            handleVoiceMessage: handleVoiceMessage,
            toggleCollapse: toggleCollapse,
            showClearDialog: showClearDialog,
            clearChat: clearChat,
            cancelClear: cancelClear,
            testApiConnection: testApiConnection,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */

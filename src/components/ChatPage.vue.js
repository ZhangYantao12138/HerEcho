/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, onMounted, computed } from 'vue';
// 解决方案一：选择 main 分支的图标导入
import { RiDeleteBin2Line } from '@remixicon/vue';
// import { Icon } from '@iconify/vue';
import ChatHeader from './ChatHeader.vue';
import ChatInput from './ChatInput.vue';
import BottomNav from './BottomNav.vue';
// 解决方案二：选择 main 分支的服务导入
import { clearChatHistory } from '../services/chatService';
import { getDefaultCharacter } from '../config/characters';
import { VIEWPOINT_MAPPING } from '../services/viewpointService';
import { logViewpointChange } from '../services/logService';
// 使用Vite的资源导入方式导入背景图片
import bgImageSrc from '../assets/character_qqc_B001C001.png';
const bgImage = bgImageSrc;
// 修复：移除内联的 defaultCharacter 定义，并确保 currentCharacter 只被定义一次
// const defaultCharacter: Character = { ... }; // 这个详细的定义可以删除或注释掉
// 当前角色 - 确保只定义一次，并使用 getDefaultCharacter
const currentCharacter = ref(getDefaultCharacter());
// 当前视角关系
const currentViewpoint = ref(VIEWPOINT_MAPPING.find(vp => vp.characterId === currentCharacter.value.id));
// 更新消息内容以符合羌青瓷和程聿怀的角色扮演场景
const messages = ref([
    {
        id: 1,
        content: '(摇晃着盛满白葡萄酒的高脚杯，背对着你靠在桌前。听到脚步声后歪了歪唇，没有回头，只是抿了一口杯中的酒，随后轻轻地把酒杯放在桌子上，轻声笑了) "牵，你来了。"',
        isUser: false,
        hasAudio: true
    },
    {
        id: 2,
        content: '(伸手环住他的腰，将脸埋进他的后背) 羌青瓷，我来了。',
        isUser: true,
        hasAudio: false
    },
    {
        id: 3,
        content: '(轻笑一声，没有挣开你的怀抱，只是拿起酒杯又抿了一口酒，随后转身面对着你，微微俯身凑近你，温热的呼吸洒在你的脸上) "今天怎么这么粘人？"',
        isUser: false,
        hasAudio: true
    },
    {
        id: 4,
        content: '(伸手搭住他的肩膀，凑近他的耳边轻声说) "我今天......有点想你。"',
        isUser: true,
        hasAudio: false
    },
    {
        id: 5,
        content: '(喉结滚动，轻笑着将你推开一些，与你四目相对，眼中带着笑意) "哦？是吗？我还以为程医生巴不得离我远点呢。"',
        isUser: false,
        hasAudio: true
    }
]);
// 视角切换处理
function handleViewpointChange(viewpoint) {
    console.log(`用户切换视角关系: ${viewpoint.promptKey}, 角色: ${currentCharacter.value.name}(${currentCharacter.value.id})`);
    logViewpointChange(viewpoint.promptKey, currentCharacter.value.id, currentCharacter.value.name);
    currentViewpoint.value = viewpoint;
    // 添加视角切换的系统消息
    let viewpointMessage = '';
    switch (viewpoint.promptKey) {
        case 'BJX_TO_CZL':
            viewpointMessage = '【已切换到蒋伯驾视角】';
            break;
        case 'YS_TO_MHM':
            viewpointMessage = '【已切换到以撒视角】';
            break;
        default:
            viewpointMessage = '【已切换到默认视角】';
    }
    // 添加系统消息
    messages.value.push({
        id: Date.now(),
        content: viewpointMessage,
        isUser: false,
        hasAudio: false,
        isSystem: true
    });
    scrollToBottom();
}
// 情节信息
const sceneInfo = {
    title: '（番外）你与羌青瓷重逢后的日常',
    stage: '相爱阶段',
    progress: 40
};
const progress = ref(sceneInfo.progress);
const isCollapsed = ref(false); // 默认展开状态
const chatContainerRef = ref(null);
const showClearConfirm = ref(false); // 添加清除确认对话框状态
// const currentCharacter = ref<Character>(getDefaultCharacter()); // 确保此行已被上面的统一定义替换或删除
// 定义 testApiConnection 函数
const testApiConnection = async () => {
    console.log("尝试连接 API...");
    try {
        // 这里可以添加实际的API测试逻辑
        console.log("API 测试成功");
        // 在这里处理API测试成功的逻辑，例如显示一个提示
    }
    catch (error) {
        console.error("API 测试失败:", error);
        // 在这里处理API测试失败的逻辑
    }
};
// 发送消息
function sendMessage(text) {
    console.log(`用户发送消息: "${text.substring(0, 30)}${text.length > 30 ? '...' : ''}" 给角色: ${currentCharacter.value.name}(${currentCharacter.value.id})`);
    addUserMessage(text);
    // 不再需要这里的自动回复，因为会由AI响应事件处理
}
function selectOption(option) {
    addUserMessage(option);
    // 不再需要这里的自动回复，因为会由AI响应事件处理
}
function handleAIResponse(response) {
    messages.value.push({
        id: Date.now(),
        content: response,
        isUser: false,
        hasAudio: true
    });
    console.log(`角色 ${currentCharacter.value.name}(${currentCharacter.value.id}) 回复了消息`);
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
    // 语音消息的AI响应会通过handleAIResponse处理，不需要在这里模拟
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
// 添加清除对话功能
function showClearDialog() {
    showClearConfirm.value = true;
}
function clearChat() {
    // 清除本地消息
    messages.value = [
        {
            id: Date.now(),
            content: '(优雅地站在窗边，看着窗外的风景，听到你进来的脚步声，转身微笑) "聿怀，你来了。有什么想和我聊的吗？"',
            isUser: false,
            hasAudio: true
        }
    ];
    // 清除DeepSeek API的对话历史
    clearChatHistory(); // 这个函数来自于导入
    // 重置进度
    progress.value = 10;
    // 隐藏确认对话框
    showClearConfirm.value = false;
    // 滚动到底部
    scrollToBottom();
}
function cancelClear() {
    showClearConfirm.value = false;
}
// 添加计算属性获取最后的消息
const lastUserMessage = computed(() => {
    const userMessages = messages.value.filter(m => m.isUser);
    return userMessages.length > 0 ? userMessages[userMessages.length - 1] : undefined;
});
const lastCharacterMessage = computed(() => {
    const characterMessages = messages.value.filter(m => !m.isUser && !m.isSystem);
    return characterMessages.length > 0 ? characterMessages[characterMessages.length - 1] : undefined;
});
onMounted(() => {
    scrollToBottom();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['background-fixed']} */ ;
/** @type {__VLS_StyleScopedClasses['clear-chat']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['collapsed']} */ ;
/** @type {__VLS_StyleScopedClasses['user-message']} */ ;
/** @type {__VLS_StyleScopedClasses['message-bubble']} */ ;
/** @type {__VLS_StyleScopedClasses['character-message']} */ ;
/** @type {__VLS_StyleScopedClasses['message-bubble']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-container']} */ ;
/** @type {__VLS_StyleScopedClasses['confirm-content']} */ ;
/** @type {__VLS_StyleScopedClasses['confirm-content']} */ ;
/** @type {__VLS_StyleScopedClasses['cancel-button']} */ ;
/** @type {__VLS_StyleScopedClasses['confirm-button']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "chat-page" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "background-fixed" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
    src: (__VLS_ctx.bgImage),
    alt: "羌青瓷",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "content-wrapper" },
});
/** @type {[typeof ChatHeader, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(ChatHeader, new ChatHeader({
    ...{ 'onTestApi': {} },
    ...{ 'onChangeViewpoint': {} },
    currentCharacter: (__VLS_ctx.currentCharacter),
}));
const __VLS_1 = __VLS_0({
    ...{ 'onTestApi': {} },
    ...{ 'onChangeViewpoint': {} },
    currentCharacter: (__VLS_ctx.currentCharacter),
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
let __VLS_3;
let __VLS_4;
let __VLS_5;
const __VLS_6 = {
    onTestApi: (__VLS_ctx.testApiConnection)
};
const __VLS_7 = {
    onChangeViewpoint: (__VLS_ctx.handleViewpointChange)
};
var __VLS_2;
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
    (__VLS_ctx.sceneInfo.title);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "scene-stage" },
    });
    (__VLS_ctx.sceneInfo.stage);
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
const __VLS_8 = {}.RiDeleteBin2Line;
/** @type {[typeof __VLS_components.RiDeleteBin2Line, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({}));
const __VLS_10 = __VLS_9({}, ...__VLS_functionalComponentArgsRest(__VLS_9));
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
const __VLS_12 = {}.RiArrowUpSLine;
/** @type {[typeof __VLS_components.RiArrowUpSLine, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({}));
const __VLS_14 = __VLS_13({}, ...__VLS_functionalComponentArgsRest(__VLS_13));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "chat-container" },
    ref: "chatContainerRef",
});
/** @type {typeof __VLS_ctx.chatContainerRef} */ ;
for (const [message] of __VLS_getVForSourceType((__VLS_ctx.messages))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (message.id),
        ...{ class: ([
                'message-container',
                message.isUser ? 'user-message' :
                    message.isSystem ? 'system-message' : 'character-message'
            ]) },
    });
    if (message.hasAudio && !message.isUser && !message.isSystem) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "audio-icon" },
        });
    }
    if (!message.isSystem) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "message-bubble" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "message-content" },
        });
        __VLS_asFunctionalDirective(__VLS_directives.vHtml)(null, { ...__VLS_directiveBindingRestFields, value: (message.content) }, null, null);
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "system-message-content" },
        });
        (message.content);
    }
}
/** @type {[typeof ChatInput, ]} */ ;
// @ts-ignore
const __VLS_16 = __VLS_asFunctionalComponent(ChatInput, new ChatInput({
    ...{ 'onSendMessage': {} },
    ...{ 'onSelectOption': {} },
    ...{ 'onSendVoice': {} },
    ...{ 'onAiResponse': {} },
    isCollapsed: (__VLS_ctx.isCollapsed),
    currentCharacter: (__VLS_ctx.currentCharacter),
    lastUserMessage: (__VLS_ctx.lastUserMessage),
    lastCharacterMessage: (__VLS_ctx.lastCharacterMessage),
}));
const __VLS_17 = __VLS_16({
    ...{ 'onSendMessage': {} },
    ...{ 'onSelectOption': {} },
    ...{ 'onSendVoice': {} },
    ...{ 'onAiResponse': {} },
    isCollapsed: (__VLS_ctx.isCollapsed),
    currentCharacter: (__VLS_ctx.currentCharacter),
    lastUserMessage: (__VLS_ctx.lastUserMessage),
    lastCharacterMessage: (__VLS_ctx.lastCharacterMessage),
}, ...__VLS_functionalComponentArgsRest(__VLS_16));
let __VLS_19;
let __VLS_20;
let __VLS_21;
const __VLS_22 = {
    onSendMessage: (__VLS_ctx.sendMessage)
};
const __VLS_23 = {
    onSelectOption: (__VLS_ctx.selectOption)
};
const __VLS_24 = {
    onSendVoice: (__VLS_ctx.handleVoiceMessage)
};
const __VLS_25 = {
    onAiResponse: (__VLS_ctx.handleAIResponse)
};
var __VLS_18;
/** @type {[typeof BottomNav, ]} */ ;
// @ts-ignore
const __VLS_26 = __VLS_asFunctionalComponent(BottomNav, new BottomNav({}));
const __VLS_27 = __VLS_26({}, ...__VLS_functionalComponentArgsRest(__VLS_26));
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
/** @type {__VLS_StyleScopedClasses['message-container']} */ ;
/** @type {__VLS_StyleScopedClasses['audio-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['message-bubble']} */ ;
/** @type {__VLS_StyleScopedClasses['message-content']} */ ;
/** @type {__VLS_StyleScopedClasses['system-message-content']} */ ;
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
            bgImage: bgImage,
            currentCharacter: currentCharacter,
            messages: messages,
            handleViewpointChange: handleViewpointChange,
            sceneInfo: sceneInfo,
            progress: progress,
            isCollapsed: isCollapsed,
            chatContainerRef: chatContainerRef,
            showClearConfirm: showClearConfirm,
            testApiConnection: testApiConnection,
            sendMessage: sendMessage,
            selectOption: selectOption,
            handleAIResponse: handleAIResponse,
            handleVoiceMessage: handleVoiceMessage,
            toggleCollapse: toggleCollapse,
            showClearDialog: showClearDialog,
            clearChat: clearChat,
            cancelClear: cancelClear,
            lastUserMessage: lastUserMessage,
            lastCharacterMessage: lastCharacterMessage,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */

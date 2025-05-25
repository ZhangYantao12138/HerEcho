/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { RiMic2Line, RiKeyboardLine, RiMessage2Line, RiAddCircleLine, RiLoader4Line } from '@remixicon/vue';
import { generateCharacterReply, generateAutoReplies } from '../services/chatService';
const props = defineProps({
    isCollapsed: {
        type: Boolean,
        default: false
    },
    currentCharacter: {
        type: Object,
        required: true
    },
    lastUserMessage: {
        type: Object,
        default: undefined
    },
    lastCharacterMessage: {
        type: Object,
        default: undefined
    }
});
const inputText = ref('');
const showOptions = ref(false);
const isVoiceMode = ref(false);
const isRecording = ref(false);
const recordingDuration = ref(0);
const recordingTimer = ref(null);
const isProcessing = ref(false);
const errorMessage = ref('');
const showError = ref(false);
const emit = defineEmits(['send-message', 'select-option', 'send-voice', 'ai-response']);
// 根据角色ID动态生成选项
const options = ref([]);
const autoReplyOptions = ref([]);
const isGeneratingAutoReply = ref(false);
// 错误类型映射
const errorTypes = {
    'network': '网络连接异常，请检查网络设置',
    'timeout': '请求超时，请稍后重试',
    'api': 'API/服务器响应异常，请稍后重试',
    'unknown': '发生未知错误，请稍后重试'
};
// 显示错误提示
function showErrorMessage(type) {
    errorMessage.value = errorTypes[type];
    showError.value = true;
    setTimeout(() => {
        showError.value = false;
    }, 3000);
}
// 更新对话选项
function updateDialogOptions() {
    switch (props.currentCharacter?.id) {
        case 'B001C001': // 羌青瓷
            options.value = [
                '羌青瓷，你还记得我们第一次相遇吗？',
                '(轻轻握住你的手) 我很想你...',
                '为什么当年你要消除我的记忆？',
                '你能告诉我更多关于莱诺家族的事吗？'
            ];
            break;
        case 'B001C005': // 黛利拉
            options.value = [
                '(小心翼翼地靠近) 能告诉我布雷诺的事吗？',
                '摩伊拉对你来说意味着什么？',
                '(注视她的刀) 你第一次拿起刀是什么时候？',
                '你觉得这个世界上有值得信任的人吗？'
            ];
            break;
        case 'B001C006': // 蒋伯驾
            options.value = [
                '(审视地看着他) 你打算如何进入缪家？',
                '蒋先生，你对缪宏谟了解多少？',
                '(微微皱眉) 你的计划会伤害到无辜的人吗？',
                '我想了解更多关于你过去的事'
            ];
            break;
        case 'B001C007': // 缪宏谟
            options.value = [
                '(盯着她的眼睛) 你知道布雷诺的战火燃到哪里了吗？',
                '缪家的赌场是怎么运作的？',
                '你是真的相信赌局的公平吗？',
                '(讲述一个布雷诺的故事)'
            ];
            break;
        default:
            options.value = [
                `${props.currentCharacter?.name}，你能告诉我更多关于自己的事吗？`,
                `(表情认真) 最近过得怎么样？`,
                `你对当前的处境有什么想法？`,
                `(安静地等待对方说些什么)`
            ];
    }
}
const inputContainerRef = ref(null);
function handleClickOutside(event) {
    if (inputContainerRef.value && !inputContainerRef.value.contains(event.target)) {
        showOptions.value = false;
    }
}
onMounted(() => {
    document.addEventListener('click', handleClickOutside);
    updateDialogOptions();
});
onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
});
// 监听角色变化，更新选项并处理自动回复
watch(() => props.currentCharacter, async (newCharacter, oldCharacter) => {
    // 更新对话选项
    updateDialogOptions();
    // 清空自动回复选项
    autoReplyOptions.value = [];
    // 如果新角色是羌青瓷 (B001C001) 并且旧角色是程聿怀之一 (B001C002或B001C003)
    if (newCharacter?.id === 'B001C001' &&
        (oldCharacter?.id === 'B001C002' || oldCharacter?.id === 'B001C003')) {
        const memoryQuestion = '为什么当年你要消除我的记忆？';
        // 自动选择该选项
        selectOption(memoryQuestion);
    }
}, { deep: true });
// 监听最后一条角色消息变化
watch(() => props.lastCharacterMessage, async (newMessage) => {
    if (newMessage) {
        // 清空之前的自动回复选项
        autoReplyOptions.value = [];
        // 生成新的自动回复选项
        await generateAutoReplyOptions();
    }
}, { deep: true });
// 生成自动回复选项
async function generateAutoReplyOptions() {
    if (!props.lastCharacterMessage || isGeneratingAutoReply.value)
        return;
    try {
        isGeneratingAutoReply.value = true;
        const options = await generateAutoReplies(props.currentCharacter.id, props.lastCharacterMessage.content);
        autoReplyOptions.value = options;
    }
    catch (error) {
        console.error('生成自动回复选项失败:', error);
        showErrorMessage('api');
    }
    finally {
        isGeneratingAutoReply.value = false;
    }
}
// 切换选项面板
async function toggleOptions() {
    showOptions.value = !showOptions.value;
    // 如果打开面板且还没有生成过选项，则开始生成
    if (showOptions.value && autoReplyOptions.value.length === 0) {
        await generateAutoReplyOptions();
    }
}
// 选择选项
async function selectOption(option) {
    // 检查是否只有括号没有正文
    let userOption = option;
    const bracketOnlyRegex = /^\([^)]*\)$/;
    if (bracketOnlyRegex.test(userOption)) {
        const characterName = props.currentCharacter?.name || '你';
        userOption = `${userOption} ${characterName}...`;
    }
    emit('select-option', userOption);
    showOptions.value = false;
    // 调用AI服务获取回复
    try {
        isProcessing.value = true;
        const aiResponse = await generateCharacterReply(props.currentCharacter.id, userOption);
        emit('ai-response', aiResponse);
    }
    catch (error) {
        console.error('获取AI回复失败:', error);
        emit('ai-response', `(${props.currentCharacter.name}轻轻叹息) 我们的连接似乎出了些问题，能稍后再谈吗？`);
    }
    finally {
        isProcessing.value = false;
    }
}
async function sendMessage() {
    if (inputText.value.trim()) {
        let userMessage = inputText.value.trim();
        // 检查是否只有括号没有正文
        const bracketOnlyRegex = /^\([^)]*\)$/;
        if (bracketOnlyRegex.test(userMessage)) {
            // 如果只有括号，添加一个默认的文本内容
            const characterName = props.currentCharacter?.name || '你';
            userMessage = `${userMessage} ${characterName}...`;
        }
        emit('send-message', userMessage);
        inputText.value = '';
        // 调用AI服务获取回复
        try {
            isProcessing.value = true;
            const aiResponse = await generateCharacterReply(props.currentCharacter.id, userMessage);
            emit('ai-response', aiResponse);
        }
        catch (error) {
            console.error('获取AI回复失败:', error);
            // 根据错误类型显示不同的错误提示
            if (error.name === 'AbortError') {
                showErrorMessage('timeout');
            }
            else if (error.message?.includes('network')) {
                showErrorMessage('network');
            }
            else if (error.message?.includes('API')) {
                showErrorMessage('api');
            }
            else {
                showErrorMessage('unknown');
            }
            // 使用角色的fallback回复
            emit('ai-response', `(${props.currentCharacter.name}神情恍惚) 抱歉，我需要整理一下思绪...`);
        }
        finally {
            isProcessing.value = false;
        }
    }
}
function toggleInputMode() {
    isVoiceMode.value = !isVoiceMode.value;
    if (isVoiceMode.value) {
        inputText.value = '';
    }
}
function startRecording() {
    if (!isVoiceMode.value)
        return;
    isRecording.value = true;
    recordingDuration.value = 0;
    recordingTimer.value = setInterval(() => {
        recordingDuration.value += 0.1;
    }, 100);
}
async function stopRecording() {
    if (!isRecording.value)
        return;
    isRecording.value = false;
    if (recordingTimer.value) {
        clearInterval(recordingTimer.value);
        recordingTimer.value = null;
    }
    if (recordingDuration.value >= 0.5) { // 最少录音0.5秒
        emit('send-voice', recordingDuration.value);
        // 生成适用于当前角色的语音消息提示
        const voicePrompt = `您向${props.currentCharacter.name}发送了一段语音消息`;
        try {
            isProcessing.value = true;
            const aiResponse = await generateCharacterReply(props.currentCharacter.id, voicePrompt);
            emit('ai-response', aiResponse);
        }
        catch (error) {
            console.error('获取AI回复失败:', error);
            // 使用角色名称定制错误信息
            emit('ai-response', `(${props.currentCharacter.name}似乎没有听清) 抱歉，你能再说一次吗？`);
        }
        finally {
            isProcessing.value = false;
        }
    }
    recordingDuration.value = 0;
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['input-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['voice-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-options']} */ ;
/** @type {__VLS_StyleScopedClasses['add-button']} */ ;
/** @type {__VLS_StyleScopedClasses['disabled']} */ ;
/** @type {__VLS_StyleScopedClasses['option-item']} */ ;
/** @type {__VLS_StyleScopedClasses['option-item']} */ ;
/** @type {__VLS_StyleScopedClasses['option-item']} */ ;
/** @type {__VLS_StyleScopedClasses['disabled']} */ ;
/** @type {__VLS_StyleScopedClasses['option-item']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-options']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-options']} */ ;
/** @type {__VLS_StyleScopedClasses['disabled']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-options']} */ ;
/** @type {__VLS_StyleScopedClasses['loading']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-options']} */ ;
/** @type {__VLS_StyleScopedClasses['loading']} */ ;
/** @type {__VLS_StyleScopedClasses['loading-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['voice-input-area']} */ ;
/** @type {__VLS_StyleScopedClasses['disabled']} */ ;
/** @type {__VLS_StyleScopedClasses['recording']} */ ;
/** @type {__VLS_StyleScopedClasses['voice-input-area']} */ ;
/** @type {__VLS_StyleScopedClasses['error-message']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "input-container" },
    ref: "inputContainerRef",
});
/** @type {typeof __VLS_ctx.inputContainerRef} */ ;
if (__VLS_ctx.showOptions) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "options-panel" },
    });
    if (__VLS_ctx.isGeneratingAutoReply) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "option-item loading" },
        });
        const __VLS_0 = {}.RiLoader4Line;
        /** @type {[typeof __VLS_components.RiLoader4Line, ]} */ ;
        // @ts-ignore
        const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
            ...{ class: "loading-icon" },
        }));
        const __VLS_2 = __VLS_1({
            ...{ class: "loading-icon" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_1));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    }
    else {
        for (const [option, index] of __VLS_getVForSourceType((__VLS_ctx.autoReplyOptions))) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ onClick: (...[$event]) => {
                        if (!(__VLS_ctx.showOptions))
                            return;
                        if (!!(__VLS_ctx.isGeneratingAutoReply))
                            return;
                        __VLS_ctx.selectOption(option);
                    } },
                key: (index),
                ...{ class: "option-item" },
                ...{ class: ({ 'disabled': __VLS_ctx.isProcessing }) },
            });
            (option);
        }
    }
}
if (__VLS_ctx.showError) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "error-message" },
        ...{ class: ({ 'show': __VLS_ctx.showError }) },
    });
    (__VLS_ctx.errorMessage);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "input-wrapper" },
    ...{ class: ({ 'recording': __VLS_ctx.isRecording }) },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ onClick: (__VLS_ctx.toggleInputMode) },
    ...{ class: "voice-icon" },
});
if (!__VLS_ctx.isVoiceMode) {
    const __VLS_4 = {}.RiMic2Line;
    /** @type {[typeof __VLS_components.RiMic2Line, ]} */ ;
    // @ts-ignore
    const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({}));
    const __VLS_6 = __VLS_5({}, ...__VLS_functionalComponentArgsRest(__VLS_5));
}
else {
    const __VLS_8 = {}.RiKeyboardLine;
    /** @type {[typeof __VLS_components.RiKeyboardLine, ]} */ ;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({}));
    const __VLS_10 = __VLS_9({}, ...__VLS_functionalComponentArgsRest(__VLS_9));
}
if (!__VLS_ctx.isVoiceMode) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
        ...{ onKeyup: (__VLS_ctx.sendMessage) },
        ...{ onClick: (...[$event]) => {
                if (!(!__VLS_ctx.isVoiceMode))
                    return;
                __VLS_ctx.showOptions = false;
            } },
        type: "text",
        value: (__VLS_ctx.inputText),
        placeholder: "",
        disabled: (__VLS_ctx.isProcessing),
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "action-buttons" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ onClick: (__VLS_ctx.toggleOptions) },
        ...{ class: "chat-options" },
        ...{ class: ({
                'disabled': __VLS_ctx.isProcessing,
                'loading': __VLS_ctx.isGeneratingAutoReply
            }) },
    });
    if (__VLS_ctx.isGeneratingAutoReply) {
        const __VLS_12 = {}.RiLoader4Line;
        /** @type {[typeof __VLS_components.RiLoader4Line, ]} */ ;
        // @ts-ignore
        const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
            ...{ class: "loading-icon" },
        }));
        const __VLS_14 = __VLS_13({
            ...{ class: "loading-icon" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    }
    else {
        const __VLS_16 = {}.RiMessage2Line;
        /** @type {[typeof __VLS_components.RiMessage2Line, ]} */ ;
        // @ts-ignore
        const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({}));
        const __VLS_18 = __VLS_17({}, ...__VLS_functionalComponentArgsRest(__VLS_17));
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ onClick: (__VLS_ctx.sendMessage) },
        ...{ class: "add-button" },
        ...{ class: ({ 'disabled': __VLS_ctx.isProcessing }) },
    });
    const __VLS_20 = {}.RiAddCircleLine;
    /** @type {[typeof __VLS_components.RiAddCircleLine, ]} */ ;
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({}));
    const __VLS_22 = __VLS_21({}, ...__VLS_functionalComponentArgsRest(__VLS_21));
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ onMousedown: (__VLS_ctx.startRecording) },
        ...{ onMouseup: (__VLS_ctx.stopRecording) },
        ...{ onTouchstart: (__VLS_ctx.startRecording) },
        ...{ onTouchend: (__VLS_ctx.stopRecording) },
        ...{ class: "voice-input-area" },
        ...{ class: ({ 'disabled': __VLS_ctx.isProcessing }) },
    });
    (__VLS_ctx.isRecording ? '松开发送' : (__VLS_ctx.isProcessing ? `${props.currentCharacter.name}思考中...` : '按住说话'));
    if (__VLS_ctx.isRecording) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "recording-duration" },
        });
        (__VLS_ctx.recordingDuration.toFixed(1));
    }
}
/** @type {__VLS_StyleScopedClasses['input-container']} */ ;
/** @type {__VLS_StyleScopedClasses['options-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['option-item']} */ ;
/** @type {__VLS_StyleScopedClasses['loading']} */ ;
/** @type {__VLS_StyleScopedClasses['loading-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['option-item']} */ ;
/** @type {__VLS_StyleScopedClasses['disabled']} */ ;
/** @type {__VLS_StyleScopedClasses['error-message']} */ ;
/** @type {__VLS_StyleScopedClasses['show']} */ ;
/** @type {__VLS_StyleScopedClasses['input-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['recording']} */ ;
/** @type {__VLS_StyleScopedClasses['voice-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['action-buttons']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-options']} */ ;
/** @type {__VLS_StyleScopedClasses['disabled']} */ ;
/** @type {__VLS_StyleScopedClasses['loading']} */ ;
/** @type {__VLS_StyleScopedClasses['loading-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['add-button']} */ ;
/** @type {__VLS_StyleScopedClasses['disabled']} */ ;
/** @type {__VLS_StyleScopedClasses['voice-input-area']} */ ;
/** @type {__VLS_StyleScopedClasses['disabled']} */ ;
/** @type {__VLS_StyleScopedClasses['recording-duration']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            RiMic2Line: RiMic2Line,
            RiKeyboardLine: RiKeyboardLine,
            RiMessage2Line: RiMessage2Line,
            RiAddCircleLine: RiAddCircleLine,
            RiLoader4Line: RiLoader4Line,
            inputText: inputText,
            showOptions: showOptions,
            isVoiceMode: isVoiceMode,
            isRecording: isRecording,
            recordingDuration: recordingDuration,
            isProcessing: isProcessing,
            errorMessage: errorMessage,
            showError: showError,
            autoReplyOptions: autoReplyOptions,
            isGeneratingAutoReply: isGeneratingAutoReply,
            inputContainerRef: inputContainerRef,
            toggleOptions: toggleOptions,
            selectOption: selectOption,
            sendMessage: sendMessage,
            toggleInputMode: toggleInputMode,
            startRecording: startRecording,
            stopRecording: stopRecording,
        };
    },
    emits: {},
    props: {
        isCollapsed: {
            type: Boolean,
            default: false
        },
        currentCharacter: {
            type: Object,
            required: true
        },
        lastUserMessage: {
            type: Object,
            default: undefined
        },
        lastCharacterMessage: {
            type: Object,
            default: undefined
        }
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    emits: {},
    props: {
        isCollapsed: {
            type: Boolean,
            default: false
        },
        currentCharacter: {
            type: Object,
            required: true
        },
        lastUserMessage: {
            type: Object,
            default: undefined
        },
        lastCharacterMessage: {
            type: Object,
            default: undefined
        }
    },
});
; /* PartiallyEnd: #4569/main.vue */

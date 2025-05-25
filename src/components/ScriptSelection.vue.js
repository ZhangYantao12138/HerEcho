/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import ScriptCard from './ScriptCard.vue';
import ScriptDetailsModal from './ScriptDetailsModal.vue';
import { scripts } from '../config/scripts';
const router = useRouter();
// 显示剧本详情弹窗
const showScriptDetails = ref(false);
const selectedScript = ref(null);
// 进入剧本
function enterScript(script) {
    if (script.isLocked) {
        showLockedMessage(script);
        return;
    }
    selectedScript.value = script;
    showScriptDetails.value = true;
}
// 开始聊天
function startChat(data) {
    if (!data.script)
        return;
    router.push(`/chat/${data.script.id}/${data.characterId}`);
    showScriptDetails.value = false;
}
// 继续聊天
function continueChat(data) {
    if (!data.script)
        return;
    router.push(`/chat/${data.script.id}/${data.characterId}`);
    showScriptDetails.value = false;
}
// 显示锁定信息
function showLockedMessage(script) {
    alert(`《${script.title}》尚未开放，敬请期待！`);
}
// 关闭详情弹窗
function closeDetails() {
    showScriptDetails.value = false;
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "script-selection-container" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "script-header" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "page-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "script-list-container" },
});
for (const [script] of __VLS_getVForSourceType((__VLS_ctx.scripts))) {
    /** @type {[typeof ScriptCard, ]} */ ;
    // @ts-ignore
    const __VLS_0 = __VLS_asFunctionalComponent(ScriptCard, new ScriptCard({
        ...{ 'onClick': {} },
        key: (script.id),
        script: (script),
    }));
    const __VLS_1 = __VLS_0({
        ...{ 'onClick': {} },
        key: (script.id),
        script: (script),
    }, ...__VLS_functionalComponentArgsRest(__VLS_0));
    let __VLS_3;
    let __VLS_4;
    let __VLS_5;
    const __VLS_6 = {
        onClick: (__VLS_ctx.enterScript)
    };
    var __VLS_2;
}
/** @type {[typeof ScriptDetailsModal, ]} */ ;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent(ScriptDetailsModal, new ScriptDetailsModal({
    ...{ 'onClose': {} },
    ...{ 'onStart': {} },
    ...{ 'onContinue': {} },
    script: (__VLS_ctx.selectedScript),
    show: (__VLS_ctx.showScriptDetails),
}));
const __VLS_8 = __VLS_7({
    ...{ 'onClose': {} },
    ...{ 'onStart': {} },
    ...{ 'onContinue': {} },
    script: (__VLS_ctx.selectedScript),
    show: (__VLS_ctx.showScriptDetails),
}, ...__VLS_functionalComponentArgsRest(__VLS_7));
let __VLS_10;
let __VLS_11;
let __VLS_12;
const __VLS_13 = {
    onClose: (__VLS_ctx.closeDetails)
};
const __VLS_14 = {
    onStart: (__VLS_ctx.startChat)
};
const __VLS_15 = {
    onContinue: (__VLS_ctx.continueChat)
};
var __VLS_9;
/** @type {__VLS_StyleScopedClasses['script-selection-container']} */ ;
/** @type {__VLS_StyleScopedClasses['script-header']} */ ;
/** @type {__VLS_StyleScopedClasses['page-title']} */ ;
/** @type {__VLS_StyleScopedClasses['script-list-container']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            ScriptCard: ScriptCard,
            ScriptDetailsModal: ScriptDetailsModal,
            scripts: scripts,
            showScriptDetails: showScriptDetails,
            selectedScript: selectedScript,
            enterScript: enterScript,
            startChat: startChat,
            continueChat: continueChat,
            closeDetails: closeDetails,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */

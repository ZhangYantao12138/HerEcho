/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
const __VLS_props = defineProps({
    isUser: {
        type: Boolean,
        default: false
    },
    message: {
        type: String,
        required: true
    },
    hasAudio: {
        type: Boolean,
        default: false
    }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['user-message']} */ ;
/** @type {__VLS_StyleScopedClasses['message-bubble']} */ ;
/** @type {__VLS_StyleScopedClasses['character-message']} */ ;
/** @type {__VLS_StyleScopedClasses['message-bubble']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "message-container" },
    ...{ class: ({ 'user-message': __VLS_ctx.isUser, 'character-message': !__VLS_ctx.isUser }) },
});
if (__VLS_ctx.hasAudio && !__VLS_ctx.isUser) {
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
__VLS_asFunctionalDirective(__VLS_directives.vHtml)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.message) }, null, null);
/** @type {__VLS_StyleScopedClasses['message-container']} */ ;
/** @type {__VLS_StyleScopedClasses['user-message']} */ ;
/** @type {__VLS_StyleScopedClasses['character-message']} */ ;
/** @type {__VLS_StyleScopedClasses['audio-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['message-bubble']} */ ;
/** @type {__VLS_StyleScopedClasses['message-content']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    props: {
        isUser: {
            type: Boolean,
            default: false
        },
        message: {
            type: String,
            required: true
        },
        hasAudio: {
            type: Boolean,
            default: false
        }
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    props: {
        isUser: {
            type: Boolean,
            default: false
        },
        message: {
            type: String,
            required: true
        },
        hasAudio: {
            type: Boolean,
            default: false
        }
    },
});
; /* PartiallyEnd: #4569/main.vue */

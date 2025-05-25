/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
const __VLS_props = defineProps();
const __VLS_emit = defineEmits(['click']);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['script-card']} */ ;
/** @type {__VLS_StyleScopedClasses['script-card']} */ ;
/** @type {__VLS_StyleScopedClasses['locked']} */ ;
/** @type {__VLS_StyleScopedClasses['script-cover']} */ ;
/** @type {__VLS_StyleScopedClasses['script-card']} */ ;
/** @type {__VLS_StyleScopedClasses['locked']} */ ;
/** @type {__VLS_StyleScopedClasses['script-cover']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.$emit('click', __VLS_ctx.script);
        } },
    ...{ class: "script-card" },
    ...{ class: ({ 'locked': __VLS_ctx.script.isLocked }) },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "script-cover" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
    src: (__VLS_ctx.script.coverImage),
    alt: "剧本封面",
});
if (__VLS_ctx.script.isNew) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "new-badge" },
    });
}
if (__VLS_ctx.script.isLocked) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "lock-overlay" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "lock-icon" },
    });
    if (__VLS_ctx.script.comingSoon) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "coming-soon" },
        });
    }
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "script-info" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
    ...{ class: "script-title" },
});
(__VLS_ctx.script.title);
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "script-description" },
});
(__VLS_ctx.script.description);
/** @type {__VLS_StyleScopedClasses['script-card']} */ ;
/** @type {__VLS_StyleScopedClasses['locked']} */ ;
/** @type {__VLS_StyleScopedClasses['script-cover']} */ ;
/** @type {__VLS_StyleScopedClasses['new-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['lock-overlay']} */ ;
/** @type {__VLS_StyleScopedClasses['lock-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['coming-soon']} */ ;
/** @type {__VLS_StyleScopedClasses['script-info']} */ ;
/** @type {__VLS_StyleScopedClasses['script-title']} */ ;
/** @type {__VLS_StyleScopedClasses['script-description']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    emits: {},
    __typeProps: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    emits: {},
    __typeProps: {},
});
; /* PartiallyEnd: #4569/main.vue */

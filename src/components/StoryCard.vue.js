/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
const __VLS_props = defineProps();
const __VLS_emit = defineEmits(['click']);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['story-card']} */ ;
/** @type {__VLS_StyleScopedClasses['story-card']} */ ;
/** @type {__VLS_StyleScopedClasses['locked']} */ ;
/** @type {__VLS_StyleScopedClasses['story-cover']} */ ;
/** @type {__VLS_StyleScopedClasses['story-card']} */ ;
/** @type {__VLS_StyleScopedClasses['locked']} */ ;
/** @type {__VLS_StyleScopedClasses['story-cover']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.$emit('click', __VLS_ctx.story);
        } },
    ...{ class: "story-card" },
    ...{ class: ({ 'locked': __VLS_ctx.story.isLocked }) },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "story-cover" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
    src: (__VLS_ctx.story.coverImage),
    alt: "故事封面",
});
if (__VLS_ctx.story.isNew) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "new-badge" },
    });
}
if (__VLS_ctx.story.isLocked) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "lock-overlay" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "lock-icon" },
    });
    if (__VLS_ctx.story.comingSoon) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "coming-soon" },
        });
    }
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "story-info" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
    ...{ class: "story-title" },
});
(__VLS_ctx.story.title);
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "story-description" },
});
(__VLS_ctx.story.description);
if (!__VLS_ctx.story.isLocked) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "story-progress" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "progress-text" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.story.completedChapters || 0);
    (__VLS_ctx.story.totalChapters || 0);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.story.progress);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "progress-bar" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "progress-fill" },
        ...{ style: ({ width: __VLS_ctx.story.progress + '%' }) },
    });
}
/** @type {__VLS_StyleScopedClasses['story-card']} */ ;
/** @type {__VLS_StyleScopedClasses['locked']} */ ;
/** @type {__VLS_StyleScopedClasses['story-cover']} */ ;
/** @type {__VLS_StyleScopedClasses['new-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['lock-overlay']} */ ;
/** @type {__VLS_StyleScopedClasses['lock-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['coming-soon']} */ ;
/** @type {__VLS_StyleScopedClasses['story-info']} */ ;
/** @type {__VLS_StyleScopedClasses['story-title']} */ ;
/** @type {__VLS_StyleScopedClasses['story-description']} */ ;
/** @type {__VLS_StyleScopedClasses['story-progress']} */ ;
/** @type {__VLS_StyleScopedClasses['progress-text']} */ ;
/** @type {__VLS_StyleScopedClasses['progress-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['progress-fill']} */ ;
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

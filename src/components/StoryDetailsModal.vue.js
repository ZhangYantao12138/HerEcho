/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
const props = defineProps();
const emit = defineEmits(['close', 'start', 'continue']);
function closeDetails() {
    emit('close');
}
function startGame() {
    if (!props.story)
        return;
    emit('start', props.story);
}
function continueGame() {
    if (!props.story)
        return;
    emit('continue', props.story);
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['modal-header']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-cover']} */ ;
/** @type {__VLS_StyleScopedClasses['continue-button']} */ ;
/** @type {__VLS_StyleScopedClasses['start-button']} */ ;
/** @type {__VLS_StyleScopedClasses['continue-button']} */ ;
/** @type {__VLS_StyleScopedClasses['start-button']} */ ;
/** @type {__VLS_StyleScopedClasses['restart-button']} */ ;
/** @type {__VLS_StyleScopedClasses['restart-button']} */ ;
// CSS variable injection 
// CSS variable injection end 
if (__VLS_ctx.show && __VLS_ctx.story) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ onClick: (__VLS_ctx.closeDetails) },
        ...{ class: "story-details-overlay" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "story-details-modal" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "modal-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({});
    (__VLS_ctx.story.title);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ onClick: (__VLS_ctx.closeDetails) },
        ...{ class: "close-button" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "modal-cover" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
        src: (__VLS_ctx.story.coverImage),
        alt: "故事封面",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "modal-content" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "modal-description" },
    });
    (__VLS_ctx.story.description);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "chapter-info" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "chapter-count" },
    });
    (__VLS_ctx.story.totalChapters || 0);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "chapter-progress" },
    });
    (__VLS_ctx.story.completedChapters || 0);
    (__VLS_ctx.story.totalChapters || 0);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "story-progress" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "progress-text" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.story.progress);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "progress-bar" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "progress-fill" },
        ...{ style: ({ width: __VLS_ctx.story.progress + '%' }) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "modal-actions" },
    });
    if (__VLS_ctx.story.progress > 0) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (__VLS_ctx.continueGame) },
            ...{ class: "continue-button" },
        });
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (__VLS_ctx.startGame) },
            ...{ class: "start-button" },
        });
    }
    if (__VLS_ctx.story.progress > 0) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (__VLS_ctx.startGame) },
            ...{ class: "restart-button" },
        });
    }
}
/** @type {__VLS_StyleScopedClasses['story-details-overlay']} */ ;
/** @type {__VLS_StyleScopedClasses['story-details-modal']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-header']} */ ;
/** @type {__VLS_StyleScopedClasses['close-button']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-cover']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-content']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-description']} */ ;
/** @type {__VLS_StyleScopedClasses['chapter-info']} */ ;
/** @type {__VLS_StyleScopedClasses['chapter-count']} */ ;
/** @type {__VLS_StyleScopedClasses['chapter-progress']} */ ;
/** @type {__VLS_StyleScopedClasses['story-progress']} */ ;
/** @type {__VLS_StyleScopedClasses['progress-text']} */ ;
/** @type {__VLS_StyleScopedClasses['progress-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['progress-fill']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['continue-button']} */ ;
/** @type {__VLS_StyleScopedClasses['start-button']} */ ;
/** @type {__VLS_StyleScopedClasses['restart-button']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            closeDetails: closeDetails,
            startGame: startGame,
            continueGame: continueGame,
        };
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

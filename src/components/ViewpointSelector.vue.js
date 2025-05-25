/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, computed } from 'vue';
import { getViewpointDescriptionByKey } from '../config/viewpointConfig';
const props = defineProps();
const emit = defineEmits();
// 是否显示选择器
const showSelector = ref(false);
// 选择视角
function selectViewpoint(viewpoint) {
    emit('select-viewpoint', viewpoint);
    showSelector.value = false;
}
// 切换选择器显示状态
function toggleSelector() {
    showSelector.value = !showSelector.value;
}
// 关闭选择器
function closeSelector() {
    showSelector.value = false;
}
// 计算视角描述
const viewpointDescription = computed(() => {
    if (!props.currentViewpoint) {
        return getViewpointDescriptionByKey();
    }
    return getViewpointDescriptionByKey(props.currentViewpoint.promptKey);
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['current-viewpoint']} */ ;
/** @type {__VLS_StyleScopedClasses['viewpoint-option']} */ ;
/** @type {__VLS_StyleScopedClasses['viewpoint-option']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ onMouseleave: (__VLS_ctx.closeSelector) },
    ...{ class: "viewpoint-selector" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ onClick: (__VLS_ctx.toggleSelector) },
    ...{ class: "current-viewpoint" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "viewpoint-label" },
});
(__VLS_ctx.viewpointDescription);
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "viewpoint-arrow" },
});
if (__VLS_ctx.showSelector) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "viewpoint-options" },
    });
    for (const [viewpoint] of __VLS_getVForSourceType((__VLS_ctx.viewpoints))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ onClick: (...[$event]) => {
                    if (!(__VLS_ctx.showSelector))
                        return;
                    __VLS_ctx.selectViewpoint(viewpoint);
                } },
            key: (`${viewpoint.characterId}-${viewpoint.viewpointId}`),
            ...{ class: "viewpoint-option" },
            ...{ class: ({ 'active': __VLS_ctx.currentViewpoint && __VLS_ctx.currentViewpoint.characterId === viewpoint.characterId }) },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "option-name" },
        });
        (__VLS_ctx.getViewpointDescriptionByKey(viewpoint.promptKey));
    }
}
/** @type {__VLS_StyleScopedClasses['viewpoint-selector']} */ ;
/** @type {__VLS_StyleScopedClasses['current-viewpoint']} */ ;
/** @type {__VLS_StyleScopedClasses['viewpoint-label']} */ ;
/** @type {__VLS_StyleScopedClasses['viewpoint-arrow']} */ ;
/** @type {__VLS_StyleScopedClasses['viewpoint-options']} */ ;
/** @type {__VLS_StyleScopedClasses['viewpoint-option']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['option-name']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            getViewpointDescriptionByKey: getViewpointDescriptionByKey,
            showSelector: showSelector,
            selectViewpoint: selectViewpoint,
            toggleSelector: toggleSelector,
            closeSelector: closeSelector,
            viewpointDescription: viewpointDescription,
        };
    },
    __typeEmits: {},
    __typeProps: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeEmits: {},
    __typeProps: {},
});
; /* PartiallyEnd: #4569/main.vue */

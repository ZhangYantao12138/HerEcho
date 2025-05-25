/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref } from 'vue';
import { RiArrowDownSLine } from '@remixicon/vue';
const __VLS_props = defineProps({
    scene: {
        type: String,
        default: '（番外）你发现羌青瓷接近你别有目的'
    },
    stage: {
        type: String,
        default: '初步相识'
    },
    progress: {
        type: Number,
        default: 40
    }
});
const isCollapsed = ref(false);
const emit = defineEmits(['toggle-collapse']);
function toggleCollapse() {
    isCollapsed.value = !isCollapsed.value;
    emit('toggle-collapse', isCollapsed.value);
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['arrow-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['collapse-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['collapse-button']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "scene-container" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "scene-info" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "scene-text" },
});
(__VLS_ctx.scene);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "scene-stage" },
});
(__VLS_ctx.stage);
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
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ onClick: (__VLS_ctx.toggleCollapse) },
    ...{ class: "collapse-wrapper" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "collapse-button" },
});
(__VLS_ctx.isCollapsed ? '展开对话' : '收起对话');
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "arrow-icon" },
    ...{ class: ({ 'rotate': __VLS_ctx.isCollapsed }) },
});
const __VLS_0 = {}.RiArrowDownSLine;
/** @type {[typeof __VLS_components.RiArrowDownSLine, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({}));
const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
/** @type {__VLS_StyleScopedClasses['scene-container']} */ ;
/** @type {__VLS_StyleScopedClasses['scene-info']} */ ;
/** @type {__VLS_StyleScopedClasses['scene-text']} */ ;
/** @type {__VLS_StyleScopedClasses['scene-stage']} */ ;
/** @type {__VLS_StyleScopedClasses['progress-section']} */ ;
/** @type {__VLS_StyleScopedClasses['progress-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['progress-fill']} */ ;
/** @type {__VLS_StyleScopedClasses['collapse-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['collapse-button']} */ ;
/** @type {__VLS_StyleScopedClasses['arrow-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['rotate']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            RiArrowDownSLine: RiArrowDownSLine,
            isCollapsed: isCollapsed,
            toggleCollapse: toggleCollapse,
        };
    },
    emits: {},
    props: {
        scene: {
            type: String,
            default: '（番外）你发现羌青瓷接近你别有目的'
        },
        stage: {
            type: String,
            default: '初步相识'
        },
        progress: {
            type: Number,
            default: 40
        }
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    emits: {},
    props: {
        scene: {
            type: String,
            default: '（番外）你发现羌青瓷接近你别有目的'
        },
        stage: {
            type: String,
            default: '初步相识'
        },
        progress: {
            type: Number,
            default: 40
        }
    },
});
; /* PartiallyEnd: #4569/main.vue */

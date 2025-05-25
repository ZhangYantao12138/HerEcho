/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import ScriptSelection from '../components/ScriptSelection.vue';
import BottomNav from '../components/BottomNav.vue';
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "script-selection-view" },
});
/** @type {[typeof ScriptSelection, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(ScriptSelection, new ScriptSelection({}));
const __VLS_1 = __VLS_0({}, ...__VLS_functionalComponentArgsRest(__VLS_0));
/** @type {[typeof BottomNav, ]} */ ;
// @ts-ignore
const __VLS_3 = __VLS_asFunctionalComponent(BottomNav, new BottomNav({}));
const __VLS_4 = __VLS_3({}, ...__VLS_functionalComponentArgsRest(__VLS_3));
/** @type {__VLS_StyleScopedClasses['script-selection-view']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            ScriptSelection: ScriptSelection,
            BottomNav: BottomNav,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */

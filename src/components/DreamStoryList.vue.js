/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { defineEmits } from 'vue';
import StoryCard from './StoryCard.vue';
const __VLS_props = defineProps();
const emit = defineEmits();
// 选择故事
function selectStory(story) {
    emit('select-story', story);
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "dream-stories-container" },
});
for (const [story] of __VLS_getVForSourceType((__VLS_ctx.stories))) {
    /** @type {[typeof StoryCard, ]} */ ;
    // @ts-ignore
    const __VLS_0 = __VLS_asFunctionalComponent(StoryCard, new StoryCard({
        ...{ 'onClick': {} },
        key: (story.id),
        story: (story),
    }));
    const __VLS_1 = __VLS_0({
        ...{ 'onClick': {} },
        key: (story.id),
        story: (story),
    }, ...__VLS_functionalComponentArgsRest(__VLS_0));
    let __VLS_3;
    let __VLS_4;
    let __VLS_5;
    const __VLS_6 = {
        onClick: (__VLS_ctx.selectStory)
    };
    var __VLS_2;
}
/** @type {__VLS_StyleScopedClasses['dream-stories-container']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            StoryCard: StoryCard,
            selectStory: selectStory,
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

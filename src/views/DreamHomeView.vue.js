/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import BottomNav from '../components/BottomNav.vue';
import StoryDetailsModal from '../components/StoryDetailsModal.vue';
import DreamStoryList from '../components/DreamStoryList.vue';
import DreamHeader from '../components/DreamHeader.vue';
import { getAllStories, showLockedMessage } from '../services/dreamStoryService';
const router = useRouter();
// 使用服务获取故事数据
const dreamStories = getAllStories();
// 显示故事详情弹窗
const showStoryDetails = ref(false);
const selectedStory = ref(null);
// 进入叙梦故事
function enterDreamStory(story) {
    if (story.isLocked) {
        showLockedMessage(story);
        return;
    }
    selectedStory.value = story;
    showStoryDetails.value = true;
}
// 开始游戏
function startGame() {
    if (!selectedStory.value)
        return;
    router.push(`/dream/scene/${selectedStory.value.id}`);
    showStoryDetails.value = false;
}
// 继续游戏
function continueGame() {
    if (!selectedStory.value)
        return;
    router.push(`/dream/scene/${selectedStory.value.id}`);
    showStoryDetails.value = false;
}
// 关闭详情弹窗
function closeDetails() {
    showStoryDetails.value = false;
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "dream-home-container" },
});
/** @type {[typeof DreamHeader, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(DreamHeader, new DreamHeader({
    title: "叙梦",
}));
const __VLS_1 = __VLS_0({
    title: "叙梦",
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
/** @type {[typeof DreamStoryList, ]} */ ;
// @ts-ignore
const __VLS_3 = __VLS_asFunctionalComponent(DreamStoryList, new DreamStoryList({
    ...{ 'onSelectStory': {} },
    stories: (__VLS_ctx.dreamStories),
}));
const __VLS_4 = __VLS_3({
    ...{ 'onSelectStory': {} },
    stories: (__VLS_ctx.dreamStories),
}, ...__VLS_functionalComponentArgsRest(__VLS_3));
let __VLS_6;
let __VLS_7;
let __VLS_8;
const __VLS_9 = {
    onSelectStory: (__VLS_ctx.enterDreamStory)
};
var __VLS_5;
/** @type {[typeof StoryDetailsModal, ]} */ ;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(StoryDetailsModal, new StoryDetailsModal({
    ...{ 'onClose': {} },
    ...{ 'onStart': {} },
    ...{ 'onContinue': {} },
    story: (__VLS_ctx.selectedStory),
    show: (__VLS_ctx.showStoryDetails),
}));
const __VLS_11 = __VLS_10({
    ...{ 'onClose': {} },
    ...{ 'onStart': {} },
    ...{ 'onContinue': {} },
    story: (__VLS_ctx.selectedStory),
    show: (__VLS_ctx.showStoryDetails),
}, ...__VLS_functionalComponentArgsRest(__VLS_10));
let __VLS_13;
let __VLS_14;
let __VLS_15;
const __VLS_16 = {
    onClose: (__VLS_ctx.closeDetails)
};
const __VLS_17 = {
    onStart: (__VLS_ctx.startGame)
};
const __VLS_18 = {
    onContinue: (__VLS_ctx.continueGame)
};
var __VLS_12;
/** @type {[typeof BottomNav, ]} */ ;
// @ts-ignore
const __VLS_19 = __VLS_asFunctionalComponent(BottomNav, new BottomNav({}));
const __VLS_20 = __VLS_19({}, ...__VLS_functionalComponentArgsRest(__VLS_19));
/** @type {__VLS_StyleScopedClasses['dream-home-container']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            BottomNav: BottomNav,
            StoryDetailsModal: StoryDetailsModal,
            DreamStoryList: DreamStoryList,
            DreamHeader: DreamHeader,
            dreamStories: dreamStories,
            showStoryDetails: showStoryDetails,
            selectedStory: selectedStory,
            enterDreamStory: enterDreamStory,
            startGame: startGame,
            continueGame: continueGame,
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

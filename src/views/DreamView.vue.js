/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, onMounted, defineProps } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import BottomNav from '../components/BottomNav.vue';
import { useDreamStore } from '../stores/dreamStore';
import oneImage from '../assets/one.png';
const props = defineProps();
// 获取路由参数
const route = useRoute();
const router = useRouter();
const storyId = props.storyId || route.params.storyId;
// 获取叙梦数据
const dreamStore = useDreamStore();
// 动画状态
const isPlaying = ref(false);
// 是否显示特殊效果列表
const showEffectsList = ref(false);
// 处理选项选择
function selectOption(optionId) {
    dreamStore.selectOption(optionId);
}
// 继续到下一个分镜
function continueToNextScene() {
    isPlaying.value = true;
    setTimeout(() => {
        dreamStore.continueToNextScene();
        isPlaying.value = false;
        // 如果有结局，返回首页
        if (dreamStore.activeEnding) {
            setTimeout(() => {
                router.push('/dream');
            }, 3000);
        }
    }, 500);
}
// 切换特殊效果列表显示状态
function toggleEffectsList() {
    showEffectsList.value = !showEffectsList.value;
}
// 返回首页
function goBack() {
    router.push('/dream');
}
// 组件挂载时，重置到初始分镜
onMounted(() => {
    if (!storyId) {
        router.push('/dream');
        return;
    }
    // 根据故事ID初始化场景
    dreamStore.initializeStory(storyId);
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['background-image']} */ ;
/** @type {__VLS_StyleScopedClasses['effects-header']} */ ;
/** @type {__VLS_StyleScopedClasses['content-container']} */ ;
/** @type {__VLS_StyleScopedClasses['option-item']} */ ;
/** @type {__VLS_StyleScopedClasses['option-item']} */ ;
/** @type {__VLS_StyleScopedClasses['continue-button']} */ ;
/** @type {__VLS_StyleScopedClasses['continue-button']} */ ;
/** @type {__VLS_StyleScopedClasses['back-button']} */ ;
/** @type {__VLS_StyleScopedClasses['back-button']} */ ;
/** @type {__VLS_StyleScopedClasses['ending-dialog']} */ ;
/** @type {__VLS_StyleScopedClasses['ending-dialog']} */ ;
/** @type {__VLS_StyleScopedClasses['replay-button']} */ ;
/** @type {__VLS_StyleScopedClasses['replay-button']} */ ;
/** @type {__VLS_StyleScopedClasses['content-container']} */ ;
/** @type {__VLS_StyleScopedClasses['option-dialog']} */ ;
/** @type {__VLS_StyleScopedClasses['ending-dialog']} */ ;
/** @type {__VLS_StyleScopedClasses['effects-list']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "dream-container" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ onClick: (__VLS_ctx.goBack) },
    ...{ class: "back-button" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "back-icon" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "background-image" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
    src: (__VLS_ctx.oneImage),
    alt: "背景图片",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ onClick: (__VLS_ctx.toggleEffectsList) },
    ...{ class: "effects-button" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "effects-icon" },
});
if (__VLS_ctx.showEffectsList) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "effects-list" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "effects-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ onClick: (__VLS_ctx.toggleEffectsList) },
        ...{ class: "close-button" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "effects-content" },
    });
    if (__VLS_ctx.dreamStore.unlockedEffects.length === 0) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "no-effects" },
        });
    }
    else {
        for (const [effect, index] of __VLS_getVForSourceType((__VLS_ctx.dreamStore.unlockedEffects))) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "effect-item" },
                key: (index),
            });
            (effect);
        }
    }
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "content-container" },
    ...{ class: ({ 'playing': __VLS_ctx.isPlaying }) },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "dream-header" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
    ...{ class: "dream-title" },
});
(__VLS_ctx.dreamStore.currentScene?.title || '加载中...');
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "dream-description" },
});
(__VLS_ctx.dreamStore.currentScene?.description || '请稍候...');
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "replay-button-container" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ class: "replay-button" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "options-list" },
});
for (const [option] of __VLS_getVForSourceType((__VLS_ctx.dreamStore.currentScene?.options || []))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.selectOption(option.id);
            } },
        key: (option.id),
        ...{ class: "option-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "option-text" },
    });
    (option.text);
}
if (__VLS_ctx.dreamStore.showOptionDialog) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "option-dialog-overlay" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "option-dialog" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "dialog-content" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    (__VLS_ctx.dreamStore.currentOption?.content || '内容加载中...');
    if (__VLS_ctx.dreamStore.currentOption?.specialEffect) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "special-effect" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "effect-title" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "effect-content" },
        });
        (__VLS_ctx.dreamStore.currentOption.specialEffect);
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "dialog-footer" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.continueToNextScene) },
        ...{ class: "continue-button" },
    });
}
if (__VLS_ctx.dreamStore.activeEnding) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "ending-dialog-overlay" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "ending-dialog" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({});
    (__VLS_ctx.dreamStore.endings.find(e => e.id === __VLS_ctx.dreamStore.activeEnding)?.title);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    (__VLS_ctx.dreamStore.endings.find(e => e.id === __VLS_ctx.dreamStore.activeEnding)?.description);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "ending-footer" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
}
/** @type {[typeof BottomNav, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(BottomNav, new BottomNav({}));
const __VLS_1 = __VLS_0({}, ...__VLS_functionalComponentArgsRest(__VLS_0));
/** @type {__VLS_StyleScopedClasses['dream-container']} */ ;
/** @type {__VLS_StyleScopedClasses['back-button']} */ ;
/** @type {__VLS_StyleScopedClasses['back-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['background-image']} */ ;
/** @type {__VLS_StyleScopedClasses['effects-button']} */ ;
/** @type {__VLS_StyleScopedClasses['effects-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['effects-list']} */ ;
/** @type {__VLS_StyleScopedClasses['effects-header']} */ ;
/** @type {__VLS_StyleScopedClasses['close-button']} */ ;
/** @type {__VLS_StyleScopedClasses['effects-content']} */ ;
/** @type {__VLS_StyleScopedClasses['no-effects']} */ ;
/** @type {__VLS_StyleScopedClasses['effect-item']} */ ;
/** @type {__VLS_StyleScopedClasses['content-container']} */ ;
/** @type {__VLS_StyleScopedClasses['playing']} */ ;
/** @type {__VLS_StyleScopedClasses['dream-header']} */ ;
/** @type {__VLS_StyleScopedClasses['dream-title']} */ ;
/** @type {__VLS_StyleScopedClasses['dream-description']} */ ;
/** @type {__VLS_StyleScopedClasses['replay-button-container']} */ ;
/** @type {__VLS_StyleScopedClasses['replay-button']} */ ;
/** @type {__VLS_StyleScopedClasses['options-list']} */ ;
/** @type {__VLS_StyleScopedClasses['option-item']} */ ;
/** @type {__VLS_StyleScopedClasses['option-text']} */ ;
/** @type {__VLS_StyleScopedClasses['option-dialog-overlay']} */ ;
/** @type {__VLS_StyleScopedClasses['option-dialog']} */ ;
/** @type {__VLS_StyleScopedClasses['dialog-content']} */ ;
/** @type {__VLS_StyleScopedClasses['special-effect']} */ ;
/** @type {__VLS_StyleScopedClasses['effect-title']} */ ;
/** @type {__VLS_StyleScopedClasses['effect-content']} */ ;
/** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
/** @type {__VLS_StyleScopedClasses['continue-button']} */ ;
/** @type {__VLS_StyleScopedClasses['ending-dialog-overlay']} */ ;
/** @type {__VLS_StyleScopedClasses['ending-dialog']} */ ;
/** @type {__VLS_StyleScopedClasses['ending-footer']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            BottomNav: BottomNav,
            oneImage: oneImage,
            dreamStore: dreamStore,
            isPlaying: isPlaying,
            showEffectsList: showEffectsList,
            selectOption: selectOption,
            continueToNextScene: continueToNextScene,
            toggleEffectsList: toggleEffectsList,
            goBack: goBack,
        };
    },
    __typeProps: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeProps: {},
});
; /* PartiallyEnd: #4569/main.vue */

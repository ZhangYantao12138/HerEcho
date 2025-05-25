/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { RiArrowLeftSLine, RiTestTubeLine } from '@remixicon/vue';
import { characters } from '../config/characters';
import { getScriptById } from '../config/scripts';
import { getAvailableViewpoints, getCurrentViewpoint } from '../services/viewpointService';
import ViewpointSelector from './ViewpointSelector.vue';
const router = useRouter();
const route = useRoute();
const props = defineProps();
const emit = defineEmits(['testApi', 'change-viewpoint']);
const showCharacterList = ref(false);
const characterSelectorRef = ref(null);
// 获取当前剧本ID
const scriptId = computed(() => route.params.scriptId);
// 获取当前剧本可用的角色列表
const availableCharacters = computed(() => {
    const currentScript = getScriptById(scriptId.value);
    if (!currentScript)
        return characters; // 如果没有找到剧本，返回所有角色
    return characters.filter(character => currentScript.characters.includes(character.id));
});
// 获取可用的视角关系
const availableViewpoints = computed(() => {
    return getAvailableViewpoints(props.currentCharacter.id);
});
// 获取当前视角关系
const currentViewpoint = computed(() => {
    return getCurrentViewpoint(props.currentCharacter.id);
});
// 处理视角切换
function handleViewpointChange(viewpoint) {
    emit('change-viewpoint', viewpoint);
}
// 返回剧本选择页
function goBack() {
    router.push('/');
}
// 切换角色列表显示
function toggleCharacterList() {
    showCharacterList.value = !showCharacterList.value;
}
// 选择角色
function selectCharacter(character) {
    console.log(`用户选择了角色: ${character.name}(${character.id}), 剧本ID: ${scriptId.value}`);
    // 确保 scriptId.value 能正确获取
    router.push(`/chat/${scriptId.value}/${character.id}`);
    showCharacterList.value = false;
}
// 处理点击外部区域关闭角色列表
function handleClickOutside(event) {
    if (characterSelectorRef.value &&
        !characterSelectorRef.value.contains(event.target)) {
        showCharacterList.value = false;
    }
}
// 处理API测试
function handleTestApi() {
    emit('testApi');
}
onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});
onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['back-button']} */ ;
/** @type {__VLS_StyleScopedClasses['selected-character']} */ ;
/** @type {__VLS_StyleScopedClasses['character-avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['character-info']} */ ;
/** @type {__VLS_StyleScopedClasses['character-info']} */ ;
/** @type {__VLS_StyleScopedClasses['character-option']} */ ;
/** @type {__VLS_StyleScopedClasses['character-option']} */ ;
/** @type {__VLS_StyleScopedClasses['character-option-info']} */ ;
/** @type {__VLS_StyleScopedClasses['name']} */ ;
/** @type {__VLS_StyleScopedClasses['character-option-info']} */ ;
/** @type {__VLS_StyleScopedClasses['icon-button']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.header, __VLS_intrinsicElements.header)({
    ...{ class: "chat-header" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "left-section" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.goBack) },
    ...{ class: "back-button" },
});
const __VLS_0 = {}.RiArrowLeftSLine;
/** @type {[typeof __VLS_components.RiArrowLeftSLine, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({}));
const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ onClick: (__VLS_ctx.toggleCharacterList) },
    ...{ class: "character-selector" },
    ref: "characterSelectorRef",
});
/** @type {typeof __VLS_ctx.characterSelectorRef} */ ;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "selected-character" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "character-avatar" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.img, __VLS_intrinsicElements.img)({
    src: (props.currentCharacter.avatar),
    alt: "",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "character-info" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "name" },
});
(props.currentCharacter.name);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "scene" },
});
(props.currentCharacter.sceneInfo.title);
if (__VLS_ctx.showCharacterList) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "character-list" },
    });
    for (const [character] of __VLS_getVForSourceType((__VLS_ctx.availableCharacters))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ onClick: (...[$event]) => {
                    if (!(__VLS_ctx.showCharacterList))
                        return;
                    __VLS_ctx.selectCharacter(character);
                } },
            key: (character.id),
            ...{ class: "character-option" },
            ...{ class: ({ 'selected': character.id === props.currentCharacter.id }) },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "character-avatar" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.img, __VLS_intrinsicElements.img)({
            src: (character.avatar),
            alt: "",
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "character-option-info" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "name" },
        });
        (character.name);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "title" },
        });
        (character.sceneInfo.title);
    }
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "header-actions" },
});
if (__VLS_ctx.availableViewpoints.length > 0) {
    /** @type {[typeof ViewpointSelector, ]} */ ;
    // @ts-ignore
    const __VLS_4 = __VLS_asFunctionalComponent(ViewpointSelector, new ViewpointSelector({
        ...{ 'onSelectViewpoint': {} },
        characterId: (props.currentCharacter.id),
        viewpoints: (__VLS_ctx.availableViewpoints),
        currentViewpoint: (__VLS_ctx.currentViewpoint),
        ...{ class: "viewpoint-selector-container" },
    }));
    const __VLS_5 = __VLS_4({
        ...{ 'onSelectViewpoint': {} },
        characterId: (props.currentCharacter.id),
        viewpoints: (__VLS_ctx.availableViewpoints),
        currentViewpoint: (__VLS_ctx.currentViewpoint),
        ...{ class: "viewpoint-selector-container" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_4));
    let __VLS_7;
    let __VLS_8;
    let __VLS_9;
    const __VLS_10 = {
        onSelectViewpoint: (__VLS_ctx.handleViewpointChange)
    };
    var __VLS_6;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ onClick: (__VLS_ctx.handleTestApi) },
    ...{ class: "icon-button" },
});
const __VLS_11 = {}.RiTestTubeLine;
/** @type {[typeof __VLS_components.RiTestTubeLine, ]} */ ;
// @ts-ignore
const __VLS_12 = __VLS_asFunctionalComponent(__VLS_11, new __VLS_11({}));
const __VLS_13 = __VLS_12({}, ...__VLS_functionalComponentArgsRest(__VLS_12));
/** @type {__VLS_StyleScopedClasses['chat-header']} */ ;
/** @type {__VLS_StyleScopedClasses['left-section']} */ ;
/** @type {__VLS_StyleScopedClasses['back-button']} */ ;
/** @type {__VLS_StyleScopedClasses['character-selector']} */ ;
/** @type {__VLS_StyleScopedClasses['selected-character']} */ ;
/** @type {__VLS_StyleScopedClasses['character-avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['character-info']} */ ;
/** @type {__VLS_StyleScopedClasses['name']} */ ;
/** @type {__VLS_StyleScopedClasses['scene']} */ ;
/** @type {__VLS_StyleScopedClasses['character-list']} */ ;
/** @type {__VLS_StyleScopedClasses['character-option']} */ ;
/** @type {__VLS_StyleScopedClasses['selected']} */ ;
/** @type {__VLS_StyleScopedClasses['character-avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['character-option-info']} */ ;
/** @type {__VLS_StyleScopedClasses['name']} */ ;
/** @type {__VLS_StyleScopedClasses['title']} */ ;
/** @type {__VLS_StyleScopedClasses['header-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['viewpoint-selector-container']} */ ;
/** @type {__VLS_StyleScopedClasses['icon-button']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            RiArrowLeftSLine: RiArrowLeftSLine,
            RiTestTubeLine: RiTestTubeLine,
            ViewpointSelector: ViewpointSelector,
            showCharacterList: showCharacterList,
            characterSelectorRef: characterSelectorRef,
            availableCharacters: availableCharacters,
            availableViewpoints: availableViewpoints,
            currentViewpoint: currentViewpoint,
            handleViewpointChange: handleViewpointChange,
            goBack: goBack,
            toggleCharacterList: toggleCharacterList,
            selectCharacter: selectCharacter,
            handleTestApi: handleTestApi,
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

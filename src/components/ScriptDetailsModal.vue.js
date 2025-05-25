/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, computed } from 'vue';
import { getCharacterById } from '../config/characters';
const props = defineProps();
const emit = defineEmits(['close', 'start']);
// 获取当前剧本对应的角色列表
const availableCharacters = computed(() => {
    if (!props.script)
        return [];
    return props.script.characters
        .map(id => getCharacterById(id))
        .filter((char) => char !== undefined);
});
const selectedCharacter = ref(null);
const showDropdown = ref(false);
function closeDetails() {
    emit('close');
    // 重置选择状态
    selectedCharacter.value = null;
    showDropdown.value = false;
}
function startChat() {
    if (!props.script || !selectedCharacter.value)
        return;
    console.log(`用户开始了剧本: ${props.script.title}(${props.script.id})，使用角色: ${selectedCharacter.value.name}(${selectedCharacter.value.id})`);
    emit('start', {
        script: props.script,
        characterId: selectedCharacter.value.id
    });
}
function selectCharacter(character) {
    console.log(`用户在剧本详情中选择了角色: ${character.name}(${character.id})`);
    selectedCharacter.value = character;
    showDropdown.value = false;
}
function toggleDropdown() {
    showDropdown.value = !showDropdown.value;
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['modal-header']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-cover']} */ ;
/** @type {__VLS_StyleScopedClasses['character-selection']} */ ;
/** @type {__VLS_StyleScopedClasses['selected-character']} */ ;
/** @type {__VLS_StyleScopedClasses['character-avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['dropdown-item']} */ ;
/** @type {__VLS_StyleScopedClasses['continue-button']} */ ;
/** @type {__VLS_StyleScopedClasses['start-button']} */ ;
/** @type {__VLS_StyleScopedClasses['restart-button']} */ ;
/** @type {__VLS_StyleScopedClasses['continue-button']} */ ;
/** @type {__VLS_StyleScopedClasses['start-button']} */ ;
/** @type {__VLS_StyleScopedClasses['continue-button']} */ ;
/** @type {__VLS_StyleScopedClasses['start-button']} */ ;
/** @type {__VLS_StyleScopedClasses['restart-button']} */ ;
/** @type {__VLS_StyleScopedClasses['restart-button']} */ ;
// CSS variable injection 
// CSS variable injection end 
if (__VLS_ctx.show && __VLS_ctx.script) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ onClick: (__VLS_ctx.closeDetails) },
        ...{ class: "script-details-overlay" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "script-details-modal" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "modal-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({});
    (__VLS_ctx.script.title);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ onClick: (__VLS_ctx.closeDetails) },
        ...{ class: "close-button" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "modal-cover" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
        src: (__VLS_ctx.script.coverImage),
        alt: "剧本封面",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "modal-content" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "modal-description" },
    });
    (__VLS_ctx.script.description);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "character-selection" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "character-dropdown" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ onClick: (__VLS_ctx.toggleDropdown) },
        ...{ class: "selected-character" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "character-avatar" },
    });
    if (__VLS_ctx.selectedCharacter) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
            src: (__VLS_ctx.selectedCharacter.avatar),
            alt: (__VLS_ctx.selectedCharacter.name),
        });
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "character-name" },
    });
    (__VLS_ctx.selectedCharacter ? __VLS_ctx.selectedCharacter.name : '请选择角色');
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "dropdown-arrow" },
    });
    if (__VLS_ctx.showDropdown) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "dropdown-menu" },
        });
        for (const [character] of __VLS_getVForSourceType((__VLS_ctx.availableCharacters))) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ onClick: (...[$event]) => {
                        if (!(__VLS_ctx.show && __VLS_ctx.script))
                            return;
                        if (!(__VLS_ctx.showDropdown))
                            return;
                        __VLS_ctx.selectCharacter(character);
                    } },
                key: (character.id),
                ...{ class: "dropdown-item" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "character-avatar" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
                src: (character.avatar),
                alt: (character.name),
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "character-name" },
            });
            (character.name);
        }
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "modal-actions" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.startChat) },
        ...{ class: "start-button" },
        disabled: (!__VLS_ctx.selectedCharacter),
    });
}
/** @type {__VLS_StyleScopedClasses['script-details-overlay']} */ ;
/** @type {__VLS_StyleScopedClasses['script-details-modal']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-header']} */ ;
/** @type {__VLS_StyleScopedClasses['close-button']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-cover']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-content']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-description']} */ ;
/** @type {__VLS_StyleScopedClasses['character-selection']} */ ;
/** @type {__VLS_StyleScopedClasses['character-dropdown']} */ ;
/** @type {__VLS_StyleScopedClasses['selected-character']} */ ;
/** @type {__VLS_StyleScopedClasses['character-avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['character-name']} */ ;
/** @type {__VLS_StyleScopedClasses['dropdown-arrow']} */ ;
/** @type {__VLS_StyleScopedClasses['dropdown-menu']} */ ;
/** @type {__VLS_StyleScopedClasses['dropdown-item']} */ ;
/** @type {__VLS_StyleScopedClasses['character-avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['character-name']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['start-button']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            availableCharacters: availableCharacters,
            selectedCharacter: selectedCharacter,
            showDropdown: showDropdown,
            closeDetails: closeDetails,
            startChat: startChat,
            selectCharacter: selectCharacter,
            toggleDropdown: toggleDropdown,
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

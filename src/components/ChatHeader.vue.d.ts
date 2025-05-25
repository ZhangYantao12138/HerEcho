import type { Character } from '../types/character';
type __VLS_Props = {
    currentCharacter: Character;
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    testApi: (...args: any[]) => void;
    "change-viewpoint": (...args: any[]) => void;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onTestApi?: ((...args: any[]) => any) | undefined;
    "onChange-viewpoint"?: ((...args: any[]) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;

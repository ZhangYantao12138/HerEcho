import type { DreamStory } from './DreamStoryList.vue';
interface StoryDetailsModalProps {
    story: DreamStory | null;
    show: boolean;
}
declare const _default: import("vue").DefineComponent<StoryDetailsModalProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    close: (...args: any[]) => void;
    start: (...args: any[]) => void;
    continue: (...args: any[]) => void;
}, string, import("vue").PublicProps, Readonly<StoryDetailsModalProps> & Readonly<{
    onClose?: ((...args: any[]) => any) | undefined;
    onStart?: ((...args: any[]) => any) | undefined;
    onContinue?: ((...args: any[]) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;

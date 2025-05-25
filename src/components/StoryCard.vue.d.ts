import type { DreamStory } from './DreamStoryList.vue';
interface StoryCardProps {
    story: DreamStory;
}
declare const _default: import("vue").DefineComponent<StoryCardProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    click: (...args: any[]) => void;
}, string, import("vue").PublicProps, Readonly<StoryCardProps> & Readonly<{
    onClick?: ((...args: any[]) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;

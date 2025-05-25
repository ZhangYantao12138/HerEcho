export interface DreamStory {
    id: string;
    title: string;
    description: string;
    coverImage: string;
    isNew: boolean;
    isLocked?: boolean;
    progress: number;
    totalChapters?: number;
    completedChapters?: number;
    comingSoon?: boolean;
}
type __VLS_Props = {
    stories: DreamStory[];
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    "select-story": (story: DreamStory) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    "onSelect-story"?: ((story: DreamStory) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;

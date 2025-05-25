import type { ViewpointRelation } from '../types/viewpoint';
type __VLS_Props = {
    characterId: string;
    viewpoints: ViewpointRelation[];
    currentViewpoint?: ViewpointRelation;
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    "select-viewpoint": (viewpoint: ViewpointRelation) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    "onSelect-viewpoint"?: ((viewpoint: ViewpointRelation) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;

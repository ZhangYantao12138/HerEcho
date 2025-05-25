declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    scene: {
        type: StringConstructor;
        default: string;
    };
    stage: {
        type: StringConstructor;
        default: string;
    };
    progress: {
        type: NumberConstructor;
        default: number;
    };
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "toggle-collapse": (...args: any[]) => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    scene: {
        type: StringConstructor;
        default: string;
    };
    stage: {
        type: StringConstructor;
        default: string;
    };
    progress: {
        type: NumberConstructor;
        default: number;
    };
}>> & Readonly<{
    "onToggle-collapse"?: ((...args: any[]) => any) | undefined;
}>, {
    progress: number;
    scene: string;
    stage: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;

interface ScriptDetailsModalProps {
    script: {
        id: string;
        title: string;
        description: string;
        coverImage: string;
        characters: string[];
    } | null;
    show: boolean;
}
declare const _default: import("vue").DefineComponent<ScriptDetailsModalProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    close: (...args: any[]) => void;
    start: (...args: any[]) => void;
}, string, import("vue").PublicProps, Readonly<ScriptDetailsModalProps> & Readonly<{
    onClose?: ((...args: any[]) => any) | undefined;
    onStart?: ((...args: any[]) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;

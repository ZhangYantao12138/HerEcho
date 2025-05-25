interface ScriptCardProps {
    script: {
        id: string;
        title: string;
        description: string;
        coverImage: string;
        isNew: boolean;
        isLocked?: boolean;
        comingSoon?: boolean;
    };
}
declare const _default: import("vue").DefineComponent<ScriptCardProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    click: (...args: any[]) => void;
}, string, import("vue").PublicProps, Readonly<ScriptCardProps> & Readonly<{
    onClick?: ((...args: any[]) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;

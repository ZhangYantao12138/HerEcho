declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    isCollapsed: {
        type: BooleanConstructor;
        default: boolean;
    };
    currentCharacter: {
        type: ObjectConstructor;
        required: true;
    };
    lastUserMessage: {
        type: ObjectConstructor;
        default: undefined;
    };
    lastCharacterMessage: {
        type: ObjectConstructor;
        default: undefined;
    };
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "send-message": (...args: any[]) => void;
    "select-option": (...args: any[]) => void;
    "send-voice": (...args: any[]) => void;
    "ai-response": (...args: any[]) => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    isCollapsed: {
        type: BooleanConstructor;
        default: boolean;
    };
    currentCharacter: {
        type: ObjectConstructor;
        required: true;
    };
    lastUserMessage: {
        type: ObjectConstructor;
        default: undefined;
    };
    lastCharacterMessage: {
        type: ObjectConstructor;
        default: undefined;
    };
}>> & Readonly<{
    "onSend-message"?: ((...args: any[]) => any) | undefined;
    "onSelect-option"?: ((...args: any[]) => any) | undefined;
    "onSend-voice"?: ((...args: any[]) => any) | undefined;
    "onAi-response"?: ((...args: any[]) => any) | undefined;
}>, {
    isCollapsed: boolean;
    lastUserMessage: Record<string, any>;
    lastCharacterMessage: Record<string, any>;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;

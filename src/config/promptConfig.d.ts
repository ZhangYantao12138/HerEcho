/**
 * prompt配置项
 * 提供系统级别的prompt模板和配置项
 */
export declare const characterPromptConfig: {
    baseTemplate: string;
    temperature: number;
    maxTokens: number;
    characterSpecificInstructions: {
        B001C001: string;
        B001C002: string;
        B001C003: string;
        B001C004: string;
        B001C005: string;
        B001C006: string;
        B001C007: string;
        B001C008: string;
        B001C009: string;
        B002C001: string;
        B002C002: string;
        B002C003: string;
        B002C004: string;
        B002C005: string;
        B002C006: string;
    };
    replyConstraints: {
        minLength: number;
        maxLength: number;
        emotionLevel: number;
    };
};
export declare const playerPromptConfig: {
    baseTemplate: string;
    temperature: number;
    maxTokens: number;
    generalPlayerStyle: {
        emotionExpression: number;
        responseLength: number;
        rolePlayLevel: number;
    };
    viewpointGuidance: {
        BJX_TO_CZL: string;
        YS_TO_MHM: string;
    };
};
export declare const systemPromptConfig: {
    fallbackSettings: {
        maxRetries: number;
        retryDelayMs: number;
        useDefaultFallback: boolean;
    };
    globalAISettings: {
        model: string;
        defaultTemp: number;
        maxContextTokens: number;
        topP: number;
    };
    charLimits: {
        userInputMax: number;
        systemPromptMax: number;
        responseMax: number;
        maxContextTokens: number;
    };
    safetySettings: {
        filterProfanity: boolean;
        preventOffensiveContent: boolean;
        contentRating: string;
    };
};
declare const _default: {
    character: {
        baseTemplate: string;
        temperature: number;
        maxTokens: number;
        characterSpecificInstructions: {
            B001C001: string;
            B001C002: string;
            B001C003: string;
            B001C004: string;
            B001C005: string;
            B001C006: string;
            B001C007: string;
            B001C008: string;
            B001C009: string;
            B002C001: string;
            B002C002: string;
            B002C003: string;
            B002C004: string;
            B002C005: string;
            B002C006: string;
        };
        replyConstraints: {
            minLength: number;
            maxLength: number;
            emotionLevel: number;
        };
    };
    player: {
        baseTemplate: string;
        temperature: number;
        maxTokens: number;
        generalPlayerStyle: {
            emotionExpression: number;
            responseLength: number;
            rolePlayLevel: number;
        };
        viewpointGuidance: {
            BJX_TO_CZL: string;
            YS_TO_MHM: string;
        };
    };
    system: {
        fallbackSettings: {
            maxRetries: number;
            retryDelayMs: number;
            useDefaultFallback: boolean;
        };
        globalAISettings: {
            model: string;
            defaultTemp: number;
            maxContextTokens: number;
            topP: number;
        };
        charLimits: {
            userInputMax: number;
            systemPromptMax: number;
            responseMax: number;
            maxContextTokens: number;
        };
        safetySettings: {
            filterProfanity: boolean;
            preventOffensiveContent: boolean;
            contentRating: string;
        };
    };
};
export default _default;

/**
 * 聊天消息类型
 */
export interface Message {
    id: number;
    content: string;
    isUser: boolean;
    hasAudio: boolean;
}

/**
 * AI模型类型枚举
 */
export enum AIModel {
    DEEPSEEK = 'deepseek',
    GEMINI = 'gemini'
}

/**
 * 模型配置接口
 */
export interface ModelConfig {
    id: AIModel;
    name: string;
    description: string;
    endpoint: string;
    apiKeyEnvVar: string;
    maxTokens: number;
    defaultTemperature: number;
}

/**
 * 模型选择器相关事件类型
 */
export interface ModelSelectEvent {
    model: AIModel;
} 
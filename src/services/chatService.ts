import { getCharacterById, getDefaultCharacter } from '../config/characters';
import { generatePlayerPrompt, generateAutoReplyPrompt } from './promptService';
import { systemPromptConfig, modelConfigs } from '../config/promptConfig';
import type { Character } from '../types/character';
import type { Message } from '../types/chat';
import { AIModel } from '../types/chat';
import DatabaseService from './dbService';

// 当前选择的模型
let currentModel: AIModel = AIModel.DEEPSEEK;

/**
 * 设置当前使用的AI模型
 * @param model AI模型类型
 */
export function setCurrentModel(model: AIModel): void {
    currentModel = model;
    console.log(`切换到模型: ${modelConfigs[model].name}`);
}

/**
 * 获取当前使用的AI模型
 * @returns 当前模型类型
 */
export function getCurrentModel(): AIModel {
    return currentModel;
}

// 保存对话历史
interface ChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

// 从配置文件获取参数
const MAX_HISTORY = systemPromptConfig.charLimits.maxContextTokens > 0 ?
    Math.floor(systemPromptConfig.charLimits.maxContextTokens / 200) : 10; // 大约每条消息200 tokens
const MAX_RETRY_ATTEMPTS = systemPromptConfig.fallbackSettings.maxRetries;
const RETRY_DELAY = systemPromptConfig.fallbackSettings.retryDelayMs;
const API_TIMEOUT = 30000; // 30秒超时

let currentCharacter: Character = getDefaultCharacter();
let chatHistory: ChatMessage[] = [
    {
        role: 'system',
        content: currentCharacter.systemPrompt || ''
    }
];

// 用于存储上次使用的回退回复索引，避免连续使用相同的回复
let lastFallbackIndex: number = -1;

// 用于记录角色使用统计
const characterUsageStats: Record<string, number> = {};

let dbServiceInstance: DatabaseService | null = null;

async function getDbService(): Promise<DatabaseService> {
    if (!dbServiceInstance) {
        dbServiceInstance = await DatabaseService.getInstance();
    }
    return dbServiceInstance;
}

// 添加剧情模式状态管理
export interface StoryState {
    isStoryMode: boolean;
    currentProgress: number;
    canAdvance: boolean;
}

export let storyState: StoryState = {
    isStoryMode: false,
    currentProgress: 0,
    canAdvance: false
};

// 添加剧情模式状态更新方法
export function updateStoryState(newState: Partial<StoryState>) {
    storyState = {
        ...storyState,
        ...newState
    };
    console.log('[Story] 剧情状态更新:', storyState);
}

// 添加提示词组合函数
function combinePrompts(systemPrompt: string, stagePrompt: string): string {
    return `${systemPrompt}\n\n${stagePrompt}`;
}

// 修改生成系统提示词的方法
function generateSystemPrompt(character: Character): string {
    if (!storyState.isStoryMode) {
        // 日常模式：使用stageId为0的配置
        const dailyStage = character.storyMode.stages.find(stage => stage.stageId === 0);
        if (!dailyStage) {
            throw new Error(`角色 ${character.name} 缺少日常模式配置`);
        }
        return combinePrompts(dailyStage.systemPrompt, dailyStage.stagePrompt);
    }

    // 剧情模式：使用当前阶段的配置
    const currentStage = character.storyMode.stages.find(
        stage => stage.stageId === character.storyMode.currentStage
    );
    if (!currentStage) {
        throw new Error(`角色 ${character.name} 缺少剧情阶段 ${character.storyMode.currentStage} 的配置`);
    }
    return combinePrompts(currentStage.systemPrompt, currentStage.stagePrompt);
}

// 修改设置当前角色的方法
export function setCurrentCharacter(character: Character): void {
    // 记录角色使用次数
    if (character.id) {
        characterUsageStats[character.id] = (characterUsageStats[character.id] || 0) + 1;
        console.log(`角色使用统计 - ${character.name}(${character.id}): ${characterUsageStats[character.id]}次`);
        console.log('所有角色使用统计:', JSON.stringify(characterUsageStats, null, 2));
    }

    currentCharacter = character;
    // 重置剧情状态
    updateStoryState({
        isStoryMode: character.storyMode.enabled,
        currentProgress: 0,
        canAdvance: false
    });
    clearChatHistory();
}

// 修改剧情模式切换方法
export function toggleStoryMode(enabled: boolean): void {
    if (!currentCharacter) return;

    // 新增：切换到剧情模式时，currentStage跳到1，切回日常时跳到0
    if (enabled) {
        currentCharacter.storyMode.currentStage = 1;
    } else {
        currentCharacter.storyMode.currentStage = 0;
    }

    updateStoryState({
        isStoryMode: enabled,
        currentProgress: 0,
        canAdvance: false
    });
    currentCharacter.storyMode.enabled = enabled;

    // 更新系统提示词
    clearChatHistory();
}

// 修改进度更新方法
export function updateProgress(): void {
    console.log('[DEBUG] chatService.updateProgress 开始执行:', {
        storyState,
        currentCharacter: currentCharacter
    });

    if (!storyState.isStoryMode || !currentCharacter) {
        console.log('[DEBUG] 非剧情模式或无当前角色，直接返回');
        return;
    }

    const currentStage = currentCharacter.storyMode.stages[currentCharacter.storyMode.currentStage];
    console.log('[DEBUG] 当前阶段信息:', {
        currentStage,
        currentProgress: storyState.currentProgress,
        requiredProgress: currentStage?.requiredProgress
    });

    if (!currentStage) {
        console.log('[DEBUG] 无当前阶段信息，直接返回');
        return;
    }

    // 增加进度
    storyState.currentProgress += 1;
    console.log('[DEBUG] 进度更新后:', {
        currentProgress: storyState.currentProgress,
        requiredProgress: currentStage.requiredProgress
    });

    // 检查是否可以推进到下一阶段
    checkStageAdvancement();
}

function checkStageAdvancement(): void {
    console.log('[DEBUG] checkStageAdvancement 开始执行:', {
        storyState,
        currentCharacter: currentCharacter
    });

    if (!currentCharacter) {
        console.log('[DEBUG] 无当前角色，直接返回');
        return;
    }

    const currentStage = currentCharacter.storyMode.stages[currentCharacter.storyMode.currentStage];
    console.log('[DEBUG] 检查阶段推进条件:', {
        currentStage,
        currentProgress: storyState.currentProgress,
        requiredProgress: currentStage?.requiredProgress,
        isLastStage: currentCharacter.storyMode.currentStage === currentCharacter.storyMode.stages.length - 1
    });

    if (!currentStage) {
        console.log('[DEBUG] 无当前阶段信息，直接返回');
        return;
    }

    // 检查是否达到推进条件
    if (storyState.currentProgress >= currentStage.requiredProgress) {
        console.log('[DEBUG] 达到推进条件，更新canAdvance状态');
        storyState.canAdvance = true;
    } else {
        console.log('[DEBUG] 未达到推进条件，重置canAdvance状态');
        storyState.canAdvance = false;
    }
}

// 修改剧情推进方法
export function advanceStory(): void {
    if (!currentCharacter || !storyState.isStoryMode || !storyState.canAdvance) return;

    const nextStageId = currentCharacter.storyMode.currentStage + 1;
    const nextStage = currentCharacter.storyMode.stages.find(stage => stage.stageId === nextStageId);

    if (nextStage) {
        currentCharacter.storyMode.currentStage = nextStageId;
        updateStoryState({
            currentProgress: 0,
            canAdvance: false
        });
        clearChatHistory();
    }
}

/**
 * 执行DeepSeek API请求
 * @param messages 消息数组
 * @param temperature 温度参数
 * @returns API响应
 */
async function callDeepSeekAPI(messages: ChatMessage[], temperature = systemPromptConfig.globalAISettings.defaultTemp): Promise<string> {
    const config = modelConfigs[AIModel.DEEPSEEK];
    const apiKey = import.meta.env[config.apiKeyEnvVar];
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

    try {
        console.log(`发送请求到DeepSeek API: ${config.endpoint}`);

        // 检查API密钥是否存在
        if (!apiKey) {
            throw new Error(`${config.name} API密钥未设置。请在.env文件中添加${config.apiKeyEnvVar}`);
        }

        console.log(`使用的API Key: ${apiKey.substring(0, 5)}...`);

        const response = await fetch(config.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: systemPromptConfig.globalAISettings.model,
                messages: messages,
                temperature: temperature,
                max_tokens: config.maxTokens,
                top_p: systemPromptConfig.globalAISettings.topP,
                stream: false,
                no_think: true
            }),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('API响应错误:', response.status, errorText);
            let errorMessage = `API错误 (${response.status})`;

            try {
                const errorData = JSON.parse(errorText);
                errorMessage = errorData.error?.message || errorMessage;
            } catch (e) {
                errorMessage = errorText || errorMessage;
            }

            throw new Error(`${config.name} API错误: ${errorMessage}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        clearTimeout(timeoutId);
        throw error;
    }
}

/**
 * 执行Gemini API请求
 * @param messages 消息数组
 * @param temperature 温度参数
 * @returns API响应
 */
async function callGeminiAPI(messages: ChatMessage[], temperature = systemPromptConfig.globalAISettings.defaultTemp): Promise<string> {
    const config = modelConfigs[AIModel.GEMINI];
    const apiKey = import.meta.env[config.apiKeyEnvVar];
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

    try {
        console.log(`发送请求到Gemini API: ${config.endpoint}`);

        // 检查API密钥是否存在
        if (!apiKey) {
            throw new Error(`${config.name} API密钥未设置。请在.env文件中添加${config.apiKeyEnvVar}`);
        }

        console.log(`使用的API Key: ${apiKey.substring(0, 5)}...`);

        // 转换消息格式为Gemini格式
        const geminiMessages = messages.filter(msg => msg.role !== 'system').map(msg => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }]
        }));

        // 添加系统消息到第一条用户消息中
        const systemMessage = messages.find(msg => msg.role === 'system');
        if (systemMessage && geminiMessages.length > 0 && geminiMessages[0].role === 'user') {
            geminiMessages[0].parts[0].text = systemMessage.content + '\n\n' + geminiMessages[0].parts[0].text;
        }

        const response = await fetch(`${config.endpoint}?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: geminiMessages,
                generationConfig: {
                    temperature: temperature,
                    maxOutputTokens: config.maxTokens,
                    topP: systemPromptConfig.globalAISettings.topP
                }
            }),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('API响应错误:', response.status, errorText);
            let errorMessage = `API错误 (${response.status})`;

            try {
                const errorData = JSON.parse(errorText);
                errorMessage = errorData.error?.message || errorMessage;
            } catch (e) {
                errorMessage = errorText || errorMessage;
            }

            throw new Error(`${config.name} API错误: ${errorMessage}`);
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        clearTimeout(timeoutId);
        throw error;
    }
}

/**
 * 调用AI API
 * @param messages 消息历史
 * @param temperature 温度参数
 * @param onStream 流式回调函数
 * @returns AI回复
 */
async function callAIAPI(
    messages: ChatMessage[],
    temperature = systemPromptConfig.globalAISettings.defaultTemp,
    onStream?: (text: string) => void
): Promise<string> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

    try {
        const config = modelConfigs[currentModel];
        const apiKey = import.meta.env[config.apiKeyEnvVar];
        if (!apiKey) {
            throw new Error(`${config.name} API密钥未设置。请在.env文件中添加${config.apiKeyEnvVar}`);
        }

        // 保留请求体调试日志，用于参考
        const requestBody = {
            model: systemPromptConfig.globalAISettings.model,
            messages,
            temperature,
            max_tokens: config.maxTokens,
            top_p: systemPromptConfig.globalAISettings.topP,
            stream: !!onStream,
            no_think: true
        };
        console.log('[API请求] 发送请求体:', JSON.stringify(requestBody, null, 2));

        console.log(`发送请求到${config.name} API: ${config.endpoint}`);

        const response = await fetch(config.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(requestBody),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('API响应错误:', response.status, errorText);
            throw new Error(`API错误 (${response.status}): ${errorText}`);
        }

        // 添加响应头调试日志
        console.log('[API响应] 响应头:', {
            'content-type': response.headers.get('content-type'),
            'transfer-encoding': response.headers.get('transfer-encoding')
        });

        if (onStream) {
            const reader = response.body?.getReader();
            if (!reader) {
                throw new Error('无法获取响应流');
            }

            let fullResponse = '';
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                console.log('[API响应] 收到chunk，长度为', chunk.length);

                const lines = chunk.split('\n').filter(line => line.trim() !== '');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6);
                        if (data === '[DONE]') {
                            console.log('[API响应] 流式响应完成');
                            continue;
                        }

                        try {
                            const parsed = JSON.parse(data);
                            const content = parsed.choices[0]?.delta?.content || '';
                            if (content) {
                                // console.log('[API响应] 解析到content:', content);
                                fullResponse += content;
                                onStream(content);
                            }
                        } catch (e) {
                            console.error('[API响应] 解析流式响应失败:', e, '原始数据:', data);
                        }
                    }
                }
            }

            console.log('[API响应] 流式响应总长度:', fullResponse.length);
            return fullResponse;
        } else {
            const data = await response.json();
            return data.choices[0]?.message?.content || '抱歉，我现在无法回复。';
        }
    } catch (error) {
        clearTimeout(timeoutId);
        throw error;
    }
}

/**
 * 获取回退回复
 */
function getFallbackResponse(character: Character): string {
    const fallbackResponses = character.fallbackReplies || [
        `(${character.name}似乎有些恍惚，轻轻叹了口气) 抱歉，我需要一点时间整理思绪...`,
        `(${character.name}微微皱眉，露出思考的表情) 连接似乎出了些问题，让我们稍后再继续吧。`,
        `(${character.name}的目光有些迷离) 我暂时无法回应，请给我一点时间...`,
        `(${character.name}轻轻整理着衣袖) 我的思绪有些混乱，能稍等片刻吗？`
    ];

    if (!fallbackResponses || fallbackResponses.length === 0) {
        return '(抱歉，我现在无法正常回复。请稍后再试。)';
    }

    // 避免连续使用相同的回退回复
    let index = Math.floor(Math.random() * fallbackResponses.length);
    while (fallbackResponses.length > 1 && index === lastFallbackIndex) {
        index = Math.floor(Math.random() * fallbackResponses.length);
    }
    lastFallbackIndex = index;
    return fallbackResponses[index];
}

/**
 * 记录聊天消息到数据库
 */
async function logChatMessage(character: Character, message: string, messageType: 'user' | 'assistant', inputMethod: 'auto' | 'manual', metadata: { responseTime: number; tokensUsed: number }) {
    try {
        const dbService = await getDbService();
        await dbService.logChat({
            userId: 'user-' + Date.now(),
            sessionId: 'session-' + Date.now(),
            role: character.name,
            messageType,
            inputMethod,
            message,
            round: chatHistory.length,
            metadata
        });
    } catch (error) {
        console.error('记录聊天消息失败:', error);
    }
}

/**
 * 生成角色回复
 * @param characterId 角色ID
 * @param message 用户消息
 * @param onStream 流式回调函数
 * @returns 角色回复
 */
export async function generateCharacterReply(
    characterId: string,
    message: string,
    onStream?: (text: string) => void,
    retryCount = 0
): Promise<string> {
    const character = getCharacterById(characterId);
    if (!character) {
        throw new Error(`Character not found: ${characterId}`);
    }

    try {
        // 记录当前角色交互次数
        if (retryCount === 0) {
            console.log(`用户与 ${character.name}(${characterId}) 进行了对话`);

            // 记录用户消息到数据库
            await logChatMessage(character, message, 'user', 'manual', {
                responseTime: 0,
                tokensUsed: 0
            });
        }

        // 检查用户输入是否超过限制
        if (message.length > systemPromptConfig.charLimits.userInputMax) {
            message = message.substring(0, systemPromptConfig.charLimits.userInputMax);
        }

        // 添加用户消息到历史记录
        if (retryCount === 0) {
            chatHistory.push({
                role: 'user',
                content: message
            });

            // 保持历史记录在限制范围内
            while (chatHistory.length > MAX_HISTORY + 1) {
                if (chatHistory[0].role === 'system') {
                    chatHistory.splice(1, 1);
                } else {
                    chatHistory.shift();
                }
            }
        }

        // 更新系统提示词
        chatHistory[0] = {
            role: 'system',
            content: generateSystemPrompt(character)
        };

        console.log(`发送请求到${modelConfigs[currentModel].name} API (尝试 ${retryCount + 1}/${MAX_RETRY_ATTEMPTS + 1})`);

        // 调用API
        const startTime = Date.now();
        let fullResponse = '';

        // 如果有流式回调，使用流式响应
        if (onStream) {
            fullResponse = await callAIAPI(chatHistory, undefined, (chunk) => {
                fullResponse += chunk;
                onStream(chunk);
            });
        } else {
            fullResponse = await callAIAPI(chatHistory);
        }

        const responseTime = Date.now() - startTime;

        // 记录AI回复到数据库
        await logChatMessage(character, fullResponse, 'assistant', 'auto', {
            responseTime,
            tokensUsed: Math.ceil(fullResponse.length / 4)
        });

        // 添加回复到历史记录
        chatHistory.push({
            role: 'assistant',
            content: fullResponse
        });

        return fullResponse;

    } catch (error: unknown) {
        console.error(`调用${modelConfigs[currentModel].name} API失败 (尝试 ${retryCount + 1}/${MAX_RETRY_ATTEMPTS + 1}):`, error);

        if (error instanceof Error && (error.message.includes('API密钥错误') || error.message.includes('API key'))) {
            console.error('===== API密钥错误 =====');
            console.error(`请确保已在.env文件中设置有效的${modelConfigs[currentModel].apiKeyEnvVar}`);
            console.error('查看API_SETUP.md文件获取详细设置指南');
            throw error;
        }

        // 如果是重试次数未超过限制，则重试
        if (retryCount < MAX_RETRY_ATTEMPTS) {
            console.log(`等待 ${RETRY_DELAY}ms 后重试...`);
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
            return generateCharacterReply(characterId, message, onStream, retryCount + 1);
        }

        // 如果重试次数已达上限，使用回退回复
        console.log('重试次数已达上限，使用回退回复');
        const fallbackResponse = getFallbackResponse(character);

        // 记录回退回复到数据库
        await logChatMessage(character, fallbackResponse, 'assistant', 'auto', {
            responseTime: 0,
            tokensUsed: 0
        });

        return fallbackResponse;
    }
}

/**
 * 生成玩家视角的回复
 * @param characterId 角色ID
 * @param message 角色消息
 * @returns 玩家视角的回复
 */
export async function generatePlayerReply(characterId: string, message: string): Promise<string> {
    const character = getCharacterById(characterId);
    if (!character) {
        throw new Error(`Character not found: ${characterId}`);
    }

    const prompt = generatePlayerPrompt(character, message);
    const messages: ChatMessage[] = [
        {
            role: 'system',
            content: prompt
        }
    ];

    try {
        return await callAIAPI(messages);
    } catch (error) {
        console.error('生成玩家回复失败:', error);
        return '(轻轻叹息) 抱歉，我现在无法回应...';
    }
}

/**
 * 生成自动回复选项
 * @param characterId 角色ID
 * @param message 角色消息
 * @param chatHistory 对话历史
 * @returns 自动回复选项列表
 */
export async function generateAutoReplies(
    characterId: string,
    message: string,
    chatHistory: Message[] = []
): Promise<string[]> {
    const character = getCharacterById(characterId);
    if (!character) {
        throw new Error(`Character not found: ${characterId}`);
    }

    const prompt = generateAutoReplyPrompt(character, message, chatHistory);
    const messages: ChatMessage[] = [
        {
            role: 'system',
            content: prompt
        }
    ];

    try {
        const response = await callAIAPI(messages, systemPromptConfig.globalAISettings.defaultTemp + 0.1);

        // 确保返回的是有效的选项字符串
        if (!response.includes('|')) {
            // 如果没有分隔符，尝试将回复拆分成多个选项
            const sentences = response.split(/[.!?。！？]/).filter(s => s.trim().length > 0);
            if (sentences.length > 0) {
                return sentences.slice(0, 3);
            }
            // 如果无法拆分，返回默认选项
            return [
                '(微微点头) 我明白了',
                '(轻声说) 继续',
                '(若有所思) 原来如此'
            ];
        }

        const autoReplies = response.split('|').map(option => option.trim());

        // 记录自动回复选项到数据库
        await logChatMessage(character, JSON.stringify(autoReplies), 'assistant', 'auto', {
            responseTime: 0,
            tokensUsed: 0
        });

        return autoReplies;
    } catch (error) {
        console.error('生成自动回复选项失败:', error);
        return [
            '(微微点头) 我明白了',
            '(轻声说) 继续',
            '(若有所思) 原来如此'
        ];
    }
}

/**
 * 获取角色对话历史
 * @param characterId 角色ID
 * @returns 对话历史
 */
export async function getCharacterHistory(characterId: string): Promise<Message[]> {
    const character = getCharacterById(characterId);
    if (!character) {
        throw new Error(`Character not found: ${characterId}`);
    }

    return character.initialMessages;
}

/**
 * 清除对话历史
 */
export function clearChatHistory(): void {
    chatHistory = [
        {
            role: 'system',
            content: currentCharacter.systemPrompt || ''
        }
    ];
    // 重置上次使用的回退回复索引
    lastFallbackIndex = -1;
}

/**
 * 刷新AI回复
 * @param characterId 角色ID
 * @param lastUserMessage 最后一条用户消息
 * @returns 返回新的AI回复
 */
export async function refreshAIResponse(characterId: string, lastUserMessage?: string): Promise<string | null> {
    // 检查是否有用户消息可以刷新
    if (!lastUserMessage && chatHistory.length < 2) {
        console.log('没有可刷新的对话');
        return null;
    }

    // 获取最后一条用户消息
    const userMessage = lastUserMessage || chatHistory.find(msg => msg.role === 'user')?.content;
    if (!userMessage) {
        console.log('找不到用户消息');
        return null;
    }

    // 如果有AI回复，从历史记录中移除最后一条AI回复
    if (chatHistory.length > 1 && chatHistory[chatHistory.length - 1].role === 'assistant') {
        chatHistory.pop();
    }

    // 重新请求AI回复
    console.log('刷新AI回复...');
    return generateCharacterReply(characterId, userMessage);
} 
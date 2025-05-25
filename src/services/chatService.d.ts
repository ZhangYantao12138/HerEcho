import type { Character } from '../types/character';
import type { Message } from '../types/chat';
/**
 * 设置当前角色
 * @param character 角色对象
 */
export declare function setCurrentCharacter(character: Character): void;
/**
 * 生成角色回复
 * @param characterId 角色ID
 * @param message 用户消息
 * @returns 角色回复
 */
export declare function generateCharacterReply(characterId: string, message: string, retryCount?: number): Promise<string>;
/**
 * 生成玩家视角的回复
 * @param characterId 角色ID
 * @param message 角色消息
 * @returns 玩家视角的回复
 */
export declare function generatePlayerReply(characterId: string, message: string): Promise<string>;
/**
 * 生成自动回复选项
 * @param characterId 角色ID
 * @param message 角色消息
 * @returns 自动回复选项列表
 */
export declare function generateAutoReplies(characterId: string, message: string): Promise<string[]>;
/**
 * 获取角色对话历史
 * @param characterId 角色ID
 * @returns 对话历史
 */
export declare function getCharacterHistory(characterId: string): Promise<Message[]>;
/**
 * 清除对话历史
 */
export declare function clearChatHistory(): void;
/**
 * 刷新AI回复
 * @param characterId 角色ID
 * @param lastUserMessage 最后一条用户消息
 * @returns 返回新的AI回复
 */
export declare function refreshAIResponse(characterId: string, lastUserMessage?: string): Promise<string | null>;

import type { Character } from '../types/character';
/**
 * 生成角色对话的 prompt
 * @param character 对话角色
 * @returns 角色对话的 prompt
 */
export declare function generateCharacterPrompt(character: Character): string;
/**
 * 生成玩家视角的 prompt
 * @param character 对话角色
 * @param message 角色的消息
 * @returns 玩家视角的 prompt
 */
export declare function generatePlayerPrompt(character: Character, message: string): string;
/**
 * 生成自动回复选项的 prompt
 * @param character 对话角色
 * @param message 角色的消息
 * @returns 自动回复选项的 prompt
 */
export declare function generateAutoReplyPrompt(character: Character, message: string): string;

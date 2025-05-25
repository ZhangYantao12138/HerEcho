import type { Character } from '../types/character';
export declare function generateCharacterResponsePrompt(character: Character, userMessage: string): string;
export declare function generatePlayerAutoResponsePrompt(character: Character, characterMessage: string): string;
export declare function getFallbackRepliesForCharacter(character: Character): string[];
export declare const CHARACTER_PROMPTS: Record<string, string>;

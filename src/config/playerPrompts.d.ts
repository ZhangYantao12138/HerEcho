import type { Character } from '../types/character';
export declare function generateDetailedPlayerPrompt(character: Character, characterMessage: string): string;
interface PlayerRoleInfo {
    name?: string;
    background: string;
    relationship: string;
    toneStyle: string;
}
export declare function getPlayerRoleInfo(characterId: string): PlayerRoleInfo;
export {};

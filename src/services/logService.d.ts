interface LogEntry {
    timestamp: string;
    type: 'character_switch' | 'character_interaction' | 'viewpoint_change';
    characterId?: string;
    characterName?: string;
    viewpointKey?: string;
    message: string;
}
export declare function logCharacterInteraction(characterId: string, characterName: string, action: string): Promise<void>;
export declare function logViewpointChange(viewpointKey: string, characterId: string, characterName: string): Promise<void>;
export declare function getLocalLogs(): LogEntry[];
export declare function clearLocalLogs(): void;
export {};

interface Option {
    id: string;
    text: string;
    content?: string;
    nextSceneId?: string;
    specialEffect?: string;
    consequences?: {
        unlockStoryline?: string;
        triggerEnding?: string;
        unlockClue?: string;
        triggerEvent?: string;
    };
}
interface Scene {
    id: string;
    title: string;
    description: string;
    image?: string;
    canReplay?: boolean;
    options?: Option[];
}
interface Ending {
    id: string;
    title: string;
    description: string;
    type: 'BE' | 'NE' | 'TE' | 'HE';
}
interface GameState {
    currentStoryId: string;
    currentSceneId: string;
    scenes: Scene[];
    showOptionDialog: boolean;
    currentOption: Option | null;
    unlockedEffects: string[];
    unlockedStorylines: string[];
    collectedClues: string[];
    memoryFlashbackCount: number;
    harmToJiangCount: number;
    endings: Ending[];
    activeEnding: string | null;
    userChoices: Array<{
        sceneId: string;
        optionId: string;
    }>;
}
export declare const useDreamStore: import("pinia").StoreDefinition<"dream", GameState, {
    currentScene(): Scene | undefined;
    hasUnlockedHiddenEnding(): boolean;
    hasCollectedAllDeathClues(): boolean;
}, {
    initializeStory(storyId: string): void;
    initializeScenes(): void;
    selectOption(optionId: string): boolean;
    continueToNextScene(): boolean;
    checkSpecialEndings(): void;
    replayCurrentScene(): void;
}>;
export {};

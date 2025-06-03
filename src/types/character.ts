export interface Message {
    id: number;
    content: string;
    isUser: boolean;
    hasAudio: boolean;
}

export interface SceneInfo {
    title: string;
    stage: string;
    progress: number;
}

export interface VoiceSettings {
    voice_id: string;
    speed: number;
    vol: number;
    pitch: number;
    emotion: 'happy' | 'sad' | 'angry' | 'fearful' | 'disgusted' | 'surprised' | 'neutral';
}

export interface Character {
    id: string;
    book_id: string;
    name: string;
    avatar: string;
    backgroundDescription: string;
    systemPrompt: string;
    backgroundImage: string;
    voiceSettings: VoiceSettings;
    sceneInfo: {
        title: string;
        stage: string;
        progress: number;
    };
    initialMessages: Message[];
    fallbackReplies?: string[];
    personality?: string;
    relationships?: string;
    currentState?: string;
} 
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

export interface StoryStage {
    stageId: number;          // 剧情阶段序号
    stageName: string;        // 剧情阶段名称
    systemPrompt: string;     // 系统提示词
    stagePrompt: string;      // 阶段提示词
    requiredProgress: number; // 推进所需进度值
}

export interface StoryMode {
    enabled: boolean;       // 是否启用剧情模式
    currentStage: number;   // 当前剧情阶段
    stages: StoryStage[];   // 剧情阶段配置
}

export interface Character {
    id: string;
    book_id: string;
    name: string;
    avatar: string;
    backgroundDescription?: string;
    systemPrompt?: string;
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
    storyMode: StoryMode;  // 剧情模式配置
} 
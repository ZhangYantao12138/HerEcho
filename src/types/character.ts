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

export interface Character {
    id: string;
    book_id: string;
    name: string;
    avatar: string;
    backgroundImage: string;
    systemPrompt: string;
    initialMessages: Message[];
    sceneInfo: SceneInfo;
} 
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
    backgroundDescription: string;
    systemPrompt: string;
    backgroundImage: string;
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

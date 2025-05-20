export interface Script {
    id: string;
    title: string;
    description: string;
    coverImage: string;
    isNew: boolean;
    isLocked?: boolean;
    progress: number;
    totalChapters?: number;
    completedChapters?: number;
    comingSoon?: boolean;
    background: string;
    characters: string[]; // 角色ID列表
} 
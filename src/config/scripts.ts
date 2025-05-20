import type { Script } from '../types/script';
import bgImg from '../assets/bg.png';

// 清风书院剧本配置
export const scriptB001: Script = {
    id: 'B001',
    title: '清风书院',
    description: '在心理医院的背景下，展开一段关于治愈与救赎的故事。你将与羌青瓷、程聿怀等角色相遇，探索他们之间复杂的情感纠葛。',
    coverImage: bgImg,
    isNew: true,
    progress: 0,
    totalChapters: 5,
    completedChapters: 0,
    background: '心理医院',
    characters: ['B001C001', 'B001C002'] // 对应 characters.ts 中的角色ID
};

// 阙落剧本配置
export const scriptB002: Script = {
    id: 'B002',
    title: '阙落',
    description: '一个发生在古代的故事，敬请期待...',
    coverImage: bgImg,
    isNew: false,
    isLocked: true,
    progress: 0,
    comingSoon: true,
    background: '古代',
    characters: []
};

// 导出所有剧本配置
export const scripts: Script[] = [scriptB001, scriptB002];

// 获取默认剧本
export const getDefaultScript = (): Script => scriptB001;

// 根据ID获取剧本
export const getScriptById = (id: string): Script | undefined => {
    return scripts.find(script => script.id === id);
}; 
import script001Img from '../assets/Scripts/script001_lmxs.jpg';
import script002Img from '../assets/Scripts/script002_ql.jpg';
// 流氓叙事剧本配置
export const scriptB001 = {
    id: 'B001',
    title: '流氓叙事',
    description: '在心理医院的背景下，展开一段关于治愈与救赎的故事。你将与羌青瓷、程聿怀等角色相遇，探索他们之间复杂的情感纠葛。',
    coverImage: script001Img,
    isNew: true,
    progress: 0,
    totalChapters: 5,
    completedChapters: 0,
    background: '心理医院',
    characters: ['B001C001', 'B001C002', 'B001C003', 'B001C004', 'B001C005', 'B001C006', 'B001C007', 'B001C008'] // 所有角色的ID
};
// 阙落剧本配置
export const scriptB002 = {
    id: 'B002',
    title: '阙落',
    description: '一个发生在古代的故事，敬请期待...',
    coverImage: script002Img,
    isNew: true,
    progress: 0,
    totalChapters: 5,
    completedChapters: 0,
    background: '古代',
    characters: ['B002C001', 'B002C002', 'B002C003', 'B002C004', 'B002C005', 'B002C006']
};
// 导出所有剧本配置
export const scripts = [scriptB001, scriptB002];
// 获取默认剧本
export const getDefaultScript = () => scriptB001;
// 根据ID获取剧本
export const getScriptById = (id) => {
    return scripts.find(script => script.id === id);
};

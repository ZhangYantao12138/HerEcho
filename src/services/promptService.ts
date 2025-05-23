import type { Character } from '../types/character';
import { getCharacterById } from '../config/characters';
import { VIEWPOINT_MAPPING } from '../config/viewpointConfig';

/**
 * 生成角色对话的 prompt
 * @param character 对话角色
 * @returns 角色对话的 prompt
 */
export function generateCharacterPrompt(character: Character): string {
    // 获取对话者信息
    const viewpointRelation = VIEWPOINT_MAPPING.find(vp => vp.characterId === character.id);
    const viewpointCharacter = viewpointRelation ? getCharacterById(viewpointRelation.viewpointId) : null;

    return `${character.systemPrompt}

当前剧情背景：${character.sceneInfo.title}
当前阶段：${character.sceneInfo.stage}
当前进度：${character.sceneInfo.progress}%

${viewpointCharacter ? `对话者信息：
- 身份：${viewpointCharacter.name}
- 背景：${viewpointCharacter.backgroundDescription}
- 关系：${viewpointCharacter.relationships}
- 当前状态：${viewpointCharacter.currentState || '正常'}` : ''}

请记住：
1. 所有表情和动作描述都用括号()括起来
2. 使用"我"自称，不要用角色名自称
3. 保持角色设定的说话风格和语气
4. 回应要有情感深度，符合当前剧情阶段
5. 即使面对困难的问题，也要保持耐心和温柔
6. 在表达复杂情感时，用更柔和的方式，避免过于尖锐或冷漠
7. 根据与对话者的关系调整语气和态度`;
}

/**
 * 生成玩家视角的 prompt
 * @param character 对话角色
 * @param message 角色的消息
 * @returns 玩家视角的 prompt
 */
export function generatePlayerPrompt(character: Character, message: string): string {
    // 获取玩家视角角色
    const viewpointRelation = VIEWPOINT_MAPPING.find(vp => vp.characterId === character.id);
    if (!viewpointRelation) {
        return generateDefaultPlayerPrompt(character, message);
    }

    const playerCharacter = getCharacterById(viewpointRelation.viewpointId);
    if (!playerCharacter) {
        return generateDefaultPlayerPrompt(character, message);
    }

    return `${playerCharacter.systemPrompt}

当前剧情背景：${character.sceneInfo.title}
当前阶段：${character.sceneInfo.stage}
当前进度：${character.sceneInfo.progress}%

对话者信息：
- 身份：${character.name}
- 背景：${character.backgroundDescription}
- 关系：${character.relationships}
- 当前状态：${character.currentState || '正常'}

${character.name}刚刚说：${message}

请记住：
1. 所有表情和动作描述都用括号()括起来
2. 使用"我"自称，不要用角色名自称
3. 保持角色设定的说话风格和语气
4. 回应要有情感深度，符合当前剧情阶段
5. 即使面对困难的问题，也要保持耐心和温柔
6. 在表达复杂情感时，用更柔和的方式，避免过于尖锐或冷漠
7. 根据与对话者的关系调整语气和态度`;
}

/**
 * 生成默认的玩家视角 prompt
 * @param character 对话角色
 * @param message 角色的消息
 * @returns 默认的玩家视角 prompt
 */
function generateDefaultPlayerPrompt(character: Character, message: string): string {
    return `你需要扮演与${character.name}对话的角色，生成一段自然、符合情境的回复。

当前剧情背景：${character.sceneInfo.title}
当前阶段：${character.sceneInfo.stage}
当前进度：${character.sceneInfo.progress}%

对话者信息：
- 身份：${character.name}
- 背景：${character.backgroundDescription}
- 关系：${character.relationships}
- 当前状态：${character.currentState || '正常'}

${character.name}刚刚说：${message}

回复要求：
1. 所有表情和动作描述都用括号()括起来
2. 保持对话自然流畅，符合当前情境
3. 展现一定情感，但不要过于夸张
4. 回复长度适中，3-5句话为宜
5. 不要重复角色的话
6. 根据与对话者的关系调整语气和态度`;
}

/**
 * 生成自动回复选项的 prompt
 * @param character 对话角色
 * @param message 角色的消息
 * @returns 自动回复选项的 prompt
 */
export function generateAutoReplyPrompt(character: Character, message: string): string {
    const basePrompt = generatePlayerPrompt(character, message);

    return `${basePrompt}

请生成3-4个可能的回复选项，每个选项都应该：
1. 符合当前情境和角色设定
2. 展现不同的情感倾向或态度
3. 包含适当的动作和表情描述
4. 长度适中，1-2句话为宜
5. 根据与对话者的关系调整语气和态度

请用"|"分隔不同的选项，选项前不要带数字或序号。`;
} 
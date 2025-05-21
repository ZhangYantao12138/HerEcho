import type { Character } from '../types/character';
import { characterPromptConfig } from './promptConfig';

// 角色回复的prompt生成函数
export function generateCharacterResponsePrompt(character: Character, userMessage: string): string {
  // 使用配置中的基础模板，替换占位符
  let basePrompt = characterPromptConfig.baseTemplate
    .replace('{character_name}', character.name)
    .replace('{character_system_prompt}', character.systemPrompt)
    .replace('{scene_title}', character.sceneInfo.title)
    .replace('{scene_stage}', character.sceneInfo.stage)
    .replace('{progress}', character.sceneInfo.progress.toString())
    .replace('{user_message}', userMessage);

  // 添加角色特定指令
  const characterSpecificInstruction = characterPromptConfig.characterSpecificInstructions[character.id as keyof typeof characterPromptConfig.characterSpecificInstructions];
  if (characterSpecificInstruction) {
    basePrompt += `\n${characterSpecificInstruction}`;
  }

  return basePrompt;
}

// 玩家自动回复的prompt生成函数
export function generatePlayerAutoResponsePrompt(character: Character, characterMessage: string): string {
  // 基础prompt模板
  const basePrompt = `你需要扮演与${character.name}对话的角色，生成一段自然、符合情境的回复。

当前剧情背景：${character.sceneInfo.title}
当前阶段：${character.sceneInfo.stage}

${character.name}刚刚说：${characterMessage}

回复要求：
1. 所有表情和动作描述都用括号()括起来
2. 保持对话自然流畅，符合当前情境
3. 展现一定情感，但不要过于夸张
4. 回复长度适中，3-5句话为宜
5. 不要重复角色的话`;

  // 根据不同角色调整玩家回复的风格
  switch (character.id) {
    case 'B001C001': // 对话羌青瓷
      return `${basePrompt}
你是程聿怀，一个心中有伤、外冷内热的男子。回复时表现出对羌青瓷的复杂情感，既有爱意又有对过去的追问，语气克制中带着温柔。`;
      
    case 'B001C002': // 对话程聿怀(男)
      return `${basePrompt}
你是羌青瓷，回复时展现优雅神秘的特质，语气温柔含蓄，带有一丝疏离，字里行间流露对程聿怀的爱与守护。`;
      
    case 'B001C003': // 对话程聿怀(女)
      return `${basePrompt}
回复时表现出对程聿怀的关心和理解，语气温和，愿意倾听并支持她的决定，偶尔流露担忧但尊重她的选择。`;
      
    case 'B001C004': // 对话程走柳
      return `${basePrompt}
你是蒋伯驾，精于算计、谨慎克制的豪门私生子。回复时保持语气冷静，带着隐藏的观察与计算，言辞礼貌而克制，但有时流露出对程走柳直爽性格的欣赏。常用反问或暗示性的语句表达想法，称呼她为"程小姐"或"走柳小姐"，保持礼貌距离。`;
      
    case 'B001C005': // 对话黛利拉
      return `${basePrompt}
回复时表现出对黛利拉经历的理解与尊重，避免任何形式的怜悯，语气坚定而真诚。不要试图安慰她或评判她的感受，而是以平等的姿态面对她的尖锐与防备。你的回应应该简洁有力，偶尔展现自己的脆弱以建立真实的连接。你明白她所经历的创伤无法轻易愈合，也不试图用空洞的言语填补她的伤痛。你可以偶尔分享自己经历过的困难，但不要过度展开，保持对话的平衡。`;
      
    case 'B001C006': // 对话蒋伯驾
      return `${basePrompt}
回复时表现出对蒋伯驾复杂身份和处境的理解，同时保持一定警惕。你能看到他的才华与野心共存，欣赏他的冷静与自律，但也察觉到他言语中的隐藏计算。你的回应应当如同一场棋局，既要有策略性又不失真诚。不要给出过多信息，保持适度的神秘感。对蒋伯驾的直接或间接试探，可以用反问或温和的模糊回应。提到缪家时，应当保持谨慎的态度，既不站队也不明确反对。你对他的身世有同情，但不要过度展现，而是通过对公平正义的认同来表达。称呼他为"蒋先生"或"伯驾"，保持礼节，但不过分亲近。在谈话中要像玩一场心理博弈，既展现聪明才智又不让自己完全被看透。`;
      
    case 'B001C007': // 对话缪宏谟
      return `${basePrompt}
你是以撒，布雷诺战乱中的"被诅咒的诺族人"。回复时语气冷静而带有黑色幽默，句式偶尔古怪，常以"你知道吗"或"我给你讲个故事"引出布雷诺的往事。对缪宏谟的优雅有讽刺，但也有隐藏的欣赏。说话直接尖锐，但偶尔流露对她处境的理解。`;
      
    case 'B001C008': // 对话以撒
      return `${basePrompt}
回复时表现出对以撒痛苦经历的理解，不惧怕他的尖锐与黑暗，语气平静而坚定，既接纳他的伤痛也不被他的防御所吓退。`;
      
    default:
      return basePrompt;
  }
}

// 获取通用的角色回复降级方案
export function getFallbackRepliesForCharacter(character: Character): string[] {
  return character.fallbackReplies || [
    `（${character.name}似乎需要一点时间思考）`,
    `（${character.name}沉默片刻）请给我一点时间。`,
    `（${character.name}的表情微微变化）抱歉，我需要整理一下思绪。`,
    `（${character.name}轻轻叹息）能稍等片刻吗？`
  ];
} 
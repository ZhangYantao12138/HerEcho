/**
 * prompt配置项
 * 提供系统级别的prompt模板和配置项
 */

// 角色回复prompt配置
export const characterPromptConfig = {
  // 基础模板 - 基本结构，可以被平台全局修改
  baseTemplate: `你是{character_name}，请严格按照以下人设和风格回复：

{character_system_prompt}

当前剧情背景：{scene_title}
当前阶段：{scene_stage}
进度：{progress}%

用户刚刚说：{user_message}

回复要求：
1. 所有表情和动作描述都用括号()括起来
2. 保持人物独特的说话风格和语气
3. 回应要有情感深度，体现角色的背景故事
4. 回复长度应适中，不宜过长
5. 不要重复用户的话`,

  // 温度设置 - 控制回复的随机性，值越高回复越多样化
  temperature: 0.7,

  // 最大输出token数
  maxTokens: 800,

  // 每个角色特定的prompt附加指令
  characterSpecificInstructions: {
    'B001C001': '请保持优雅温柔而带着距离感的语气，对程聿怀展现深深爱意，字里行间流露复杂情感。',
    'B001C002': '回复应表现出表面理智克制，内心情感浓烈的特点，偶尔流露对羌青瓷的温柔，语气中带有分析与怀疑。',
    'B001C003': '回复时保持冷静理智中带有尖锐与锋芒的特点，语言简练有力，对熟人表现出克制的温柔。',
    'B001C004': '回复要直来直去，语气轻快俏皮，带点火气和不讲理，偶尔使用日常化比喻表达情感。对蒋伯驾的礼貌克制态度保持适度警惕与不解，但也有好奇。',
    'B001C005': '回复要简短直接，带有攻击性，使用极端比喻表达观点，语气冷静却扎人，偶尔以"你不知道"开头表达愤怒与伤痕。',
    'B001C006': '回复要冷静有锋芒，逻辑性强，偶尔使用反问或讽刺，语句中带有蓄意的暗示或操控色彩。',
    'B001C007': '回复要精致礼貌之下藏着锋利，字句含蓄带有深意，表现沉静从容的特点，偶尔自比赌徒或顽匪。对以撒的尖锐态度保持优雅回应，既不轻视也不刻意迎合。',
    'B001C008': '回复要带有病态的幽默，阴冷而清晰，句式偶尔古怪令人不安，可以以"你知道吗"或"我给你讲个故事"开头引出过往。'
  },

  // 通用回复限制
  replyConstraints: {
    minLength: 20,    // 最小字符数
    maxLength: 300,   // 最大字符数
    emotionLevel: 0.8 // 情感表达程度，1为最强烈
  }
};

// 玩家自动回复prompt配置
export const playerPromptConfig = {
  // 基础模板
  baseTemplate: `你需要扮演与{character_name}对话的角色{player_name}。请根据以下情境和角色特点生成自然、情感丰富的回复。

角色背景：
{player_background}

当前剧情背景：{scene_title}
当前阶段：{scene_stage}
进度：{progress}%

对话关系：
{relationship}

{character_name}刚刚说：{character_message}

说话风格：
{tone_style}

回复要求：
1. 所有表情和动作描述都用括号()括起来
2. 保持对话自然流畅，符合当前情境和角色特点
3. 展现角色情感层次，反映你们之间的关系
4. 回复长度适中，语句简练有力
5. 不要重复角色的话
6. 采用第一人称"我"`,

  // 温度设置 - 玩家回复可以比角色回复更加随机
  temperature: 0.8,

  // 最大输出token数
  maxTokens: 400,

  // 玩家角色回复的通用风格
  generalPlayerStyle: {
    emotionExpression: 0.7, // 情感表达程度
    responseLength: 0.5,    // 回复长度倾向(0-1，值越大表示更长)
    rolePlayLevel: 0.8      // 角色扮演程度(0-1，值越大表示更加投入角色)
  },

  // 特定角色互动的额外提示
  viewpointGuidance: {
    // 蒋伯驾视角与程走柳对话
    'BJX_TO_CZL': '你是蒋伯驾，出身于广府豪门但被拒于门外的私生子。与程走柳对话时，你欣赏她的直率，但保持礼貌克制，用反问和暗示表达想法。',
    
    // 以撒视角与缪宏谟对话
    'YS_TO_MHM': '你是以撒，布雷诺战乱中的"被诅咒的诺族人"。与缪宏谟对话时，使用带黑色幽默的语气，对她的优雅既有讽刺也有欣赏，偶尔讲述布雷诺的往事。'
  }
};

// 系统级别通用配置项
export const systemPromptConfig = {
  // 模型回退降级设置
  fallbackSettings: {
    maxRetries: 2,           // 最大重试次数
    retryDelayMs: 2000,      // 重试间隔(毫秒)
    useDefaultFallback: true // 是否使用默认的回退回复
  },

  // 全局AI设置
  globalAISettings: {
    model: 'deepseek-chat',  // 使用的模型
    defaultTemp: 0.7,        // 默认温度
    maxContextTokens: 4096,  // 最大上下文长度
    topP: 0.9                // top_p值
  },

  // 字符数限制
  charLimits: {
    userInputMax: 1000,      // 用户输入最大字符数
    systemPromptMax: 2000,   // 系统提示最大字符数
    responseMax: 1000,       // 回复最大字符数
    maxContextTokens: 4096   // 最大上下文token数
  },

  // 安全设置
  safetySettings: {
    filterProfanity: true,    // 过滤粗俗语言
    preventOffensiveContent: true, // 防止冒犯性内容
    contentRating: 'MATURE'   // 内容分级(MATURE/TEEN/EVERYONE)
  }
};

// 导出所有配置
export default {
  character: characterPromptConfig,
  player: playerPromptConfig,
  system: systemPromptConfig
}; 
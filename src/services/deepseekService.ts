/**
 * DeepSeek API服务
 * 提供与DeepSeek API交互的功能
 */

// 从环境变量获取API密钥
const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
// 正确的API端点
const apiUrl = 'https://api.deepseek.com/v1/chat/completions';

// 保存对话历史
interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// 最多保存10条消息的历史记录
const MAX_HISTORY = 10;
const chatHistory: ChatMessage[] = [
  {
    role: 'system',
    content: '你是羌青瓷，一位优雅、神秘的男性角色，说话风格温柔而带着一丝距离感。你应该以第一人称回应用户，仿佛你们正在进行一场亲密的对话。你的回应应该富有感情，带有适当的动作描述（放在括号内）。'
  }
];

/**
 * 发送消息到DeepSeek API
 * @param message 用户消息
 * @returns 返回AI回复
 */
export async function sendMessageToDeepSeek(message: string): Promise<string> {
  try {
    // 添加用户消息到历史记录
    chatHistory.push({
      role: 'user',
      content: message
    });
    
    // 保持历史记录在限制范围内
    while (chatHistory.length > MAX_HISTORY + 1) { // +1 是因为系统消息始终保留
      if (chatHistory[0].role === 'system') {
        // 如果第一条是系统消息，从第二条开始删除
        chatHistory.splice(1, 1);
      } else {
        // 否则删除第一条
        chatHistory.shift();
      }
    }
    
    console.log('发送请求到DeepSeek API:', apiUrl);
    
    // 使用更可靠的错误处理
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30秒超时
    
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: chatHistory,
          temperature: 0.7,
          max_tokens: 800,
          top_p: 0.9,
          stream: false
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API响应错误:', response.status, errorText);
        let errorMessage = `API错误 (${response.status})`;
        
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error?.message || errorMessage;
        } catch (e) {
          // 如果解析JSON失败，使用原始错误文本
          errorMessage = errorText || errorMessage;
        }
        
        throw new Error(`DeepSeek API错误: ${errorMessage}`);
      }
      
      const data = await response.json();
      const aiResponse = data.choices[0].message.content;
      
      // 添加AI回复到历史记录
      chatHistory.push({
        role: 'assistant',
        content: aiResponse
      });
      
      return aiResponse;
    } catch (fetchError) {
      clearTimeout(timeoutId);
      throw fetchError;
    }
  } catch (error) {
    console.error('调用DeepSeek API失败:', error);
    
    // 使用本地备用响应
    const fallbackResponses = [
      "(看着你，微微一笑) 抱歉，我现在似乎无法联系到我的思绪。能稍后再试吗？",
      "(轻轻叹了口气) 看来我们的连接出了些问题，不过没关系，我们可以稍后再聊。",
      "(若有所思地看着远方) 我似乎暂时失去了与外界的联系，请稍候片刻...",
      "(优雅地整理着衣袖) 看来我需要一点时间来整理思绪，能给我一点时间吗？"
    ];
    
    const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    return randomResponse;
  }
}

/**
 * 清除对话历史
 */
export function clearChatHistory(): void {
  // 保留系统消息
  const systemMessage = chatHistory.find(msg => msg.role === 'system');
  chatHistory.length = 0;
  if (systemMessage) {
    chatHistory.push(systemMessage);
  }
} 
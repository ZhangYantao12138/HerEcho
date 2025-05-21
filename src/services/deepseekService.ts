/**
 * DeepSeek API服务
 * 提供与DeepSeek API交互的功能
 */

import { getDefaultCharacter } from '../config/characters';
import type { Character } from '../types/character';

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
let currentCharacter: Character = getDefaultCharacter();
let chatHistory: ChatMessage[] = [
  {
    role: 'system',
    content: currentCharacter.systemPrompt
  }
];

// 设置当前角色
export function setCurrentCharacter(character: Character): void {
  currentCharacter = character;
  clearChatHistory();
}

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
    while (chatHistory.length > MAX_HISTORY + 1) {
      if (chatHistory[0].role === 'system') {
        chatHistory.splice(1, 1);
      } else {
        chatHistory.shift();
      }
    }

    console.log('发送请求到DeepSeek API:', apiUrl);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

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
          errorMessage = errorText || errorMessage;
        }

        throw new Error(`DeepSeek API错误: ${errorMessage}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;

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

    const fallbackResponses = currentCharacter.fallbackReplies && currentCharacter.fallbackReplies.length > 0
      ? currentCharacter.fallbackReplies
      : [
        `(${currentCharacter.name}似乎有些恍惚，轻轻叹了口气) 抱歉，我需要一点时间整理思绪...`,
        `(${currentCharacter.name}微微皱眉，露出思考的表情) 连接似乎出了些问题，让我们稍后再继续吧。`,
        `(${currentCharacter.name}的目光有些迷离) 我暂时无法回应，请给我一点时间...`,
        `(${currentCharacter.name}轻轻整理着衣袖) 我的思绪有些混乱，能稍等片刻吗？`
      ];
    const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    return randomResponse;
  }
}

/**
 * 清除对话历史
 */
export function clearChatHistory(): void {
  chatHistory = [
    {
      role: 'system',
      content: currentCharacter.systemPrompt
    }
  ];
} 
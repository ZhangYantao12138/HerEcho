/**
 * DeepSeek API服务
 * 提供与DeepSeek API交互的功能
 */

import { getDefaultCharacter } from '../config/characters';
import { systemPromptConfig } from '../config/promptConfig';
import { getViewpointPrompt } from './viewpointService';
import type { Character } from '../types/character';

// 从环境变量获取API密钥
const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
// API端点配置
const apiUrl = 'https://api.deepseek.com/v1/chat/completions';

// 保存对话历史
interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// 从配置文件获取参数
const MAX_HISTORY = systemPromptConfig.charLimits.maxContextTokens > 0 ?
  Math.floor(systemPromptConfig.charLimits.maxContextTokens / 200) : 10; // 大约每条消息200 tokens
const MAX_RETRY_ATTEMPTS = systemPromptConfig.fallbackSettings.maxRetries;
const RETRY_DELAY = systemPromptConfig.fallbackSettings.retryDelayMs;
const API_TIMEOUT = 30000; // 30秒超时

let currentCharacter: Character = getDefaultCharacter();
let chatHistory: ChatMessage[] = [
  {
    role: 'system',
    content: currentCharacter.systemPrompt
  }
];

// 用于存储上次使用的回退回复索引，避免连续使用相同的回复
let lastFallbackIndex: number = -1;

// 设置当前角色
export function setCurrentCharacter(character: Character): void {
  currentCharacter = character;
  clearChatHistory();
}

/**
 * 执行API请求
 * @param messages 消息数组
 * @param temperature 温度参数
 * @returns API响应
 */
async function callDeepSeekAPI(messages: ChatMessage[], temperature = systemPromptConfig.globalAISettings.defaultTemp): Promise<string> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    console.log(`发送请求到DeepSeek API: ${apiUrl}`);
    console.log(`使用的API Key: ${apiKey.substring(0, 10)}...`);

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: systemPromptConfig.globalAISettings.model,
        messages: messages,
        temperature: temperature,
        max_tokens: systemPromptConfig.charLimits.responseMax,
        top_p: systemPromptConfig.globalAISettings.topP,
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
    return data.choices[0].message.content;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

/**
 * 获取回退回复
 * @returns 回退回复文本
 */
function getFallbackResponse(): string {
  const fallbackResponses = currentCharacter.fallbackReplies && currentCharacter.fallbackReplies.length > 0
    ? currentCharacter.fallbackReplies
    : [
      `(${currentCharacter.name}似乎有些恍惚，轻轻叹了口气) 抱歉，我需要一点时间整理思绪...`,
      `(${currentCharacter.name}微微皱眉，露出思考的表情) 连接似乎出了些问题，让我们稍后再继续吧。`,
      `(${currentCharacter.name}的目光有些迷离) 我暂时无法回应，请给我一点时间...`,
      `(${currentCharacter.name}轻轻整理着衣袖) 我的思绪有些混乱，能稍等片刻吗？`
    ];

  // 智能选择回退回复，避免连续使用相同的回复
  let newIndex;
  if (fallbackResponses.length > 1) {
    do {
      newIndex = Math.floor(Math.random() * fallbackResponses.length);
    } while (newIndex === lastFallbackIndex);
    lastFallbackIndex = newIndex;
  } else {
    newIndex = 0;
  }

  return fallbackResponses[newIndex];
}

/**
 * 发送消息到DeepSeek API
 * @param message 用户消息
 * @returns 返回AI回复
 */
export async function sendMessageToDeepSeek(message: string, retryCount = 0): Promise<string> {
  try {
    // 检查用户输入是否超过限制
    if (message.length > systemPromptConfig.charLimits.userInputMax) {
      message = message.substring(0, systemPromptConfig.charLimits.userInputMax);
    }

    // 添加用户消息到历史记录
    if (retryCount === 0) { // 只在首次尝试时添加用户消息，避免重试时重复添加
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
    }

    console.log(`发送请求到DeepSeek API (尝试 ${retryCount + 1}/${MAX_RETRY_ATTEMPTS + 1})`);

    // 调用API
    const aiResponse = await callDeepSeekAPI(chatHistory);

    // 添加回复到历史记录
    chatHistory.push({
      role: 'assistant',
      content: aiResponse
    });

    return aiResponse;
  } catch (error) {
    console.error(`调用DeepSeek API失败 (尝试 ${retryCount + 1}/${MAX_RETRY_ATTEMPTS + 1}):`, error);

    // 如果还有重试次数，则进行重试
    if (retryCount < MAX_RETRY_ATTEMPTS) {
      console.log(`${RETRY_DELAY / 1000}秒后进行第${retryCount + 2}次尝试...`);
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(sendMessageToDeepSeek(message, retryCount + 1));
        }, RETRY_DELAY);
      });
    }

    // 所有重试都失败，使用回退回复
    if (systemPromptConfig.fallbackSettings.useDefaultFallback) {
      const fallbackResponse = getFallbackResponse();

      // 将回退回复也添加到聊天历史中，以保持连贯性
      chatHistory.push({
        role: 'assistant',
        content: fallbackResponse
      });

      return fallbackResponse;
    } else {
      // 如果禁用默认回退，则向上抛出错误
      throw error;
    }
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
  // 重置上次使用的回退回复索引
  lastFallbackIndex = -1;
}

/**
 * 刷新AI回复
 * @param lastUserMessage 最后一条用户消息
 * @returns 返回新的AI回复
 */
export async function refreshAIResponse(lastUserMessage?: string): Promise<string | null> {
  // 检查是否有用户消息可以刷新
  if (!lastUserMessage && chatHistory.length < 2) {
    console.log('没有可刷新的对话');
    return null;
  }

  // 获取最后一条用户消息
  const userMessage = lastUserMessage || chatHistory.find(msg => msg.role === 'user')?.content;
  if (!userMessage) {
    console.log('找不到用户消息');
    return null;
  }

  // 如果有AI回复，从历史记录中移除最后一条AI回复
  if (chatHistory.length > 1 && chatHistory[chatHistory.length - 1].role === 'assistant') {
    chatHistory.pop();
  }

  // 重新请求AI回复
  console.log('刷新AI回复...');
  return sendMessageToDeepSeek(userMessage);
}

/**
 * 获取玩家自动回复
 * @param characterMessage 角色的消息
 * @returns 返回生成的玩家回复选项，以|分隔
 */
export async function getPlayerAutoResponse(characterMessage: string): Promise<string> {
  try {
    // 使用视角服务获取适当的玩家提示
    const playerPrompt = getViewpointPrompt(currentCharacter, characterMessage);

    console.log('获取玩家自动回复...');

    // 构建单消息请求
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: `${playerPrompt}\n\n请生成3个可能的回复选项，每个选项都应该符合角色的性格和当前情境。选项之间用|分隔。每个选项都应该包含动作描述（用括号括起来）和对话内容。例如：(轻轻摇头) 不，我不这么认为|(微笑) 你说得对|(皱眉思考) 让我想想...`
      }
    ];

    // 玩家回复稍微更随机一些
    const temp = systemPromptConfig.globalAISettings.defaultTemp + 0.1;

    const response = await callDeepSeekAPI(messages, temp);

    // 确保返回的是有效的选项字符串
    if (!response.includes('|')) {
      // 如果没有分隔符，尝试将回复拆分成多个选项
      const sentences = response.split(/[.!?。！？]/).filter(s => s.trim().length > 0);
      if (sentences.length > 0) {
        return sentences.slice(0, 3).join('|');
      }
      // 如果无法拆分，返回默认选项
      return '(微微点头) 我明白了|(轻声说) 继续|(若有所思) 原来如此';
    }

    return response;
  } catch (error) {
    console.error('获取玩家自动回复失败:', error);
    return '(微微点头) 我明白了|(轻声说) 继续|(若有所思) 原来如此';
  }
} 
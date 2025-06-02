import { defineStore } from 'pinia'
import { Character } from '../types/script'
import { Message } from '../types/chat'

export const useChatStore = defineStore('chat', {
    state: () => ({
        characters: [] as Character[],
        messages: {} as Record<string, Message[]>,
        loading: false,
        error: null as string | null
    }),

    actions: {
        async fetchCharacter(id: string): Promise<Character> {
            // TODO: 实现从API获取角色信息
            return {
                id,
                name: '测试角色',
                avatar: '/avatars/default.png',
                description: '这是一个测试角色',
                ttsConfig: {
                    voice: 'zh-CN-XiaoxiaoNeural',
                    speed: 1.0,
                    pitch: 1.0
                }
            }
        },

        async fetchChatHistory(characterId: string): Promise<Message[]> {
            // TODO: 实现从API获取聊天历史
            return []
        },

        async sendMessage(params: {
            characterId: string
            content: string
            model: string
        }): Promise<Message> {
            // TODO: 实现发送消息到API
            return {
                id: Date.now(),
                characterId: params.characterId,
                content: params.content,
                timestamp: new Date().toISOString(),
                type: 'user'
            }
        },

        async generateAutoReplyOptions(characterId: string): Promise<string[]> {
            // TODO: 实现生成自动回复选项
            return ['好的', '我明白了', '请继续']
        },

        async testApiConnection(model: string): Promise<void> {
            // TODO: 实现API连接测试
            return Promise.resolve()
        }
    }
})

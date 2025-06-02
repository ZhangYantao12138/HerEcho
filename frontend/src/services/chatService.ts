import axios from 'axios'
import { Message, SendMessageParams, ChatHistoryParams } from '../types/chat'
import { Character } from '../types/script'

const api = axios.create({
    baseURL: '/api'
})

export const chatService = {
    async getCharacter(id: string): Promise<Character> {
        const response = await api.get(`/characters/${id}`)
        return response.data
    },

    async getChatHistory(params: ChatHistoryParams): Promise<Message[]> {
        const response = await api.get('/chat/history', { params })
        return response.data
    },

    async sendMessage(params: SendMessageParams): Promise<Message> {
        const response = await api.post('/chat/message', params)
        return response.data
    },

    async generateAutoReplyOptions(characterId: string): Promise<string[]> {
        const response = await api.get(`/chat/auto-reply/${characterId}`)
        return response.data
    },

    async testApiConnection(model: string): Promise<boolean> {
        try {
            const response = await api.post('/chat/test-api', { model })
            return response.data.success
        } catch (error) {
            return false
        }
    }
} 
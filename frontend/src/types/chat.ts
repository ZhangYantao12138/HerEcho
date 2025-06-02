export interface Message {
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: number
    audioUrl?: string
}

export interface ChatState {
    messages: Message[]
    loading: boolean
    error: string | null
    autoReplyOptions: string[]
}

export interface SendMessageParams {
    characterId: string
    content: string
    model: string
}

export interface ChatHistoryParams {
    characterId: string
    limit?: number
    before?: number
} 
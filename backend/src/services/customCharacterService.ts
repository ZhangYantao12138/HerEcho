export interface CustomCharacterMessage {
    id: string;
    content: string;
    sender: 'user' | 'character';
    timestamp: number;
}

export interface CustomCharacterSession {
    id: string;
    characterName: string;
    characterSetting: string;
    messages: CustomCharacterMessage[];
    createdAt: number;
    updatedAt: number;
}

// 简单的日志函数
const logEvent = (event: string, data: any) => {
    console.log(`[CustomCharacter] ${event}:`, data);
};

const logError = (message: string, error: Error, data: any) => {
    console.error(`[CustomCharacter] ${message}:`, error, data);
};

class CustomCharacterService {
    private sessions: Map<string, CustomCharacterSession> = new Map();
    private apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
    private apiUrl = 'https://api.deepseek.com/v1/chat/completions';

    // 创建新的自建角色会话
    createSession(characterName: string, characterSetting: string): string {
        const sessionId = `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const session: CustomCharacterSession = {
            id: sessionId,
            characterName,
            characterSetting,
            messages: [],
            createdAt: Date.now(),
            updatedAt: Date.now()
        };

        this.sessions.set(sessionId, session);
        this.saveToStorage();
        logEvent('custom_character_session_created', { sessionId, characterName });

        return sessionId;
    }

    // 获取会话
    getSession(sessionId: string): CustomCharacterSession | null {
        return this.sessions.get(sessionId) || null;
    }

    // 获取所有会话
    getAllSessions(): CustomCharacterSession[] {
        return Array.from(this.sessions.values()).sort((a, b) => b.updatedAt - a.updatedAt);
    }

    // 发送消息并获取回复
    async sendMessage(sessionId: string, userMessage: string): Promise<string> {
        const session = this.sessions.get(sessionId);
        if (!session) {
            throw new Error('会话不存在');
        }

        // 添加用户消息
        const userMsg: CustomCharacterMessage = {
            id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            content: userMessage,
            sender: 'user',
            timestamp: Date.now()
        };
        session.messages.push(userMsg);

        try {
            // 构建prompt
            const systemPrompt = this.buildSystemPrompt(session.characterSetting);
            const conversationHistory = this.buildConversationHistory(session.messages);

            // 调用API
            const response = await this.callAPI(systemPrompt, conversationHistory, userMessage);

            // 添加AI回复
            const aiMsg: CustomCharacterMessage = {
                id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                content: response,
                sender: 'character',
                timestamp: Date.now()
            };
            session.messages.push(aiMsg);

            session.updatedAt = Date.now();
            this.saveToStorage();

            logEvent('custom_character_message_sent', {
                sessionId,
                messageLength: userMessage.length,
                responseLength: response.length
            });

            return response;
        } catch (error) {
            logError('自建角色消息发送失败', error as Error, { sessionId });
            throw error;
        }
    }

    // 构建系统prompt
    private buildSystemPrompt(characterSetting: string): string {
        return `你是一个充满魅力的角色扮演AI助手。请根据以下角色设定来扮演这个角色：

【角色设定】
${characterSetting}

【扮演要求】
1. 完全沉浸在角色中，用第一人称说话
2. 保持角色的性格特点、说话方式和行为习惯
3. 回复要自然、生动，富有感情色彩
4. 可以适当使用一些符合角色的语气词、口头禅
5. 回复长度控制在50-200字之间
6. 营造身临其境的对话氛围
7. 保持友好、正面的交流态度

请开始扮演这个角色，用角色的身份和语气来回应用户的对话。`;
    }

    // 构建对话历史
    private buildConversationHistory(messages: CustomCharacterMessage[]): string {
        const recentMessages = messages.slice(-10); // 只取最近10条消息
        return recentMessages.map(msg => {
            const role = msg.sender === 'user' ? '用户' : '角色';
            return `${role}: ${msg.content}`;
        }).join('\n');
    }

    // 调用API
    private async callAPI(systemPrompt: string, conversationHistory: string, userMessage: string): Promise<string> {
        const messages = [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `${conversationHistory ? `【对话历史】\n${conversationHistory}\n\n` : ''}【当前消息】\n${userMessage}` }
        ];

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30秒超时

        try {
            console.log(`发送请求到DeepSeek API: ${this.apiUrl}`);

            // 检查API密钥是否存在
            if (!this.apiKey) {
                throw new Error('DeepSeek API密钥未设置。请在.env文件中添加VITE_DEEPSEEK_API_KEY');
            }

            console.log(`使用的API Key: ${this.apiKey.substring(0, 5)}...`);

            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: 'deepseek-chat',
                    messages,
                    temperature: 0.8,
                    max_tokens: 500,
                    top_p: 0.9,
                    stream: false,
                    no_think: true
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
            return data.choices[0]?.message?.content || '抱歉，我现在无法回复。';
        } catch (error) {
            clearTimeout(timeoutId);
            throw error;
        }
    }

    // 删除会话
    deleteSession(sessionId: string): void {
        this.sessions.delete(sessionId);
        this.saveToStorage();
        logEvent('custom_character_session_deleted', { sessionId });
    }

    // 保存到本地存储
    private saveToStorage(): void {
        try {
            const sessionsData = Array.from(this.sessions.entries());
            localStorage.setItem('customCharacterSessions', JSON.stringify(sessionsData));
        } catch (error) {
            console.warn('保存自建角色会话失败:', error);
        }
    }

    // 从本地存储加载
    loadFromStorage(): void {
        try {
            const sessionsData = localStorage.getItem('customCharacterSessions');
            if (sessionsData) {
                const sessions = JSON.parse(sessionsData);
                this.sessions = new Map(sessions);
            }
        } catch (error) {
            console.warn('加载自建角色会话失败:', error);
        }
    }
}

export const customCharacterService = new CustomCharacterService();

// 初始化时加载数据
customCharacterService.loadFromStorage(); 
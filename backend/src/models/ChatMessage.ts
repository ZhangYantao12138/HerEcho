import { BaseModel } from './BaseModel';
import { MessageSource, MessageType, messageSourceToType } from './types';

export interface ChatMessage extends BaseModel {
    id: number;                     // 消息ID
    session_id: string;             // 会话ID
    user_id: number;                // 用户ID
    character_id: number;           // 角色ID
    message_index: number;          // 消息序号
    content: string;                // 消息内容
    source: MessageSource;          // 消息来源：用户输入/自动回复选项/角色
    tokens_used: number;            // 使用的token数量
    created_at: Date;               // 创建时间
    updated_at: Date;               // 更新时间
}

export class ChatMessageModel extends BaseModel {
    static tableName = 'chat_messages';

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['session_id', 'user_id', 'character_id', 'message_index', 'content', 'source', 'tokens_used'],
            properties: {
                id: { type: 'integer', minimum: 1 },
                session_id: { type: 'string', minLength: 1, maxLength: 50 },
                user_id: { type: 'integer', minimum: 1 },
                character_id: { type: 'integer', minimum: 1 },
                message_index: { type: 'integer', minimum: 0 },
                content: { type: 'string', minLength: 1 },
                source: { type: 'string', enum: ['userInput', 'autoReplyOption', 'character'] },
                tokens_used: { type: 'integer', minimum: 0 },
                created_at: { type: 'string', format: 'date-time' },
                updated_at: { type: 'string', format: 'date-time' }
            }
        };
    }

    static async findById(id: number): Promise<ChatMessage | null> {
        const [message] = await this.query<ChatMessage>(
            'SELECT * FROM chat_messages WHERE id = ?',
            [id]
        );
        return message || null;
    }

    static async findBySessionId(sessionId: string): Promise<ChatMessage[]> {
        return this.query<ChatMessage>(
            'SELECT * FROM chat_messages WHERE session_id = ? ORDER BY message_index ASC',
            [sessionId]
        );
    }

    static async findByUserId(userId: number): Promise<ChatMessage[]> {
        return this.query<ChatMessage>(
            'SELECT * FROM chat_messages WHERE user_id = ? ORDER BY created_at DESC',
            [userId]
        );
    }

    static async create(message: Omit<ChatMessage, 'id' | 'created_at' | 'updated_at'>): Promise<ChatMessage> {
        this.validateRequired(message, ['session_id', 'user_id', 'character_id', 'message_index', 'content', 'source', 'tokens_used']);
        this.validateLength(message.session_id, 1, 50);
        this.validateLength(message.content, 1, 10000);
        this.validateEnum(message.source, ['userInput', 'autoReplyOption', 'character']);
        this.validateNumber(message.tokens_used, 0, 100000);

        const [result] = await this.query<{ insertId: number }>(
            'INSERT INTO chat_messages (session_id, user_id, character_id, message_index, content, source, tokens_used) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [message.session_id, message.user_id, message.character_id, message.message_index, message.content, message.source, message.tokens_used]
        );
        return this.findById(result.insertId) as Promise<ChatMessage>;
    }

    static async update(id: number, message: Partial<ChatMessage>): Promise<ChatMessage> {
        if (message.content) this.validateLength(message.content, 1, 10000);
        if (message.source) this.validateEnum(message.source, ['userInput', 'autoReplyOption', 'character']);
        if (message.tokens_used) this.validateNumber(message.tokens_used, 0, 100000);

        const fields = Object.keys(message)
            .filter(key => key !== 'id' && key !== 'created_at' && key !== 'updated_at')
            .map(key => `${this.camelToSnake(key)} = ?`);

        const values = Object.entries(message)
            .filter(([key]) => key !== 'id' && key !== 'created_at' && key !== 'updated_at')
            .map(([, value]) => value);

        await this.query(
            `UPDATE chat_messages SET ${fields.join(', ')} WHERE id = ?`,
            [...values, id]
        );

        return this.findById(id) as Promise<ChatMessage>;
    }

    static async delete(id: number): Promise<void> {
        await this.query('DELETE FROM chat_messages WHERE id = ?', [id]);
    }

    static async deleteBySessionId(sessionId: string): Promise<void> {
        await this.query('DELETE FROM chat_messages WHERE session_id = ?', [sessionId]);
    }

    static async getMessageType(source: MessageSource): Promise<MessageType> {
        return messageSourceToType[source];
    }

    static async getTotalTokensUsed(userId: number, startDate?: Date, endDate?: Date): Promise<number> {
        let query = 'SELECT SUM(tokens_used) as total FROM chat_messages WHERE user_id = ?';
        const params: any[] = [userId];

        if (startDate) {
            query += ' AND created_at >= ?';
            params.push(startDate);
        }
        if (endDate) {
            query += ' AND created_at <= ?';
            params.push(endDate);
        }

        const [result] = await this.query<{ total: number }>(query, params);
        return result.total || 0;
    }
} 
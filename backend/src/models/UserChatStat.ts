import { BaseModel } from './BaseModel';
import { MessageType, messageTypeToSource } from './types';

export interface UserChatStat extends BaseModel {
    stat_id: string;                // 统计ID
    user_id: number;                // 用户ID
    session_id: string;             // 会话ID
    message_type: MessageType;      // 消息类型：0-用户输入/1-自动回复选项/2-角色回复
    tokens_used: number;            // 使用的token数量
    created_at: Date;               // 创建时间
    updated_at: Date;               // 更新时间
}

export class UserChatStatModel extends BaseModel {
    static tableName = 'user_chat_stats';

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['stat_id', 'user_id', 'session_id', 'message_type', 'tokens_used'],
            properties: {
                stat_id: { type: 'string', minLength: 1, maxLength: 50 },
                user_id: { type: 'integer', minimum: 1 },
                session_id: { type: 'string', minLength: 1, maxLength: 50 },
                message_type: { type: 'integer', enum: [0, 1, 2, 3, 10] },
                tokens_used: { type: 'integer', minimum: 0 },
                created_at: { type: 'string', format: 'date-time' },
                updated_at: { type: 'string', format: 'date-time' }
            }
        };
    }

    static async findById(statId: string): Promise<UserChatStat | null> {
        const [stat] = await this.query<UserChatStat>(
            'SELECT * FROM user_chat_stats WHERE stat_id = ?',
            [statId]
        );
        return stat || null;
    }

    static async findByUserId(userId: number): Promise<UserChatStat[]> {
        return this.query<UserChatStat>(
            'SELECT * FROM user_chat_stats WHERE user_id = ? ORDER BY created_at DESC',
            [userId]
        );
    }

    static async findBySessionId(sessionId: string): Promise<UserChatStat[]> {
        return this.query<UserChatStat>(
            'SELECT * FROM user_chat_stats WHERE session_id = ? ORDER BY created_at ASC',
            [sessionId]
        );
    }

    static async create(stat: Omit<UserChatStat, 'created_at' | 'updated_at'>): Promise<UserChatStat> {
        this.validateRequired(stat, ['stat_id', 'user_id', 'session_id', 'message_type', 'tokens_used']);
        this.validateLength(stat.stat_id, 1, 50);
        this.validateLength(stat.session_id, 1, 50);
        this.validateEnum(stat.message_type, [0, 1, 2, 3, 10]);
        this.validateNumber(stat.tokens_used, 0, 100000);

        const [result] = await this.query<{ insertId: number }>(
            'INSERT INTO user_chat_stats (stat_id, user_id, session_id, message_type, tokens_used) VALUES (?, ?, ?, ?, ?)',
            [stat.stat_id, stat.user_id, stat.session_id, stat.message_type, stat.tokens_used]
        );
        return this.findById(stat.stat_id) as Promise<UserChatStat>;
    }

    static async update(statId: string, stat: Partial<UserChatStat>): Promise<UserChatStat> {
        if (stat.tokens_used) this.validateNumber(stat.tokens_used, 0, 100000);
        if (stat.message_type) this.validateEnum(stat.message_type, [0, 1, 2, 3, 10]);

        const fields = Object.keys(stat)
            .filter(key => key !== 'stat_id' && key !== 'created_at' && key !== 'updated_at')
            .map(key => `${this.camelToSnake(key)} = ?`);

        const values = Object.entries(stat)
            .filter(([key]) => key !== 'stat_id' && key !== 'created_at' && key !== 'updated_at')
            .map(([, value]) => value);

        await this.query(
            `UPDATE user_chat_stats SET ${fields.join(', ')} WHERE stat_id = ?`,
            [...values, statId]
        );

        return this.findById(statId) as Promise<UserChatStat>;
    }

    static async delete(statId: string): Promise<void> {
        await this.query('DELETE FROM user_chat_stats WHERE stat_id = ?', [statId]);
    }

    static async deleteBySessionId(sessionId: string): Promise<void> {
        await this.query('DELETE FROM user_chat_stats WHERE session_id = ?', [sessionId]);
    }

    static async getMessageSource(type: MessageType): Promise<string> {
        return messageTypeToSource[type];
    }

    static async getTotalTokensUsed(userId: number, startDate?: Date, endDate?: Date): Promise<number> {
        let query = 'SELECT SUM(tokens_used) as total FROM user_chat_stats WHERE user_id = ?';
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

    static async getStatsByType(userId: number, startDate?: Date, endDate?: Date): Promise<Record<MessageType, number>> {
        let query = `
            SELECT message_type, SUM(tokens_used) as total 
            FROM user_chat_stats 
            WHERE user_id = ?
        `;
        const params: any[] = [userId];

        if (startDate) {
            query += ' AND created_at >= ?';
            params.push(startDate);
        }
        if (endDate) {
            query += ' AND created_at <= ?';
            params.push(endDate);
        }

        query += ' GROUP BY message_type';

        const stats = await this.query<{ message_type: MessageType; total: number }>(query, params);
        const result: Record<MessageType, number> = {
            0: 0,
            1: 0,
            2: 0,
            3: 0,
            10: 0
        };

        stats.forEach(stat => {
            result[stat.message_type] = stat.total;
        });

        return result;
    }
} 
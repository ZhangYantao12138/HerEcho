import { BaseModel } from './BaseModel';

export interface UsageStat {
    id: number;
    userId: number;
    characterId: string;
    date: Date;
    messageCount: number;
    totalTokens: number;
    avgResponseTime: number;
    createdAt: Date;
}

export class UsageStatModel extends BaseModel {
    static tableName = 'usage_stats';

    static async findById(id: number): Promise<UsageStat | null> {
        const [stat] = await this.query<UsageStat>(
            'SELECT * FROM usage_stats WHERE id = ?',
            [id]
        );
        return stat || null;
    }

    static async findByUserId(userId: number, startDate: Date, endDate: Date): Promise<UsageStat[]> {
        return this.query<UsageStat>(
            'SELECT * FROM usage_stats WHERE user_id = ? AND date BETWEEN ? AND ? ORDER BY date DESC',
            [userId, startDate, endDate]
        );
    }

    static async findByCharacterId(characterId: string, startDate: Date, endDate: Date): Promise<UsageStat[]> {
        return this.query<UsageStat>(
            'SELECT * FROM usage_stats WHERE character_id = ? AND date BETWEEN ? AND ? ORDER BY date DESC',
            [characterId, startDate, endDate]
        );
    }

    static async create(stat: Omit<UsageStat, 'id' | 'createdAt'>): Promise<UsageStat> {
        const [result] = await this.query<{ insertId: number }>(
            'INSERT INTO usage_stats (user_id, character_id, date, message_count, total_tokens, avg_response_time) VALUES (?, ?, ?, ?, ?, ?)',
            [stat.userId, stat.characterId, stat.date, stat.messageCount, stat.totalTokens, stat.avgResponseTime]
        );
        return this.findById(result.insertId) as Promise<UsageStat>;
    }

    static async update(id: number, stat: Partial<UsageStat>): Promise<UsageStat> {
        const fields = Object.keys(stat)
            .filter(key => key !== 'id' && key !== 'createdAt')
            .map(key => `${this.camelToSnake(key)} = ?`);

        const values = Object.entries(stat)
            .filter(([key]) => key !== 'id' && key !== 'createdAt')
            .map(([, value]) => value);

        await this.query(
            `UPDATE usage_stats SET ${fields.join(', ')} WHERE id = ?`,
            [...values, id]
        );

        return this.findById(id) as Promise<UsageStat>;
    }

    static async getDailyStats(userId: number, date: Date): Promise<UsageStat[]> {
        return this.query<UsageStat>(
            'SELECT * FROM usage_stats WHERE user_id = ? AND date = ?',
            [userId, date]
        );
    }

    static async getMonthlyStats(userId: number, year: number, month: number): Promise<UsageStat[]> {
        return this.query<UsageStat>(
            'SELECT * FROM usage_stats WHERE user_id = ? AND YEAR(date) = ? AND MONTH(date) = ?',
            [userId, year, month]
        );
    }

    static async getTotalUsage(userId: number, startDate: Date, endDate: Date): Promise<{
        totalMessages: number;
        totalTokens: number;
        avgResponseTime: number;
    }> {
        const [result] = await this.query<{
            totalMessages: number;
            totalTokens: number;
            avgResponseTime: number;
        }>(
            `SELECT 
        SUM(message_count) as totalMessages,
        SUM(total_tokens) as totalTokens,
        AVG(avg_response_time) as avgResponseTime
      FROM usage_stats 
      WHERE user_id = ? AND date BETWEEN ? AND ?`,
            [userId, startDate, endDate]
        );
        return result;
    }
} 
import { BaseModel } from './BaseModel';

export interface UserActivityLog {
    id: number;
    userId: number;
    activityType: string;
    activityDetails: any;
    ipAddress?: string;
    userAgent?: string;
    createdAt: Date;
}

export class UserActivityLogModel extends BaseModel {
    static tableName = 'user_activity_logs';

    static async findById(id: number): Promise<UserActivityLog | null> {
        const [log] = await this.query<UserActivityLog>(
            'SELECT * FROM user_activity_logs WHERE id = ?',
            [id]
        );
        return log || null;
    }

    static async findByUserId(userId: number, limit: number = 50, offset: number = 0): Promise<UserActivityLog[]> {
        return this.query<UserActivityLog>(
            'SELECT * FROM user_activity_logs WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
            [userId, limit, offset]
        );
    }

    static async findByActivityType(activityType: string, limit: number = 50, offset: number = 0): Promise<UserActivityLog[]> {
        return this.query<UserActivityLog>(
            'SELECT * FROM user_activity_logs WHERE activity_type = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
            [activityType, limit, offset]
        );
    }

    static async create(log: Omit<UserActivityLog, 'id' | 'createdAt'>): Promise<UserActivityLog> {
        const [result] = await this.query<{ insertId: number }>(
            'INSERT INTO user_activity_logs (user_id, activity_type, activity_details, ip_address, user_agent) VALUES (?, ?, ?, ?, ?)',
            [log.userId, log.activityType, JSON.stringify(log.activityDetails), log.ipAddress, log.userAgent]
        );
        return this.findById(result.insertId) as Promise<UserActivityLog>;
    }

    static async delete(id: number): Promise<void> {
        await this.query('DELETE FROM user_activity_logs WHERE id = ?', [id]);
    }

    static async deleteByUserId(userId: number): Promise<void> {
        await this.query('DELETE FROM user_activity_logs WHERE user_id = ?', [userId]);
    }

    static async getActivityCount(userId: number, activityType: string): Promise<number> {
        const [result] = await this.query<{ count: number }>(
            'SELECT COUNT(*) as count FROM user_activity_logs WHERE user_id = ? AND activity_type = ?',
            [userId, activityType]
        );
        return result.count;
    }

    static async cleanupOldLogs(days: number = 90): Promise<void> {
        await this.query(
            'DELETE FROM user_activity_logs WHERE created_at < DATE_SUB(NOW(), INTERVAL ? DAY)',
            [days]
        );
    }
} 
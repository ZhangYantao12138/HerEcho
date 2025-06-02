import { BaseModel } from './BaseModel';

export interface ErrorLog {
    id: number;
    userId?: number;
    sessionId?: number;
    errorType: string;
    errorMessage: string;
    stackTrace?: string;
    createdAt: Date;
}

export class ErrorLogModel extends BaseModel {
    static tableName = 'error_logs';

    static async findById(id: number): Promise<ErrorLog | null> {
        const [log] = await this.query<ErrorLog>(
            'SELECT * FROM error_logs WHERE id = ?',
            [id]
        );
        return log || null;
    }

    static async findByUserId(userId: number, limit: number = 50, offset: number = 0): Promise<ErrorLog[]> {
        return this.query<ErrorLog>(
            'SELECT * FROM error_logs WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
            [userId, limit, offset]
        );
    }

    static async findBySessionId(sessionId: number, limit: number = 50, offset: number = 0): Promise<ErrorLog[]> {
        return this.query<ErrorLog>(
            'SELECT * FROM error_logs WHERE session_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
            [sessionId, limit, offset]
        );
    }

    static async findByErrorType(errorType: string, limit: number = 50, offset: number = 0): Promise<ErrorLog[]> {
        return this.query<ErrorLog>(
            'SELECT * FROM error_logs WHERE error_type = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
            [errorType, limit, offset]
        );
    }

    static async create(log: Omit<ErrorLog, 'id' | 'createdAt'>): Promise<ErrorLog> {
        const [result] = await this.query<{ insertId: number }>(
            'INSERT INTO error_logs (user_id, session_id, error_type, error_message, stack_trace) VALUES (?, ?, ?, ?, ?)',
            [log.userId, log.sessionId, log.errorType, log.errorMessage, log.stackTrace]
        );
        return this.findById(result.insertId) as Promise<ErrorLog>;
    }

    static async delete(id: number): Promise<void> {
        await this.query('DELETE FROM error_logs WHERE id = ?', [id]);
    }

    static async deleteByUserId(userId: number): Promise<void> {
        await this.query('DELETE FROM error_logs WHERE user_id = ?', [userId]);
    }

    static async deleteBySessionId(sessionId: number): Promise<void> {
        await this.query('DELETE FROM error_logs WHERE session_id = ?', [sessionId]);
    }

    static async getErrorCount(errorType: string): Promise<number> {
        const [result] = await this.query<{ count: number }>(
            'SELECT COUNT(*) as count FROM error_logs WHERE error_type = ?',
            [errorType]
        );
        return result.count;
    }

    static async cleanupOldLogs(days: number = 30): Promise<void> {
        await this.query(
            'DELETE FROM error_logs WHERE created_at < DATE_SUB(NOW(), INTERVAL ? DAY)',
            [days]
        );
    }
} 
import { DatabaseService } from '../database/dbService';

interface ErrorLog {
    error_type: string;
    error_message: string;
    stack_trace?: string;
    user_id?: number;
    session_id?: string;
}

export class ErrorService {
    private static instance: ErrorService;
    private db: DatabaseService;

    private constructor() {
        this.db = DatabaseService.getInstance();
    }

    public static getInstance(): ErrorService {
        if (!ErrorService.instance) {
            ErrorService.instance = new ErrorService();
        }
        return ErrorService.instance;
    }

    public async logError(error: ErrorLog): Promise<void> {
        try {
            const sql = `
                INSERT INTO error_logs 
                (error_type, error_message, stack_trace, user_id, session_id) 
                VALUES (?, ?, ?, ?, ?)
            `;

            await this.db.query(sql, [
                error.error_type,
                error.error_message,
                error.stack_trace,
                error.user_id,
                error.session_id
            ]);
        } catch (err) {
            console.error('记录错误日志失败:', err);
            // 这里我们不再抛出错误，因为这是错误处理服务本身
            // 如果错误处理服务出错，我们只记录到控制台
        }
    }
} 
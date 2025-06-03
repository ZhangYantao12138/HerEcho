import mysql from 'mysql2/promise';
import { dbConfig } from '../../config/database';

export class DatabaseService {
    private static instance: DatabaseService;
    private pool: mysql.Pool;

    private constructor() {
        this.pool = mysql.createPool(dbConfig);
    }

    public static getInstance(): DatabaseService {
        if (!DatabaseService.instance) {
            DatabaseService.instance = new DatabaseService();
        }
        return DatabaseService.instance;
    }

    public async query<T>(sql: string, params?: any[]): Promise<T> {
        try {
            const [rows] = await this.pool.execute(sql, params);
            return rows as T;
        } catch (error) {
            console.error('数据库查询错误:', error);
            throw error;
        }
    }

    public async testConnection(): Promise<boolean> {
        try {
            const connection = await this.pool.getConnection();
            connection.release();
            return true;
        } catch (error) {
            console.error('数据库连接测试失败:', error);
            return false;
        }
    }

    public async close(): Promise<void> {
        await this.pool.end();
    }
} 
import mysql from 'mysql2/promise';
import { config } from '../../config';

export class DatabaseService {
    private static instance: DatabaseService;
    private pool: mysql.Pool;

    private constructor() {
        this.pool = mysql.createPool({
            host: config.db.host,
            port: config.db.port,
            database: config.db.name,
            user: config.db.user,
            password: config.db.password,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
    }

    public static getInstance(): DatabaseService {
        if (!DatabaseService.instance) {
            DatabaseService.instance = new DatabaseService();
        }
        return DatabaseService.instance;
    }

    public async query<T>(sql: string, params?: any[]): Promise<T[]> {
        try {
            const [rows] = await this.pool.execute(sql, params);
            return rows as T[];
        } catch (error) {
            console.error('Database query error:', error);
            throw error;
        }
    }

    public async transaction<T>(callback: (connection: mysql.Connection) => Promise<T>): Promise<T> {
        const connection = await this.pool.getConnection();
        await connection.beginTransaction();

        try {
            const result = await callback(connection);
            await connection.commit();
            return result;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
} 
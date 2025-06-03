import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import path from 'path';

// 加载根目录的环境变量
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'herecho',
    synchronize: process.env.NODE_ENV === 'development',
    logging: process.env.NODE_ENV === 'development',
    entities: [path.join(__dirname, '../models/**/*.{ts,js}')],
    migrations: [path.join(__dirname, '../migrations/**/*.{ts,js}')],
    subscribers: [path.join(__dirname, '../subscribers/**/*.{ts,js}')],
});

export const dbConfig = {
    host: 'database-1.c7symcc24b18.ap-southeast-2.rds.amazonaws.com',
    port: 3306,
    database: '2C',
    user: 'admin',
    password: 'qfxm20250602',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

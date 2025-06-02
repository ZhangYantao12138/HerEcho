import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import path from 'path';

// 加载环境变量
config({ path: path.resolve(__dirname, '../../../.env') });

// 创建数据库连接
const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306'),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    ssl: process.env.DB_SSL === 'true',
    extra: {
        ssl: process.env.DB_SSL === 'true' ? {
            rejectUnauthorized: false
        } : undefined
    }
});

// 测试数据库连接
async function testConnection() {
    try {
        console.log('正在连接数据库...');
        console.log('数据库配置:', {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            database: process.env.DB_DATABASE,
            username: process.env.DB_USERNAME,
            ssl: process.env.DB_SSL
        });

        await AppDataSource.initialize();
        console.log('数据库连接成功！');

        // 测试查询
        const result = await AppDataSource.query('SELECT 1 as test');
        console.log('测试查询结果:', result);

        // 关闭连接
        await AppDataSource.destroy();
        console.log('数据库连接已关闭');
    } catch (error) {
        console.error('数据库连接失败:', error);
        process.exit(1);
    }
}

// 运行测试
testConnection(); 
import { DatabaseService } from '../services/database/dbService';

async function testConnection() {
    const db = DatabaseService.getInstance();
    try {
        console.log('正在测试数据库连接...');
        const isConnected = await db.testConnection();

        if (isConnected) {
            console.log('数据库连接成功！');
            process.exit(0);
        } else {
            console.error('数据库连接失败！');
            process.exit(1);
        }
    } catch (error) {
        console.error('测试数据库连接时出错:', error);
        process.exit(1);
    } finally {
        await db.close();
    }
}

testConnection(); 
import fs from 'fs';
import path from 'path';
import { DatabaseService } from '../services/database/dbService';
import { ErrorService } from '../services/error/errorService';

async function createTables() {
    const errorService = ErrorService.getInstance();
    try {
        console.log('开始创建数据库表...');
        const db = DatabaseService.getInstance();
        const sql = fs.readFileSync(path.join(__dirname, 'createTables.sql'), 'utf8');

        // 分割SQL语句（按分号分割）
        const statements = sql.split(';').filter(stmt => stmt.trim());

        // 执行每个SQL语句
        for (const statement of statements) {
            if (statement.trim()) {
                try {
                    await db.query(statement);
                    console.log('执行SQL语句成功:', statement.trim().substring(0, 50) + '...');
                } catch (error: any) {
                    console.error('执行SQL语句失败:', statement.trim().substring(0, 50) + '...');
                    console.error('错误详情:', error);
                    await errorService.logError({
                        error_type: 'DATABASE_CREATE_TABLE_ERROR',
                        error_message: `执行SQL语句失败: ${error.message}`,
                        stack_trace: error.stack
                    });
                    throw error;
                }
            }
        }

        console.log('数据库表创建完成');
    } catch (error: any) {
        console.error('创建数据库表时出错:', error);
        await errorService.logError({
            error_type: 'DATABASE_CREATE_TABLES_ERROR',
            error_message: `创建数据库表时出错: ${error.message}`,
            stack_trace: error.stack
        });
        throw error;
    }
}

// 执行创建表操作
createTables()
    .then(() => {
        console.log('数据库表创建脚本执行完成');
        process.exit(0);
    })
    .catch((error) => {
        console.error('数据库表创建脚本执行失败:', error);
        process.exit(1);
    }); 
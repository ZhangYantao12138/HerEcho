import fs from 'fs';
import path from 'path';
import { DatabaseService } from '../services/database/dbService';

async function createTables() {
    try {
        const db = DatabaseService.getInstance();
        const sql = fs.readFileSync(path.join(__dirname, 'createTables.sql'), 'utf8');

        // 分割SQL语句（按分号分割）
        const statements = sql.split(';').filter(stmt => stmt.trim());

        // 执行每个SQL语句
        for (const statement of statements) {
            if (statement.trim()) {
                await db.query(statement);
                console.log('执行SQL语句成功:', statement.trim());
            }
        }

        console.log('数据库表创建完成');
    } catch (error) {
        console.error('创建数据库表时出错:', error);
        throw error;
    }
}

// 执行创建表操作
createTables().catch(console.error); 
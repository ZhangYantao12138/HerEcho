import express, { Request, Response } from 'express';
import cors from 'cors';
import { json } from 'body-parser';
import { DatabaseService } from './services/database/dbService';

const app = express();
const port = process.env.PORT || 3000;

// 中间件配置
app.use(cors());
app.use(json());

// 数据库连接
const initDatabase = async () => {
    try {
        await DatabaseService.getInstance();
        console.log('数据库连接成功');
    } catch (error) {
        console.error('数据库连接失败:', error);
    }
};

initDatabase();

// 基础路由
app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok' });
});

// 启动服务器
app.listen(port, () => {
    console.log(`服务器运行在 http://localhost:${port}`);
}); 
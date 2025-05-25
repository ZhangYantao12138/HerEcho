require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;
const API_KEY = process.env.API_KEY;

// 中间件
app.use(cors());
app.use(express.json());

// API密钥验证中间件
const authenticateApiKey = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: '未提供API密钥' });
    }

    const apiKey = authHeader.split(' ')[1];
    if (apiKey !== API_KEY) {
        return res.status(401).json({ error: 'API密钥无效' });
    }

    next();
};

let db;

// 连接MongoDB
async function connectDB() {
    try {
        const client = await MongoClient.connect(MONGODB_URI);
        db = client.db('herecho_logs');
        console.log('已连接到MongoDB');
    } catch (error) {
        console.error('MongoDB连接失败:', error);
        process.exit(1);
    }
}

// 保存日志
app.post('/logs', authenticateApiKey, async (req, res) => {
    try {
        const logEntry = {
            ...req.body,
            createdAt: new Date()
        };

        await db.collection('logs').insertOne(logEntry);
        res.status(201).json({ message: '日志已保存' });
    } catch (error) {
        console.error('保存日志失败:', error);
        res.status(500).json({ error: '保存日志失败' });
    }
});

// 获取日志（带分页）
app.get('/logs', authenticateApiKey, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const skip = (page - 1) * limit;

        const query = {};
        
        // 添加过滤条件
        if (req.query.characterId) {
            query.characterId = req.query.characterId;
        }
        if (req.query.type) {
            query.type = req.query.type;
        }
        if (req.query.startDate && req.query.endDate) {
            query.timestamp = {
                $gte: new Date(req.query.startDate),
                $lte: new Date(req.query.endDate)
            };
        }

        const [logs, total] = await Promise.all([
            db.collection('logs')
                .find(query)
                .sort({ timestamp: -1 })
                .skip(skip)
                .limit(limit)
                .toArray(),
            db.collection('logs').countDocuments(query)
        ]);

        res.json({
            logs,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        });
    } catch (error) {
        console.error('获取日志失败:', error);
        res.status(500).json({ error: '获取日志失败' });
    }
});

// 获取统计信息
app.get('/stats', authenticateApiKey, async (req, res) => {
    try {
        const [characterStats, viewpointStats] = await Promise.all([
            db.collection('logs').aggregate([
                { $match: { type: 'character_interaction' } },
                { $group: {
                    _id: '$characterId',
                    characterName: { $first: '$characterName' },
                    count: { $sum: 1 }
                }}
            ]).toArray(),
            db.collection('logs').aggregate([
                { $match: { type: 'viewpoint_change' } },
                { $group: {
                    _id: '$viewpointKey',
                    count: { $sum: 1 }
                }}
            ]).toArray()
        ]);

        res.json({
            characterStats,
            viewpointStats
        });
    } catch (error) {
        console.error('获取统计信息失败:', error);
        res.status(500).json({ error: '获取统计信息失败' });
    }
});

// 健康检查端点
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// 启动服务器
connectDB().then(() => {
    app.listen(port, () => {
        console.log(`日志服务器运行在端口 ${port}`);
    });
}); 
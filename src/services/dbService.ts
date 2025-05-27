// 检测运行环境
const isBrowser = typeof window !== 'undefined';

// 在浏览器环境中跳过mongoose导入，在服务端环境中正常导入
let mongoose: any = null;
if (!isBrowser) {
    try {
        mongoose = require('mongoose');
    } catch (error) {
        console.log('Mongoose not available, using mock database');
    }
}

// MongoDB连接配置（仅在服务端使用）
const MONGODB_URI = !isBrowser && typeof process !== 'undefined'
    ? (process.env.MONGODB_URI || process.env.ZEABUR_MONGODB_URI || 'mongodb://localhost:27017/herecho')
    : '';

// 定义模型（仅在服务端环境中使用）
let ChatLog: any = null;
let UserStats: any = null;

if (!isBrowser && mongoose) {
    // 定义日志模型
    const chatLogSchema = new mongoose.Schema({
        userId: String,
        sessionId: String,
        timestamp: { type: Date, default: Date.now },
        role: String,
        messageType: { type: String, enum: ['user', 'assistant'] },
        inputMethod: { type: String, enum: ['auto', 'manual'] },
        message: String,
        round: Number,
        metadata: {
            responseTime: Number,
            tokensUsed: Number
        }
    });

    const userStatsSchema = new mongoose.Schema({
        userId: String,
        totalSessions: { type: Number, default: 0 },
        totalMessages: { type: Number, default: 0 },
        averageSessionLength: { type: Number, default: 0 },
        preferredRoles: { type: Map, of: Number },
        autoReplyUsage: { type: Number, default: 0 },
        manualInputUsage: { type: Number, default: 0 },
        lastActive: { type: Date, default: Date.now }
    });

    // 创建模型
    ChatLog = mongoose.model('ChatLog', chatLogSchema);
    UserStats = mongoose.model('UserStats', userStatsSchema);
}

// 浏览器环境的模拟存储
class MockStorage {
    private chatLogs: any[] = [];
    private userStats: Map<string, any> = new Map();

    async saveChatLog(data: any) {
        const log = {
            ...data,
            timestamp: new Date(),
            _id: Date.now().toString()
        };
        this.chatLogs.push(log);
        console.log('Mock: Saved chat log', log);
        return log;
    }

    async saveUserStats(userId: string, stats: any) {
        this.userStats.set(userId, { ...stats, lastActive: new Date() });
        console.log('Mock: Saved user stats for', userId, stats);
    }

    async getUserStats(userId: string) {
        return this.userStats.get(userId) || {
            userId,
            totalSessions: 0,
            totalMessages: 0,
            averageSessionLength: 0,
            preferredRoles: new Map(),
            autoReplyUsage: 0,
            manualInputUsage: 0,
            lastActive: new Date()
        };
    }

    async getChatLogs(filters: any = {}) {
        return this.chatLogs.filter(log => {
            return Object.keys(filters).every(key => log[key] === filters[key]);
        });
    }
}

const mockStorage = new MockStorage();

class DatabaseService {
    private static instance: DatabaseService;
    private isConnected: boolean = false;

    private constructor() {
        // 在浏览器环境中直接标记为已连接，在服务端环境中连接数据库
        if (isBrowser) {
            this.isConnected = true;
            console.log('Using mock database in browser environment');
        } else {
            this.connect().catch(console.error);
        }
    }

    public static async getInstance(): Promise<DatabaseService> {
        if (!DatabaseService.instance) {
            DatabaseService.instance = new DatabaseService();
            // 仅在服务端环境中确保数据库连接
            if (!isBrowser) {
                await DatabaseService.instance.connect();
            }
        }
        return DatabaseService.instance;
    }

    async connect() {
        if (isBrowser) {
            // 浏览器环境中不需要真实连接
            this.isConnected = true;
            return;
        }

        if (!this.isConnected && mongoose) {
            try {
                await mongoose.connect(MONGODB_URI);
                this.isConnected = true;
                console.log('Successfully connected to MongoDB.');
            } catch (error) {
                console.error('MongoDB connection error:', error);
                throw error;
            }
        }
    }

    async logChat(data: {
        userId: string;
        sessionId: string;
        role: string;
        messageType: 'user' | 'assistant';
        inputMethod: 'auto' | 'manual';
        message: string;
        round: number;
        metadata: {
            responseTime: number;
            tokensUsed: number;
        };
    }) {
        try {
            if (isBrowser) {
                // 浏览器环境使用模拟存储
                await mockStorage.saveChatLog(data);
                await this.updateUserStats(data.userId, data);
                return;
            }

            // 确保在执行操作前已连接
            if (!this.isConnected) {
                await this.connect();
            }

            if (ChatLog) {
                const chatLog = new ChatLog(data);
                await chatLog.save();
            }

            // 更新用户统计
            await this.updateUserStats(data.userId, data);
        } catch (error) {
            console.error('Error logging chat:', error);
            // 在浏览器环境中不抛出错误，只记录日志
            if (!isBrowser) {
                throw error;
            }
        }
    }

    private async updateUserStats(userId: string, chatData: any) {
        try {
            if (isBrowser) {
                // 浏览器环境使用模拟存储
                const stats = await mockStorage.getUserStats(userId);

                stats.totalMessages += 1;
                stats.lastActive = new Date();

                if (chatData.inputMethod === 'auto') {
                    stats.autoReplyUsage += 1;
                } else {
                    stats.manualInputUsage += 1;
                }

                // 更新角色偏好
                if (!stats.preferredRoles) {
                    stats.preferredRoles = new Map();
                }
                const currentCount = stats.preferredRoles.get(chatData.role) || 0;
                stats.preferredRoles.set(chatData.role, currentCount + 1);

                await mockStorage.saveUserStats(userId, stats);
                return;
            }

            // 确保在执行操作前已连接
            if (!this.isConnected) {
                await this.connect();
            }

            if (UserStats) {
                const stats = await UserStats.findOne({ userId }) || new UserStats({ userId });

                stats.totalMessages += 1;
                stats.lastActive = new Date();

                if (chatData.inputMethod === 'auto') {
                    stats.autoReplyUsage += 1;
                } else {
                    stats.manualInputUsage += 1;
                }

                // 更新角色偏好
                if (!stats.preferredRoles) {
                    stats.preferredRoles = new Map();
                }
                const currentCount = stats.preferredRoles.get(chatData.role) || 0;
                stats.preferredRoles.set(chatData.role, currentCount + 1);

                await stats.save();
            }
        } catch (error) {
            console.error('Error updating user stats:', error);
            // 在浏览器环境中不抛出错误，只记录日志
            if (!isBrowser) {
                throw error;
            }
        }
    }

    async getUserStats(userId: string) {
        try {
            if (isBrowser) {
                // 浏览器环境使用模拟存储
                return await mockStorage.getUserStats(userId);
            }

            if (UserStats) {
                return await UserStats.findOne({ userId });
            }
            return null;
        } catch (error) {
            console.error('Error getting user stats:', error);
            // 在浏览器环境中不抛出错误，只记录日志
            if (!isBrowser) {
                throw error;
            }
            return null;
        }
    }

    async exportChatLogs(filters: any = {}) {
        try {
            if (isBrowser) {
                // 浏览器环境使用模拟存储
                return await mockStorage.getChatLogs(filters);
            }

            if (ChatLog) {
                return await ChatLog.find(filters).sort({ timestamp: 1 });
            }
            return [];
        } catch (error) {
            console.error('Error exporting chat logs:', error);
            // 在浏览器环境中不抛出错误，只记录日志
            if (!isBrowser) {
                throw error;
            }
            return [];
        }
    }
}

export default DatabaseService; 
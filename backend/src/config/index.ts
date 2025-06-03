import dotenv from 'dotenv';
import path from 'path';

// 加载根目录的环境变量
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

// 一些常量配置
export const CONFIG = {
  DEFAULT_CHARACTER_ID: 'B001C001', // 默认角色ID
  AUDIO_ENABLED: true, // 是否启用音频
  DEFAULT_TEMPERATURE: 0.7, // 默认AI模型温度
  MAX_HISTORY_MESSAGES: 20, // 对话历史最大保存消息数
};

interface DatabaseConfig {
  host: string;
  port: number;
  name: string;
  user: string;
  password: string;
}

interface Config {
  db: DatabaseConfig;
}

export const config: Config = {
  db: {
    host: 'database-1.c7symcc24b18.ap-southeast-2.rds.amazonaws.com',
    port: 3306,
    name: '2C',
    user: 'admin',
    password: 'qfxm20250602'
  }
}; 
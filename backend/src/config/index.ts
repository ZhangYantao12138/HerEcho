// 导出角色配置
export * from './characters';

// 导出prompt配置
export * from './characterPrompts';
export * from './playerPrompts';
export * from './promptConfig';

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
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    name: process.env.DB_NAME || 'herecho',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || ''
  }
}; 
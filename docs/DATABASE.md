# HerEcho 数据库设计文档

## 1. 数据库概述

HerEcho 使用 MySQL 数据库，部署在 AWS RDS 上。数据库主要用于存储：
- 角色和剧本配置
- 用户信息和认证
- 对话历史记录
- 使用统计和日志
- 系统配置

## 2. 表结构设计

### 2.1 角色相关表

#### characters（角色表）
```sql
CREATE TABLE characters (
    id VARCHAR(10) PRIMARY KEY COMMENT '角色ID，格式：B[剧本编号]C[角色编号]',
    name VARCHAR(50) NOT NULL COMMENT '角色名称',
    background_description TEXT COMMENT '角色背景描述',
    relationships TEXT COMMENT '角色关系描述',
    system_prompt TEXT NOT NULL COMMENT '角色系统提示词',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_story_id (id(3)) COMMENT '剧本ID索引'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### character_fallback_replies（角色回退回复表）
```sql
CREATE TABLE character_fallback_replies (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    character_id VARCHAR(10) NOT NULL,
    content TEXT NOT NULL COMMENT '回退回复内容',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 2.2 剧本相关表

#### stories（剧本表）
```sql
CREATE TABLE stories (
    id VARCHAR(5) PRIMARY KEY COMMENT '剧本ID，格式：B[剧本编号]',
    title VARCHAR(100) NOT NULL COMMENT '剧本标题',
    description TEXT COMMENT '剧本描述',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 2.3 用户相关表

#### users（用户表）
```sql
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    nickname VARCHAR(50) COMMENT '用户昵称',
    role ENUM('user', 'admin') DEFAULT 'user',
    status ENUM('active', 'inactive', 'banned') DEFAULT 'active',
    last_login_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### user_sessions（用户会话表）
```sql
CREATE TABLE user_sessions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    session_id VARCHAR(100) NOT NULL UNIQUE,
    character_id VARCHAR(10) NOT NULL,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (character_id) REFERENCES characters(id),
    INDEX idx_user_session (user_id, session_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### user_subscriptions（用户订阅表）
```sql
CREATE TABLE user_subscriptions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    plan_type ENUM('free', 'basic', 'premium') DEFAULT 'free',
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    status ENUM('active', 'expired', 'cancelled') DEFAULT 'active',
    payment_method VARCHAR(50) COMMENT '支付方式',
    last_payment_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_status (user_id, status),
    INDEX idx_end_date (end_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### user_preferences（用户偏好设置表）
```sql
CREATE TABLE user_preferences (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    theme ENUM('light', 'dark', 'system') DEFAULT 'system',
    language VARCHAR(10) DEFAULT 'zh-CN',
    notification_enabled BOOLEAN DEFAULT TRUE,
    auto_save_chat BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### user_achievements（用户成就表）
```sql
CREATE TABLE user_achievements (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    achievement_type VARCHAR(50) NOT NULL,
    achievement_name VARCHAR(100) NOT NULL,
    description TEXT,
    progress INT DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_achievement (user_id, achievement_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### user_activity_logs（用户活动日志表）
```sql
CREATE TABLE user_activity_logs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    activity_type VARCHAR(50) NOT NULL,
    activity_details JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_activity (user_id, activity_type),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### user_favorites（用户收藏表）
```sql
CREATE TABLE user_favorites (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    character_id VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (character_id) REFERENCES characters(id),
    UNIQUE KEY idx_user_character (user_id, character_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 2.4 对话相关表

#### chat_messages（对话消息表）
```sql
CREATE TABLE chat_messages (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    session_id BIGINT UNSIGNED NOT NULL,
    role ENUM('user', 'assistant') NOT NULL,
    content TEXT NOT NULL,
    tokens_used INT DEFAULT 0,
    response_time INT DEFAULT 0 COMMENT '响应时间(ms)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES user_sessions(id) ON DELETE CASCADE,
    INDEX idx_session_time (session_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### auto_replies（自动回复表）
```sql
CREATE TABLE auto_replies (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    message_id BIGINT UNSIGNED NOT NULL,
    content TEXT NOT NULL,
    selected BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (message_id) REFERENCES chat_messages(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 2.5 统计相关表

#### usage_stats（使用统计表）
```sql
CREATE TABLE usage_stats (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    character_id VARCHAR(10) NOT NULL,
    date DATE NOT NULL,
    message_count INT DEFAULT 0,
    total_tokens INT DEFAULT 0,
    avg_response_time INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (character_id) REFERENCES characters(id),
    UNIQUE KEY idx_user_character_date (user_id, character_id, date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### error_logs（错误日志表）
```sql
CREATE TABLE error_logs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NULL,
    session_id BIGINT UNSIGNED NULL,
    error_type VARCHAR(50) NOT NULL,
    error_message TEXT NOT NULL,
    stack_trace TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (session_id) REFERENCES user_sessions(id) ON DELETE SET NULL,
    INDEX idx_error_type (error_type),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 2.6 用户自建角色相关表

#### user_created_characters（用户自建角色表）
```sql
CREATE TABLE user_created_characters (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(50) NOT NULL COMMENT '角色名称',
    background_description TEXT COMMENT '角色背景描述',
    relationships TEXT COMMENT '角色关系描述',
    current_state VARCHAR(100) COMMENT '当前状态',
    system_prompt TEXT NOT NULL COMMENT '角色系统提示词',
    is_public BOOLEAN DEFAULT FALSE COMMENT '是否公开',
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft' COMMENT '状态',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_status (user_id, status),
    INDEX idx_public_status (is_public, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### user_character_scenes（用户角色场景表）
```sql
CREATE TABLE user_character_scenes (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    character_id BIGINT UNSIGNED NOT NULL,
    title VARCHAR(100) NOT NULL COMMENT '场景标题',
    stage VARCHAR(50) NOT NULL COMMENT '当前阶段',
    progress INT DEFAULT 0 COMMENT '进度百分比',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (character_id) REFERENCES user_created_characters(id) ON DELETE CASCADE,
    INDEX idx_character_stage (character_id, stage)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### user_character_fallback_replies（用户角色回退回复表）
```sql
CREATE TABLE user_character_fallback_replies (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    character_id BIGINT UNSIGNED NOT NULL,
    content TEXT NOT NULL COMMENT '回退回复内容',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (character_id) REFERENCES user_created_characters(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 2.8 用户角色交互记录表

#### user_character_progress（用户角色进度表）
```sql
CREATE TABLE user_character_progress (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    character_id VARCHAR(10) NOT NULL,
    current_stage VARCHAR(50) NOT NULL COMMENT '当前阶段',
    progress INT DEFAULT 0 COMMENT '进度百分比',
    last_interaction_at TIMESTAMP NULL COMMENT '最后交互时间',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE,
    UNIQUE KEY idx_user_character (user_id, character_id),
    INDEX idx_last_interaction (last_interaction_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### user_character_chat_sessions（用户角色对话会话表）
```sql
CREATE TABLE user_character_chat_sessions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    character_id VARCHAR(10) NOT NULL,
    session_id VARCHAR(100) NOT NULL COMMENT '会话ID',
    start_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP NULL,
    total_messages INT DEFAULT 0 COMMENT '总消息数',
    total_tokens INT DEFAULT 0 COMMENT '总token数',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE,
    UNIQUE KEY idx_session_id (session_id),
    INDEX idx_user_character_time (user_id, character_id, start_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### user_character_chat_messages（用户角色对话消息表）
```sql
CREATE TABLE user_character_chat_messages (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    session_id BIGINT UNSIGNED NOT NULL,
    role ENUM('user', 'assistant') NOT NULL,
    content TEXT NOT NULL,
    tokens_used INT DEFAULT 0,
    response_time INT DEFAULT 0 COMMENT '响应时间(ms)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES user_character_chat_sessions(id) ON DELETE CASCADE,
    INDEX idx_session_time (session_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## 3. 数据库连接配置

### 3.1 环境变量配置

在 `.env` 文件中配置数据库连接信息：

```env
# 开发环境
DB_HOST=localhost
DB_PORT=3306
DB_NAME=herecho_dev
DB_USER=dev_user
DB_PASSWORD=dev_password

# 生产环境 (AWS RDS)
DB_HOST=your-rds-endpoint.region.rds.amazonaws.com
DB_PORT=3306
DB_NAME=herecho_prod
DB_USER=prod_user
DB_PASSWORD=prod_password
```

### 3.2 数据库连接服务

创建 `src/services/database/dbService.ts`：

```typescript
import mysql from 'mysql2/promise';
import { config } from '../config';

export class DatabaseService {
  private static instance: DatabaseService;
  private pool: mysql.Pool;

  private constructor() {
    this.pool = mysql.createPool({
      host: config.db.host,
      port: config.db.port,
      database: config.db.name,
      user: config.db.user,
      password: config.db.password,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  public async query<T>(sql: string, params?: any[]): Promise<T> {
    try {
      const [rows] = await this.pool.execute(sql, params);
      return rows as T;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }

  public async transaction<T>(callback: (connection: mysql.Connection) => Promise<T>): Promise<T> {
    const connection = await this.pool.getConnection();
    await connection.beginTransaction();

    try {
      const result = await callback(connection);
      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}
```

## 4. 数据迁移方案

### 4.1 从配置文件迁移到数据库

1. 创建迁移脚本 `scripts/migrate-config-to-db.ts`：

```typescript
import { DatabaseService } from '../src/services/database/dbService';
import { characters } from '../src/config/characters';
import { stories } from '../src/config/stories';

async function migrateConfigToDb() {
  const db = DatabaseService.getInstance();

  // 迁移剧本数据
  for (const story of stories) {
    await db.query(
      'INSERT INTO stories (id, title, description) VALUES (?, ?, ?)',
      [story.id, story.title, story.description]
    );
  }

  // 迁移角色数据
  for (const character of characters) {
    await db.query(
      'INSERT INTO characters (id, name, background_description, relationships, current_state, system_prompt) VALUES (?, ?, ?, ?, ?, ?)',
      [character.id, character.name, character.backgroundDescription, character.relationships, character.currentState, character.systemPrompt]
    );

    // 迁移场景信息
    await db.query(
      'INSERT INTO character_scenes (character_id, title, stage, progress) VALUES (?, ?, ?, ?)',
      [character.id, character.sceneInfo.title, character.sceneInfo.stage, character.sceneInfo.progress]
    );

    // 迁移回退回复
    for (const reply of character.fallbackReplies) {
      await db.query(
        'INSERT INTO character_fallback_replies (character_id, content) VALUES (?, ?)',
        [character.id, reply]
      );
    }
  }
}

migrateConfigToDb().catch(console.error);
```

### 4.2 数据备份和恢复

1. 备份脚本 `scripts/backup-db.sh`：

```bash
#!/bin/bash
BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/herecho_$DATE.sql"

# 创建备份目录
mkdir -p $BACKUP_DIR

# 备份数据库
mysqldump -h $DB_HOST -u $DB_USER -p$DB_PASSWORD $DB_NAME > $BACKUP_FILE

# 压缩备份文件
gzip $BACKUP_FILE

# 删除30天前的备份
find $BACKUP_DIR -name "herecho_*.sql.gz" -mtime +30 -delete
```

2. 恢复脚本 `scripts/restore-db.sh`：

```bash
#!/bin/bash
BACKUP_FILE=$1

if [ -z "$BACKUP_FILE" ]; then
  echo "Usage: $0 <backup_file>"
  exit 1
fi

# 解压备份文件
gunzip -c $BACKUP_FILE > temp.sql

# 恢复数据库
mysql -h $DB_HOST -u $DB_USER -p$DB_PASSWORD $DB_NAME < temp.sql

# 清理临时文件
rm temp.sql
```

## 5. 数据库维护

### 5.1 定期维护任务

1. 数据清理：
```sql
-- 清理30天前的错误日志
DELETE FROM error_logs WHERE created_at < DATE_SUB(NOW(), INTERVAL 30 DAY);

-- 清理已结束的会话
UPDATE user_sessions SET ended_at = NOW() WHERE ended_at IS NULL AND created_at < DATE_SUB(NOW(), INTERVAL 24 HOUR);
```

2. 数据统计：
```sql
-- 生成每日使用统计
INSERT INTO usage_stats (user_id, character_id, date, message_count, total_tokens, avg_response_time)
SELECT 
    user_id,
    character_id,
    DATE(created_at),
    COUNT(*),
    SUM(tokens_used),
    AVG(response_time)
FROM chat_messages
WHERE DATE(created_at) = CURDATE()
GROUP BY user_id, character_id, DATE(created_at);
```

3. 用户数据维护：
```sql
-- 清理过期的订阅记录
UPDATE user_subscriptions 
SET status = 'expired' 
WHERE end_date < NOW() AND status = 'active';

-- 更新用户状态
UPDATE users u
LEFT JOIN user_subscriptions s ON u.id = s.user_id
SET u.status = 'inactive'
WHERE s.id IS NULL OR s.status = 'expired';

-- 清理过期的活动日志
DELETE FROM user_activity_logs 
WHERE created_at < DATE_SUB(NOW(), INTERVAL 90 DAY);
```

4. 用户自建角色维护：
```sql
-- 清理已归档的角色数据
UPDATE user_created_characters 
SET status = 'archived' 
WHERE updated_at < DATE_SUB(NOW(), INTERVAL 1 YEAR) 
AND status = 'draft';
```

5. 用户角色交互记录维护：
```sql
-- 更新会话结束时间
UPDATE user_character_chat_sessions 
SET end_time = NOW() 
WHERE end_time IS NULL 
AND start_time < DATE_SUB(NOW(), INTERVAL 24 HOUR);

-- 更新用户角色进度
UPDATE user_character_progress p
SET 
    last_interaction_at = (
        SELECT MAX(created_at)
        FROM user_character_chat_messages m
        JOIN user_character_chat_sessions s ON m.session_id = s.id
        WHERE s.user_id = p.user_id AND s.character_id = p.character_id
    )
WHERE last_interaction_at IS NULL OR last_interaction_at < (
    SELECT MAX(created_at)
    FROM user_character_chat_messages m
    JOIN user_character_chat_sessions s ON m.session_id = s.id
    WHERE s.user_id = p.user_id AND s.character_id = p.character_id
);

-- 清理过期的对话记录（保留最近3个月）
DELETE FROM user_character_chat_messages 
WHERE created_at < DATE_SUB(NOW(), INTERVAL 3 MONTH);
```

### 5.2 性能优化

1. 索引优化：
```sql
-- 为常用查询添加索引
ALTER TABLE chat_messages ADD INDEX idx_user_time (user_id, created_at);
ALTER TABLE usage_stats ADD INDEX idx_date (date);
```

2. 表分区：
```sql
-- 对大型表进行分区
ALTER TABLE chat_messages
PARTITION BY RANGE (TO_DAYS(created_at)) (
    PARTITION p_2024_01 VALUES LESS THAN (TO_DAYS('2024-02-01')),
    PARTITION p_2024_02 VALUES LESS THAN (TO_DAYS('2024-03-01')),
    PARTITION p_future VALUES LESS THAN MAXVALUE
);
```

## 6. 部署注意事项

### 6.1 AWS RDS 配置

1. 安全组配置：
   - 只允许应用服务器访问数据库端口
   - 使用 SSL 连接
   - 启用自动备份

2. 性能配置：
   - 根据负载选择合适的实例类型
   - 配置适当的存储空间
   - 启用性能监控

### 6.2 Zeabur 部署配置

1. 环境变量配置：
   - 在 Zeabur 控制台配置数据库连接信息
   - 设置适当的连接池大小
   - 配置重试策略

2. 连接管理：
   - 使用连接池
   - 实现重试机制
   - 监控连接状态 
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
    book_id VARCHAR(10) NOT NULL COMMENT '剧本ID，格式：book[剧本编号]',
    name VARCHAR(50) NOT NULL COMMENT '角色名称',
    background_description TEXT COMMENT '角色背景描述',
    relationships TEXT COMMENT '角色关系描述',
    system_prompt TEXT NOT NULL COMMENT '角色系统提示词',
    voice_id VARCHAR(50) COMMENT '角色TTS音色ID',
    voice_speed FLOAT DEFAULT 1.0 COMMENT '语音播放速度',
    voice_pitch FLOAT DEFAULT 1.0 COMMENT '语音音调',
    voice_volume FLOAT DEFAULT 1.0 COMMENT '语音音量',
    fallback_reply TEXT NOT NULL DEFAULT '连接断开了，请检查网络或向我们反馈问题' COMMENT '回退回复，用于API连接失败时的默认回复',
    character_image VARCHAR(255) COMMENT '角色头像图片路径',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_story_id (id(3)) COMMENT '剧本ID索引',
    INDEX idx_book_id (book_id) COMMENT '剧本ID索引'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 2.2 剧本相关表

#### stories（剧本表）
```sql
CREATE TABLE stories (
    id VARCHAR(5) PRIMARY KEY COMMENT '剧本ID，格式：B[剧本编号]',
    book_id VARCHAR(10) NOT NULL UNIQUE COMMENT '剧本ID，格式：book[剧本编号]',
    title VARCHAR(100) NOT NULL COMMENT '剧本标题',
    cover_image TEXT COMMENT'封面图名字',
    description TEXT COMMENT '剧本描述',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 2.3 用户相关表

#### users（用户表）
```sql
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '用户ID',
    username VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
    email VARCHAR(100) NOT NULL UNIQUE COMMENT '电子邮箱',
    password_hash VARCHAR(255) NOT NULL COMMENT '密码哈希值',
    nickname VARCHAR(50) COMMENT '用户昵称',
    role ENUM('user', 'admin') DEFAULT 'user' COMMENT '用户角色：普通用户/管理员',
    status ENUM('active', 'inactive', 'banned') DEFAULT 'active' COMMENT '用户状态：活跃/非活跃/封禁',
    last_login_at TIMESTAMP NULL COMMENT '最后登录时间',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_email (email) COMMENT '邮箱索引',
    INDEX idx_status (status) COMMENT '状态索引'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### user_subscriptions（用户订阅表）
```sql
CREATE TABLE user_subscriptions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '订阅ID',
    user_id BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
    plan ENUM('free', 'basic', 'premium') DEFAULT 'free' COMMENT '订阅计划类型：免费/基础/高级',
    status ENUM('active', 'expired', 'cancelled') DEFAULT 'active' COMMENT '订阅状态：活跃/过期/已取消',
    duration_days INT NOT NULL DEFAULT 30 COMMENT '订阅时长（天）',
    amount DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT '订阅金额',
    last_payment_at TIMESTAMP NULL COMMENT '最后支付时间',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_status (user_id, status) COMMENT '用户状态索引'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 2.4 对话相关表

#### chat_messages（对话消息表）
```sql
CREATE TABLE chat_messages (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '消息ID',
    session_id VARCHAR(50) NOT NULL COMMENT '会话ID',
    user_id BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
    character_id VARCHAR(10) NOT NULL COMMENT '角色ID',
    message_index INT NOT NULL COMMENT '消息序号',
    content TEXT NOT NULL COMMENT '消息内容',
    source ENUM('userInput', 'autoReplyOption', 'character') NOT NULL COMMENT '消息来源：用户输入/自动回复选项/角色',
    tokens_used INT DEFAULT 0 COMMENT '使用的token数量',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (character_id) REFERENCES characters(id),
    INDEX idx_session_time (session_id, created_at) COMMENT '会话时间索引'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 2.5 统计相关表

#### user_chat_stats（用户对话统计表）
```sql
CREATE TABLE user_chat_stats (
    stat_id VARCHAR(50) PRIMARY KEY COMMENT '统计ID',
    user_id BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
    session_id VARCHAR(50) NOT NULL COMMENT '会话ID',
    message_type TINYINT NOT NULL COMMENT '消息类型：0-用户输入/1-自动回复选项/2-角色回复/3-自动回复/10-其他',
    tokens_used INT DEFAULT 0 COMMENT '使用的token数量',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_time (user_id, created_at) COMMENT '用户时间索引',
    INDEX idx_session_time (session_id, created_at) COMMENT '会话时间索引'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 2.6 错误日志表

#### error_logs（错误日志表）
```sql
CREATE TABLE error_logs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '日志ID',
    user_id BIGINT UNSIGNED COMMENT '用户ID',
    session_id VARCHAR(50) COMMENT '会话ID',
    error_type VARCHAR(50) NOT NULL COMMENT '错误类型',
    error_message TEXT NOT NULL COMMENT '错误信息',
    stack_trace TEXT COMMENT '堆栈跟踪',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_time (user_id, created_at) COMMENT '用户时间索引',
    INDEX idx_session_time (session_id, created_at) COMMENT '会话时间索引'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## 3. 数据库维护

### 3.1 定期维护任务

1. 数据清理：
```sql
-- 清理90天前的统计记录
DELETE FROM user_chat_stats 
WHERE created_at < DATE_SUB(NOW(), INTERVAL 90 DAY);

-- 清理30天前的消息记录
DELETE FROM chat_messages 
WHERE created_at < DATE_SUB(NOW(), INTERVAL 30 DAY);

-- 清理90天前的错误日志
DELETE FROM error_logs
WHERE created_at < DATE_SUB(NOW(), INTERVAL 90 DAY);

-- 更新过期的订阅状态
UPDATE user_subscriptions 
SET status = 'expired' 
WHERE status = 'active' 
AND DATE_ADD(created_at, INTERVAL duration_days DAY) <= NOW();
```

2. 数据统计：
```sql
-- 生成每日使用统计
SELECT 
    user_id,
    DATE(created_at) as date,
    COUNT(*) as message_count,
    SUM(tokens_used) as total_tokens
FROM chat_messages
WHERE DATE(created_at) = CURDATE()
GROUP BY user_id, DATE(created_at);

-- 生成错误统计
SELECT 
    error_type,
    COUNT(*) as error_count,
    DATE(created_at) as date
FROM error_logs
WHERE DATE(created_at) = CURDATE()
GROUP BY error_type, DATE(created_at);
```

### 3.2 性能优化

1. 索引优化：
   - 为频繁查询的字段添加索引
   - 定期检查索引使用情况
   - 删除未使用的索引

2. 查询优化：
   - 使用适当的查询条件
   - 避免全表扫描
   - 使用分页查询
   - 优化 JOIN 操作

### 3.3 监控指标

1. 性能指标：
   - 查询响应时间
   - 连接池使用情况
   - 缓存命中率
   - 磁盘 I/O 使用率

2. 业务指标：
   - 活跃用户数
   - 消息处理量
   - Token 使用量
   - 订阅状态分布
   - 错误率统计

## 4. 数据库连接配置

### 4.1 环境变量配置

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

### 4.2 数据库连接服务

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

## 5. 数据迁移方案

### 5.1 从配置文件迁移到数据库

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

### 5.2 数据备份和恢复

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

## 6. 数据库建表脚本

### 6.1 建表脚本设计

项目使用 TypeScript 实现的建表脚本，主要包含以下文件：

1. `backend/src/scripts/createTables.ts`：主脚本文件，负责执行建表操作
2. `backend/src/scripts/createTables.sql`：SQL 建表语句文件
3. `backend/src/services/database/dbService.ts`：数据库服务类
4. `backend/src/services/error/errorService.ts`：错误日志服务类

### 6.2 建表脚本实现

#### createTables.ts
```typescript
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
```

### 6.3 使用说明

1. 环境准备：
   - 确保已安装 Node.js 和 npm
   - 确保已配置好 `.env` 文件中的数据库连接信息
   - 确保已安装项目依赖（在 backend 目录下运行 `npm install`）

2. 执行建表：
   ```bash
   # 进入 backend 目录
   cd backend

   # 执行建表脚本
   npx ts-node src/scripts/createTables.ts
   ```

3. 注意事项：
   - 建表脚本会自动处理 SQL 语句的分割和执行
   - 每个建表语句都会单独执行，如果某个语句失败，会记录错误并停止执行
   - 所有错误都会被记录到 `error_logs` 表中
   - 建表脚本支持重复执行，使用了 `CREATE TABLE IF NOT EXISTS` 语法

4. 错误处理：
   - 脚本执行过程中的错误会被记录到控制台和 `error_logs` 表
   - 每个错误都包含错误类型、错误信息和堆栈跟踪
   - 如果发生错误，脚本会以非零状态码退出

### 6.4 维护建议

1. 版本控制：
   - 将建表脚本和 SQL 文件纳入版本控制
   - 每次修改表结构时，更新相应的 SQL 文件
   - 记录表结构的变更历史

2. 测试：
   - 在开发环境中测试建表脚本
   - 验证所有表的外键约束
   - 检查索引的创建情况

3. 备份：
   - 执行建表脚本前备份现有数据
   - 保留一份完整的数据库结构备份
   - 定期验证备份的可用性
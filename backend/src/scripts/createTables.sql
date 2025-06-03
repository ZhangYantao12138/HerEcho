-- 创建角色表
CREATE TABLE IF NOT EXISTS characters (
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
    fallback_reply TEXT NOT NULL COMMENT '回退回复，用于API连接失败时的默认回复',
    character_image VARCHAR(255) COMMENT '角色头像图片路径',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_story_id (id(3)) COMMENT '剧本ID索引',
    INDEX idx_book_id (book_id) COMMENT '剧本ID索引'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建剧本表
CREATE TABLE IF NOT EXISTS stories (
    id VARCHAR(5) PRIMARY KEY COMMENT '剧本ID，格式：B[剧本编号]',
    book_id VARCHAR(10) NOT NULL UNIQUE COMMENT '剧本ID，格式：book[剧本编号]',
    title VARCHAR(100) NOT NULL COMMENT '剧本标题',
    cover_image TEXT COMMENT'封面图名字',
    description TEXT COMMENT '剧本描述',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
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

-- 创建用户订阅表
CREATE TABLE IF NOT EXISTS user_subscriptions (
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

-- 创建对话消息表
CREATE TABLE IF NOT EXISTS chat_messages (
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

-- 创建用户对话统计表
CREATE TABLE IF NOT EXISTS user_chat_stats (
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

-- 创建错误日志表
CREATE TABLE IF NOT EXISTS error_logs (
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
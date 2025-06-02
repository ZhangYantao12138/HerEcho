# HerEcho 系统架构文档

## 1. 系统概述

HerEcho 是一个基于 AI 的角色扮演对话系统，支持多角色、多场景的对话交互。系统采用前后端分离架构，前端使用 Vue 3 + TypeScript，后端使用 Node.js + TypeScript。项目使用部署在AWS RDS的云数据库MySQL作为存储服务，使用Zeabur做线上部署。

### 1.1 项目结构

```
HerEcho/
├── frontend/                # 前端项目目录
│   ├── src/
│   │   ├── assets/         # 静态资源文件
│   │   ├── components/     # Vue组件
│   │   │   ├── chat/      # 聊天相关组件
│   │   │   ├── common/    # 通用组件
│   │   │   └── layout/    # 布局组件
│   │   ├── views/         # 页面视图
│   │   ├── router/        # 路由配置
│   │   ├── store/         # Pinia状态管理
│   │   ├── types/         # TypeScript类型定义
│   │   └── utils/         # 工具函数
│   └── public/            # 公共资源
│
├── backend/                # 后端项目目录
│   ├── src/
│   │   ├── controllers/   # 控制器
│   │   ├── services/      # 业务逻辑服务
│   │   ├── models/        # 数据模型
│   │   ├── routes/        # 路由定义
│   │   ├── middleware/    # 中间件
│   │   ├── utils/         # 工具函数
│   │   └── config/        # 配置文件
│   └── tests/             # 测试文件
│
├── docs/                   # 项目文档
│   ├── ARCHITECTURE.md    # 架构文档
│   ├── DATABASE.md        # 数据库文档
│   ├── SERVICE.md         # 服务层文档
│   └── API.md             # API文档
│
├── README.md              # 项目说明文档
├── .env                   # 统一环境配置文件，包含前后端所有环境变量
├── package.json           # 统一包管理配置，包含前后端所有依赖
├── .gitignore             # Git版本控制忽略文件配置
└── Dockerfile             # Docker容器配置文件
```

### 1.2 核心文件功能说明

#### 环境配置和依赖管理
- `.env`: 统一的环境配置文件，包含：
  - 数据库连接配置
  - API密钥配置
  - 前后端服务端口配置
  - 其他环境变量
- `package.json`: 统一的包管理配置文件，包含：
  - 前端依赖（Vue、TypeScript等）
  - 后端依赖（Node.js、Express等）
  - 开发工具依赖
  - 项目脚本命令

#### 配置文件
- `backend/tsconfig.json`: 后端TypeScript配置
  - 编译目标：ES2020
  - 模块系统：CommonJS
  - 严格类型检查
  - 装饰器支持
- `frontend/tsconfig.json`: 前端TypeScript配置
  - 编译目标：ES2020
  - 模块系统：ESNext
  - Vue 3支持
  - 严格类型检查
- `frontend/vite.config.ts`: 前端构建工具配置
  - Vue插件配置
  - 开发服务器配置
  - 代理配置
  - 路径别名配置

#### 前端核心文件
- `frontend/src/components/chat/ChatView.vue`: 主对话界面组件，负责消息展示和交互
- `frontend/src/components/chat/CharacterSelect.vue`: 角色选择组件，处理角色切换逻辑
- `frontend/src/components/chat/MessageList.vue`: 消息列表组件，展示对话历史
- `frontend/src/components/chat/InputArea.vue`: 用户输入组件，处理消息发送
- `frontend/src/store/chat.ts`: 聊天状态管理，处理对话数据和状态
- `frontend/src/types/chat.ts`: 聊天相关类型定义
- `frontend/src/utils/api.ts`: API请求封装

#### 后端核心文件
- `backend/src/controllers/chatController.ts`: 处理聊天相关请求
- `backend/src/services/aiService.ts`: AI模型调用服务
- `backend/src/services/chatService.ts`: 对话管理服务
- `backend/src/models/Chat.ts`: 聊天数据模型
- `backend/src/models/Character.ts`: 角色数据模型
- `backend/src/routes/chat.ts`: 聊天相关路由定义
- `backend/src/config/database.ts`: 数据库配置

## 2. 核心组件

### 2.1 前端组件

- **ChatView**: 主对话界面组件
- **CharacterSelect**: 角色选择组件
- **MessageList**: 消息列表组件
- **InputArea**: 用户输入组件
- **AutoReply**: 自动回复选项组件

### 2.2 后端服务

- **AIService**: AI 模型调用服务
- **ChatService**: 对话管理服务
- **PromptService**: Prompt 生成服务
- **LogService**: 日志记录服务

### 2.3 数据存储

- **CharacterConfig**: 角色配置存储在 MySQL 数据库的 `character_configs` 表中
- **ChatHistory**: 对话历史存储在 MySQL 数据库的 `chat_histories` 表中
- **SystemConfig**: 系统配置存储在 MySQL 数据库的 `system_configs` 表中

## 3. 数据流

### 3.1 对话流程

1. 用户选择角色，进入聊天页面
2. 系统加载角色配置、历史对话记录、历史自动回复选项（如果没有则生成）
3. 用户选择用于生成回复的大语言模型，发送消息或选择自动回复选项
4. 系统调用用户选择的大语言模型api，流式生成角色回复
5. 更新对话历史
6. 流式生成回复完成后，生成用户自动回复选项

### 3.2 配置流程

1. 加载系统配置
2. 加载角色配置
3. 初始化 AI 模型
4. 准备 Prompt 模板

## 4. 技术栈

### 4.1 前端

- Vue 3
- TypeScript
- Vite
- TailwindCSS
- Pinia

### 4.2 后端

- Node.js
- TypeScript
- Express
- SQLite

### 4.3 AI 集成

- DeepSeek API
- Gemini API

## 5. 部署架构

### 5.1 开发环境

- 本地开发服务器
- 本地数据库
- 本地日志服务

### 5.2 生产环境

- Docker 容器化部署
- Nginx 反向代理
- 云数据库
- 云日志服务

## 6. 安全考虑

- API 密钥管理
- 用户数据加密
- 请求限流
- 错误处理
- 日志脱敏

## 7. 性能优化

- 对话历史分页
- 响应缓存
- 图片懒加载
- 代码分割
- 资源压缩

## 8. 监控和日志

- 性能监控
- 错误追踪
- 用户行为分析
- 系统健康检查
- 日志聚合 
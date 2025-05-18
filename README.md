# HerEcho - 羌青瓷角色扮演聊天应用

HerEcho是一个基于Vue 3和DeepSeek API的角色扮演聊天应用，让用户可以与虚拟角色"羌青瓷"进行对话互动。项目使用了现代前端技术栈，包括Vue 3、TypeScript、Vite和Pinia。

## 在线体验

访问 [HerEcho在线演示](https://jackwang-lea.github.io/HerEcho/) 立即体验。

## 功能特性

- 🧠 基于DeepSeek API的智能对话
- 👤 角色扮演：与羌青瓷进行沉浸式对话
- 💬 预设对话选项，方便快速互动
- 🎙️ 语音输入功能（模拟）
- 📱 响应式设计，适配移动设备
- 🌙 优雅的深色主题UI

## 技术栈

- **前端框架**: Vue 3 + TypeScript
- **构建工具**: Vite
- **状态管理**: Pinia
- **路由**: Vue Router
- **UI组件**: 自定义组件 + Remix Icon
- **API集成**: DeepSeek API
- **部署**: GitHub Pages

## 项目结构

```
HerEcho/
├── public/              # 静态资源
├── src/
│   ├── assets/          # 图片等资源
│   ├── components/      # 组件
│   ├── router/          # 路由配置
│   ├── services/        # API服务
│   ├── stores/          # Pinia状态管理
│   ├── views/           # 页面视图
│   ├── App.vue          # 根组件
│   └── main.ts          # 入口文件
├── .env                 # 环境变量（不提交到Git）
├── index.html           # HTML模板
├── package.json         # 项目依赖
└── vite.config.ts       # Vite配置
```

## 本地开发

### 前提条件

- Node.js 16+ 
- pnpm 7+ (推荐) 或 npm

### 安装依赖

```bash
pnpm install
```

### 配置API密钥

1. 在项目根目录创建`.env`文件
2. 添加以下内容，替换为你的DeepSeek API密钥：

```
VITE_DEEPSEEK_API_KEY=你的API密钥
```

### 启动开发服务器

```bash
pnpm dev
```

### 构建生产版本

```bash
pnpm build
```

### 部署到GitHub Pages

```bash
pnpm deploy
```

## 贡献指南

欢迎提交Pull Request或Issue。在提交PR前，请确保：

1. 代码符合项目风格
2. 所有测试通过
3. 更新相关文档

## 许可证

[MIT](LICENSE)

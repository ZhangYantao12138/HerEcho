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
- 🎭 多角色支持：可切换不同角色
- 🎤 语音消息支持：可发送语音消息
- 📖 故事情节进度：随着对话推进故事情节

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

### 预览生产构建

```bash
pnpm preview
```

### 部署到GitHub Pages

```bash
pnpm deploy
```

## 部署

### GitHub Pages部署

```bash
# 部署到GitHub Pages
pnpm deploy
```

### Zeabur部署

1. 在Zeabur上创建新项目
2. 连接GitHub仓库
3. 选择自动部署
4. 完成部署

或者使用Zeabur CLI:

```bash
# 安装Zeabur CLI
npm install -g zeabur

# 登录
zeabur login

# 部署
zeabur deploy
```

## 角色设定

### 羌青瓷

羌青瓷是一位优雅、神秘的女性角色，是位心理医生，也是莱诺家族的继承者（瑞法·莱诺）。与程聿怀（用户）有着复杂的过去：大学相识，羌青瓷心灵有伤，程聿怀治愈了她，他们相爱。1995年，羌青瓷为了保护程聿怀，消除了他的记忆。2000年，他们重逢，羌青瓷隐藏爱意，协助他复仇。

### 程聿怀

程聿怀是一位年轻有为的心理医生，同时也是一个复仇者。性格冷峻外表，内心温柔，说话直接但不失礼貌。有着复杂的过去，但依然保持着对生活的热爱。专业素养极高，对病人充满同理心。

## 贡献指南

欢迎提交Pull Request或Issue。在提交PR前，请确保：

1. 代码符合项目风格
2. 所有测试通过
3. 更新相关文档

## 迭代历史

### v1.0 - 初始版本
- 实现基础的羌青瓷角色对话功能
- 集成DeepSeek API实现智能回复
- 创建基础UI界面和响应式设计

### v1.1 - 多角色扩展
- 添加程聿怀、程走柳等多个角色
- 实现角色切换功能
- 优化UI交互体验

### v1.2 - 角色对话系统升级
- 创建角色回复和玩家自动回复的prompt系统
- 设计针对不同角色(羌青瓷、程聿怀等)的特定prompt
- 实现玩家自动回复的prompt生成功能

### v1.3 - Prompt配置平台
- 创建promptConfig.ts文件，提供可配置的prompt模板和系统参数
- 将角色回复和玩家回复的prompt模板抽象为可配置项
- 实现模板占位符替换机制，提升prompt生成灵活性

### v1.4 - 多视角对话
- 实现蒋伯驾视角与程走柳对话的功能
- 添加以撒视角与缪宏谟对话的功能
- 创建viewpointService服务管理角色间的互动关系和视角切换
- 在UI中显示当前对话视角信息

### v1.5 - 系统优化
- 优化DeepSeek服务使用全局配置参数
- 添加角色切换时的自动回复功能
- 修复TypeScript类型错误
- 改进构建和部署流程

## 许可证

[MIT](LICENSE)

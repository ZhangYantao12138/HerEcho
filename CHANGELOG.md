# HerEcho 项目修改记录

## 2025-05-27 Russo feat：加入Gemini和模型切换功能；删去不必要的编译产物

### 1. 新增Gemini AI模型支持
- 集成Google Gemini 1.5 Flash模型
  - 配置Gemini API端点和调用逻辑
  - 添加Gemini专用的API格式转换处理
  - 支持中英文对话，响应速度快
- 新增环境变量配置
  - 添加 `VITE_GEMINI_API_KEY` 环境变量支持
  - 更新API设置文档，提供Gemini密钥获取指南

### 2. 实现模型实时切换功能
- 新增ModelSelector组件
  - 在ChatHeader中集成模型选择器
  - 支持DeepSeek和Gemini之间的实时切换
  - 提供直观的模型状态显示
- 优化API调用架构
  - 重构 `callAIAPI` 函数，支持多模型路由
  - 实现模型特定的参数配置和错误处理
  - 保持会话连续性，切换模型不影响对话历史

### 3. 系统架构优化
- 扩展AIModel类型定义，支持枚举化的模型管理
- 完善错误处理机制，针对不同模型提供专门的回退策略
- 更新技术架构文档，记录多模型支持的实现细节

##

## 2025-05-23 Russo 优化：角色提示词优化；no think
### 1. 角色prompt优化
- 在character.ts中修改了角色的prompt，使其与对话的对象的语气更符合关系

### 2. deepseek参数修改
- 开启了no think 选项


## 2025-05-23 Russo feat：自动回复功能优化；玩家角色匹配；角色新增
### 1. 自动回复优化
- 移除了自动展示回复的逻辑，用户点击后才展开
- 移除了预设的回复，全部改为自动生成
- 修改了自动回复的生成提示词

### 2. 玩家角色匹配
- 重构了service
  - 把各种prompt相关整合入chatservice
  - 创建viewpointservice，在mapping里控制对话角色匹配
- 加入了正确的角色匹配

### 3. 角色新增
- 加入了角色 阿奇
  - 更新了相关文件

## 2025-05-22 Russo feat：自动回复功能优化

### 1. 自动回复生成状态优化
- 改进自动回复选项的生成过程
  - 在生成过程中立即显示面板，并显示加载状态
  - 添加加载动画和提示文字
  - 优化生成过程中的视觉反馈
- 完善回复按钮状态
  - 在生成过程中显示加载动画
  - 添加 loading 状态的样式
  - 在加载状态下禁用按钮点击

### 2. 自动回复交互优化
- 完善自动回复选择后的处理
  - 选择自动回复后立即调用 API 获取角色回复
  - 添加错误处理和加载状态
  - 确保角色对用户的自动回复做出回应
- 优化用户体验
  - 添加加载动画效果
  - 改进视觉反馈
  - 确保状态转换的流畅性

## 2025-05-21 Russo feat：角色系统优化与背景描述功能

### 1. 角色背景描述功能
- 在角色聊天记录开头添加背景描述气泡
  - 修改 `Character` 类型定义，添加 `backgroundDescription` 属性
  - 更新 `CharacterChatPage.vue` 组件以显示角色背景描述
  - 优化背景描述气泡的样式和布局

### 2. 角色 prompt 优化
- 调整所有角色的系统提示词
  - 增加对用户更耐心和温柔的要求；持角色个性的同时，优化互动体验
  - 统一添加了"对重要的人展现更多耐心，用包容的态度倾听"的指导原则

### 3. 聊天页面回退
- 修改收起时的表现效果
  - 重新改为展示最新的两条消息
  - 删去收起后滚动

## 2025-05-21 Russo feat：阙落上线；未上线页面（发现、我的）优化
### 1. 页面导航优化
- 在发现页面和我的页面添加返回按钮（终于做了这个）
  - 使用 `RiArrowLeftSLine` 图标作为返回按钮，位于页面左上角
  - 点击按钮返回之前所在的页面

### 2. 阙落上线
- 更新剧本状态
  - 移除锁定状态，开放剧本
- 配置角色列表
  - 添加六个角色到剧本中，完成所有相关配置
  - 修改了聊天页面的角色选择逻辑，确保不同剧本角色选择的正常展示

## 2025-05-20 Russo 建立角色对应的断连回复；图片资源命名统一；角色系统更新
### 1. 断连回复功能修改
- 把deepseekservice中的通用断连回复删去，在每个角色设定中加入对应回复语句
  - 修改函数和数据结构，适应以上修改
  - 在每一次角色切换时，调用setcurrentcharacter，追踪当前角色
- 资源命名统一
  - 修改了角色背景图的命名方式
  - 加入了剧本图片

### 2.剧本详情页面修改
- 简化了剧本详情界面
  - 移除了章节和完成度信息
  - 保留核心信息：封面图片、剧本名称、剧本介绍
  - 优化了角色选择界面
- 优化了组件代码
  - 简化了组件接口定义，移除了不再使用的属性
  - 优化了组件的事件处理
  - 删除了冗余的样式代码

### 3. 新增角色
- 添加了多个新角色到系统中，目前角色列表：
  - 羌青瓷 (B001C001)
  - 程聿怀（男）(B001C002)
  - 程聿怀（女）(B001C003)
  - 程走柳 (B001C004)
  - 黛利拉 (B001C005)
  - 蒋伯驾 (B001C006)
  - 缪宏谟 (B001C007)
  - 以撒 (B001C008)
- 为每个角色配置了完整的属性
  - 添加了角色头像和背景图片
  - 设置了角色特定的系统提示词
  - 配置了初始对话消息
- 页面优化
  - 删除了输入框的默认提示语
  - 优化了角色选择列表的显示
  - 改进了角色切换的用户体验

## 2025-05-20 Russo 数据结构优化、聊天页面优化、剧本切换功能

### 1. 角色数据结构更新
- 添加 `book_id` 属性，用于标识角色所属剧本
- 更新角色ID命名规则
  - 格式：B[剧本编号]C[角色编号]
  - 示例：B001C001（第一本剧本的第一个角色）
- 统一角色常量命名规范
  - 格式：character + 完整姓名拼音 + 剧本编号 + 角色编号
  - 示例：characterQiangQingCiB001C001

### 3. 聊天页面：预设消息面板交互优化
- 自动收起：添加点击页面其他区域时自动收起预设消息面板的功能
- 展示效果修复：修复预设消息按钮点击事件冒泡问题（即输入框变蓝的问题）

### 4. 聊天页面：聊天记录容器箭头动画优化
- 修改箭头图标的初始状态和旋转逻辑
  - 初始状态（展开状态）时箭头向上（已旋转180度）
  - 点击收起时箭头旋转回向下状态
  - 点击展开时箭头再次旋转180度回到向上状态
  - 优化动画效果，使箭头始终指向内容将要移动的方向

### 5. 聊天页面：剧本切换功能
- 增加了剧本选择页面和剧本详情页面
  - 独立了DreamHome页面的组件，基于此新增了剧本组件，增强了可复用性和可维护性
  - 设计了剧本的数据结构，基于数据库自动生成页面。之后dreamhome部分也要改成这样
  - 修改了路由，把角色切换改为路由跳转。同步修改了聊天页面的角色切换逻辑。
- 在剧本详情页设计了角色选择栏


## 2025-05-18 Russo 聊天页面美化以及角色增加

### 1. 美化聊天页面
- 删去了不必要的代码
  - 删去了"收起时获取最新两条消息展示"的函数及相关前端代码
  - 移除了原有的API测试按钮，转移到 ChatHeader.vue 中，保留了相关功能
  - 优化了ChatHeader.vue布局，删去了不必要的按钮
  - 删去了虚拟键盘的相关代码
- 重构聊天页面布局
  - 固定背景图片显示
  - 优化聊天界面透明度
  - 统一控制栏和聊天记录容器样式
- 改进展开/收起功能
  - 收起时固定占据底部40%空间
  - 展开时自动留出顶部进度条空间
  - 优化控制栏与聊天记录的衔接

### 2. 
- 角色切换功能
  - 角色配置信息在 character.ts 中统一配置（service的那个文件可能没用了，但还没测试，后续需要合并一下）
  - 修改了header，可以切换角色了
- 新增角色
  - 增加了程聿怀角色
  - 还没有修改角色设定和prompt，待办

## 2025-05-18 Russo 叙梦系统实现

### 1. 添加了叙梦主页 (DreamHomeView.vue)
- 实现故事卡片列表展示
  - 支持显示故事封面、标题、描述
  - 添加进度显示功能（已完成章节/总章节）
  - 实现新故事标记和锁定状态显示
- 添加故事详情弹窗
  - 展示故事完整信息和进度
  - 提供"开始游戏"和"继续游戏"选项（但没有保存游戏进度）
  - 支持重新开始已进行的故事

### 2. 叙梦分镜场景系统 (DreamView.vue)
- 实现场景展示系统
  - 支持背景图片显示
  - 添加场景标题和描述展示
  - 实现选项列表和选项交互
- 独立数据管理（dreamStore）
  - 内容、跳转逻辑和程序逻辑分离，便于维护

### 待解决的：
- dreamview的样式还是有点丑，今晚先不改了


## 2025-05-18 Russo 聊天界面优化：虚拟键盘

### 1. 添加虚拟键盘功能
- 实现点击输入框时显示虚拟键盘样式
  - 添加完整的虚拟键盘布局
  - 键盘支持基本按键展示（纯UI，不含实际功能）
- 优化键盘弹出时的布局适配
  - 当聊天记录展开时，适当缩小聊天区域以留出键盘空间
  - 当聊天记录收起时，缩小背景图区域以适应键盘显示
  - 确保整体布局协调，不遮挡导航栏和输入框

### 2. 细节优化
- 改进消息选择选项区域
  - 添加文本溢出处理，防止长文本破坏布局
  - 确保选项面板与输入框宽度保持一致
- 优化键盘显示/隐藏的过渡动画
  - 添加平滑的高度变化过渡效果
  - 协调各组件之间的视觉关系


## 2025-05-17 Russo 聊天页面完善

### 1. 输入框逻辑完善
- 添加语音输入模式切换功能
  - 实现文字输入和语音输入模式之间的切换
  - 添加左侧图标切换（麦克风/键盘）
  - 添加录音状态反馈（动画和计时器）
- 实现模拟的语音消息发送功能
  - 添加按下/释放事件处理
  - 显示录音时长
  - 发送语音消息（当前为模拟实现）

### 2. 页面细节格式优化
- 修复底部导航栏长度与页面长度不匹配的问题
- 统一组件宽度
  - 为 ChatPage、ChatInput 和 BottomNav 组件添加一致的宽度限制
  - 确保所有组件水平居中对齐
- 修复聊天记录展开时与文字框之间出现黑色留空的问题，改进聊天记录容器展开收起实现方式
  - 使用固定高度替代之前的 flex 布局
  - 保持聊天记录的完整性，在收起状态下也支持查看所有历史消息
  - 删去了函数 latestUserMessage 、latestCharacterMessage，因为已经不需要获取了

# 剧情对话模式开发文档

## 1. 功能概述
增加剧情对话模式，使角色能够根据预设的剧情阶段进行对话演进，提供更丰富的互动体验。

## 2. 数据结构设计

### 2.1 角色配置扩展
```typescript
interface StoryStage {
  stageId: number;          // 剧情阶段序号
  stageName: string;        // 剧情阶段名称
  systemPrompt: string;     // 系统提示词
  stagePrompt: string;      // 阶段提示词
  requiredProgress: number; // 推进所需进度值
}

interface Character {
  // ... 现有属性 ...
  storyMode: {
    enabled: boolean;       // 是否启用剧情模式
    currentStage: number;   // 当前剧情阶段
    stages: StoryStage[];   // 剧情阶段配置
  }
}
```

### 2.2 状态管理
```typescript
interface StoryState {
  isStoryMode: boolean;     // 是否处于剧情模式
  currentProgress: number;  // 当前进度
  canAdvance: boolean;      // 是否可以推进剧情
}
```

## 3. 界面修改

### 3.1 设置下拉栏
- 在 `ChatHeader.vue` 中添加"剧情对话模式"开关
- 位置：右上角设置下拉菜单中
- 类型：Toggle Switch

### 3.2 剧情信息条
- 修改现有的剧情信息显示区域
- 添加"推进剧情"按钮（条件显示）
- 样式：右侧对齐，使用主题色

## 4. 功能实现

### 4.1 剧情模式切换
```typescript
function toggleStoryMode(enabled: boolean) {
  // 1. 更新角色配置
  // 2. 重置当前进度
  // 3. 更新系统提示词
  // 4. 刷新界面显示
}
```

### 4.2 进度管理
```typescript
function updateProgress() {
  if (!isStoryMode) return;
  
  currentProgress++;
  checkStageAdvancement();
}

function checkStageAdvancement() {
  const currentStage = character.storyMode.stages[character.storyMode.currentStage];
  if (currentProgress >= currentStage.requiredProgress) {
    showAdvanceButton();
  }
}
```

### 4.3 剧情推进
```typescript
function advanceStory() {
  // 1. 发送系统提示消息
  // 2. 更新剧情阶段
  // 3. 重置进度
  // 4. 更新界面显示
}
```

## 5. API 调用修改

### 5.1 系统提示词生成
```typescript
function generateSystemPrompt() {
  if (!isStoryMode) {
    return defaultSystemPrompt;
  }
  
  const currentStage = character.storyMode.stages[character.storyMode.currentStage];
  return combinePrompts(
    currentStage.systemPrompt,
    currentStage.stagePrompt
  );
}
```

## 6. 开发步骤

1. 数据结构实现
   - 创建 `StoryStage` 接口
   - 扩展 `Character` 接口
   - 添加 `StoryState` 接口

2. 配置更新
   - 为现有角色添加剧情阶段配置
   - 创建剧情模式默认配置

3. 界面开发
   - 实现设置开关
   - 修改剧情信息条
   - 添加推进按钮

4. 功能实现
   - 实现剧情模式切换
   - 实现进度管理
   - 实现剧情推进
   - 修改 API 调用逻辑

5. 测试
   - 单元测试
   - 集成测试
   - 用户界面测试

## 7. 注意事项

1. 数据兼容性
   - 确保现有角色配置向后兼容
   - 处理剧情模式切换时的状态保存

2. 性能考虑
   - 优化剧情阶段切换时的状态更新
   - 减少不必要的重渲染

3. 用户体验
   - 提供清晰的剧情模式状态指示
   - 确保剧情推进的流畅性

4. 错误处理
   - 处理剧情配置缺失的情况
   - 处理进度计算异常

## 8. 后续优化方向

1. 剧情分支支持
2. 多角色剧情联动
3. 剧情回放功能
4. 剧情进度保存
5. 自定义剧情配置 
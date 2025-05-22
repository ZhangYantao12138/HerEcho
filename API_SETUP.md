# DeepSeek API 设置指南

## 问题

如果你看到以下错误：
```
调用DeepSeek API失败: TypeError: Cannot read properties of undefined (reading 'substring')
```

这是因为 DeepSeek API 密钥未设置或设置不正确。

## 解决方案

1. 在项目根目录创建一个 `.env` 文件（如果尚不存在）
2. 在 `.env` 文件中添加以下内容：

```
VITE_DEEPSEEK_API_KEY=your_api_key_here
```

3. 将 `your_api_key_here` 替换为你的实际 DeepSeek API 密钥
4. 保存文件并重启应用

## 获取 DeepSeek API 密钥

如果你还没有 DeepSeek API 密钥，请访问 DeepSeek 官网获取：
https://platform.deepseek.com/

## 注意事项

- 确保 `.env` 文件不会被提交到版本控制系统中
- 在部署应用时，请确保环境变量已正确设置 
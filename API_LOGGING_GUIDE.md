# 📊 API日志功能指南

本项目的API客户端内置了完整的请求和响应日志功能，帮助开发者调试和监控所有API交互。

## 🔧 配置方式

### 环境变量配置

```bash
# .env.local 文件
VITE_API_LOGGING=detailed
```

### 命令行配置

```bash
# 启动时指定日志级别
./start.sh dev --api-logging detailed
```

## 📋 日志级别

### 1. `true` - 简洁模式（默认）

显示基本的请求和响应信息：

```
🚀 [abc123] GET /auth/login
✅ [abc123] 200 - 145ms
```

### 2. `detailed` - 详细模式

显示完整的请求和响应详情：

```
🚀 API请求 [abc123] - 2024-01-15T10:30:45.123Z
  📍 URL: POST http://localhost:8000/api/v1/auth/login
  📋 Headers: { Content-Type: "application/json", ... }
  📝 Request Body: { username: "admin", password: "..." }

✅ API响应 [abc123] - 2024-01-15T10:30:45.268Z
  📍 URL: POST /auth/login
  📊 Status: 200 OK
  ⏱️ Duration: 145ms
  📋 Response Headers: { Content-Type: "application/json", ... }
  📦 Response Data: { user: { id: "1", username: "admin" } }
```

### 3. `false` - 禁用日志

完全禁用所有API日志输出。

## 🎯 日志特性

### 唯一请求ID
每个API请求都有唯一的ID，方便追踪请求-响应对应关系：
```
🚀 [abc123] POST /auth/login
✅ [abc123] 200 - 145ms
```

### 请求时长统计
自动计算并显示每个请求的响应时间：
```
⏱️ Duration: 145ms
```

### 错误详情
详细记录API错误信息：
```
❌ API错误 [xyz789] - 2024-01-15T10:30:45.456Z
  📍 URL: POST /auth/login
  ⏱️ Duration: 89ms
  📊 Status: 401 Unauthorized
  📦 Error Data: { message: "Invalid credentials" }
```

### 网络错误处理
区分不同类型的错误：
```
🔌 Network Error: 没有收到响应
⚙️ Config Error: Request failed with status code 404
```

## 🔍 调试场景

### 1. 开发调试
```bash
# 启用详细日志进行开发调试
VITE_API_LOGGING=detailed npm run dev
```

### 2. 生产监控
```bash
# 生产环境禁用日志
VITE_API_LOGGING=false npm run build
```

### 3. 性能分析
使用详细模式监控API响应时间：
```
⏱️ Duration: 1250ms  # 发现慢查询
⏱️ Duration: 45ms    # 正常响应
```

### 4. 错误排查
通过错误日志定位问题：
```
❌ [def456] 500 - 2000ms - Internal Server Error
📦 Error Data: { 
  error: "Database connection failed",
  stack: "..."
}
```

## 📊 日志格式详解

### 请求日志格式
```
🚀 API请求 [RequestID] - Timestamp
  📍 URL: METHOD BaseURL/Endpoint
  📋 Headers: { ... }
  📝 Request Body: { ... }    # 仅当有请求体时显示
  🔍 Query Params: { ... }    # 仅当有查询参数时显示
```

### 响应日志格式
```
✅ API响应 [RequestID] - Timestamp
  📍 URL: METHOD /Endpoint
  📊 Status: Code StatusText
  ⏱️ Duration: Xms
  📋 Response Headers: { ... }
  📦 Response Data: { ... }
```

### 错误日志格式
```
❌ API错误 [RequestID] - Timestamp
  📍 URL: METHOD /Endpoint
  ⏱️ Duration: Xms
  📊 Status: Code StatusText      # 服务器错误
  🔌 Network Error: Description  # 网络错误
  ⚙️ Config Error: Message       # 配置错误
  📦 Error Data: { ... }
  🔍 Full Error: { ... }
```

## 🎛️ 高级配置

### 在代码中动态控制
虽然主要通过环境变量控制，但日志配置在初始化时确定：

```typescript
// client/src/lib/api-client.ts
const LOG_CONFIG = {
  enabled: import.meta.env.VITE_API_LOGGING !== 'false',
  detailed: import.meta.env.VITE_API_LOGGING === 'detailed',
};
```

### 自定义日志函数
日志功能通过独立的函数实现，便于扩展：

```typescript
const logRequest = (config, requestId, timestamp) => { ... }
const logResponse = (response, requestId, duration, timestamp) => { ... }
const logError = (error, requestId, duration, timestamp) => { ... }
```

## 💡 最佳实践

### 1. 开发环境
```bash
# 使用详细日志进行开发
export VITE_API_LOGGING=detailed
./start.sh dev
```

### 2. 测试环境
```bash
# 使用简洁日志减少噪音
export VITE_API_LOGGING=true
./start.sh dev
```

### 3. 生产环境
```bash
# 禁用日志保护性能和隐私
export VITE_API_LOGGING=false
./start.sh build
```

### 4. 调试特定问题
```bash
# 临时启用详细日志
./start.sh dev --api-logging detailed
```

## 🔒 安全注意事项

1. **生产环境**: 确保禁用日志以避免敏感信息泄露
2. **敏感数据**: 不要在请求体中包含密码等敏感信息
3. **日志存储**: 浏览器控制台日志不会持久化存储

## 🛠️ 故障排除

### 日志不显示
1. 检查环境变量: `console.log(import.meta.env.VITE_API_LOGGING)`
2. 检查浏览器控制台过滤器
3. 确认API请求确实发生

### 日志过多
1. 切换到简洁模式: `VITE_API_LOGGING=true`
2. 使用浏览器控制台过滤功能
3. 临时禁用日志: `VITE_API_LOGGING=false`

### 性能影响
详细日志模式可能会影响性能，建议：
1. 开发时使用详细模式
2. 生产时禁用所有日志
3. 大量请求时切换到简洁模式

---

💡 **提示**: 使用浏览器开发者工具的控制台分组功能，可以折叠/展开日志组，提高可读性。

# 🎭 Mock模式使用指南

Mock模式允许您在没有真实后端API服务的情况下测试前端页面逻辑，提供完整的模拟数据和API响应。

## 🚀 快速开始

### 启用Mock模式

```bash
# 方法1: 命令行参数
./start.sh dev --mock

# 方法2: 环境变量
export VITE_MOCK_API=true
./start.sh dev

# 方法3: .env.local文件
echo "VITE_MOCK_API=true" >> .env.local
./start.sh dev
```

### 自定义Mock配置

```bash
# 设置响应延迟范围 (100-800ms)
./start.sh dev --mock --mock-delay 100-800

# 设置错误率 (10%)
./start.sh dev --mock --mock-error-rate 0.1

# 完整配置
./start.sh dev --mock --mock-delay 200-1000 --mock-error-rate 0.05
```

## ⚙️ 配置选项

### 环境变量

| 变量名 | 说明 | 默认值 | 示例 |
|--------|------|--------|------|
| `VITE_MOCK_API` | 启用Mock模式 | `false` | `true` |
| `VITE_MOCK_DELAY_MIN` | 最小响应延迟(ms) | `100` | `200` |
| `VITE_MOCK_DELAY_MAX` | 最大响应延迟(ms) | `800` | `1000` |
| `VITE_MOCK_ERROR_RATE` | 随机错误率 | `0` | `0.1` |

### .env.local 示例

```bash
# 启用Mock模式
VITE_MOCK_API=true

# 自定义延迟范围 (200-1000ms)
VITE_MOCK_DELAY_MIN=200
VITE_MOCK_DELAY_MAX=1000

# 设置10%的错误率 (可选，默认为0)
VITE_MOCK_ERROR_RATE=0.1

# 启用详细日志查看Mock请求
VITE_API_LOGGING=detailed
```

## 📊 Mock数据内容

### 用户数据
- **管理员**: `admin/admin123`
- **教师**: `instructor/instructor123` 或 `instructor1/instructor123`
- **学生**: `student/student123` 或 `student1/student123`
- **协调员**: `coordinator/coordinator123` 或 `coordinator1/coordinator123`

### 快速登录模式
为了方便测试，Mock模式支持以下快速登录方式：
- **空密码**: 任何有效用户名 + 空密码 → 自动登录成功
- **通用密码**: `123`, `password`, `用户名123` 都可以用作通用密码
- **标准密码**: 每个用户的标准密码（如 `admin123`）

### 医疗数据
- **患者**: 张三 (急性心肌梗死)、李四 (呼吸衰竭)
- **生命体征**: 血压、心率、呼吸、体温、血氧饱和度
- **检验结果**: 肌钙蛋白I、CK-MB、血常规等
- **医疗历史**: 高血压、糖尿病等既往病史
- **药物**: 阿司匹林、硝酸甘油等
- **SOAP笔记**: 完整的病程记录
- **医嘱**: 检验、影像学检查等

### 会话和分组
- **模拟会话**: 急性心肌梗死训练、急性呼吸衰竭案例
- **分组**: 第一组、第二组及成员管理
- **资产**: 心电图报告、胸部X线片等文档和图像

## 🎮 使用场景

### 1. 前端开发
无需启动后端服务即可开发和测试前端功能：

```bash
# 启动Mock模式开发
./start.sh dev --mock --api-logging detailed
```

### 2. 页面逻辑测试
测试各种数据状态下的页面表现：

```bash
# 快速响应测试
./start.sh dev --mock --mock-delay 50-200

# 慢网络测试
./start.sh dev --mock --mock-delay 1000-3000
```

### 3. 错误处理测试
验证错误处理逻辑：

```bash
# 高错误率测试
./start.sh dev --mock --mock-error-rate 0.3
```

### 4. 演示和培训
提供稳定的演示环境：

```bash
# 稳定演示模式 (无错误)
./start.sh dev --mock --mock-error-rate 0 --mock-delay 100-300
```

## 📝 Mock API功能

### 完整API覆盖
Mock模式支持所有真实API端点：

- ✅ 用户认证 (`/auth/login`)
- ✅ 会话管理 (`/sessions/*`)
- ✅ 患者数据 (`/patients/*`)
- ✅ 分组管理 (`/groups/*`)
- ✅ 资产管理 (`/assets/*`)
- ✅ 管理员功能 (`/admin/*`)
- ✅ 协调员功能 (`/coordinator/*`)

### 真实行为模拟
- **网络延迟**: 模拟真实网络请求时间
- **随机错误**: 模拟服务器错误、网络故障等
- **数据持久化**: 在会话期间保持数据状态
- **CRUD操作**: 支持创建、读取、更新、删除操作

### 日志集成
Mock请求与真实API使用相同的日志系统：

```
🎭 Mock请求 [abc123] - 2024-01-15T10:30:45.123Z
  📍 URL: POST /auth/login
  📝 Request Data: { username: "admin" }

✅ API响应 [abc123] - 2024-01-15T10:30:45.268Z
  📊 Status: 200 OK
  ⏱️ Duration: 145ms (Mock)
  📦 Response Data: { user: { ... } }
```

## 🔧 高级功能

### 动态数据生成
Mock系统提供数据生成器：

```typescript
// 生成5个随机用户
const users = generateMockData.users(5);

// 生成3个患者 (指定会话)
const patients = generateMockData.patients(3, 'session-1');

// 生成患者生命体征数据
const vitals = generateMockData.vitals('patient-1', 5);
```

### 自定义错误类型
模拟不同类型的API错误：

- **404**: 资源未找到
- **401**: 未授权访问
- **403**: 权限不足
- **500**: 服务器内部错误

### 数据状态管理
Mock数据在会话期间保持状态：

- 创建的数据会保存在内存中
- 更新操作会修改现有数据
- 删除操作会移除数据
- 页面刷新后重置为初始状态

## 🎯 最佳实践

### 1. 开发阶段
```bash
# 启用详细日志和适中延迟
./start.sh dev --mock --api-logging detailed --mock-delay 200-600
```

### 2. 测试阶段
```bash
# 快速响应，低错误率
./start.sh dev --mock --mock-delay 50-200 --mock-error-rate 0.05
```

### 3. 演示阶段
```bash
# 稳定可靠，无错误
./start.sh dev --mock --mock-delay 100-300 --mock-error-rate 0
```

### 4. 压力测试
```bash
# 慢网络，高错误率
./start.sh dev --mock --mock-delay 1000-5000 --mock-error-rate 0.2
```

## 📋 功能对比

| 功能 | Mock模式 | 真实API |
|------|----------|---------|
| 开发速度 | ⚡ 即时启动 | 🐌 需要后端服务 |
| 数据控制 | 🎛️ 完全可控 | 📊 真实数据 |
| 网络模拟 | 🌐 可配置 | 📡 真实网络 |
| 错误测试 | 🎯 可控制 | 🔀 随机出现 |
| 离线开发 | ✅ 支持 | ❌ 需要网络 |
| 数据持久化 | 🔄 会话级别 | 💾 永久保存 |

## 🔍 调试技巧

### 1. 查看Mock状态
在浏览器控制台检查：

```javascript
// 检查是否启用Mock模式
console.log('Mock模式:', import.meta.env.VITE_MOCK_API);

// 检查当前使用的API客户端
import { isMockEnabled } from '@/lib/api-client';
console.log('当前模式:', isMockEnabled() ? 'Mock' : '真实API');
```

### 2. 日志过滤
使用浏览器控制台过滤器：

- 过滤Mock请求: `🎭`
- 过滤真实请求: `🚀`
- 过滤错误: `❌`

### 3. 性能监控
查看Mock响应时间是否符合预期：

```
⏱️ Duration: 345ms (Mock)  # 应该在配置范围内
```

## ⚠️ 注意事项

1. **数据重置**: 页面刷新会重置所有Mock数据
2. **内存限制**: 大量数据操作可能影响浏览器性能
3. **类型安全**: Mock数据结构与真实API保持一致
4. **版本同步**: Mock数据需要与API规范保持同步
5. **生产禁用**: 确保生产环境禁用Mock模式

## 🛠️ 故障排除

### Mock模式未启用
```bash
# 检查环境变量
./start.sh status

# 检查配置
echo $VITE_MOCK_API
```

### 数据不正确
```bash
# 启用详细日志查看请求
./start.sh dev --mock --api-logging detailed
```

### 响应太快/太慢
```bash
# 调整延迟范围
./start.sh dev --mock --mock-delay 500-1500
```

### 错误太多/太少
```bash
# 调整错误率
./start.sh dev --mock --mock-error-rate 0.1
```

---

💡 **提示**: Mock模式是开发和测试的强大工具，但不应替代与真实API的集成测试。建议在开发完成后使用真实API进行最终验证。

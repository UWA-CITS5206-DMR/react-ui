# 🧪 Mock模式测试示例

以下是一些测试Mock模式功能的示例场景。

## 🚀 快速验证

### 1. 启动Mock模式
```bash
./start.sh dev --mock --api-logging detailed
```

### 2. 在浏览器控制台测试API
打开浏览器开发者工具，在控制台运行：

```javascript
// 测试登录API
import { api } from '/src/lib/api-client.ts';

// 使用Mock用户登录
const result = await api.auth.login('admin', 'admin123');
console.log('登录结果:', result);

// 获取会话数据
const sessions = await api.sessions.getByInstructor('user-2');
console.log('会话列表:', sessions);

// 获取患者数据
const patients = await api.sessions.getPatients('session-1');
console.log('患者列表:', patients);
```

## 📋 测试用例

### 用例1: 用户认证测试
```bash
# 启动Mock模式
./start.sh dev --mock

# 在浏览器中访问登录页面
# 使用以下凭据测试:
# 管理员: admin / admin123
# 教师: instructor / instructor123 (或 instructor1)
# 学生: student / student123 (或 student1)  
# 协调员: coordinator / coordinator123 (或 coordinator1)
#
# 快速登录选项 (仅限Mock模式):
# student + 空密码 ✅
# student + 123 ✅  
# student + password ✅
```

**期望结果**: 所有用户都能成功登录并跳转到对应的仪表板

### 用例2: 患者数据加载测试
```bash
# 启动Mock模式
./start.sh dev --mock --api-logging detailed
```

**测试步骤**:
1. 以教师身份登录 (`instructor1/instructor123`)
2. 查看患者列表
3. 点击患者详情
4. 查看生命体征、检验结果等

**期望结果**: 
- 显示2个模拟患者 (张三、李四)
- 患者详情页显示完整的医疗数据
- 控制台显示所有API请求的详细日志

### 用例3: 网络延迟测试
```bash
# 慢网络模拟
./start.sh dev --mock --mock-delay 1000-3000

# 快网络模拟  
./start.sh dev --mock --mock-delay 50-200
```

**测试步骤**:
1. 登录系统
2. 在不同页面间切换
3. 观察加载状态和响应时间

**期望结果**: 
- 慢网络模式: 每个请求需要1-3秒
- 快网络模式: 每个请求需要50-200毫秒
- 页面显示适当的加载状态

### 用例4: 错误处理测试
```bash
# 高错误率模式
./start.sh dev --mock --mock-error-rate 0.3
```

**测试步骤**:
1. 多次刷新页面
2. 尝试多次登录
3. 进行CRUD操作

**期望结果**:
- 约30%的请求会失败
- 页面显示适当的错误提示
- 用户可以重试操作

### 用例5: CRUD操作测试
```bash
./start.sh dev --mock --api-logging detailed
```

**测试步骤**:
1. 以教师身份登录
2. 创建新的SOAP笔记
3. 创建新的医嘱
4. 更新患者状态
5. 创建新分组

**期望结果**:
- 所有操作都能成功完成
- 数据在页面刷新前保持状态
- 控制台显示详细的请求/响应日志

## 🔍 调试技巧

### 检查Mock状态
```javascript
// 在浏览器控制台运行
console.log('Mock模式:', import.meta.env.VITE_MOCK_API);
console.log('延迟配置:', {
  min: import.meta.env.VITE_MOCK_DELAY_MIN,
  max: import.meta.env.VITE_MOCK_DELAY_MAX
});
console.log('错误率:', import.meta.env.VITE_MOCK_ERROR_RATE);
```

### 查看Mock数据
```javascript
// 导入Mock数据查看内容
import { mockUsers, mockPatients } from '/src/lib/mock-data.ts';
console.log('Mock用户:', mockUsers);
console.log('Mock患者:', mockPatients);
```

### 切换API模式
```javascript
// 查看当前使用的API客户端
import { isMockEnabled, mockApiClient, realApiClient } from '/src/lib/api-client.ts';
console.log('当前模式:', isMockEnabled() ? 'Mock' : '真实API');
```

## 📊 性能对比测试

### Mock模式 vs 真实API
```bash
# Mock模式 (快速响应)
./start.sh dev --mock --mock-delay 100-300
# 测试操作响应时间

# Mock模式 (慢速响应)  
./start.sh dev --mock --mock-delay 1000-2000
# 对比响应时间差异

# 真实API模式 (需要后端服务)
./start.sh dev --api-url http://localhost:8000/api/v1
# 对比真实网络响应时间
```

## 🎯 功能验证清单

- [ ] ✅ 用户登录/登出
- [ ] ✅ 患者列表加载
- [ ] ✅ 患者详情查看
- [ ] ✅ 生命体征数据显示
- [ ] ✅ 检验结果查看
- [ ] ✅ SOAP笔记创建/查看
- [ ] ✅ 医嘱创建/查看
- [ ] ✅ 分组管理功能
- [ ] ✅ 资产管理功能
- [ ] ✅ 管理员功能 (用户管理)
- [ ] ✅ 协调员功能 (文档管理)
- [ ] ✅ 错误处理显示
- [ ] ✅ 加载状态显示
- [ ] ✅ 日志记录正常
- [ ] ✅ 响应时间控制
- [ ] ✅ 随机错误模拟

## 💡 测试建议

1. **先测试Mock模式**: 验证前端逻辑正确性
2. **逐步调整参数**: 测试不同网络条件下的表现
3. **错误场景测试**: 验证错误处理的完整性
4. **性能测试**: 对比不同延迟设置的用户体验
5. **真实API对比**: 确保Mock行为与真实API一致

## ⚠️ 注意事项

1. **数据重置**: 页面刷新会重置所有Mock数据
2. **网络模拟**: Mock延迟仅模拟服务器响应时间
3. **错误类型**: Mock错误可能与真实API错误不完全一致
4. **浏览器缓存**: 清除缓存可能影响测试结果
5. **开发者工具**: 某些浏览器设置可能影响网络模拟

---

🎉 **提示**: Mock模式是测试前端功能的强大工具，建议在开发初期大量使用，后期再切换到真实API进行集成测试。

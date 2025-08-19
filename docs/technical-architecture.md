# 技术架构文档 (Technical Architecture Documentation)

## 系统概览 (System Overview)

数字医疗记录仿真平台采用现代化的全栈Web应用架构，基于微服务理念设计，支持高并发、可扩展的医疗教育仿真环境。

## 架构设计原则 (Architecture Principles)

### 1. 分层架构 (Layered Architecture)
```
┌─────────────────────────────────────┐
│           用户界面层 (UI Layer)        │
├─────────────────────────────────────┤
│         业务逻辑层 (Business Layer)    │
├─────────────────────────────────────┤
│         数据访问层 (Data Access Layer) │
├─────────────────────────────────────┤
│           数据库层 (Database Layer)    │
└─────────────────────────────────────┘
```

### 2. 关注点分离 (Separation of Concerns)
- 前端专注于用户交互和状态管理
- 后端专注于业务逻辑和数据持久化
- 数据库专注于数据一致性和完整性

### 3. 类型安全 (Type Safety)
- 全栈TypeScript实现
- 编译时类型检查
- 共享类型定义确保前后端一致性

## 前端架构 (Frontend Architecture)

### 技术栈 (Technology Stack)

#### 核心框架
- **React 18**: 声明式UI构建框架
  - 函数式组件和Hooks
  - 并发特性支持
  - 严格模式开发

- **TypeScript 5.x**: 类型安全的JavaScript
  - 严格类型检查
  - 接口定义和泛型支持
  - 编译时错误检测

#### 构建工具
- **Vite**: 现代化构建工具
  - 快速热重载 (HMR)
  - ES模块原生支持
  - 优化的生产构建

#### 状态管理
- **TanStack React Query v5**: 服务器状态管理
  - 缓存和同步策略
  - 乐观更新支持
  - 后台重新获取

- **React Context**: 全局状态管理
  - 用户认证状态
  - 主题和配置

#### UI组件系统
- **Radix UI**: 可访问性组件原语
  - WAI-ARIA标准兼容
  - 键盘导航支持
  - 屏幕阅读器友好

- **shadcn/ui**: 预构建组件库
  - 一致的设计系统
  - 可定制主题
  - 响应式设计

#### 样式系统
- **Tailwind CSS**: 实用程序优先的CSS框架
  - 原子化CSS类
  - 响应式设计支持
  - 暗色模式支持

### 组件架构 (Component Architecture)

#### 组件层次结构
```
src/
├── components/          # 可复用组件
│   ├── ui/             # 基础UI组件
│   ├── forms/          # 表单组件
│   └── layout/         # 布局组件
├── pages/              # 页面组件
│   ├── admin-dashboard.tsx
│   ├── coordinator-dashboard.tsx
│   ├── instructor-dashboard.tsx
│   └── student-dashboard.tsx
├── hooks/              # 自定义Hooks
│   ├── use-auth.tsx
│   ├── use-toast.ts
│   └── use-mobile.tsx
├── lib/                # 工具库
│   ├── queryClient.ts
│   └── utils.ts
└── types/              # 类型定义
```

#### 设计模式
- **容器/展示组件模式**: 分离数据逻辑和UI展示
- **复合组件模式**: 构建灵活的组件API
- **自定义Hooks**: 封装可复用的状态逻辑

### 路由系统 (Routing System)
- **Wouter**: 轻量级客户端路由
  - 基于钩子的API
  - 嵌套路由支持
  - 程序化导航

### 表单处理 (Form Handling)
- **React Hook Form**: 高性能表单库
  - 非受控组件优化
  - 内置验证支持
  - 最小重渲染

- **Zod**: 模式验证
  - 运行时类型检查
  - 详细错误信息
  - TypeScript集成

## 后端架构 (Backend Architecture)

### 技术栈 (Technology Stack)

#### 运行时环境
- **Node.js 20+**: JavaScript运行时
  - ES模块支持
  - 现代JavaScript特性
  - 高性能事件循环

#### Web框架
- **Express.js**: 轻量级Web框架
  - 中间件生态系统
  - RESTful API设计
  - 灵活的路由系统

#### 开发工具
- **tsx**: TypeScript执行器
  - 快速开发启动
  - 热重载支持
  - 无需预编译

### API设计 (API Design)

#### RESTful架构
```
GET    /api/sessions                    # 获取所有会话
POST   /api/sessions                    # 创建新会话
GET    /api/sessions/:id                # 获取特定会话
PUT    /api/sessions/:id                # 更新会话

GET    /api/patients                    # 获取所有患者
POST   /api/patients                    # 创建新患者
GET    /api/patients/:id                # 获取特定患者
PUT    /api/patients/:id                # 更新患者信息

# 管理员API
GET    /api/admin/users                 # 获取所有用户
POST   /api/admin/users                 # 创建新用户
PUT    /api/admin/users/:id             # 更新用户
DELETE /api/admin/users/:id             # 删除用户

# 协调员API
GET    /api/coordinator/documents       # 获取文档列表
POST   /api/coordinator/documents/upload # 上传文档
DELETE /api/coordinator/documents/:id   # 删除文档
```

#### 响应格式标准
```typescript
// 成功响应
{
  "data": {...},
  "message": "操作成功",
  "timestamp": "2025-01-08T12:00:00Z"
}

// 错误响应
{
  "error": "错误描述",
  "code": "ERROR_CODE",
  "timestamp": "2025-01-08T12:00:00Z"
}
```

### 认证授权 (Authentication & Authorization)

#### 会话管理
- **Express Session**: 服务器端会话存储
  - 内存存储（开发环境）
  - Redis存储（生产环境）
  - 会话过期管理

#### 权限控制
```typescript
// 基于角色的访问控制 (RBAC)
enum UserRole {
  STUDENT = 'student',
  INSTRUCTOR = 'instructor', 
  COORDINATOR = 'coordinator',
  ADMIN = 'admin'
}

// 权限中间件
const requireRole = (roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: '权限不足' });
    }
    next();
  };
};
```

## 数据库架构 (Database Architecture)

### 数据库选择
- **PostgreSQL 15+**: 关系型数据库
  - ACID事务保证
  - 复杂查询支持
  - JSON数据类型
  - 全文搜索功能

### ORM层
- **Drizzle ORM**: 类型安全的ORM
  - 零运行时开销
  - SQL-like查询构建器
  - 自动类型推导
  - 迁移管理

### 数据模型设计 (Data Model Design)

#### 核心实体关系
```sql
-- 用户系统
users (id, username, password, role, created_at)
  ↓
sessions (id, name, description, created_by, start_time)
  ↓
patients (id, mrn, first_name, last_name, session_id)
  ↓
┌─ vitals (id, patient_id, heart_rate, blood_pressure, ...)
├─ lab_results (id, patient_id, test_name, value, status)
├─ medications (id, patient_id, name, dosage, frequency)
└─ soap_notes (id, patient_id, subjective, objective, ...)

-- 分组系统
groups (id, name, session_id, instructor_id)
  ↓
group_accounts (id, group_id, username, password)
  ↓
data_versions (id, session_id, name, version, data)

-- 文档系统
documents (id, session_id, category, file_path, uploaded_by)
  ↓
document_releases (id, document_id, group_id, release_type, scheduled_time)

-- 审计系统
audit_logs (id, user_id, action, entity_type, entity_id, timestamp)
```

#### 数据完整性约束
- **外键约束**: 确保引用完整性
- **唯一约束**: 防止重复数据
- **检查约束**: 验证数据有效性
- **非空约束**: 确保必要字段

### 查询优化 (Query Optimization)

#### 索引策略
```sql
-- 主键索引（自动创建）
CREATE INDEX idx_patients_session_id ON patients(session_id);
CREATE INDEX idx_vitals_patient_id ON vitals(patient_id);
CREATE INDEX idx_lab_results_patient_id ON lab_results(patient_id);

-- 复合索引
CREATE INDEX idx_documents_session_category ON documents(session_id, category);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);

-- 部分索引
CREATE INDEX idx_active_sessions ON sessions(id) WHERE active = true;
```

## 安全架构 (Security Architecture)

### 数据安全 (Data Security)

#### 敏感数据处理
- **密码哈希**: bcrypt算法
- **会话安全**: HttpOnly cookies
- **HTTPS强制**: 生产环境TLS加密

#### 输入验证
```typescript
// Zod模式验证
const createUserSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
  email: z.string().email(),
  role: z.enum(['student', 'instructor', 'coordinator', 'admin'])
});
```

### 访问控制 (Access Control)

#### 多层权限验证
1. **路由级权限**: 基于用户角色的路由访问
2. **API级权限**: 接口调用权限验证
3. **数据级权限**: 细粒度数据访问控制
4. **功能级权限**: 特定功能使用权限

#### 审计跟踪 (Audit Trail)
```typescript
// 自动审计日志记录
const auditMiddleware = (action: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const log = {
      userId: req.user?.id,
      action,
      entityType: req.baseUrl.split('/').pop(),
      entityId: req.params.id,
      timestamp: new Date(),
      ip: req.ip,
      userAgent: req.get('User-Agent')
    };
    
    await storage.logActivity(log);
    next();
  };
};
```

## 部署架构 (Deployment Architecture)

### 开发环境 (Development Environment)
- **Replit**: 云端开发环境
- **热重载**: 实时代码更新
- **内存数据库**: 快速开发测试

### 生产环境建议 (Production Recommendations)

#### 应用服务器
- **PM2**: Node.js进程管理
- **集群模式**: 多进程负载均衡
- **自动重启**: 故障恢复机制

#### 数据库部署
- **主从复制**: 读写分离
- **连接池**: 数据库连接优化
- **备份策略**: 定期数据备份

#### 监控和日志
- **Winston**: 结构化日志记录
- **Prometheus**: 性能指标收集
- **Grafana**: 可视化监控面板

## 性能优化 (Performance Optimization)

### 前端优化 (Frontend Optimization)

#### 代码分割
```typescript
// 路由级代码分割
const AdminDashboard = lazy(() => import('./pages/admin-dashboard'));
const CoordinatorDashboard = lazy(() => import('./pages/coordinator-dashboard'));
```

#### 缓存策略
- **React Query缓存**: 智能数据缓存
- **浏览器缓存**: 静态资源缓存
- **Service Worker**: 离线功能支持

### 后端优化 (Backend Optimization)

#### 数据库优化
- **查询优化**: 减少N+1查询问题
- **索引优化**: 提高查询性能
- **连接池**: 优化数据库连接

#### API优化
- **数据分页**: 大数据集分页处理
- **字段选择**: 只返回必要字段
- **批量操作**: 减少API调用次数

## 可扩展性设计 (Scalability Design)

### 水平扩展 (Horizontal Scaling)
- **无状态应用**: 支持多实例部署
- **负载均衡**: 请求分发策略
- **微服务架构**: 服务独立扩展

### 数据扩展 (Data Scaling)
- **读写分离**: 数据库负载分担
- **分库分表**: 大数据量处理
- **缓存层**: Redis缓存策略

## 维护和监控 (Maintenance & Monitoring)

### 健康检查 (Health Checks)
```typescript
// 应用健康检查端点
app.get('/health', async (req, res) => {
  const checks = {
    database: await checkDatabaseConnection(),
    memory: process.memoryUsage(),
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  };
  
  res.json(checks);
});
```

### 错误处理 (Error Handling)
- **全局错误捕获**: 统一错误处理
- **错误日志**: 详细错误记录
- **用户友好错误**: 清晰的错误提示

### 备份恢复 (Backup & Recovery)
- **数据备份**: 定期自动备份
- **增量备份**: 减少备份时间
- **恢复测试**: 定期恢复验证

---

该技术架构文档详细描述了数字医疗记录仿真平台的完整技术实现，为开发、部署和维护提供了全面的技术指导。
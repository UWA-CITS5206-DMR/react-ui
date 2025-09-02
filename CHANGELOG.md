# 变更日志 (Changelog)

本文档记录了项目的所有重要变更，按时间倒序排列。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
项目遵循 [语义化版本](https://semver.org/lang/zh-CN/) 规范。

## [2.0.0] - 2024-01-XX

### 重大变更 (Breaking Changes)
- **架构重构**: 从Express + React全栈应用迁移到纯React前端应用
- **API调用方式**: 移除内嵌server层，改为直接调用外部REST API
- **部署方式**: 现在需要独立的后端API服务支持

### 新增 (Added)
- 新增统一的API客户端 (`client/src/lib/api-client.ts`)
  - 使用axios替代原生fetch
  - 完整的TypeScript类型支持
  - 统一的错误处理和响应拦截
  - 支持配置化的API基础URL
- 新增完整的API接口定义
  - 认证API接口
  - 会话管理API接口
  - 患者数据API接口
  - 分组管理API接口
  - 资产管理API接口
  - 管理员API接口
  - 协调员API接口
- 新增环境变量支持
  - `VITE_API_BASE_URL` - 配置外部API服务地址
- 新增文档
  - `API_MIGRATION_README.md` - 架构迁移详细说明
  - `CHANGELOG.md` - 变更日志

### 变更 (Changed)
- 更新npm脚本配置
  - `dev`: `NODE_ENV=development tsx server/index.ts` → `vite`
  - `build`: `vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist` → `vite build`
  - `start`: `NODE_ENV=production node dist/index.js` → 移除 (现在是纯静态应用)
  - 新增 `preview`: `vite preview` - 预览构建结果
- 更新QueryClient配置 (`client/src/lib/queryClient.ts`)
  - 使用axios替代fetch进行HTTP请求
  - 改进错误处理机制
  - 保持向后兼容的查询键格式
- 更新所有API调用组件
  - `hooks/use-auth.tsx` - 登录API调用
  - `pages/group-manager.tsx` - 资产可见性管理API
  - `pages/coordinator-dashboard.tsx` - 协调员功能API
  - `pages/admin-dashboard.tsx` - 管理员功能API
  - `components/soap-notes-form.tsx` - SOAP笔记创建API
  - `components/orders-form.tsx` - 医嘱创建API
  - `components/instructor-controls.tsx` - 教师控制API

### 移除 (Removed)
- 移除整个server层架构
  - 删除 `server/` 目录及所有文件
    - `server/index.ts` - Express服务器入口
    - `server/routes.ts` - API路由定义
    - `server/db.ts` - 数据库连接
    - `server/storage.ts` - 数据存储层
    - `server/groupMiddleware.ts` - 分组中间件
    - `server/vite.ts` - Vite开发服务器配置
- 移除server相关依赖包
  - `express` - Web框架
  - `express-session` - 会话管理
  - `connect-pg-simple` - PostgreSQL会话存储
  - `passport` - 认证中间件
  - `passport-local` - 本地认证策略
  - `ws` - WebSocket支持
  - `memorystore` - 内存会话存储
  - `openid-client` - OpenID Connect客户端
  - `esbuild` - 服务器端构建工具
- 移除server相关类型定义
  - `@types/express`
  - `@types/express-session`
  - `@types/connect-pg-simple`
  - `@types/passport`
  - `@types/passport-local`
  - `@types/ws`

### 依赖变更 (Dependencies)
#### 新增依赖
- `axios@^1.6.2` - HTTP客户端库

#### 移除依赖
- `express@^4.21.2`
- `express-session@^1.18.1`
- `connect-pg-simple@^10.0.0`
- `passport@^0.7.0`
- `passport-local@^1.0.0`
- `ws@^8.18.0`
- `memorystore@^1.6.7`
- `openid-client@^6.6.3`
- `esbuild@^0.25.0`
- `@types/express@4.17.21`
- `@types/express-session@^1.18.0`
- `@types/connect-pg-simple@^7.0.3`
- `@types/passport@^1.0.16`
- `@types/passport-local@^1.0.38`
- `@types/ws@^8.5.13`

### 技术细节 (Technical Details)

#### API客户端设计
```typescript
// 基础配置
const apiClient = axios.create({
  baseURL: process.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => { console.error('API Error:', error); throw error; }
);
```

#### 模块化API接口
- `api.auth.*` - 认证相关
- `api.sessions.*` - 会话管理
- `api.patients.*` - 患者数据
- `api.groups.*` - 分组管理
- `api.assets.*` - 资产管理
- `api.admin.*` - 系统管理
- `api.coordinator.*` - 协调员功能

#### 查询客户端更新
- 保持原有查询键格式不变
- 底层HTTP实现从fetch迁移到axios
- 改进401错误处理机制

### 迁移指南 (Migration Guide)

#### 对于开发者
1. **环境配置**: 设置 `VITE_API_BASE_URL` 环境变量
2. **API服务**: 需要实现符合规范的外部REST API服务
3. **开发启动**: 使用 `npm run dev` 替代原来的服务器启动
4. **构建部署**: 使用 `npm run build` 生成静态文件

#### 对于运维
1. **服务分离**: 前端现在是纯静态应用，需要独立部署
2. **API服务**: 需要部署独立的后端API服务
3. **CORS配置**: 确保API服务正确配置CORS
4. **环境变量**: 在生产环境正确设置API地址

#### 破坏性变更
- 不再包含内嵌的Express服务器
- 需要外部API服务支持所有原有功能
- 认证机制可能需要调整
- 数据库操作现在通过API服务处理

### 后续计划 (Future Plans)
- 考虑添加API请求缓存机制
- 优化错误处理和重试策略
- 添加API响应时间监控
- 考虑支持GraphQL API

### 感谢 (Acknowledgments)
感谢所有参与此次架构重构的开发者和测试人员。

---

## 版本说明

### [1.x.x] - 历史版本
保留了Express + React全栈架构的所有历史版本，包含内嵌server层。

---

**注意**: 此版本包含破坏性变更，升级前请仔细阅读迁移指南。

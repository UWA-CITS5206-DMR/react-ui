# API架构迁移说明

## 概述

本项目已成功从内嵌的Express server架构迁移到直接调用外部REST API的架构。这种改变使前端应用更加轻量化，并提高了与后端服务的解耦程度。

## 主要变化

### 1. 移除了Server层
- 删除了整个 `server/` 目录
- 移除了Express.js相关依赖
- 移除了数据库连接和中间件

### 2. 新增了统一的API客户端
- 创建了 `client/src/lib/api-client.ts` 
- 使用axios替代fetch进行HTTP请求
- 提供了完整的类型化API接口

### 3. 更新了项目脚本
```json
{
  "dev": "vite",           // 替代: "NODE_ENV=development tsx server/index.ts"
  "build": "vite build",   // 替代: "vite build && esbuild server/index.ts ..."
  "preview": "vite preview" // 新增: 用于预览构建结果
}
```

## API客户端架构

### 基础配置
```typescript
const apiClient = axios.create({
  baseURL: process.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});
```

### API模块组织
```typescript
export const api = {
  auth: { ... },           // 认证相关API
  sessions: { ... },       // 会话管理API
  patients: { ... },       // 患者数据API
  groups: { ... },         // 分组管理API
  assets: { ... },         // 资产管理API
  admin: { ... },          // 系统管理API
  coordinator: { ... },    // 协调员API
};
```

## 环境配置

### 开发环境
需要设置环境变量 `VITE_API_BASE_URL` 来指定外部API服务的地址：

```bash
# .env.local
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

### 生产环境
```bash
# .env.production
VITE_API_BASE_URL=https://api.yourdomain.com/v1
```

## 迁移后的API调用示例

### 之前 (使用内部server)
```typescript
const response = await fetch("/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username, password }),
});
```

### 现在 (使用API客户端)
```typescript
const { user } = await api.auth.login(username, password);
```

## 需要的外部API服务

项目现在依赖一个外部的REST API服务，该服务需要提供以下端点：

### 认证 API
- `POST /auth/login` - 用户登录

### 会话管理 API
- `GET /sessions/instructor/:id` - 获取教师会话
- `GET /sessions/:id` - 获取会话详情
- `GET /sessions/:id/patients` - 获取会话患者
- `GET /sessions/:id/groups` - 获取会话分组
- `POST /sessions/:id/groups` - 创建分组

### 患者数据 API
- `GET /patients/:id` - 获取患者信息
- `PATCH /patients/:id` - 更新患者信息
- `GET /patients/:id/vitals` - 获取生命体征
- `GET /patients/:id/labs` - 获取检验结果
- `POST /patients/:id/soap-notes` - 创建SOAP笔记
- `POST /patients/:id/orders` - 创建医嘱

### 管理员 API
- `GET /admin/users` - 获取所有用户
- `POST /admin/users` - 创建用户
- `PUT /admin/users/:id` - 更新用户
- `DELETE /admin/users/:id` - 删除用户

更多API端点详见 `client/src/lib/api-client.ts` 文件。

## 部署说明

### 开发部署
1. 启动外部API服务 (端口8000)
2. 设置环境变量 `VITE_API_BASE_URL=http://localhost:8000/api/v1`
3. 运行 `npm run dev`

### 生产部署
1. 确保外部API服务可访问
2. 设置正确的 `VITE_API_BASE_URL` 环境变量
3. 运行 `npm run build`
4. 部署 `dist/` 目录到静态文件服务器

## 优势

1. **解耦**: 前端和后端完全分离，可以独立开发和部署
2. **轻量**: 移除了Express server，减少了依赖和复杂性
3. **灵活**: 可以轻松切换不同的后端API服务
4. **类型安全**: 完全类型化的API客户端
5. **统一**: 所有API调用通过统一的客户端进行

## 注意事项

1. 需要确保外部API服务支持CORS
2. 认证机制可能需要调整（当前使用cookies）
3. 错误处理和重试机制已集成到API客户端中
4. 所有原有的API端点都需要在外部服务中实现

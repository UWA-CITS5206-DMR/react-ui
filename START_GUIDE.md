# 🚀 项目启动指南

本项目提供了一个便捷的启动脚本 `.start.sh` 来管理项目的各种操作。

## 📋 快速开始

### 1. 基础使用

```bash
# 查看帮助信息
./start.sh help

# 查看项目状态
./start.sh status

# 安装依赖
./start.sh install

# 启动开发服务器
./start.sh dev

# 构建项目
./start.sh build

# 预览构建结果
./start.sh preview
```

### 2. 开发模式

```bash
# 启动开发服务器（默认端口5173）
./start.sh dev

# 指定API地址和端口
./start.sh dev --api-url http://api.example.com --port 3000

# 自动打开浏览器
./start.sh dev --open

# 使用HTTPS
./start.sh dev --https

# 指定主机（允许外部访问）
./start.sh dev --host 0.0.0.0
```

### 3. 构建和部署

```bash
# 普通构建
./start.sh build

# 生产环境构建
./start.sh build --production

# 预览构建结果
./start.sh preview

# 指定预览端口
./start.sh preview --port 4173
```

### 4. 项目维护

```bash
# 类型检查
./start.sh check

# 清理构建文件
./start.sh clean

# 初始化数据库
./start.sh db:init

# 打开数据库管理界面
./start.sh db:studio
```

## 🔧 环境配置

### 环境变量

创建 `.env.local` 文件设置环境变量：

```bash
# API基础URL (注意：必须以VITE_开头)
VITE_API_BASE_URL=http://localhost:8000/api/v1

# API日志级别 (true|false|detailed)
VITE_API_LOGGING=detailed

# 开发服务器端口
PORT=5173

# 开发服务器主机
HOST=localhost
```

⚠️ **重要**: 
- 前端环境变量必须以 `VITE_` 开头才能在浏览器中访问
- 使用 `import.meta.env.VITE_API_BASE_URL` 而不是 `process.env.VITE_API_BASE_URL`

### API日志配置

控制API请求和响应的日志输出：

- `VITE_API_LOGGING=true` - 启用简洁日志（默认）
- `VITE_API_LOGGING=detailed` - 启用详细日志（包含请求体、响应体、请求头等）
- `VITE_API_LOGGING=false` - 禁用所有API日志

### 命令行选项

| 选项 | 说明 | 示例 |
|------|------|------|
| `--api-url URL` | 设置API基础URL | `--api-url http://api.example.com` |
| `--port PORT` | 设置服务器端口 | `--port 3000` |
| `--host HOST` | 设置服务器主机 | `--host 0.0.0.0` |
| `--open` | 自动打开浏览器 | `--open` |
| `--https` | 使用HTTPS | `--https` |
| `--verbose` | 显示详细信息 | `--verbose` |
| `--production` | 生产模式构建 | `--production` |
| `--api-logging LEVEL` | 设置API日志级别 | `--api-logging detailed` |

## 📖 命令详解

### 开发命令

- **`dev` / `d`**: 启动Vite开发服务器，支持热重载
- **`build` / `b`**: 构建生产版本到 `dist/` 目录
- **`preview` / `p`**: 预览构建结果，模拟生产环境

### 管理命令

- **`install` / `i`**: 安装项目依赖包
- **`clean` / `c`**: 清理构建文件和缓存
- **`check` / `t`**: 运行TypeScript类型检查
- **`status` / `s`**: 显示项目状态和环境信息

### 数据库命令

- **`db:init`**: 初始化数据库结构
- **`db:studio`**: 打开Drizzle Studio数据库管理界面

### 帮助命令

- **`help` / `h`**: 显示完整的帮助信息

## 💡 使用技巧

### 1. 开发环境设置

```bash
# 一次性设置开发环境
export VITE_API_BASE_URL="http://localhost:8000/api/v1"
export PORT="3000"

# 启动开发服务器
./start.sh dev --open
```

### 2. 生产构建流程

```bash
# 完整的生产构建流程
./start.sh clean          # 清理旧文件
./start.sh check          # 类型检查
./start.sh build --production  # 生产构建
./start.sh preview        # 预览结果
```

### 3. 多环境切换

```bash
# 开发环境
./start.sh dev --api-url http://localhost:8000/api/v1

# 测试环境
./start.sh dev --api-url http://test-api.example.com/v1

# 预生产环境
./start.sh dev --api-url http://staging-api.example.com/v1
```

### 4. API日志调试

```bash
# 启用详细API日志
./start.sh dev --api-logging detailed

# 禁用API日志（生产模式）
./start.sh dev --api-logging false

# 简洁日志模式
./start.sh dev --api-logging true
```

### 5. Mock模式开发

```bash
# 启用Mock模式 (无需后端API)
./start.sh dev --mock

# Mock模式 + 详细日志
./start.sh dev --mock --api-logging detailed

# 自定义Mock延迟和错误率
./start.sh dev --mock --mock-delay 200-1000 --mock-error-rate 0.05

# 快速响应Mock (适合开发)
./start.sh dev --mock --mock-delay 50-200

# 慢网络Mock (适合测试)
./start.sh dev --mock --mock-delay 1000-3000
```

## ⚠️ 注意事项

1. **Node.js版本**: 建议使用 Node.js 16+ 版本
2. **API服务**: 确保外部API服务正在运行 (真实API模式)
3. **Mock模式**: 使用 `--mock` 参数可在无后端情况下开发测试
4. **CORS配置**: API服务需要正确配置CORS (真实API模式)
5. **环境变量**: 生产环境需要设置正确的API地址
6. **端口冲突**: 如果默认端口被占用，使用 `--port` 指定其他端口

## 🔍 故障排除

### 常见问题

1. **依赖安装失败**
   ```bash
   # 清理npm缓存
   npm cache clean --force
   
   # 重新安装
   ./start.sh install
   ```

2. **端口被占用**
   ```bash
   # 使用不同端口
   ./start.sh dev --port 3001
   ```

3. **API连接失败**
   ```bash
   # 检查API地址
   ./start.sh status
   
   # 设置正确的API地址
   ./start.sh dev --api-url http://correct-api-url.com
   ```

4. **构建失败**
   ```bash
   # 运行类型检查
   ./start.sh check
   
   # 清理后重新构建
   ./start.sh clean
   ./start.sh build
   ```

## 📚 更多信息

- 查看 `API_MIGRATION_README.md` 了解架构迁移详情
- 查看 `CHANGELOG.md` 了解版本变更信息
- 查看 `MOCK_MODE_GUIDE.md` 了解Mock模式详细用法
- 查看 `API_LOGGING_GUIDE.md` 了解API日志功能
- 运行 `./start.sh help` 查看完整命令选项

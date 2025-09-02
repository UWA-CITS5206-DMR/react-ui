# 🛠️ 故障排除指南

## 常见问题及解决方案

### 1. 🚨 `process is not defined` 错误

#### 问题描述
```
[plugin:runtime-error-plugin] process is not defined
/Users/li/go/src/github.com/react-ui/client/src/lib/api-client.ts:26:12
24 |  // 创建axios实例
25 |  const apiClient = axios.create({
26 |    baseURL: process.env.VITE_API_BASE_URL || '/api',
   |             ^
```

#### 原因分析
在Vite构建的前端应用中，`process.env` 在浏览器环境中不可用。Vite使用 `import.meta.env` 来访问环境变量。

#### 解决方案
✅ **已修复**: 使用 `import.meta.env` 替代 `process.env`

```typescript
// ❌ 错误写法
baseURL: process.env.VITE_API_BASE_URL || '/api',

// ✅ 正确写法  
baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
```

#### 类型定义
已添加 `client/src/vite-env.d.ts` 文件提供TypeScript类型支持：

```typescript
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
}
```

### 2. 🚨 `vite: command not found` 错误

#### 问题描述
```
sh: vite: command not found
```

#### 原因分析
1. `node_modules` 目录损坏或不完整
2. `.bin` 目录缺失
3. npm安装过程中断或失败

#### 解决方案
```bash
# 1. 清理并重新安装依赖
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

# 2. 验证安装
ls -la node_modules/.bin/vite

# 3. 测试运行
npm run dev
```

### 3. 🚨 API连接错误

#### 问题描述
- API请求失败
- CORS错误
- 网络连接超时

#### 解决方案

##### 设置正确的API地址
```bash
# 方法1: 环境变量
export VITE_API_BASE_URL=http://localhost:8000/api/v1
npm run dev

# 方法2: 使用启动脚本
./start.sh dev --api-url http://localhost:8000/api/v1

# 方法3: .env.local文件
echo "VITE_API_BASE_URL=http://localhost:8000/api/v1" > .env.local
```

##### 检查API服务状态
```bash
# 检查API服务是否运行
curl http://localhost:8000/api/v1/health

# 检查项目配置
./start.sh status
```

### 4. 🚨 端口冲突

#### 问题描述
```
Port 5173 is already in use
```

#### 解决方案
```bash
# 使用不同端口
./start.sh dev --port 3000

# 或者杀死占用端口的进程
lsof -ti:5173 | xargs kill -9
```

### 5. 🚨 TypeScript类型错误

#### 问题描述
- 类型定义缺失
- 导入路径错误
- 接口类型不匹配

#### 解决方案
```bash
# 运行类型检查
./start.sh check

# 如果TypeScript未安装
npm install -g typescript

# 清理并重建
./start.sh clean
./start.sh build
```

### 6. 🚨 依赖版本冲突

#### 问题描述
- 包版本不兼容
- 依赖解析失败
- 安全漏洞警告

#### 解决方案
```bash
# 查看依赖树
npm ls

# 更新依赖
npm update

# 修复安全漏洞
npm audit fix

# 强制修复（可能有破坏性变更）
npm audit fix --force
```

### 7. 🚨 构建失败

#### 问题描述
- 构建过程中断
- 内存不足
- 文件路径错误

#### 解决方案
```bash
# 增加Node.js内存限制
export NODE_OPTIONS="--max-old-space-size=4096"

# 清理后重新构建
./start.sh clean
./start.sh build

# 详细构建日志
./start.sh build --verbose
```

## 📋 诊断命令

### 快速诊断
```bash
# 检查项目状态
./start.sh status

# 检查Node.js和npm版本
node --version
npm --version

# 检查Vite安装
ls -la node_modules/.bin/vite

# 检查环境变量
env | grep VITE
```

### 深度诊断
```bash
# 检查包完整性
npm ls --depth=0

# 检查配置文件
cat package.json | jq '.scripts'
cat vite.config.ts

# 检查网络连接
ping google.com
curl -I http://localhost:8000
```

## 🆘 获取帮助

### 项目相关
- 查看启动脚本帮助: `./start.sh help`
- 查看架构文档: `API_MIGRATION_README.md`
- 查看变更日志: `CHANGELOG.md`

### 外部资源
- [Vite官方文档](https://vitejs.dev/)
- [React官方文档](https://react.dev/)
- [Axios文档](https://axios-http.com/)

### 社区支持
- GitHub Issues
- Stack Overflow
- Discord/Slack社区

## 📝 报告问题

如果遇到此文档未涵盖的问题，请提供以下信息：

1. **错误信息**: 完整的错误消息和堆栈跟踪
2. **环境信息**: 
   ```bash
   node --version
   npm --version
   ./start.sh status
   ```
3. **重现步骤**: 详细的操作步骤
4. **配置信息**: 相关的配置文件内容
5. **日志信息**: 完整的终端输出

---

💡 **提示**: 大多数问题都可以通过重新安装依赖来解决：
```bash
rm -rf node_modules package-lock.json
npm cache clean --force  
npm install
```

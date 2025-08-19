# 数据库设置说明

本项目已经从 Neon PostgreSQL 数据库切换为本地 SQLite 数据库。

## 快速开始

1. **安装依赖**
   ```bash
   npm install
   ```

2. **初始化数据库**
   ```bash
   npm run db:init
   ```

3. **创建数据库表**
   ```bash
   npm run db:push
   ```

4. **启动开发服务器**
   ```bash
   npm run dev
   ```

## 数据库管理命令

- `npm run db:init` - 初始化数据库连接并显示设置信息
- `npm run db:generate` - 生成数据库迁移文件
- `npm run db:push` - 推送 schema 更改到数据库（开发环境）
- `npm run db:studio` - 启动 Drizzle Studio 可视化界面
- `npm run db:migrate` - 运行数据库迁移（生产环境）

## 数据库文件位置

- 数据库文件：`data/medisim.db`
- WAL 文件：`data/medisim.db-wal`
- 共享内存文件：`data/medisim.db-shm`

## 重要说明

1. **数据库文件被 gitignore**：`data/` 目录已添加到 `.gitignore`，不会被提交到版本控制
2. **自动创建目录**：应用启动时会自动创建 `data/` 目录
3. **WAL 模式**：数据库配置为 WAL（Write-Ahead Logging）模式以提高性能
4. **开发环境**：使用 `db:push` 命令直接同步 schema
5. **生产环境**：使用 `db:generate` 和 `db:migrate` 进行版本化迁移

## 数据库可视化

使用 Drizzle Studio 查看和管理数据库：

```bash
npm run db:studio
```

这将在浏览器中打开一个可视化界面来查看表结构和数据。

## 迁移说明

### 从 PostgreSQL 迁移的主要变更

1. **UUID 替换**：PostgreSQL 的 `gen_random_uuid()` 替换为 SQLite 的 `randomblob(16)` 的十六进制表示
2. **时间戳**：`timestamp` 类型替换为 `integer` 类型并使用 `unixepoch()` 函数
3. **布尔值**：`boolean` 类型替换为 `integer` 类型（0/1）
4. **JSON 字段**：`jsonb` 类型替换为 `text` 类型存储 JSON 字符串
5. **数据类型**：
   - `varchar` → `text`
   - `timestamp` → `integer` with `mode: 'timestamp'`
   - `boolean` → `integer` with `mode: 'boolean'`
   - `jsonb` → `text`

### 数据迁移（如果需要）

如果您有现有的 PostgreSQL 数据需要迁移到 SQLite，您需要：

1. 导出 PostgreSQL 数据
2. 转换数据格式（特别是时间戳和 JSON 字段）
3. 导入到新的 SQLite 数据库

建议为大量数据迁移编写专门的迁移脚本。

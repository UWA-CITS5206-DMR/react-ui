# 项目复制指南

本指南提供了多种复制 MediSim 项目的方法。

## 🚀 快速复制（推荐）

### 使用自动化脚本

```bash
# 复制到上级目录，名称为 MediSimv1-copy
./scripts/copy-project.sh

# 复制到指定目录
./scripts/copy-project.sh /path/to/destination

# 复制到指定目录并重命名
./scripts/copy-project.sh /path/to/destination MyNewProject
```

## 📋 手动复制方法

### 方法 1：复制到同级目录

```bash
# 进入上级目录
cd ..

# 复制整个项目
cp -r MediSimv1 MediSimv1-copy

# 进入复制的项目
cd MediSimv1-copy
```

### 方法 2：复制到指定目录

```bash
# 复制到指定路径
cp -r /Users/li/Downloads/MediSimv1 /path/to/destination/MyNewProject

# 或者使用当前目录变量
cp -r $(pwd) /path/to/destination/MyNewProject
```

### 方法 3：使用 rsync（更高级）

```bash
# 同步复制（排除某些文件）
rsync -av --exclude='node_modules' --exclude='data' --exclude='.git' \
  /Users/li/Downloads/MediSimv1/ /path/to/destination/MyNewProject/
```

## 🧹 复制后的清理工作

### 1. 基本清理

```bash
cd /path/to/copied/project

# 删除 node_modules
rm -rf node_modules

# 删除数据库文件
rm -rf data

# 删除构建文件
rm -rf dist

# 删除锁定文件
rm -f package-lock.json
```

### 2. Git 历史处理

```bash
# 选项 A: 完全移除 Git 历史
rm -rf .git

# 选项 B: 重新初始化 Git
rm -rf .git
git init
git add .
git commit -m "Initial commit"

# 选项 C: 保持现有 Git 历史（如果需要的话）
# 不做任何操作
```

### 3. 更新项目配置

```bash
# 更新 package.json 中的项目名称
# 方法 A: 使用 jq (如果已安装)
jq '.name = "new-project-name"' package.json > package.json.tmp && mv package.json.tmp package.json

# 方法 B: 手动编辑
nano package.json  # 修改 "name" 字段
```

## ⚙️ 复制后的初始化

### 1. 安装依赖

```bash
npm install
```

### 2. 设置数据库

```bash
# 初始化数据库
npm run db:init

# 创建数据库表
npm run db:push
```

### 3. 配置环境变量

```bash
# 创建新的 .env 文件
echo "PORT=3001" > .env  # 使用不同端口避免冲突
```

### 4. 启动项目

```bash
npm run dev
```

## 📁 常用复制场景

### 场景 1：创建开发副本

```bash
# 在同级目录创建开发副本
cd ..
cp -r MediSimv1 MediSimv1-dev
cd MediSimv1-dev

# 清理和初始化
rm -rf node_modules data
echo "PORT=3001" > .env
npm install
npm run db:init
npm run db:push
```

### 场景 2：创建生产环境副本

```bash
# 复制到生产目录
sudo cp -r MediSimv1 /var/www/medisim-prod
cd /var/www/medisim-prod

# 生产环境配置
rm -rf node_modules data .git
echo "PORT=80" > .env
echo "NODE_ENV=production" >> .env
npm install --production
npm run db:init
npm run db:push
```

### 场景 3：创建功能分支副本

```bash
# 复制用于开发新功能
cp -r MediSimv1 MediSimv1-feature-auth
cd MediSimv1-feature-auth

# 保留 Git 历史但创建新分支
git checkout -b feature/authentication
echo "PORT=3002" > .env
npm install
npm run db:init
npm run db:push
```

## 🚨 注意事项

### 复制前检查

1. **磁盘空间**: 确保目标位置有足够空间
2. **权限**: 确保对目标目录有写权限
3. **端口冲突**: 使用不同端口避免冲突

### 排除文件（可选）

复制时可以排除以下文件/目录：

```bash
# 使用 rsync 排除特定文件
rsync -av \
  --exclude='node_modules' \
  --exclude='data' \
  --exclude='dist' \
  --exclude='.git' \
  --exclude='package-lock.json' \
  --exclude='.env' \
  MediSimv1/ /path/to/destination/
```

### 常见问题

1. **端口冲突**: 修改 `.env` 文件中的端口
2. **数据库问题**: 重新运行 `npm run db:init` 和 `npm run db:push`
3. **权限错误**: 使用 `sudo` 或检查目录权限
4. **依赖问题**: 删除 `node_modules` 重新 `npm install`

## 📝 复制检查清单

- [ ] 项目文件完整复制
- [ ] 删除或重新初始化 Git 历史
- [ ] 清理 node_modules 和 data 目录
- [ ] 更新 package.json 项目名称
- [ ] 设置新的环境变量（端口等）
- [ ] 安装依赖 `npm install`
- [ ] 初始化数据库 `npm run db:init && npm run db:push`
- [ ] 测试运行 `npm run dev`
- [ ] 验证功能正常

使用自动化脚本 `./scripts/copy-project.sh` 可以自动完成大部分步骤！

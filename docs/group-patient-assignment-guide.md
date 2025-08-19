# 组别患者分配配置指南

## 在哪里分配患者给组

### 1. 系统管理员Dashboard（主要配置界面）

**访问路径：**
1. 使用`admin`/`password`登录系统
2. 选择"System Administrator"角色
3. 进入Admin Dashboard页面

**功能位置：**
- **组管理**：在"Groups Management"部分
- **患者分配**：在"Data Version & Patient Assignment"部分
- **用户管理**：在"User Management"部分

### 2. 具体操作步骤

#### 步骤1：创建或管理组
```
位置：Admin Dashboard → Groups Management
操作：
- 点击"Create New Group"创建新组
- 填写组名称（如"护理班A"）
- 设置组描述和所属会话
- 保存组信息
```

#### 步骤2：分配患者给组
```
位置：Admin Dashboard → Data Version & Patient Assignment
操作：
- 选择目标组
- 从患者列表中勾选要分配的患者
- 选择数据版本（如果有多个版本）
- 点击"Assign to Group"保存分配
```

#### 步骤3：添加组成员
```
位置：Admin Dashboard → Groups Management → 组详情
操作：
- 进入特定组的详情页面
- 在"Members"部分点击"Add Member"
- 选择用户并设置角色（Student/Instructor）
- 确认添加
```

### 3. 当前系统的患者分配状态

**默认配置：**
- 所有患者目前对所有用户开放访问
- 患者Jane Mitchell已配置完整的医疗数据
- 支持SOAP笔记创建和查看

**已实现的隔离机制：**
- 数据库表结构支持组级隔离
- 中间件代码已准备就绪
- 前端界面支持组管理功能

### 4. 启用数据隔离的步骤

如果要启用完整的数据隔离功能：

1. **激活中间件**
   ```typescript
   // 在server/routes.ts中重新应用中间件
   app.get("/api/sessions/:sessionId/patients", 
     groupAccessMiddleware, 
     async (req, res) => { ... }
   );
   ```

2. **配置组分配**
   - 进入Admin Dashboard
   - 为每个组分配特定患者
   - 添加组成员

3. **测试隔离效果**
   - 使用不同组的用户登录
   - 验证只能看到分配给其组的患者
   - 确认SOAP笔记只显示同组成员的记录

### 5. 示例配置场景

#### 场景一：两个护理班级
```
组1：护理班A
- 成员：student1, student2, instructor1
- 分配患者：Patient-1 (心血管急症)
- 数据版本：v1.0-basic

组2：护理班B  
- 成员：student3, student4, instructor2
- 分配患者：Patient-2 (呼吸系统疾病)
- 数据版本：v1.1-advanced
```

#### 场景二：同一患者的不同难度版本
```
组1：初级组
- 患者：Jane Mitchell
- 数据版本：基础版（部分实验室结果）

组2：高级组
- 患者：Jane Mitchell  
- 数据版本：完整版（所有诊断数据）
```

### 6. 数据隔离的好处

1. **教学独立性**：不同班级可以独立进行教学
2. **进度控制**：教师可以控制每组的学习进度
3. **评估公平**：防止学生间相互查看答案
4. **个性化教学**：根据组别调整患者数据难度
5. **多租户支持**：支持多个院校同时使用

### 7. 技术实现细节

**数据库表结构：**
- `groups`：存储组信息
- `group_members`：存储组成员关系
- `group_data_assignments`：存储患者分配关系
- `data_versions`：存储数据版本信息

**API端点：**
- `GET /api/groups` - 获取所有组
- `POST /api/groups` - 创建新组
- `POST /api/groups/{id}/members` - 添加组成员
- `POST /api/groups/{id}/data-assignments` - 分配患者

**前端界面：**
- Admin Dashboard：系统管理员完整功能
- Group Manager：简化的组管理界面
- 各角色Dashboard：显示对应权限的数据

这种设计确保了教学环境的灵活性和数据安全性，满足不同教学场景的需求。
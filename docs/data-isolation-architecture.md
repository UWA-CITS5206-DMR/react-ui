# 组级数据隔离架构设计

## 概述

数字化医疗记录模拟平台实现了完整的组级数据隔离机制，确保不同组（Group）的用户之间无法访问彼此的数据。这种隔离设计支持多个独立的学习组同时使用同一个平台，而不会互相干扰。

## 为什么需要数据隔离？

在医疗教育环境中，数据隔离至关重要：

1. **教学独立性**：不同班级、学期或课程需要独立的学习环境
2. **评估公平性**：防止学生之间相互查看答案或临床判断
3. **进度控制**：教师可以为不同组设置不同的学习进度和难度
4. **隐私保护**：确保学生的学习记录和表现数据隐私
5. **多租户支持**：同一平台可服务多个学校、院系或班级

## 数据隔离层级

### 1. 用户组成员关系
```sql
-- 用户组成员表
group_members {
  id: varchar (主键)
  groupId: varchar (外键 → groups.id)
  userId: varchar (外键 → users.id)
  joinedAt: timestamp
}
```

### 2. 患者数据分配
```sql
-- 组数据分配表
group_data_assignments {
  id: varchar (主键)
  groupId: varchar (外键 → groups.id)
  dataVersionId: varchar (外键 → data_versions.id)
  patientId: varchar (外键 → patients.id)
  assignedBy: varchar (外键 → users.id)
  assignedAt: timestamp
}
```

### 3. 数据版本控制
```sql
-- 数据版本表
data_versions {
  id: varchar (主键)
  name: text (版本名称)
  description: text (版本描述)
  version: text (版本号)
  sessionId: varchar (外键 → sessions.id)
  createdBy: varchar (外键 → users.id)
  createdAt: timestamp
}
```

## 中间件实现

### 1. 组权限验证中间件 (`groupAccessMiddleware`)

```typescript
// 功能：验证用户是否属于请求的组
// 应用：所有需要组权限验证的路由

app.get("/api/sessions/:sessionId/patients", groupAccessMiddleware, ...)
```

**作用机制：**
- 从用户会话中获取用户ID
- 查询用户所属的所有组
- 验证用户是否有权访问请求的组
- 设置 `req.activeGroupId` 为用户的活动组

### 2. 患者数据访问控制中间件 (`patientAccessMiddleware`)

```typescript
// 功能：确保用户只能访问其组分配的患者数据
// 应用：所有患者相关的API路由

app.get("/api/patients/:patientId/soap-notes", 
  groupAccessMiddleware, 
  patientAccessMiddleware, 
  ...)
```

**作用机制：**
- 检查用户组是否有权访问指定患者
- 通过 `group_data_assignments` 表验证权限
- 阻止跨组的患者数据访问

### 3. 组数据隔离中间件 (`groupDataIsolationMiddleware`)

```typescript
// 功能：为SOAP笔记、医嘱等数据提供组级过滤
// 应用：需要显示历史记录的API路由

app.get("/api/patients/:patientId/soap-notes", 
  groupAccessMiddleware, 
  patientAccessMiddleware,
  async (req, res) => {
    // 只显示同组用户创建的SOAP笔记
    const groupMembers = await storage.getGroupMembers(req.activeGroupId);
    const groupUserIds = groupMembers.map(member => member.userId);
    notes = notes.filter(note => groupUserIds.includes(note.authorId));
  })
```

## 如何配置组别患者分配

### 1. 系统管理员界面

在系统管理员Dashboard中，可以进行以下操作：

**组管理功能：**
- 创建新的学习组（班级、小组等）
- 为组分配数据版本
- 管理组成员

**患者分配功能：**
- 选择特定的组
- 从患者列表中选择要分配的患者
- 设置数据版本（不同版本可以有不同的患者数据）

### 2. 分配流程示例

```typescript
// 1. 创建组
POST /api/groups
{
  "name": "护理班A",
  "description": "2025春季护理班级A组",
  "sessionId": "session-1"
}

// 2. 添加组成员
POST /api/groups/{groupId}/members
{
  "userId": "student-1",
  "role": "member"
}

// 3. 分配患者给组
POST /api/groups/{groupId}/data-assignments
{
  "patientId": "patient-1",
  "dataVersionId": "version-1"
}
```

### 3. 在管理界面中的操作

**步骤1：进入系统管理员Dashboard**
- 以admin身份登录
- 进入"组管理"页面

**步骤2：创建或选择组**
- 点击"创建新组"或选择现有组
- 设置组名称和描述

**步骤3：分配患者**
- 在组详情页面，找到"患者分配"部分
- 勾选要分配给该组的患者
- 选择数据版本（可选）
- 点击"保存分配"

**步骤4：管理组成员**
- 在"组成员"部分添加学生和教师
- 设置每个成员的角色权限

### 4. 数据版本控制

**版本作用：**
- 不同组可以使用相同患者的不同数据版本
- 支持A/B测试和渐进式难度调整
- 历史版本保留用于复习和对比

**版本管理：**
```typescript
// 创建数据版本
POST /api/data-versions
{
  "name": "心血管急症v1.0",
  "description": "包含基础生命体征和实验室结果",
  "sessionId": "session-1"
}

// 分配版本给组
POST /api/groups/{groupId}/data-assignments
{
  "patientId": "patient-1",
  "dataVersionId": "cardio-v1.0"
}
```

## 数据隔离的具体实现

### 1. 患者列表隔离

**实现原理：**
患者通过 `group_data_assignments` 表分配给特定组，用户只能看到分配给其所属组的患者。

```typescript
// GET /api/sessions/:sessionId/patients
// 应用中间件：groupAccessMiddleware

app.get("/api/sessions/:sessionId/patients", groupAccessMiddleware, async (req, res) => {
  const userGroupId = req.activeGroupId;
  
  // 获取分配给用户组的患者
  const groupAssignments = await storage.getGroupDataAssignments(userGroupId);
  const patientIds = groupAssignments.map(assignment => assignment.patientId);
  const allPatients = await storage.getPatientsBySession(sessionId);
  const groupPatients = allPatients.filter(patient => patientIds.includes(patient.id));
  
  res.json(groupPatients);
});
```

**数据流程：**
1. 用户请求患者列表
2. 中间件验证用户组权限
3. 查询该组的数据分配
4. 过滤患者列表，只返回分配给该组的患者

### 2. SOAP笔记隔离

**实现原理：**
SOAP笔记按作者的组成员关系过滤，用户只能看到同组成员创建的临床记录。

```typescript
// GET /api/patients/:patientId/soap-notes
// 应用中间件：groupAccessMiddleware, patientAccessMiddleware

app.get("/api/patients/:patientId/soap-notes", 
  groupAccessMiddleware, 
  patientAccessMiddleware, 
  async (req, res) => {
    const userGroupId = req.activeGroupId;
    
    // 获取所有SOAP笔记
    let notes = await storage.getSoapNotes(patientId);
    
    // 过滤：只显示同组成员创建的笔记
    const groupMembers = await storage.getGroupMembers(userGroupId);
    const groupUserIds = groupMembers.map(member => member.userId);
    notes = notes.filter(note => groupUserIds.includes(note.authorId));
    
    res.json(notes);
  });
```

**数据流程：**
1. 用户请求患者的SOAP笔记
2. 验证用户组权限和患者访问权限
3. 获取用户组的所有成员
4. 过滤SOAP笔记，只显示同组成员的记录

### 3. 医嘱隔离

**实现原理：**
医疗指令按下达者的组成员关系过滤，确保不同组的医疗决策互不可见。

```typescript
// GET /api/patients/:patientId/orders
// 应用相同的组过滤逻辑

const groupMembers = await storage.getGroupMembers(userGroupId);
const groupUserIds = groupMembers.map(member => member.userId);
orders = orders.filter(order => groupUserIds.includes(order.orderedBy));
```

### 4. 会话级别隔离

**实现原理：**
通过session存储用户身份和组信息，每个API请求都会验证用户的组权限。

```typescript
// 在中间件中设置用户组信息
export async function groupAccessMiddleware(req, res, next) {
  const userId = req.session?.user?.id;
  const userGroups = await storage.getUserGroups(userId);
  req.userGroups = userGroups.map(g => g.id);
  req.activeGroupId = req.userGroups[0]; // 设置活动组
  next();
}
```

## 使用场景示例

### 场景：两个护理班级同时使用平台

**班级A（组ID: group-1）:**
- 学生：Alice, Bob, Charlie
- 分配患者：Patient-1 (心肌梗死案例)
- 数据版本：v1.0-cardiac-emergency

**班级B（组ID: group-2）:**
- 学生：David, Eve, Frank
- 分配患者：Patient-2 (呼吸衰竭案例)
- 数据版本：v1.0-respiratory-failure

**隔离效果：**
1. Alice只能看到Patient-1的数据，无法访问Patient-2
2. Alice的SOAP笔记只对Bob和Charlie可见，David看不到
3. 两个班级可以有不同的实验室结果发布时间表
4. 教师可以为每个班级设置不同的难度和进度

### 场景：跨学期数据版本管理

**2024春季学期：**
- 数据版本：v2024-spring
- 患者：更新的生命体征和实验室数值

**2024秋季学期：**
- 数据版本：v2024-fall
- 患者：相同案例但更新的医疗背景

**优势：**
- 教师可以逐步改进案例而不影响正在进行的课程
- 支持A/B测试不同的教学方法
- 历史数据保留用于教学效果分析

## 安全考虑

### 1. 身份验证
- 所有组级API都需要用户认证
- 会话管理确保用户身份的持续验证

### 2. 权限验证
- 多层权限检查：用户→组→患者→数据
- 防止权限提升攻击

### 3. 数据完整性
- 外键约束确保数据关系的完整性
- 审计日志记录所有数据访问和修改

### 4. 错误处理
- 权限不足时返回403而非数据泄露
- 清晰的错误消息帮助调试但不暴露敏感信息

## 系统管理员功能

### 1. 组管理
- 创建和删除学习组
- 管理组成员关系
- 设置组权限和访问级别

### 2. 数据版本管理
- 创建新的数据版本
- 分配数据版本给特定组
- 版本之间的数据迁移

### 3. 审计和监控
- 查看跨组数据访问日志
- 监控用户活动和系统使用情况
- 数据访问模式分析

## 技术优势

1. **可扩展性**：支持无限数量的组和用户
2. **灵活性**：支持复杂的数据分配策略
3. **安全性**：多层权限验证机制
4. **可维护性**：清晰的数据关系和中间件架构
5. **性能**：高效的数据库查询和缓存策略

## 未来扩展

1. **细粒度权限**：支持患者数据的字段级权限控制
2. **时间窗口隔离**：基于时间的数据可见性控制
3. **跨组协作**：支持特定场景下的组间数据共享
4. **自动化管理**：基于学期和课程的自动组管理

这种数据隔离架构确保了多租户环境下的数据安全性和隐私保护，同时提供了灵活的教学场景支持。
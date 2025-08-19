# MediSimv1 UI Mermaid 可视化图表
## UI Visualization with Mermaid Diagrams

---

## 📋 文档概述

本文档包含了MediSimv1数字医疗记录仿真平台的UI可视化图表，使用Mermaid语法绘制，展示了用户界面结构、组件关系、数据流和用户交互流程。

---

## 🎨 UI结构和页面导航图

### 主要页面和功能模块

```mermaid
graph TD
    subgraph Landing["登录页面 Landing Page"]
        L1["用户名输入<br/>Username Input"]
        L2["密码输入<br/>Password Input"]
        L3["登录按钮<br/>Login Button"]
        L4["记住我<br/>Remember Me"]
        L5["错误提示<br/>Error Message"]
    end

    subgraph Admin["管理员仪表板<br/>Admin Dashboard"]
        A1["用户管理<br/>User Management"]
        A2["组管理<br/>Group Management"]
        A3["系统统计<br/>System Statistics"]
        A4["系统配置<br/>System Configuration"]
        A5["数据导出<br/>Data Export"]
    end

    subgraph Coordinator["协调员仪表板<br/>Coordinator Dashboard"]
        C1["文档管理<br/>Document Management"]
        C2["版本控制<br/>Version Control"]
        C3["发布管理<br/>Release Management"]
        C4["活动监控<br/>Activity Monitoring"]
        C5["用户日志<br/>User Logs"]
    end

    subgraph Instructor["教师仪表板<br/>Instructor Dashboard"]
        I1["场景选择<br/>Scenario Selection"]
        I2["场景控制<br/>Scenario Control"]
        I3["学生监控<br/>Student Monitoring"]
        I4["患者概览<br/>Patient Overview"]
        I5["实时反馈<br/>Real-time Feedback"]
    end

    subgraph Student["学生仪表板<br/>Student Dashboard"]
        S1["患者信息<br/>Patient Information"]
        S2["生命体征<br/>Vital Signs"]
        S3["实验室结果<br/>Lab Results"]
        S4["SOAP笔记<br/>SOAP Notes"]
        S5["医嘱下达<br/>Medical Orders"]
        S6["医疗历史<br/>Medical History"]
    end

    subgraph PatientDetails["患者详情页<br/>Patient Details"]
        P1["基本信息<br/>Basic Information"]
        P2["医疗历史详情<br/>Medical History Details"]
        P3["用药记录<br/>Medication Records"]
        P4["过敏信息<br/>Allergy Information"]
        P5["诊断记录<br/>Diagnosis Records"]
    end

    subgraph SOAPEditor["SOAP笔记编辑器<br/>SOAP Notes Editor"]
        SE1["主观资料<br/>Subjective"]
        SE2["客观资料<br/>Objective"]
        SE3["评估<br/>Assessment"]
        SE4["计划<br/>Plan"]
        SE5["保存草稿<br/>Save Draft"]
        SE6["提交记录<br/>Submit Record"]
    end

    subgraph OrdersForm["医嘱表单<br/>Orders Form"]
        O1["药物医嘱<br/>Medication Orders"]
        O2["检查医嘱<br/>Diagnostic Orders"]
        O3["护理医嘱<br/>Nursing Orders"]
        O4["饮食医嘱<br/>Diet Orders"]
        O5["验证提交<br/>Validate & Submit"]
    end

    %% 认证流程
    L3 --> Admin
    L3 --> Coordinator
    L3 --> Instructor
    L3 --> Student

    %% 学生流程
    S1 --> PatientDetails
    S4 --> SOAPEditor
    S5 --> OrdersForm
    S2 --> PatientDetails
    S3 --> PatientDetails
    S6 --> PatientDetails

    %% 教师流程
    I4 --> PatientDetails
    I3 --> Student

    %% 数据流
    PatientDetails --> SOAPEditor
    PatientDetails --> OrdersForm

    %% 样式定义
    classDef landingStyle fill:#e8f5e8,stroke:#388e3c,stroke-width:2px
    classDef adminStyle fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    classDef coordinatorStyle fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    classDef instructorStyle fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    classDef studentStyle fill:#e0f2f1,stroke:#00695c,stroke-width:2px
    classDef patientStyle fill:#fce4ec,stroke:#c2185b,stroke-width:2px
    classDef soapStyle fill:#f1f8e9,stroke:#689f38,stroke-width:2px
    classDef ordersStyle fill:#e8eaf6,stroke:#3f51b5,stroke-width:2px

    class L1,L2,L3,L4,L5 landingStyle
    class A1,A2,A3,A4,A5 adminStyle
    class C1,C2,C3,C4,C5 coordinatorStyle
    class I1,I2,I3,I4,I5 instructorStyle
    class S1,S2,S3,S4,S5,S6 studentStyle
    class P1,P2,P3,P4,P5 patientStyle
    class SE1,SE2,SE3,SE4,SE5,SE6 soapStyle
    class O1,O2,O3,O4,O5 ordersStyle
```

---

## 🏗️ UI组件关系图

### React组件架构和依赖关系

```mermaid
graph TD
    subgraph App["主应用 Main App"]
        AppRoot["App.tsx<br/>应用根组件"]
        GlobalProviders["全局提供者<br/>Global Providers"]
        Router["路由系统<br/>Router System"]
        AuthGuard["认证守卫<br/>Auth Guard"]
    end

    subgraph SharedComponents["共享组件 Shared Components"]
        TopNav["顶部导航<br/>Top Navigation"]
        Sidebar["侧边栏<br/>Sidebar"]
        PatientList["患者列表<br/>Patient List"]
        PatientCard["患者卡片<br/>Patient Card"]
        NotificationToast["通知Toast<br/>Notification Toast"]
        LoadingSpinner["加载指示器<br/>Loading Spinner"]
    end

    subgraph UIComponents["UI基础组件 UI Components"]
        Button["按钮<br/>Button"]
        Input["输入框<br/>Input"]
        Card["卡片<br/>Card"]
        Dialog["对话框<br/>Dialog"]
        Table["表格<br/>Table"]
        Tabs["选项卡<br/>Tabs"]
        Form["表单<br/>Form"]
        Select["选择器<br/>Select"]
    end

    subgraph Hooks["自定义Hooks Custom Hooks"]
        useAuth["认证Hook<br/>useAuth"]
        usePatient["患者Hook<br/>usePatient"]
        useToast["通知Hook<br/>useToast"]
        useMobile["移动端Hook<br/>useMobile"]
        useLocalStorage["本地存储Hook<br/>useLocalStorage"]
    end

    subgraph StateManagement["状态管理 State Management"]
        QueryClient["查询客户端<br/>Query Client"]
        AuthContext["认证上下文<br/>Auth Context"]
        GlobalState["全局状态<br/>Global State"]
        LocalCache["本地缓存<br/>Local Cache"]
    end

    subgraph AdminPages["管理员页面 Admin Pages"]
        AdminDash["管理员仪表板<br/>Admin Dashboard"]
        UserManagement["用户管理<br/>User Management"]
        GroupManagement["组管理<br/>Group Management"]
        SystemSettings["系统设置<br/>System Settings"]
    end

    subgraph StudentPages["学生页面 Student Pages"]
        StudentDash["学生仪表板<br/>Student Dashboard"]
        PatientView["患者查看<br/>Patient View"]
        SOAPNotes["SOAP笔记<br/>SOAP Notes"]
        MedicalOrders["医嘱下达<br/>Medical Orders"]
    end

    %% 应用结构关系
    AppRoot --> GlobalProviders
    AppRoot --> Router
    Router --> AuthGuard
    
    %% 页面组件关系
    AuthGuard --> AdminPages
    AuthGuard --> StudentPages
    
    %% 共享组件使用
    AdminDash --> TopNav
    AdminDash --> Sidebar
    AdminDash --> PatientList
    StudentDash --> TopNav
    StudentDash --> PatientCard
    
    %% UI组件使用
    UserManagement --> Table
    UserManagement --> Button
    UserManagement --> Dialog
    SOAPNotes --> Form
    SOAPNotes --> Input
    SOAPNotes --> Button
    
    %% Hook使用关系
    TopNav --> useAuth
    PatientView --> usePatient
    NotificationToast --> useToast
    AdminDash --> useMobile
    
    %% 状态管理关系
    useAuth --> AuthContext
    usePatient --> QueryClient
    GlobalProviders --> QueryClient
    GlobalProviders --> AuthContext
    
    %% 数据流
    PatientList --> PatientView
    PatientView --> SOAPNotes
    PatientView --> MedicalOrders
    UserManagement --> GroupManagement

    %% 样式定义
    classDef appStyle fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    classDef sharedStyle fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    classDef uiStyle fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    classDef hookStyle fill:#e0f2f1,stroke:#00695c,stroke-width:2px
    classDef stateStyle fill:#fce4ec,stroke:#c2185b,stroke-width:2px
    classDef adminStyle fill:#f1f8e9,stroke:#689f38,stroke-width:2px
    classDef studentStyle fill:#e8eaf6,stroke:#3f51b5,stroke-width:2px

    class AppRoot,GlobalProviders,Router,AuthGuard appStyle
    class TopNav,Sidebar,PatientList,PatientCard,NotificationToast,LoadingSpinner sharedStyle
    class Button,Input,Card,Dialog,Table,Tabs,Form,Select uiStyle
    class useAuth,usePatient,useToast,useMobile,useLocalStorage hookStyle
    class QueryClient,AuthContext,GlobalState,LocalCache stateStyle
    class AdminDash,UserManagement,GroupManagement,SystemSettings adminStyle
    class StudentDash,PatientView,SOAPNotes,MedicalOrders studentStyle
```

---

## 🔄 数据流架构图

### 前端到后端的数据流向

```mermaid
graph LR
    subgraph Frontend["前端应用 Frontend Application"]
        UserInterface["用户界面<br/>User Interface"]
        ReactComponents["React组件<br/>React Components"]
        StateManagement["状态管理<br/>State Management"]
        ReactQuery["React Query<br/>缓存层"]
    end

    subgraph APILayer["API层 API Layer"]
        RESTEndpoints["REST端点<br/>REST Endpoints"]
        Authentication["认证中间件<br/>Authentication"]
        Authorization["授权中间件<br/>Authorization"]
        DataValidation["数据验证<br/>Data Validation"]
    end

    subgraph BusinessLogic["业务逻辑层 Business Logic"]
        UserService["用户服务<br/>User Service"]
        PatientService["患者服务<br/>Patient Service"]
        SOAPService["SOAP服务<br/>SOAP Service"]
        GroupService["组服务<br/>Group Service"]
    end

    subgraph Database["数据库层 Database Layer"]
        PostgreSQL["PostgreSQL<br/>主数据库"]
        UsersTable["用户表<br/>Users Table"]
        PatientsTable["患者表<br/>Patients Table"]
        SOAPTable["SOAP表<br/>SOAP Table"]
        GroupsTable["组表<br/>Groups Table"]
    end

    subgraph ExternalServices["外部服务 External Services"]
        CloudStorage["云存储<br/>Cloud Storage"]
        EmailService["邮件服务<br/>Email Service"]
        AuditService["审计服务<br/>Audit Service"]
    end

    %% 用户操作流
    UserInterface --> ReactComponents
    ReactComponents --> StateManagement
    StateManagement --> ReactQuery
    
    %% API调用流
    ReactQuery -->|HTTP请求| RESTEndpoints
    RESTEndpoints --> Authentication
    Authentication --> Authorization
    Authorization --> DataValidation
    
    %% 业务逻辑处理
    DataValidation --> UserService
    DataValidation --> PatientService
    DataValidation --> SOAPService
    DataValidation --> GroupService
    
    %% 数据库操作
    UserService --> UsersTable
    PatientService --> PatientsTable
    SOAPService --> SOAPTable
    GroupService --> GroupsTable
    
    %% 数据库连接
    UsersTable --> PostgreSQL
    PatientsTable --> PostgreSQL
    SOAPTable --> PostgreSQL
    GroupsTable --> PostgreSQL
    
    %% 外部服务调用
    PatientService --> CloudStorage
    UserService --> EmailService
    UserService --> AuditService
    
    %% 响应流
    PostgreSQL -->|查询结果| BusinessLogic
    BusinessLogic -->|业务数据| APILayer
    APILayer -->|JSON响应| Frontend
    
    %% 实时更新
    BusinessLogic -.->|WebSocket| ReactQuery
    AuditService -.->|日志| Frontend

    %% 样式定义
    classDef frontendStyle fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    classDef apiStyle fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    classDef businessStyle fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    classDef databaseStyle fill:#e0f2f1,stroke:#00695c,stroke-width:2px
    classDef externalStyle fill:#fce4ec,stroke:#c2185b,stroke-width:2px

    class UserInterface,ReactComponents,StateManagement,ReactQuery frontendStyle
    class RESTEndpoints,Authentication,Authorization,DataValidation apiStyle
    class UserService,PatientService,SOAPService,GroupService businessStyle
    class PostgreSQL,UsersTable,PatientsTable,SOAPTable,GroupsTable databaseStyle
    class CloudStorage,EmailService,AuditService externalStyle
```

---

## 👥 用户交互流程图

### 完整的用户操作流程

```mermaid
flowchart TD
    Start["用户访问应用<br/>User Access App"] --> CheckAuth{"检查认证状态<br/>Check Auth Status"}
    
    CheckAuth -->|未认证| LoginPage["登录页面<br/>Login Page"]
    CheckAuth -->|已认证| CheckRole{"检查用户角色<br/>Check User Role"}
    
    LoginPage --> InputCredentials["输入用户名密码<br/>Input Credentials"]
    InputCredentials --> ValidateAuth{"验证身份<br/>Validate Auth"}
    ValidateAuth -->|失败| ShowError["显示错误信息<br/>Show Error"]
    ShowError --> LoginPage
    ValidateAuth -->|成功| CheckRole
    
    CheckRole -->|管理员| AdminDashboard["管理员仪表板<br/>Admin Dashboard"]
    CheckRole -->|协调员| CoordinatorDashboard["协调员仪表板<br/>Coordinator Dashboard"]
    CheckRole -->|教师| InstructorDashboard["教师仪表板<br/>Instructor Dashboard"]
    CheckRole -->|学生| StudentDashboard["学生仪表板<br/>Student Dashboard"]
    
    %% 管理员流程
    AdminDashboard --> ManageUsers["管理用户<br/>Manage Users"]
    AdminDashboard --> ManageGroups["管理组<br/>Manage Groups"]
    AdminDashboard --> ViewStats["查看统计<br/>View Statistics"]
    
    ManageUsers --> CreateUser["创建用户<br/>Create User"]
    ManageUsers --> EditUser["编辑用户<br/>Edit User"]
    ManageUsers --> DeleteUser["删除用户<br/>Delete User"]
    
    ManageGroups --> CreateGroup["创建组<br/>Create Group"]
    ManageGroups --> AssignMembers["分配成员<br/>Assign Members"]
    ManageGroups --> SetPermissions["设置权限<br/>Set Permissions"]
    
    %% 教师流程
    InstructorDashboard --> SelectScenario["选择场景<br/>Select Scenario"]
    InstructorDashboard --> MonitorStudents["监控学生<br/>Monitor Students"]
    InstructorDashboard --> ViewPatient["查看患者<br/>View Patient"]
    
    SelectScenario --> StartSession["开始会话<br/>Start Session"]
    StartSession --> ControlScenario["控制场景<br/>Control Scenario"]
    MonitorStudents --> ProvideFeedback["提供反馈<br/>Provide Feedback"]
    
    %% 学生流程
    StudentDashboard --> ViewPatientInfo["查看患者信息<br/>View Patient Info"]
    StudentDashboard --> AnalyzeData["分析数据<br/>Analyze Data"]
    StudentDashboard --> WriteRecords["编写记录<br/>Write Records"]
    
    ViewPatientInfo --> CheckVitals["查看生命体征<br/>Check Vitals"]
    ViewPatientInfo --> CheckLabResults["查看实验结果<br/>Check Lab Results"]
    ViewPatientInfo --> CheckHistory["查看病史<br/>Check History"]
    
    AnalyzeData --> InterpretData["解读数据<br/>Interpret Data"]
    InterpretData --> FormDiagnosis["形成诊断<br/>Form Diagnosis"]
    
    WriteRecords --> WriteSOAP["编写SOAP笔记<br/>Write SOAP Notes"]
    WriteRecords --> WriteMedicalOrders["下达医嘱<br/>Write Medical Orders"]
    
    WriteSOAP --> SaveDraft["保存草稿<br/>Save Draft"]
    WriteSOAP --> SubmitRecord["提交记录<br/>Submit Record"]
    
    WriteMedicalOrders --> SelectOrderType["选择医嘱类型<br/>Select Order Type"]
    SelectOrderType --> EnterOrderDetails["输入医嘱详情<br/>Enter Order Details"]
    EnterOrderDetails --> ValidateOrder["验证医嘱<br/>Validate Order"]
    ValidateOrder --> SubmitOrder["提交医嘱<br/>Submit Order"]
    
    %% 协调员流程
    CoordinatorDashboard --> ManageDocuments["管理文档<br/>Manage Documents"]
    CoordinatorDashboard --> ManageReleases["管理发布<br/>Manage Releases"]
    CoordinatorDashboard --> MonitorActivity["监控活动<br/>Monitor Activity"]
    
    ManageDocuments --> UploadDocument["上传文档<br/>Upload Document"]
    ManageDocuments --> VersionControl["版本控制<br/>Version Control"]
    ManageReleases --> ScheduleRelease["计划发布<br/>Schedule Release"]
    
    %% 通用操作
    SubmitRecord --> ShowSuccess["显示成功信息<br/>Show Success"]
    SubmitOrder --> ShowSuccess
    CreateUser --> ShowSuccess
    CreateGroup --> ShowSuccess
    UploadDocument --> ShowSuccess
    
    ShowSuccess --> ReturnToDashboard["返回仪表板<br/>Return to Dashboard"]
    
    %% 退出登录
    AdminDashboard --> Logout["退出登录<br/>Logout"]
    CoordinatorDashboard --> Logout
    InstructorDashboard --> Logout
    StudentDashboard --> Logout
    Logout --> Start

    %% 样式定义
    classDef startStyle fill:#e8f5e8,stroke:#388e3c,stroke-width:2px
    classDef authStyle fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    classDef adminStyle fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    classDef coordinatorStyle fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    classDef instructorStyle fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    classDef studentStyle fill:#e0f2f1,stroke:#00695c,stroke-width:2px
    classDef actionStyle fill:#fce4ec,stroke:#c2185b,stroke-width:2px
    classDef successStyle fill:#e8f5e8,stroke:#4caf50,stroke-width:2px

    class Start,ReturnToDashboard startStyle
    class CheckAuth,CheckRole,ValidateAuth,LoginPage,InputCredentials,ShowError authStyle
    class AdminDashboard,ManageUsers,ManageGroups,ViewStats,CreateUser,EditUser,DeleteUser,CreateGroup,AssignMembers,SetPermissions adminStyle
    class CoordinatorDashboard,ManageDocuments,ManageReleases,MonitorActivity,UploadDocument,VersionControl,ScheduleRelease coordinatorStyle
    class InstructorDashboard,SelectScenario,MonitorStudents,ViewPatient,StartSession,ControlScenario,ProvideFeedback instructorStyle
    class StudentDashboard,ViewPatientInfo,AnalyzeData,WriteRecords,CheckVitals,CheckLabResults,CheckHistory,InterpretData,FormDiagnosis,WriteSOAP,WriteMedicalOrders,SaveDraft,SubmitRecord,SelectOrderType,EnterOrderDetails,ValidateOrder,SubmitOrder studentStyle
    class ShowSuccess successStyle
```

---

## 🎯 UI设计特点总结

### 核心设计原则

#### 1. 角色导向设计
- **四角色界面**: 管理员、协调员、教师、学生专用界面
- **权限控制**: 基于角色的功能访问控制
- **工作流优化**: 针对不同角色的工作流程设计

#### 2. 组件化架构
- **可重用组件**: 高度模块化的UI组件系统
- **一致性设计**: 统一的设计语言和交互模式
- **类型安全**: 完整的TypeScript类型定义

#### 3. 响应式设计
- **多设备适配**: 桌面、平板、移动端响应式布局
- **触控优化**: 移动端友好的交互设计
- **可访问性**: 符合WCAG 2.1 AA标准

#### 4. 现代化技术栈
- **React 18**: 并发特性和性能优化
- **TypeScript**: 类型安全和开发体验
- **shadcn/ui**: 现代化UI组件库
- **Tailwind CSS**: 原子化CSS框架

### 用户体验特点

#### 直观的导航系统
- 清晰的页面层级结构
- 面包屑导航支持
- 快速访问常用功能

#### 高效的数据展示
- 分页和虚拟化支持
- 实时数据更新
- 智能搜索和过滤

#### 友好的交互反馈
- 实时表单验证
- 操作状态指示
- 错误处理和恢复

---

## 📞 技术支持

如需查看或编辑这些Mermaid图表：

1. **在线编辑器**: 复制代码到 [Mermaid Live Editor](https://mermaid.live/)
2. **VS Code**: 安装Mermaid Preview插件
3. **GitHub/GitLab**: 直接在Markdown中渲染
4. **文档系统**: 集成到Docusaurus、GitBook等文档系统

---

**文档版本**: v1.0  
**最后更新**: 2025年1月  
**创建工具**: Mermaid.js  
**兼容性**: 支持所有主流Mermaid渲染器

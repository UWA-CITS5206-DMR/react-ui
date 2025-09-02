// Mock数据生成器
import type { 
  User, 
  Session, 
  Patient, 
  VitalSigns, 
  LabResult, 
  MedicalHistory, 
  Medication, 
  SoapNote, 
  Order, 
  Group, 
  GroupMember, 
  Asset, 
  AssetGroupVisibility,
  Document,
  DocumentRelease,
  SimulationWeek,
  DataVersion,
  GroupAccount,
  AuditLog
} from '@shared/schema';

// 辅助函数：生成随机ID
const generateId = () => Math.random().toString(36).substr(2, 9);

// 辅助函数：生成随机日期
const randomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// 辅助函数：从数组中随机选择
const randomChoice = <T>(array: T[]): T => array[Math.floor(Math.random() * array.length)];

// Mock用户数据
export const mockUsers: User[] = [
  {
    id: 'user-1',
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    firstName: '管理员',
    lastName: '系统',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'user-2',
    username: 'instructor1',
    password: 'instructor123',
    role: 'instructor',
    firstName: '张',
    lastName: '教授',
    createdAt: new Date('2024-01-02'),
  },
  {
    id: 'user-3',
    username: 'student',
    password: 'student123',
    role: 'student',
    firstName: '李',
    lastName: '同学',
    createdAt: new Date('2024-01-03'),
  },
  {
    id: 'user-4',
    username: 'student1',
    password: 'student123',
    role: 'student',
    firstName: '张',
    lastName: '学生',
    createdAt: new Date('2024-01-03'),
  },
  {
    id: 'user-5',
    username: 'instructor',
    password: 'instructor123',
    role: 'instructor',
    firstName: '王',
    lastName: '老师',
    createdAt: new Date('2024-01-02'),
  },
  {
    id: 'user-6',
    username: 'coordinator',
    password: 'coordinator123',
    role: 'coordinator',
    firstName: '赵',
    lastName: '协调员',
    createdAt: new Date('2024-01-04'),
  },
  {
    id: 'user-7',
    username: 'coordinator1',
    password: 'coordinator123',
    role: 'coordinator',
    firstName: '王',
    lastName: '协调员',
    createdAt: new Date('2024-01-04'),
  },
];

// Mock会话数据
export const mockSessions: Session[] = [
  {
    id: 'session-1',
    name: '急性心肌梗死模拟训练',
    instructorId: 'user-2',
    scenarioId: 'scenario-1',
    active: true,
    timeRemaining: 45,
    createdAt: new Date('2024-01-10'),
  },
  {
    id: 'session-2', 
    name: '急性呼吸衰竭案例',
    instructorId: 'user-2',
    scenarioId: 'scenario-2',
    active: false,
    timeRemaining: 0,
    createdAt: new Date('2024-01-09'),
  },
];

// Mock患者数据
export const mockPatients: Patient[] = [
  {
    id: 'patient-1',
    mrn: 'MRN001234',
    firstName: '张',
    lastName: '三',
    dateOfBirth: '1965-05-15',
    gender: '男',
    location: '急诊科床位3',
    status: 'critical',
    chiefComplaint: '胸痛3小时，伴大汗、恶心',
    sessionId: 'session-1',
    createdAt: new Date('2024-01-10'),
  },
  {
    id: 'patient-2',
    mrn: 'MRN001235',
    firstName: '李',
    lastName: '四',
    dateOfBirth: '1978-12-20',
    gender: '女',
    location: 'ICU床位5',
    status: 'stable',
    chiefComplaint: '呼吸困难、咳嗽2天',
    sessionId: 'session-1',
    createdAt: new Date('2024-01-10'),
  },
];

// Mock生命体征数据
export const mockVitals: VitalSigns[] = [
  {
    id: 'vital-1',
    patientId: 'patient-1',
    bloodPressure: '180/110',
    heartRate: 105,
    respiratoryRate: 22,
    temperature: '37.2°C',
    oxygenSaturation: 94,
    recordedAt: new Date(),
    recordedBy: 'user-3',
  },
  {
    id: 'vital-2',
    patientId: 'patient-2',
    bloodPressure: '125/85',
    heartRate: 88,
    respiratoryRate: 18,
    temperature: '36.8°C',
    oxygenSaturation: 97,
    recordedAt: new Date(),
    recordedBy: 'user-3',
  },
];

// Mock检验结果数据
export const mockLabResults: LabResult[] = [
  {
    id: 'lab-1',
    patientId: 'patient-1',
    testName: '肌钙蛋白I',
    value: '0.08',
    unit: 'ng/mL',
    referenceRange: '<0.04',
    status: 'completed',
    orderedAt: new Date('2024-01-10T08:00:00'),
    completedAt: new Date('2024-01-10T09:30:00'),
    orderedBy: 'user-2',
  },
  {
    id: 'lab-2',
    patientId: 'patient-1',
    testName: 'CK-MB',
    value: 'pending',
    unit: 'ng/mL',
    referenceRange: '<6.3',
    status: 'pending',
    orderedAt: new Date('2024-01-10T08:00:00'),
    orderedBy: 'user-2',
  },
];

// Mock病史数据
export const mockMedicalHistory: MedicalHistory[] = [
  {
    id: 'history-1',
    patientId: 'patient-1',
    condition: '高血压',
    diagnosedYear: '2018',
    notes: '长期服用降压药物控制',
  },
  {
    id: 'history-2',
    patientId: 'patient-1',
    condition: '糖尿病',
    diagnosedYear: '2020',
    notes: '2型糖尿病，使用胰岛素治疗',
  },
];

// Mock药物数据
export const mockMedications: Medication[] = [
  {
    id: 'med-1',
    patientId: 'patient-1',
    name: '阿司匹林',
    dosage: '100mg',
    frequency: '每日一次',
    prescribedBy: 'user-2',
    prescribedAt: new Date('2024-01-10'),
  },
  {
    id: 'med-2',
    patientId: 'patient-1',
    name: '硝酸甘油',
    dosage: '0.4mg',
    frequency: '舌下含服 PRN',
    prescribedBy: 'user-2',
    prescribedAt: new Date('2024-01-10'),
  },
];

// Mock SOAP笔记数据
export const mockSoapNotes: SoapNote[] = [
  {
    id: 'soap-1',
    patientId: 'patient-1',
    subjective: '患者诉胸痛3小时，疼痛剧烈，伴大汗、恶心',
    objective: 'BP:180/110, HR:105, RR:22, T:37.2°C, SpO2:94%',
    assessment: '疑似急性心肌梗死',
    plan: '1.立即心电图检查 2.抽血化验心肌酶 3.给予阿司匹林',
    authorId: 'user-3',
    createdAt: new Date('2024-01-10T10:00:00'),
  },
];

// Mock医嘱数据
export const mockOrders: Order[] = [
  {
    id: 'order-1',
    patientId: 'patient-1',
    type: 'lab',
    orderText: '肌钙蛋白I、CK-MB、心肌酶谱',
    orderedBy: 'user-2',
    createdAt: new Date('2024-01-10T08:00:00'),
  },
  {
    id: 'order-2',
    patientId: 'patient-1',
    type: 'imaging',
    orderText: '胸部X线片',
    orderedBy: 'user-2',
    createdAt: new Date('2024-01-10T08:15:00'),
  },
];

// Mock分组数据
export const mockGroups: Group[] = [
  {
    id: 'group-1',
    name: '第一组',
    sessionId: 'session-1',
    createdAt: new Date('2024-01-10'),
  },
  {
    id: 'group-2',
    name: '第二组',
    sessionId: 'session-1',
    createdAt: new Date('2024-01-10'),
  },
];

// Mock分组成员数据
export const mockGroupMembers: GroupMember[] = [
  {
    id: 'member-1',
    groupId: 'group-1',
    userId: 'user-3',
    joinedAt: new Date('2024-01-10'),
  },
];

// Mock资产数据
export const mockAssets: Asset[] = [
  {
    id: 'asset-1',
    sessionId: 'session-1',
    name: '心电图报告',
    type: 'document',
    category: 'imaging',
    filePath: '/assets/ecg-001.pdf',
    createdAt: new Date('2024-01-10'),
  },
  {
    id: 'asset-2',
    sessionId: 'session-1',
    name: '胸部X线片',
    type: 'image',
    category: 'imaging',
    filePath: '/assets/chest-xray-001.jpg',
    createdAt: new Date('2024-01-10'),
  },
];

// Mock资产可见性数据
export const mockAssetVisibility: AssetGroupVisibility[] = [
  {
    id: 'visibility-1',
    assetId: 'asset-1',
    groupId: 'group-1',
    visible: true,
    changedAt: new Date('2024-01-10'),
    changedBy: 'user-2',
  },
];

// Mock文档数据
export const mockDocuments: Document[] = [
  {
    id: 'doc-1',
    sessionId: 'session-1',
    patientId: 'patient-1',
    category: 'lab',
    originalName: '检验报告.pdf',
    filePath: '/uploads/lab-report-001.pdf',
    fileSize: 1024000,
    mimeType: 'application/pdf',
    uploadedBy: 'user-4',
    uploadedAt: new Date('2024-01-10'),
  },
];

// Mock文档发布数据
export const mockDocumentReleases: DocumentRelease[] = [
  {
    id: 'release-1',
    documentId: 'doc-1',
    groupId: 'group-1',
    releaseType: 'manual',
    scheduledAt: new Date('2024-01-10T14:00:00'),
    releasedAt: null,
    releasedBy: null,
    createdAt: new Date('2024-01-10'),
  },
];

// Mock模拟周数据
export const mockSimulationWeeks: SimulationWeek[] = [
  {
    id: 'week-1',
    sessionId: 'session-1',
    weekNumber: 1,
    startDate: new Date('2024-01-10'),
    endDate: new Date('2024-01-16'),
    active: true,
    createdAt: new Date('2024-01-10'),
  },
];

// Mock数据版本
export const mockDataVersions: DataVersion[] = [
  {
    id: 'version-1',
    sessionId: 'session-1',
    name: '基础数据集v1.0',
    description: '包含基本患者信息和检验数据',
    version: '1.0.0',
    createdAt: new Date('2024-01-10'),
  },
];

// Mock分组账户
export const mockGroupAccounts: GroupAccount[] = [
  {
    id: 'account-1',
    groupId: 'group-1',
    username: 'group1_user',
    password: 'group123',
    active: true,
    createdAt: new Date('2024-01-10'),
  },
];

// Mock审计日志
export const mockAuditLogs: AuditLog[] = [
  {
    id: 'audit-1',
    entityType: 'patient',
    entityId: 'patient-1',
    action: 'update',
    changes: { status: 'critical' },
    performedBy: 'user-2',
    performedAt: new Date('2024-01-10T10:30:00'),
  },
];

// 数据生成器函数
export const generateMockData = {
  users: (count: number = 5): User[] => {
    return Array.from({ length: count }, (_, i) => ({
      id: `user-${i + 1}`,
      username: `user${i + 1}`,
      password: 'password123',
      role: randomChoice(['student', 'instructor', 'admin', 'coordinator']),
      firstName: randomChoice(['张', '李', '王', '刘', '陈']),
      lastName: randomChoice(['明', '华', '强', '丽', '军']),
      createdAt: randomDate(new Date('2024-01-01'), new Date()),
    }));
  },

  patients: (count: number = 3, sessionId: string = 'session-1'): Patient[] => {
    const conditions = ['critical', 'stable', 'monitoring'];
    const complaints = [
      '胸痛伴呼吸困难',
      '发热咳嗽3天',
      '腹痛伴恶心呕吐',
      '头痛头晕2小时',
      '呼吸困难加重'
    ];

    return Array.from({ length: count }, (_, i) => ({
      id: `patient-${i + 1}`,
      mrn: `MRN${String(i + 1).padStart(6, '0')}`,
      firstName: randomChoice(['张', '李', '王', '刘', '陈', '赵']),
      lastName: randomChoice(['三', '四', '五', '六', '七', '八']),
      dateOfBirth: randomDate(new Date('1950-01-01'), new Date('2000-01-01')).toISOString().split('T')[0],
      gender: randomChoice(['男', '女']),
      location: `${randomChoice(['急诊科', 'ICU', '内科'])}床位${i + 1}`,
      status: randomChoice(conditions),
      chiefComplaint: randomChoice(complaints),
      sessionId,
      createdAt: randomDate(new Date('2024-01-01'), new Date()),
    }));
  },

  vitals: (patientId: string, count: number = 3): VitalSigns[] => {
    return Array.from({ length: count }, (_, i) => ({
      id: `vital-${patientId}-${i + 1}`,
      patientId,
      bloodPressure: `${120 + Math.floor(Math.random() * 60)}/${80 + Math.floor(Math.random() * 40)}`,
      heartRate: 60 + Math.floor(Math.random() * 60),
      respiratoryRate: 12 + Math.floor(Math.random() * 16),
      temperature: `${(36 + Math.random() * 2).toFixed(1)}°C`,
      oxygenSaturation: 90 + Math.floor(Math.random() * 10),
      recordedAt: randomDate(new Date(Date.now() - 86400000), new Date()),
      recordedBy: 'user-3',
    }));
  },

  labResults: (patientId: string, count: number = 5): LabResult[] => {
    const tests = [
      { name: '血常规-白细胞', unit: '×10⁹/L', range: '3.5-9.5' },
      { name: '血常规-红细胞', unit: '×10¹²/L', range: '4.3-5.8' },
      { name: '肌酐', unit: 'μmol/L', range: '57-111' },
      { name: '尿素氮', unit: 'mmol/L', range: '3.1-8.0' },
      { name: '血糖', unit: 'mmol/L', range: '3.9-6.1' },
    ];

    return Array.from({ length: count }, (_, i) => {
      const test = tests[i % tests.length];
      return {
        id: `lab-${patientId}-${i + 1}`,
        patientId,
        testName: test.name,
        value: (Math.random() * 10).toFixed(2),
        unit: test.unit,
        referenceRange: test.range,
        status: randomChoice(['completed', 'pending']),
        orderedAt: randomDate(new Date(Date.now() - 86400000), new Date()),
        completedAt: Math.random() > 0.3 ? randomDate(new Date(Date.now() - 43200000), new Date()) : null,
        orderedBy: 'user-2',
      };
    });
  },
};

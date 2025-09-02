// Mock API客户端
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

import { 
  mockUsers,
  mockSessions,
  mockPatients,
  mockVitals,
  mockLabResults,
  mockMedicalHistory,
  mockMedications,
  mockSoapNotes,
  mockOrders,
  mockGroups,
  mockGroupMembers,
  mockAssets,
  mockAssetVisibility,
  mockDocuments,
  mockDocumentReleases,
  mockSimulationWeeks,
  mockDataVersions,
  mockGroupAccounts,
  mockAuditLogs,
  generateMockData
} from './mock-data';

// Mock配置
const MOCK_CONFIG = {
  enabled: import.meta.env.VITE_MOCK_API === 'true',
  delay: {
    min: parseInt(import.meta.env.VITE_MOCK_DELAY_MIN || '100'),
    max: parseInt(import.meta.env.VITE_MOCK_DELAY_MAX || '800'),
  },
  errorRate: parseFloat(import.meta.env.VITE_MOCK_ERROR_RATE || '0'), // 默认无错误
};

// 模拟网络延迟
const simulateDelay = (): Promise<void> => {
  const delay = Math.random() * (MOCK_CONFIG.delay.max - MOCK_CONFIG.delay.min) + MOCK_CONFIG.delay.min;
  return new Promise(resolve => setTimeout(resolve, delay));
};

// 模拟随机错误
const simulateRandomError = (options?: { skipAuth?: boolean }) => {
  // 为关键认证操作降低错误率
  const effectiveErrorRate = options?.skipAuth ? MOCK_CONFIG.errorRate * 0.1 : MOCK_CONFIG.errorRate;
  
  if (Math.random() < effectiveErrorRate) {
    const errors = [
      { status: 404, message: 'Resource not found' },
      { status: 500, message: 'Internal server error' },
      { status: 401, message: 'Unauthorized' },
      { status: 403, message: 'Forbidden' },
    ];
    const error = errors[Math.floor(Math.random() * errors.length)];
    throw new Error(`Mock Error ${error.status}: ${error.message}`);
  }
};

// 日志函数
const logMockRequest = (method: string, endpoint: string, data?: any) => {
  if (import.meta.env.VITE_API_LOGGING !== 'false') {
    const timestamp = new Date().toISOString();
    const requestId = Math.random().toString(36).substr(2, 9);
    
    if (import.meta.env.VITE_API_LOGGING === 'detailed') {
      console.group(`🎭 Mock请求 [${requestId}] - ${timestamp}`);
      console.log(`📍 URL: ${method} ${endpoint}`);
      if (data) {
        console.log(`📝 Request Data:`, data);
      }
      console.groupEnd();
    } else {
      console.log(`🎭 [${requestId}] ${method} ${endpoint} (Mock)`);
    }
  }
};

// Mock数据存储 (模拟数据库)
class MockDataStore {
  private users = [...mockUsers];
  private sessions = [...mockSessions];
  private patients = [...mockPatients];
  private vitals = [...mockVitals];
  private labResults = [...mockLabResults];
  private medicalHistory = [...mockMedicalHistory];
  private medications = [...mockMedications];
  private soapNotes = [...mockSoapNotes];
  private orders = [...mockOrders];
  private groups = [...mockGroups];
  private groupMembers = [...mockGroupMembers];
  private assets = [...mockAssets];
  private assetVisibility = [...mockAssetVisibility];
  private documents = [...mockDocuments];
  private documentReleases = [...mockDocumentReleases];
  private simulationWeeks = [...mockSimulationWeeks];
  private dataVersions = [...mockDataVersions];
  private groupAccounts = [...mockGroupAccounts];
  private auditLogs = [...mockAuditLogs];

  // 生成ID
  private generateId = () => Math.random().toString(36).substr(2, 9);

  // 用户相关
  findUserByUsername(username: string): User | undefined {
    return this.users.find(user => user.username === username);
  }

  getAllUsers(): User[] {
    return this.users;
  }

  createUser(userData: Omit<User, 'id' | 'createdAt'>): User {
    const user: User = {
      ...userData,
      id: this.generateId(),
      createdAt: new Date(),
    };
    this.users.push(user);
    return user;
  }

  updateUser(id: string, updates: Partial<User>): User | null {
    const index = this.users.findIndex(user => user.id === id);
    if (index === -1) return null;
    
    this.users[index] = { ...this.users[index], ...updates };
    return this.users[index];
  }

  deleteUser(id: string): boolean {
    const index = this.users.findIndex(user => user.id === id);
    if (index === -1) return false;
    
    this.users.splice(index, 1);
    return true;
  }

  // 会话相关
  getSessionsByInstructor(instructorId: string): Session[] {
    return this.sessions.filter(session => session.instructorId === instructorId);
  }

  getSessionById(sessionId: string): Session | undefined {
    return this.sessions.find(session => session.id === sessionId);
  }

  // 患者相关
  getPatientsBySession(sessionId: string): Patient[] {
    console.log(`🔍 MockDataStore.getPatientsBySession(${sessionId})`);
    console.log(`🔍 所有患者数据:`, this.patients);
    const filtered = this.patients.filter(patient => patient.sessionId === sessionId);
    console.log(`🔍 过滤后的患者数据:`, filtered);
    return filtered;
  }

  getPatientById(patientId: string): Patient | undefined {
    return this.patients.find(patient => patient.id === patientId);
  }

  updatePatient(id: string, updates: Partial<Patient>): Patient | null {
    const index = this.patients.findIndex(patient => patient.id === id);
    if (index === -1) return null;
    
    this.patients[index] = { ...this.patients[index], ...updates };
    return this.patients[index];
  }

  // 生命体征
  getVitalsByPatient(patientId: string): VitalSigns[] {
    return this.vitals.filter(vital => vital.patientId === patientId);
  }

  // 检验结果
  getLabResultsByPatient(patientId: string): LabResult[] {
    return this.labResults.filter(lab => lab.patientId === patientId);
  }

  updateLabResult(id: string, updates: Partial<LabResult>): LabResult | null {
    const index = this.labResults.findIndex(lab => lab.id === id);
    if (index === -1) return null;
    
    this.labResults[index] = { ...this.labResults[index], ...updates };
    return this.labResults[index];
  }

  // 病史
  getMedicalHistoryByPatient(patientId: string): MedicalHistory[] {
    return this.medicalHistory.filter(history => history.patientId === patientId);
  }

  // 药物
  getMedicationsByPatient(patientId: string): Medication[] {
    return this.medications.filter(med => med.patientId === patientId);
  }

  // SOAP笔记
  getSoapNotesByPatient(patientId: string): SoapNote[] {
    return this.soapNotes.filter(note => note.patientId === patientId);
  }

  createSoapNote(noteData: Omit<SoapNote, 'id' | 'createdAt'>): SoapNote {
    const note: SoapNote = {
      ...noteData,
      id: this.generateId(),
      createdAt: new Date(),
    };
    this.soapNotes.push(note);
    return note;
  }

  // 医嘱
  getOrdersByPatient(patientId: string): Order[] {
    return this.orders.filter(order => order.patientId === patientId);
  }

  createOrder(orderData: Omit<Order, 'id' | 'createdAt'>): Order {
    const order: Order = {
      ...orderData,
      id: this.generateId(),
      createdAt: new Date(),
    };
    this.orders.push(order);
    return order;
  }

  // 分组相关
  getGroupsBySession(sessionId: string): Group[] {
    return this.groups.filter(group => group.sessionId === sessionId);
  }

  createGroup(groupData: Omit<Group, 'id' | 'createdAt'>): Group {
    const group: Group = {
      ...groupData,
      id: this.generateId(),
      createdAt: new Date(),
    };
    this.groups.push(group);
    return group;
  }

  getGroupMembers(groupId: string): GroupMember[] {
    return this.groupMembers.filter(member => member.groupId === groupId);
  }

  addGroupMember(memberData: Omit<GroupMember, 'id' | 'joinedAt'>): GroupMember {
    const member: GroupMember = {
      ...memberData,
      id: this.generateId(),
      joinedAt: new Date(),
    };
    this.groupMembers.push(member);
    return member;
  }

  getUserGroups(userId: string): Group[] {
    const userGroups = this.groupMembers
      .filter(member => member.userId === userId)
      .map(member => member.groupId);
    return this.groups.filter(group => userGroups.includes(group.id));
  }

  // 资产相关
  getAssetsBySession(sessionId: string): Asset[] {
    return this.assets.filter(asset => asset.sessionId === sessionId);
  }

  createAsset(assetData: Omit<Asset, 'id' | 'createdAt'>): Asset {
    const asset: Asset = {
      ...assetData,
      id: this.generateId(),
      createdAt: new Date(),
    };
    this.assets.push(asset);
    return asset;
  }

  deleteAsset(assetId: string): boolean {
    const index = this.assets.findIndex(asset => asset.id === assetId);
    if (index === -1) return false;
    
    this.assets.splice(index, 1);
    return true;
  }

  getVisibleAssetsForGroup(groupId: string): Asset[] {
    const visibleAssetIds = this.assetVisibility
      .filter(visibility => visibility.groupId === groupId && visibility.visible)
      .map(visibility => visibility.assetId);
    return this.assets.filter(asset => visibleAssetIds.includes(asset.id));
  }

  getAssetVisibility(assetId: string, groupId: string): AssetGroupVisibility | null {
    return this.assetVisibility.find(
      visibility => visibility.assetId === assetId && visibility.groupId === groupId
    ) || null;
  }

  updateAssetVisibility(assetId: string, groupId: string, visible: boolean, changedBy: string): AssetGroupVisibility {
    const existing = this.assetVisibility.findIndex(
      visibility => visibility.assetId === assetId && visibility.groupId === groupId
    );

    const visibility: AssetGroupVisibility = {
      id: existing !== -1 ? this.assetVisibility[existing].id : this.generateId(),
      assetId,
      groupId,
      visible,
      changedAt: new Date(),
      changedBy,
    };

    if (existing !== -1) {
      this.assetVisibility[existing] = visibility;
    } else {
      this.assetVisibility.push(visibility);
    }

    return visibility;
  }

  // 其他方法...
  // (为了简洁，这里只实现了主要方法，其他方法可以类似实现)
}

// 创建Mock数据存储实例
const mockStore = new MockDataStore();

// Mock API客户端
export const mockApiClient = {
  // 认证相关API
  auth: {
    async login(username: string, password: string): Promise<{ user: User }> {
      logMockRequest('POST', '/auth/login', { username });
      await simulateDelay();
      
      // 为登录操作降低错误率
      simulateRandomError({ skipAuth: true });

      const user = mockStore.findUserByUsername(username);
      if (!user) {
        throw new Error('Mock Error 401: Invalid credentials');
      }

      // 如果没有提供密码，或者密码错误，尝试使用默认密码
      if (!password || user.password !== password) {
        // 为便于测试，如果没有密码或密码错误，尝试默认模式
        const defaultPasswords = ['123', 'password', username + '123', username];
        const isValidPassword = defaultPasswords.includes(password) || user.password === password;
        
        if (!isValidPassword && password) {
          throw new Error('Mock Error 401: Invalid credentials');
        }
        
        // 如果没有密码，使用默认逻辑（方便快速测试）
        if (!password) {
          console.warn(`🎭 Mock登录: 用户 "${username}" 使用空密码，自动登录成功 (仅限Mock模式)`);
        }
      }

      const { password: _, ...userWithoutPassword } = user;
      return { user: userWithoutPassword };
    },

    async session(): Promise<{ user: User } | null> {
      logMockRequest('GET', '/auth/session');
      await simulateDelay();
      simulateRandomError({ skipAuth: true });

      // Mock模式下，假设用户已登录，返回第一个用户
      const user = mockStore.users[0];
      if (!user) {
        return null;
      }

      const { password: _, ...userWithoutPassword } = user;
      return { user: userWithoutPassword };
    },
  },

  // 会话相关API
  sessions: {
    async getByInstructor(instructorId: string): Promise<Session[]> {
      logMockRequest('GET', `/sessions/instructor/${instructorId}`);
      await simulateDelay();
      simulateRandomError();
      return mockStore.getSessionsByInstructor(instructorId);
    },

    async getById(sessionId: string): Promise<Session> {
      logMockRequest('GET', `/sessions/${sessionId}`);
      await simulateDelay();
      simulateRandomError();
      
      const session = mockStore.getSessionById(sessionId);
      if (!session) {
        throw new Error('Mock Error 404: Session not found');
      }
      return session;
    },

    async getPatients(sessionId: string): Promise<Patient[]> {
      logMockRequest('GET', `/sessions/${sessionId}/patients`);
      await simulateDelay();
      simulateRandomError();
      const patients = mockStore.getPatientsBySession(sessionId);
      console.log(`🔍 Mock sessions.getPatients(${sessionId}) 返回:`, patients);
      console.log(`🔍 返回数据类型:`, typeof patients, '是否为数组:', Array.isArray(patients));
      return patients;
    },

    async getGroups(sessionId: string): Promise<Group[]> {
      logMockRequest('GET', `/sessions/${sessionId}/groups`);
      await simulateDelay();
      simulateRandomError();
      return mockStore.getGroupsBySession(sessionId);
    },

    async createGroup(sessionId: string, groupData: Omit<Group, 'id' | 'sessionId' | 'createdAt'>): Promise<Group> {
      logMockRequest('POST', `/sessions/${sessionId}/groups`, groupData);
      await simulateDelay();
      simulateRandomError();
      return mockStore.createGroup({ ...groupData, sessionId });
    },

    async getAssets(sessionId: string): Promise<Asset[]> {
      logMockRequest('GET', `/sessions/${sessionId}/assets`);
      await simulateDelay();
      simulateRandomError();
      return mockStore.getAssetsBySession(sessionId);
    },

    async createAsset(sessionId: string, assetData: Omit<Asset, 'id' | 'sessionId' | 'createdAt'>): Promise<Asset> {
      logMockRequest('POST', `/sessions/${sessionId}/assets`, assetData);
      await simulateDelay();
      simulateRandomError();
      return mockStore.createAsset({ ...assetData, sessionId });
    },
  },

  // 患者相关API
  patients: {
    async getById(patientId: string): Promise<Patient> {
      logMockRequest('GET', `/patients/${patientId}`);
      await simulateDelay();
      simulateRandomError();
      
      const patient = mockStore.getPatientById(patientId);
      if (!patient) {
        throw new Error('Mock Error 404: Patient not found');
      }
      return patient;
    },

    async updateById(patientId: string, updates: Partial<Patient>): Promise<Patient> {
      logMockRequest('PATCH', `/patients/${patientId}`, updates);
      await simulateDelay();
      simulateRandomError();
      
      const patient = mockStore.updatePatient(patientId, updates);
      if (!patient) {
        throw new Error('Mock Error 404: Patient not found');
      }
      return patient;
    },

    async getVitals(patientId: string): Promise<VitalSigns[]> {
      logMockRequest('GET', `/patients/${patientId}/vitals`);
      await simulateDelay();
      simulateRandomError();
      return mockStore.getVitalsByPatient(patientId);
    },

    async getLabs(patientId: string): Promise<LabResult[]> {
      logMockRequest('GET', `/patients/${patientId}/labs`);
      await simulateDelay();
      simulateRandomError();
      return mockStore.getLabResultsByPatient(patientId);
    },

    async getHistory(patientId: string): Promise<MedicalHistory[]> {
      logMockRequest('GET', `/patients/${patientId}/history`);
      await simulateDelay();
      simulateRandomError();
      return mockStore.getMedicalHistoryByPatient(patientId);
    },

    async getMedications(patientId: string): Promise<Medication[]> {
      logMockRequest('GET', `/patients/${patientId}/medications`);
      await simulateDelay();
      simulateRandomError();
      return mockStore.getMedicationsByPatient(patientId);
    },

    async getSoapNotes(patientId: string): Promise<SoapNote[]> {
      logMockRequest('GET', `/patients/${patientId}/soap-notes`);
      await simulateDelay();
      simulateRandomError();
      return mockStore.getSoapNotesByPatient(patientId);
    },

    async createSoapNote(patientId: string, noteData: Omit<SoapNote, 'id' | 'patientId' | 'createdAt'>): Promise<SoapNote> {
      logMockRequest('POST', `/patients/${patientId}/soap-notes`, noteData);
      await simulateDelay();
      simulateRandomError();
      return mockStore.createSoapNote({ ...noteData, patientId });
    },

    async getOrders(patientId: string): Promise<Order[]> {
      logMockRequest('GET', `/patients/${patientId}/orders`);
      await simulateDelay();
      simulateRandomError();
      return mockStore.getOrdersByPatient(patientId);
    },

    async createOrder(patientId: string, orderData: Omit<Order, 'id' | 'patientId' | 'createdAt'>): Promise<Order> {
      logMockRequest('POST', `/patients/${patientId}/orders`, orderData);
      await simulateDelay();
      simulateRandomError();
      return mockStore.createOrder({ ...orderData, patientId });
    },
  },

  // 实验室结果相关API
  labResults: {
    async updateById(labId: string, updates: Partial<LabResult>): Promise<LabResult> {
      logMockRequest('PATCH', `/lab-results/${labId}`, updates);
      await simulateDelay();
      simulateRandomError();
      
      const labResult = mockStore.updateLabResult(labId, updates);
      if (!labResult) {
        throw new Error('Mock Error 404: Lab result not found');
      }
      return labResult;
    },
  },

  // 分组相关API
  groups: {
    async getMembers(groupId: string): Promise<GroupMember[]> {
      logMockRequest('GET', `/groups/${groupId}/members`);
      await simulateDelay();
      simulateRandomError();
      return mockStore.getGroupMembers(groupId);
    },

    async addMember(groupId: string, memberData: Omit<GroupMember, 'id' | 'groupId' | 'joinedAt'>): Promise<GroupMember> {
      logMockRequest('POST', `/groups/${groupId}/members`, memberData);
      await simulateDelay();
      simulateRandomError();
      return mockStore.addGroupMember({ ...memberData, groupId });
    },

    async getVisibleAssets(groupId: string): Promise<Asset[]> {
      logMockRequest('GET', `/groups/${groupId}/visible-assets`);
      await simulateDelay();
      simulateRandomError();
      return mockStore.getVisibleAssetsForGroup(groupId);
    },
  },

  // 用户相关API
  users: {
    async getGroups(userId: string): Promise<Group[]> {
      logMockRequest('GET', `/users/${userId}/groups`);
      await simulateDelay();
      simulateRandomError();
      return mockStore.getUserGroups(userId);
    },
  },

  // 资产相关API
  assets: {
    async deleteById(assetId: string): Promise<void> {
      logMockRequest('DELETE', `/assets/${assetId}`);
      await simulateDelay();
      simulateRandomError();
      
      const success = mockStore.deleteAsset(assetId);
      if (!success) {
        throw new Error('Mock Error 404: Asset not found');
      }
    },

    async getVisibility(assetId: string, groupId: string): Promise<AssetGroupVisibility> {
      logMockRequest('GET', `/assets/${assetId}/visibility/${groupId}`);
      await simulateDelay();
      simulateRandomError();
      
      const visibility = mockStore.getAssetVisibility(assetId, groupId);
      if (!visibility) {
        throw new Error('Mock Error 404: Asset visibility not found');
      }
      return visibility;
    },

    async updateVisibility(assetId: string, groupId: string, visible: boolean, changedBy: string): Promise<AssetGroupVisibility> {
      logMockRequest('PUT', `/assets/${assetId}/visibility/${groupId}`, { visible, changedBy });
      await simulateDelay();
      simulateRandomError();
      return mockStore.updateAssetVisibility(assetId, groupId, visible, changedBy);
    },

    async bulkUpdateVisibility(assetIds: string[], groupId: string, visible: boolean, changedBy: string): Promise<void> {
      logMockRequest('PUT', `/assets/bulk-visibility/${groupId}`, { assetIds, visible, changedBy });
      await simulateDelay();
      simulateRandomError();
      
      // 批量更新每个资产的可见性
      assetIds.forEach(assetId => {
        mockStore.updateAssetVisibility(assetId, groupId, visible, changedBy);
      });
    },
  },

  // 系统管理员相关API
  admin: {
    users: {
      async getAll(): Promise<User[]> {
        logMockRequest('GET', '/admin/users');
        await simulateDelay();
        simulateRandomError();
        return mockStore.getAllUsers();
      },

      async create(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
        logMockRequest('POST', '/admin/users', userData);
        await simulateDelay();
        simulateRandomError();
        return mockStore.createUser(userData);
      },

      async updateById(id: string, updates: Partial<User>): Promise<User> {
        logMockRequest('PUT', `/admin/users/${id}`, updates);
        await simulateDelay();
        simulateRandomError();
        
        const user = mockStore.updateUser(id, updates);
        if (!user) {
          throw new Error('Mock Error 404: User not found');
        }
        return user;
      },

      async deleteById(id: string): Promise<void> {
        logMockRequest('DELETE', `/admin/users/${id}`);
        await simulateDelay();
        simulateRandomError();
        
        const success = mockStore.deleteUser(id);
        if (!success) {
          throw new Error('Mock Error 404: User not found');
        }
      },
    },

    // 其他admin API可以类似实现...
    dataVersions: {
      async getAll(): Promise<DataVersion[]> {
        logMockRequest('GET', '/admin/data-versions');
        await simulateDelay();
        simulateRandomError();
        return mockDataVersions;
      },

      async create(versionData: Omit<DataVersion, 'id' | 'createdAt'>): Promise<DataVersion> {
        logMockRequest('POST', '/admin/data-versions', versionData);
        await simulateDelay();
        simulateRandomError();
        
        const version: DataVersion = {
          ...versionData,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date(),
        };
        
        return version;
      },

      async deleteById(id: string): Promise<void> {
        logMockRequest('DELETE', `/admin/data-versions/${id}`);
        await simulateDelay();
        simulateRandomError();
      },
    },

    groupAccounts: {
      async getAll(): Promise<GroupAccount[]> {
        logMockRequest('GET', '/admin/group-accounts');
        await simulateDelay();
        simulateRandomError();
        return mockGroupAccounts;
      },

      async create(accountData: Omit<GroupAccount, 'id' | 'createdAt'>): Promise<GroupAccount> {
        logMockRequest('POST', '/admin/group-accounts', accountData);
        await simulateDelay();
        simulateRandomError();
        
        const account: GroupAccount = {
          ...accountData,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date(),
        };
        
        return account;
      },

      async updateById(id: string, updates: Partial<GroupAccount>): Promise<GroupAccount> {
        logMockRequest('PUT', `/admin/group-accounts/${id}`, updates);
        await simulateDelay();
        simulateRandomError();
        
        // 简单实现，实际应该从mockStore查找和更新
        return { ...mockGroupAccounts[0], ...updates };
      },

      async deactivateById(id: string): Promise<void> {
        logMockRequest('POST', `/admin/group-accounts/${id}/deactivate`);
        await simulateDelay();
        simulateRandomError();
      },
    },

    auditLogs: {
      async getAll(): Promise<AuditLog[]> {
        logMockRequest('GET', '/admin/audit-logs');
        await simulateDelay();
        simulateRandomError();
        return mockAuditLogs;
      },
    },
  },

  // 协调员相关API (简化实现)
  coordinator: {
    documents: {
      async getAll(): Promise<Document[]> {
        logMockRequest('GET', '/coordinator/documents');
        await simulateDelay();
        simulateRandomError();
        return mockDocuments;
      },

      async upload(documentData: any): Promise<Document> {
        logMockRequest('POST', '/coordinator/documents/upload', documentData);
        await simulateDelay();
        simulateRandomError();
        
        const document: Document = {
          id: Math.random().toString(36).substr(2, 9),
          sessionId: documentData.sessionId,
          patientId: documentData.patientId,
          category: documentData.category,
          originalName: documentData.originalName || 'uploaded-file.pdf',
          filePath: `/uploads/${Date.now()}-${documentData.originalName || 'file.pdf'}`,
          fileSize: documentData.fileSize || 1024,
          mimeType: documentData.mimeType || 'application/pdf',
          uploadedBy: 'coordinator-1',
          uploadedAt: new Date(),
        };
        
        return document;
      },

      async deleteById(id: string): Promise<void> {
        logMockRequest('DELETE', `/coordinator/documents/${id}`);
        await simulateDelay();
        simulateRandomError();
      },
    },

    documentReleases: {
      async getAll(): Promise<DocumentRelease[]> {
        logMockRequest('GET', '/coordinator/document-releases');
        await simulateDelay();
        simulateRandomError();
        return mockDocumentReleases;
      },

      async create(releaseData: any): Promise<DocumentRelease> {
        logMockRequest('POST', '/coordinator/document-releases', releaseData);
        await simulateDelay();
        simulateRandomError();
        
        const release: DocumentRelease = {
          ...releaseData,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date(),
        };
        
        return release;
      },

      async release(id: string): Promise<DocumentRelease> {
        logMockRequest('POST', `/coordinator/document-releases/${id}/release`);
        await simulateDelay();
        simulateRandomError();
        
        return {
          ...mockDocumentReleases[0],
          releasedAt: new Date(),
          releasedBy: 'coordinator-1',
        };
      },

      async cancel(id: string): Promise<void> {
        logMockRequest('DELETE', `/coordinator/document-releases/${id}`);
        await simulateDelay();
        simulateRandomError();
      },
    },

    simulationWeeks: {
      async getAll(): Promise<SimulationWeek[]> {
        logMockRequest('GET', '/coordinator/simulation-weeks');
        await simulateDelay();
        simulateRandomError();
        return mockSimulationWeeks;
      },

      async create(weekData: any): Promise<SimulationWeek> {
        logMockRequest('POST', '/coordinator/simulation-weeks', weekData);
        await simulateDelay();
        simulateRandomError();
        
        const week: SimulationWeek = {
          ...weekData,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date(),
        };
        
        return week;
      },

      async activate(id: string): Promise<SimulationWeek> {
        logMockRequest('POST', `/coordinator/simulation-weeks/${id}/activate`);
        await simulateDelay();
        simulateRandomError();
        
        return {
          ...mockSimulationWeeks[0],
          active: true,
        };
      },

      async updateById(id: string, updates: any): Promise<SimulationWeek> {
        logMockRequest('PUT', `/coordinator/simulation-weeks/${id}`, updates);
        await simulateDelay();
        simulateRandomError();
        
        return { ...mockSimulationWeeks[0], ...updates };
      },
    },
  },
};

// 检查是否启用Mock模式
export const isMockEnabled = () => MOCK_CONFIG.enabled;

// 导出配置
export const mockConfig = MOCK_CONFIG;

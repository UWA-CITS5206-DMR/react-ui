import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
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
import { mockApiClient, isMockEnabled } from './mock-api-client';

// 扩展axios配置类型以支持metadata和mock数据
declare module 'axios' {
  interface AxiosRequestConfig {
    metadata?: {
      requestId: string;
      startTime: number;
    };
    mockData?: any;
    isMockRequest?: boolean;
  }
}

// 日志配置
const LOG_CONFIG = {
  enabled: import.meta.env.VITE_API_LOGGING !== 'false', // 默认启用，设置为false时禁用
  detailed: import.meta.env.VITE_API_LOGGING === 'detailed', // 详细模式
};

// 日志辅助函数
const logRequest = (config: AxiosRequestConfig, requestId: string, timestamp: string) => {
  if (!LOG_CONFIG.enabled) return;
  
  if (LOG_CONFIG.detailed) {
    console.group(`🚀 API请求 [${requestId}] - ${timestamp}`);
    console.log(`📍 URL: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    console.log(`📋 Headers:`, config.headers);
    
    if (config.data) {
      console.log(`📝 Request Body:`, config.data);
    }
    
    if (config.params) {
      console.log(`🔍 Query Params:`, config.params);
    }
    
    console.groupEnd();
  } else {
    console.log(`🚀 [${requestId}] ${config.method?.toUpperCase()} ${config.url}`);
  }
};

const logResponse = (response: AxiosResponse, requestId: string, duration: number, timestamp: string) => {
  if (!LOG_CONFIG.enabled) return;
  
  if (LOG_CONFIG.detailed) {
    console.group(`✅ API响应 [${requestId}] - ${timestamp}`);
    console.log(`📍 URL: ${response.config.method?.toUpperCase()} ${response.config.url}`);
    console.log(`📊 Status: ${response.status} ${response.statusText}`);
    console.log(`⏱️ Duration: ${duration}ms`);
    console.log(`📋 Response Headers:`, response.headers);
    console.log(`📦 Response Data:`, response.data);
    console.groupEnd();
  } else {
    console.log(`✅ [${requestId}] ${response.status} - ${duration}ms`);
  }
};

const logError = (error: any, requestId: string, duration: number, timestamp: string) => {
  if (!LOG_CONFIG.enabled) return;
  
  if (LOG_CONFIG.detailed) {
    console.group(`❌ API错误 [${requestId}] - ${timestamp}`);
    console.log(`📍 URL: ${error.config?.method?.toUpperCase()} ${error.config?.url}`);
    console.log(`⏱️ Duration: ${duration}ms`);
    
    if (error.response) {
      console.log(`📊 Status: ${error.response.status} ${error.response.statusText}`);
      console.log(`📋 Response Headers:`, error.response.headers);
      console.log(`📦 Error Data:`, error.response.data);
    } else if (error.request) {
      console.log(`🔌 Network Error: 没有收到响应`);
    } else {
      console.log(`⚙️ Config Error:`, error.message);
    }
    
    console.log(`🔍 Full Error:`, error);
    console.groupEnd();
  } else {
    const status = error.response?.status || 'Network Error';
    console.error(`❌ [${requestId}] ${status} - ${duration}ms - ${error.message}`);
  }
};

// 创建axios实例
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Mock请求拦截器 - 在实际发送请求前拦截Mock请求
apiClient.interceptors.request.use(
  async (config) => {
    // 如果是Mock请求，直接返回Mock数据
    if (config.isMockRequest && config.mockData !== undefined) {
      // 创建一个模拟的响应对象
      const mockResponse = {
        data: config.mockData,
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
        request: {}
      };
      
      // 抛出一个特殊的"错误"，实际上是成功的Mock响应
      return Promise.reject({
        isMockSuccess: true,
        response: mockResponse,
        config
      });
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// 请求拦截器 - 记录所有请求和Mock路由
apiClient.interceptors.request.use(
  async (config) => {
    const timestamp = new Date().toISOString();
    const requestId = Math.random().toString(36).substr(2, 9);
    
    // 在config中保存请求ID和时间戳，用于响应日志
    config.metadata = { requestId, startTime: Date.now() };
    
    // 记录请求日志
    logRequest(config, requestId, timestamp);
    
    // Mock模式下的请求拦截
    console.log(`🔍 请求拦截器: ${config.method?.toUpperCase()} ${config.url}`);
    
    if (isMockEnabled()) {
      const url = config.url || '';
      const method = config.method?.toLowerCase() || 'get';
      
      console.log(`🔍 Mock模式已启用，拦截请求: ${method.toUpperCase()} ${url}`);
      
      // 检查是否应该拦截这个请求
      if (method === 'get') {
        if (url.includes('/coordinator/documents')) {
          console.log(`🔍 拦截协调员文档请求，直接返回Mock数据`);
          // 直接抛出包含Mock数据的"错误"，绕过实际请求
          throw {
            isMockIntercepted: true,
            mockData: mockApiClient.coordinator.documents.getAll(),
            config
          };
        }
      }
    }
    
    return config;
  },
  (error) => {
    if (LOG_CONFIG.enabled) {
      console.error('❌ 请求配置错误:', error);
    }
    return Promise.reject(error);
  }
);

// 响应拦截器 - 记录所有响应和Mock数据拦截
apiClient.interceptors.response.use(
  async (response: AxiosResponse) => {
    const timestamp = new Date().toISOString();
    const { requestId, startTime } = response.config.metadata || {};
    const duration = startTime ? Date.now() - startTime : 0;
    
    // Mock模式下的数据拦截
    if (isMockEnabled()) {
      const url = response.config.url || '';
      const method = response.config.method?.toLowerCase() || 'get';
      
      console.log(`🔍 Mock响应拦截器: ${method.toUpperCase()} ${url}`);
      
      try {
        let mockResult;
        
        // 根据URL匹配返回Mock数据
        if (method === 'get') {
          if (url.includes('/sessions/session-1/patients')) {
            console.log(`🔍 拦截患者列表请求`);
            mockResult = await mockApiClient.sessions.getPatients('session-1');
          } else if (url.includes('/sessions/session-1')) {
            console.log(`🔍 拦截会话详情请求`);
            mockResult = await mockApiClient.sessions.getById('session-1');
          } else if (url.includes('/sessions/instructor/')) {
            const instructorId = 'user-2'; // 默认教师ID
            console.log(`🔍 拦截教师会话列表请求`);
            mockResult = await mockApiClient.sessions.getByInstructor(instructorId);
          } else if (url.includes('/coordinator/documents')) {
            console.log(`🔍 拦截协调员文档列表请求`);
            mockResult = await mockApiClient.coordinator.documents.getAll();
          } else if (url.includes('/coordinator/document-releases')) {
            console.log(`🔍 拦截文档发布列表请求`);
            mockResult = await mockApiClient.coordinator.documentReleases.getAll();
          } else if (url.includes('/coordinator/simulation-weeks')) {
            console.log(`🔍 拦截模拟周列表请求`);
            mockResult = await mockApiClient.coordinator.simulationWeeks.getAll();
          } else if (url.includes('/admin/data-versions')) {
            console.log(`🔍 拦截管理员数据版本列表请求`);
            mockResult = await mockApiClient.admin.dataVersions.getAll();
          } else if (url.includes('/admin/group-accounts')) {
            console.log(`🔍 拦截管理员组账户列表请求`);
            mockResult = await mockApiClient.admin.groupAccounts.getAll();
          } else if (url.includes('/admin/users')) {
            console.log(`🔍 拦截管理员用户列表请求`);
            mockResult = await mockApiClient.admin.users.getAll();
          } else if (url.includes('/admin/audit-logs')) {
            console.log(`🔍 拦截管理员审计日志请求`);
            mockResult = await mockApiClient.admin.auditLogs.getAll();
          } else if (url.includes('/groups/') && url.includes('/members')) {
            const groupId = url.split('/groups/')[1]?.split('/')[0];
            console.log(`🔍 拦截组成员列表请求, groupId: ${groupId}`);
            mockResult = await mockApiClient.groups.getMembers(groupId);
          } else if (url.includes('/groups/') && url.includes('/assets')) {
            const groupId = url.split('/groups/')[1]?.split('/')[0];
            console.log(`🔍 拦截组资产列表请求, groupId: ${groupId}`);
            mockResult = await mockApiClient.groups.getAssets(groupId);
          } else if (url.includes('/patients/') && url.match(/\/patients\/[^\/]+$/)) {
            const patientId = url.split('/').pop();
            console.log(`🔍 拦截患者详情请求, patientId: ${patientId}`);
            mockResult = await mockApiClient.patients.getById(patientId);
          }
          
          if (mockResult !== undefined) {
            console.log(`🔍 Mock响应数据:`, mockResult);
            console.log(`🔍 Mock数据类型:`, typeof mockResult, '是否为数组:', Array.isArray(mockResult));
            
            // 记录Mock响应日志
            const mockResponse = { ...response, data: mockResult };
            logResponse(mockResponse, requestId || 'unknown', duration, timestamp);
            
            return mockResult;
          }
        }
      } catch (error) {
        console.error('🔍 Mock响应拦截器错误:', error);
      }
    }
    
    // 记录响应日志
    logResponse(response, requestId || 'unknown', duration, timestamp);
    
    return response.data;
  },
  async (error) => {
    const timestamp = new Date().toISOString();
    const { requestId, startTime } = error.config?.metadata || {};
    const duration = startTime ? Date.now() - startTime : 0;
    
    // 处理Mock拦截的请求
    if (error.isMockIntercepted) {
      console.log(`🔍 处理Mock拦截请求的响应`);
      try {
        // 执行Mock方法并返回数据
        const mockResult = await error.mockData;
        console.log(`🔍 Mock拦截返回数据:`, mockResult);
        console.log(`🔍 数据类型:`, typeof mockResult, '是否为数组:', Array.isArray(mockResult));
        
        // 构造假的响应对象用于日志记录
        const mockResponse = {
          data: mockResult,
          status: 200,
          statusText: 'OK (Mock)',
          headers: {},
          config: error.config,
        };
        
        logResponse(mockResponse, requestId || 'unknown', duration, timestamp);
        return mockResult;
      } catch (mockError) {
        console.error('🔍 Mock方法执行失败:', mockError);
        throw mockError;
      }
    }
    
    // 处理Mock成功响应
    if (error.isMockSuccess) {
      // 记录Mock响应日志
      logResponse(error.response, requestId || 'unknown', duration, timestamp);
      return error.response.data;
    }
    
    // 处理Mock响应
    if (error.isMockResponse) {
      // 记录Mock响应日志
      logResponse(error.response, requestId || 'unknown', duration, timestamp);
      return error.response.data;
    }
    
    // 处理Mock错误
    if (error.isMockError) {
      // 记录Mock错误日志
      logError(error, requestId || 'unknown', duration, timestamp);
      throw error;
    }
    
    // 记录常规错误日志
    logError(error, requestId || 'unknown', duration, timestamp);
    
    throw error;
  }
);

// 通用类型定义
interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

// 真实API客户端
const realApiClient = {
  // 认证相关API
  auth: {
    async login(username: string, password: string): Promise<{ user: User }> {
      return apiClient.post('/auth/login', { username, password });
    },
  },

  // 会话相关API
  sessions: {
    async getByInstructor(instructorId: string): Promise<Session[]> {
      return apiClient.get(`/sessions/instructor/${instructorId}`);
    },

    async getById(sessionId: string): Promise<Session> {
      return apiClient.get(`/sessions/${sessionId}`);
    },

    async getPatients(sessionId: string): Promise<Patient[]> {
      return apiClient.get(`/sessions/${sessionId}/patients`);
    },

    async getGroups(sessionId: string): Promise<Group[]> {
      return apiClient.get(`/sessions/${sessionId}/groups`);
    },

    async createGroup(sessionId: string, groupData: Omit<Group, 'id' | 'sessionId' | 'createdAt'>): Promise<Group> {
      return apiClient.post(`/sessions/${sessionId}/groups`, groupData);
    },

    async getAssets(sessionId: string): Promise<Asset[]> {
      return apiClient.get(`/sessions/${sessionId}/assets`);
    },

    async createAsset(sessionId: string, assetData: Omit<Asset, 'id' | 'sessionId' | 'createdAt'>): Promise<Asset> {
      return apiClient.post(`/sessions/${sessionId}/assets`, assetData);
    },
  },

  // 患者相关API
  patients: {
    async getById(patientId: string): Promise<Patient> {
      return apiClient.get(`/patients/${patientId}`);
    },

    async updateById(patientId: string, updates: Partial<Patient>): Promise<Patient> {
      return apiClient.patch(`/patients/${patientId}`, updates);
    },

    async getVitals(patientId: string): Promise<VitalSigns[]> {
      return apiClient.get(`/patients/${patientId}/vitals`);
    },

    async getLabs(patientId: string): Promise<LabResult[]> {
      return apiClient.get(`/patients/${patientId}/labs`);
    },

    async getHistory(patientId: string): Promise<MedicalHistory[]> {
      return apiClient.get(`/patients/${patientId}/history`);
    },

    async getMedications(patientId: string): Promise<Medication[]> {
      return apiClient.get(`/patients/${patientId}/medications`);
    },

    async getSoapNotes(patientId: string): Promise<SoapNote[]> {
      return apiClient.get(`/patients/${patientId}/soap-notes`);
    },

    async createSoapNote(patientId: string, noteData: Omit<SoapNote, 'id' | 'patientId' | 'createdAt'>): Promise<SoapNote> {
      return apiClient.post(`/patients/${patientId}/soap-notes`, noteData);
    },

    async getOrders(patientId: string): Promise<Order[]> {
      return apiClient.get(`/patients/${patientId}/orders`);
    },

    async createOrder(patientId: string, orderData: Omit<Order, 'id' | 'patientId' | 'createdAt'>): Promise<Order> {
      return apiClient.post(`/patients/${patientId}/orders`, orderData);
    },
  },

  // 实验室结果相关API
  labResults: {
    async updateById(labId: string, updates: Partial<LabResult>): Promise<LabResult> {
      return apiClient.patch(`/lab-results/${labId}`, updates);
    },
  },

  // 分组相关API
  groups: {
    async getMembers(groupId: string): Promise<GroupMember[]> {
      return apiClient.get(`/groups/${groupId}/members`);
    },

    async addMember(groupId: string, memberData: Omit<GroupMember, 'id' | 'groupId' | 'joinedAt'>): Promise<GroupMember> {
      return apiClient.post(`/groups/${groupId}/members`, memberData);
    },

    async getVisibleAssets(groupId: string): Promise<Asset[]> {
      return apiClient.get(`/groups/${groupId}/visible-assets`);
    },
  },

  // 用户相关API
  users: {
    async getGroups(userId: string): Promise<Group[]> {
      return apiClient.get(`/users/${userId}/groups`);
    },
  },

  // 资产相关API
  assets: {
    async deleteById(assetId: string): Promise<void> {
      return apiClient.delete(`/assets/${assetId}`);
    },

    async getVisibility(assetId: string, groupId: string): Promise<AssetGroupVisibility> {
      return apiClient.get(`/assets/${assetId}/visibility/${groupId}`);
    },

    async updateVisibility(assetId: string, groupId: string, visible: boolean, changedBy: string): Promise<AssetGroupVisibility> {
      return apiClient.put(`/assets/${assetId}/visibility/${groupId}`, { visible, changedBy });
    },

    async bulkUpdateVisibility(assetIds: string[], groupId: string, visible: boolean, changedBy: string): Promise<void> {
      return apiClient.put(`/assets/bulk-visibility/${groupId}`, { assetIds, visible, changedBy });
    },
  },

  // 系统管理员相关API
  admin: {
    users: {
      async getAll(): Promise<User[]> {
        return apiClient.get('/admin/users');
      },

      async create(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
        return apiClient.post('/admin/users', userData);
      },

      async updateById(id: string, updates: Partial<User>): Promise<User> {
        return apiClient.put(`/admin/users/${id}`, updates);
      },

      async deleteById(id: string): Promise<void> {
        return apiClient.delete(`/admin/users/${id}`);
      },
    },

    dataVersions: {
      async getAll(sessionId?: string): Promise<DataVersion[]> {
        const params = sessionId ? { sessionId } : {};
        return apiClient.get('/admin/data-versions', { params });
      },

      async create(versionData: Omit<DataVersion, 'id' | 'createdAt'>): Promise<DataVersion> {
        return apiClient.post('/admin/data-versions', versionData);
      },

      async deleteById(id: string): Promise<void> {
        return apiClient.delete(`/admin/data-versions/${id}`);
      },
    },

    groupAccounts: {
      async getAll(groupId?: string): Promise<GroupAccount[]> {
        const params = groupId ? { groupId } : {};
        return apiClient.get('/admin/group-accounts', { params });
      },

      async create(accountData: Omit<GroupAccount, 'id' | 'createdAt'>): Promise<GroupAccount> {
        return apiClient.post('/admin/group-accounts', accountData);
      },

      async updateById(id: string, updates: Partial<GroupAccount>): Promise<GroupAccount> {
        return apiClient.put(`/admin/group-accounts/${id}`, updates);
      },

      async deactivateById(id: string): Promise<void> {
        return apiClient.post(`/admin/group-accounts/${id}/deactivate`);
      },
    },

    auditLogs: {
      async getAll(entityType?: string, entityId?: string): Promise<AuditLog[]> {
        const params: any = {};
        if (entityType) params.entityType = entityType;
        if (entityId) params.entityId = entityId;
        return apiClient.get('/admin/audit-logs', { params });
      },
    },
  },

  // 协调员相关API
  coordinator: {
    documents: {
      async getAll(sessionId?: string, patientId?: string): Promise<Document[]> {
        const params: any = {};
        if (sessionId) params.sessionId = sessionId;
        if (patientId) params.patientId = patientId;
        return apiClient.get('/coordinator/documents', { params });
      },

      async upload(documentData: {
        sessionId: string;
        patientId?: string;
        category: string;
        originalName?: string;
        fileSize?: number;
        mimeType?: string;
      }): Promise<Document> {
        return apiClient.post('/coordinator/documents/upload', documentData);
      },

      async deleteById(id: string): Promise<void> {
        return apiClient.delete(`/coordinator/documents/${id}`);
      },
    },

    documentReleases: {
      async getAll(groupId?: string): Promise<DocumentRelease[]> {
        const params = groupId ? { groupId } : {};
        return apiClient.get('/coordinator/document-releases', { params });
      },

      async create(releaseData: Omit<DocumentRelease, 'id' | 'createdAt'>): Promise<DocumentRelease> {
        return apiClient.post('/coordinator/document-releases', releaseData);
      },

      async release(id: string): Promise<DocumentRelease> {
        return apiClient.post(`/coordinator/document-releases/${id}/release`);
      },

      async cancel(id: string): Promise<void> {
        return apiClient.delete(`/coordinator/document-releases/${id}`);
      },
    },

    simulationWeeks: {
      async getAll(sessionId?: string): Promise<SimulationWeek[]> {
        const params = sessionId ? { sessionId } : {};
        return apiClient.get('/coordinator/simulation-weeks', { params });
      },

      async create(weekData: Omit<SimulationWeek, 'id' | 'createdAt'>): Promise<SimulationWeek> {
        return apiClient.post('/coordinator/simulation-weeks', weekData);
      },

      async activate(id: string): Promise<SimulationWeek> {
        return apiClient.post(`/coordinator/simulation-weeks/${id}/activate`);
      },

      async updateById(id: string, updates: Partial<SimulationWeek>): Promise<SimulationWeek> {
        return apiClient.put(`/coordinator/simulation-weeks/${id}`, updates);
      },
    },
  },
};

// 根据配置选择API客户端
export const api = isMockEnabled() ? mockApiClient : realApiClient;

export default api;

// 导出用于调试
export { realApiClient, mockApiClient, isMockEnabled };

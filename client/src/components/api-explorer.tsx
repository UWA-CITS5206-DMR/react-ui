import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  ChevronDown, 
  ChevronRight, 
  Database, 
  FileText, 
  Users, 
  Calendar,
  Activity,
  Shield
} from 'lucide-react';

// API Schema定义
interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  parameters?: Record<string, any>;
  responseType: string;
  mockExample?: any;
}

interface ApiGroup {
  name: string;
  icon: React.ReactNode;
  description: string;
  endpoints: ApiEndpoint[];
}

// API Schema数据
const apiSchema: ApiGroup[] = [
  {
    name: 'Sessions',
    icon: <Calendar className="h-4 w-4" />,
    description: '会话管理相关API',
    endpoints: [
      {
        method: 'GET',
        path: '/sessions/instructor/{instructorId}',
        description: '获取教师的会话列表',
        parameters: { instructorId: 'string' },
        responseType: 'Session[]',
        mockExample: [
          { id: 'session-1', name: 'Cardiology Simulation', active: true }
        ]
      },
      {
        method: 'GET',
        path: '/sessions/{sessionId}',
        description: '获取会话详情',
        parameters: { sessionId: 'string' },
        responseType: 'Session'
      },
      {
        method: 'GET',
        path: '/sessions/{sessionId}/patients',
        description: '获取会话中的患者列表',
        parameters: { sessionId: 'string' },
        responseType: 'Patient[]'
      },
      {
        method: 'GET',
        path: '/sessions/{sessionId}/groups',
        description: '获取会话中的小组',
        parameters: { sessionId: 'string' },
        responseType: 'Group[]'
      }
    ]
  },
  {
    name: 'Patients',
    icon: <Users className="h-4 w-4" />,
    description: '患者数据管理API',
    endpoints: [
      {
        method: 'GET',
        path: '/patients/{patientId}',
        description: '获取患者基本信息',
        parameters: { patientId: 'string' },
        responseType: 'Patient'
      },
      {
        method: 'GET',
        path: '/patients/{patientId}/vitals',
        description: '获取患者生命体征',
        parameters: { patientId: 'string' },
        responseType: 'VitalSigns'
      },
      {
        method: 'GET',
        path: '/patients/{patientId}/labs',
        description: '获取患者实验室结果',
        parameters: { patientId: 'string' },
        responseType: 'LabResult[]'
      },
      {
        method: 'GET',
        path: '/patients/{patientId}/history',
        description: '获取患者病史',
        parameters: { patientId: 'string' },
        responseType: 'MedicalHistory[]'
      },
      {
        method: 'GET',
        path: '/patients/{patientId}/medications',
        description: '获取患者用药信息',
        parameters: { patientId: 'string' },
        responseType: 'Medication[]'
      },
      {
        method: 'POST',
        path: '/patients/{patientId}/soap-notes',
        description: '创建SOAP笔记',
        parameters: { patientId: 'string', noteData: 'SoapNoteInput' },
        responseType: 'SoapNote'
      }
    ]
  },
  {
    name: 'Coordinator',
    icon: <FileText className="h-4 w-4" />,
    description: '协调员管理API',
    endpoints: [
      {
        method: 'GET',
        path: '/coordinator/documents',
        description: '获取文档列表',
        responseType: 'Document[]'
      },
      {
        method: 'POST',
        path: '/coordinator/documents/upload',
        description: '上传文档',
        parameters: { documentData: 'DocumentInput' },
        responseType: 'Document'
      },
      {
        method: 'GET',
        path: '/coordinator/document-releases',
        description: '获取文档发布计划',
        responseType: 'DocumentRelease[]'
      },
      {
        method: 'POST',
        path: '/coordinator/document-releases',
        description: '创建文档发布计划',
        parameters: { releaseData: 'DocumentReleaseInput' },
        responseType: 'DocumentRelease'
      }
    ]
  },
  {
    name: 'Admin',
    icon: <Shield className="h-4 w-4" />,
    description: '系统管理API',
    endpoints: [
      {
        method: 'GET',
        path: '/admin/users',
        description: '获取用户列表',
        responseType: 'User[]'
      },
      {
        method: 'POST',
        path: '/admin/users',
        description: '创建用户',
        parameters: { userData: 'UserInput' },
        responseType: 'User'
      },
      {
        method: 'GET',
        path: '/admin/data-versions',
        description: '获取数据版本',
        responseType: 'DataVersion[]'
      },
      {
        method: 'GET',
        path: '/admin/audit-logs',
        description: '获取审计日志',
        responseType: 'AuditLog[]'
      }
    ]
  }
];

// Type Schemas
const typeSchemas = {
  Patient: {
    id: 'string',
    firstName: 'string',
    lastName: 'string',
    mrn: 'string',
    dateOfBirth: 'string',
    gender: 'string',
    status: 'critical | stable | monitoring',
    chiefComplaint: 'string | null'
  },
  VitalSigns: {
    id: 'string',
    patientId: 'string',
    bloodPressure: 'string',
    heartRate: 'number',
    respiratoryRate: 'number',
    temperature: 'string',
    oxygenSaturation: 'number',
    recordedAt: 'Date'
  },
  LabResult: {
    id: 'string',
    patientId: 'string',
    testName: 'string',
    value: 'string | null',
    unit: 'string | null',
    status: 'pending | completed',
    referenceRange: 'string'
  }
};

export default function ApiExplorer() {
  const [selectedGroup, setSelectedGroup] = useState<string>('Sessions');
  const [expandedEndpoints, setExpandedEndpoints] = useState<Set<string>>(new Set());

  const toggleEndpoint = (endpointKey: string) => {
    const newExpanded = new Set(expandedEndpoints);
    if (newExpanded.has(endpointKey)) {
      newExpanded.delete(endpointKey);
    } else {
      newExpanded.add(endpointKey);
    }
    setExpandedEndpoints(newExpanded);
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-blue-100 text-blue-800';
      case 'POST': return 'bg-green-100 text-green-800';
      case 'PUT': return 'bg-yellow-100 text-yellow-800';
      case 'DELETE': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatType = (type: string) => {
    if (typeSchemas[type as keyof typeof typeSchemas]) {
      return (
        <div className="mt-2 p-3 bg-gray-50 rounded border">
          <div className="font-medium text-sm mb-2">{type} Schema:</div>
          <pre className="text-xs overflow-auto">
            {JSON.stringify(typeSchemas[type as keyof typeof typeSchemas], null, 2)}
          </pre>
        </div>
      );
    }
    return <span className="text-blue-600 font-mono text-sm">{type}</span>;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">API Schema Explorer</h1>
          <p className="text-gray-600">
            交互式API文档和Schema可视化工具
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 侧边栏 - API组列表 */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">API Groups</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {apiSchema.map((group) => (
                    <button
                      key={group.name}
                      onClick={() => setSelectedGroup(group.name)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                        selectedGroup === group.name ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                      }`}
                    >
                      {group.icon}
                      <div>
                        <div className="font-medium">{group.name}</div>
                        <div className="text-xs text-gray-500">
                          {group.endpoints.length} endpoints
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 主内容区 - API详情 */}
          <div className="lg:col-span-3">
            {apiSchema
              .filter(group => group.name === selectedGroup)
              .map((group) => (
                <div key={group.name} className="space-y-4">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        {group.icon}
                        <div>
                          <CardTitle>{group.name} API</CardTitle>
                          <p className="text-sm text-gray-600 mt-1">{group.description}</p>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>

                  {/* Endpoints列表 */}
                  <div className="space-y-3">
                    {group.endpoints.map((endpoint, index) => {
                      const endpointKey = `${group.name}-${index}`;
                      const isExpanded = expandedEndpoints.has(endpointKey);
                      
                      return (
                        <Card key={endpointKey} className="overflow-hidden">
                          <Collapsible>
                            <CollapsibleTrigger
                              onClick={() => toggleEndpoint(endpointKey)}
                              className="w-full"
                            >
                              <div className="p-4 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <Badge className={getMethodColor(endpoint.method)}>
                                      {endpoint.method}
                                    </Badge>
                                    <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                                      {endpoint.path}
                                    </code>
                                  </div>
                                  {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                </div>
                                <div className="text-left mt-2">
                                  <p className="text-sm text-gray-600">{endpoint.description}</p>
                                </div>
                              </div>
                            </CollapsibleTrigger>
                            
                            <CollapsibleContent>
                              <div className="px-4 pb-4 border-t bg-gray-50">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                  {/* 参数 */}
                                  {endpoint.parameters && (
                                    <div>
                                      <h4 className="font-medium text-sm mb-2">Parameters:</h4>
                                      <div className="space-y-2">
                                        {Object.entries(endpoint.parameters).map(([key, type]) => (
                                          <div key={key} className="flex items-center gap-2">
                                            <code className="text-xs bg-white px-2 py-1 rounded border">
                                              {key}
                                            </code>
                                            <span className="text-xs text-gray-600">{String(type)}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                  
                                  {/* 响应类型 */}
                                  <div>
                                    <h4 className="font-medium text-sm mb-2">Response Type:</h4>
                                    {formatType(endpoint.responseType)}
                                  </div>
                                </div>

                                {/* Mock示例 */}
                                {endpoint.mockExample && (
                                  <div className="mt-4">
                                    <h4 className="font-medium text-sm mb-2">Mock Example:</h4>
                                    <pre className="text-xs bg-white p-3 rounded border overflow-auto">
                                      {JSON.stringify(endpoint.mockExample, null, 2)}
                                    </pre>
                                  </div>
                                )}
                              </div>
                            </CollapsibleContent>
                          </Collapsible>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

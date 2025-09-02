#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';

interface ApiEndpoint {
  method: string;
  path: string;
  description: string;
  parameters?: Record<string, string>;
  responseType: string;
  group: string;
}

interface ApiSchema {
  endpoints: ApiEndpoint[];
  types: Record<string, any>;
  lastUpdated: string;
}

// 从 api-client.ts 文件中提取 API 信息
function extractApiInfo(): ApiSchema {
  const apiClientPath = path.join(process.cwd(), 'client/src/lib/api-client.ts');
  const schemaPath = path.join(process.cwd(), 'shared/schema.ts');
  
  const apiClientContent = fs.readFileSync(apiClientPath, 'utf-8');
  const schemaContent = fs.readFileSync(schemaPath, 'utf-8');
  
  const endpoints: ApiEndpoint[] = [];
  const types: Record<string, any> = {};
  
  // 提取 API 端点
  const apiMethods = [
    { pattern: /api\.sessions\.(\w+)/g, group: 'Sessions' },
    { pattern: /api\.patients\.(\w+)/g, group: 'Patients' },
    { pattern: /api\.coordinator\.(\w+)/g, group: 'Coordinator' },
    { pattern: /api\.admin\.(\w+)/g, group: 'Admin' },
    { pattern: /api\.groups\.(\w+)/g, group: 'Groups' }
  ];
  
  // 简化的端点提取（实际项目中可以用 AST 解析）
  const knownEndpoints = [
    // Sessions
    { method: 'GET', path: '/sessions/instructor/{instructorId}', description: '获取教师会话列表', responseType: 'Session[]', group: 'Sessions' },
    { method: 'GET', path: '/sessions/{sessionId}', description: '获取会话详情', responseType: 'Session', group: 'Sessions' },
    { method: 'GET', path: '/sessions/{sessionId}/patients', description: '获取会话患者', responseType: 'Patient[]', group: 'Sessions' },
    { method: 'GET', path: '/sessions/{sessionId}/groups', description: '获取会话小组', responseType: 'Group[]', group: 'Sessions' },
    
    // Patients
    { method: 'GET', path: '/patients/{patientId}', description: '获取患者信息', responseType: 'Patient', group: 'Patients' },
    { method: 'GET', path: '/patients/{patientId}/vitals', description: '获取生命体征', responseType: 'VitalSigns', group: 'Patients' },
    { method: 'GET', path: '/patients/{patientId}/labs', description: '获取实验室结果', responseType: 'LabResult[]', group: 'Patients' },
    { method: 'GET', path: '/patients/{patientId}/history', description: '获取病史', responseType: 'MedicalHistory[]', group: 'Patients' },
    { method: 'GET', path: '/patients/{patientId}/medications', description: '获取用药信息', responseType: 'Medication[]', group: 'Patients' },
    { method: 'GET', path: '/patients/{patientId}/soap-notes', description: '获取SOAP笔记', responseType: 'SoapNote[]', group: 'Patients' },
    { method: 'POST', path: '/patients/{patientId}/soap-notes', description: '创建SOAP笔记', responseType: 'SoapNote', group: 'Patients' },
    
    // Coordinator
    { method: 'GET', path: '/coordinator/documents', description: '获取文档列表', responseType: 'Document[]', group: 'Coordinator' },
    { method: 'POST', path: '/coordinator/documents/upload', description: '上传文档', responseType: 'Document', group: 'Coordinator' },
    { method: 'GET', path: '/coordinator/document-releases', description: '获取发布计划', responseType: 'DocumentRelease[]', group: 'Coordinator' },
    { method: 'POST', path: '/coordinator/document-releases', description: '创建发布计划', responseType: 'DocumentRelease', group: 'Coordinator' },
    
    // Admin
    { method: 'GET', path: '/admin/users', description: '获取用户列表', responseType: 'User[]', group: 'Admin' },
    { method: 'POST', path: '/admin/users', description: '创建用户', responseType: 'User', group: 'Admin' },
    { method: 'DELETE', path: '/admin/users/{id}', description: '删除用户', responseType: 'void', group: 'Admin' },
    { method: 'GET', path: '/admin/data-versions', description: '获取数据版本', responseType: 'DataVersion[]', group: 'Admin' },
    { method: 'GET', path: '/admin/audit-logs', description: '获取审计日志', responseType: 'AuditLog[]', group: 'Admin' }
  ];
  
  endpoints.push(...knownEndpoints);
  
  // 从 schema.ts 提取类型定义（简化版）
  const typeMatches = schemaContent.match(/export type (\w+) = .+;/g) || [];
  typeMatches.forEach(match => {
    const typeName = match.match(/export type (\w+)/)?.[1];
    if (typeName) {
      types[typeName] = `来自 shared/schema.ts 的类型定义`;
    }
  });
  
  return {
    endpoints,
    types,
    lastUpdated: new Date().toISOString()
  };
}

// 生成 JSON schema 文件
function generateSchema() {
  console.log('🔍 正在分析 API 客户端代码...');
  
  const schema = extractApiInfo();
  const outputPath = path.join(process.cwd(), 'docs/api-schema.json');
  
  // 确保目录存在
  const docsDir = path.dirname(outputPath);
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }
  
  fs.writeFileSync(outputPath, JSON.stringify(schema, null, 2));
  
  console.log(`✅ API Schema 已生成: ${outputPath}`);
  console.log(`📊 包含 ${schema.endpoints.length} 个端点`);
  console.log(`🏷️  包含 ${Object.keys(schema.types).length} 个类型`);
}

// 生成 OpenAPI 格式的文档
function generateOpenApiSchema() {
  const schema = extractApiInfo();
  
  const openApiSchema = {
    openapi: '3.0.0',
    info: {
      title: 'Medical Simulation Platform API',
      version: '1.0.0',
      description: '医疗模拟平台 API 文档'
    },
    servers: [
      {
        url: 'http://localhost:5173/api',
        description: '开发服务器'
      }
    ],
    paths: {} as Record<string, any>,
    components: {
      schemas: {} as Record<string, any>
    }
  };
  
  // 转换端点为 OpenAPI 格式
  schema.endpoints.forEach(endpoint => {
    const pathKey = endpoint.path.replace(/{(\w+)}/g, '{$1}');
    
    if (!openApiSchema.paths[pathKey]) {
      openApiSchema.paths[pathKey] = {};
    }
    
    openApiSchema.paths[pathKey][endpoint.method.toLowerCase()] = {
      summary: endpoint.description,
      tags: [endpoint.group],
      responses: {
        '200': {
          description: 'Success',
          content: {
            'application/json': {
              schema: {
                type: endpoint.responseType.includes('[]') ? 'array' : 'object',
                items: endpoint.responseType.includes('[]') ? {
                  $ref: `#/components/schemas/${endpoint.responseType.replace('[]', '')}`
                } : undefined,
                $ref: !endpoint.responseType.includes('[]') ? `#/components/schemas/${endpoint.responseType}` : undefined
              }
            }
          }
        }
      }
    };
  });
  
  // 添加基础 schema 定义
  openApiSchema.components.schemas = {
    Patient: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        mrn: { type: 'string' },
        status: { type: 'string', enum: ['critical', 'stable', 'monitoring'] }
      }
    },
    Session: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        active: { type: 'boolean' }
      }
    }
    // 可以添加更多类型定义...
  };
  
  const outputPath = path.join(process.cwd(), 'docs/openapi.json');
  fs.writeFileSync(outputPath, JSON.stringify(openApiSchema, null, 2));
  
  console.log(`📋 OpenAPI Schema 已生成: ${outputPath}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  generateSchema();
  generateOpenApiSchema();
}

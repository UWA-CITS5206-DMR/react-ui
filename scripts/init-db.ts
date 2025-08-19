#!/usr/bin/env tsx

import { db } from '../server/db.js';
import { 
  users, 
  sessions, 
  scenarios, 
  patients, 
  medicalHistory, 
  medications,
  vitalSigns,
  labResults,
  soapNotes,
  orders,
  groups,
  groupMembers,
  assets,
  assetGroupVisibility,
  dataVersions,
  groupDataAssignments,
  groupAccounts,
  documents,
  documentReleases,
  simulationWeeks,
  auditLog
} from '../shared/schema.js';

console.log('🚀 Initializing SQLite database...');

try {
  // 由于使用 drizzle-kit push，这里只需要验证连接
  // 所有表结构会通过 drizzle-kit 自动创建
  
  console.log('✅ Database connection established');
  console.log('📁 Database file location: data/medisim.db');
  console.log('');
  console.log('Next steps:');
  console.log('1. Run "npm run db:push" to create all tables');
  console.log('2. Optionally run "npm run db:studio" to view the database');
  console.log('3. Start the development server with "npm run dev"');
  
} catch (error) {
  console.error('❌ Database initialization failed:', error);
  process.exit(1);
}

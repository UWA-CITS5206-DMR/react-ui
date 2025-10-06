import { 
  type User, 
  type InsertUser, 
  type Session, 
  type InsertSession, 
  type Patient, 
  type InsertPatient,
  type VitalSigns,
  type InsertVitalSigns,
  type LabResult,
  type InsertLabResult,
  type SoapNote,
  type InsertSoapNote,
  type Order,
  type InsertOrder,
  type MedicalHistory,
  type InsertMedicalHistory,
  type Medication,
  type InsertMedication,
  type Group,
  type InsertGroup,
  type GroupMember,
  type InsertGroupMember,
  type Asset,
  type InsertAsset,
  type AssetGroupVisibility,
  type InsertAssetGroupVisibility,
  type DataVersion,
  type InsertDataVersion,
  type GroupDataAssignment,
  type InsertGroupDataAssignment,
  type GroupAccount,
  type InsertGroupAccount,
  type Document,
  type InsertDocument,
  type DocumentRelease,
  type InsertDocumentRelease,
  type SimulationWeek,
  type InsertSimulationWeek,
  type AuditLog,
  type InsertAuditLog
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User management
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Session management
  createSession(session: InsertSession): Promise<Session>;
  getSession(id: string): Promise<Session | undefined>;
  updateSession(id: string, updates: Partial<Session>): Promise<Session | undefined>;
  getActiveSessionsByInstructor(instructorId: string): Promise<Session[]>;
  
  // Patient management
  createPatient(patient: InsertPatient): Promise<Patient>;
  getPatient(id: string): Promise<Patient | undefined>;
  getPatientsBySession(sessionId: string): Promise<Patient[]>;
  updatePatient(id: string, updates: Partial<Patient>): Promise<Patient | undefined>;
  deletePatient(id: string): Promise<boolean>;
  
  // Vital signs
  createVitalSigns(vitals: InsertVitalSigns): Promise<VitalSigns>;
  getLatestVitals(patientId: string): Promise<VitalSigns | undefined>;
  getVitalHistory(patientId: string): Promise<VitalSigns[]>;
  
  // Lab results
  createLabResult(labResult: InsertLabResult): Promise<LabResult>;
  getLabResults(patientId: string): Promise<LabResult[]>;
  updateLabResult(id: string, updates: Partial<LabResult>): Promise<LabResult | undefined>;
  
  // SOAP notes
  createSoapNote(soapNote: InsertSoapNote): Promise<SoapNote>;
  getSoapNotes(patientId: string): Promise<SoapNote[]>;
  
  // Orders
  createOrder(order: InsertOrder): Promise<Order>;
  getOrders(patientId: string): Promise<Order[]>;
  updateOrder(id: string, updates: Partial<Order>): Promise<Order | undefined>;
  
  // Medical history
  createMedicalHistory(history: InsertMedicalHistory): Promise<MedicalHistory>;
  getMedicalHistory(patientId: string): Promise<MedicalHistory[]>;
  
  // Medications
  createMedication(medication: InsertMedication): Promise<Medication>;
  getMedications(patientId: string): Promise<Medication[]>;
  
  // Groups
  createGroup(group: InsertGroup): Promise<Group>;
  getGroup(id: string): Promise<Group | undefined>;
  getGroupsBySession(sessionId: string): Promise<Group[]>;
  
  // Group Members
  addGroupMember(member: InsertGroupMember): Promise<GroupMember>;
  removeGroupMember(groupId: string, userId: string): Promise<void>;
  getGroupMembers(groupId: string): Promise<GroupMember[]>;
  getUserGroups(userId: string): Promise<Group[]>;
  
  // Assets
  createAsset(asset: InsertAsset): Promise<Asset>;
  getAsset(id: string): Promise<Asset | undefined>;
  getAssetsBySession(sessionId: string): Promise<Asset[]>;
  deleteAsset(id: string): Promise<void>;
  
  // Asset Group Visibility
  setAssetVisibility(visibility: InsertAssetGroupVisibility): Promise<AssetGroupVisibility>;
  getAssetVisibility(assetId: string, groupId: string): Promise<AssetGroupVisibility | undefined>;
  getVisibleAssetsForGroup(groupId: string): Promise<Asset[]>;
  updateAssetVisibility(assetId: string, groupId: string, visible: boolean, changedBy: string): Promise<AssetGroupVisibility>;
  bulkUpdateAssetVisibility(assetIds: string[], groupId: string, visible: boolean, changedBy: string): Promise<void>;

  // System Admin: Data Versioning
  createDataVersion(dataVersion: InsertDataVersion): Promise<DataVersion>;
  getDataVersions(sessionId: string): Promise<DataVersion[]>;
  getDataVersion(id: string): Promise<DataVersion | undefined>;
  deleteDataVersion(id: string): Promise<void>;

  // System Admin: Group Data Assignments
  assignGroupData(assignment: InsertGroupDataAssignment): Promise<GroupDataAssignment>;
  getGroupDataAssignments(groupId: string): Promise<GroupDataAssignment[]>;
  removeGroupDataAssignment(groupId: string, patientId: string): Promise<void>;

  // System Admin: Group Account Management
  createGroupAccount(account: InsertGroupAccount): Promise<GroupAccount>;
  getGroupAccounts(groupId?: string): Promise<GroupAccount[]>;
  getGroupAccount(id: string): Promise<GroupAccount | undefined>;
  updateGroupAccount(id: string, updates: Partial<GroupAccount>): Promise<GroupAccount | undefined>;
  deactivateGroupAccount(id: string): Promise<void>;

  // System Admin: User Management
  getAllUsers(): Promise<User[]>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  deleteUser(id: string): Promise<void>;

  // Simulation Coordinator: Document Management
  uploadDocument(document: InsertDocument): Promise<Document>;
  getDocuments(sessionId: string, patientId?: string): Promise<Document[]>;
  getDocument(id: string): Promise<Document | undefined>;
  deleteDocument(id: string): Promise<void>;

  // Simulation Coordinator: Document Release Management
  scheduleDocumentRelease(release: InsertDocumentRelease): Promise<DocumentRelease>;
  getDocumentReleases(groupId?: string): Promise<DocumentRelease[]>;
  releaseDocument(releaseId: string, releasedBy: string): Promise<DocumentRelease>;
  cancelDocumentRelease(releaseId: string): Promise<void>;
  getReleasedDocumentsForGroup(groupId: string): Promise<Document[]>;

  // Simulation Coordinator: Simulation Week Management
  createSimulationWeek(week: InsertSimulationWeek): Promise<SimulationWeek>;
  getSimulationWeeks(sessionId: string): Promise<SimulationWeek[]>;
  getActiveSimulationWeek(sessionId: string): Promise<SimulationWeek | undefined>;
  activateSimulationWeek(weekId: string): Promise<SimulationWeek>;
  updateSimulationWeek(id: string, updates: Partial<SimulationWeek>): Promise<SimulationWeek | undefined>;

  // System Admin: Audit Trail
  logActivity(log: InsertAuditLog): Promise<AuditLog>;
  getAuditLogs(entityType?: string, entityId?: string): Promise<AuditLog[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private sessions: Map<string, Session> = new Map();
  private patients: Map<string, Patient> = new Map();
  private vitalSigns: Map<string, VitalSigns> = new Map();
  private labResults: Map<string, LabResult> = new Map();
  private soapNotes: Map<string, SoapNote> = new Map();
  private orders: Map<string, Order> = new Map();
  private medicalHistory: Map<string, MedicalHistory> = new Map();
  private medications: Map<string, Medication> = new Map();
  private groups: Map<string, Group> = new Map();
  private groupMembers: Map<string, GroupMember> = new Map();
  private assets: Map<string, Asset> = new Map();
  private assetGroupVisibility: Map<string, AssetGroupVisibility> = new Map();
  
  // New storage for System Admin and Simulation Coordinator features
  private dataVersions: Map<string, DataVersion> = new Map();
  private groupDataAssignments: Map<string, GroupDataAssignment> = new Map();
  private groupAccounts: Map<string, GroupAccount> = new Map();
  private documents: Map<string, Document> = new Map();
  private documentReleases: Map<string, DocumentRelease> = new Map();
  private simulationWeeks: Map<string, SimulationWeek> = new Map();
  private auditLogs: Map<string, AuditLog> = new Map();

  constructor() {
    this.initializeTestData();
  }

  private initializeTestData() {
    // Create test instructor
    const instructor: User = {
      id: "instructor-1",
      username: "instructor",
      password: "password",
      role: "instructor",
      firstName: "Dr. Sarah",
      lastName: "Chen",
      createdAt: new Date(),
    };
    this.users.set(instructor.id, instructor);

    // Create test students
    const student1: User = {
      id: "student-1",
      username: "student",
      password: "password",
      role: "student",
      firstName: "Alex",
      lastName: "Johnson",
      createdAt: new Date(),
    };
    this.users.set(student1.id, student1);

    const student2: User = {
      id: "student-2",
      username: "student2",
      password: "password",
      role: "student",
      firstName: "Emma",
      lastName: "Davis",
      createdAt: new Date(),
    };
    this.users.set(student2.id, student2);

    const student3: User = {
      id: "student-3",
      username: "student3",
      password: "password",
      role: "student",
      firstName: "Michael",
      lastName: "Wilson",
      createdAt: new Date(),
    };
    this.users.set(student3.id, student3);

    // Create System Admin
    const admin: User = {
      id: "admin-1",
      username: "admin",
      password: "password",
      role: "admin",
      firstName: "Dr. James",
      lastName: "Rodriguez",
      createdAt: new Date(),
    };
    this.users.set(admin.id, admin);

    // Create Simulation Coordinator
    const coordinator: User = {
      id: "coordinator-1",
      username: "coordinator",
      password: "password",
      role: "coordinator",
      firstName: "Lisa",
      lastName: "Thompson",
      createdAt: new Date(),
    };
    this.users.set(coordinator.id, coordinator);

    // Create test session
    const session: Session = {
      id: "session-1",
      name: "Emergency Department Scenario",
      instructorId: instructor.id,
      scenarioId: null,
      active: true,
      timeRemaining: 45,
      createdAt: new Date(),
    };
    this.sessions.set(session.id, session);

    // Create test groups
    const group1: Group = {
      id: "group-1",
      name: "Mon_AM_WardA",
      description: "Monday Morning Ward A Team",
      sessionId: session.id,
      createdAt: new Date(),
    };
    this.groups.set(group1.id, group1);

    const group2: Group = {
      id: "group-2",
      name: "Mon_PM_WardB",
      description: "Monday Afternoon Ward B Team",
      sessionId: session.id,
      createdAt: new Date(),
    };
    this.groups.set(group2.id, group2);

    // Add students to groups
    const groupMember1: GroupMember = {
      id: "gm-1",
      groupId: group1.id,
      userId: student1.id,
      joinedAt: new Date(),
    };
    this.groupMembers.set(groupMember1.id, groupMember1);

    const groupMember2: GroupMember = {
      id: "gm-2",
      groupId: group2.id,
      userId: student2.id,
      joinedAt: new Date(),
    };
    this.groupMembers.set(groupMember2.id, groupMember2);

    const groupMember3: GroupMember = {
      id: "gm-3",
      groupId: group2.id,
      userId: student3.id,
      joinedAt: new Date(),
    };
    this.groupMembers.set(groupMember3.id, groupMember3);

    // Create test assets
    const asset1: Asset = {
      id: "asset-1",
      filename: "chest_xray_report.pdf",
      type: "pdf",
      filePath: "/uploads/chest_xray_report.pdf",
      sessionId: session.id,
      uploadedBy: instructor.id,
      uploadedAt: new Date(),
    };
    this.assets.set(asset1.id, asset1);

    const asset2: Asset = {
      id: "asset-2",
      filename: "lab_results_complete.pdf",
      type: "lab",
      filePath: "/uploads/lab_results_complete.pdf",
      sessionId: session.id,
      uploadedBy: instructor.id,
      uploadedAt: new Date(),
    };
    this.assets.set(asset2.id, asset2);

    const asset3: Asset = {
      id: "asset-3",
      filename: "ecg_reading.png",
      type: "image",
      filePath: "/uploads/ecg_reading.png",
      sessionId: session.id,
      uploadedBy: instructor.id,
      uploadedAt: new Date(),
    };
    this.assets.set(asset3.id, asset3);

    // Set initial visibility (asset1 visible to group1, asset2 hidden from both groups, asset3 visible to both)
    const visibility1: AssetGroupVisibility = {
      id: "vis-1",
      assetId: asset1.id,
      groupId: group1.id,
      visible: true,
      changedBy: instructor.id,
      changedAt: new Date(),
    };
    this.assetGroupVisibility.set(visibility1.id, visibility1);

    const visibility2: AssetGroupVisibility = {
      id: "vis-2",
      assetId: asset1.id,
      groupId: group2.id,
      visible: false,
      changedBy: instructor.id,
      changedAt: new Date(),
    };
    this.assetGroupVisibility.set(visibility2.id, visibility2);

    const visibility3: AssetGroupVisibility = {
      id: "vis-3",
      assetId: asset2.id,
      groupId: group1.id,
      visible: false,
      changedBy: instructor.id,
      changedAt: new Date(),
    };
    this.assetGroupVisibility.set(visibility3.id, visibility3);

    const visibility4: AssetGroupVisibility = {
      id: "vis-4",
      assetId: asset2.id,
      groupId: group2.id,
      visible: false,
      changedBy: instructor.id,
      changedAt: new Date(),
    };
    this.assetGroupVisibility.set(visibility4.id, visibility4);

    const visibility5: AssetGroupVisibility = {
      id: "vis-5",
      assetId: asset3.id,
      groupId: group1.id,
      visible: true,
      changedBy: instructor.id,
      changedAt: new Date(),
    };
    this.assetGroupVisibility.set(visibility5.id, visibility5);

    const visibility6: AssetGroupVisibility = {
      id: "vis-6",
      assetId: asset3.id,
      groupId: group2.id,
      visible: true,
      changedBy: instructor.id,
      changedAt: new Date(),
    };
    this.assetGroupVisibility.set(visibility6.id, visibility6);

    // Create test patients with comprehensive medical data
    const patient1: Patient = {
      id: "patient-1",
      mrn: "12345678",
      firstName: "Jane",
      lastName: "Mitchell",
      dateOfBirth: "1978-03-15",
      gender: "Female",
      location: "Emergency Department - Bed 3",
      status: "critical",
      chiefComplaint: "Severe chest pain and difficulty breathing for the past 2 hours. Patient reports crushing chest pain radiating to left arm, associated with nausea and diaphoresis. Pain started abruptly while climbing stairs at home.",
      sessionId: session.id,
      createdAt: new Date(),
    };
    this.patients.set(patient1.id, patient1);

    const patient2: Patient = {
      id: "patient-2",
      mrn: "87654321",
      firstName: "Robert",
      lastName: "Johnson",
      dateOfBirth: "1956-08-22",
      gender: "Male",
      location: "Emergency Department - Bed 7",
      status: "stable",
      chiefComplaint: "Chest pain on exertion",
      sessionId: session.id,
      createdAt: new Date(),
    };
    this.patients.set(patient2.id, patient2);

    // Create vital signs for patient 1
    const vitals1: VitalSigns = {
      id: "vitals-1",
      patientId: patient1.id,
      bloodPressure: "165/95",
      heartRate: 112,
      respiratoryRate: 24,
      temperature: "98.6°F",
      oxygenSaturation: 92,
      recordedAt: new Date(),
      recordedBy: instructor.id,
    };
    this.vitalSigns.set(vitals1.id, vitals1);

    // Create lab results for patient 1
    const labResult1: LabResult = {
      id: "lab-1",
      patientId: patient1.id,
      testName: "Glucose",
      value: "245",
      unit: "mg/dL",
      referenceRange: "70-100",
      status: "completed",
      orderedAt: new Date(),
      completedAt: new Date(),
      orderedBy: instructor.id,
    };
    this.labResults.set(labResult1.id, labResult1);

    const labResult2: LabResult = {
      id: "lab-2",
      patientId: patient1.id,
      testName: "Troponin",
      value: "",
      unit: "ng/mL",
      referenceRange: "<0.04",
      status: "pending",
      orderedAt: new Date(),
      completedAt: null,
      orderedBy: instructor.id,
    };
    this.labResults.set(labResult2.id, labResult2);

    // Create medical history for patient 1
    const history1: MedicalHistory = {
      id: "history-1",
      patientId: patient1.id,
      condition: "Hypertension",
      diagnosedYear: "2018",
      notes: "Well controlled with medication",
    };
    this.medicalHistory.set(history1.id, history1);

    const history2: MedicalHistory = {
      id: "history-2",
      patientId: patient1.id,
      condition: "Type 2 Diabetes",
      diagnosedYear: "2020",
      notes: "Managed with metformin",
    };
    this.medicalHistory.set(history2.id, history2);

    // Create comprehensive medications for patient 1 (Jane Mitchell)
    const medication1: Medication = {
      id: "med-1",
      patientId: patient1.id,
      name: "Lisinopril",
      dosage: "10mg",
      frequency: "daily",
      prescribedBy: instructor.id,
      prescribedAt: new Date(),
    };
    this.medications.set(medication1.id, medication1);

    const medication2: Medication = {
      id: "med-2",
      patientId: patient1.id,
      name: "Metformin",
      dosage: "500mg",
      frequency: "twice daily",
      prescribedBy: instructor.id,
      prescribedAt: new Date(),
    };
    this.medications.set(medication2.id, medication2);

    const medication3: Medication = {
      id: "med-3",
      patientId: patient1.id,
      name: "Atorvastatin",
      dosage: "20mg",
      frequency: "daily at bedtime",
      prescribedBy: instructor.id,
      prescribedAt: new Date(),
    };
    this.medications.set(medication3.id, medication3);

    const medication4: Medication = {
      id: "med-4",
      patientId: patient1.id,
      name: "Aspirin",
      dosage: "81mg",
      frequency: "daily",
      prescribedBy: instructor.id,
      prescribedAt: new Date(),
    };
    this.medications.set(medication4.id, medication4);

    // Add comprehensive lab results for Jane Mitchell
    const labResult3: LabResult = {
      id: "lab-3",
      patientId: patient1.id,
      testName: "Complete Blood Count (CBC)",
      value: "WBC: 11.2, RBC: 4.1, Hgb: 12.8, Hct: 38.5, Plt: 285",
      unit: "various",
      referenceRange: "WBC: 4.0-11.0, RBC: 4.2-5.4, Hgb: 12-15.5, Hct: 36-46, Plt: 150-400",
      status: "completed",
      orderedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      completedAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
      orderedBy: instructor.id,
    };
    this.labResults.set(labResult3.id, labResult3);

    const labResult4: LabResult = {
      id: "lab-4",
      patientId: patient1.id,
      testName: "Basic Metabolic Panel (BMP)",
      value: "Na: 142, K: 4.1, Cl: 105, CO2: 22, BUN: 18, Cr: 1.1, Glucose: 245",
      unit: "various",
      referenceRange: "Na: 136-145, K: 3.5-5.0, Cl: 98-107, CO2: 22-28, BUN: 7-20, Cr: 0.6-1.2, Glucose: 70-100",
      status: "completed",
      orderedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      completedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      orderedBy: instructor.id,
    };
    this.labResults.set(labResult4.id, labResult4);

    const labResult5: LabResult = {
      id: "lab-5",
      patientId: patient1.id,
      testName: "Lipid Panel",
      value: "Total Cholesterol: 245, HDL: 38, LDL: 165, Triglycerides: 210",
      unit: "mg/dL",
      referenceRange: "Total: <200, HDL: >40, LDL: <100, Triglycerides: <150",
      status: "completed",
      orderedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
      completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      orderedBy: instructor.id,
    };
    this.labResults.set(labResult5.id, labResult5);

    const labResult6: LabResult = {
      id: "lab-6",
      patientId: patient1.id,
      testName: "Cardiac Enzymes - CK-MB",
      value: "8.2",
      unit: "ng/mL",
      referenceRange: "0.0-6.3",
      status: "completed",
      orderedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      completedAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      orderedBy: instructor.id,
    };
    this.labResults.set(labResult6.id, labResult6);

    const labResult7: LabResult = {
      id: "lab-7",
      patientId: patient1.id,
      testName: "PT/INR",
      value: "12.5 / 1.1",
      unit: "seconds / ratio",
      referenceRange: "11.0-13.0 / 0.8-1.2",
      status: "completed",
      orderedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      completedAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
      orderedBy: instructor.id,
    };
    this.labResults.set(labResult7.id, labResult7);

    // Add additional medical history for Jane Mitchell
    const history3: MedicalHistory = {
      id: "history-3",
      patientId: patient1.id,
      condition: "Hyperlipidemia",
      diagnosedYear: "2019",
      notes: "Elevated cholesterol levels, managed with statin therapy",
    };
    this.medicalHistory.set(history3.id, history3);

    const history4: MedicalHistory = {
      id: "history-4",
      patientId: patient1.id,
      condition: "Family History of CAD",
      diagnosedYear: "N/A",
      notes: "Father had MI at age 58, Mother has hypertension",
    };
    this.medicalHistory.set(history4.id, history4);

    const history5: MedicalHistory = {
      id: "history-5",
      patientId: patient1.id,
      condition: "Tobacco Use",
      diagnosedYear: "1995",
      notes: "Former smoker, quit 5 years ago. 20 pack-year history",
    };
    this.medicalHistory.set(history5.id, history5);
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }

  async createSession(insertSession: InsertSession): Promise<Session> {
    const id = randomUUID();
    const session: Session = { ...insertSession, id, createdAt: new Date() };
    this.sessions.set(id, session);
    return session;
  }

  async getSession(id: string): Promise<Session | undefined> {
    return this.sessions.get(id);
  }

  async updateSession(id: string, updates: Partial<Session>): Promise<Session | undefined> {
    const session = this.sessions.get(id);
    if (!session) return undefined;
    const updatedSession = { ...session, ...updates };
    this.sessions.set(id, updatedSession);
    return updatedSession;
  }

  async getActiveSessionsByInstructor(instructorId: string): Promise<Session[]> {
    return Array.from(this.sessions.values()).filter(
      session => session.instructorId === instructorId && session.active
    );
  }

  async createPatient(insertPatient: InsertPatient): Promise<Patient> {
    const id = randomUUID();
    const patient: Patient = { ...insertPatient, id, createdAt: new Date() };
    this.patients.set(id, patient);
    return patient;
  }

  async getPatient(id: string): Promise<Patient | undefined> {
    return this.patients.get(id);
  }

  async getPatientsBySession(sessionId: string): Promise<Patient[]> {
    return Array.from(this.patients.values()).filter(
      patient => patient.sessionId === sessionId
    );
  }

  async updatePatient(id: string, updates: Partial<Patient>): Promise<Patient | undefined> {
    const patient = this.patients.get(id);
    if (!patient) return undefined;
    const updatedPatient = { ...patient, ...updates };
    this.patients.set(id, updatedPatient);
    return updatedPatient;
  }
  async deletePatient(id: string): Promise<boolean> {
  // Manual cascade delete for in-memory storage
  const patient = this.patients.get(id);
  if (!patient) return false;
  
  // Delete all related records
  this.deleteRelatedRecords('medicalHistory', 'patientId', id);
  this.deleteRelatedRecords('medications', 'patientId', id);
  this.deleteRelatedRecords('vitalSigns', 'patientId', id);
  this.deleteRelatedRecords('labResults', 'patientId', id);
  this.deleteRelatedRecords('soapNotes', 'patientId', id);
  this.deleteRelatedRecords('orders', 'patientId', id);
  this.deleteRelatedRecords('groupDataAssignments', 'patientId', id);
  this.deleteRelatedRecords('documents', 'patientId', id);
  
  // Finally delete the patient
  return this.patients.delete(id);
}

private deleteRelatedRecords(collectionName: string, field: string, value: string): void {
  const collection = (this as any)[collectionName] as Map<string, any>;
  if (collection) {
    for (const [key, record] of collection.entries()) {
      if (record[field] === value) {
        collection.delete(key);
      }
    }
  }
}

  async createVitalSigns(insertVitals: InsertVitalSigns): Promise<VitalSigns> {
    const id = randomUUID();
    const vitals: VitalSigns = { ...insertVitals, id, recordedAt: new Date() };
    this.vitalSigns.set(id, vitals);
    return vitals;
  }

  async getLatestVitals(patientId: string): Promise<VitalSigns | undefined> {
    const vitals = Array.from(this.vitalSigns.values())
      .filter(v => v.patientId === patientId)
      .sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime());
    return vitals[0];
  }

  async getVitalHistory(patientId: string): Promise<VitalSigns[]> {
    return Array.from(this.vitalSigns.values())
      .filter(v => v.patientId === patientId)
      .sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime());
  }

  async createLabResult(insertLabResult: InsertLabResult): Promise<LabResult> {
    const id = randomUUID();
    const labResult: LabResult = { ...insertLabResult, id, orderedAt: new Date() };
    this.labResults.set(id, labResult);
    return labResult;
  }

  async getLabResults(patientId: string): Promise<LabResult[]> {
    return Array.from(this.labResults.values()).filter(
      lab => lab.patientId === patientId
    );
  }

  async updateLabResult(id: string, updates: Partial<LabResult>): Promise<LabResult | undefined> {
    const labResult = this.labResults.get(id);
    if (!labResult) return undefined;
    const updatedLabResult = { ...labResult, ...updates };
    this.labResults.set(id, updatedLabResult);
    return updatedLabResult;
  }

  async createSoapNote(insertSoapNote: InsertSoapNote): Promise<SoapNote> {
    const id = randomUUID();
    const soapNote: SoapNote = { ...insertSoapNote, id, createdAt: new Date() };
    this.soapNotes.set(id, soapNote);
    return soapNote;
  }

  async getSoapNotes(patientId: string): Promise<SoapNote[]> {
    return Array.from(this.soapNotes.values())
      .filter(note => note.patientId === patientId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const order: Order = { ...insertOrder, id, orderedAt: new Date() };
    this.orders.set(id, order);
    return order;
  }

  async getOrders(patientId: string): Promise<Order[]> {
    return Array.from(this.orders.values())
      .filter(order => order.patientId === patientId)
      .sort((a, b) => new Date(b.orderedAt).getTime() - new Date(a.orderedAt).getTime());
  }

  async updateOrder(id: string, updates: Partial<Order>): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    const updatedOrder = { ...order, ...updates };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  async createMedicalHistory(insertHistory: InsertMedicalHistory): Promise<MedicalHistory> {
    const id = randomUUID();
    const history: MedicalHistory = { ...insertHistory, id };
    this.medicalHistory.set(id, history);
    return history;
  }

  async getMedicalHistory(patientId: string): Promise<MedicalHistory[]> {
    return Array.from(this.medicalHistory.values()).filter(
      history => history.patientId === patientId
    );
  }

  async createMedication(insertMedication: InsertMedication): Promise<Medication> {
    const id = randomUUID();
    const medication: Medication = { ...insertMedication, id, prescribedAt: new Date() };
    this.medications.set(id, medication);
    return medication;
  }

  async getMedications(patientId: string): Promise<Medication[]> {
    return Array.from(this.medications.values()).filter(
      medication => medication.patientId === patientId
    );
  }

  // Groups
  async createGroup(insertGroup: InsertGroup): Promise<Group> {
    const id = randomUUID();
    const group: Group = { ...insertGroup, id, createdAt: new Date() };
    this.groups.set(id, group);
    return group;
  }

  async getGroup(id: string): Promise<Group | undefined> {
    return this.groups.get(id);
  }

  async getGroupsBySession(sessionId: string): Promise<Group[]> {
    return Array.from(this.groups.values()).filter(
      group => group.sessionId === sessionId
    );
  }

  // Group Members
  async addGroupMember(insertMember: InsertGroupMember): Promise<GroupMember> {
    const id = randomUUID();
    const member: GroupMember = { ...insertMember, id, joinedAt: new Date() };
    this.groupMembers.set(id, member);
    return member;
  }

  async removeGroupMember(groupId: string, userId: string): Promise<void> {
    for (const [id, member] of this.groupMembers.entries()) {
      if (member.groupId === groupId && member.userId === userId) {
        this.groupMembers.delete(id);
        break;
      }
    }
  }

  async getGroupMembers(groupId: string): Promise<GroupMember[]> {
    return Array.from(this.groupMembers.values()).filter(
      member => member.groupId === groupId
    );
  }

  async getUserGroups(userId: string): Promise<Group[]> {
    const userMemberships = Array.from(this.groupMembers.values()).filter(
      member => member.userId === userId
    );
    return userMemberships.map(membership => this.groups.get(membership.groupId)!).filter(Boolean);
  }

  // Assets
  async createAsset(insertAsset: InsertAsset): Promise<Asset> {
    const id = randomUUID();
    const asset: Asset = { ...insertAsset, id, uploadedAt: new Date() };
    this.assets.set(id, asset);
    return asset;
  }

  async getAsset(id: string): Promise<Asset | undefined> {
    return this.assets.get(id);
  }

  async getAssetsBySession(sessionId: string): Promise<Asset[]> {
    return Array.from(this.assets.values()).filter(
      asset => asset.sessionId === sessionId
    );
  }

  async deleteAsset(id: string): Promise<void> {
    this.assets.delete(id);
    // Also remove visibility records
    for (const [visId, visibility] of this.assetGroupVisibility.entries()) {
      if (visibility.assetId === id) {
        this.assetGroupVisibility.delete(visId);
      }
    }
  }

  // Asset Group Visibility
  async setAssetVisibility(insertVisibility: InsertAssetGroupVisibility): Promise<AssetGroupVisibility> {
    const id = randomUUID();
    const visibility: AssetGroupVisibility = { ...insertVisibility, id, changedAt: new Date() };
    this.assetGroupVisibility.set(id, visibility);
    return visibility;
  }

  async getAssetVisibility(assetId: string, groupId: string): Promise<AssetGroupVisibility | undefined> {
    return Array.from(this.assetGroupVisibility.values()).find(
      visibility => visibility.assetId === assetId && visibility.groupId === groupId
    );
  }

  async getVisibleAssetsForGroup(groupId: string): Promise<Asset[]> {
    const visibleAssetIds = Array.from(this.assetGroupVisibility.values())
      .filter(visibility => visibility.groupId === groupId && visibility.visible)
      .map(visibility => visibility.assetId);
    
    return Array.from(this.assets.values()).filter(
      asset => visibleAssetIds.includes(asset.id)
    );
  }

  async updateAssetVisibility(assetId: string, groupId: string, visible: boolean, changedBy: string): Promise<AssetGroupVisibility> {
    // Find existing visibility record
    for (const [id, visibility] of this.assetGroupVisibility.entries()) {
      if (visibility.assetId === assetId && visibility.groupId === groupId) {
        const updated: AssetGroupVisibility = {
          ...visibility,
          visible,
          changedBy,
          changedAt: new Date(),
        };
        this.assetGroupVisibility.set(id, updated);
        return updated;
      }
    }

    // Create new visibility record if not found
    return this.setAssetVisibility({ assetId, groupId, visible, changedBy });
  }

  async bulkUpdateAssetVisibility(assetIds: string[], groupId: string, visible: boolean, changedBy: string): Promise<void> {
    for (const assetId of assetIds) {
      await this.updateAssetVisibility(assetId, groupId, visible, changedBy);
    }
  }

  // System Admin: Data Versioning
  async createDataVersion(dataVersion: InsertDataVersion): Promise<DataVersion> {
    const id = `data-version-${Date.now()}`;
    const newDataVersion: DataVersion = {
      id,
      ...dataVersion,
      createdAt: new Date(),
    };
    this.dataVersions.set(id, newDataVersion);
    return newDataVersion;
  }

  async getDataVersions(sessionId: string): Promise<DataVersion[]> {
    return Array.from(this.dataVersions.values()).filter(
      version => version.sessionId === sessionId
    );
  }

  async getDataVersion(id: string): Promise<DataVersion | undefined> {
    return this.dataVersions.get(id);
  }

  async deleteDataVersion(id: string): Promise<void> {
    this.dataVersions.delete(id);
  }

  // System Admin: Group Data Assignments
  async assignGroupData(assignment: InsertGroupDataAssignment): Promise<GroupDataAssignment> {
    const id = `assignment-${Date.now()}`;
    const newAssignment: GroupDataAssignment = {
      id,
      ...assignment,
      assignedAt: new Date(),
    };
    this.groupDataAssignments.set(id, newAssignment);
    return newAssignment;
  }

  async getGroupDataAssignments(groupId: string): Promise<GroupDataAssignment[]> {
    return Array.from(this.groupDataAssignments.values()).filter(
      assignment => assignment.groupId === groupId
    );
  }

  async removeGroupDataAssignment(groupId: string, patientId: string): Promise<void> {
    for (const [id, assignment] of this.groupDataAssignments.entries()) {
      if (assignment.groupId === groupId && assignment.patientId === patientId) {
        this.groupDataAssignments.delete(id);
        break;
      }
    }
  }

  // System Admin: Group Account Management
  async createGroupAccount(account: InsertGroupAccount): Promise<GroupAccount> {
    const id = `group-account-${Date.now()}`;
    const newAccount: GroupAccount = {
      id,
      ...account,
      active: true,
      createdAt: new Date(),
    };
    this.groupAccounts.set(id, newAccount);
    return newAccount;
  }

  async getGroupAccounts(groupId?: string): Promise<GroupAccount[]> {
    const accounts = Array.from(this.groupAccounts.values());
    return groupId ? accounts.filter(account => account.groupId === groupId) : accounts;
  }

  async getGroupAccount(id: string): Promise<GroupAccount | undefined> {
    return this.groupAccounts.get(id);
  }

  async updateGroupAccount(id: string, updates: Partial<GroupAccount>): Promise<GroupAccount | undefined> {
    const account = this.groupAccounts.get(id);
    if (!account) return undefined;

    const updated: GroupAccount = { ...account, ...updates };
    this.groupAccounts.set(id, updated);
    return updated;
  }

  async deactivateGroupAccount(id: string): Promise<void> {
    const account = this.groupAccounts.get(id);
    if (account) {
      account.active = false;
      this.groupAccounts.set(id, account);
    }
  }

  // System Admin: User Management
  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    const updated: User = { ...user, ...updates };
    this.users.set(id, updated);
    return updated;
  }

  async deleteUser(id: string): Promise<void> {
    this.users.delete(id);
  }

  // Simulation Coordinator: Document Management
  async uploadDocument(document: InsertDocument): Promise<Document> {
    const id = `document-${Date.now()}`;
    const newDocument: Document = {
      id,
      ...document,
      uploadedAt: new Date(),
    };
    this.documents.set(id, newDocument);
    return newDocument;
  }

  async getDocuments(sessionId: string, patientId?: string): Promise<Document[]> {
    const documents = Array.from(this.documents.values()).filter(
      doc => doc.sessionId === sessionId
    );
    return patientId ? documents.filter(doc => doc.patientId === patientId) : documents;
  }

  async getDocument(id: string): Promise<Document | undefined> {
    return this.documents.get(id);
  }

  async deleteDocument(id: string): Promise<void> {
    this.documents.delete(id);
  }

  // Simulation Coordinator: Document Release Management
  async scheduleDocumentRelease(release: InsertDocumentRelease): Promise<DocumentRelease> {
    const id = `release-${Date.now()}`;
    const newRelease: DocumentRelease = {
      id,
      ...release,
      status: 'pending',
      createdAt: new Date(),
    };
    this.documentReleases.set(id, newRelease);
    return newRelease;
  }

  async getDocumentReleases(groupId?: string): Promise<DocumentRelease[]> {
    const releases = Array.from(this.documentReleases.values());
    return groupId ? releases.filter(release => release.groupId === groupId) : releases;
  }

  async releaseDocument(releaseId: string, releasedBy: string): Promise<DocumentRelease> {
    const release = this.documentReleases.get(releaseId);
    if (!release) {
      throw new Error('Release not found');
    }

    const updated: DocumentRelease = {
      ...release,
      status: 'released',
      releasedAt: new Date(),
      releasedBy,
    };
    this.documentReleases.set(releaseId, updated);
    return updated;
  }

  async cancelDocumentRelease(releaseId: string): Promise<void> {
    const release = this.documentReleases.get(releaseId);
    if (release) {
      release.status = 'cancelled';
      this.documentReleases.set(releaseId, release);
    }
  }

  async getReleasedDocumentsForGroup(groupId: string): Promise<Document[]> {
    const releasedReleases = Array.from(this.documentReleases.values()).filter(
      release => release.groupId === groupId && release.status === 'released'
    );
    
    const documentIds = releasedReleases.map(release => release.documentId);
    return Array.from(this.documents.values()).filter(
      doc => documentIds.includes(doc.id)
    );
  }

  // Simulation Coordinator: Simulation Week Management
  async createSimulationWeek(week: InsertSimulationWeek): Promise<SimulationWeek> {
    const id = `week-${Date.now()}`;
    const newWeek: SimulationWeek = {
      id,
      ...week,
      active: false,
      createdAt: new Date(),
    };
    this.simulationWeeks.set(id, newWeek);
    return newWeek;
  }

  async getSimulationWeeks(sessionId: string): Promise<SimulationWeek[]> {
    return Array.from(this.simulationWeeks.values()).filter(
      week => week.sessionId === sessionId
    );
  }

  async getActiveSimulationWeek(sessionId: string): Promise<SimulationWeek | undefined> {
    return Array.from(this.simulationWeeks.values()).find(
      week => week.sessionId === sessionId && week.active
    );
  }

  async activateSimulationWeek(weekId: string): Promise<SimulationWeek> {
    const week = this.simulationWeeks.get(weekId);
    if (!week) {
      throw new Error('Simulation week not found');
    }

    // Deactivate all other weeks for the same session
    for (const [id, existingWeek] of this.simulationWeeks.entries()) {
      if (existingWeek.sessionId === week.sessionId && existingWeek.active) {
        existingWeek.active = false;
        this.simulationWeeks.set(id, existingWeek);
      }
    }

    // Activate the selected week
    week.active = true;
    this.simulationWeeks.set(weekId, week);
    return week;
  }

  async updateSimulationWeek(id: string, updates: Partial<SimulationWeek>): Promise<SimulationWeek | undefined> {
    const week = this.simulationWeeks.get(id);
    if (!week) return undefined;

    const updated: SimulationWeek = { ...week, ...updates };
    this.simulationWeeks.set(id, updated);
    return updated;
  }

  // System Admin: Audit Trail
  async logActivity(log: InsertAuditLog): Promise<AuditLog> {
    const id = `audit-${Date.now()}`;
    const newLog: AuditLog = {
      id,
      ...log,
      timestamp: new Date(),
    };
    this.auditLogs.set(id, newLog);
    return newLog;
  }

  async getAuditLogs(entityType?: string, entityId?: string): Promise<AuditLog[]> {
    let logs = Array.from(this.auditLogs.values());
    
    if (entityType) {
      logs = logs.filter(log => log.entityType === entityType);
    }
    
    if (entityId) {
      logs = logs.filter(log => log.entityId === entityId);
    }
    
    return logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }
}

export const storage = new MemStorage();

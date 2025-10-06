import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, blob, real } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = sqliteTable("users", {
  id: text("id").primaryKey().default(sql`(lower(hex(randomblob(16))))`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull(), // 'student', 'instructor', 'admin', 'coordinator'
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  createdAt: integer("created_at", { mode: 'timestamp' }).default(sql`(unixepoch())`),
});

export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey().default(sql`(lower(hex(randomblob(16))))`),
  name: text("name").notNull(),
  instructorId: text("instructor_id").references(() => users.id).notNull(),
  scenarioId: text("scenario_id").references(() => scenarios.id),
  active: integer("active", { mode: 'boolean' }).default(sql`1`),
  timeRemaining: integer("time_remaining"), // in minutes
  createdAt: integer("created_at", { mode: 'timestamp' }).default(sql`(unixepoch())`),
});

export const sessionParticipants = sqliteTable("session_participants", {
  id: text("id").primaryKey().default(sql`(lower(hex(randomblob(16))))`),
  sessionId: text("session_id").references(() => sessions.id).notNull(),
  userId: text("user_id").references(() => users.id).notNull(),
  joinedAt: integer("joined_at", { mode: 'timestamp' }).default(sql`(unixepoch())`),
});

export const scenarios = sqliteTable("scenarios", {
  id: text("id").primaryKey().default(sql`(lower(hex(randomblob(16))))`),
  name: text("name").notNull(),
  description: text("description"),
  createdBy: text("created_by").references(() => users.id).notNull(),
  timeline: text("timeline"), // JSON string of timed events
  createdAt: integer("created_at", { mode: 'timestamp' }).default(sql`(unixepoch())`),
});

export const patients = sqliteTable("patients", {
  id: text("id").primaryKey().default(sql`(lower(hex(randomblob(16))))`),
  mrn: text("mrn").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  dateOfBirth: text("date_of_birth").notNull(),
  gender: text("gender").notNull(),
  location: text("location"),
  status: text("status").notNull(), // 'critical', 'stable', 'monitoring'
  chiefComplaint: text("chief_complaint"),
  sessionId: text("session_id").references(() => sessions.id),
  createdAt: integer("created_at", { mode: 'timestamp' }).default(sql`(unixepoch())`),
});

export const medicalHistory = sqliteTable("medical_history", {
  id: text("id").primaryKey().default(sql`(lower(hex(randomblob(16))))`),
    patientId: text("patient_id").references(() => patients.id, { onDelete: "cascade" }).notNull(),
  condition: text("condition").notNull(),
  diagnosedYear: text("diagnosed_year"),
  notes: text("notes"),
});

export const medications = sqliteTable("medications", {
  id: text("id").primaryKey().default(sql`(lower(hex(randomblob(16))))`),
  patientId: text("patient_id").references(() => patients.id, { onDelete: "cascade" }).notNull(),
  name: text("name").notNull(),
  dosage: text("dosage").notNull(),
  frequency: text("frequency").notNull(),
  prescribedBy: text("prescribed_by").references(() => users.id),
  prescribedAt: integer("prescribed_at", { mode: 'timestamp' }).default(sql`(unixepoch())`),
});

export const vitalSigns = sqliteTable("vital_signs", {
  id: text("id").primaryKey().default(sql`(lower(hex(randomblob(16))))`),
  patientId: text("patient_id").references(() => patients.id, { onDelete: "cascade" }).notNull(),
  bloodPressure: text("blood_pressure"),
  heartRate: integer("heart_rate"),
  respiratoryRate: integer("respiratory_rate"),
  temperature: text("temperature"),
  oxygenSaturation: integer("oxygen_saturation"),
  recordedAt: integer("recorded_at", { mode: 'timestamp' }).default(sql`(unixepoch())`),
  recordedBy: text("recorded_by").references(() => users.id),
});

export const labResults = sqliteTable("lab_results", {
  id: text("id").primaryKey().default(sql`(lower(hex(randomblob(16))))`),
  patientId: text("patient_id").references(() => patients.id, { onDelete: "cascade" }).notNull(),
  testName: text("test_name").notNull(),
  value: text("value").notNull(),
  unit: text("unit"),
  referenceRange: text("reference_range"),
  status: text("status").default('completed'), // 'pending', 'completed'
  orderedAt: integer("ordered_at", { mode: 'timestamp' }).default(sql`(unixepoch())`),
  completedAt: integer("completed_at", { mode: 'timestamp' }),
  orderedBy: text("ordered_by").references(() => users.id),
});

export const soapNotes = sqliteTable("soap_notes", {
  id: text("id").primaryKey().default(sql`(lower(hex(randomblob(16))))`),
  patientId: text("patient_id").references(() => patients.id, { onDelete: "cascade" }).notNull(),
  subjective: text("subjective"),
  objective: text("objective"),
  assessment: text("assessment"),
  plan: text("plan"),
  authorId: text("author_id").references(() => users.id).notNull(),
  createdAt: integer("created_at", { mode: 'timestamp' }).default(sql`(unixepoch())`),
});

export const orders = sqliteTable("orders", {
  id: text("id").primaryKey().default(sql`(lower(hex(randomblob(16))))`),
  patientId: text("patient_id").references(() => patients.id, { onDelete: "cascade" }).notNull(),
  type: text("type").notNull(), // 'lab', 'imaging', 'medication'
  orderText: text("order_text").notNull(),
  status: text("status").default('pending'), // 'pending', 'completed', 'cancelled'
  orderedBy: text("ordered_by").references(() => users.id).notNull(),
  orderedAt: integer("ordered_at", { mode: 'timestamp' }).default(sql`(unixepoch())`),
  completedAt: integer("completed_at", { mode: 'timestamp' }),
});

export const groups = sqliteTable("groups", {
  id: text("id").primaryKey().default(sql`(lower(hex(randomblob(16))))`),
  name: text("name").notNull(),
  description: text("description"),
  sessionId: text("session_id").references(() => sessions.id).notNull(),
  createdAt: integer("created_at", { mode: 'timestamp' }).default(sql`(unixepoch())`),
});

export const groupMembers = sqliteTable("group_members", {
  id: text("id").primaryKey().default(sql`(lower(hex(randomblob(16))))`),
  groupId: text("group_id").references(() => groups.id).notNull(),
  userId: text("user_id").references(() => users.id).notNull(),
  joinedAt: integer("joined_at", { mode: 'timestamp' }).default(sql`(unixepoch())`),
});

export const assets = sqliteTable("assets", {
  id: text("id").primaryKey().default(sql`(lower(hex(randomblob(16))))`),
  filename: text("filename").notNull(),
  type: text("type").notNull(), // 'pdf', 'image', 'lab', 'document'
  filePath: text("file_path").notNull(),
  sessionId: text("session_id").references(() => sessions.id).notNull(),
  uploadedBy: text("uploaded_by").references(() => users.id).notNull(),
  uploadedAt: integer("uploaded_at", { mode: 'timestamp' }).default(sql`(unixepoch())`),
});

export const assetGroupVisibility = sqliteTable("asset_group_visibility", {
  id: text("id").primaryKey().default(sql`(lower(hex(randomblob(16))))`),
  assetId: text("asset_id").references(() => assets.id).notNull(),
  groupId: text("group_id").references(() => groups.id).notNull(),
  visible: integer("visible", { mode: 'boolean' }).default(sql`0`),
  changedBy: text("changed_by").references(() => users.id).notNull(),
  changedAt: integer("changed_at", { mode: 'timestamp' }).default(sql`(unixepoch())`),
});

// Data Versioning for Groups
export const dataVersions = sqliteTable("data_versions", {
  id: text("id").primaryKey().default(sql`(lower(hex(randomblob(16))))`),
  name: text("name").notNull(),
  description: text("description"),
  version: text("version").notNull(),
  sessionId: text("session_id").references(() => sessions.id).notNull(),
  createdBy: text("created_by").references(() => users.id).notNull(),
  createdAt: integer("created_at", { mode: 'timestamp' }).default(sql`(unixepoch())`),
});

// Group-specific patient assignments and data versions
export const groupDataAssignments = sqliteTable("group_data_assignments", {
  id: text("id").primaryKey().default(sql`(lower(hex(randomblob(16))))`),
  groupId: text("group_id").references(() => groups.id).notNull(),
  dataVersionId: text("data_version_id").references(() => dataVersions.id).notNull(),
  patientId: text("patient_id").references(() => patients.id, { onDelete: "cascade" }).notNull(),
  assignedBy: text("assigned_by").references(() => users.id).notNull(),
  assignedAt: integer("assigned_at", { mode: 'timestamp' }).default(sql`(unixepoch())`),
});

// Group account credentials managed by System Admin
export const groupAccounts = sqliteTable("group_accounts", {
  id: text("id").primaryKey().default(sql`(lower(hex(randomblob(16))))`),
  groupId: text("group_id").references(() => groups.id).notNull(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  active: integer("active", { mode: 'boolean' }).default(sql`1`),
  createdBy: text("created_by").references(() => users.id).notNull(),
  createdAt: integer("created_at", { mode: 'timestamp' }).default(sql`(unixepoch())`),
});

// Documents uploaded and managed by Simulation Coordinators
export const documents = sqliteTable("documents", {
  id: text("id").primaryKey().default(sql`(lower(hex(randomblob(16))))`),
  filename: text("filename").notNull(),
  originalName: text("original_name").notNull(),
  fileType: text("file_type").notNull(),
  fileSize: integer("file_size").notNull(),
  filePath: text("file_path").notNull(),
  category: text("category").notNull(), // 'admission', 'lab', 'imaging', 'notes'
  patientId: text("patient_id").references(() => patients.id, { onDelete: "cascade" }),
  sessionId: text("session_id").references(() => sessions.id).notNull(),
  uploadedBy: text("uploaded_by").references(() => users.id).notNull(),
  uploadedAt: integer("uploaded_at", { mode: 'timestamp' }).default(sql`(unixepoch())`),
});

// Scheduled document releases controlled by Simulation Coordinators
export const documentReleases = sqliteTable("document_releases", {
  id: text("id").primaryKey().default(sql`(lower(hex(randomblob(16))))`),
  documentId: text("document_id").references(() => documents.id).notNull(),
  groupId: text("group_id").references(() => groups.id).notNull(),
  releaseType: text("release_type").notNull(), // 'manual', 'scheduled'
  scheduledAt: integer("scheduled_at", { mode: 'timestamp' }),
  releasedAt: integer("released_at", { mode: 'timestamp' }),
  releasedBy: text("released_by").references(() => users.id),
  status: text("status").default('pending'), // 'pending', 'released', 'cancelled'
  notes: text("notes"),
});

// Simulation week configuration for timeline control
export const simulationWeeks = sqliteTable("simulation_weeks", {
  id: text("id").primaryKey().default(sql`(lower(hex(randomblob(16))))`),
  name: text("name").notNull(),
  weekNumber: integer("week_number").notNull(),
  startDate: integer("start_date", { mode: 'timestamp' }).notNull(),
  endDate: integer("end_date", { mode: 'timestamp' }).notNull(),
  sessionId: text("session_id").references(() => sessions.id).notNull(),
  timeline: text("timeline"), // JSON string of timed events and document releases
  active: integer("active", { mode: 'boolean' }).default(sql`0`),
  createdBy: text("created_by").references(() => users.id).notNull(),
  createdAt: integer("created_at", { mode: 'timestamp' }).default(sql`(unixepoch())`),
});

// Activity audit trail for System Admin oversight
export const auditLog = sqliteTable("audit_log", {
  id: text("id").primaryKey().default(sql`(lower(hex(randomblob(16))))`),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(), // 'user', 'group', 'document', 'patient'
  entityId: text("entity_id").notNull(),
  performedBy: text("performed_by").references(() => users.id).notNull(),
  details: text("details"), // JSON string
  timestamp: integer("timestamp", { mode: 'timestamp' }).default(sql`(unixepoch())`),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertSessionSchema = createInsertSchema(sessions).omit({
  id: true,
  createdAt: true,
});

export const insertPatientSchema = createInsertSchema(patients).omit({
  id: true,
  createdAt: true,
});

export const insertVitalSignsSchema = createInsertSchema(vitalSigns).omit({
  id: true,
  recordedAt: true,
});

export const insertLabResultSchema = createInsertSchema(labResults).omit({
  id: true,
  orderedAt: true,
});

export const insertSoapNoteSchema = createInsertSchema(soapNotes).omit({
  id: true,
  createdAt: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  orderedAt: true,
});

export const insertMedicalHistorySchema = createInsertSchema(medicalHistory).omit({
  id: true,
});

export const insertMedicationSchema = createInsertSchema(medications).omit({
  id: true,
  prescribedAt: true,
});

export const insertGroupSchema = createInsertSchema(groups).omit({
  id: true,
  createdAt: true,
});

export const insertGroupMemberSchema = createInsertSchema(groupMembers).omit({
  id: true,
  joinedAt: true,
});

export const insertAssetSchema = createInsertSchema(assets).omit({
  id: true,
  uploadedAt: true,
});

export const insertAssetGroupVisibilitySchema = createInsertSchema(assetGroupVisibility).omit({
  id: true,
  changedAt: true,
});

export const insertDataVersionSchema = createInsertSchema(dataVersions).omit({
  id: true,
  createdAt: true,
});

export const insertGroupDataAssignmentSchema = createInsertSchema(groupDataAssignments).omit({
  id: true,
  assignedAt: true,
});

export const insertGroupAccountSchema = createInsertSchema(groupAccounts).omit({
  id: true,
  createdAt: true,
});

export const insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  uploadedAt: true,
});

export const insertDocumentReleaseSchema = createInsertSchema(documentReleases).omit({
  id: true,
});

export const insertSimulationWeekSchema = createInsertSchema(simulationWeeks).omit({
  id: true,
  createdAt: true,
});

export const insertAuditLogSchema = createInsertSchema(auditLog).omit({
  id: true,
  timestamp: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Session = typeof sessions.$inferSelect;
export type InsertSession = z.infer<typeof insertSessionSchema>;
export type Patient = typeof patients.$inferSelect;
export type InsertPatient = z.infer<typeof insertPatientSchema>;
export type VitalSigns = typeof vitalSigns.$inferSelect;
export type InsertVitalSigns = z.infer<typeof insertVitalSignsSchema>;
export type LabResult = typeof labResults.$inferSelect;
export type InsertLabResult = z.infer<typeof insertLabResultSchema>;
export type SoapNote = typeof soapNotes.$inferSelect;
export type InsertSoapNote = z.infer<typeof insertSoapNoteSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type MedicalHistory = typeof medicalHistory.$inferSelect;
export type InsertMedicalHistory = z.infer<typeof insertMedicalHistorySchema>;
export type Medication = typeof medications.$inferSelect;
export type InsertMedication = z.infer<typeof insertMedicationSchema>;
export type Group = typeof groups.$inferSelect;
export type InsertGroup = z.infer<typeof insertGroupSchema>;
export type GroupMember = typeof groupMembers.$inferSelect;
export type InsertGroupMember = z.infer<typeof insertGroupMemberSchema>;
export type Asset = typeof assets.$inferSelect;
export type InsertAsset = z.infer<typeof insertAssetSchema>;
export type AssetGroupVisibility = typeof assetGroupVisibility.$inferSelect;
export type InsertAssetGroupVisibility = z.infer<typeof insertAssetGroupVisibilitySchema>;

export type DataVersion = typeof dataVersions.$inferSelect;
export type InsertDataVersion = z.infer<typeof insertDataVersionSchema>;
export type GroupDataAssignment = typeof groupDataAssignments.$inferSelect;
export type InsertGroupDataAssignment = z.infer<typeof insertGroupDataAssignmentSchema>;
export type GroupAccount = typeof groupAccounts.$inferSelect;
export type InsertGroupAccount = z.infer<typeof insertGroupAccountSchema>;
export type Document = typeof documents.$inferSelect;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type DocumentRelease = typeof documentReleases.$inferSelect;
export type InsertDocumentRelease = z.infer<typeof insertDocumentReleaseSchema>;
export type SimulationWeek = typeof simulationWeeks.$inferSelect;
export type InsertSimulationWeek = z.infer<typeof insertSimulationWeekSchema>;
export type AuditLog = typeof auditLog.$inferSelect;
export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;

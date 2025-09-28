import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  groupAccessMiddleware, 
  patientAccessMiddleware, 
  groupDataIsolationMiddleware 
} from "./groupMiddleware";
import { 
  insertSoapNoteSchema, 
  insertOrderSchema, 
  insertLabResultSchema,
  insertGroupSchema,
  insertGroupMemberSchema,
  insertAssetSchema,
  insertPatientSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get current user sessions
  app.get("/api/sessions/instructor/:instructorId", async (req, res) => {
    try {
      const { instructorId } = req.params;
      const sessions = await storage.getActiveSessionsByInstructor(instructorId);
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch sessions" });
    }
  });

  // Get session details
  app.get("/api/sessions/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const session = await storage.getSession(sessionId);
      
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }

      res.json(session);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch session" });
    }
  });

  // Get patients in session
  app.get("/api/sessions/:sessionId/patients", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const patients = await storage.getPatientsBySession(sessionId);
      res.json(patients);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch patients" });
    }
  });

  // Get patient details
  app.get("/api/patients/:patientId", async (req, res) => {
    try {
      const { patientId } = req.params;
      const patient = await storage.getPatient(patientId);
      
      if (!patient) {
        return res.status(404).json({ message: "Patient not found" });
      }

      res.json(patient);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch patient" });
    }
  });
app.post("/api/patients", async (req, res) => {
  try {
    // TODO: Remove debug log after patient creation is verified
    console.log('Received patient data:', req.body);
    const patientData = insertPatientSchema.parse(req.body);
    console.log('Parsed patient data:', patientData);
    const patient = await storage.createPatient(patientData);
    res.status(201).json(patient);
  } catch (error) {
    console.log('Validation error details:', error);
    if (error instanceof Error) {
      console.log('Error message:', error.message);
      console.log('Error stack:', error.stack);
    }
    res.status(400).json({ 
      message: "Invalid patient data",
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

// Delete patient
app.delete("/api/patients/:patientId", async (req, res) => {
  try {
    const { patientId } = req.params;
    const deleted = await storage.deletePatient(patientId);
    
    if (!deleted) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Failed to delete patient" });
  }
});

  // Get patient vitals
  app.get("/api/patients/:patientId/vitals", async (req, res) => {
    try {
      const { patientId } = req.params;
      const vitals = await storage.getLatestVitals(patientId);
      res.json(vitals);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch vitals" });
    }
  });

  // Get patient lab results
  app.get("/api/patients/:patientId/labs", async (req, res) => {
    try {
      const { patientId } = req.params;
      const labs = await storage.getLabResults(patientId);
      res.json(labs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch lab results" });
    }
  });

  // Get patient medical history
  app.get("/api/patients/:patientId/history", async (req, res) => {
    try {
      const { patientId } = req.params;
      const history = await storage.getMedicalHistory(patientId);
      res.json(history);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch medical history" });
    }
  });

  // Get patient medications
  app.get("/api/patients/:patientId/medications", async (req, res) => {
    try {
      const { patientId } = req.params;
      const medications = await storage.getMedications(patientId);
      res.json(medications);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch medications" });
    }
  });

  // Get patient SOAP notes
  app.get("/api/patients/:patientId/soap-notes", async (req, res) => {
    try {
      const { patientId } = req.params;
      const notes = await storage.getSoapNotes(patientId);
      res.json(notes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch SOAP notes" });
    }
  });

  // Create SOAP note
  app.post("/api/patients/:patientId/soap-notes", async (req, res) => {
    try {
      const { patientId } = req.params;
      const noteData = insertSoapNoteSchema.parse({
        ...req.body,
        patientId,
      });
      
      const soapNote = await storage.createSoapNote(noteData);
      res.status(201).json(soapNote);
    } catch (error) {
      res.status(400).json({ message: "Invalid SOAP note data" });
    }
  });

  // Get patient orders
  app.get("/api/patients/:patientId/orders", async (req, res) => {
    try {
      const { patientId } = req.params;
      const orders = await storage.getOrders(patientId);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  // Create order
  app.post("/api/patients/:patientId/orders", async (req, res) => {
    try {
      const { patientId } = req.params;
      const orderData = insertOrderSchema.parse({
        ...req.body,
        patientId,
      });
      
      const order = await storage.createOrder(orderData);
      res.status(201).json(order);
    } catch (error) {
      res.status(400).json({ message: "Invalid order data" });
    }
  });

  // Instructor: Update lab result (release results)
  app.patch("/api/lab-results/:labId", async (req, res) => {
    try {
      const { labId } = req.params;
      const updates = req.body;
      
      const labResult = await storage.updateLabResult(labId, {
        ...updates,
        completedAt: updates.status === 'completed' ? new Date() : null,
      });
      
      if (!labResult) {
        return res.status(404).json({ message: "Lab result not found" });
      }

      res.json(labResult);
    } catch (error) {
      res.status(500).json({ message: "Failed to update lab result" });
    }
  });

  // Instructor: Update patient status
  app.patch("/api/patients/:patientId", async (req, res) => {
    try {
      const { patientId } = req.params;
      const updates = req.body;
      
      const patient = await storage.updatePatient(patientId, updates);
      
      if (!patient) {
        return res.status(404).json({ message: "Patient not found" });
      }

      res.json(patient);
    } catch (error) {
      res.status(500).json({ message: "Failed to update patient" });
    }
  });

  // Groups routes
  app.get("/api/sessions/:sessionId/groups", async (req, res) => {
    try {
      const groups = await storage.getGroupsBySession(req.params.sessionId);
      res.json(groups);
    } catch (error) {
      console.error("Error fetching groups:", error);
      res.status(500).json({ error: "Failed to fetch groups" });
    }
  });

  app.post("/api/sessions/:sessionId/groups", async (req, res) => {
    try {
      const groupData = insertGroupSchema.parse({
        ...req.body,
        sessionId: req.params.sessionId,
      });
      const group = await storage.createGroup(groupData);
      res.status(201).json(group);
    } catch (error) {
      console.error("Error creating group:", error);
      res.status(400).json({ error: "Failed to create group" });
    }
  });

  app.get("/api/groups/:groupId/members", async (req, res) => {
    try {
      const members = await storage.getGroupMembers(req.params.groupId);
      res.json(members);
    } catch (error) {
      console.error("Error fetching group members:", error);
      res.status(500).json({ error: "Failed to fetch group members" });
    }
  });

  app.post("/api/groups/:groupId/members", async (req, res) => {
    try {
      const memberData = insertGroupMemberSchema.parse({
        ...req.body,
        groupId: req.params.groupId,
      });
      const member = await storage.addGroupMember(memberData);
      res.status(201).json(member);
    } catch (error) {
      console.error("Error adding group member:", error);
      res.status(400).json({ error: "Failed to add group member" });
    }
  });

  // User groups route
  app.get("/api/users/:userId/groups", async (req, res) => {
    try {
      const groups = await storage.getUserGroups(req.params.userId);
      res.json(groups);
    } catch (error) {
      console.error("Error fetching user groups:", error);
      res.status(500).json({ error: "Failed to fetch user groups" });
    }
  });

  // Assets routes
  app.get("/api/sessions/:sessionId/assets", async (req, res) => {
    try {
      const assets = await storage.getAssetsBySession(req.params.sessionId);
      res.json(assets);
    } catch (error) {
      console.error("Error fetching assets:", error);
      res.status(500).json({ error: "Failed to fetch assets" });
    }
  });

  app.post("/api/sessions/:sessionId/assets", async (req, res) => {
    try {
      const assetData = insertAssetSchema.parse({
        ...req.body,
        sessionId: req.params.sessionId,
      });
      const asset = await storage.createAsset(assetData);
      res.status(201).json(asset);
    } catch (error) {
      console.error("Error creating asset:", error);
      res.status(400).json({ error: "Failed to create asset" });
    }
  });

  app.delete("/api/assets/:assetId", async (req, res) => {
    try {
      await storage.deleteAsset(req.params.assetId);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting asset:", error);
      res.status(500).json({ error: "Failed to delete asset" });
    }
  });

  // Asset visibility routes
  app.get("/api/groups/:groupId/visible-assets", async (req, res) => {
    try {
      const assets = await storage.getVisibleAssetsForGroup(req.params.groupId);
      res.json(assets);
    } catch (error) {
      console.error("Error fetching visible assets:", error);
      res.status(500).json({ error: "Failed to fetch visible assets" });
    }
  });

  app.put("/api/assets/:assetId/visibility/:groupId", async (req, res) => {
    try {
      const { visible, changedBy } = req.body;
      const visibility = await storage.updateAssetVisibility(
        req.params.assetId,
        req.params.groupId,
        visible,
        changedBy
      );
      res.json(visibility);
    } catch (error) {
      console.error("Error updating asset visibility:", error);
      res.status(500).json({ error: "Failed to update asset visibility" });
    }
  });

  app.put("/api/assets/bulk-visibility/:groupId", async (req, res) => {
    try {
      const { assetIds, visible, changedBy } = req.body;
      await storage.bulkUpdateAssetVisibility(assetIds, req.params.groupId, visible, changedBy);
      res.status(204).send();
    } catch (error) {
      console.error("Error bulk updating asset visibility:", error);
      res.status(500).json({ error: "Failed to bulk update asset visibility" });
    }
  });

  app.get("/api/assets/:assetId/visibility/:groupId", async (req, res) => {
    try {
      const visibility = await storage.getAssetVisibility(req.params.assetId, req.params.groupId);
      res.json(visibility);
    } catch (error) {
      console.error("Error fetching asset visibility:", error);
      res.status(500).json({ error: "Failed to fetch asset visibility" });
    }
  });

  // System Admin Routes
  app.get("/api/admin/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.post("/api/admin/users", async (req, res) => {
    try {
      const user = await storage.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ error: "Failed to create user" });
    }
  });

  app.put("/api/admin/users/:id", async (req, res) => {
    try {
      const user = await storage.updateUser(req.params.id, req.body);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Failed to update user" });
    }
  });

  app.delete("/api/admin/users/:id", async (req, res) => {
    try {
      await storage.deleteUser(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: "Failed to delete user" });
    }
  });

  app.get("/api/admin/data-versions", async (req, res) => {
    try {
      const sessionId = req.query.sessionId as string || "session-1";
      const versions = await storage.getDataVersions(sessionId);
      res.json(versions);
    } catch (error) {
      console.error("Error fetching data versions:", error);
      res.status(500).json({ error: "Failed to fetch data versions" });
    }
  });

  app.post("/api/admin/data-versions", async (req, res) => {
    try {
      const version = await storage.createDataVersion(req.body);
      res.status(201).json(version);
    } catch (error) {
      console.error("Error creating data version:", error);
      res.status(500).json({ error: "Failed to create data version" });
    }
  });

  app.delete("/api/admin/data-versions/:id", async (req, res) => {
    try {
      await storage.deleteDataVersion(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting data version:", error);
      res.status(500).json({ error: "Failed to delete data version" });
    }
  });

  app.get("/api/admin/group-accounts", async (req, res) => {
    try {
      const groupId = req.query.groupId as string;
      const accounts = await storage.getGroupAccounts(groupId);
      res.json(accounts);
    } catch (error) {
      console.error("Error fetching group accounts:", error);
      res.status(500).json({ error: "Failed to fetch group accounts" });
    }
  });

  app.post("/api/admin/group-accounts", async (req, res) => {
    try {
      const account = await storage.createGroupAccount(req.body);
      res.status(201).json(account);
    } catch (error) {
      console.error("Error creating group account:", error);
      res.status(500).json({ error: "Failed to create group account" });
    }
  });

  app.put("/api/admin/group-accounts/:id", async (req, res) => {
    try {
      const account = await storage.updateGroupAccount(req.params.id, req.body);
      if (!account) {
        return res.status(404).json({ error: "Group account not found" });
      }
      res.json(account);
    } catch (error) {
      console.error("Error updating group account:", error);
      res.status(500).json({ error: "Failed to update group account" });
    }
  });

  app.post("/api/admin/group-accounts/:id/deactivate", async (req, res) => {
    try {
      await storage.deactivateGroupAccount(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deactivating group account:", error);
      res.status(500).json({ error: "Failed to deactivate group account" });
    }
  });

  app.get("/api/admin/audit-logs", async (req, res) => {
    try {
      const entityType = req.query.entityType as string;
      const entityId = req.query.entityId as string;
      const logs = await storage.getAuditLogs(entityType, entityId);
      res.json(logs);
    } catch (error) {
      console.error("Error fetching audit logs:", error);
      res.status(500).json({ error: "Failed to fetch audit logs" });
    }
  });

  // Simulation Coordinator Routes
  app.get("/api/coordinator/documents", async (req, res) => {
    try {
      const sessionId = req.query.sessionId as string || "session-1";
      const patientId = req.query.patientId as string;
      const documents = await storage.getDocuments(sessionId, patientId);
      res.json(documents);
    } catch (error) {
      console.error("Error fetching documents:", error);
      res.status(500).json({ error: "Failed to fetch documents" });
    }
  });

  app.post("/api/coordinator/documents/upload", async (req, res) => {
    try {
      // For now, we'll simulate document upload with the request body
      // In a real implementation, this would handle file uploads
      const document = await storage.uploadDocument({
        sessionId: req.body.sessionId,
        patientId: req.body.patientId || null,
        category: req.body.category,
        originalName: req.body.originalName || "uploaded-file.pdf",
        filePath: `/uploads/${Date.now()}-${req.body.originalName || "file.pdf"}`,
        fileSize: req.body.fileSize || 1024,
        mimeType: req.body.mimeType || "application/pdf",
        uploadedBy: "coordinator-1"
      });
      res.status(201).json(document);
    } catch (error) {
      console.error("Error uploading document:", error);
      res.status(500).json({ error: "Failed to upload document" });
    }
  });

  app.delete("/api/coordinator/documents/:id", async (req, res) => {
    try {
      await storage.deleteDocument(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting document:", error);
      res.status(500).json({ error: "Failed to delete document" });
    }
  });

  app.get("/api/coordinator/document-releases", async (req, res) => {
    try {
      const groupId = req.query.groupId as string;
      const releases = await storage.getDocumentReleases(groupId);
      res.json(releases);
    } catch (error) {
      console.error("Error fetching document releases:", error);
      res.status(500).json({ error: "Failed to fetch document releases" });
    }
  });

  app.post("/api/coordinator/document-releases", async (req, res) => {
    try {
      const release = await storage.scheduleDocumentRelease(req.body);
      res.status(201).json(release);
    } catch (error) {
      console.error("Error scheduling document release:", error);
      res.status(500).json({ error: "Failed to schedule document release" });
    }
  });

  app.post("/api/coordinator/document-releases/:id/release", async (req, res) => {
    try {
      const release = await storage.releaseDocument(req.params.id, "coordinator-1");
      res.json(release);
    } catch (error) {
      console.error("Error releasing document:", error);
      res.status(500).json({ error: "Failed to release document" });
    }
  });

  app.delete("/api/coordinator/document-releases/:id", async (req, res) => {
    try {
      await storage.cancelDocumentRelease(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error cancelling document release:", error);
      res.status(500).json({ error: "Failed to cancel document release" });
    }
  });

  app.get("/api/coordinator/simulation-weeks", async (req, res) => {
    try {
      const sessionId = req.query.sessionId as string || "session-1";
      const weeks = await storage.getSimulationWeeks(sessionId);
      res.json(weeks);
    } catch (error) {
      console.error("Error fetching simulation weeks:", error);
      res.status(500).json({ error: "Failed to fetch simulation weeks" });
    }
  });

  app.post("/api/coordinator/simulation-weeks", async (req, res) => {
    try {
      const week = await storage.createSimulationWeek(req.body);
      res.status(201).json(week);
    } catch (error) {
      console.error("Error creating simulation week:", error);
      res.status(500).json({ error: "Failed to create simulation week" });
    }
  });

  app.post("/api/coordinator/simulation-weeks/:id/activate", async (req, res) => {
    try {
      const week = await storage.activateSimulationWeek(req.params.id);
      res.json(week);
    } catch (error) {
      console.error("Error activating simulation week:", error);
      res.status(500).json({ error: "Failed to activate simulation week" });
    }
  });

  app.put("/api/coordinator/simulation-weeks/:id", async (req, res) => {
    try {
      const week = await storage.updateSimulationWeek(req.params.id, req.body);
      if (!week) {
        return res.status(404).json({ error: "Simulation week not found" });
      }
      res.json(week);
    } catch (error) {
      console.error("Error updating simulation week:", error);
      res.status(500).json({ error: "Failed to update simulation week" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

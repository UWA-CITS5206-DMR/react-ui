import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { apiClientV2 } from "@/lib/queryClient";
import TopNavigation from "@/components/layout/top-navigation";
import PatientList from "@/components/patients/patient-list";
import PatientHeader from "@/components/patients/patient-header";
import PatientOverview from "@/components/patients/patient-overview";
import InstructorLabRequests from "@/components/instructors/instructor-lab-requests";
import FileManagement from "@/components/patients/file-management";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Patient } from "@/lib/api-client-v2";

// Local interface for session data (not available in API Client v2)
interface Session {
  id: string;
  name: string;
  timeRemaining?: number;
}

type InstructorTabValue = "overview" | "files" | "requests";
const LAST_TAB_KEY = "instructor-last-tab";
const LAST_PATIENT_KEY = "instructor-last-patient";

export default function InstructorDashboard() {
  const { user } = useAuth();
  const [selectedPatientId, setSelectedPatientId] = useState<string | undefined>();
  const [currentMode, setCurrentMode] = useState<"student" | "instructor">("instructor");
  const [activeTab, setActiveTab] = useState<InstructorTabValue>("overview");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const queryClient = useQueryClient();

  // Mock session data
  const session: Session | undefined = {
    id: "1",
    name: "Clinical Session 1",
    timeRemaining: 45,
  };

  // Fetch patients with React Query
  const { data: patientsResponse, isLoading: patientsLoading } = useQuery({
    queryKey: ["patients"],
    queryFn: () => apiClientV2.patients.list(),
  });

  const patients = patientsResponse?.results || [];

  // Fetch selected patient details
  const { data: selectedPatient } = useQuery({
    queryKey: ["/api/patients", selectedPatientId],
    queryFn: () => selectedPatientId ? apiClientV2.patients.retrieve(Number(selectedPatientId)) : null,
    enabled: !!selectedPatientId,
  });

  const handlePatientSelect = (patientId: string) => {
    setSelectedPatientId(patientId);
    localStorage.setItem(LAST_PATIENT_KEY, patientId);
  };

  // Handle patient creation - refresh the patients list
  const handlePatientCreated = (newPatient: Patient) => {
    queryClient.invalidateQueries({ queryKey: ["patients"] });
  };

  // Handle patient updates - refresh patients and update selected patient
  const handlePatientUpdated = (updatedPatient: Patient) => {
    queryClient.invalidateQueries({ queryKey: ["patients"] });
    queryClient.invalidateQueries({ queryKey: ["/api/patients", selectedPatientId] });
  };

  // Load last selected tab from localStorage
  useEffect(() => {
    const savedTab = localStorage.getItem(LAST_TAB_KEY);
    if (savedTab) {
      const validTabs: InstructorTabValue[] = ["overview", "files", "requests"];
      if (validTabs.includes(savedTab as InstructorTabValue)) {
        setActiveTab(savedTab as InstructorTabValue);
      }
    }
  }, []);

  // Load last selected patient from localStorage or auto-select first patient
  useEffect(() => {
    if (patients.length > 0 && !selectedPatientId) {
      const lastPatientId = localStorage.getItem(LAST_PATIENT_KEY);
      if (lastPatientId) {
        const patientId = parseInt(lastPatientId);
        // Verify patient still exists in the list
        const patientExists = patients.some((p: Patient) => p.id === patientId);
        if (patientExists) {
          setSelectedPatientId(patientId.toString());
          return;
        }
      }
      // Default to first patient if no valid saved selection
      setSelectedPatientId(patients[0].id.toString());
    }
  }, [patients, selectedPatientId]);

  // Save active tab to localStorage
  useEffect(() => {
    localStorage.setItem(LAST_TAB_KEY, activeTab);
  }, [activeTab]);

  if (patientsLoading) {
    return (
      <div className="h-screen flex flex-col">
        <TopNavigation
          currentMode={currentMode}
          onModeChange={setCurrentMode}
          sessionName={session?.name}
          timeRemaining={session?.timeRemaining ? `${session.timeRemaining}:00` : undefined}
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-hospital-blue"></div>
        </div>
      </div>
    );
  }

  if (!selectedPatientId || !selectedPatient) {
    return (
      <div className="h-screen flex flex-col">
        <TopNavigation
          currentMode={currentMode}
          onModeChange={setCurrentMode}
          sessionName={session?.name}
          timeRemaining={session?.timeRemaining ? `${session.timeRemaining}:00` : undefined}
        />
        <div className="flex flex-1">
          <PatientList
            patients={patients}
            selectedPatientId={selectedPatientId}
            onPatientSelect={handlePatientSelect}
            onPatientCreated={handlePatientCreated}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          />
          <div className="flex-1 flex items-center justify-center bg-bg-light">
            <p className="text-gray-500">Select a patient to view their records</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <TopNavigation
        currentMode={currentMode}
        onModeChange={setCurrentMode}
        sessionName={session?.name}
        timeRemaining={session?.timeRemaining ? `${session.timeRemaining}:00` : undefined}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <PatientList
          patients={patients}
          selectedPatientId={selectedPatientId}
          onPatientSelect={handlePatientSelect}
          onPatientCreated={handlePatientCreated}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
        
        <main className="flex-1 flex flex-col min-h-0 min-w-0">
          <PatientHeader 
            patient={selectedPatient} 
            onPatientUpdated={handlePatientUpdated}
          />
          
          <div className="flex-1 overflow-hidden">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as InstructorTabValue)} className="h-full flex flex-col">
              <div className="px-4 border-b">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Patient Overview</TabsTrigger>
                  <TabsTrigger value="files">File Management</TabsTrigger>
                  <TabsTrigger value="requests">Lab Requests</TabsTrigger>
                </TabsList>
              </div>
              
              <div className="flex-1 overflow-hidden">
                <TabsContent value="overview" className="h-full overflow-y-auto">
                  <PatientOverview patient={selectedPatient} />
                </TabsContent>
                
                <TabsContent value="files" className="h-full overflow-y-auto">
                  <FileManagement patientId={selectedPatient.id} />
                </TabsContent>
                
                <TabsContent value="requests" className="h-full overflow-y-auto">
                  <InstructorLabRequests />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}

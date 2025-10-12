import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { apiClientV2 } from "@/lib/queryClient";
import TopNavigation from "@/components/layout/top-navigation";
import PatientList from "@/components/patients/patient-list";
import PatientHeader from "@/components/patients/patient-header";
import PatientOverview from "@/components/patients/patient-overview";
import InstructorLabRequests from "@/components/instructors/instructor-lab-requests";
import FileManagement from "@/components/patients/file-management";
// import NotificationToast from "@/components/layout/notification-toast"; // REMOVED TEMPORARILY
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Patient } from "@/lib/api-client-v2";

// Local interface for session data (not available in API Client v2)
interface Session {
  id: string;
  name: string;
  timeRemaining?: number;
}

export default function InstructorDashboard() {
  const { user } = useAuth();
  const [selectedPatientId, setSelectedPatientId] = useState<string | undefined>();
  const [currentMode, setCurrentMode] = useState<"student" | "instructor">("instructor");
  const [activeTab, setActiveTab] = useState<"overview" | "files" | "requests">("overview");
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
  const selectedPatient = patients.find(p => p.id.toString() === selectedPatientId);

  const handlePatientSelect = (patientId: string) => {
    setSelectedPatientId(patientId);
  };

  // Handle patient creation - refresh the patients list
  const handlePatientCreated = (newPatient: Patient) => {
    queryClient.invalidateQueries({ queryKey: ["patients"] });
  };

  // Handle patient updates - refresh patients and update selected patient
  const handlePatientUpdated = (updatedPatient: Patient) => {
    queryClient.invalidateQueries({ queryKey: ["patients"] });
  };

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

  if (!selectedPatientId) {
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
        />
        
        <main className="flex-1 flex flex-col overflow-hidden">
          <PatientHeader 
            patient={selectedPatient} 
            onPatientUpdated={handlePatientUpdated}
          />
          
          <div className="flex-1 overflow-hidden">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "overview" | "files" | "requests")} className="h-full flex flex-col">
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
      
      {/* REMOVED: NotificationToast until we fix the props issue */}
      {/* <NotificationToast /> */}
    </div>
  );
}

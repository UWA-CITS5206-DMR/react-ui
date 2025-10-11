import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { apiClientV2 } from "@/lib/queryClient";
import TopNavigation from "@/components/layout/top-navigation";
import PatientList from "@/components/patients/patient-list";
import PatientHeader from "@/components/patients/patient-header";
import PatientOverview from "@/components/patients/patient-overview";
import InstructorLabRequests from "@/components/instructors/instructor-lab-requests";
import FileManagement from "@/components/patients/file-management";
import NotificationToast from "@/components/layout/notification-toast";
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
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    type: "success" | "warning" | "error";
    message: string;
  }>>([]);

  // For demo purposes, using a hardcoded session ID
  const sessionId = "session-1";

  // Mock session data (since Session API is not available in API Client v2)
  const session: Session = {
    id: sessionId,
    name: "Ward Round Session",
    timeRemaining: 42
  };

  const { data: patientsResponse } = useQuery({
    queryKey: ["/api/patients"],
    queryFn: () => apiClientV2.patients.list(),
  });

  const patients = patientsResponse?.results || [];

  const { data: selectedPatient } = useQuery({
    queryKey: ["/api/patients", selectedPatientId],
    queryFn: () => selectedPatientId ? apiClientV2.patients.retrieve(Number(selectedPatientId)) : null,
    enabled: !!selectedPatientId,
  });

  // Auto-select first patient if none selected
  useState(() => {
    if (patients.length > 0 && !selectedPatientId) {
      setSelectedPatientId(patients[0].id.toString());
    }
  });

  const handlePatientSelect = (patientId: string) => {
    setSelectedPatientId(patientId);
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  if (!selectedPatient) {
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
        />
        
        <main className="flex-1 flex flex-col overflow-hidden">
          <PatientHeader patient={selectedPatient} />
          
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
                
                <TabsContent value="files" className="h-full overflow-y-auto p-4">
                  <FileManagement patientId={selectedPatient.id} />
                </TabsContent>
                
                <TabsContent value="requests" className="h-full overflow-y-auto p-4">
                  <InstructorLabRequests patientId={selectedPatient.id} />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </main>
      </div>
      
      <NotificationToast
        notifications={notifications}
        onDismiss={dismissNotification}
      />
    </div>
  );
}

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import TopNavigation from "@/components/top-navigation";
import PatientList from "@/components/patient-list";
import PatientHeader from "@/components/patient-header";
import PatientOverview from "@/components/patient-overview";
import InstructorControls from "@/components/instructor-controls";
import NotificationToast from "@/components/notification-toast";
import type { Patient, Session } from "@shared/schema";

export default function InstructorDashboard() {
  const { user } = useAuth();
  const [selectedPatientId, setSelectedPatientId] = useState<string | undefined>();
  const [currentMode, setCurrentMode] = useState<"student" | "instructor">("instructor");
  const [showInstructorControls, setShowInstructorControls] = useState(true);
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    type: "success" | "warning" | "error";
    message: string;
  }>>([]);

  // For demo purposes, using a hardcoded session ID
  const sessionId = "session-1";

  const { data: session } = useQuery<Session>({
    queryKey: ["/api/sessions", sessionId],
  });

  const { data: patients = [] } = useQuery<Patient[]>({
    queryKey: ["/api/sessions", sessionId, "patients"],
  });

  const { data: selectedPatient } = useQuery<Patient>({
    queryKey: ["/api/patients", selectedPatientId],
    enabled: !!selectedPatientId,
  });

  // Auto-select first patient if none selected
  useState(() => {
    if (patients.length > 0 && !selectedPatientId) {
      setSelectedPatientId(patients[0].id);
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
          <PatientOverview patient={selectedPatient} />
        </main>
      </div>
      
      {currentMode === "instructor" && (
        <InstructorControls
          patientId={selectedPatient.id}
          isVisible={showInstructorControls}
          onClose={() => setShowInstructorControls(false)}
        />
      )}
      
      <NotificationToast
        notifications={notifications}
        onDismiss={dismissNotification}
      />
    </div>
  );
}

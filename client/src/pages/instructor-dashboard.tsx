import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import TopNavigation from "@/components/top-navigation";
import PatientList from "@/components/patient-list";
import PatientHeader from "@/components/patient-header";
import PatientOverview from "@/components/patient-overview";
import InstructorControls from "@/components/instructor-controls";
import NotificationToast from "@/components/notification-toast";
import { PatientDocuments } from "@/components/ui/patient-documents";
import type { Patient, Session } from "@shared/schema";

export default function InstructorDashboard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedPatientId, setSelectedPatientId] = useState<string | undefined>();
  const [currentMode, setCurrentMode] = useState<"student" | "instructor">("instructor");
  const [showInstructorControls, setShowInstructorControls] = useState(true);
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    type: "success" | "warning" | "error";
    message: string;
  }>>([]);
  const [activeTab, setActiveTab] = useState<'details' | 'documents'>('details');

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
            onPatientCreated={() => {
              queryClient.invalidateQueries({ queryKey: ["/api/sessions", sessionId, "patients"] });
            }}
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
          onPatientCreated={() => {
            queryClient.invalidateQueries({ queryKey: ["/api/sessions", sessionId, "patients"] });
          }}
        />
        
        <main className="flex-1 flex flex-col overflow-hidden">
          <PatientHeader 
            patient={selectedPatient} 
            onPatientUpdated={(updatedPatient) => {
              queryClient.invalidateQueries({ queryKey: ["/api/patients", selectedPatientId] });
            }}
          />
          
          {/* Tabs */}
          <div className="border-b border-gray-200 bg-white">
            <div className="flex space-x-8 px-6">
              <button
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'details'
                    ? 'border-hospital-blue text-hospital-blue'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('details')}
              >
                Details
              </button>
              <button
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'documents'
                    ? 'border-hospital-blue text-hospital-blue'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('documents')}
              >
                Documents
              </button>
            </div>
          </div>
          
          {/* Tab Content */}
          <div className="flex-1 overflow-auto">
            {activeTab === 'details' && <PatientOverview patient={selectedPatient} />}
            {activeTab === 'documents' && <PatientDocuments patientId={selectedPatient.id} />}
          </div>
        </main>
      </div>
      
      {currentMode === 'instructor' && (
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
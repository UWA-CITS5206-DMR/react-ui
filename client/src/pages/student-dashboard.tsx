import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import TopNavigation from "@/components/top-navigation";
import PatientList from "@/components/patient-list";
import PatientHeader from "@/components/patient-header";
import PatientOverview from "@/components/patient-overview";
import SoapNotesForm from "@/components/soap-notes-form";
import InvestigationRequests from "@/components/investigation-requests";
import MedicationOrders from "@/components/medication-orders";
import NotificationToast from "@/components/notification-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Patient, Session } from "@shared/schema";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [selectedPatientId, setSelectedPatientId] = useState<
    string | undefined
  >();
  const [currentMode, setCurrentMode] = useState<"student" | "instructor">(
    "student"
  );
  const [notifications, setNotifications] = useState<
    Array<{
      id: string;
      type: "success" | "warning" | "error";
      message: string;
    }>
  >([]);

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
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  if (!selectedPatient) {
    return (
      <div className="h-screen flex flex-col">
        <TopNavigation
          currentMode={currentMode}
          onModeChange={setCurrentMode}
          sessionName={session?.name}
          timeRemaining={
            session?.timeRemaining ? `${session.timeRemaining}:00` : undefined
          }
        />
        <div className="flex flex-1 min-h-0">
          <div className="w-80 shrink-0 overflow-y-auto border-r">
            <PatientList
              patients={patients}
              selectedPatientId={selectedPatientId}
              onPatientSelect={handlePatientSelect}
            />
          </div>
          <div className="flex-1 flex items-center justify-center bg-bg-light">
            <p className="text-gray-500">
              Select a patient to view their records
            </p>
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
        timeRemaining={
          session?.timeRemaining ? `${session.timeRemaining}:00` : undefined
        }
      />

      <div className="flex flex-1 min-h-0">
        <div className="w-80 shrink-0 overflow-y-auto border-r">
          <PatientList
            patients={patients}
            selectedPatientId={selectedPatientId}
            onPatientSelect={handlePatientSelect}
          />
        </div>
        <main className="flex-1 flex flex-col min-h-0">
          <PatientHeader patient={selectedPatient} />

          <Tabs
            defaultValue="overview"
            className="flex-1 flex flex-col min-h-0"
          >
            <div className="bg-white border-b border-gray-200">
              <TabsList className="h-auto p-0 bg-transparent">
                <div className="flex space-x-8 px-6">
                  <TabsTrigger
                    value="overview"
                    className="border-b-2 border-transparent data-[state=active]:border-hospital-blue data-[state=active]:text-hospital-blue py-3 px-1 rounded-none bg-transparent"
                  >
                    Overview
                  </TabsTrigger>
                  <TabsTrigger
                    value="assessment"
                    className="border-b-2 border-transparent data-[state=active]:border-hospital-blue data-[state=active]:text-hospital-blue py-3 px-1 rounded-none bg-transparent"
                  >
                    Assessment & Orders
                  </TabsTrigger>
                </div>
              </TabsList>
            </div>

            <TabsContent
              value="overview"
              className="flex-1 min-h-0 overflow-auto m-0"
            >
              <PatientOverview patient={selectedPatient} />
            </TabsContent>

            <TabsContent
              value="assessment"
              className="flex-1 min-h-0 overflow-auto m-0"
            >
              <div className="bg-bg-light p-6">
                <div className="max-w-7xl mx-auto">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-6">
                      Patient Assessment & Orders
                    </h2>

                    <Tabs defaultValue="soap" className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="soap">SOAP Notes</TabsTrigger>
                        <TabsTrigger value="investigations">
                          Investigations
                        </TabsTrigger>
                        <TabsTrigger value="medications">
                          Medications
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="soap">
                        <SoapNotesForm patientId={selectedPatient.id} />
                      </TabsContent>

                      <TabsContent value="investigations">
                        <InvestigationRequests patientId={selectedPatient.id} />
                      </TabsContent>

                      <TabsContent value="medications">
                        <MedicationOrders patientId={selectedPatient.id} />
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>

      <NotificationToast
        notifications={notifications}
        onDismiss={dismissNotification}
      />
    </div>
  );
}

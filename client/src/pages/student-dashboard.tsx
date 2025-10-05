import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { apiClientV2 } from "@/lib/queryClient";
import TopNavigation from "@/components/top-navigation";
import PatientList from "@/components/patient-list";
import PatientHeader from "@/components/patient-header";
import PatientOverview from "@/components/patient-overview";
import SoapNotesForm from "@/components/soap-notes-form";
import InvestigationRequests from "@/components/investigation-requests";
import MedicationOrders from "@/components/medication-orders";
import NotificationToast from "@/components/notification-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Patient } from "@/lib/api-client-v2";

// Mock session type for now since sessions API is not available in v2
interface Session {
  id: string;
  name: string;
  timeRemaining?: number;
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const [selectedPatientId, setSelectedPatientId] = useState<number | undefined>();
  const [currentMode, setCurrentMode] = useState<"student" | "instructor">("student");
  const [notifications, setNotifications] = useState<
    Array<{
      id: string;
      type: "success" | "warning" | "error";
      message: string;
    }>
  >([]);

  // Mock session data - replace with actual session API when available
  const mockSession: Session = {
    id: "session-1",
    name: "Clinical Training Session",
    timeRemaining: 45,
  };

  // Fetch patients using API Client v2
  const { data: patientsResponse } = useQuery({
    queryKey: ["patients"],
    queryFn: () => apiClientV2.patients.list(),
  });

  const patients = patientsResponse?.results || [];

  // Fetch selected patient details
  const { data: selectedPatient } = useQuery({
    queryKey: ["patient", selectedPatientId],
    queryFn: () => selectedPatientId ? apiClientV2.patients.retrieve(selectedPatientId) : null,
    enabled: !!selectedPatientId,
  });

  // Auto-select first patient if none selected
  useState(() => {
    if (patients.length > 0 && !selectedPatientId) {
      setSelectedPatientId(patients[0].id);
    }
  });

  const handlePatientSelect = (patientId: number) => {
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
          sessionName={mockSession.name}
          timeRemaining={
            mockSession.timeRemaining ? `${mockSession.timeRemaining}:00` : undefined
          }
        />
        <div className="flex flex-1 min-h-0">
          <div className="w-80 shrink-0 overflow-y-auto border-r">
            <PatientList
              patients={patients}
              selectedPatientId={selectedPatientId?.toString()}
              onPatientSelect={(patientId: string) => handlePatientSelect(parseInt(patientId))}
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
        sessionName={mockSession.name}
        timeRemaining={
          mockSession.timeRemaining ? `${mockSession.timeRemaining}:00` : undefined
        }
      />

      <div className="flex flex-1 min-h-0">
        <div className="w-80 shrink-0 overflow-y-auto border-r">
          <PatientList
            patients={patients}
            selectedPatientId={selectedPatientId?.toString()}
            onPatientSelect={(patientId: string) => handlePatientSelect(parseInt(patientId))}
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
                        <SoapNotesForm patientId={selectedPatient.id.toString()} />
                      </TabsContent>

                      <TabsContent value="investigations">
                        <InvestigationRequests patientId={selectedPatient.id.toString()} />
                      </TabsContent>

                      <TabsContent value="medications">
                        <MedicationOrders patientId={selectedPatient.id.toString()} />
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

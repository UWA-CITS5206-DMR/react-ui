import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { apiClientV2 } from "@/lib/queryClient";
import TopNavigation from "@/components/layout/top-navigation";
import PatientList from "@/components/patient/patient-list";
import PatientHeader from "@/components/patient/patient-header";
import PatientOverview from "@/components/patient/patient-overview";
import Observations from "@/components/observations/observations";
import SoapNotesForm from "@/components/patient/soap-notes-form";
import InvestigationRequests from "@/components/investigation-requests/investigation-requests";
import MedicationOrders from "@/components/medication-orders/medication-orders";
import DischargeSummary from "@/components/patient/discharge-summary";
import NotificationToast from "@/components/layout/notification-toast";
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
            <div className="bg-white border-b border-gray-200 overflow-x-auto">
              <TabsList className="h-auto p-0 bg-transparent inline-flex min-w-full justify-center">
                <div className="flex space-x-4 px-6">
                  <TabsTrigger
                    value="overview"
                    className="border-b-2 border-transparent data-[state=active]:border-hospital-blue data-[state=active]:text-hospital-blue py-3 px-2 rounded-none bg-transparent whitespace-nowrap"
                  >
                    Overview
                  </TabsTrigger>
                  <TabsTrigger
                    value="observations"
                    className="border-b-2 border-transparent data-[state=active]:border-hospital-blue data-[state=active]:text-hospital-blue py-3 px-2 rounded-none bg-transparent whitespace-nowrap"
                  >
                    Observations
                  </TabsTrigger>
                  <TabsTrigger
                    value="soap"
                    className="border-b-2 border-transparent data-[state=active]:border-hospital-blue data-[state=active]:text-hospital-blue py-3 px-2 rounded-none bg-transparent whitespace-nowrap"
                  >
                    SOAP Notes
                  </TabsTrigger>
                  <TabsTrigger
                    value="investigations"
                    className="border-b-2 border-transparent data-[state=active]:border-hospital-blue data-[state=active]:text-hospital-blue py-3 px-2 rounded-none bg-transparent whitespace-nowrap"
                  >
                    Investigation Requests
                  </TabsTrigger>
                  <TabsTrigger
                    value="medications"
                    className="border-b-2 border-transparent data-[state=active]:border-hospital-blue data-[state=active]:text-hospital-blue py-3 px-2 rounded-none bg-transparent whitespace-nowrap"
                  >
                    Medication Orders
                  </TabsTrigger>
                  <TabsTrigger
                    value="discharge"
                    className="border-b-2 border-transparent data-[state=active]:border-hospital-blue data-[state=active]:text-hospital-blue py-3 px-2 rounded-none bg-transparent whitespace-nowrap"
                  >
                    Discharge Summary
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
              value="observations"
              className="flex-1 min-h-0 overflow-auto m-0"
            >
              <div className="bg-bg-light p-6">
                <Observations patient={selectedPatient} />
              </div>
            </TabsContent>

            <TabsContent
              value="soap"
              className="flex-1 min-h-0 overflow-auto m-0"
            >
              <div className="bg-bg-light p-6">
                <SoapNotesForm patientId={selectedPatient.id.toString()} />
              </div>
            </TabsContent>

            <TabsContent
              value="investigations"
              className="flex-1 min-h-0 overflow-auto m-0"
            >
              <div className="bg-bg-light p-6">
                <InvestigationRequests patientId={selectedPatient.id.toString()} />
              </div>
            </TabsContent>

            <TabsContent
              value="medications"
              className="flex-1 min-h-0 overflow-auto m-0"
            >
              <div className="bg-bg-light p-6">
                <MedicationOrders patientId={selectedPatient.id.toString()} />
              </div>
            </TabsContent>

            <TabsContent
              value="discharge"
              className="flex-1 min-h-0 overflow-auto m-0"
            >
              <div className="bg-bg-light p-6">
                <DischargeSummary patient={selectedPatient} />
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

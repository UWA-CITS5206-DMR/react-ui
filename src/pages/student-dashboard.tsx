import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClientV2 } from "@/lib/queryClient";
import TopNavigation from "@/components/layout/top-navigation";
import PatientList from "@/components/patients/patient-list";
import PatientHeader from "@/components/patients/patient-header";
import PatientOverview from "@/components/patients/patient-overview";
import Observations from "@/components/student-groups/observations/observations";
import SoapNotesForm from "@/components/patients/soap-notes-form";
import InvestigationRequests from "@/components/student-groups/investigation-requests/investigation-requests";
import MedicationOrders from "@/components/student-groups/medication-orders/medication-orders";
import DischargeSummary from "@/components/patients/discharge-summary";
import NotificationToast from "@/components/layout/notification-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const LAST_PATIENT_KEY = "lastSelectedPatientId";

export default function StudentDashboard() {
  const [selectedPatientId, setSelectedPatientId] = useState<number | undefined>();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [notifications, setNotifications] = useState<
    Array<{
      id: string;
      type: "success" | "warning" | "error";
      message: string;
    }>
  >([]);

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

  // Load last selected patient from localStorage or auto-select first patient
  useEffect(() => {
    if (patients.length > 0 && !selectedPatientId) {
      const lastPatientId = localStorage.getItem(LAST_PATIENT_KEY);
      if (lastPatientId) {
        const patientId = parseInt(lastPatientId);
        // Verify patient still exists in the list
        const patientExists = patients.some(p => p.id === patientId);
        if (patientExists) {
          setSelectedPatientId(patientId);
          return;
        }
      }
      // Default to first patient if no valid saved selection
      setSelectedPatientId(patients[0].id);
    }
  }, [patients, selectedPatientId]);

  const handlePatientSelect = (patientId: number) => {
    setSelectedPatientId(patientId);
    // Save to localStorage
    localStorage.setItem(LAST_PATIENT_KEY, patientId.toString());
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  if (!selectedPatient) {
    return (
      <div className="h-screen flex flex-col overflow-x-hidden">
        <TopNavigation />
        <div className="flex flex-1 min-h-0">
          <PatientList
            patients={patients}
            selectedPatientId={selectedPatientId?.toString()}
            onPatientSelect={(patientId: string) => handlePatientSelect(parseInt(patientId))}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          />
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
    <div className="h-screen flex flex-col overflow-x-hidden">
      <TopNavigation />

      <div className="flex flex-1 min-h-0 min-w-0">
        <PatientList
          patients={patients}
          selectedPatientId={selectedPatientId?.toString()}
          onPatientSelect={(patientId: string) => handlePatientSelect(parseInt(patientId))}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
        <main className="flex-1 flex flex-col min-h-0 min-w-0">
          <PatientHeader patient={selectedPatient} />

          <Tabs
            defaultValue="overview"
            className="flex-1 flex flex-col min-h-0"
          >
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
              <div className="overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
                <TabsList className="h-auto p-0 bg-transparent inline-flex">
                  <div className="flex space-x-4 px-6 py-0">
                    <TabsTrigger
                      value="overview"
                      className="border-b-2 border-transparent data-[state=active]:border-hospital-blue data-[state=active]:text-hospital-blue py-3 px-3 rounded-none bg-transparent whitespace-nowrap text-sm font-medium transition-colors hover:text-hospital-blue"
                    >
                      Overview
                    </TabsTrigger>
                    <TabsTrigger
                      value="observations"
                      className="border-b-2 border-transparent data-[state=active]:border-hospital-blue data-[state=active]:text-hospital-blue py-3 px-3 rounded-none bg-transparent whitespace-nowrap text-sm font-medium transition-colors hover:text-hospital-blue"
                    >
                      Observations
                    </TabsTrigger>
                    <TabsTrigger
                      value="soap"
                      className="border-b-2 border-transparent data-[state=active]:border-hospital-blue data-[state=active]:text-hospital-blue py-3 px-3 rounded-none bg-transparent whitespace-nowrap text-sm font-medium transition-colors hover:text-hospital-blue"
                    >
                      SOAP Notes
                    </TabsTrigger>
                    <TabsTrigger
                      value="investigations"
                      className="border-b-2 border-transparent data-[state=active]:border-hospital-blue data-[state=active]:text-hospital-blue py-3 px-3 rounded-none bg-transparent whitespace-nowrap text-sm font-medium transition-colors hover:text-hospital-blue"
                    >
                      Investigation Requests
                    </TabsTrigger>
                    <TabsTrigger
                      value="medications"
                      className="border-b-2 border-transparent data-[state=active]:border-hospital-blue data-[state=active]:text-hospital-blue py-3 px-3 rounded-none bg-transparent whitespace-nowrap text-sm font-medium transition-colors hover:text-hospital-blue"
                    >
                      Medication Orders
                    </TabsTrigger>
                    <TabsTrigger
                      value="discharge"
                      className="border-b-2 border-transparent data-[state=active]:border-hospital-blue data-[state=active]:text-hospital-blue py-3 px-3 rounded-none bg-transparent whitespace-nowrap text-sm font-medium transition-colors hover:text-hospital-blue"
                    >
                      Discharge Summary
                    </TabsTrigger>
                  </div>
                </TabsList>
              </div>
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

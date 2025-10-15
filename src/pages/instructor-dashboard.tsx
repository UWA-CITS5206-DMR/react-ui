import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClientV2 } from "@/lib/queryClient";
import TopNavigation from "@/components/layout/top-navigation";
import PatientList from "@/components/patients/patient-list";
import PatientHeader from "@/components/patients/patient-header";
import InstructorPatientOverview from "@/components/instructors/patients/patient-overview";
import InstructorLabRequests from "@/components/instructors/investigation-requests/investigation-requests";
import FileManagement from "@/components/instructors/patients/file-management";
import GoogleFormsManagement from "@/components/instructors/google-forms-management";
import NotificationToast from "@/components/layout/notification-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const LAST_PATIENT_KEY = "lastSelectedPatientId";
const LAST_TAB_KEY = "instructorDashboardLastTab";

type InstructorTabValue = "overview" | "files" | "requests" | "google-forms";

export default function InstructorDashboard() {
  const [selectedPatientId, setSelectedPatientId] = useState<string | undefined>();
  const [activeTab, setActiveTab] = useState<InstructorTabValue>("overview");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [notifications, setNotifications] = useState<
    Array<{
      id: string;
      type: "success" | "warning" | "error";
      message: string;
    }>
  >([]);

  const { data: patientsResponse } = useQuery({
    queryKey: ["/api/patients"],
    queryFn: () => apiClientV2.patients.list(),
  });

  const patients = useMemo(() => patientsResponse?.results ?? [], [patientsResponse]);

  const { data: selectedPatient } = useQuery({
    queryKey: ["/api/patients", selectedPatientId],
    queryFn: () =>
      selectedPatientId ? apiClientV2.patients.retrieve(Number(selectedPatientId)) : null,
    enabled: !!selectedPatientId,
  });

  // Load last selected tab from localStorage
  useEffect(() => {
    const savedTab = localStorage.getItem(LAST_TAB_KEY);
    if (savedTab) {
      const validTabs: InstructorTabValue[] = ["overview", "files", "requests", "google-forms"];
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
        const patientExists = patients.some((p: { id: number }) => p.id === patientId);
        if (patientExists) {
          setSelectedPatientId(patientId.toString());
          return;
        }
      }
      // Default to first patient if no valid saved selection
      setSelectedPatientId(patients[0].id.toString());
    }
  }, [patients, selectedPatientId]);

  const handlePatientSelect = (patientId: string) => {
    setSelectedPatientId(patientId);
    // Save to localStorage
    localStorage.setItem(LAST_PATIENT_KEY, patientId);
  };

  const handleTabChange = (value: string) => {
    const newTab = value as InstructorTabValue;
    setActiveTab(newTab);
    // Save to localStorage
    localStorage.setItem(LAST_TAB_KEY, newTab);
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  if (!selectedPatient) {
    return (
      <div className="h-screen flex flex-col overflow-x-hidden">
        <TopNavigation />
        <div className="flex flex-1">
          <PatientList
            patients={patients}
            selectedPatientId={selectedPatientId}
            onPatientSelect={handlePatientSelect}
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
    <div className="h-screen flex flex-col overflow-x-hidden">
      <TopNavigation />

      <div className="flex flex-1 overflow-hidden min-w-0">
        <PatientList
          patients={patients}
          selectedPatientId={selectedPatientId}
          onPatientSelect={handlePatientSelect}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        <main className="flex-1 flex flex-col min-h-0 min-w-0">
          <PatientHeader patient={selectedPatient} />

          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
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
                      value="files"
                      className="border-b-2 border-transparent data-[state=active]:border-hospital-blue data-[state=active]:text-hospital-blue py-3 px-3 rounded-none bg-transparent whitespace-nowrap text-sm font-medium transition-colors hover:text-hospital-blue"
                    >
                      File Management
                    </TabsTrigger>
                    <TabsTrigger
                      value="requests"
                      className="border-b-2 border-transparent data-[state=active]:border-hospital-blue data-[state=active]:text-hospital-blue py-3 px-3 rounded-none bg-transparent whitespace-nowrap text-sm font-medium transition-colors hover:text-hospital-blue"
                    >
                      Investigation Requests
                    </TabsTrigger>
                    <TabsTrigger
                      value="google-forms"
                      className="border-b-2 border-transparent data-[state=active]:border-hospital-blue data-[state=active]:text-hospital-blue py-3 px-3 rounded-none bg-transparent whitespace-nowrap text-sm font-medium transition-colors hover:text-hospital-blue"
                    >
                      Google Forms
                    </TabsTrigger>
                  </div>
                </TabsList>
              </div>
            </div>

            <TabsContent value="overview" className="flex-1 min-h-0 overflow-auto m-0">
              <InstructorPatientOverview patient={selectedPatient} />
            </TabsContent>

            <TabsContent value="files" className="flex-1 min-h-0 overflow-auto m-0">
              <div className="bg-bg-light p-6">
                <FileManagement patientId={selectedPatient.id} />
              </div>
            </TabsContent>

            <TabsContent value="requests" className="flex-1 min-h-0 overflow-auto m-0">
              <div className="bg-bg-light p-6">
                <InstructorLabRequests patientId={selectedPatient.id} />
              </div>
            </TabsContent>

            <TabsContent value="google-forms" className="flex-1 min-h-0 overflow-auto m-0">
              <div className="bg-bg-light p-6">
                <GoogleFormsManagement />
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>

      <NotificationToast notifications={notifications} onDismiss={dismissNotification} />
    </div>
  );
}

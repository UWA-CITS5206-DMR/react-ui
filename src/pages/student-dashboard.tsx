import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { apiClientV2 } from "@/lib/queryClient";
import TopNavigation from "@/components/layout/top-navigation";
import PatientList from "@/components/patients/patient-list";
import PatientHeader from "@/components/patients/patient-header";
import StudentPatientOverview from "@/components/student-groups/student-patient-overview";
import Observations from "@/components/student-groups/observations/observations";
import SoapNotesForm from "@/components/patients/soap-notes-form";
import InvestigationRequests from "@/components/student-groups/investigation-requests/investigation-requests";
import MedicationOrders from "@/components/student-groups/medication-orders/medication-orders";
import DischargeSummary from "@/components/patients/discharge-summary";
// import NotificationToast from "@/components/layout/notification-toast"; // REMOVED TEMPORARILY
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const LAST_PATIENT_KEY = "lastSelectedPatientId";
const LAST_TAB_KEY = "studentDashboardLastTab";

type StudentTabValue = "overview" | "observations" | "soap" | "investigations" | "medications" | "discharge";

type StudentTabValue = 
  | "overview" 
  | "observations" 
  | "soap" 
  | "investigations" 
  | "medications" 
  | "discharge";

const LAST_PATIENT_KEY = "lastSelectedPatientId";
const LAST_TAB_KEY = "lastSelectedStudentTab";

export default function StudentDashboard() {
  const [selectedPatientId, setSelectedPatientId] = useState<number | undefined>();
  const [currentMode, setCurrentMode] = useState<"student" | "instructor">("student");
  const [activeTab, setActiveTab] = useState<StudentTabValue>("overview");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const queryClient = useQueryClient();

  // Mock session data
  const mockSession: Session = {
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
  const selectedPatient = patients.find(p => p.id === selectedPatientId);

  // Handle patient updates - refresh patients
  const handlePatientUpdated = (updatedPatient: Patient) => {
    queryClient.invalidateQueries({ queryKey: ["patients"] });
  };

  // Load last selected tab from localStorage
  useEffect(() => {
    const savedTab = localStorage.getItem(LAST_TAB_KEY);
    if (savedTab) {
      const validTabs: StudentTabValue[] = ["overview", "observations", "soap", "investigations", "medications", "discharge"];
      if (validTabs.includes(savedTab as StudentTabValue)) {
        setActiveTab(savedTab as StudentTabValue);
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

  const handleTabChange = (value: string) => {
    const newTab = value as StudentTabValue;
    setActiveTab(newTab);
    // Save to localStorage
    localStorage.setItem(LAST_TAB_KEY, newTab);
  };

  if (patientsLoading) {
    return (
      <div className="h-screen flex flex-col">
        <TopNavigation
          currentMode={currentMode}
          onModeChange={setCurrentMode}
          sessionName={mockSession.name}
          timeRemaining={mockSession.timeRemaining ? `${mockSession.timeRemaining}:00` : undefined}
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-hospital-blue"></div>
        </div>
      </div>
    );
  }

  if (!selectedPatientId || patients.length === 0) {
    return (
      <div className="h-screen flex flex-col">
        <TopNavigation
          currentMode={currentMode}
          onModeChange={setCurrentMode}
          sessionName={mockSession.name}
          timeRemaining={mockSession.timeRemaining ? `${mockSession.timeRemaining}:00` : undefined}
        />
        <div className="flex flex-1 min-h-0">
          <div className="w-80 shrink-0 overflow-y-auto border-r">
            <PatientList
              patients={patients}
              selectedPatientId={selectedPatientId?.toString()}
              onPatientSelect={(patientId: string) => handlePatientSelect(parseInt(patientId))}
              showCreateButton={false} // STUDENTS CANNOT CREATE PATIENTS
            />
          </div>
          <div className="flex-1 flex items-center justify-center bg-bg-light">
            <p className="text-gray-500">
              {patients.length === 0 ? "No patients available" : "Select a patient to view their records"}
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
        timeRemaining={mockSession.timeRemaining ? `${mockSession.timeRemaining}:00` : undefined}
      />

      <div className="flex flex-1 min-h-0">
        <div className="w-80 shrink-0 overflow-y-auto border-r">
          <PatientList
            patients={patients}
            selectedPatientId={selectedPatientId?.toString()}
            onPatientSelect={(patientId: string) => handlePatientSelect(parseInt(patientId))}
            showCreateButton={false} // STUDENTS CANNOT CREATE PATIENTS
          />
        </div>
        <main className="flex-1 flex flex-col min-h-0 min-w-0">
          {selectedPatient && (
            <>
              <PatientHeader 
                patient={selectedPatient} 
                onPatientUpdated={handlePatientUpdated}
              />

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

                <div className="flex-1 overflow-hidden">
                  <TabsContent value="overview" className="h-full p-0 m-0">
                    <PatientOverview patient={selectedPatient} />
                  </TabsContent>

                  <TabsContent value="observations" className="h-full p-0 m-0">
                    <Observations patientId={selectedPatient.id} />
                  </TabsContent>

                  <TabsContent value="soap" className="h-full p-0 m-0">
                    <SoapNotesForm patientId={selectedPatient.id.toString()} />
                  </TabsContent>

                  <TabsContent value="investigations" className="h-full p-0 m-0">
                    <InvestigationRequests patientId={selectedPatient.id} />
                  </TabsContent>

                  <TabsContent value="medications" className="h-full p-0 m-0">
                    <MedicationOrders patientId={selectedPatient.id} />
                  </TabsContent>

                  <TabsContent value="discharge" className="h-full p-0 m-0">
                    <DischargeSummary patientId={selectedPatient.id} />
                  </TabsContent>
                </div>
              </Tabs>
            </>
          )}
        </main>
      </div>
      
      {/* REMOVED: NotificationToast until we fix the props issue */}
      {/* <NotificationToast /> */}
    </div>
  );
}

import { useState } from "react";
import { User, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Patient } from "@/lib/api-client-v2";
import CreatePatientModal from "./create-patient-modal";
import { getGenderLabel } from "@/lib/constants";

interface PatientListProps {
  patients: Patient[];
  selectedPatientId?: string;
  onPatientSelect: (patientId: string) => void;
  onPatientCreated?: (patient: Patient) => void; // Patient creation callback
  isCollapsed?: boolean; // Collapse functionality
  onToggleCollapse?: () => void; // Collapse toggle
  showCreateButton?: boolean; // Control Add Patient button visibility
}

export default function PatientList({ 
  patients, 
  selectedPatientId, 
  onPatientSelect, 
  onPatientCreated,
  isCollapsed = false, // Default to not collapsed
  onToggleCollapse, // Optional collapse toggle
  showCreateButton = true // Default to showing create button
}: PatientListProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "critical":
        return "bg-critical-red/10 text-critical-red";
      case "stable":
        return "bg-success-green/10 text-success-green";
      case "monitoring":
        return "bg-alert-yellow/20 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status?: string) => {
    if (!status) return "Active";
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handlePatientCreated = (newPatient: Patient) => {
    onPatientCreated?.(newPatient);
    setIsCreateModalOpen(false);
  };

  return (
    <>
      <div className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 relative ${isCollapsed ? 'w-16' : 'w-80'}`}>
        {/* Collapse Toggle Button */}
        {onToggleCollapse && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="absolute -right-3 top-4 z-10 h-6 w-6 rounded-full border border-gray-300 bg-white p-0 shadow-sm hover:bg-gray-50"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        )}
        
        {/* Header with conditional Create Patient button */}
        <div className="p-4 border-b border-gray-200">
          {!isCollapsed ? (
            <>
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold text-gray-900">Patient List</h2>
                {showCreateButton && ( // ONLY show if showCreateButton is true
                  <Button 
                    onClick={() => setIsCreateModalOpen(true)}
                    size="sm"
                    className="bg-hospital-blue hover:bg-hospital-blue/90"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Patient
                  </Button>
                )}
              </div>
              <p className="text-sm text-gray-500">Select a patient to view records</p>
            </>
          ) : (
            <div className="flex justify-center">
              <User className="h-6 w-6 text-gray-600" />
            </div>
          )}
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {patients.map((patient) => (
            <div
              key={patient.id}
              onClick={() => onPatientSelect(patient.id.toString())}
              className={`border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                selectedPatientId === patient.id.toString() ? "bg-hospital-blue/5 border-hospital-blue/20" : ""
              } ${isCollapsed ? 'p-2' : 'p-4'}`}
              title={isCollapsed ? `${patient.first_name} ${patient.last_name}` : undefined}
            >
              {!isCollapsed ? (
                // Expanded view 
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-hospital-blue/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="h-5 w-5 text-hospital-blue" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {patient.first_name} {patient.last_name}
                      </h3>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
                        {getStatusLabel()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{patient.ward}-{patient.bed} • Age: {calculateAge(patient.date_of_birth)}y • Gender: {getGenderLabel(patient.gender)}</p>
                  </div>
                </div>
              ) : (
                // Collapsed view
                <div className="flex justify-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    selectedPatientId === patient.id.toString() 
                      ? "bg-hospital-blue text-white" 
                      : "bg-hospital-blue/10 text-hospital-blue"
                  }`}>
                    <User className="h-5 w-5" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Create Patient Modal */}
      <CreatePatientModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onPatientCreated={handlePatientCreated}
      />
    </>
  );
}

import { useState } from "react";
import { User, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Patient } from "@/lib/api-client-v2";
import CreatePatientModal from "./create-patient-modal";

interface PatientListProps {
  patients: Patient[];
  selectedPatientId?: string;
  onPatientSelect: (patientId: string) => void;
  onPatientCreated?: (patient: Patient) => void;
  showCreateButton?: boolean; // NEW: Control create button visibility
}

export default function PatientList({ 
  patients, 
  selectedPatientId, 
  onPatientSelect, 
  onPatientCreated,
  showCreateButton = true // DEFAULT: show button unless explicitly hidden
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
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header with conditional Create Patient button */}
        <div className="p-4 border-b border-gray-200">
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
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {patients.map((patient) => (
            <div
              key={patient.id}
              onClick={() => onPatientSelect(patient.id.toString())}
              className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                selectedPatientId === patient.id.toString() ? "bg-hospital-blue/5 border-hospital-blue/20" : ""
              }`}
            >
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
                  <p className="text-xs text-gray-500">ID: {patient.id}</p>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-xs text-gray-500">{calculateAge(patient.date_of_birth)}y</span>
                    {patient.email && (
                      <span className="text-xs text-gray-500 truncate">{patient.email}</span>
                    )}
                  </div>
                  {patient.phone_number && (
                    <p className="text-xs text-gray-500 mt-1">{patient.phone_number}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Patient Modal - only rendered if showCreateButton is true */}
      {showCreateButton && (
        <CreatePatientModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onPatientCreated={handlePatientCreated}
        />
      )}
    </>
  );
}

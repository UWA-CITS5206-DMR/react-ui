import { useState } from "react";
import { User, FileText, Plus } from "lucide-react";
import type { Patient } from "@shared/schema";
import { Button } from "@/components/ui/button";
import CreatePatientModal from "@/components/ui/create-patient-modal";

const getStatusColor = (status: string): string => {
  switch (status) {
    case 'critical':
      return 'bg-red-100 text-red-800';
    case 'stable':
      return 'bg-green-100 text-green-800';
    case 'urgent':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusLabel = (status: string): string => {
  switch (status) {
    case 'critical':
      return 'Critical';
    case 'stable':
      return 'Stable';
    case 'urgent':
      return 'Urgent';
    default:
      return 'Unknown';
  }
};

const calculateAge = (dateOfBirth: string): number => {
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

interface PatientListProps {
  patients: Patient[];
  selectedPatientId?: string;
  onPatientSelect: (patientId: string) => void;
  documentCounts?: { [patientId: string]: number };
  onPatientCreated?: (newPatient: Patient) => void;
}

export default function PatientList({ 
  patients, 
  selectedPatientId, 
  onPatientSelect, 
  documentCounts = {},
  onPatientCreated 
}: PatientListProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Header with Create Patient button */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold text-gray-900">Patient List</h2>
          <Button 
            onClick={() => setIsCreateModalOpen(true)}
            size="sm"
            className="bg-hospital-blue hover:bg-hospital-blue/90"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Patient
          </Button>
        </div>
        <p className="text-sm text-gray-500">Select a patient to view records</p>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {patients.map((patient) => (
          <div
            key={patient.id}
            onClick={() => onPatientSelect(patient.id)}
            className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
              selectedPatientId === patient.id ? "bg-hospital-blue/5 border-hospital-blue/20" : ""
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-hospital-blue/10 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="h-5 w-5 text-hospital-blue" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {patient.firstName} {patient.lastName}
                  </h3>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(patient.status)}`}>
                    {getStatusLabel(patient.status)}
                  </span>
                </div>
                <p className="text-xs text-gray-500">MRN: {patient.mrn}</p>
                <div className="flex items-center space-x-4 mt-1">
                  <span className="text-xs text-gray-500">{calculateAge(patient.dateOfBirth)}y</span>
                  <span className="text-xs text-gray-500">{patient.gender}</span>
                  <span className="text-xs text-gray-500">{patient.location}</span>
                </div>
                
                {/* DOCUMENT COUNT */}
                {documentCounts[patient.id] > 0 && (
                  <div className="mt-2 flex items-center space-x-1">
                    <FileText className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-500">
                      {documentCounts[patient.id]} document{documentCounts[patient.id] !== 1 ? 's' : ''}
                    </span>
                  </div>
                )}
                
                {/* CRITICAL STATUS */}
                {patient.status === "critical" && (
                  <div className="mt-2 flex items-center space-x-2">
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-alert-yellow/20 text-orange-800">
                      New Lab Results
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Patient Modal */}
    <CreatePatientModal 
      isOpen={isCreateModalOpen}
      onClose={() => setIsCreateModalOpen(false)}
      onPatientCreated={onPatientCreated}
    />
    </div>
  );
}
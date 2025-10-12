import { useState } from "react";
import { Calendar, Phone, Mail, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Patient } from "@/lib/api-client-v2";
import EditPatientModal from "./edit-patient-modal";

interface PatientHeaderProps {
  patient: Patient;
  onPatientUpdated?: (updatedPatient: Patient) => void;
}

export default function PatientHeader({ patient, onPatientUpdated }: PatientHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AU', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric'
    });
  };

  const handlePatientUpdated = (updatedPatient: Patient) => {
    onPatientUpdated?.(updatedPatient);
  };

  return (
    <>
      <div className="bg-white border-b border-gray-200 px-6 py-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <h1 className="text-2xl font-bold text-gray-900">
                {patient.first_name} {patient.last_name}
              </h1>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 whitespace-nowrap">
                Patient ID: {patient.id}
              </span>
              
              <Button 
                onClick={() => setIsEditing(true)}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <Edit className="h-4 w-4" />
                <span>Edit</span>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">DOB:</span>
                <span className="font-medium">{formatDate(patient.date_of_birth)}</span>
                <span className="text-gray-500">({calculateAge(patient.date_of_birth)}y)</span>
              </div>
              
              {patient.phone_number && (
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Phone:</span>
                  <span className="font-medium">{patient.phone_number}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Patient Modal */}
      <EditPatientModal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        patient={patient}
        onPatientUpdated={handlePatientUpdated}
      />
    </>
  );
}

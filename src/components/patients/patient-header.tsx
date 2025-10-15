import { useState } from "react";
import { Calendar, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Patient } from "@/lib/api-client-v2";
import EditPatientModal from "./edit-patient-modal";
import { getGenderLabel } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

interface PatientHeaderProps {
  patient: Patient;
  onPatientUpdated?: (updatedPatient: Patient) => void;
}

export default function PatientHeader({ patient, onPatientUpdated }: PatientHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useAuth();
  const isStudent = user?.role === "student";

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

              {!isStudent && (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  size="sm"
                  className="flex items-center"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">DOB:</span>
                <span className="font-medium">
                  {formatDate(patient.date_of_birth, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <span className="text-gray-500">({calculateAge(patient.date_of_birth)}y)</span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-gray-600">Gender:</span>
                <span className="font-medium">{getGenderLabel(patient.gender)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Patient Modal */}
      {/* Only render edit modal for non-students */}
      {!isStudent && (
        <EditPatientModal
          isOpen={isEditing}
          onClose={() => setIsEditing(false)}
          patient={patient}
          onPatientUpdated={handlePatientUpdated}
        />
      )}
    </>
  );
}

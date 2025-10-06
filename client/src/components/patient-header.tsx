import { useState } from "react";
import { MapPin, AlertCircle, Edit } from "lucide-react";
import type { Patient } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { PatientProfileEdit } from "@/components/ui/patient-profile-edit";

interface PatientHeaderProps {
  patient: Patient;
  onPatientUpdated?: (updatedPatient: Patient) => void;
}

export default function PatientHeader({ patient, onPatientUpdated }: PatientHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "critical":
        return {
          label: "Critical Status",
          className: "bg-critical-red/10 text-critical-red border-critical-red/20",
          icon: AlertCircle,
        };
      case "stable":
        return {
          label: "Stable",
          className: "bg-success-green/10 text-success-green border-success-green/20",
          icon: null,
        };
      case "monitoring":
        return {
          label: "Monitoring",
          className: "bg-alert-yellow/20 text-orange-800 border-orange-200",
          icon: null,
        };
      default:
        return {
          label: status,
          className: "bg-gray-100 text-gray-800 border-gray-200",
          icon: null,
        };
    }
  };

  const handleSave = async (updatedPatient: Patient) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/patients/${patient.id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(updatedPatient)
      });
      
      if (response.ok) {
        const savedPatient = await response.json();
        if (onPatientUpdated) {
          onPatientUpdated(savedPatient);
        }
        setIsEditing(false);
      } else {
        console.error('Failed to update patient');
      }
    } catch (error) {
      console.error('Error updating patient:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const statusDisplay = getStatusDisplay(patient.status);
  const StatusIcon = statusDisplay.icon;

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {patient.firstName} {patient.lastName}
            </h1>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>MRN: {patient.mrn}</span>
              <span>DOB: {formatDate(patient.dateOfBirth)}</span>
              <span>{calculateAge(patient.dateOfBirth)} years old</span>
              <span>{patient.gender}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-sm">
            <MapPin className="h-4 w-4 text-gray-400" />
            <span>{patient.location}</span>
          </div>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${statusDisplay.className}`}>
            {StatusIcon && <StatusIcon className="h-4 w-4 mr-1" />}
            {statusDisplay.label}
          </span>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsEditing(true)}
            disabled={isLoading}
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <PatientProfileEdit 
              patient={patient}
              onSave={handleSave}
              onCancel={() => setIsEditing(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
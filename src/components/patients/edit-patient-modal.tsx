import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiClientV2 } from "@/lib/queryClient";
import { getErrorMessage } from "@/lib/error-utils";
import type { Patient, PatientUpdate } from "@/lib/api-client-v2";

interface EditPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient;
  onPatientUpdated?: (patient: Patient) => void;
}

export default function EditPatientModal({ 
  isOpen, 
  onClose, 
  patient, 
  onPatientUpdated 
}: EditPatientModalProps) {
  const [formData, setFormData] = useState<PatientUpdate>({
    first_name: "",
    last_name: "",
    date_of_birth: "",
    email: "",
    phone_number: ""
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Initialize form with patient data when modal opens
  useEffect(() => {
    if (isOpen && patient) {
      setFormData({
        first_name: patient.first_name,
        last_name: patient.last_name,
        date_of_birth: patient.date_of_birth,
        email: patient.email,
        phone_number: patient.phone_number || ""
      });
    }
  }, [isOpen, patient]);

  const updatePatientMutation = useMutation({
    mutationFn: (patientData: PatientUpdate) => 
      apiClientV2.patients.partialUpdate(patient.id, patientData),
    onSuccess: (updatedPatient) => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      toast({
        title: "Patient Updated",
        description: "Patient information has been updated successfully.",
      });
      onPatientUpdated?.(updatedPatient);
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: getErrorMessage(error, "Failed to update patient."),
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prepare data for API - remove empty strings for optional fields
    const submitData: PatientUpdate = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      date_of_birth: formData.date_of_birth,
      email: formData.email,
      phone_number: formData.phone_number || undefined // Convert empty string to undefined
    };
    
    updatePatientMutation.mutate(submitData);
  };

  const handleChange = (field: keyof PatientUpdate, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Edit Patient</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="first_name">First Name *</Label>
            <Input
              id="first_name"
              value={formData.first_name}
              onChange={(e) => handleChange("first_name", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="last_name">Last Name *</Label>
            <Input
              id="last_name"
              value={formData.last_name}
              onChange={(e) => handleChange("last_name", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date_of_birth">Date of Birth *</Label>
            <Input
              id="date_of_birth"
              type="date"
              value={formData.date_of_birth}
              onChange={(e) => handleChange("date_of_birth", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone_number">Phone Number</Label>
            <Input
              id="phone_number"
              type="tel"
              value={formData.phone_number}
              onChange={(e) => handleChange("phone_number", e.target.value)}
              placeholder="Optional"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="patient_id">Patient ID</Label>
            <Input
              id="patient_id"
              value={patient.id}
              disabled
              className="bg-gray-100"
            />
            <p className="text-xs text-gray-500">Patient ID cannot be changed</p>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={updatePatientMutation.isPending}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={updatePatientMutation.isPending}
              className="bg-hospital-blue hover:bg-hospital-blue/90"
            >
              {updatePatientMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

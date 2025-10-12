import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiClientV2 } from "@/lib/queryClient";
import { getErrorMessage } from "@/lib/error-utils";
import type { PatientCreate } from "@/lib/api-client-v2";

interface CreatePatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPatientCreated?: (patient: any) => void;
}

export default function CreatePatientModal({ isOpen, onClose, onPatientCreated }: CreatePatientModalProps) {
  const [formData, setFormData] = useState({
    // Basic patient info
    first_name: "",
    last_name: "",
    date_of_birth: "",
    email: "",
    phone_number: "",
    gender: "",
    mrn: "",
    blood_type: "",
    
    // Medical information (to be stored in notes)
    allergies: "",
    medical_history: "",
    current_medications: "",
    additional_info: ""
  });
  
  const [includeMedicalInfo, setIncludeMedicalInfo] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createPatientMutation = useMutation({
    mutationFn: async (patientData: any) => {
      // Create basic patient
      const basicPatientData: PatientCreate = {
        first_name: patientData.first_name,
        last_name: patientData.last_name,
        date_of_birth: patientData.date_of_birth,
        email: patientData.email,
        phone_number: patientData.phone_number || undefined
      };
      
      const newPatient = await apiClientV2.patients.create(basicPatientData);
      
      // If medical info is included, create a medical history note
      if (patientData.includeMedicalInfo && (
        patientData.allergies || 
        patientData.medical_history || 
        patientData.current_medications ||
        patientData.additional_info
      )) {
        const medicalNoteContent = [
          patientData.mrn && `**Medical Record Number:** ${patientData.mrn}`,
          patientData.gender && `**Gender:** ${patientData.gender}`,
          patientData.blood_type && `**Blood Type:** ${patientData.blood_type}`,
          patientData.allergies && `**Allergies:**\n${patientData.allergies}`,
          patientData.medical_history && `**Medical History:**\n${patientData.medical_history}`,
          patientData.current_medications && `**Current Medications:**\n${patientData.current_medications}`,
          patientData.additional_info && `**Additional Information:**\n${patientData.additional_info}`
        ].filter(Boolean).join('\n\n');
        
        if (medicalNoteContent) {
          // Get current user info (you might need to adjust this based on your auth)
          // For now, using placeholder values
          await apiClientV2.studentGroups.notes.create({
            name: "System",
            role: "Administrator",
            patient: newPatient.id,
            user: 1, // This should be the current user's ID
            content: `**Initial Medical Information:**\n\n${medicalNoteContent}`
          });
        }
      }
      
      return newPatient;
    },
    onSuccess: (newPatient) => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      queryClient.invalidateQueries({ queryKey: ["notes", newPatient.id.toString()] });
      toast({
        title: "Patient Created",
        description: "Patient has been created successfully.",
      });
      onPatientCreated?.(newPatient);
      onClose();
      // Reset form
      setFormData({
        first_name: "",
        last_name: "",
        date_of_birth: "",
        email: "",
        phone_number: "",
        gender: "",
        mrn: "",
        blood_type: "",
        allergies: "",
        medical_history: "",
        current_medications: "",
        additional_info: ""
      });
      setIncludeMedicalInfo(false);
    },
    onError: (error: any) => {
      toast({
        title: "Creation Failed",
        description: getErrorMessage(error, "Failed to create patient."),
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createPatientMutation.mutate({
      ...formData,
      includeMedicalInfo
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Create New Patient</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
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
            </div>

            <div className="grid grid-cols-2 gap-4">
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
          </div>

          {/* Medical Information Toggle */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="includeMedicalInfo"
              checked={includeMedicalInfo}
              onChange={(e) => setIncludeMedicalInfo(e.target.checked)}
              className="rounded border-gray-300"
            />
            <Label htmlFor="includeMedicalInfo" className="text-sm font-medium">
              Include Medical Information
            </Label>
          </div>

          {/* Medical Information (Conditional) */}
          {includeMedicalInfo && (
            <div className="space-y-4 border-t pt-4">
              <h3 className="text-lg font-medium text-gray-900">Medical Information</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mrn">Medical Record Number</Label>
                  <Input
                    id="mrn"
                    value={formData.mrn}
                    onChange={(e) => handleChange("mrn", e.target.value)}
                    placeholder="Optional"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={formData.gender} onValueChange={(value) => handleChange("gender", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                      <SelectItem value="Unknown">Unknown</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="blood_type">Blood Type</Label>
                <Select value={formData.blood_type} onValueChange={(value) => handleChange("blood_type", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select blood type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                    <SelectItem value="Unknown">Unknown</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="allergies">Allergies</Label>
                <Textarea
                  id="allergies"
                  value={formData.allergies}
                  onChange={(e) => handleChange("allergies", e.target.value)}
                  placeholder="List known allergies..."
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="medical_history">Medical History</Label>
                <Textarea
                  id="medical_history"
                  value={formData.medical_history}
                  onChange={(e) => handleChange("medical_history", e.target.value)}
                  placeholder="Past medical history..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="current_medications">Current Medications</Label>
                <Textarea
                  id="current_medications"
                  value={formData.current_medications}
                  onChange={(e) => handleChange("current_medications", e.target.value)}
                  placeholder="Current medications..."
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="additional_info">Additional Information</Label>
                <Textarea
                  id="additional_info"
                  value={formData.additional_info}
                  onChange={(e) => handleChange("additional_info", e.target.value)}
                  placeholder="Any other relevant medical information..."
                  rows={2}
                />
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={createPatientMutation.isPending}
              className="bg-hospital-blue hover:bg-hospital-blue/90"
            >
              {createPatientMutation.isPending ? "Creating..." : "Create Patient"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

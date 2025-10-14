import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiClientV2 } from "@/lib/queryClient";
import { getErrorMessage } from "@/lib/error-utils";
import { GENDER_OPTIONS, getGenderLabel } from "@/lib/constants";
import { useAuth } from "@/hooks/use-auth";

interface CreatePatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPatientCreated?: (patient: any) => void;
}

export default function CreatePatientModal({
  isOpen,
  onClose,
  onPatientCreated,
}: CreatePatientModalProps) {
  const { user } = useAuth();
  const isStudent = user?.role === "student";

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    date_of_birth: "",
    email: "",
    phone_number: "",
    gender: "unspecified",
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createPatientMutation = useMutation({
    mutationFn: (patientData: any) => apiClientV2.patients.create(patientData),
    onSuccess: (createdPatient) => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      toast({
        title: "Patient Created",
        description: "Patient has been created successfully.",
      });
      onPatientCreated?.(createdPatient);
      onClose();
      setFormData({
        first_name: "",
        last_name: "",
        date_of_birth: "",
        email: "",
        phone_number: "",
        gender: "unspecified",
      });
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
    createPatientMutation.mutate(formData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // If a student somehow mounts this modal, don't render it.
  if (isStudent) return null;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Create New Patient</h2>
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
            <Label htmlFor="gender">Gender *</Label>
            <select
              id="gender"
              value={formData.gender}
              onChange={(e) => handleChange("gender", e.target.value)}
              className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2"
              required
            >
              {GENDER_OPTIONS.map((g) => (
                <option key={g} value={g}>
                  {getGenderLabel(g)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={createPatientMutation.isPending}>
              {createPatientMutation.isPending ? "Creating..." : "Create Patient"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

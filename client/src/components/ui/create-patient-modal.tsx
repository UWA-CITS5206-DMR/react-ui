import { useState } from "react";
import { X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface CreatePatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPatientCreated: (patient: any) => void;
}

export default function CreatePatientModal({ isOpen, onClose, onPatientCreated }: CreatePatientModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    mrn: "",
    bloodType: "",
    allergies: "",
    medicalHistory: "",
    currentMedications: "",
    location: "Emergency Department - Bed 1",
    status: "stable"
  });

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    const response = await fetch("/api/patients", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...formData,
        sessionId: "session-1" // Add sessionId since it's required
      }),
    });

    if (response.ok) {
      const newPatient = await response.json();
      console.log("Patient created successfully:", newPatient);
      onPatientCreated(newPatient);
      onClose();
      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        gender: "",
        mrn: "",
        bloodType: "",
        allergies: "",
        medicalHistory: "",
        currentMedications: "",
        location: "Emergency Department - Bed 1",
        status: "stable"
      });
    } else {
      console.error("Failed to create patient:", await response.text());
    }
  } catch (error) {
    console.error("Error creating patient:", error);
  } finally {
    setIsLoading(false);
  }
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
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth *</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender *</Label>
              <Select value={formData.gender} onValueChange={(value) => handleChange("gender", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="M">Male</SelectItem>
                  <SelectItem value="F">Female</SelectItem>
                  <SelectItem value="O">Other</SelectItem>
                  <SelectItem value="U">Unknown</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mrn">Medical Record Number (MRN) *</Label>
              <Input
                id="mrn"
                value={formData.mrn}
                onChange={(e) => handleChange("mrn", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bloodType">Blood Type</Label>
              <Select value={formData.bloodType} onValueChange={(value) => handleChange("bloodType", value)}>
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
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Select value={formData.location} onValueChange={(value) => handleChange("location", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Emergency Department - Bed 1">ED - Bed 1</SelectItem>
                <SelectItem value="Emergency Department - Bed 2">ED - Bed 2</SelectItem>
                <SelectItem value="Emergency Department - Bed 3">ED - Bed 3</SelectItem>
                <SelectItem value="Emergency Department - Bed 4">ED - Bed 4</SelectItem>
                <SelectItem value="Emergency Department - Bed 5">ED - Bed 5</SelectItem>
                <SelectItem value="Emergency Department - Bed 6">ED - Bed 6</SelectItem>
                <SelectItem value="Emergency Department - Bed 7">ED - Bed 7</SelectItem>
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
            <Label htmlFor="medicalHistory">Medical History</Label>
            <Textarea
              id="medicalHistory"
              value={formData.medicalHistory}
              onChange={(e) => handleChange("medicalHistory", e.target.value)}
              placeholder="Past medical history..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="currentMedications">Current Medications</Label>
            <Textarea
              id="currentMedications"
              value={formData.currentMedications}
              onChange={(e) => handleChange("currentMedications", e.target.value)}
              placeholder="Current medications..."
              rows={2}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-hospital-blue hover:bg-hospital-blue/90">
              {isLoading ? "Creating..." : "Create Patient"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
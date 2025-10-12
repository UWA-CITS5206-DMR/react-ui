import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Patient {
  id: string;
  mrn: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  location: string;  // Your actual field name
  status: string;
  chiefComplaint: string; // Your actual field name
  sessionId: string;
  createdAt: string;
  // Optional fields that might be added later
  allergies?: string;
  currentMedications?: string;
  bed?: string;
  ward?: string;
}

interface PatientProfileEditProps {
  patient: Patient;
  onSave: (patient: Patient) => void;
  onCancel: () => void;
}

export const PatientProfileEdit: React.FC<PatientProfileEditProps> = ({ 
  patient, 
  onSave, 
  onCancel 
}) => {
  const [formData, setFormData] = useState<Patient>({
    ...patient,
    // Initialize optional fields if they don't exist
    allergies: patient.allergies || '',
    currentMedications: patient.currentMedications || '',
    bed: patient.bed || '',
    ward: patient.ward || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (field: keyof Patient, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => handleChange('gender', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="mrn">MRN</Label>
                <Input
                  id="mrn"
                  value={formData.mrn}
                  onChange={(e) => handleChange('mrn', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stable">Stable</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location Information */}
        <Card>
          <CardHeader>
            <CardTitle>Location & Admission</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location">Location</Label>
                <Select
                  value={formData.location}
                  onValueChange={(value) => handleChange('location', value)}
                >
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
              <div>
                <Label htmlFor="bed">Bed (Optional)</Label>
                <Input
                  id="bed"
                  value={formData.bed || ''}
                  onChange={(e) => handleChange('bed', e.target.value)}
                  placeholder="Bed number"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Medical Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Medical Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="chiefComplaint">Chief Complaint</Label>
              <Textarea
                id="chiefComplaint"
                value={formData.chiefComplaint}
                onChange={(e) => handleChange('chiefComplaint', e.target.value)}
                placeholder="Patient's chief complaint..."
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="allergies">Allergies (Optional)</Label>
              <Textarea
                id="allergies"
                value={formData.allergies || ''}
                onChange={(e) => handleChange('allergies', e.target.value)}
                placeholder="List any known allergies..."
                rows={2}
              />
            </div>
            
            <div>
              <Label htmlFor="currentMedications">Current Medications (Optional)</Label>
              <Textarea
                id="currentMedications"
                value={formData.currentMedications || ''}
                onChange={(e) => handleChange('currentMedications', e.target.value)}
                placeholder="List current medications..."
                rows={2}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 mt-6">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Save Changes
        </Button>
      </div>
    </form>
  );
};
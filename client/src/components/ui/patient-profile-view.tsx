import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Patient {
  id: string;
  mrn: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  age: number;
  gender: string;
  ward: string;
  bed: string;
  status: string;
  allergies: string;
  medicalHistory: string;
  currentMedications: string;
}

interface PatientProfileViewProps {
  patient: Patient;
}

export const PatientProfileView: React.FC<PatientProfileViewProps> = ({ patient }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">First Name</label>
              <p className="text-base">{patient.firstName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Last Name</label>
              <p className="text-base">{patient.lastName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Date of Birth</label>
              <p className="text-base">{patient.dateOfBirth}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Gender</label>
              <p className="text-base">{patient.gender}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">MRN</label>
              <p className="text-base">{patient.mrn}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Status</label>
              <p className="text-base">{patient.status}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ward Information */}
      <Card>
        <CardHeader>
          <CardTitle>Location & Admission</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Ward</label>
              <p className="text-base">{patient.ward}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Bed</label>
              <p className="text-base">{patient.bed}</p>
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
            <label className="text-sm font-medium text-muted-foreground">Allergies</label>
            <p className="text-base mt-1 p-3 bg-muted rounded-md">
              {patient.allergies || 'No known allergies'}
            </p>
          </div>
          
          <div>
            <label className="text-sm font-medium text-muted-foreground">Medical History</label>
            <p className="text-base mt-1 p-3 bg-muted rounded-md whitespace-pre-wrap">
              {patient.medicalHistory || 'No significant medical history'}
            </p>
          </div>
          
          <div>
            <label className="text-sm font-medium text-muted-foreground">Current Medications</label>
            <p className="text-base mt-1 p-3 bg-muted rounded-md whitespace-pre-wrap">
              {patient.currentMedications || 'No current medications'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
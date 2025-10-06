import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PatientDocuments } from './patient-documents';
import { AccessControl } from './access-control';

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
  createdAt: string;
  updatedAt: string;
}

export const PatientProfile: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatient();
  }, [patientId]);

  const fetchPatient = async () => {
    try {
      // Replace with your actual API endpoint
      const response = await fetch(`/api/patients/${patientId}/`);
      const data = await response.json();
      setPatient(data);
    } catch (error) {
      console.error('Error fetching patient:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (updatedPatient: Patient) => {
    try {
      const response = await fetch(`/api/patients/${patientId}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPatient),
      });
      
      if (response.ok) {
        setPatient(updatedPatient);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating patient:', error);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">Loading patient profile...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">Patient not found</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Patient Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold">
                {patient.firstName} {patient.lastName}
              </h1>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span>MRN: {patient.mrn}</span>
                <span>DOB: {patient.dateOfBirth}</span>
                <span>{patient.age}y {patient.gender}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge variant={patient.status === 'Critical' ? 'destructive' : 'default'}>
                {patient.status}
              </Badge>
              <Button 
                variant="outline" 
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <strong>Ward:</strong> {patient.ward}
            </div>
            <div>
              <strong>Bed:</strong> {patient.bed}
            </div>
            <div>
              <strong>Last Updated:</strong> {new Date(patient.updatedAt).toLocaleDateString()}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="access">Access Control</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          {isEditing ? (
            <PatientProfileEdit 
              patient={patient} 
              onSave={handleSave} 
              onCancel={() => setIsEditing(false)} 
            />
          ) : (
            <PatientProfileView patient={patient} />
          )}
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents">
          <PatientDocuments patientId={patient.id} />
        </TabsContent>

        {/* Access Control Tab */}
        <TabsContent value="access">
          <AccessControl patientId={patient.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
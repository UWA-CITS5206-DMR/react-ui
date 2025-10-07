import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, CheckCircle, Heart } from "lucide-react";
import type { Patient } from "@/lib/api-client-v2";
import { apiClientV2 } from "@/lib/queryClient";
import { Badge } from "@/components/ui/badge";

interface PatientOverviewProps {
  patient: Patient;
}

export default function PatientOverview({ patient }: PatientOverviewProps) {
  // Fetch patient files using API Client v2
  const { data: patientFiles } = useQuery({
    queryKey: ["patient-files", patient.id],
    queryFn: () => apiClientV2.patients.files.list(patient.id),
  });

  const files = patientFiles?.results || [];

  return (
    <div className="bg-bg-light p-6">
      <div className="max-w-7xl mx-auto">
        {/* Patient Basic Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Patient Information</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Name</label>
              <p className="text-sm text-gray-900">{patient.first_name} {patient.last_name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Patient ID</label>
              <p className="text-sm text-gray-900">{patient.id}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Date of Birth</label>
              <p className="text-sm text-gray-900">{new Date(patient.date_of_birth).toLocaleDateString()}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="text-sm text-gray-900">{patient.email}</p>
            </div>
            {patient.phone_number && (
              <div>
                <label className="text-sm font-medium text-gray-500">Phone</label>
                <p className="text-sm text-gray-900">{patient.phone_number}</p>
              </div>
            )}
          </div>
        </div>

        {/* Patient Files */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Documents</h3>
          {files.length > 0 ? (
            <div className="space-y-2">
              {files.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{file.display_name}</p>
                    <p className="text-sm text-gray-500">
                      Category: {file.category || "Unspecified"} • 
                      Created: {new Date(file.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="outline">
                    {file.category || "Document"}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No documents available for this patient.</p>
          )}
        </div>

        {/* Mock Clinical Data */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Clinical Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Heart className="h-5 w-5 text-red-500" />
                <h4 className="font-medium text-gray-900">Vital Signs</h4>
              </div>
              <p className="text-sm text-gray-600">Latest vital signs and observations</p>
              <Badge variant="outline" className="mt-2">Monitoring Required</Badge>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <h4 className="font-medium text-gray-900">Lab Results</h4>
              </div>
              <p className="text-sm text-gray-600">Laboratory test results</p>
              <Badge variant="outline" className="mt-2">Pending</Badge>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <h4 className="font-medium text-gray-900">Medications</h4>
              </div>
              <p className="text-sm text-gray-600">Current medication orders</p>
              <Badge variant="outline" className="mt-2">Up to Date</Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

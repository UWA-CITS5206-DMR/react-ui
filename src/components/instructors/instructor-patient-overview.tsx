import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle, Clock, Eye } from "lucide-react";
import type { Patient, PatientFile } from "@/lib/api-client-v2";
import { apiClientV2 } from "@/lib/queryClient";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FilePreviewDialog from "@/components/patients/file-preview-dialog";
import { getGenderLabel } from "@/lib/constants";

interface InstructorPatientOverviewProps {
  patient: Patient;
}

export default function InstructorPatientOverview({ patient }: InstructorPatientOverviewProps) {
  const [previewFile, setPreviewFile] = useState<PatientFile | null>(null);

  // Fetch blood test requests stats for this patient
  const { data: bloodTestsStats } = useQuery({
    queryKey: ["instructors", "blood-test-requests", "stats", patient.id],
    queryFn: () => apiClientV2.instructors.bloodTestRequests.stats(),
  });

  // Fetch imaging requests stats for this patient
  const { data: imagingRequestsStats } = useQuery({
    queryKey: ["instructors", "imaging-requests", "stats", patient.id],
    queryFn: () => apiClientV2.instructors.imagingRequests.stats(),
  });

  // Fetch patient files using API Client v2
  const { data: patientFiles } = useQuery({
    queryKey: ["patient-files", patient.id],
    queryFn: () => apiClientV2.patients.files.list(patient.id),
  });

  const files = patientFiles?.results || [];

  // Calculate lab request statistics from stats API
  const bloodTestsStatsData = bloodTestsStats as any; // Type assertion since StatsResponse is generic
  const imagingRequestsStatsData = imagingRequestsStats as any;

  const totalLabRequests =
    (bloodTestsStatsData?.total || 0) + (imagingRequestsStatsData?.total || 0);
  const completedLabRequests =
    (bloodTestsStatsData?.completed || 0) + (imagingRequestsStatsData?.completed || 0);
  const pendingLabRequests =
    (bloodTestsStatsData?.pending || 0) + (imagingRequestsStatsData?.pending || 0);

  return (
    <div className="bg-bg-light p-6">
      <div className="max-w-7xl mx-auto">
        {/* Patient Basic Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Patient Information</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Name</label>
              <p className="text-sm text-gray-900">
                {patient.first_name} {patient.last_name}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Patient ID</label>
              <p className="text-sm text-gray-900">{patient.id}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Date of Birth</label>
              <p className="text-sm text-gray-900">
                {new Date(patient.date_of_birth).toLocaleDateString()}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">MRN</label>
              <p className="text-sm text-gray-900">{patient.mrn}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Gender</label>
              <p className="text-sm text-gray-900">{getGenderLabel(patient.gender)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Ward</label>
              <p className="text-sm text-gray-900">{patient.ward}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Bed</label>
              <p className="text-sm text-gray-900">{patient.bed}</p>
            </div>
            {patient.phone_number && (
              <div>
                <label className="text-sm font-medium text-gray-500">Phone</label>
                <p className="text-sm text-gray-900">{patient.phone_number}</p>
              </div>
            )}
          </div>
        </div>

        {/* Investigation Requests Overview */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Investigation Requests Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  Completed Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{completedLabRequests}</div>
                <p className="text-sm text-gray-500 mt-1">Requests completed and approved</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium flex items-center">
                  <Clock className="h-5 w-5 text-yellow-500 mr-2" />
                  Pending Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-600">{pendingLabRequests}</div>
                <p className="text-sm text-gray-500 mt-1">Requests awaiting review</p>
              </CardContent>
            </Card>
          </div>

          {totalLabRequests > 0 && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">
                  Total Investigation Requests
                </span>
                <span className="text-lg font-semibold text-gray-900">{totalLabRequests}</span>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Blood Tests: {bloodTestsStatsData?.total || 0} • Imaging:{" "}
                {imagingRequestsStatsData?.total || 0}
              </div>
            </div>
          )}
        </div>

        {/* Patient Files */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Documents</h3>
          {files.length > 0 ? (
            <div className="space-y-2">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">{file.display_name}</p>
                    <p className="text-sm text-gray-500">
                      Category: {file.category || "Unspecified"} • Created:{" "}
                      {new Date(file.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{file.category || "Document"}</Badge>
                    <Button variant="ghost" size="sm" onClick={() => setPreviewFile(file)}>
                      <Eye className="h-4 w-4 mr-1" />
                      Preview
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No documents available for this patient.</p>
          )}
        </div>
      </div>

      {/* File Preview Dialog */}
      {previewFile && (
        <FilePreviewDialog
          open={!!previewFile}
          onOpenChange={(open) => !open && setPreviewFile(null)}
          patientId={patient.id}
          fileId={previewFile.id}
          fileName={previewFile.display_name}
          category={previewFile.category}
          requiresPagination={previewFile.requires_pagination}
        />
      )}
    </div>
  );
}

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Activity, FlaskConical, Pill, Eye } from "lucide-react";
import type { Patient, PatientFile } from "@/lib/api-client-v2";
import { apiClientV2 } from "@/lib/queryClient";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StudentFilePreviewDialog from "../investigation-requests/file-preview-dialog";
import { getGenderLabel } from "@/lib/constants";
import { getVitalSignAbbreviation, getBloodPressureAbbreviation } from "@/lib/vital-signs";

interface StudentPatientOverviewProps {
  patient: Patient;
}

export default function StudentPatientOverview({ patient }: StudentPatientOverviewProps) {
  const [previewFile, setPreviewFile] = useState<PatientFile | null>(null);

  // Fetch latest observations for this patient
  const { data: observationsResponse } = useQuery({
    queryKey: ["/api/student-groups/observations", patient.id],
    queryFn: async () => {
      return await apiClientV2.studentGroups.observations.list({
        patient: patient.id,
        ordering: "-created_at",
      });
    },
  });

  // Fetch blood test requests for this patient
  const { data: bloodTestsData } = useQuery({
    queryKey: ["student-groups", "blood-test-requests", patient.id],
    queryFn: () =>
      apiClientV2.studentGroups.bloodTestRequests.list({
        patient: patient.id,
        page_size: 1000,
      }),
  });

  // Fetch imaging requests for this patient
  const { data: imagingRequestsData } = useQuery({
    queryKey: ["student-groups", "imaging-requests", patient.id],
    queryFn: () =>
      apiClientV2.studentGroups.imagingRequests.list({
        patient: patient.id,
        page_size: 1000,
      }),
  });

  // Fetch medication orders for this patient
  const { data: medicationOrdersData } = useQuery({
    queryKey: ["student-groups", "medication-orders", patient.id],
    queryFn: () =>
      apiClientV2.studentGroups.medicationOrders.list({
        patient: patient.id,
        page_size: 1000,
      }),
  });

  // Fetch patient files using API Client v2 (filtered by backend for students)
  const { data: patientFiles } = useQuery({
    queryKey: ["patient-files", patient.id],
    queryFn: () => apiClientV2.patients.files.list(patient.id),
  });

  const observations = observationsResponse?.results;
  const bloodTests = bloodTestsData?.results || [];
  const imagingRequests = imagingRequestsData?.results || [];
  const medicationOrders = medicationOrdersData?.results || [];
  const files = patientFiles?.results || [];

  // Get the latest observation values
  const latestBloodPressure = observations?.blood_pressures?.[0];
  const latestHeartRate = observations?.heart_rates?.[0];
  const latestTemperature = observations?.body_temperatures?.[0];
  const latestRespRate = observations?.respiratory_rates?.[0];
  const latestO2Sat = observations?.oxygen_saturations?.[0];

  // Format latest observation display
  const latestObservationText =
    latestBloodPressure || latestHeartRate || latestTemperature
      ? [
          latestBloodPressure
            ? getBloodPressureAbbreviation(
                latestBloodPressure.systolic,
                latestBloodPressure.diastolic
              )
            : null,
          latestHeartRate
            ? getVitalSignAbbreviation("heartRate", latestHeartRate.heart_rate)
            : null,
          latestTemperature
            ? getVitalSignAbbreviation("temperature", latestTemperature.temperature)
            : null,
        ]
          .filter(Boolean)
          .join(" • ")
      : "No observations recorded";

  // Get latest investigation request
  const latestBloodTest = bloodTests[0];
  const latestImaging = imagingRequests[0];
  const latestInvestigation = latestBloodTest || latestImaging;
  const investigationText = latestInvestigation
    ? `${latestBloodTest ? latestBloodTest.test_type : latestImaging?.test_type} - ${
        latestInvestigation.status
      }`
    : "No investigation requests";

  // Get latest medication order
  const latestMedication = medicationOrders[0];
  const medicationText = latestMedication
    ? `${latestMedication.medication_name} - ${latestMedication.dosage}`
    : "No medication orders";

  // Calculate status badges
  const observationStatus =
    observations &&
    (observations.blood_pressures?.length > 0 ||
      observations.heart_rates?.length > 0 ||
      observations.body_temperatures?.length > 0)
      ? "Recent Data"
      : "No Data";

  const investigationStatus = (() => {
    const pending = [...bloodTests, ...imagingRequests].filter(
      (r) => r.status === "pending"
    ).length;
    const completed = [...bloodTests, ...imagingRequests].filter(
      (r) => r.status === "completed"
    ).length;
    if (pending > 0) return `${pending} Pending`;
    if (completed > 0) return "Completed";
    return "No Requests";
  })();

  const medicationStatus =
    medicationOrders.length > 0 ? `${medicationOrders.length} Active` : "No Orders";

  return (
    <div className="bg-bg-light p-6">
      <div className="max-w-7xl mx-auto">
        {/* Patient Basic Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Patient Information</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>

        {/* Clinical Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Clinical Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Observations Card */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-medium flex items-center">
                    <Activity className="h-5 w-5 text-red-500 mr-2" />
                    Observations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-2">{latestObservationText}</p>
                  {latestRespRate && (
                    <p className="text-xs text-gray-500">
                      RR: {latestRespRate.respiratory_rate} • O2:{" "}
                      {latestO2Sat?.saturation_percentage}%
                    </p>
                  )}
                  <Badge variant="outline" className="mt-2">
                    {observationStatus}
                  </Badge>
                </CardContent>
              </Card>

              {/* Investigation Requests Card */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-medium flex items-center">
                    <FlaskConical className="h-5 w-5 text-blue-500 mr-2" />
                    Investigation Requests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-2">{investigationText}</p>
                  {latestInvestigation && (
                    <p className="text-xs text-gray-500">
                      Created: {new Date(latestInvestigation.created_at).toLocaleDateString()}
                    </p>
                  )}
                  <Badge variant="outline" className="mt-2">
                    {investigationStatus}
                  </Badge>
                </CardContent>
              </Card>

              {/* Medication Orders Card */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-medium flex items-center">
                    <Pill className="h-5 w-5 text-green-500 mr-2" />
                    Medication Orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-2">{medicationText}</p>
                  {latestMedication && (
                    <p className="text-xs text-gray-500">
                      Instructions: {latestMedication.instructions}
                    </p>
                  )}
                  <Badge variant="outline" className="mt-2">
                    {medicationStatus}
                  </Badge>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Patient Documents */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Patient Documents</CardTitle>
          </CardHeader>
          <CardContent>
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
                        <Eye className="h-4 w-4" />
                        Preview
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No documents available for this patient.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* File Preview Dialog */}
      {previewFile && (
        <StudentFilePreviewDialog
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

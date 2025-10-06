import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import type { Patient } from "@/lib/api-client-v2";
import { LatestObservationsDisplay } from "./observations/latest-observations-display";
import { BulkVitalSignsForm } from "./observations/bulk-vital-signs-form";

interface VitalSigns {
  id?: string;
  patientId?: string;
  systolic?: number;
  diastolic?: number;
  heartRate?: number;
  temperature?: string;
  respiratoryRate?: number;
  oxygenSaturation?: number;
  bloodPressure?: string;
  bloodSugar?: number;
  painScore?: number;
  recordedAt?: string;
  recordedBy?: string;
}

interface CurrentObservationsProps {
  patient: Patient;
}

/**
 * Current observations main component
 * 
 * This component has been refactored to reuse BulkVitalSignsForm and LatestObservationsDisplay
 */
export default function CurrentObservations({ patient }: CurrentObservationsProps) {
  const { user } = useAuth();

  const { data: latestVitals } = useQuery<VitalSigns>({
    queryKey: ["/api/patients", patient.id, "vitals"],
    queryFn: async (): Promise<VitalSigns> => {
      // Mock data for now - replace with actual API call when backend is ready
      return {
        id: `${patient.id}-vitals`,
        patientId: patient.id.toString(),
        heartRate: 72,
        temperature: "98.6",
        respiratoryRate: 16,
        oxygenSaturation: 98,
        bloodPressure: "120/80",
        bloodSugar: 110,
        painScore: 2,
        recordedAt: new Date().toISOString(),
        recordedBy: user?.id?.toString() || "unknown",
      };
    },
  });

  return (
    <div className="space-y-6">
      {/* Latest Observations Display */}
      <LatestObservationsDisplay vitals={latestVitals} />

      {/* New Observations Form - Reuse BulkVitalSignsForm */}
      <BulkVitalSignsForm patient={patient} />
    </div>
  );
}

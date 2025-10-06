import { useQuery } from "@tanstack/react-query";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import type { Patient } from "@/lib/api-client-v2";
import { Activity, Heart, Thermometer, Wind, Droplets, AlertCircle } from "lucide-react";

// VitalSigns type for current implementation
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

export default function CurrentObservations({
  patient,
}: CurrentObservationsProps) {
  const { user } = useAuth();

  const { data: latestVitals, isLoading } = useQuery<VitalSigns>({
    queryKey: ["/api/patients", patient.id, "vitals"],
    queryFn: async (): Promise<VitalSigns> => {
      // Mock data for now - replace with actual API call when backend is ready
      return {
        id: `${patient.id}-vitals`,
        patientId: patient.id.toString(),
        heartRate: 72,
        temperature: "36.5",
        respiratoryRate: 16,
        oxygenSaturation: 98,
        bloodPressure: "120/80",
        systolic: 120,
        diastolic: 80,
        bloodSugar: 5.5,
        painScore: 2,
        recordedAt: new Date().toISOString(),
        recordedBy: user?.id?.toString() || "unknown"
      };
    },
  });

  if (isLoading) {
    return (
      <div className="bg-bg-light p-6">
        <div className="max-w-7xl mx-auto">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-500">Loading observations...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <Card>
        <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Latest Observations
        </CardTitle>
        <p className="text-sm text-gray-600">
            Most recent vital signs and observations for {patient.first_name} {patient.last_name}
        </p>
        {latestVitals?.recordedAt && (
            <p className="text-xs text-gray-500">
            Last recorded: {new Date(latestVitals.recordedAt).toLocaleString()}
            </p>
        )}
        </CardHeader>
        <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Blood Pressure */}
            <div className="space-y-2">
            <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-red-500" />
                <Label className="text-sm font-semibold text-gray-700">Blood Pressure</Label>
            </div>
            <p className="text-2xl font-bold text-gray-900">
                {latestVitals?.bloodPressure || latestVitals?.systolic && latestVitals?.diastolic 
                ? `${latestVitals.systolic}/${latestVitals.diastolic}` 
                : "N/A"}
            </p>
            <p className="text-xs text-gray-500">mmHg</p>
            </div>

            {/* Heart Rate */}
            <div className="space-y-2">
            <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-pink-500" />
                <Label className="text-sm font-semibold text-gray-700">Heart Rate</Label>
            </div>
            <p className="text-2xl font-bold text-gray-900">
                {latestVitals?.heartRate || "N/A"}
            </p>
            <p className="text-xs text-gray-500">bpm</p>
            </div>

            {/* Temperature */}
            <div className="space-y-2">
            <div className="flex items-center gap-2">
                <Thermometer className="h-4 w-4 text-orange-500" />
                <Label className="text-sm font-semibold text-gray-700">Temperature</Label>
            </div>
            <p className="text-2xl font-bold text-gray-900">
                {latestVitals?.temperature || "N/A"}
            </p>
            <p className="text-xs text-gray-500">°C</p>
            </div>

            {/* Respiratory Rate */}
            <div className="space-y-2">
            <div className="flex items-center gap-2">
                <Wind className="h-4 w-4 text-blue-500" />
                <Label className="text-sm font-semibold text-gray-700">Respiratory Rate</Label>
            </div>
            <p className="text-2xl font-bold text-gray-900">
                {latestVitals?.respiratoryRate || "N/A"}
            </p>
            <p className="text-xs text-gray-500">/min</p>
            </div>

            {/* O2 Saturation */}
            <div className="space-y-2">
            <div className="flex items-center gap-2">
                <Droplets className="h-4 w-4 text-cyan-500" />
                <Label className="text-sm font-semibold text-gray-700">O2 Saturation</Label>
            </div>
            <p className="text-2xl font-bold text-gray-900">
                {latestVitals?.oxygenSaturation || "N/A"}
            </p>
            <p className="text-xs text-gray-500">%</p>
            </div>

            {/* Blood Sugar */}
            <div className="space-y-2">
            <div className="flex items-center gap-2">
                <Droplets className="h-4 w-4 text-purple-500" />
                <Label className="text-sm font-semibold text-gray-700">Blood Sugar</Label>
            </div>
            <p className="text-2xl font-bold text-gray-900">
                {latestVitals?.bloodSugar || "N/A"}
            </p>
            <p className="text-xs text-gray-500">mmol/L</p>
            </div>

            {/* Pain Score */}
            <div className="space-y-2">
            <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-500" />
                <Label className="text-sm font-semibold text-gray-700">Pain Score</Label>
            </div>
            <p className="text-2xl font-bold text-gray-900">
                {latestVitals?.painScore !== undefined ? latestVitals.painScore : "N/A"}
            </p>
            <p className="text-xs text-gray-500">0-10 scale</p>
            </div>
        </div>

        {!latestVitals && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800">
                No observations recorded yet. Use the "Add Observations" tab to record vital signs.
            </p>
            </div>
        )}
        </CardContent>
    </Card>
  );
}

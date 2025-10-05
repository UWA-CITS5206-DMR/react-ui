import { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { apiClientV2 } from "@/lib/queryClient";
import type { ObservationCreateBundle, Patient } from "@/lib/api-client-v2";

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
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    systolic: "",
    diastolic: "",
    heartRate: "",
    temperature: "",
    respiratoryRate: "",
    oxygenSaturation: "",
    bloodSugar: "",
    painScore: "",
  });

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
        recordedBy: user?.id?.toString() || "unknown"
      };
    },
  });

  const createObservationsMutation = useMutation({
    mutationFn: async (newVitals: typeof formData) => {
      if (!user) {
        throw new Error("User not authenticated. Cannot record observations.");
      }

      const payload: ObservationCreateBundle = {
        blood_pressure: (newVitals.systolic && newVitals.diastolic) ? {
          systolic: Number(newVitals.systolic),
          diastolic: Number(newVitals.diastolic),
          patient: Number(patient.id),
          user: Number(user.id),
        } : undefined,
        heart_rate: newVitals.heartRate ? {
          heart_rate: Number(newVitals.heartRate),
          patient: Number(patient.id),
          user: Number(user.id),
        } : undefined,
        body_temperature: newVitals.temperature ? {
          temperature: newVitals.temperature,
          patient: Number(patient.id),
          user: Number(user.id),
        } : undefined,
        respiratory_rate: newVitals.respiratoryRate ? {
          respiratory_rate: Number(newVitals.respiratoryRate),
          patient: Number(patient.id),
          user: Number(user.id),
        } : undefined,
        blood_sugar: newVitals.bloodSugar ? {
          sugar_level: newVitals.bloodSugar,
          patient: Number(patient.id),
          user: Number(user.id),
        } : undefined,
        oxygen_saturation: newVitals.oxygenSaturation ? {
          saturation_percentage: Number(newVitals.oxygenSaturation),
          patient: Number(patient.id),
          user: Number(user.id),
        } : undefined,
        pain_score: newVitals.painScore ? {
          score: Number(newVitals.painScore),
          patient: Number(patient.id),
          user: Number(user.id),
        } : undefined,
      };

      const response = await apiClientV2.studentGroups.observations.createBundle(payload);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/patients", patient.id, "vitals"],
      });

      setFormData({
        systolic: "",
        diastolic: "",
        heartRate: "",
        temperature: "",
        respiratoryRate: "",
        oxygenSaturation: "",
        bloodSugar: "",
        painScore: "",
      });
    },
    onError: (error: Error) => {
      console.error("Failed to record new vitals:", error);
      alert(`Error: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createObservationsMutation.mutate(formData);
  };

  return (
    <div className="space-y-6">
      {/* Latest Observations Display */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Latest Observations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <Label className="text-sm text-gray-600">Blood Pressure</Label>
              <p className="font-medium">
                {latestVitals?.bloodPressure || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <Label className="text-sm text-gray-600">Heart Rate</Label>
              <p className="font-medium">
                {latestVitals?.heartRate || "N/A"} bpm
              </p>
            </div>
            <div className="space-y-1">
              <Label className="text-sm text-gray-600">Temperature</Label>
              <p className="font-medium">
                {latestVitals?.temperature || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <Label className="text-sm text-gray-600">Respiratory Rate</Label>
              <p className="font-medium">
                {latestVitals?.respiratoryRate || "N/A"} /min
              </p>
            </div>
            <div className="space-y-1">
              <Label className="text-sm text-gray-600">O2 Saturation</Label>
              <p className="font-medium">
                {latestVitals?.oxygenSaturation || "N/A"}%
              </p>
            </div>
            <div className="space-y-1">
              <Label className="text-sm text-gray-600">Blood Sugar</Label>
              <p className="font-medium">
                {latestVitals?.bloodSugar || "N/A"} mg/dL
              </p>
            </div>
            <div className="space-y-1">
              <Label className="text-sm text-gray-600">Pain Score</Label>
              <p className="font-medium">
                {latestVitals?.painScore || "N/A"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* New Observations Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Record New Observations</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="systolic">Systolic BP (mmHg)</Label>
                <Input
                  id="systolic"
                  type="number"
                  placeholder="120"
                  value={formData.systolic}
                  onChange={(e) =>
                    setFormData({ ...formData, systolic: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="diastolic">Diastolic BP (mmHg)</Label>
                <Input
                  id="diastolic"
                  type="number"
                  placeholder="80"
                  value={formData.diastolic}
                  onChange={(e) =>
                    setFormData({ ...formData, diastolic: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="heartRate">Heart Rate (bpm)</Label>
                <Input
                  id="heartRate"
                  type="number"
                  placeholder="72"
                  value={formData.heartRate}
                  onChange={(e) =>
                    setFormData({ ...formData, heartRate: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="temperature">Temperature (°C)</Label>
                <Input
                  id="temperature"
                  type="number"
                  step="0.1"
                  placeholder="36.5"
                  value={formData.temperature}
                  onChange={(e) =>
                    setFormData({ ...formData, temperature: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="respiratoryRate">Respiratory Rate (/min)</Label>
                <Input
                  id="respiratoryRate"
                  type="number"
                  placeholder="16"
                  value={formData.respiratoryRate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      respiratoryRate: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="oxygenSaturation">O2 Saturation (%)</Label>
                <Input
                  id="oxygenSaturation"
                  type="number"
                  placeholder="98"
                  value={formData.oxygenSaturation}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      oxygenSaturation: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bloodSugar">Blood Sugar (mg/dL)</Label>
                <Input
                  id="bloodSugar"
                  type="number"
                  step="0.1"
                  placeholder="100"
                  value={formData.bloodSugar}
                  onChange={(e) =>
                    setFormData({ ...formData, bloodSugar: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="painScore">Pain Score (0-10)</Label>
                <Input
                  id="painScore"
                  type="number"
                  min="0"
                  max="10"
                  placeholder="0"
                  value={formData.painScore}
                  onChange={(e) =>
                    setFormData({ ...formData, painScore: e.target.value })
                  }
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={createObservationsMutation.isPending}
            >
              {createObservationsMutation.isPending
                ? "Recording..."
                : "Record Observations"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

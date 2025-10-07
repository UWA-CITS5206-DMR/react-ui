import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiClientV2 } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ObservationCreateBundle, Patient } from "@/lib/api-client-v2";

interface BulkVitalSignsFormProps {
  patient: Patient;
}

interface BulkFormData {
  systolic: string;
  diastolic: string;
  heartRate: string;
  temperature: string;
  respiratoryRate: string;
  oxygenSaturation: string;
  bloodSugar: string;
  painScore: string;
}

const initialFormData: BulkFormData = {
  systolic: "",
  diastolic: "",
  heartRate: "",
  temperature: "",
  respiratoryRate: "",
  oxygenSaturation: "",
  bloodSugar: "",
  painScore: "",
};

/**
 * Bulk vital signs entry form component
 */
export function BulkVitalSignsForm({ patient }: BulkVitalSignsFormProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [formData, setFormData] = useState<BulkFormData>(initialFormData);

  const createBulkObservationsMutation = useMutation({
    mutationFn: async (newVitals: BulkFormData) => {
      if (!user) {
        throw new Error("User not authenticated. Cannot record observations.");
      }

      const payload: ObservationCreateBundle = {
        blood_pressure:
          newVitals.systolic && newVitals.diastolic
            ? {
                systolic: Number(newVitals.systolic),
                diastolic: Number(newVitals.diastolic),
                patient: patient.id,
                user: user.id,
              }
            : undefined,
        heart_rate: newVitals.heartRate
          ? {
              heart_rate: Number(newVitals.heartRate),
              patient: patient.id,
              user: user.id,
            }
          : undefined,
        body_temperature: newVitals.temperature
          ? {
              temperature: newVitals.temperature,
              patient: patient.id,
              user: user.id,
            }
          : undefined,
        respiratory_rate: newVitals.respiratoryRate
          ? {
              respiratory_rate: Number(newVitals.respiratoryRate),
              patient: patient.id,
              user: user.id,
            }
          : undefined,
        blood_sugar: newVitals.bloodSugar
          ? {
              sugar_level: newVitals.bloodSugar,
              patient: patient.id,
              user: user.id,
            }
          : undefined,
        oxygen_saturation: newVitals.oxygenSaturation
          ? {
              saturation_percentage: Number(newVitals.oxygenSaturation),
              patient: patient.id,
              user: user.id,
            }
          : undefined,
        pain_score: newVitals.painScore
          ? {
              score: Number(newVitals.painScore),
              patient: patient.id,
              user: user.id,
            }
          : undefined,
      };

      const response = await apiClientV2.studentGroups.observations.createBundle(payload);
      return response;
    },
    onSuccess: () => {
      // Invalidate both latest and historical observation queries
      queryClient.invalidateQueries({
        queryKey: ["/api/student-groups/observations/latest", patient.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["/api/student-groups/observations/history", patient.id],
      });
      setFormData(initialFormData);
      toast({
        title: "Success",
        description: "Bulk vital signs submitted successfully!",
      });
    },
    onError: (error: Error) => {
      console.error("Failed to record new vitals:", error);
      toast({
        title: "Error",
        description: `Failed to record new vitals: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createBulkObservationsMutation.mutate(formData);
  };

  const updateFormData = (field: keyof BulkFormData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Record All Observations</CardTitle>
        <p className="text-sm text-gray-600">Enter multiple observations at once</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Systolic BP */}
            <div className="space-y-2">
              <Label htmlFor="bulk-systolic">Systolic BP (mmHg)</Label>
              <Input
                id="bulk-systolic"
                type="number"
                placeholder="120"
                value={formData.systolic}
                onChange={(e) => updateFormData("systolic", e.target.value)}
              />
            </div>

            {/* Diastolic BP */}
            <div className="space-y-2">
              <Label htmlFor="bulk-diastolic">Diastolic BP (mmHg)</Label>
              <Input
                id="bulk-diastolic"
                type="number"
                placeholder="80"
                value={formData.diastolic}
                onChange={(e) => updateFormData("diastolic", e.target.value)}
              />
            </div>

            {/* Heart Rate */}
            <div className="space-y-2">
              <Label htmlFor="bulk-heartRate">Heart Rate (bpm)</Label>
              <Input
                id="bulk-heartRate"
                type="number"
                placeholder="72"
                value={formData.heartRate}
                onChange={(e) => updateFormData("heartRate", e.target.value)}
              />
            </div>

            {/* Temperature */}
            <div className="space-y-2">
              <Label htmlFor="bulk-temperature">Temperature (°C)</Label>
              <Input
                id="bulk-temperature"
                type="number"
                step="0.1"
                placeholder="36.5"
                value={formData.temperature}
                onChange={(e) => updateFormData("temperature", e.target.value)}
              />
            </div>

            {/* Respiratory Rate */}
            <div className="space-y-2">
              <Label htmlFor="bulk-respiratoryRate">Respiratory Rate (/min)</Label>
              <Input
                id="bulk-respiratoryRate"
                type="number"
                placeholder="16"
                value={formData.respiratoryRate}
                onChange={(e) => updateFormData("respiratoryRate", e.target.value)}
              />
            </div>

            {/* Oxygen Saturation */}
            <div className="space-y-2">
              <Label htmlFor="bulk-oxygenSaturation">O2 Saturation (%)</Label>
              <Input
                id="bulk-oxygenSaturation"
                type="number"
                placeholder="98"
                value={formData.oxygenSaturation}
                onChange={(e) => updateFormData("oxygenSaturation", e.target.value)}
              />
            </div>

            {/* Blood Sugar */}
            <div className="space-y-2">
              <Label htmlFor="bulk-bloodSugar">Blood Sugar (mmol/L)</Label>
              <Input
                id="bulk-bloodSugar"
                type="number"
                step="0.1"
                placeholder="5.5"
                value={formData.bloodSugar}
                onChange={(e) => updateFormData("bloodSugar", e.target.value)}
              />
            </div>

            {/* Pain Score */}
            <div className="space-y-2">
              <Label htmlFor="bulk-painScore">Pain Score (0-10)</Label>
              <Input
                id="bulk-painScore"
                type="number"
                min="0"
                max="10"
                placeholder="0"
                value={formData.painScore}
                onChange={(e) => updateFormData("painScore", e.target.value)}
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={createBulkObservationsMutation.isPending}
            className="w-full"
          >
            {createBulkObservationsMutation.isPending
              ? "Recording..."
              : "Record All Observations"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import type { Patient } from "@/lib/api-client-v2";

interface DischargeSummaryProps {
  patient: Patient;
}

export default function DischargeSummary({ patient }: DischargeSummaryProps) {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    diagnosis: "",
    freeText: "",
    plan: "",
    name:
      user?.first_name && user?.last_name
        ? `${user.first_name} ${user.last_name}`
        : "",
    role: user?.role || "student",
  });

  // Mock mutation for form submission
  const createDischargeSummaryMutation = useMutation({
    mutationFn: async (data: any) => {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Discharge Summary data:", data);
      return { success: true };
    },
    onSuccess: () => {
      // Reset form
      setFormData({
        diagnosis: "",
        freeText: "",
        plan: "",
        name:
          user?.first_name && user?.last_name
            ? `${user.first_name} ${user.last_name}`
            : "",
        role: user?.role || "student",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createDischargeSummaryMutation.mutate({
      ...formData,
      patientId: patient.id,
      createdAt: new Date().toISOString(),
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Discharge Summary</CardTitle>
          <p className="text-sm text-gray-600">
            Complete the discharge summary for {patient.first_name}{" "}
            {patient.last_name}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Diagnosis */}
            <div className="space-y-2">
              <Label htmlFor="diagnosis">Diagnosis *</Label>
              <Input
                id="diagnosis"
                placeholder="Primary and secondary diagnoses"
                value={formData.diagnosis}
                onChange={(e) =>
                  setFormData({ ...formData, diagnosis: e.target.value })
                }
                required
              />
            </div>

            {/* Free Text */}
            <div className="space-y-2">
              <Label htmlFor="freeText">Clinical Summary *</Label>
              <Textarea
                id="freeText"
                placeholder="Detailed clinical summary of patient's stay, treatment provided, and response to treatment..."
                rows={6}
                value={formData.freeText}
                onChange={(e) =>
                  setFormData({ ...formData, freeText: e.target.value })
                }
                required
              />
            </div>

            {/* Plan */}
            <div className="space-y-2">
              <Label htmlFor="plan">Discharge Plan *</Label>
              <Textarea
                id="plan"
                placeholder="Follow-up appointments, medications, instructions for patient care, lifestyle modifications..."
                rows={4}
                value={formData.plan}
                onChange={(e) =>
                  setFormData({ ...formData, plan: e.target.value })
                }
                required
              />
            </div>

            {/* Sign-off Section */}
            <div className="border-t pt-6">
              <h3 className="text-md font-semibold text-gray-900 mb-4">
                Sign-off
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    placeholder="Full name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role *</Label>
                  <Input
                    id="role"
                    placeholder="e.g., Medical Student, Resident, Attending"
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-between pt-4">
              <p className="text-sm text-gray-500">* Required fields</p>
              <Button
                type="submit"
                disabled={createDischargeSummaryMutation.isPending}
              >
                {createDischargeSummaryMutation.isPending
                  ? "Saving..."
                  : "Save Discharge Summary"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Success Message */}
      {createDischargeSummaryMutation.isSuccess && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-green-800">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium">
                Discharge summary saved successfully
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

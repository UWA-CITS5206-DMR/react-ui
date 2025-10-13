import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SignOffSection } from "@/components/ui/sign-off-section";
import { useAuth } from "@/hooks/use-auth";
import { apiClientV2 } from "@/lib/queryClient";
import type { Patient } from "@/lib/api-client-v2";

interface DischargeSummaryProps {
  patient: Patient;
}

export default function DischargeSummary({ patient }: DischargeSummaryProps) {
  const { user } = useAuth();

  // Note: name and role are intentionally left empty
  // In shared group account mode, the actual student operating the system
  // should manually enter their own name and role
  const [formData, setFormData] = useState({
    diagnosis: "",
    freeText: "",
    plan: "",
    name: "",
    role: "",
  });

  // Real mutation for form submission
  const createDischargeSummaryMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (!user) {
        throw new Error("User not authenticated");
      }

      return apiClientV2.studentGroups.dischargeSummaries.create({
        diagnosis: data.diagnosis,
        plan: data.plan,
        free_text: data.freeText,
        name: data.name,
        role: data.role,
        patient: patient.id,
      });
    },
    onSuccess: () => {
      // Reset form - leave name and role empty for next entry
      setFormData({
        diagnosis: "",
        freeText: "",
        plan: "",
        name: "",
        role: "",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createDischargeSummaryMutation.mutate(formData);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Discharge Summary</CardTitle>
          <p className="text-sm text-gray-600">
            Complete the discharge summary for {patient.first_name} {patient.last_name}
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
                onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
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
                onChange={(e) => setFormData({ ...formData, freeText: e.target.value })}
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
                onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                required
              />
            </div>

            {/* Sign-off Section */}
            <div className="border-t pt-6">
              <SignOffSection
                name={formData.name}
                role={formData.role}
                onNameChange={(name) => setFormData({ ...formData, name })}
                onRoleChange={(role) => setFormData({ ...formData, role })}
                idPrefix="discharge-signoff"
              />
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-between pt-4">
              <p className="text-sm text-gray-500">* Required fields</p>
              <Button type="submit" disabled={createDischargeSummaryMutation.isPending}>
                {createDischargeSummaryMutation.isPending ? "Saving..." : "Save Discharge Summary"}
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
              <span className="text-sm font-medium">Discharge summary saved successfully</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

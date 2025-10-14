import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SignOffSection } from "@/components/ui/sign-off-section";
import { useAuth } from "@/hooks/use-auth";
import { apiClientV2 } from "@/lib/queryClient";
import { formatDate } from "@/lib/utils";
import type { Patient } from "@/lib/api-client-v2";

interface DischargeSummaryProps {
  patient: Patient;
}

export default function DischargeSummary({ patient }: DischargeSummaryProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  // Query existing discharge summary for this patient
  const { data: existingSummary } = useQuery({
    queryKey: ["student-groups", "discharge-summaries", patient.id],
    queryFn: () =>
      apiClientV2.studentGroups.dischargeSummaries.list({
        patient: patient.id,
      }),
    select: (response) => response.results?.[0], // Get the first (most recent) summary
  });

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

  // Initialize form data when existing summary is loaded
  useEffect(() => {
    if (existingSummary && !isEditing) {
      setFormData({
        diagnosis: existingSummary.diagnosis,
        freeText: existingSummary.free_text || "",
        plan: existingSummary.plan,
        name: existingSummary.name,
        role: existingSummary.role,
      });
    }
  }, [existingSummary, isEditing]);

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
      setIsEditing(false);
      // Invalidate and refetch the query
      queryClient.invalidateQueries({
        queryKey: ["student-groups", "discharge-summaries", patient.id],
      });
    },
  });

  const updateDischargeSummaryMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (!user || !existingSummary) {
        throw new Error("User not authenticated or no existing summary");
      }

      return apiClientV2.studentGroups.dischargeSummaries.update(existingSummary.id, {
        diagnosis: data.diagnosis,
        plan: data.plan,
        free_text: data.freeText,
        name: data.name,
        role: data.role,
        patient: patient.id,
      });
    },
    onSuccess: () => {
      setIsEditing(false);
      // Invalidate and refetch the query
      queryClient.invalidateQueries({
        queryKey: ["student-groups", "discharge-summaries", patient.id],
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && existingSummary) {
      updateDischargeSummaryMutation.mutate(formData);
    } else {
      createDischargeSummaryMutation.mutate(formData);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (existingSummary) {
      // Reset to original values
      setFormData({
        diagnosis: existingSummary.diagnosis,
        freeText: existingSummary.free_text || "",
        plan: existingSummary.plan,
        name: existingSummary.name,
        role: existingSummary.role,
      });
    }
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Discharge Summary</CardTitle>
              <p className="text-sm text-gray-600">
                {existingSummary && !isEditing
                  ? `Completed discharge summary for ${patient.first_name} ${patient.last_name}`
                  : `Complete the discharge summary for ${patient.first_name} ${patient.last_name}`}
              </p>
              {existingSummary && (
                <p className="text-xs text-gray-500 mt-1">
                  Submitted on {formatDate(existingSummary.created_at)}
                </p>
              )}
            </div>
            {existingSummary && !isEditing && (
              <Button onClick={handleEdit} variant="outline" size="sm">
                Edit
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {existingSummary && !isEditing ? (
            // Display mode - show submitted content
            <div className="space-y-6">
              {/* Diagnosis */}
              <div className="space-y-2">
                <Label>Diagnosis</Label>
                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="text-sm">{existingSummary.diagnosis}</p>
                </div>
              </div>

              {/* Clinical Summary */}
              <div className="space-y-2">
                <Label>Clinical Summary</Label>
                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="text-sm whitespace-pre-wrap">
                    {existingSummary.free_text || "No clinical summary provided"}
                  </p>
                </div>
              </div>

              {/* Discharge Plan */}
              <div className="space-y-2">
                <Label>Discharge Plan</Label>
                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="text-sm whitespace-pre-wrap">{existingSummary.plan}</p>
                </div>
              </div>

              {/* Sign-off */}
              <div className="border-t pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Signed by:</p>
                    <p className="text-sm text-gray-600">{existingSummary.name}</p>
                    <p className="text-xs text-gray-500">{existingSummary.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Edit mode - show form
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
                  disabled={!isEditing && !!existingSummary}
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
                  disabled={!isEditing && !!existingSummary}
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
                  disabled={!isEditing && !!existingSummary}
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

              {/* Submit/Cancel Buttons */}
              <div className="flex items-center justify-between pt-4">
                <p className="text-sm text-gray-500">* Required fields</p>
                <div className="flex gap-2">
                  {isEditing && existingSummary && (
                    <Button type="button" variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                  )}
                  <Button
                    type="submit"
                    disabled={
                      createDischargeSummaryMutation.isPending ||
                      updateDischargeSummaryMutation.isPending
                    }
                  >
                    {createDischargeSummaryMutation.isPending ||
                    updateDischargeSummaryMutation.isPending
                      ? "Saving..."
                      : existingSummary && isEditing
                      ? "Update Discharge Summary"
                      : "Save Discharge Summary"}
                  </Button>
                </div>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Success Message */}
      {(createDischargeSummaryMutation.isSuccess || updateDischargeSummaryMutation.isSuccess) && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-green-800">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium">
                Discharge summary {existingSummary && isEditing ? "updated" : "saved"} successfully
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

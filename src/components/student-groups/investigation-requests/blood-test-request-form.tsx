import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { apiClientV2 } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/lib/error-utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { DialogFooter } from "@/components/ui/dialog";
import { Send } from "lucide-react";
import { SignOffSection } from "@/components/ui/sign-off-section";
import type { BloodTestType } from "@/lib/api-client-v2";
import { BLOOD_TEST_OPTIONS, getBloodTestLabel } from "@/lib/constants";

interface BloodTestRequestFormProps {
  patientId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

/**
 * Blood test request form component with multi-select support
 */
export function BloodTestRequestForm({
  patientId,
  onSuccess,
  onCancel,
}: BloodTestRequestFormProps) {
  const [testTypes, setTestTypes] = useState<BloodTestType[]>([]);
  const [details, setDetails] = useState("");
  const [signOffName, setSignOffName] = useState("");
  const [signOffRole, setSignOffRole] = useState("");

  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Note: signOffName and signOffRole are intentionally left empty
  // In shared group account mode, the actual student operating the system
  // should manually enter their own name and role, not use the group account info

  const createBloodTestMutation = useMutation({
    mutationFn: async () => {
      if (!user) {
        throw new Error("User not authenticated");
      }

      return apiClientV2.studentGroups.bloodTestRequests.create({
        patient: parseInt(patientId),
        user: user.id,
        test_types: testTypes,
        details: details,
        status: "pending",
        name: signOffName,
        role: signOffRole,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blood-test-requests", patientId] });
      toast({
        title: "Success",
        description: "Blood test request submitted successfully!",
      });
      // Reset form
      setTestTypes([]);
      setDetails("");
      setSignOffName("");
      setSignOffRole("");
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Failed to submit blood test request. ${getErrorMessage(error)}`,
        variant: "destructive",
      });
    },
  });

  const handleTestTypeToggle = (testType: BloodTestType) => {
    setTestTypes((prev) =>
      prev.includes(testType) ? prev.filter((t) => t !== testType) : [...prev, testType]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (testTypes.length === 0 || !details || !signOffName || !signOffRole) {
      toast({
        title: "Validation Error",
        description:
          "Please select at least one test type and fill in all required fields including your name and role.",
        variant: "destructive",
      });
      return;
    }

    createBloodTestMutation.mutate();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4 py-4">
        {/* Test Type Selection */}
        <div className="space-y-2">
          <Label>Test Types * (Select one or more)</Label>
          <div className="grid grid-cols-1 gap-3 max-h-80 overflow-y-auto border rounded-md p-4">
            {BLOOD_TEST_OPTIONS.map((test) => (
              <div key={test} className="flex items-center space-x-2">
                <Checkbox
                  id={`test-${test}`}
                  checked={testTypes.includes(test)}
                  onCheckedChange={() => handleTestTypeToggle(test)}
                />
                <label
                  htmlFor={`test-${test}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {getBloodTestLabel(test)}
                </label>
              </div>
            ))}
          </div>
          {testTypes.length > 0 && (
            <p className="text-sm text-muted-foreground">
              Selected: {testTypes.map((t) => getBloodTestLabel(t)).join(", ")}
            </p>
          )}
        </div>

        {/* Clinical Details */}
        <div className="space-y-2">
          <Label htmlFor="blood-test-details">Clinical Details *</Label>
          <Textarea
            id="blood-test-details"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Provide clinical details for this blood test request..."
            rows={4}
          />
        </div>

        {/* Sign-off Section */}
        <SignOffSection
          name={signOffName}
          role={signOffRole}
          onNameChange={setSignOffName}
          onRoleChange={setSignOffRole}
          idPrefix="blood-test"
        />
      </div>
      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={createBloodTestMutation.isPending}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={createBloodTestMutation.isPending}
          className="bg-hospital-blue hover:bg-hospital-blue/90"
        >
          <Send className="h-4 w-4" />
          {createBloodTestMutation.isPending ? "Submitting..." : "Submit Blood Test Request"}
        </Button>
      </DialogFooter>
    </form>
  );
}

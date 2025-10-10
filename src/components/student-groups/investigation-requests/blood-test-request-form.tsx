import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { apiClientV2 } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/lib/error-utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Send } from "lucide-react";
import { SignOffSection } from "@/components/ui/sign-off-section";
import type { BloodTestType } from "@/lib/api-client-v2";

interface BloodTestRequestFormProps {
  patientId: string;
}

const BLOOD_TEST_OPTIONS: BloodTestType[] = [
  "FBC",
  "EUC",
  "LFTs",
  "Coags",
  "CRP",
  "TFT",
  "Group and Hold",
];

/**
 * Blood test request form component
 */
export function BloodTestRequestForm({ patientId }: BloodTestRequestFormProps) {
  const [testType, setTestType] = useState<BloodTestType | "">("");
  const [reason, setReason] = useState("");
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
        test_type: testType as BloodTestType,
        reason: reason,
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
      setTestType("");
      setReason("");
      setSignOffName("");
      setSignOffRole("");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Failed to submit blood test request. ${getErrorMessage(error)}`,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!testType || !reason || !signOffName || !signOffRole) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields including your name and role.",
        variant: "destructive",
      });
      return;
    }

    createBloodTestMutation.mutate();
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Blood Test Request</CardTitle>
          <CardDescription>Submit a new blood test request for this patient</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Test Type Selection */}
          <div className="space-y-2">
            <Label htmlFor="blood-test-type">Test Type *</Label>
            <Select value={testType} onValueChange={(value) => setTestType(value as BloodTestType)}>
              <SelectTrigger id="blood-test-type">
                <SelectValue placeholder="Select blood test type" />
              </SelectTrigger>
              <SelectContent>
                {BLOOD_TEST_OPTIONS.map((test) => (
                  <SelectItem key={test} value={test}>
                    {test}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Clinical Reason */}
          <div className="space-y-2">
            <Label htmlFor="blood-test-reason">Clinical Reasoning *</Label>
            <Textarea
              id="blood-test-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain your reasoning for this blood test request..."
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

          <Button
            type="submit"
            className="w-full bg-hospital-blue hover:bg-hospital-blue/90"
            disabled={createBloodTestMutation.isPending}
          >
            <Send className="h-4 w-4 mr-2" />
            {createBloodTestMutation.isPending ? "Submitting..." : "Submit Blood Test Request"}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}

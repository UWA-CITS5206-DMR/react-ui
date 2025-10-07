import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { apiClientV2 } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Send } from "lucide-react";
import { SignOffSection } from "@/components/ui/sign-off-section";
import type { ImagingTestType } from "@/lib/api-client-v2";

interface ImagingRequestFormProps {
  patientId: string;
}

const IMAGING_TEST_OPTIONS: ImagingTestType[] = [
  "X-ray",
  "CT scan",
  "MRI scan",
  "Ultrasound scan",
  "Echocardiogram",
];

/**
 * Imaging request form component
 */
export function ImagingRequestForm({ patientId }: ImagingRequestFormProps) {
  const [testType, setTestType] = useState<ImagingTestType | "">("");
  const [reason, setReason] = useState("");
  const [signOffName, setSignOffName] = useState("");
  const [signOffRole, setSignOffRole] = useState("");

  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Note: signOffName and signOffRole are intentionally left empty
  // In shared group account mode, the actual student operating the system
  // should manually enter their own name and role, not use the group account info

  const createImagingMutation = useMutation({
    mutationFn: async () => {
      if (!user) {
        throw new Error("User not authenticated");
      }

      return apiClientV2.studentGroups.imagingRequests.create({
        patient: parseInt(patientId),
        user: user.id,
        test_type: testType as ImagingTestType,
        reason: reason,
        status: "pending",
        name: signOffName,
        role: signOffRole,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["imaging-requests", patientId] });
      toast({
        title: "Success",
        description: "Imaging request submitted successfully!",
      });
      // Reset form
      setTestType("");
      setReason("");
      setSignOffName("");
      setSignOffRole("");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to submit imaging request. ${error.message}`,
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

    createImagingMutation.mutate();
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Imaging Request</CardTitle>
          <CardDescription>Submit a new imaging request for this patient</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Test Type Selection */}
          <div className="space-y-2">
            <Label htmlFor="imaging-test-type">Imaging Type *</Label>
            <Select value={testType} onValueChange={(value) => setTestType(value as ImagingTestType)}>
              <SelectTrigger id="imaging-test-type">
                <SelectValue placeholder="Select imaging type" />
              </SelectTrigger>
              <SelectContent>
                {IMAGING_TEST_OPTIONS.map((imaging) => (
                  <SelectItem key={imaging} value={imaging}>
                    {imaging}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Clinical Reason */}
          <div className="space-y-2">
            <Label htmlFor="imaging-reason">Clinical Reasoning *</Label>
            <Textarea
              id="imaging-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain your reasoning for this imaging request..."
              rows={4}
            />
          </div>

          {/* Sign-off Section */}
          <SignOffSection
            name={signOffName}
            role={signOffRole}
            onNameChange={setSignOffName}
            onRoleChange={setSignOffRole}
            idPrefix="imaging"
          />

          <Button
            type="submit"
            className="w-full bg-hospital-blue hover:bg-hospital-blue/90"
            disabled={createImagingMutation.isPending}
          >
            <Send className="h-4 w-4 mr-2" />
            {createImagingMutation.isPending ? "Submitting..." : "Submit Imaging Request"}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}

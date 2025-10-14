import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { apiClientV2 } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/lib/error-utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";
import { Send } from "lucide-react";
import { SignOffSection } from "@/components/ui/sign-off-section";
import type { ImagingTestType, InfectionControlPrecaution } from "@/lib/api-client-v2";
import { IMAGING_TEST_OPTIONS, INFECTION_CONTROL_OPTIONS } from "@/lib/constants";

interface ImagingRequestFormProps {
  patientId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

/**
 * Imaging request form component
 */
export function ImagingRequestForm({ patientId, onSuccess, onCancel }: ImagingRequestFormProps) {
  const [testType, setTestType] = useState<ImagingTestType | "">("");
  const [details, setDetails] = useState("");
  const [infectionControlPrecautions, setInfectionControlPrecautions] =
    useState<InfectionControlPrecaution>("None");
  const [imagingFocus, setImagingFocus] = useState("");
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
        details: details,
        infection_control_precautions: infectionControlPrecautions,
        imaging_focus: imagingFocus,
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
      setDetails("");
      setInfectionControlPrecautions("None");
      setImagingFocus("");
      setSignOffName("");
      setSignOffRole("");
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Failed to submit imaging request. ${getErrorMessage(error)}`,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!testType || !details || !signOffName || !signOffRole) {
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
      <div className="space-y-4 py-4">
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

        {/* Clinical Details */}
        <div className="space-y-2">
          <Label htmlFor="imaging-details">Clinical Details *</Label>
          <Textarea
            id="imaging-details"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Provide clinical details for this imaging request..."
            rows={4}
          />
        </div>

        {/* Infection Control Precautions */}
        <div className="space-y-2">
          <Label htmlFor="infection-control">Infection Control Precautions *</Label>
          <Select
            value={infectionControlPrecautions}
            onValueChange={(value) =>
              setInfectionControlPrecautions(value as InfectionControlPrecaution)
            }
          >
            <SelectTrigger id="infection-control">
              <SelectValue placeholder="Select precautions" />
            </SelectTrigger>
            <SelectContent>
              {INFECTION_CONTROL_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Imaging Focus */}
        <div className="space-y-2">
          <Label htmlFor="imaging-focus">Imaging Focus</Label>
          <Textarea
            id="imaging-focus"
            value={imagingFocus}
            onChange={(e) => setImagingFocus(e.target.value)}
            placeholder="Specify the area or focus of the imaging request (optional)..."
            rows={2}
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
      </div>
      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={createImagingMutation.isPending}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={createImagingMutation.isPending}
          className="bg-hospital-blue hover:bg-hospital-blue/90"
        >
          <Send className="h-4 w-4 mr-2" />
          {createImagingMutation.isPending ? "Submitting..." : "Submit Imaging Request"}
        </Button>
      </DialogFooter>
    </form>
  );
}

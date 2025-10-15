import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { apiClientV2 } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/lib/error-utils";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { MedicationOrderCard, type MedicationFormData } from "./medication-order-card";
import { SignOffSection } from "@/components/ui/sign-off-section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MedicationOrderFormProps {
  patientId: string;
  onSuccess?: () => void;
}

/**
 * Medication order creation form component
 */
export function MedicationOrderForm({ patientId, onSuccess }: MedicationOrderFormProps) {
  const [medications, setMedications] = useState<MedicationFormData[]>([
    {
      medication: "",
      dosage: "",
      instructions: "",
    },
  ]);

  const [signOffName, setSignOffName] = useState("");
  const [signOffRole, setSignOffRole] = useState("");

  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Note: signOffName and signOffRole are intentionally left empty
  // In shared group account mode, the actual student operating the system
  // should manually enter their own name and role, not use the group account info

  const createMedicationOrdersMutation = useMutation({
    mutationFn: async () => {
      const orders = medications.filter(
        (med) =>
          med.medication.trim() !== "" && med.dosage.trim() !== "" && med.instructions.trim() !== ""
      );

      if (!user) {
        throw new Error("User not authenticated");
      }

      const requests = orders.map((medication) =>
        apiClientV2.studentGroups.medicationOrders.create({
          patient: parseInt(patientId),
          medication_name: medication.medication,
          dosage: medication.dosage,
          instructions: medication.instructions,
          name: signOffName,
          role: signOffRole,
        })
      );

      return Promise.all(requests);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medication-orders", patientId] });
      toast({
        title: "Success",
        description: "Medication orders submitted successfully!",
      });
      // Reset medications list
      setMedications([
        {
          medication: "",
          dosage: "",
          instructions: "",
        },
      ]);
      setSignOffName("");
      setSignOffRole("");
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Failed to submit medication orders. ${getErrorMessage(error)}`,
        variant: "destructive",
      });
    },
  });

  const updateMedication = (index: number, field: keyof MedicationFormData, value: string) => {
    const updated = [...medications];
    updated[index] = { ...updated[index], [field]: value };
    setMedications(updated);
  };

  const addMedication = () => {
    setMedications([
      ...medications,
      {
        medication: "",
        dosage: "",
        instructions: "",
      },
    ]);
  };

  const removeMedication = (index: number) => {
    if (medications.length > 1) {
      setMedications(medications.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validMedications = medications.filter(
      (med) =>
        med.medication.trim() !== "" && med.dosage.trim() !== "" && med.instructions.trim() !== ""
    );

    if (validMedications.length === 0) {
      toast({
        title: "Validation Error",
        description:
          "Please add at least one complete medication order (medication name, dosage, and instructions required).",
        variant: "destructive",
      });
      return;
    }

    if (!signOffName.trim() || !signOffRole.trim()) {
      toast({
        title: "Validation Error",
        description: "Please provide your name and role for sign-off.",
        variant: "destructive",
      });
      return;
    }

    createMedicationOrdersMutation.mutate();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-sm">Medication Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {medications.map((medication, index) => (
              <MedicationOrderCard
                key={index}
                index={index}
                medication={medication}
                canRemove={medications.length > 1}
                onUpdate={(field, value) => updateMedication(index, field, value)}
                onRemove={() => removeMedication(index)}
              />
            ))}
            <div className="flex gap-2 mt-4">
              <Button type="button" variant="outline" onClick={addMedication} className="flex-1">
                <Plus className="h-4 w-4" />
                Add Another Medication
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Sign-off Section */}
        <SignOffSection
          name={signOffName}
          role={signOffRole}
          onNameChange={setSignOffName}
          onRoleChange={setSignOffRole}
          idPrefix="medication"
        />
      </div>
    </form>
  );
}

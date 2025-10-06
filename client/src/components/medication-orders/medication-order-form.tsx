import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { apiClientV2 } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Plus, Pill } from "lucide-react";
import { MedicationOrderCard, type MedicationFormData } from "./medication-order-card";
import { SignOffSection } from "../investigation-requests/sign-off-section";

interface MedicationOrderFormProps {
  patientId: string;
}

/**
 * Medication order creation form component
 */
export function MedicationOrderForm({ patientId }: MedicationOrderFormProps) {
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

  // Initialize sign-off fields from user
  useEffect(() => {
    if (user) {
      const userName =
        user.first_name && user.last_name
          ? `${user.first_name} ${user.last_name}`
          : user.username;
      const userRole = user.role || "student";
      setSignOffName(userName);
      setSignOffRole(userRole);
    }
  }, [user]);

  const createMedicationOrdersMutation = useMutation({
    mutationFn: async () => {
      const orders = medications.filter(
        (med) =>
          med.medication.trim() !== "" &&
          med.dosage.trim() !== "" &&
          med.instructions.trim() !== ""
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
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit medication orders. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateMedication = (
    index: number,
    field: keyof MedicationFormData,
    value: string
  ) => {
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
        med.medication.trim() !== "" &&
        med.dosage.trim() !== "" &&
        med.instructions.trim() !== ""
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

      {/* Sign-off Section */}
      <SignOffSection
        name={signOffName}
        role={signOffRole}
        onNameChange={setSignOffName}
        onRoleChange={setSignOffRole}
        idPrefix="medication"
      />

      <div className="flex gap-2 mt-4">
        <Button
          type="button"
          variant="outline"
          onClick={addMedication}
          className="flex-1"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Another Medication
        </Button>

        <Button
          type="submit"
          className="flex-1 bg-hospital-blue hover:bg-hospital-blue/90"
          disabled={createMedicationOrdersMutation.isPending}
        >
          <Pill className="h-4 w-4 mr-2" />
          {createMedicationOrdersMutation.isPending
            ? "Submitting..."
            : "Submit Medication Orders"}
        </Button>
      </div>
    </form>
  );
}

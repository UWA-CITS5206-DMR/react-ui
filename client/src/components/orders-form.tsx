import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiClientV2 } from "@/lib/queryClient";
import type { MedicationOrderCreate } from "@/lib/api-client-v2";
import { Send } from "lucide-react";

interface OrdersFormProps {
  patientId: string;
}

export default function OrdersForm({ patientId }: OrdersFormProps) {
  const [selectedMedication, setSelectedMedication] = useState("");
  const [dosage, setDosage] = useState("");
  const [instructions, setInstructions] = useState("");
  
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const medicationOptions = [
    "Nitroglycerin",
    "Aspirin",
    "Metoprolol",
    "Furosemide",
    "Morphine",
    "Lisinopril",
    "Amlodipine",
    "Metformin"
  ];

  const createOrderMutation = useMutation({
    mutationFn: async (data: MedicationOrderCreate) => {
      return apiClientV2.studentGroups.medicationOrders.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student-groups-medication-orders"] });
      toast({
        title: "Success",
        description: "Medication order submitted successfully!",
        variant: "default",
      });
      // Clear form
      setSelectedMedication("");
      setDosage("");
      setInstructions("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit medication order. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    if (!selectedMedication || !dosage) {
      toast({
        title: "Missing Information",
        description: "Please select a medication and specify dosage.",
        variant: "destructive",
      });
      return;
    }

    const medicationOrder: MedicationOrderCreate = {
      medication_name: selectedMedication,
      dosage: dosage,
      instructions: instructions,
      name: user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : user.username || 'Unknown',
      role: user.role || 'Student',
      patient: Number(patientId),
    };

    createOrderMutation.mutate(medicationOrder);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-md font-medium text-gray-800 mb-4">Place Medication Orders</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Medication Selection */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-1 block">
            Medication *
          </Label>
          <Select value={selectedMedication} onValueChange={setSelectedMedication}>
            <SelectTrigger className="w-full mb-2">
              <SelectValue placeholder="Select medication..." />
            </SelectTrigger>
            <SelectContent>
              {medicationOptions.map(option => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Dosage */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-1 block">
            Dosage *
          </Label>
          <Input
            value={dosage}
            onChange={(e) => setDosage(e.target.value)}
            placeholder="e.g., 25mg, 0.4mg SL, 40mg IV"
            className="w-full"
            required
          />
        </div>

        {/* Instructions */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-1 block">
            Special Instructions
          </Label>
          <Input
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="e.g., PRN, BID, with meals, before bedtime"
            className="w-full"
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-success-green hover:bg-success-green/90"
          disabled={createOrderMutation.isPending}
        >
          <Send className="h-4 w-4 mr-2" />
          {createOrderMutation.isPending ? "Submitting..." : "Submit Medication Order"}
        </Button>
      </form>
    </div>
  );
}

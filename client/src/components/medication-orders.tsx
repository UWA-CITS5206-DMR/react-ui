import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Send } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface MedicationOrdersProps {
  patientId: string;
}

export default function MedicationOrders({ patientId }: MedicationOrdersProps) {
  const [selectedMedication, setSelectedMedication] = useState("");
  const [medicationInstructions, setMedicationInstructions] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");

  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const medicationOptions = [
    "Nitroglycerin 0.4mg SL PRN chest pain",
    "Aspirin 325mg PO once daily",
    "Metoprolol 25mg PO BID",
    "Furosemide 40mg IV once daily",
    "Morphine 2mg IV PRN severe pain",
    "Paracetamol 1g PO QID PRN pain/fever",
    "Omeprazole 40mg PO once daily",
    "Heparin 5000 units SC BID",
  ];

  const createMedicationOrderMutation = useMutation({
    mutationFn: async (data: {
      type: string;
      medication: string;
      instructions: string;
      orderedBy: string;
      name: string;
      role: string;
    }) => {
      // Mock API call - log to console
      console.log("Medication Order:", data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { success: true };
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Medication order submitted successfully!",
        variant: "default",
      });
      // Clear form
      setSelectedMedication("");
      setMedicationInstructions("");
      setName("");
      setRole("");
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

    if (!selectedMedication) {
      toast({
        title: "No Medication Selected",
        description: "Please select a medication to order.",
        variant: "destructive",
      });
      return;
    }

    if (!name || !role) {
      toast({
        title: "Missing Sign-off",
        description: "Please provide your name and role before submitting.",
        variant: "destructive",
      });
      return;
    }

    const orderData = {
      type: "medication",
      medication: selectedMedication,
      instructions: medicationInstructions,
      orderedBy: user.id,
      name,
      role,
    };

    try {
      await createMedicationOrderMutation.mutateAsync(orderData);
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Medication Orders</CardTitle>
        <p className="text-sm text-gray-600">
          Order medications with specific instructions and sign-off
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Medication Selection */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Select Medication *
            </Label>
            <Select
              value={selectedMedication}
              onValueChange={setSelectedMedication}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a medication..." />
              </SelectTrigger>
              <SelectContent>
                {medicationOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Special Instructions */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-1 block">
              Special Instructions
            </Label>
            <Textarea
              value={medicationInstructions}
              onChange={(e) => setMedicationInstructions(e.target.value)}
              placeholder="Additional instructions, precautions, monitoring requirements..."
              rows={4}
            />
          </div>

          {/* Sign-off Section */}
          <div className="border-t pt-6">
            <h3 className="text-md font-semibold text-gray-900 mb-4">
              Sign-off
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="med-name">Name *</Label>
                <Input
                  id="med-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="med-role">Role *</Label>
                <Input
                  id="med-role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g., Medical Student, Resident"
                  required
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700"
            disabled={createMedicationOrderMutation.isPending}
          >
            <Send className="h-4 w-4 mr-2" />
            {createMedicationOrderMutation.isPending
              ? "Submitting..."
              : "Submit Medication Order"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

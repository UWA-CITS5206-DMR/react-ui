import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { apiClientV2 } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Pill } from "lucide-react";

interface MedicationOrder {
  medication: string;
  dosage: string;
  frequency: string;
  route: string;
  duration: string;
  indication: string;
}

interface MedicationOrdersProps {
  patientId: string;
}

export default function MedicationOrders({ patientId }: MedicationOrdersProps) {
  const [medications, setMedications] = useState<MedicationOrder[]>([
    {
      medication: "",
      dosage: "",
      frequency: "",
      route: "",
      duration: "",
      indication: ""
    }
  ]);
  
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const frequencyOptions = [
    "Once daily (OD)",
    "Twice daily (BD)",
    "Three times daily (TDS)",
    "Four times daily (QDS)",
    "Every 4 hours",
    "Every 6 hours",
    "Every 8 hours",
    "Every 12 hours",
    "As needed (PRN)",
    "At bedtime (ON)",
    "Before meals (AC)",
    "After meals (PC)"
  ];

  const routeOptions = [
    "Oral (PO)",
    "Intravenous (IV)",
    "Intramuscular (IM)",
    "Subcutaneous (SC)",
    "Topical",
    "Inhaled",
    "Sublingual (SL)",
    "Rectal (PR)",
    "Ophthalmic",
    "Otic"
  ];

  const createMedicationOrdersMutation = useMutation({
    mutationFn: async () => {
      const orders = medications.filter(med => med.medication.trim() !== "");
      const requests = orders.map(medication => 
        apiClientV2.instructors.medicationOrders.create({
          patient: parseInt(patientId),
          medication_name: medication.medication,
          dosage: medication.dosage,
          frequency: medication.frequency,
          route: medication.route,
          duration: medication.duration,
          indication: medication.indication,
          status: "pending" as any
        })
      );
      
      return Promise.all(requests);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medication-orders", patientId] });
      toast({
        title: "Success",
        description: "Medication orders submitted successfully!"
      });
      // Reset form
      setMedications([{
        medication: "",
        dosage: "",
        frequency: "",
        route: "",
        duration: "",
        indication: ""
      }]);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit medication orders. Please try again.",
        variant: "destructive"
      });
    }
  });

  const updateMedication = (index: number, field: keyof MedicationOrder, value: string) => {
    const updated = [...medications];
    updated[index] = { ...updated[index], [field]: value };
    setMedications(updated);
  };

  const addMedication = () => {
    setMedications([...medications, {
      medication: "",
      dosage: "",
      frequency: "",
      route: "",
      duration: "",
      indication: ""
    }]);
  };

  const removeMedication = (index: number) => {
    if (medications.length > 1) {
      setMedications(medications.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validMedications = medications.filter(med => 
      med.medication.trim() !== "" && 
      med.dosage.trim() !== "" && 
      med.frequency.trim() !== ""
    );
    
    if (validMedications.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please add at least one complete medication order.",
        variant: "destructive"
      });
      return;
    }

    createMedicationOrdersMutation.mutate();
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit}>
        {medications.map((medication, index) => (
          <Card key={index} className="mb-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-lg">
                Medication {index + 1}
              </CardTitle>
              {medications.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeMedication(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`medication-${index}`} className="text-sm font-medium">
                    Medication Name *
                  </Label>
                  <Input
                    id={`medication-${index}`}
                    value={medication.medication}
                    onChange={(e) => updateMedication(index, "medication", e.target.value)}
                    placeholder="e.g., Paracetamol"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor={`dosage-${index}`} className="text-sm font-medium">
                    Dosage *
                  </Label>
                  <Input
                    id={`dosage-${index}`}
                    value={medication.dosage}
                    onChange={(e) => updateMedication(index, "dosage", e.target.value)}
                    placeholder="e.g., 500mg"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`frequency-${index}`} className="text-sm font-medium">
                    Frequency *
                  </Label>
                  <Select
                    value={medication.frequency}
                    onValueChange={(value) => updateMedication(index, "frequency", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      {frequencyOptions.map((freq) => (
                        <SelectItem key={freq} value={freq}>
                          {freq}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor={`route-${index}`} className="text-sm font-medium">
                    Route
                  </Label>
                  <Select
                    value={medication.route}
                    onValueChange={(value) => updateMedication(index, "route", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select route" />
                    </SelectTrigger>
                    <SelectContent>
                      {routeOptions.map((route) => (
                        <SelectItem key={route} value={route}>
                          {route}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor={`duration-${index}`} className="text-sm font-medium">
                  Duration
                </Label>
                <Input
                  id={`duration-${index}`}
                  value={medication.duration}
                  onChange={(e) => updateMedication(index, "duration", e.target.value)}
                  placeholder="e.g., 7 days, 2 weeks"
                />
              </div>

              <div>
                <Label htmlFor={`indication-${index}`} className="text-sm font-medium">
                  Indication/Reasoning
                </Label>
                <Textarea
                  id={`indication-${index}`}
                  value={medication.indication}
                  onChange={(e) => updateMedication(index, "indication", e.target.value)}
                  placeholder="Clinical indication for this medication..."
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        ))}

        <div className="flex gap-2">
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
            {createMedicationOrdersMutation.isPending ? "Submitting..." : "Submit Medication Orders"}
          </Button>
        </div>
      </form>
    </div>
  );
}

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Send } from "lucide-react";
import { api } from "@/lib/api-client";

interface OrdersFormProps {
  patientId: string;
}

export default function OrdersForm({ patientId }: OrdersFormProps) {
  const [selectedLabOrders, setSelectedLabOrders] = useState<string[]>([]);
  const [selectedImagingOrders, setSelectedImagingOrders] = useState<string[]>([]);
  const [selectedMedication, setSelectedMedication] = useState("");
  const [medicationInstructions, setMedicationInstructions] = useState("");
  
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const labOptions = [
    "CBC with Differential",
    "Basic Metabolic Panel",
    "Arterial Blood Gas",
    "Troponin I",
    "D-Dimer",
    "PT/INR",
  ];

  const imagingOptions = [
    "Chest X-ray",
    "ECG",
    "CT Chest with contrast",
    "Echocardiogram",
    "CT Angiogram",
  ];

  const medicationOptions = [
    "Nitroglycerin 0.4mg SL PRN",
    "Aspirin 325mg PO once",
    "Metoprolol 25mg PO BID",
    "Furosemide 40mg IV",
    "Morphine 2mg IV PRN",
  ];

  const createOrderMutation = useMutation({
    mutationFn: async (data: {
      type: string;
      orderText: string;
      orderedBy: string;
    }) => {
      return api.patients.createOrder(patientId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/patients", patientId, "orders"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit order. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleLabOrderChange = (orderText: string, checked: boolean) => {
    if (checked) {
      setSelectedLabOrders(prev => [...prev, orderText]);
    } else {
      setSelectedLabOrders(prev => prev.filter(order => order !== orderText));
    }
  };

  const handleImagingOrderChange = (orderText: string, checked: boolean) => {
    if (checked) {
      setSelectedImagingOrders(prev => [...prev, orderText]);
    } else {
      setSelectedImagingOrders(prev => prev.filter(order => order !== orderText));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    const orders = [];

    // Add lab orders
    selectedLabOrders.forEach(order => {
      orders.push({
        type: "lab",
        orderText: order,
        orderedBy: user.id,
      });
    });

    // Add imaging orders
    selectedImagingOrders.forEach(order => {
      orders.push({
        type: "imaging",
        orderText: order,
        orderedBy: user.id,
      });
    });

    // Add medication order
    if (selectedMedication) {
      const medicationOrder = medicationInstructions 
        ? `${selectedMedication} - ${medicationInstructions}`
        : selectedMedication;
      orders.push({
        type: "medication",
        orderText: medicationOrder,
        orderedBy: user.id,
      });
    }

    if (orders.length === 0) {
      toast({
        title: "No Orders Selected",
        description: "Please select at least one order to submit.",
        variant: "destructive",
      });
      return;
    }

    try {
      await Promise.all(orders.map(order => createOrderMutation.mutateAsync(order)));
      
      toast({
        title: "Success",
        description: `${orders.length} order(s) submitted successfully!`,
        variant: "default",
      });

      // Clear form
      setSelectedLabOrders([]);
      setSelectedImagingOrders([]);
      setSelectedMedication("");
      setMedicationInstructions("");
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-md font-medium text-gray-800 mb-4">Place Orders</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Laboratory Orders */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Laboratory Orders
          </Label>
          <div className="space-y-2">
            {labOptions.map(option => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={`lab-${option}`}
                  checked={selectedLabOrders.includes(option)}
                  onCheckedChange={(checked) => handleLabOrderChange(option, checked as boolean)}
                />
                <Label htmlFor={`lab-${option}`} className="text-sm text-gray-700">
                  {option}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Imaging Orders */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Imaging Orders
          </Label>
          <div className="space-y-2">
            {imagingOptions.map(option => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={`imaging-${option}`}
                  checked={selectedImagingOrders.includes(option)}
                  onCheckedChange={(checked) => handleImagingOrderChange(option, checked as boolean)}
                />
                <Label htmlFor={`imaging-${option}`} className="text-sm text-gray-700">
                  {option}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Medication Orders */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-1 block">
            Medication Orders
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
          <Input
            value={medicationInstructions}
            onChange={(e) => setMedicationInstructions(e.target.value)}
            placeholder="Special instructions..."
            className="w-full"
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-success-green hover:bg-success-green/90"
          disabled={createOrderMutation.isPending}
        >
          <Send className="h-4 w-4 mr-2" />
          {createOrderMutation.isPending ? "Submitting..." : "Submit Orders"}
        </Button>
      </form>
    </div>
  );
}

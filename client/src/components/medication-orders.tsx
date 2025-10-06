import { useState, useEffect } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { apiClientV2 } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Pill, List, Clock, CheckCircle } from "lucide-react";
import type { MedicationOrder as MedicationOrderType } from "@/lib/api-client-v2";

interface MedicationOrder {
  medication: string;
  dosage: string;
  instructions: string;
}

interface MedicationOrdersProps {
  patientId: string;
}

export default function MedicationOrders({ patientId }: MedicationOrdersProps) {
  const [medications, setMedications] = useState<MedicationOrder[]>([
    {
      medication: "",
      dosage: "",
      instructions: ""
    }
  ]);
  
  // Sign-off fields
  const [signOffName, setSignOffName] = useState("");
  const [signOffRole, setSignOffRole] = useState("");
  
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Initialize sign-off fields from user
  useEffect(() => {
    if (user) {
      const userName = user.first_name && user.last_name 
        ? `${user.first_name} ${user.last_name}` 
        : user.username;
      const userRole = user.role || "student";
      setSignOffName(userName);
      setSignOffRole(userRole);
    }
  }, [user]);

  // Fetch medication orders
  const { data: medicationOrders } = useQuery({
    queryKey: ["medication-orders", patientId],
    queryFn: () => apiClientV2.studentGroups.medicationOrders.list({ patient: patientId }),
  });

  const createMedicationOrdersMutation = useMutation({
    mutationFn: async () => {
      const orders = medications.filter(med => 
        med.medication.trim() !== "" && 
        med.dosage.trim() !== "" && 
        med.instructions.trim() !== ""
      );
      
      if (!user) {
        throw new Error("User not authenticated");
      }
      
      const requests = orders.map(medication => 
        apiClientV2.studentGroups.medicationOrders.create({
          patient: parseInt(patientId),
          medication_name: medication.medication,
          dosage: medication.dosage,
          instructions: medication.instructions,
          name: signOffName,
          role: signOffRole
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
      // Reset medications list
      setMedications([{
        medication: "",
        dosage: "",
        instructions: ""
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
      instructions: ""
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
      med.instructions.trim() !== ""
    );
    
    if (validMedications.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please add at least one complete medication order (medication name, dosage, and instructions required).",
        variant: "destructive"
      });
      return;
    }

    if (!signOffName.trim() || !signOffRole.trim()) {
      toast({
        title: "Validation Error",
        description: "Please provide your name and role for sign-off.",
        variant: "destructive"
      });
      return;
    }

    createMedicationOrdersMutation.mutate();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-AU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="create" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create">
            <Plus className="h-4 w-4 mr-2" />
            Create Order
          </TabsTrigger>
          <TabsTrigger value="view">
            <List className="h-4 w-4 mr-2" />
            View Orders
          </TabsTrigger>
        </TabsList>

        {/* Create Medication Orders */}
        <TabsContent value="create">
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
                        placeholder="e.g., Paracetamol, Ibuprofen"
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
                        placeholder="e.g., 500mg, 10mg/kg"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor={`instructions-${index}`} className="text-sm font-medium">
                      Instructions *
                    </Label>
                    <Textarea
                      id={`instructions-${index}`}
                      value={medication.instructions}
                      onChange={(e) => updateMedication(index, "instructions", e.target.value)}
                      placeholder="e.g., Take twice daily (BD) orally (PO) for 7 days. For pain relief."
                      rows={3}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Include frequency, route, duration, and indication in your instructions
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Sign-off Section */}
            <Card className="mb-4 bg-muted/50">
              <CardHeader>
                <CardTitle className="text-sm">Sign-off Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="signoff-name">Name *</Label>
                    <Input
                      id="signoff-name"
                      value={signOffName}
                      onChange={(e) => setSignOffName(e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signoff-role">Role *</Label>
                    <Input
                      id="signoff-role"
                      value={signOffRole}
                      onChange={(e) => setSignOffRole(e.target.value)}
                      placeholder="e.g., Medical Student"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

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
        </TabsContent>

        {/* View Medication Orders */}
        <TabsContent value="view">
          <Card>
            <CardHeader>
              <CardTitle>Medication Orders</CardTitle>
              <CardDescription>View all medication orders for this patient</CardDescription>
            </CardHeader>
            <CardContent>
              {!medicationOrders || medicationOrders.results.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No medication orders found</p>
              ) : (
                <div className="space-y-4">
                  {medicationOrders.results.map((order: MedicationOrderType) => (
                    <Card key={order.id}>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-lg">{order.medication_name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(order.created_at)}
                            </p>
                          </div>
                          <Badge variant="outline" className="text-blue-600 border-blue-600">
                            <Pill className="h-3 w-3 mr-1" />
                            {order.dosage}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <p className="text-sm font-medium">Instructions:</p>
                            <p className="text-sm text-muted-foreground">{order.instructions}</p>
                          </div>
                          <div className="border-t pt-2 mt-2">
                            <p className="text-xs text-muted-foreground">
                              Prescribed by: {order.name} ({order.role})
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

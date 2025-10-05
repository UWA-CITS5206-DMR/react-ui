import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { apiClientV2 } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Send } from "lucide-react";

interface InvestigationRequestsProps {
  patientId: string;
}

export default function InvestigationRequests({ patientId }: InvestigationRequestsProps) {
  const [selectedLabOrders, setSelectedLabOrders] = useState<string[]>([]);
  const [selectedImagingOrders, setSelectedImagingOrders] = useState<string[]>([]);
  const [labReasoning, setLabReasoning] = useState("");
  const [imagingReasoning, setImagingReasoning] = useState("");
  
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const labOptions = [
    "FBC (Full Blood Count)",
    "EUC (Electrolytes, Urea & Creatinine)", 
    "LFTs (Liver Function Tests)",
    "Lipase",
    "Troponin",
    "Coags (Coagulation Studies)",
    "CRP (C-Reactive Protein)",
    "TFT (Thyroid Function Tests)"
  ];

  const imagingOptions = [
    "X-ray",
    "CT scan", 
    "MRI scan",
    "Ultrasound scan",
    "Echocardiogram"
  ];

  const createRequestMutation = useMutation({
    mutationFn: async () => {
      const requests = [];
      
      // Create blood test requests
      for (const test of selectedLabOrders) {
        requests.push(
          apiClientV2.instructors.bloodTestRequests.create({
            patient: parseInt(patientId),
            test_type: test.split(" ")[0] as any,
            status: "pending" as any,
            notes: labReasoning
          })
        );
      }
      
      // Create imaging requests  
      for (const imaging of selectedImagingOrders) {
        requests.push(
          apiClientV2.instructors.imagingRequests.create({
            patient: parseInt(patientId),
            imaging_type: imaging as any,
            status: "pending" as any,
            notes: imagingReasoning
          })
        );
      }
      
      return Promise.all(requests);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["investigation-requests", patientId] });
      toast({
        title: "Success",
        description: "Investigation requests submitted successfully!"
      });
      // Reset form
      setSelectedLabOrders([]);
      setSelectedImagingOrders([]);
      setLabReasoning("");
      setImagingReasoning("");
    },
    onError: () => {
      toast({
        title: "Error", 
        description: "Failed to submit requests. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleLabOrderChange = (test: string, checked: boolean) => {
    if (checked) {
      setSelectedLabOrders([...selectedLabOrders, test]);
    } else {
      setSelectedLabOrders(selectedLabOrders.filter(t => t !== test));
    }
  };

  const handleImagingOrderChange = (imaging: string, checked: boolean) => {
    if (checked) {
      setSelectedImagingOrders([...selectedImagingOrders, imaging]);
    } else {
      setSelectedImagingOrders(selectedImagingOrders.filter(i => i !== imaging));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedLabOrders.length === 0 && selectedImagingOrders.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please select at least one investigation.",
        variant: "destructive"
      });
      return;
    }

    createRequestMutation.mutate();
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit}>
        {/* Lab Orders */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Laboratory Tests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {labOptions.map((test) => (
                <div key={test} className="flex items-center space-x-2">
                  <Checkbox
                    id={test}
                    checked={selectedLabOrders.includes(test)}
                    onCheckedChange={(checked) => handleLabOrderChange(test, checked as boolean)}
                  />
                  <Label htmlFor={test} className="text-sm">
                    {test}
                  </Label>
                </div>
              ))}
            </div>
            <div>
              <Label htmlFor="lab-reasoning" className="text-sm font-medium">
                Clinical Reasoning
              </Label>
              <Textarea
                id="lab-reasoning"
                value={labReasoning}
                onChange={(e) => setLabReasoning(e.target.value)}
                placeholder="Explain your reasoning for these lab orders..."
                className="mt-1"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Imaging Orders */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Imaging Studies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {imagingOptions.map((imaging) => (
                <div key={imaging} className="flex items-center space-x-2">
                  <Checkbox
                    id={imaging}
                    checked={selectedImagingOrders.includes(imaging)}
                    onCheckedChange={(checked) => handleImagingOrderChange(imaging, checked as boolean)}
                  />
                  <Label htmlFor={imaging} className="text-sm">
                    {imaging}
                  </Label>
                </div>
              ))}
            </div>
            <div>
              <Label htmlFor="imaging-reasoning" className="text-sm font-medium">
                Clinical Reasoning
              </Label>
              <Textarea
                id="imaging-reasoning"
                value={imagingReasoning}
                onChange={(e) => setImagingReasoning(e.target.value)}
                placeholder="Explain your reasoning for these imaging orders..."
                className="mt-1"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Button
          type="submit"
          className="w-full bg-hospital-blue hover:bg-hospital-blue/90"
          disabled={createRequestMutation.isPending}
        >
          <Send className="h-4 w-4 mr-2" />
          {createRequestMutation.isPending ? "Submitting..." : "Submit Investigation Requests"}
        </Button>
      </form>
    </div>
  );
}

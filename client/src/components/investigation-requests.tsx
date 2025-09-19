import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Send } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface InvestigationRequestsProps {
  patientId: string;
}

export default function InvestigationRequests({
  patientId,
}: InvestigationRequestsProps) {
  const [selectedLabOrders, setSelectedLabOrders] = useState<string[]>([]);
  const [selectedImagingOrders, setSelectedImagingOrders] = useState<{
    [key: string]: string[];
  }>({});
  const [selectedDiagnosticOrders, setSelectedDiagnosticOrders] = useState<
    string[]
  >([]);
  const [labReasoning, setLabReasoning] = useState("");
  const [imagingReasonings, setImagingReasonings] = useState<{
    [key: string]: string;
  }>({});
  const [diagnosticReasoning, setDiagnosticReasoning] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");

  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Updated lab options per client feedback
  const labOptions = [
    "FBC (Full Blood Count)",
    "EUC (Electrolytes, Urea & Creatinine)",
    "LFTs (Liver Function Tests)",
    "Lipase",
    "Troponin",
    "Coag (Coagulation Studies)",
    "D-dimer",
    "CRP (C-Reactive Protein)",
    "VBG (Venous Blood Gas)",
    "Haptoglobin",
    "LDH (Lactate Dehydrogenase)",
    "Group & Hold",
    "Crossmatch",
    "Blood Culture",
  ];

  // Update imagingOptions in investigation-requests.tsx:
  const imagingOptions = [
    "X-ray",
    "Ultrasound",
    "CT",
    "CTA",
    "MRI",
    "Nuclear Medicine",
    "Interventional",
  ];

  // Diagnostic options (ECG moved here from imaging per client feedback)
  const diagnosticOptions = [
    "ECG (12-lead)",
    "Holter Monitor",
    "Exercise Stress Test",
    "Spirometry",
  ];

  const createOrderMutation = useMutation({
    mutationFn: async (data: {
      type: string;
      orderText: string;
      reasoning: string;
      orderedBy: string;
      name: string;
      role: string;
    }) => {
      // Mock API call - log to console
      console.log("Investigation Request:", data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { success: true };
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Investigation requests submitted successfully!",
        variant: "default",
      });
      // Clear form
      setSelectedLabOrders([]);
      setSelectedImagingOrders({});
      setSelectedDiagnosticOrders([]);
      setLabReasoning("");
      setImagingReasonings({});
      setDiagnosticReasoning("");
      setName("");
      setRole("");
    },
    onError: () => {
      toast({
        title: "Error",
        description:
          "Failed to submit investigation requests. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleLabOrderChange = (orderText: string, checked: boolean) => {
    if (checked) {
      setSelectedLabOrders((prev) => [...prev, orderText]);
    } else {
      setSelectedLabOrders((prev) =>
        prev.filter((order) => order !== orderText)
      );
    }
  };

  const handleImagingOrderChange = (
    category: string,
    type: string,
    checked: boolean
  ) => {
    setSelectedImagingOrders((prev) => {
      const categoryOrders = prev[category] || [];
      if (checked) {
        return {
          ...prev,
          [category]: [...categoryOrders, type],
        };
      } else {
        return {
          ...prev,
          [category]: categoryOrders.filter((order) => order !== type),
        };
      }
    });
  };

  const handleImagingReasoningChange = (
    category: string,
    reasoning: string
  ) => {
    setImagingReasonings((prev) => ({
      ...prev,
      [category]: reasoning,
    }));
  };

  const handleDiagnosticOrderChange = (orderText: string, checked: boolean) => {
    if (checked) {
      setSelectedDiagnosticOrders((prev) => [...prev, orderText]);
    } else {
      setSelectedDiagnosticOrders((prev) =>
        prev.filter((order) => order !== orderText)
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    const orders = [];

    // Add lab orders with reasoning
    if (selectedLabOrders.length > 0) {
      orders.push({
        type: "lab",
        orderText: selectedLabOrders.join(", "),
        reasoning: labReasoning,
        orderedBy: user.id,
        name,
        role,
      });
    }

    // Add imaging orders with specific reasoning per category
    Object.entries(selectedImagingOrders).forEach(([category, types]) => {
      if (types.length > 0) {
        orders.push({
          type: "imaging",
          orderText: `${category}: ${types.join(", ")}`,
          reasoning: imagingReasonings[category] || "",
          orderedBy: user.id,
          name,
          role,
        });
      }
    });

    // Add diagnostic orders with reasoning
    if (selectedDiagnosticOrders.length > 0) {
      orders.push({
        type: "diagnostic",
        orderText: selectedDiagnosticOrders.join(", "),
        reasoning: diagnosticReasoning,
        orderedBy: user.id,
        name,
        role,
      });
    }

    if (orders.length === 0) {
      toast({
        title: "No Orders Selected",
        description: "Please select at least one investigation to submit.",
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

    // Check that all selected imaging categories have reasoning
    const missingImagingReasoning = Object.entries(selectedImagingOrders).find(
      ([category, types]) => types.length > 0 && !imagingReasonings[category]
    );

    if (missingImagingReasoning) {
      toast({
        title: "Missing Reasoning",
        description: `Please provide clinical reasoning for ${missingImagingReasoning[0]}.`,
        variant: "destructive",
      });
      return;
    }

    // Check diagnostic reasoning
    if (selectedDiagnosticOrders.length > 0 && !diagnosticReasoning) {
      toast({
        title: "Missing Reasoning",
        description: "Please provide clinical reasoning for diagnostic tests.",
        variant: "destructive",
      });
      return;
    }

    try {
      await Promise.all(
        orders.map((order) => createOrderMutation.mutateAsync(order))
      );
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Investigation Requests</CardTitle>
        <p className="text-sm text-gray-600">
          Request laboratory tests, imaging studies, and diagnostic procedures
          with clinical reasoning
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Laboratory Orders */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Laboratory Tests
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
              {labOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`lab-${option}`}
                    checked={selectedLabOrders.includes(option)}
                    onCheckedChange={(checked) =>
                      handleLabOrderChange(option, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={`lab-${option}`}
                    className="text-sm text-gray-700"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </div>
            {selectedLabOrders.length > 0 && (
              <div className="mt-3">
                <Label className="text-sm font-medium text-gray-700 mb-1 block">
                  Clinical Reasoning for Lab Tests *
                </Label>
                <Textarea
                  value={labReasoning}
                  onChange={(e) => setLabReasoning(e.target.value)}
                  placeholder="Explain the clinical reasoning for requesting these laboratory tests..."
                  rows={3}
                  required={selectedLabOrders.length > 0}
                />
              </div>
            )}
          </div>

          {/* Imaging Orders */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Imaging Studies
            </Label>
            <div className="space-y-2 mb-3">
              {imagingOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`imaging-${option}`}
                    checked={selectedImagingOrders[option]?.length > 0 || false}
                    onCheckedChange={(checked) =>
                      handleImagingOrderChange(
                        option,
                        option,
                        checked as boolean
                      )
                    }
                  />
                  <Label
                    htmlFor={`imaging-${option}`}
                    className="text-sm text-gray-700"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </div>
            {Object.keys(selectedImagingOrders).some(
              (category) => selectedImagingOrders[category]?.length > 0
            ) && (
              <>
                <div className="mt-3">
                  <Label className="text-sm font-medium text-gray-700 mb-1 block">
                    Clinical Reasoning for Imaging Studies *
                  </Label>
                  <Textarea
                    value={diagnosticReasoning}
                    onChange={(e) => setDiagnosticReasoning(e.target.value)}
                    placeholder="Explain why these imaging studies are needed and what you expect to find..."
                    rows={3}
                    required
                  />
                </div>
                <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">
                    📋 Complete Radiology Request Form
                  </h4>
                  <p className="text-sm text-blue-700 mb-3">
                    For selected imaging studies, please complete the detailed
                    radiology request form:
                  </p>
                  <a
                    href="https://docs.google.com/forms/d/e/1FAIpQLSe4GljO5N41TS9bVVzjRjUh_gGzdwNeYXCm9hUk4blxd_O3uA/viewform?usp=sf_link"
                    target="_blank"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Open Radiology Request Form →
                  </a>
                </div>
              </>
            )}
          </div>

          {/* Diagnostic Orders */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Diagnostic Procedures
            </Label>
            <div className="space-y-2 mb-3">
              {diagnosticOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`diagnostic-${option}`}
                    checked={selectedDiagnosticOrders.includes(option)}
                    onCheckedChange={(checked) =>
                      handleDiagnosticOrderChange(option, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={`diagnostic-${option}`}
                    className="text-sm text-gray-700"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </div>
            {selectedDiagnosticOrders.length > 0 && (
              <div className="mt-3">
                <Label className="text-sm font-medium text-gray-700 mb-1 block">
                  Clinical Reasoning for Diagnostic Tests *
                </Label>
                <Textarea
                  value={diagnosticReasoning}
                  onChange={(e) => setDiagnosticReasoning(e.target.value)}
                  placeholder="Explain the clinical reasoning for requesting these diagnostic procedures..."
                  rows={3}
                  required={selectedDiagnosticOrders.length > 0}
                />
              </div>
            )}
          </div>

          {/* Sign-off Section */}
          <div className="border-t pt-6">
            <h3 className="text-md font-semibold text-gray-900 mb-4">
              Sign-off
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role *</Label>
                <Input
                  id="role"
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
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={createOrderMutation.isPending}
          >
            <Send className="h-4 w-4 mr-2" />
            {createOrderMutation.isPending
              ? "Submitting..."
              : "Submit Investigation Requests"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

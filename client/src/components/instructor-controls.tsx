import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { X, Plus, Clock } from "lucide-react";
import { api } from "@/lib/api-client";

interface InstructorControlsProps {
  patientId: string;
  isVisible: boolean;
  onClose: () => void;
}

export default function InstructorControls({ patientId, isVisible, onClose }: InstructorControlsProps) {
  const [patientCondition, setPatientCondition] = useState("stable");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const releaseTroponinMutation = useMutation({
    mutationFn: async () => {
      // Find the pending troponin lab result and release it
      return api.labResults.updateById("lab-2", {
        value: "0.08",
        status: "completed",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/patients", patientId, "labs"] });
      toast({
        title: "Lab Result Released",
        description: "Troponin results are now available to students.",
        variant: "default",
      });
    },
  });

  const updatePatientMutation = useMutation({
    mutationFn: async (status: string) => {
      return api.patients.updateById(patientId, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/patients", patientId] });
      toast({
        title: "Patient Status Updated",
        description: "Patient condition has been updated.",
        variant: "default",
      });
    },
  });

  const handleConditionChange = (condition: string) => {
    setPatientCondition(condition);
    updatePatientMutation.mutate(condition);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 w-80 z-50">
      <Card className="shadow-xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-gray-900">
              Instructor Controls
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Release Troponin Results</span>
            <Button
              onClick={() => releaseTroponinMutation.mutate()}
              disabled={releaseTroponinMutation.isPending}
              size="sm"
              className="bg-alert-yellow hover:bg-alert-yellow/90 text-white"
            >
              {releaseTroponinMutation.isPending ? "Releasing..." : "Release Now"}
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Patient Condition</span>
            <Select value={patientCondition} onValueChange={handleConditionChange}>
              <SelectTrigger className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="stable">Stable</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="monitoring">Monitoring</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Student Progress</span>
            <span className="text-xs bg-success-green/10 text-green-800 px-2 py-1 rounded">
              On Track
            </span>
          </div>
          
          <Button
            className="w-full bg-hospital-blue hover:bg-hospital-blue/90"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Scenario Event
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

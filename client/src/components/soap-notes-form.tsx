import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";
import { api } from "@/lib/api-client";

interface SoapNotesFormProps {
  patientId: string;
}

export default function SoapNotesForm({ patientId }: SoapNotesFormProps) {
  const [subjective, setSubjective] = useState("");
  const [objective, setObjective] = useState("");
  const [assessment, setAssessment] = useState("");
  const [plan, setPlan] = useState("");
  
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createSoapNoteMutation = useMutation({
    mutationFn: async (data: {
      subjective: string;
      objective: string;
      assessment: string;
      plan: string;
      authorId: string;
    }) => {
      return api.patients.createSoapNote(patientId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/patients", patientId, "soap-notes"] });
      toast({
        title: "Success",
        description: "SOAP note saved successfully!",
        variant: "default",
      });
      // Clear form
      setSubjective("");
      setObjective("");
      setAssessment("");
      setPlan("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save SOAP note. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    if (!subjective || !objective || !assessment || !plan) {
      toast({
        title: "Validation Error",
        description: "Please complete all sections of the SOAP note.",
        variant: "destructive",
      });
      return;
    }

    createSoapNoteMutation.mutate({
      subjective,
      objective,
      assessment,
      plan,
      authorId: user.id,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-md font-medium text-gray-800 mb-4">SOAP Note Entry</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="subjective" className="text-sm font-medium text-gray-700">
            Subjective
          </Label>
          <Textarea
            id="subjective"
            value={subjective}
            onChange={(e) => setSubjective(e.target.value)}
            className="mt-1"
            rows={3}
            placeholder="Patient reports..."
          />
        </div>
        
        <div>
          <Label htmlFor="objective" className="text-sm font-medium text-gray-700">
            Objective
          </Label>
          <Textarea
            id="objective"
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
            className="mt-1"
            rows={3}
            placeholder="Physical examination findings..."
          />
        </div>
        
        <div>
          <Label htmlFor="assessment" className="text-sm font-medium text-gray-700">
            Assessment
          </Label>
          <Textarea
            id="assessment"
            value={assessment}
            onChange={(e) => setAssessment(e.target.value)}
            className="mt-1"
            rows={2}
            placeholder="Clinical impression..."
          />
        </div>
        
        <div>
          <Label htmlFor="plan" className="text-sm font-medium text-gray-700">
            Plan
          </Label>
          <Textarea
            id="plan"
            value={plan}
            onChange={(e) => setPlan(e.target.value)}
            className="mt-1"
            rows={3}
            placeholder="Treatment plan..."
          />
        </div>
        
        <Button
          type="submit"
          className="w-full bg-hospital-blue hover:bg-hospital-blue/90"
          disabled={createSoapNoteMutation.isPending}
        >
          <Save className="h-4 w-4 mr-2" />
          {createSoapNoteMutation.isPending ? "Saving..." : "Save SOAP Note"}
        </Button>
      </form>
    </div>
  );
}

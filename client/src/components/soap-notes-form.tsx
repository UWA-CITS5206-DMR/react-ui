import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { apiClientV2 } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { FileText } from "lucide-react";

interface SOAPNotesFormProps {
  patientId: string;
}

export default function SOAPNotesForm({ patientId }: SOAPNotesFormProps) {
  const [subjective, setSubjective] = useState("");
  const [objective, setObjective] = useState("");
  const [assessment, setAssessment] = useState("");
  const [plan, setPlan] = useState("");
  
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createNotesMutation = useMutation({
    mutationFn: async () => {
      // Combine SOAP sections into a single content field
      const soapContent = [
        subjective && `**SUBJECTIVE:**\n${subjective}`,
        objective && `**OBJECTIVE:**\n${objective}`,
        assessment && `**ASSESSMENT:**\n${assessment}`,
        plan && `**PLAN:**\n${plan}`
      ].filter(Boolean).join('\n\n');

      return apiClientV2.studentGroups.notes.create({
        patient: parseInt(patientId),
        name: user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : user?.username || 'Unknown',
        role: user?.role || 'Student',
        content: soapContent
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student-groups-notes", patientId] });
      toast({
        title: "Success",
        description: "SOAP notes saved successfully!"
      });
      // Reset form
      setSubjective("");
      setObjective("");
      setAssessment("");
      setPlan("");
    },
    onError: (error) => {
      console.error("Error creating SOAP notes:", error);
      toast({
        title: "Error",
        description: "Failed to save SOAP notes. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subjective.trim() && !objective.trim() && !assessment.trim() && !plan.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in at least one section of the SOAP notes.",
        variant: "destructive"
      });
      return;
    }

    createNotesMutation.mutate();
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit}>
        {/* Subjective */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg text-green-700">
              Subjective
            </CardTitle>
            <p className="text-sm text-gray-600">
              Patient's chief complaint, history of present illness, review of systems
            </p>
          </CardHeader>
          <CardContent>
            <Textarea
              value={subjective}
              onChange={(e) => setSubjective(e.target.value)}
              placeholder="Document the patient's subjective complaints, symptoms, and concerns in their own words..."
              className="min-h-[120px]"
            />
          </CardContent>
        </Card>

        {/* Objective */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg text-blue-700">
              Objective
            </CardTitle>
            <p className="text-sm text-gray-600">
              Physical examination findings, vital signs, laboratory results
            </p>
          </CardHeader>
          <CardContent>
            <Textarea
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              placeholder="Document objective findings from physical examination, vital signs, and diagnostic tests..."
              className="min-h-[120px]"
            />
          </CardContent>
        </Card>

        {/* Assessment */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg text-orange-700">
              Assessment
            </CardTitle>
            <p className="text-sm text-gray-600">
              Clinical impression, differential diagnosis, problem list
            </p>
          </CardHeader>
          <CardContent>
            <Textarea
              value={assessment}
              onChange={(e) => setAssessment(e.target.value)}
              placeholder="Document your clinical assessment, differential diagnoses, and problem identification..."
              className="min-h-[120px]"
            />
          </CardContent>
        </Card>

        {/* Plan */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg text-purple-700">
              Plan
            </CardTitle>
            <p className="text-sm text-gray-600">
              Treatment plan, investigations, follow-up, patient education
            </p>
          </CardHeader>
          <CardContent>
            <Textarea
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
              placeholder="Document your treatment plan, investigations needed, follow-up requirements, and patient education..."
              className="min-h-[120px]"
            />
          </CardContent>
        </Card>

        <Button
          type="submit"
          className="w-full bg-hospital-blue hover:bg-hospital-blue/90"
          disabled={createNotesMutation.isPending}
        >
          <FileText className="h-4 w-4 mr-2" />
          {createNotesMutation.isPending ? "Saving..." : "Save SOAP Notes"}
        </Button>
      </form>
    </div>
  );
}

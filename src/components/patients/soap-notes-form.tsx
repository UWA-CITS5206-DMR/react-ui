import { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { apiClientV2 } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { FileText, Plus, List } from "lucide-react";
import { SignOffSection } from "@/components/ui/sign-off-section";
import type { NoteEntry } from "@/lib/api-client-v2";
import { formatDate } from "@/lib/utils";

interface SOAPNotesFormProps {
  patientId: string;
}

export default function SOAPNotesForm({ patientId }: SOAPNotesFormProps) {
  const [content, setContent] = useState("");
  
  // Sign-off fields
  const [signOffName, setSignOffName] = useState("");
  const [signOffRole, setSignOffRole] = useState("");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Note: signOffName and signOffRole are intentionally left empty
  // In shared group account mode, the actual student operating the system
  // should manually enter their own name and role, not use the group account info

  // Fetch notes
  const { data: notes } = useQuery({
    queryKey: ["notes", patientId],
    queryFn: () => apiClientV2.studentGroups.notes.list({ patient: patientId }),
  });

  const createNotesMutation = useMutation({
    mutationFn: async () => {
      return apiClientV2.studentGroups.notes.create({
        patient: parseInt(patientId),
        name: signOffName,
        role: signOffRole,
        content: content
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes", patientId] });
      toast({
        title: "Success",
        description: "Note saved successfully!"
      });
      // Reset form
      setContent("");
    },
    onError: (error) => {
      console.error("Error creating note:", error);
      toast({
        title: "Error",
        description: "Failed to save note. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter note content.",
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

    createNotesMutation.mutate();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <Tabs defaultValue="view" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="view">
            <List className="h-4 w-4 mr-2" />
            View Notes
          </TabsTrigger>
          <TabsTrigger value="create">
            <Plus className="h-4 w-4 mr-2" />
            Create Note
          </TabsTrigger>
        </TabsList>

        {/* View Notes */}
        <TabsContent value="view">
          <Card>
            <CardHeader>
              <CardTitle>Clinical Notes</CardTitle>
              <CardDescription>View all clinical notes for this patient</CardDescription>
            </CardHeader>
            <CardContent>
              {!notes || notes.results.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No notes found</p>
              ) : (
                <div className="space-y-4">
                  {notes.results.map((note: NoteEntry) => (
                    <Card key={note.id}>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(note.created_at)}
                            </p>
                          </div>
                          <FileText className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="space-y-3">
                          <div className="bg-muted/30 p-4 rounded-md">
                            <pre className="whitespace-pre-wrap text-sm font-sans">{note.content}</pre>
                          </div>
                          <div className="border-t pt-2">
                            <p className="text-xs text-muted-foreground">
                              Written by: {note.name} ({note.role})
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

        {/* Create Note */}
        <TabsContent value="create">
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>Clinical Note</CardTitle>
                <CardDescription>Document clinical observations, assessment, and plan</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Content */}
                <div className="space-y-2">
                  <Label htmlFor="content">Note Content *</Label>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Enter your clinical notes here. You may structure as SOAP (Subjective, Objective, Assessment, Plan) or use free-form text..."
                    className="min-h-[300px]"
                  />
                  <p className="text-xs text-muted-foreground">
                    Tip: Consider organizing your notes using headings like Subjective, Objective, Assessment, and Plan
                  </p>
                </div>

                {/* Sign-off Section */}
                <SignOffSection
                  name={signOffName}
                  role={signOffRole}
                  onNameChange={setSignOffName}
                  onRoleChange={setSignOffRole}
                  idPrefix="soap-signoff"
                />

                <Button
                  type="submit"
                  className="w-full bg-hospital-blue hover:bg-hospital-blue/90"
                  disabled={createNotesMutation.isPending}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  {createNotesMutation.isPending ? "Saving..." : "Save Note"}
                </Button>
              </CardContent>
            </Card>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}

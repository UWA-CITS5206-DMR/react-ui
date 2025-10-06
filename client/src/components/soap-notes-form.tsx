import { useState, useEffect } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { apiClientV2 } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { FileText, Plus, List } from "lucide-react";
import type { NoteEntry } from "@/lib/api-client-v2";

interface SOAPNotesFormProps {
  patientId: string;
}

export default function SOAPNotesForm({ patientId }: SOAPNotesFormProps) {
  const [content, setContent] = useState("");
  
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
            Create Note
          </TabsTrigger>
          <TabsTrigger value="view">
            <List className="h-4 w-4 mr-2" />
            View Notes
          </TabsTrigger>
        </TabsList>

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

                {/* Sign-off Section - Horizontal Layout */}
                <Card className="bg-muted/50">
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
      </Tabs>
    </div>
  );
}

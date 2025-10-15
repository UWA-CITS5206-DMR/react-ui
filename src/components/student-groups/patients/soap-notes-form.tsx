import { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { apiClientV2 } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { SignOffSection } from "@/components/ui/sign-off-section";
import type { NoteEntry } from "@/lib/api-client-v2";
import { formatDate } from "@/lib/utils";
import PageLayout from "@/components/layout/page-layout";

interface SOAPNotesFormProps {
  patientId: string;
}

export default function SOAPNotesForm({ patientId }: SOAPNotesFormProps) {
  // Create/Edit modal state - reused for both create and edit
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<NoteEntry | null>(null);
  const [content, setContent] = useState("");
  const [signOffName, setSignOffName] = useState("");
  const [signOffRole, setSignOffRole] = useState("");

  // Delete state
  const [deleteNoteId, setDeleteNoteId] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

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

  const saveNoteMutation = useMutation({
    mutationFn: async () => {
      if (editingNote) {
        // Update existing note
        return apiClientV2.studentGroups.notes.partialUpdate(editingNote.id, {
          content,
          name: signOffName,
          role: signOffRole,
          patient: parseInt(patientId),
        });
      } else {
        // Create new note
        return apiClientV2.studentGroups.notes.create({
          patient: parseInt(patientId),
          name: signOffName,
          role: signOffRole,
          content: content,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes", patientId] });
      toast({
        title: "Success",
        description: editingNote ? "Note updated successfully!" : "Note created successfully!",
      });
      handleCloseDialog();
    },
    onError: (error) => {
      console.error("Error saving note:", error);
      toast({
        title: "Error",
        description: "Failed to save note. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteNoteMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiClientV2.studentGroups.notes.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes", patientId] });
      toast({
        title: "Success",
        description: "Note deleted successfully!",
      });
      setDeleteDialogOpen(false);
      setDeleteNoteId(null);
    },
    onError: (error) => {
      console.error("Error deleting note:", error);
      toast({
        title: "Error",
        description: "Failed to delete note. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleOpenCreateDialog = () => {
    setEditingNote(null);
    setContent("");
    setSignOffName("");
    setSignOffRole("");
    setNoteDialogOpen(true);
  };

  const handleOpenEditDialog = (note: NoteEntry) => {
    setEditingNote(note);
    setContent(note.content);
    setSignOffName(note.name);
    setSignOffRole(note.role);
    setNoteDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setNoteDialogOpen(false);
    setEditingNote(null);
    setContent("");
    setSignOffName("");
    setSignOffRole("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter note content.",
        variant: "destructive",
      });
      return;
    }

    if (!signOffName.trim() || !signOffRole.trim()) {
      toast({
        title: "Validation Error",
        description: "Please provide your name and role for sign-off.",
        variant: "destructive",
      });
      return;
    }

    saveNoteMutation.mutate();
  };

  const handleDelete = (noteId: number) => {
    setDeleteNoteId(noteId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteNoteId !== null) {
      deleteNoteMutation.mutate(deleteNoteId);
    }
  };

  return (
    <PageLayout
      title="Clinical Notes"
      description="View, edit, and delete clinical notes for this patient. Click the + button to add a new note."
      extraBottomPadding
    >
      {!notes || notes.results.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">
          No notes found. Click the + button to create your first note.
        </p>
      ) : (
        <div className="space-y-4">
          {notes.results.map((note: NoteEntry) => (
            <Card key={note.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-sm text-muted-foreground">{formatDate(note.created_at)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleOpenEditDialog(note)}
                      title="Edit note"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(note.id)}
                      title="Delete note"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
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

      {/* Floating Action Button */}
      <Button
        onClick={handleOpenCreateDialog}
        className="fixed bottom-8 right-8 h-14 w-14 rounded-full shadow-lg bg-hospital-blue hover:bg-hospital-blue/90 z-50"
        title="Add new note"
      >
        <Plus className="h-6 w-6" />
      </Button>

      {/* Create/Edit Note Dialog */}
      <Dialog open={noteDialogOpen} onOpenChange={setNoteDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingNote ? "Edit Clinical Note" : "Create Clinical Note"}</DialogTitle>
            <DialogDescription>
              {editingNote
                ? "Update the clinical note information below. Fields marked with * are required."
                : "Fill in the clinical note information below. Fields marked with * are required."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="note-content">Note Content *</Label>
                <Textarea
                  id="note-content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter your clinical notes here. You may structure as SOAP (Subjective, Objective, Assessment, Plan) or use free-form text..."
                  className="min-h-[300px]"
                />
                <p className="text-xs text-muted-foreground">
                  Tip: Consider organizing your notes using headings like Subjective, Objective,
                  Assessment, and Plan
                </p>
              </div>
              <SignOffSection
                name={signOffName}
                role={signOffRole}
                onNameChange={setSignOffName}
                onRoleChange={setSignOffRole}
                idPrefix="note-signoff"
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseDialog}
                disabled={saveNoteMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saveNoteMutation.isPending}
                className="bg-hospital-blue hover:bg-hospital-blue/90"
              >
                {saveNoteMutation.isPending
                  ? "Saving..."
                  : editingNote
                  ? "Update Note"
                  : "Create Note"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Clinical Note</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this clinical note? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleteNoteMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={deleteNoteMutation.isPending}
            >
              {deleteNoteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}

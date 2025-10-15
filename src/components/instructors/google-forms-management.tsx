import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClientV2 } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, FileText, ExternalLink } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { GoogleFormLink, GoogleFormLinkCreate } from "@/lib/api-client-v2";
import PageLayout from "@/components/layout/page-layout";

export default function GoogleFormsManagement() {
  // Create/Edit modal state
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [editingForm, setEditingForm] = useState<GoogleFormLink | null>(null);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [displayOrder, setDisplayOrder] = useState("0");
  const [isActive, setIsActive] = useState(true);

  // Delete state
  const [deleteFormId, setDeleteFormId] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch Google Forms
  const {
    data: formsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["/api/patients/google-forms"],
    queryFn: () => apiClientV2.googleFormLinks.list(),
  });

  const forms = formsData || [];

  // Save (create or update) mutation
  const saveFormMutation = useMutation({
    mutationFn: async () => {
      const payload: GoogleFormLinkCreate = {
        title: title.trim(),
        url: url.trim(),
        description: description.trim(),
        display_order: parseInt(displayOrder) || 0,
        is_active: isActive,
      };

      if (editingForm) {
        return apiClientV2.googleFormLinks.partialUpdate(editingForm.id, payload);
      } else {
        return apiClientV2.googleFormLinks.create(payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/patients/google-forms"] });
      toast({
        title: "Success",
        description: editingForm
          ? "Google Form updated successfully!"
          : "Google Form created successfully!",
      });
      handleCloseDialog();
    },
    onError: (error: any) => {
      console.error("Error saving Google Form:", error);
      const errorMessage =
        error?.response?.data?.detail ||
        error?.message ||
        "Failed to save Google Form. Please check your input and try again.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  // Delete mutation
  const deleteFormMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiClientV2.googleFormLinks.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/patients/google-forms"] });
      toast({
        title: "Success",
        description: "Google Form deleted successfully!",
      });
      setDeleteDialogOpen(false);
      setDeleteFormId(null);
    },
    onError: (error: any) => {
      console.error("Error deleting Google Form:", error);
      toast({
        title: "Error",
        description: "Failed to delete Google Form. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleOpenCreateDialog = () => {
    setEditingForm(null);
    setTitle("");
    setUrl("");
    setDescription("");
    setDisplayOrder("0");
    setIsActive(true);
    setFormDialogOpen(true);
  };

  const handleOpenEditDialog = (form: GoogleFormLink) => {
    setEditingForm(form);
    setTitle(form.title);
    setUrl(form.url);
    setDescription(form.description);
    setDisplayOrder(form.display_order.toString());
    setIsActive(form.is_active);
    setFormDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setFormDialogOpen(false);
    setEditingForm(null);
    setTitle("");
    setUrl("");
    setDescription("");
    setDisplayOrder("0");
    setIsActive(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!title.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a form title.",
        variant: "destructive",
      });
      return;
    }

    if (!url.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a form URL.",
        variant: "destructive",
      });
      return;
    }

    // Basic URL validation
    try {
      new URL(url.trim());
    } catch {
      toast({
        title: "Validation Error",
        description: "Please enter a valid URL.",
        variant: "destructive",
      });
      return;
    }

    saveFormMutation.mutate();
  };

  const handleDelete = () => {
    if (deleteFormId !== null) {
      deleteFormMutation.mutate(deleteFormId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Loading forms...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertDescription>Failed to load Google Forms. Please try again later.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <PageLayout
      title="Google Forms Management"
      description="Manage Google Forms that are displayed to students and patients"
    >
      {forms.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-gray-300 rounded-lg">
          <FileText className="h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Forms Available</h3>
          <p className="text-gray-500 mb-4">Get started by creating your first Google Form link.</p>
          <Button
            onClick={handleOpenCreateDialog}
            className="bg-hospital-blue hover:bg-hospital-blue/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Form
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {forms.map((form) => (
            <Card
              key={form.id}
              className={`hover:shadow-lg transition-shadow flex flex-col ${
                !form.is_active ? "opacity-60 border-gray-300" : ""
              }`}
            >
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                  <CardTitle className="flex items-center gap-2 flex-1">
                    <FileText className="h-5 w-5 text-hospital-blue" />
                    <span className="line-clamp-2">{form.title}</span>
                  </CardTitle>
                  <div className="flex gap-1 ml-2 sm:ml-0 sm:mt-0 mt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenEditDialog(form)}
                      title="Edit form"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setDeleteFormId(form.id);
                        setDeleteDialogOpen(true);
                      }}
                      title="Delete form"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {form.description && (
                  <CardDescription className="mt-2 line-clamp-3">
                    {form.description}
                  </CardDescription>
                )}
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                  <span>Order: {form.display_order}</span>
                  <span className={form.is_active ? "text-green-600" : "text-gray-400"}>
                    {form.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col flex-1">
                <div className="mt-auto">
                  <Button
                    onClick={() => window.open(form.url, "_blank", "noopener,noreferrer")}
                    variant="outline"
                    className="w-full"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open Form
                  </Button>
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
        title="Add new form"
      >
        <Plus className="h-6 w-6" />
      </Button>

      {/* Create/Edit Dialog */}
      <Dialog open={formDialogOpen} onOpenChange={setFormDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingForm ? "Edit Google Form" : "Create Google Form"}</DialogTitle>
            <DialogDescription>
              {editingForm
                ? "Update the Google Form information below. Fields marked with * are required."
                : "Fill in the Google Form information below. Fields marked with * are required."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter form title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="url">
                URL <span className="text-red-500">*</span>
              </Label>
              <Input
                id="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://forms.google.com/..."
                required
              />
              <p className="text-xs text-gray-500">Enter the complete URL to the Google Form</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the form's purpose"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="displayOrder">Display Order</Label>
              <Input
                id="displayOrder"
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(e.target.value)}
                placeholder="0"
                min="0"
              />
              <p className="text-xs text-gray-500">
                Forms with lower numbers appear first (0 is highest priority)
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="isActive" checked={isActive} onCheckedChange={setIsActive} />
              <Label htmlFor="isActive" className="cursor-pointer">
                Active (visible to users)
              </Label>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-hospital-blue hover:bg-hospital-blue/90"
                disabled={saveFormMutation.isPending}
              >
                {saveFormMutation.isPending
                  ? "Saving..."
                  : editingForm
                  ? "Update Form"
                  : "Create Form"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this Google Form link? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setDeleteFormId(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteFormMutation.isPending}
            >
              {deleteFormMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}

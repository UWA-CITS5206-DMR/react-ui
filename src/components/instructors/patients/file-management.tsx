import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/lib/error-utils";
import { apiClientV2 } from "@/lib/queryClient";
import { Upload, FileText, Image, File, Trash2, Share2 } from "lucide-react";
import type { PatientFile, FileCategory } from "@/lib/api-client-v2";
import FilePreviewDialog from "./file-preview-dialog";
import FileReleaseDialog from "./file-release-dialog";
import PageLayout from "@/components/layout/page-layout";

interface FileManagementProps {
  patientId: number;
}

export default function FileManagement({ patientId }: FileManagementProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<FileCategory>("Admission");
  const [requiresPagination, setRequiresPagination] = useState(false);
  const [previewFile, setPreviewFile] = useState<PatientFile | null>(null);
  const [releaseFile, setReleaseFile] = useState<PatientFile | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch patient files
  const { data: filesResponse } = useQuery({
    queryKey: ["patients", patientId, "files"],
    queryFn: () => apiClientV2.patients.files.list(patientId),
  });

  const files = filesResponse?.results || [];

  // Upload file mutation
  const uploadFileMutation = useMutation({
    mutationFn: async ({
      file,
      category,
      requires_pagination,
    }: {
      file: File;
      category: FileCategory;
      requires_pagination: boolean;
    }) => {
      return apiClientV2.patients.files.create(patientId, {
        file,
        category,
        requires_pagination,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients", patientId, "files"] });
      setSelectedFile(null);
      toast({
        title: "File Uploaded",
        description: "Patient file has been uploaded successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Upload Failed",
        description: getErrorMessage(error, "Failed to upload file."),
        variant: "destructive",
      });
    },
  });

  // Delete file mutation
  const deleteFileMutation = useMutation({
    mutationFn: async (fileId: string) => {
      return apiClientV2.patients.files.delete(patientId, fileId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients", patientId, "files"] });
      toast({
        title: "File Deleted",
        description: "Patient file has been deleted successfully.",
      });
      setDeleteDialogOpen(false);
      setFileToDelete(null);
    },
    onError: (error: any) => {
      toast({
        title: "Delete Failed",
        description: getErrorMessage(error, "Failed to delete file."),
        variant: "destructive",
      });
      setDeleteDialogOpen(false);
      setFileToDelete(null);
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      toast({
        title: "No File Selected",
        description: "Please select a file to upload.",
        variant: "destructive",
      });
      return;
    }

    uploadFileMutation.mutate({
      file: selectedFile,
      category: selectedCategory,
      requires_pagination: requiresPagination,
    });
  };

  const handleDelete = (fileId: string) => {
    setFileToDelete(fileId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (fileToDelete) {
      deleteFileMutation.mutate(fileToDelete);
    }
  };

  const getFileIcon = (category: FileCategory) => {
    switch (category) {
      case "Pathology":
      case "Lab Results":
        return <FileText className="h-4 w-4" />;
      case "Imaging":
        return <Image className="h-4 w-4" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: FileCategory) => {
    switch (category) {
      case "Pathology":
      case "Lab Results":
        return "bg-blue-100 text-blue-800";
      case "Imaging":
        return "bg-purple-100 text-purple-800";
      case "Admission":
        return "bg-green-100 text-green-800";
      case "Diagnostics":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <PageLayout
      title="Patient File Management"
      description="Files uploaded here can be linked to student investigation requests or manually released to selected student groups using the Release button. Use manual release to grant immediate access without waiting for a request approval."
      extraBottomPadding
    >
      <div className="space-y-6">
        {/* File Upload Section */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="file">Select File</Label>
              <Input
                id="file"
                type="file"
                onChange={handleFileSelect}
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={selectedCategory}
                onValueChange={(value: FileCategory) => setSelectedCategory(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admission">Admission</SelectItem>
                  <SelectItem value="Pathology">Pathology</SelectItem>
                  <SelectItem value="Imaging">Imaging</SelectItem>
                  <SelectItem value="Diagnostics">Diagnostics</SelectItem>
                  <SelectItem value="Lab Results">Lab Results</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              {selectedCategory === "Admission" && (
                <p className="text-xs text-blue-600 mt-1">
                  Admission files will be visible to all student groups
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="requiresPagination"
              checked={requiresPagination}
              onChange={(e) => setRequiresPagination(e.target.checked)}
              className="rounded border-gray-300"
            />
            <Label htmlFor="requiresPagination" className="text-sm font-normal cursor-pointer">
              Requires page-based access control (only PDF documents)
            </Label>
          </div>

          <Button
            onClick={handleUpload}
            disabled={!selectedFile || uploadFileMutation.isPending}
            className="w-full"
          >
            <Upload className="h-4 w-4" />
            {uploadFileMutation.isPending ? "Uploading..." : "Upload File"}
          </Button>
        </div>

        {/* Files List */}
        <div className="space-y-3">
          <h3 className="font-medium text-sm">Patient Files ({files.length})</h3>
          <ScrollArea className="h-64">
            {files.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">No files uploaded yet</p>
            ) : (
              <div className="space-y-2">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-3">
                      {getFileIcon(file.category || "Other")}
                      <div>
                        <p className="text-sm font-medium">{file.display_name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            variant="secondary"
                            className={getCategoryColor(file.category || "Other")}
                          >
                            {file.category || "Other"}
                          </Badge>
                          <span className="text-xs text-gray-500">Patient #{file.patient}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => setPreviewFile(file)}>
                        View
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setReleaseFile(file)}
                        className="gap-2"
                      >
                        <Share2 className="h-3 w-3" /> Release
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(file.id)}
                        disabled={deleteFileMutation.isPending}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </div>

      {/* File Preview Dialog */}
      {previewFile && (
        <FilePreviewDialog
          open={!!previewFile}
          onOpenChange={(open) => !open && setPreviewFile(null)}
          patientId={patientId}
          fileId={previewFile.id}
          fileName={previewFile.display_name}
          category={previewFile.category}
          requiresPagination={previewFile.requires_pagination}
        />
      )}

      {/* File Release Dialog */}
      {releaseFile && (
        <FileReleaseDialog
          open={!!releaseFile}
          onOpenChange={(open) => !open && setReleaseFile(null)}
          patientId={patientId}
          file={releaseFile}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete File</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this file? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleteFileMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={deleteFileMutation.isPending}
            >
              {deleteFileMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}

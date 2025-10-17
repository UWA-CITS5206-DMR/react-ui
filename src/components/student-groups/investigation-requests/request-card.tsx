import { formatDate } from "@/lib/utils";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle, Clock, FileText, Eye, Trash2 } from "lucide-react";
import type { ApprovedFile } from "@/lib/api-client-v2";
import StudentFilePreviewDialog from "./file-preview-dialog";

interface RequestCardProps {
  testType: string | string[];
  details: string;
  status: "pending" | "completed";
  createdAt: string;
  requestedBy: {
    name: string;
    role: string;
  };
  approvedFiles?: ApprovedFile[];
  patientId: number;
  canDelete?: boolean;
  onDelete?: () => void;
  isDeleting?: boolean;
}

/**
 * Request card component - Displays details of a single investigation request
 * Shows approved files and provides preview functionality when request is completed
 * Allows students to delete their own pending requests when provided with handlers
 */
export function RequestCard({
  testType,
  details,
  status,
  createdAt,
  requestedBy,
  approvedFiles = [],
  patientId,
  canDelete = false,
  onDelete,
  isDeleting = false,
}: RequestCardProps) {
  // State for file preview dialog
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{
    fileId: string;
    fileName: string;
    pageRange?: string;
    requiresPagination: boolean;
  } | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handlePreviewFile = (file: ApprovedFile) => {
    setSelectedFile({
      fileId: file.file_id,
      fileName: file.display_name,
      pageRange: file.page_range ?? undefined,
      requiresPagination: file.requires_pagination,
    });
    setPreviewDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (isDeleting) {
      return;
    }
    onDelete?.();
    setDeleteDialogOpen(false);
  };

  // Format test types for display
  const displayTestType = Array.isArray(testType) ? testType.join(", ") : testType;

  return (
    <>
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{displayTestType}</h3>
              <p className="text-sm text-muted-foreground">{formatDate(createdAt)}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={status === "completed" ? "default" : "secondary"}>
                {status === "completed" ? (
                  <>
                    <CheckCircle className="h-3 w-3 mr-1" /> Completed
                  </>
                ) : (
                  <>
                    <Clock className="h-3 w-3 mr-1" /> Pending
                  </>
                )}
              </Badge>
              {canDelete && onDelete && status === "pending" && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setDeleteDialogOpen(true)}
                  title="Delete request"
                  className="text-destructive hover:text-destructive"
                  disabled={isDeleting}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <div>
              <p className="text-sm font-medium">Details:</p>
              <p className="text-sm text-muted-foreground">{details}</p>
            </div>
            <div className="border-t pt-2 mt-2">
              <p className="text-xs text-muted-foreground">
                Requested by: {requestedBy.name} ({requestedBy.role})
              </p>
            </div>

            {/* Display approved files when request is completed */}
            {status === "completed" && approvedFiles.length > 0 && (
              <div className="border-t pt-3 mt-3">
                <p className="text-sm font-medium mb-2 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Approved Files:
                </p>
                <div className="space-y-2">
                  {approvedFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{file.display_name}</p>
                        {file.page_range && (
                          <p className="text-xs text-muted-foreground">Pages: {file.page_range}</p>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handlePreviewFile(file)}
                        className="ml-2"
                      >
                        <Eye className="h-4 w-4" />
                        Preview
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>

        {/* File Preview Dialog */}
        {selectedFile && (
          <StudentFilePreviewDialog
            open={previewDialogOpen}
            onOpenChange={setPreviewDialogOpen}
            patientId={patientId}
            fileId={selectedFile.fileId}
            fileName={selectedFile.fileName}
            requiresPagination={selectedFile.requiresPagination}
            pageRange={selectedFile.pageRange}
          />
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Investigation Request</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this investigation request? This action cannot be
                undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleConfirmDelete} disabled={isDeleting}>
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Card>
    </>
  );
}

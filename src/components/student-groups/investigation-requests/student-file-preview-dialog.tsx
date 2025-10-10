import { useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, Info } from "lucide-react";
import { apiClientV2 } from "@/lib/queryClient";
import { getErrorMessage } from "@/lib/error-utils";
import type { FileCategory } from "@/lib/api-client-v2";

interface StudentFilePreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patientId: number;
  fileId: string;
  fileName: string;
  category?: FileCategory;
  requiresPagination?: boolean;
  pageRange?: string; // Display only - shows approved page range, not sent to server
}

/**
 * Student-specific file preview dialog
 * Server determines the page range based on instructor approval
 * Students cannot modify or specify the page range
 */
export default function StudentFilePreviewDialog({
  open,
  onOpenChange,
  patientId,
  fileId,
  fileName,
  category,
  requiresPagination = false,
  pageRange,
}: StudentFilePreviewDialogProps) {
  // Fetch file blob - server determines page range based on approval
  const { data: fileBlob, isLoading, error } = useQuery({
    queryKey: ["patients", patientId, "files", fileId, "view"],
    queryFn: () => apiClientV2.patients.files.view(patientId, fileId),
    enabled: open,
    staleTime: 0, // Always refetch when dialog opens
    gcTime: 0, // Don't cache the blob
  });

  // Create object URL from blob
  const fileUrl = useMemo(() => {
    if (!fileBlob) return null;
    return URL.createObjectURL(fileBlob);
  }, [fileBlob]);

  // Clean up object URL on unmount or when fileUrl changes
  useEffect(() => {
    return () => {
      if (fileUrl) {
        URL.revokeObjectURL(fileUrl);
      }
    };
  }, [fileUrl]);

  // Determine file type from blob or filename
  const fileType = useMemo(() => {
    if (!fileBlob) return "unknown";
    
    const mimeType = fileBlob.type;
    if (mimeType.startsWith("image/")) return "image";
    if (mimeType === "application/pdf") return "pdf";
    
    // Fallback to filename extension
    const extension = fileName.toLowerCase().split(".").pop();
    if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(extension || "")) {
      return "image";
    }
    if (extension === "pdf") return "pdf";
    
    return "unknown";
  }, [fileBlob, fileName]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="truncate">{fileName}</span>
            {category && (
              <span className="text-sm font-normal text-gray-500">
                ({category})
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        {/* Show page range information if restricted */}
        {requiresPagination && pageRange && (
          <Alert className="mb-4">
            <Info className="h-4 w-4" />
            <AlertDescription>
              Viewing pages: {pageRange} (as approved by instructor)
            </AlertDescription>
          </Alert>
        )}

        <div className="flex-1 overflow-hidden">
          {isLoading && (
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-gray-500">Loading file...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center h-full p-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Failed to load file: {getErrorMessage(error, "Unknown error")}
                </AlertDescription>
              </Alert>
            </div>
          )}

          {!isLoading && !error && fileUrl && (
            <>
              {fileType === "pdf" && (
                <embed
                  src={fileUrl}
                  type="application/pdf"
                  className="w-full h-full rounded"
                  title={fileName}
                />
              )}

              {fileType === "image" && (
                <div className="flex items-center justify-center h-full bg-gray-100 rounded">
                  <img
                    src={fileUrl}
                    alt={fileName}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              )}

              {fileType === "unknown" && (
                <div className="flex items-center justify-center h-full p-4">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      File type not supported for preview. Please download the file to view it.
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";
import { apiClientV2 } from "@/lib/queryClient";
import type {
  BloodTestRequest,
  ImagingRequest,
  PatientFile,
  ApprovedFileRequest,
} from "@/lib/api-client-v2";

interface ApprovalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: BloodTestRequest | ImagingRequest;
  onApprove: (approvedFiles: ApprovedFileRequest[]) => void;
  isLoading: boolean;
}

/**
 * Approval dialog component for approving investigation requests
 */
export function ApprovalDialog({
  open,
  onOpenChange,
  request,
  onApprove,
  isLoading,
}: ApprovalDialogProps) {
  // File selection state
  const [selectedFiles, setSelectedFiles] = useState<ApprovedFileRequest[]>([]);
  const [pageRangeInput, setPageRangeInput] = useState<Record<string, string>>({});

  // Fetch patient files
  const { data: patientFilesData } = useQuery({
    queryKey: ["patients", request.patient?.id, "files"],
    queryFn: async () => {
      if (!request.patient) {
        return { count: 0, next: null, previous: null, results: [] };
      }
      return apiClientV2.patients.files.list(request.patient.id);
    },
    enabled: open && !!request.patient,
  });

  // Initialize state when dialog opens
  React.useEffect(() => {
    if (open && request.approved_files && request.approved_files.length > 0) {
      const existingFiles = request.approved_files.map((af) => ({
        file_id: af.file_id,
        page_range: af.page_range || undefined,
      }));
      setSelectedFiles(existingFiles);

      const pageRanges: Record<string, string> = {};
      request.approved_files.forEach((af) => {
        if (af.page_range) {
          pageRanges[af.file_id] = af.page_range;
        }
      });
      setPageRangeInput(pageRanges);
    } else {
      setSelectedFiles([]);
      setPageRangeInput({});
    }
  }, [open, request]);

  const handleFileSelection = (file: PatientFile, checked: boolean) => {
    if (checked) {
      setSelectedFiles((prev) => [
        ...prev,
        { file_id: file.id, page_range: pageRangeInput[file.id] || undefined },
      ]);
    } else {
      setSelectedFiles((prev) => prev.filter((f) => f.file_id !== file.id));
      setPageRangeInput((prev) => {
        const newState = { ...prev };
        delete newState[file.id];
        return newState;
      });
    }
  };

  const handlePageRangeChange = (fileId: string, pageRange: string) => {
    setPageRangeInput((prev) => ({ ...prev, [fileId]: pageRange }));
    setSelectedFiles((prev) =>
      prev.map((f) => (f.file_id === fileId ? { ...f, page_range: pageRange || undefined } : f))
    );
  };

  const handleApprove = () => {
    onApprove(selectedFiles);
  };

  const patientFiles = patientFilesData?.results || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col min-h-0">
        <DialogHeader>
          <DialogTitle>Approve Request</DialogTitle>
          <DialogDescription>
            Select files to approve and specify page ranges if needed.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 min-h-0 flex flex-col gap-4">
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">{request.test_type}</h4>
              <Badge>{request.status}</Badge>
            </div>
            <p className="text-sm text-gray-600">
              <strong>Details:</strong> {request.details}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Requested by:</strong> {request.name} ({request.role})
            </p>
          </div>

          <div className="flex-1 min-h-0">
            <Label className="mb-2 block">Select Files to Approve:</Label>
            <ScrollArea className="h-64 overflow-auto border rounded-lg p-4">
              {patientFiles.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  No files available for this patient
                </p>
              ) : (
                <div className="space-y-3">
                  {patientFiles.map((file) => {
                    const isSelected = selectedFiles.some((f) => f.file_id === file.id);
                    return (
                      <div key={file.id} className="flex items-start gap-3 p-3 border rounded-lg">
                        <Checkbox
                          id={`file-${file.id}`}
                          checked={isSelected}
                          onCheckedChange={(checked) =>
                            handleFileSelection(file, checked as boolean)
                          }
                        />
                        <div className="flex-1 space-y-2">
                          <Label htmlFor={`file-${file.id}`} className="cursor-pointer">
                            {file.display_name}
                            {file.category && (
                              <Badge variant="outline" className="ml-2">
                                {file.category}
                              </Badge>
                            )}
                            {file.requires_pagination && (
                              <Badge variant="secondary" className="ml-2">
                                Paginated
                              </Badge>
                            )}
                          </Label>
                          {isSelected && file.requires_pagination && (
                            <div className="space-y-1">
                              <Label htmlFor={`page-range-${file.id}`} className="text-xs">
                                Page Range (required for paginated files, e.g., "1-5" or "1,3,5"):
                              </Label>
                              <Input
                                id={`page-range-${file.id}`}
                                placeholder="e.g., 1-5 or 1,3,5"
                                value={pageRangeInput[file.id] || ""}
                                onChange={(e) => handlePageRangeChange(file.id, e.target.value)}
                                className="text-sm"
                                required
                              />
                            </div>
                          )}
                          {isSelected && !file.requires_pagination && (
                            <p className="text-xs text-gray-500">
                              This file does not require page range specification.
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleApprove}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="h-4 w-4" />
            Approve & Complete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

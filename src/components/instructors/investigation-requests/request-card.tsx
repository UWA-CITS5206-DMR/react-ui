import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, FileText, User, Eye } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { useState } from "react";
import FilePreviewDialog from "@/components/patients/file-preview-dialog";
import type { BloodTestRequest, ImagingRequest, ApprovedFile } from "@/lib/api-client-v2";

interface RequestCardProps {
  request: BloodTestRequest | ImagingRequest;
  onApprove: (request: BloodTestRequest | ImagingRequest) => void;
}

/**
 * Request card component for displaying investigation requests
 */
export function RequestCard({ request, onApprove }: RequestCardProps) {
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [selectedPreviewFile, setSelectedPreviewFile] = useState<{
    fileId: string;
    fileName: string;
    pageRange?: string;
    requiresPagination: boolean;
    patientId: number;
  } | null>(null);

  const handlePreviewFile = (file: ApprovedFile) => {
    setSelectedPreviewFile({
      fileId: file.file_id,
      fileName: file.display_name,
      pageRange: file.page_range ?? undefined,
      requiresPagination: file.requires_pagination,
      patientId: request.patient.id,
    });
    setPreviewDialogOpen(true);
  };

  return (
    <>
      <Card className="mb-4">
        <CardContent className="pt-6">
          <div className="space-y-3">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-lg">{request.test_type}</h3>
                <p className="text-sm text-muted-foreground">{formatDate(request.created_at)}</p>
              </div>
              <Badge variant={request.status === "completed" ? "default" : "secondary"}>
                {request.status === "completed" ? (
                  <>
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Completed
                  </>
                ) : (
                  <>
                    <Clock className="h-3 w-3 mr-1" />
                    Pending
                  </>
                )}
              </Badge>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Student Group: {request.user.username}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>
                  Requested by: {request.name} ({request.role})
                </span>
              </div>
              <div className="flex items-start gap-2">
                <FileText className="h-4 w-4 mt-0.5" />
                <span className="flex-1">
                  <strong>Details:</strong> {request.details}
                </span>
              </div>
            </div>

            {request.approved_files && request.approved_files.length > 0 && (
              <div className="mt-3 pt-3 border-t">
                <p className="text-sm font-medium mb-2">Approved Files:</p>
                <div className="space-y-2">
                  {request.approved_files.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1 min-w-0 flex items-center gap-2">
                        <FileText className="h-3 w-3 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{file.display_name}</p>
                          {file.page_range && (
                            <p className="text-xs text-gray-500">Pages: {file.page_range}</p>
                          )}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handlePreviewFile(file)}
                        className="ml-2"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {request.status === "pending" && (
              <div className="flex gap-2 pt-3 border-t">
                <Button
                  onClick={() => onApprove(request)}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  size="sm"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve Request
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* File Preview Dialog */}
      {selectedPreviewFile && (
        <FilePreviewDialog
          open={previewDialogOpen}
          onOpenChange={setPreviewDialogOpen}
          patientId={selectedPreviewFile.patientId}
          fileId={selectedPreviewFile.fileId}
          fileName={selectedPreviewFile.fileName}
          requiresPagination={selectedPreviewFile.requiresPagination}
        />
      )}
    </>
  );
}

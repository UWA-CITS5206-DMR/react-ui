import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/lib/error-utils";
import { apiClientV2 } from "@/lib/queryClient";
import { RequestCard } from "./request-card";
import { ApprovalDialog } from "./approval-dialog";
import type { ImagingRequest, BloodTestRequest, ApprovedFileRequest } from "@/lib/api-client-v2";

interface ImagingRequestListProps {
  patientId?: number;
  showCompleted: boolean;
}

/**
 * Imaging request list component with approval functionality
 */
export function ImagingRequestList({ patientId, showCompleted }: ImagingRequestListProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  // Approval dialog state
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ImagingRequest | null>(null);

  // Fetch imaging requests
  const { data: imagingRequestsData, isLoading } = useQuery({
    queryKey: [
      "instructors",
      "imaging-requests",
      showCompleted ? "all" : "pending",
      page,
      pageSize,
      patientId,
    ],
    queryFn: () => {
      if (showCompleted) {
        return apiClientV2.instructors.imagingRequests.list({
          page,
          page_size: pageSize,
          ...(patientId && { patient: patientId }),
        });
      } else {
        return apiClientV2.instructors.imagingRequests.pending().then((data) => ({
          ...data,
          results: data.results.slice((page - 1) * pageSize, page * pageSize),
        }));
      }
    },
  });

  // Update imaging request status
  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      status,
      approved_files,
    }: {
      id: number;
      status: "pending" | "completed";
      approved_files?: ApprovedFileRequest[];
    }) => {
      return apiClientV2.instructors.imagingRequests.updateStatus(id, {
        status,
        approved_files,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["instructors", "imaging-requests"] });
      toast({
        title: "Success",
        description: "Imaging request has been updated.",
      });
      handleCloseApprovalDialog();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: getErrorMessage(error, "Failed to update request"),
        variant: "destructive",
      });
    },
  });

  const handleApproveRequest = (request: BloodTestRequest | ImagingRequest) => {
    setSelectedRequest(request as ImagingRequest);
    setApprovalDialogOpen(true);
  };

  const handleCloseApprovalDialog = () => {
    setApprovalDialogOpen(false);
    setSelectedRequest(null);
  };

  const handleApprove = (approvedFiles: ApprovedFileRequest[]) => {
    if (!selectedRequest) return;

    updateMutation.mutate({
      id: selectedRequest.id,
      status: "completed",
      approved_files: approvedFiles.length > 0 ? approvedFiles : undefined,
    });
  };

  const imagingRequests = imagingRequestsData?.results || [];
  const totalPages = imagingRequestsData ? Math.ceil(imagingRequestsData.count / pageSize) : 1;

  const renderPagination = () => (
    <div className="flex items-center justify-between gap-4 mt-6">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setPage(Math.max(1, page - 1))}
        disabled={page === 1}
      >
        Previous
      </Button>

      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">
          Page {page} of {totalPages}
        </span>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => setPage(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
      >
        Next
      </Button>
    </div>
  );

  return (
    <>
      <ScrollArea className="h-full pr-4">
        {isLoading ? (
          <p className="text-center text-gray-500 py-8">Loading...</p>
        ) : imagingRequests.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            {showCompleted ? "No imaging requests found" : "No pending imaging requests"}
          </p>
        ) : (
          <>
            {imagingRequests.map((request) => (
              <RequestCard key={request.id} request={request} onApprove={handleApproveRequest} />
            ))}
            {renderPagination()}
          </>
        )}
      </ScrollArea>

      {selectedRequest && (
        <ApprovalDialog
          open={approvalDialogOpen}
          onOpenChange={setApprovalDialogOpen}
          request={selectedRequest}
          onApprove={handleApprove}
          isLoading={updateMutation.isPending}
        />
      )}
    </>
  );
}

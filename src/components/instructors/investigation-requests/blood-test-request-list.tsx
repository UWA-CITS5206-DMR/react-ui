import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/lib/error-utils";
import { apiClientV2 } from "@/lib/queryClient";
import { RequestCard } from "./request-card";
import { ApprovalDialog } from "./approval-dialog";
import type { BloodTestRequest, ImagingRequest, ApprovedFileRequest } from "@/lib/api-client-v2";

interface BloodTestRequestListProps {
  patientId?: number;
  showCompleted: boolean;
}

/**
 * Blood test request list component with approval functionality
 */
export function BloodTestRequestList({ patientId, showCompleted }: BloodTestRequestListProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  // Approval dialog state
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<BloodTestRequest | null>(null);

  // Fetch blood test requests
  const { data: bloodTestsData, isLoading } = useQuery({
    queryKey: [
      "instructors",
      "blood-test-requests",
      showCompleted ? "all" : "pending",
      page,
      pageSize,
      patientId,
    ],
    queryFn: () => {
      if (showCompleted) {
        return apiClientV2.instructors.bloodTestRequests.list({
          page,
          page_size: pageSize,
          ...(patientId && { patient: patientId }),
        });
      } else {
        return apiClientV2.instructors.bloodTestRequests.pending().then((data) => ({
          ...data,
          results: data.results.slice((page - 1) * pageSize, page * pageSize),
        }));
      }
    },
  });

  // Update blood test request status
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
      return apiClientV2.instructors.bloodTestRequests.updateStatus(id, {
        status,
        approved_files,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["instructors", "blood-test-requests"] });
      toast({
        title: "Success",
        description: "Blood test request has been updated.",
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
    setSelectedRequest(request as BloodTestRequest);
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

  const bloodTests = bloodTestsData?.results || [];
  const totalPages = bloodTestsData ? Math.ceil(bloodTestsData.count / pageSize) : 1;

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
        ) : bloodTests.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            {showCompleted ? "No blood test requests found" : "No pending blood test requests"}
          </p>
        ) : (
          <>
            {bloodTests.map((request) => (
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

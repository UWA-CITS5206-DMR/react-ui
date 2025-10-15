import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { apiClientV2 } from "@/lib/queryClient";
import { RequestCard } from "./request-card";
import type { ImagingRequest } from "@/lib/api-client-v2";
import { useToast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/lib/error-utils";

interface ImagingRequestListProps {
  patientId: string;
}

/**
 * Imaging request list component with delete support for pending requests
 */
export function ImagingRequestList({ patientId }: ImagingRequestListProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { data: imagingRequests } = useQuery({
    queryKey: ["imaging-requests", patientId],
    queryFn: () => apiClientV2.studentGroups.imagingRequests.list({ patient: patientId }),
  });

  const deleteImagingRequestMutation = useMutation({
    mutationFn: async (requestId: number) => {
      await apiClientV2.studentGroups.imagingRequests.delete(requestId);
    },
    onMutate: (requestId: number) => {
      setDeletingId(requestId);
    },
    onSuccess: () => {
      toast({
        title: "Request deleted",
        description: "The imaging request has been removed.",
      });
      queryClient.invalidateQueries({ queryKey: ["imaging-requests", patientId] });
    },
    onError: (error: any) => {
      toast({
        title: "Unable to delete",
        description: getErrorMessage(error, "Failed to delete the imaging request."),
        variant: "destructive",
      });
    },
    onSettled: () => {
      setDeletingId(null);
    },
  });

  const handleDeleteRequest = (requestId: number) => {
    deleteImagingRequestMutation.mutate(requestId);
  };

  return (
    <div>
      {!imagingRequests || imagingRequests.results.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">No imaging requests found</p>
      ) : (
        <div className="space-y-4">
          {imagingRequests.results.map((request: ImagingRequest) => (
            <RequestCard
              key={request.id}
              testType={request.test_type}
              details={request.details}
              status={request.status}
              createdAt={request.created_at}
              requestedBy={{
                name: request.name,
                role: request.role,
              }}
              approvedFiles={request.approved_files}
              patientId={parseInt(patientId)}
              canDelete={request.status === "pending"}
              onDelete={() => handleDeleteRequest(request.id)}
              isDeleting={deletingId === request.id && deleteImagingRequestMutation.isPending}
            />
          ))}
        </div>
      )}
    </div>
  );
}

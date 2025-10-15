import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { apiClientV2 } from "@/lib/queryClient";
import { RequestCard } from "./request-card";
import type { BloodTestRequest } from "@/lib/api-client-v2";
import { useToast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/lib/error-utils";

interface BloodTestRequestListProps {
  patientId: string;
}

/**
 * Blood test request list component with delete support for pending requests
 */
export function BloodTestRequestList({ patientId }: BloodTestRequestListProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { data: bloodTestRequests } = useQuery({
    queryKey: ["blood-test-requests", patientId],
    queryFn: () => apiClientV2.studentGroups.bloodTestRequests.list({ patient: patientId }),
  });

  const deleteBloodTestRequestMutation = useMutation({
    mutationFn: async (requestId: number) => {
      await apiClientV2.studentGroups.bloodTestRequests.delete(requestId);
    },
    onMutate: (requestId: number) => {
      setDeletingId(requestId);
    },
    onSuccess: () => {
      toast({
        title: "Request deleted",
        description: "The blood test request has been removed.",
      });
      queryClient.invalidateQueries({ queryKey: ["blood-test-requests", patientId] });
    },
    onError: (error: any) => {
      toast({
        title: "Unable to delete",
        description: getErrorMessage(error, "Failed to delete the blood test request."),
        variant: "destructive",
      });
    },
    onSettled: () => {
      setDeletingId(null);
    },
  });

  const handleDeleteRequest = (requestId: number) => {
    deleteBloodTestRequestMutation.mutate(requestId);
  };

  return (
    <div>
      {!bloodTestRequests || bloodTestRequests.results.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">No blood test requests found</p>
      ) : (
        <div className="space-y-4">
          {bloodTestRequests.results.map((request: BloodTestRequest) => (
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
              isDeleting={deletingId === request.id && deleteBloodTestRequestMutation.isPending}
            />
          ))}
        </div>
      )}
    </div>
  );
}

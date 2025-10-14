import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClientV2 } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { RequestCard } from "./request-card";
import type { BloodTestRequest } from "@/lib/api-client-v2";

interface BloodTestRequestListProps {
  patientId: string;
}

/**
 * Blood test request list component with edit and delete functionality
 */
export function BloodTestRequestList({ patientId }: BloodTestRequestListProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: bloodTestRequests } = useQuery({
    queryKey: ["blood-test-requests", patientId],
    queryFn: () => apiClientV2.studentGroups.bloodTestRequests.list({ patient: patientId }),
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (requestId: number) =>
      apiClientV2.studentGroups.bloodTestRequests.delete(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blood-test-requests", patientId] });
      toast({
        title: "Success",
        description: "Blood test request deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete blood test request",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (_requestId: number) => {
    // TODO: Implement edit functionality with a dialog
    toast({
      title: "Edit Feature",
      description: "Edit functionality coming soon!",
    });
  };

  const handleDelete = (requestId: number) => {
    deleteMutation.mutate(requestId);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Blood Test Requests</CardTitle>
        <CardDescription>
          View and manage your blood test requests for this patient. You can edit or delete pending
          requests.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!bloodTestRequests || bloodTestRequests.results.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No blood test requests found</p>
        ) : (
          <div className="space-y-4">
            {bloodTestRequests.results.map((request: BloodTestRequest) => (
              <RequestCard
                key={request.id}
                id={request.id}
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
                onEdit={handleEdit}
                onDelete={handleDelete}
                canModify={true}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

import { useQuery } from "@tanstack/react-query";
import { apiClientV2 } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RequestCard } from "./request-card";
import type { BloodTestRequest } from "@/lib/api-client-v2";

interface BloodTestRequestListProps {
  patientId: string;
}

/**
 * Blood test request list component
 */
export function BloodTestRequestList({ patientId }: BloodTestRequestListProps) {
  const { data: bloodTestRequests } = useQuery({
    queryKey: ["blood-test-requests", patientId],
    queryFn: () => apiClientV2.studentGroups.bloodTestRequests.list({ patient: patientId }),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Blood Test Requests</CardTitle>
        <CardDescription>View all blood test requests for this patient</CardDescription>
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
                reason={request.reason}
                status={request.status}
                createdAt={request.created_at}
                requestedBy={{
                  name: request.name,
                  role: request.role,
                }}
                approvedFiles={request.approved_files}
                patientId={parseInt(patientId)}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

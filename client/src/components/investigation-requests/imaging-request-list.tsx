import { useQuery } from "@tanstack/react-query";
import { apiClientV2 } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RequestCard } from "./request-card";
import type { ImagingRequest } from "@/lib/api-client-v2";

interface ImagingRequestListProps {
  patientId: string;
}

/**
 * Imaging request list component
 */
export function ImagingRequestList({ patientId }: ImagingRequestListProps) {
  const { data: imagingRequests } = useQuery({
    queryKey: ["imaging-requests", patientId],
    queryFn: () => apiClientV2.studentGroups.imagingRequests.list({ patient: patientId }),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Imaging Requests</CardTitle>
        <CardDescription>View all imaging requests for this patient</CardDescription>
      </CardHeader>
      <CardContent>
        {!imagingRequests || imagingRequests.results.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No imaging requests found</p>
        ) : (
          <div className="space-y-4">
            {imagingRequests.results.map((request: ImagingRequest) => (
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
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

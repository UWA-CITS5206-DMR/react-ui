import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock } from "lucide-react";

interface RequestCardProps {
  id: number;
  testType: string;
  reason: string;
  status: "pending" | "completed";
  createdAt: string;
  requestedBy: {
    name: string;
    role: string;
  };
}

/**
 * Request card component - Displays details of a single investigation request
 */
export function RequestCard({
  testType,
  reason,
  status,
  createdAt,
  requestedBy,
}: RequestCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-AU", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-semibold text-lg">{testType}</h3>
            <p className="text-sm text-muted-foreground">{formatDate(createdAt)}</p>
          </div>
          <Badge variant={status === "completed" ? "default" : "secondary"}>
            {status === "completed" ? (
              <>
                <CheckCircle className="h-3 w-3 mr-1" /> Completed
              </>
            ) : (
              <>
                <Clock className="h-3 w-3 mr-1" /> Pending
              </>
            )}
          </Badge>
        </div>
        <div className="space-y-2">
          <div>
            <p className="text-sm font-medium">Reason:</p>
            <p className="text-sm text-muted-foreground">{reason}</p>
          </div>
          <div className="border-t pt-2 mt-2">
            <p className="text-xs text-muted-foreground">
              Requested by: {requestedBy.name} ({requestedBy.role})
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

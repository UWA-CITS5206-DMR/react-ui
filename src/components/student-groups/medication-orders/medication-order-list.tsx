import { useQuery } from "@tanstack/react-query";
import { POLLING_INTERVAL } from "@/lib/constants";
import { apiClientV2 } from "@/lib/queryClient";
import { formatDate } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pill } from "lucide-react";
import type { MedicationOrder } from "@/lib/api-client-v2";

interface MedicationOrderListProps {
  patientId: string;
}

/**
 * Medication order list component
 */
export function MedicationOrderList({ patientId }: MedicationOrderListProps) {
  const { data: medicationOrders } = useQuery({
    queryKey: ["medication-orders", patientId],
    queryFn: () => apiClientV2.studentGroups.medicationOrders.list({ patient: patientId }),
    refetchInterval: POLLING_INTERVAL,
  });

  // use shared formatDate with time

  return (
    <div>
      {!medicationOrders || medicationOrders.results.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">No medication orders found</p>
      ) : (
        <div className="space-y-4">
          {medicationOrders.results.map((order: MedicationOrder) => (
            <Card key={order.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{order.medication_name}</h3>
                    <p className="text-sm text-muted-foreground">{formatDate(order.created_at)}</p>
                  </div>
                  <Badge variant="outline" className="text-blue-600 border-blue-600">
                    <Pill className="h-3 w-3 mr-1" />
                    {order.dosage}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium">Instructions:</p>
                    <p className="text-sm text-muted-foreground">{order.instructions}</p>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <p className="text-xs text-muted-foreground">
                      Prescribed by: {order.name} ({order.role})
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

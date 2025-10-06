import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, List } from "lucide-react";
import { MedicationOrderForm } from "./medication-orders/medication-order-form";
import { MedicationOrderList } from "./medication-orders/medication-order-list";

interface MedicationOrdersProps {
  patientId: string;
}

/**
 * Main medication orders component
 * 
 * This component has been refactored into smaller, more focused sub-components
 * Includes functionality for creating and viewing medication orders
 */
export default function MedicationOrders({ patientId }: MedicationOrdersProps) {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <Tabs defaultValue="view" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="view">
            <List className="h-4 w-4 mr-2" />
            View Orders
          </TabsTrigger>
          <TabsTrigger value="create">
            <Plus className="h-4 w-4 mr-2" />
            Create Order
          </TabsTrigger>
        </TabsList>

        <TabsContent value="view">
          <MedicationOrderList patientId={patientId} />
        </TabsContent>

        <TabsContent value="create">
          <MedicationOrderForm patientId={patientId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

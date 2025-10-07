import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListChecks, Layers } from "lucide-react";
import { IndividualVitalSignsForm } from "./individual-vital-signs-form";
import { BulkVitalSignsForm } from "./bulk-vital-signs-form";
import type { Patient } from "@/lib/api-client-v2";

interface AddObservationsProps {
  patient: Patient;
}

/**
 * Main component for adding observation records
 * 
 * This component has been refactored into smaller, more focused sub-components following Single Responsibility Principle
 */
export default function AddObservations({ patient }: AddObservationsProps) {
  return (
    <Tabs defaultValue="individual" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="individual">
          <ListChecks className="h-4 w-4 mr-2" />
          Individual Entry
        </TabsTrigger>
        <TabsTrigger value="bulk">
          <Layers className="h-4 w-4 mr-2" />
          Bulk Entry
        </TabsTrigger>
      </TabsList>

      <TabsContent value="individual">
        <IndividualVitalSignsForm patient={patient} />
      </TabsContent>

      <TabsContent value="bulk">
        <BulkVitalSignsForm patient={patient} />
      </TabsContent>
    </Tabs>
  );
}

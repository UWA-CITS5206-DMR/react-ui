import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Plus } from "lucide-react";
import CurrentObservations from "./current-observations";
import AddObservations from "./add-observations";
import type { Patient } from "@/lib/api-client-v2";

interface ObservationsProps {
  patient: Patient;
}

/**
 * Main observations component with tabs for viewing and adding observations
 * 
 * Updated to use the new CurrentObservations component which includes:
 * - Real Django API data fetching
 * - Latest observations display
 * - Historical trends chart
 * - Form to add new observations
 */
export default function Observations({ patient }: ObservationsProps) {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <Tabs defaultValue="current" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="current">
            <Activity className="h-4 w-4 mr-2" />
            Current Observations
          </TabsTrigger>
          <TabsTrigger value="add">
            <Plus className="h-4 w-4 mr-2" />
            Add Observations
          </TabsTrigger>
        </TabsList>
        <TabsContent value="current">
          <CurrentObservations patient={patient} />
        </TabsContent>
        <TabsContent value="add">
          <AddObservations patient={patient} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

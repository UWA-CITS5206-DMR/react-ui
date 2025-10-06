import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CurrentObservationsDisplay from "@/components/current-observations-display";
import AddObservations from "@/components/add-observations";
import type { Patient } from "@/lib/api-client-v2";

interface ObservationsProps {
  patient: Patient;
}

export default function Observations({ patient }: ObservationsProps) {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <Tabs defaultValue="current" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="current">Current Observations</TabsTrigger>
          <TabsTrigger value="add">Add Observations</TabsTrigger>
        </TabsList>
        <TabsContent value="current">
          <CurrentObservationsDisplay patient={patient} />
        </TabsContent>
        <TabsContent value="add">
          <AddObservations patient={patient} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

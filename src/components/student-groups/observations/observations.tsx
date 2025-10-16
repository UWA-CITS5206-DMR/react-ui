import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { POLLING_INTERVAL } from "@/lib/constants";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListChecks, Layers } from "lucide-react";
import { apiClientV2 } from "@/lib/queryClient";
import { LatestObservationsDisplay } from "./latest-observations-display";
import { ObservationChart } from "./observation-chart";
import { IndividualVitalSignsForm } from "./individual-vital-signs-form";
import { BulkVitalSignsForm } from "./bulk-vital-signs-form";
import type { Patient } from "@/lib/api-client-v2";

interface ObservationsProps {
  patient: Patient;
}

/**
 * Main observations component with floating action button
 *
 * Displays current observations by default with a floating button to add new observations.
 * The add dialog includes both individual and bulk entry options.
 */
export default function Observations({ patient }: ObservationsProps) {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  // Fetch all observations for the patient (use shared POLLING_INTERVAL)
  const { data: observationsResponse } = useQuery({
    queryKey: ["/api/student-groups/observations", patient.id],
    queryFn: async () => {
      return await apiClientV2.studentGroups.observations.list({
        patient: patient.id,
      });
    },
    refetchInterval: POLLING_INTERVAL,
  });

  // polling handled by refetchInterval in the query

  const observations = observationsResponse?.results;

  // Extract the latest value for each vital sign type for display
  const latestVitals = observations
    ? {
        bloodPressure: observations.blood_pressures[0]
          ? `${observations.blood_pressures[0].systolic}/${observations.blood_pressures[0].diastolic}`
          : undefined,
        heartRate: observations.heart_rates[0]?.heart_rate,
        temperature: observations.body_temperatures[0]?.temperature,
        respiratoryRate: observations.respiratory_rates[0]?.respiratory_rate,
        oxygenSaturation: observations.oxygen_saturations[0]?.saturation_percentage,
        bloodSugar: observations.blood_sugars[0]
          ? Number(observations.blood_sugars[0].sugar_level)
          : undefined,
        painScore: observations.pain_scores[0]?.score,
      }
    : undefined;

  // Extract arrays for chart
  const allBloodPressures = observations?.blood_pressures || [];
  const allHeartRates = observations?.heart_rates || [];
  const allBodyTemperatures = observations?.body_temperatures || [];
  const allRespiratoryRates = observations?.respiratory_rates || [];
  const allBloodSugars = observations?.blood_sugars || [];
  const allOxygenSaturations = observations?.oxygen_saturations || [];
  const allPainScores = observations?.pain_scores || [];

  const handleOpenAddDialog = () => {
    setAddDialogOpen(true);
  };

  // Close dialog without triggering refetch (user may close manually)
  const handleCloseDialog = () => setAddDialogOpen(false);

  // Called after a successful add operation: invalidate/fetch latest observations but keep the modal open
  const handleAfterAddSuccess = async () => {
    try {
      await queryClient.invalidateQueries({
        queryKey: ["/api/student-groups/observations", patient.id],
      });
    } catch {
      // ignore
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 relative pb-20">
      <div className="space-y-6">
        {/* Latest Observations Display */}
        <LatestObservationsDisplay vitals={latestVitals} />

        {/* Historical Trends Chart */}
        <ObservationChart
          bloodPressures={allBloodPressures}
          heartRates={allHeartRates}
          bodyTemperatures={allBodyTemperatures}
          respiratoryRates={allRespiratoryRates}
          bloodSugars={allBloodSugars}
          oxygenSaturations={allOxygenSaturations}
          painScores={allPainScores}
          onRefresh={async () =>
            await queryClient.invalidateQueries({
              queryKey: ["/api/student-groups/observations", patient.id],
            })
          }
        />
      </div>

      {/* Floating Action Button */}
      <Button
        onClick={handleOpenAddDialog}
        className="fixed bottom-8 right-8 h-14 w-14 rounded-full shadow-lg bg-hospital-blue hover:bg-hospital-blue/90 z-50"
        title="Add new observations"
      >
        <Plus className="h-6 w-6" />
      </Button>

      {/* Add Observations Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Observations</DialogTitle>
            <DialogDescription>
              Fill in the observations information below. Fields marked with * are required.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="individual" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="individual">
                <ListChecks className="h-4 w-4" />
                Individual Entry
              </TabsTrigger>
              <TabsTrigger value="bulk">
                <Layers className="h-4 w-4" />
                Bulk Entry
              </TabsTrigger>
            </TabsList>

            <TabsContent value="individual">
              <IndividualVitalSignsForm patient={patient} onSuccess={handleAfterAddSuccess} />
            </TabsContent>

            <TabsContent value="bulk">
              <BulkVitalSignsForm
                patient={patient}
                onSuccess={handleAfterAddSuccess}
                onCancel={handleCloseDialog}
              />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}

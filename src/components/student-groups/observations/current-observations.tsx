import { useQuery } from "@tanstack/react-query";
import type { Patient } from "@/lib/api-client-v2";
import { apiClientV2 } from "@/lib/queryClient";
import { LatestObservationsDisplay } from "./latest-observations-display";
import { ObservationChart } from "./observation-chart";

interface CurrentObservationsProps {
  patient: Patient;
}

/**
 * Current observations main component
 *
 * This component fetches real observation data from Django backend API
 * and displays:
 * 1. Latest observations summary
 * 2. Historical trends chart
 */
export default function CurrentObservations({ patient }: CurrentObservationsProps) {
  // Fetch all observations for the patient
  // Note: API returns { count, next, previous, results: { blood_pressures: [], heart_rates: [], ... } }
  // The results object contains arrays for each vital sign type
  const { data: observationsResponse } = useQuery({
    queryKey: ["/api/student-groups/observations", patient.id],
    queryFn: async () => {
      return await apiClientV2.studentGroups.observations.list({
        patient_id: patient.id,
        ordering: "-created_at",
      });
    },
  });

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

  // Extract arrays for chart (already in the correct format from API)
  const allBloodPressures = observations?.blood_pressures || [];
  const allHeartRates = observations?.heart_rates || [];
  const allBodyTemperatures = observations?.body_temperatures || [];
  const allRespiratoryRates = observations?.respiratory_rates || [];
  const allBloodSugars = observations?.blood_sugars || [];
  const allOxygenSaturations = observations?.oxygen_saturations || [];
  const allPainScores = observations?.pain_scores || [];

  return (
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
      />
    </div>
  );
}

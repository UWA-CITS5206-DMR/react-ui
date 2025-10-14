import { useState } from "react";
import type { Patient } from "@/lib/api-client-v2";
import { useAuth } from "@/hooks/use-auth";
import { VitalSignInput } from "./vital-sign-input";
import { BloodPressureInput } from "./blood-pressure-input";
import { VITAL_SIGN_CONFIGS } from "@/lib/vital-signs";
import {
  useVitalSignMutation,
  createBloodPressurePayload,
  createHeartRatePayload,
  createBodyTemperaturePayload,
  createRespiratoryRatePayload,
  createOxygenSaturationPayload,
  createBloodSugarPayload,
  createPainScorePayload,
} from "./use-vital-sign-mutation";

interface IndividualVitalSignsFormProps {
  patient: Patient;
}

/**
 * Individual vital signs entry form component
 */
export function IndividualVitalSignsForm({ patient }: IndividualVitalSignsFormProps) {
  const { user } = useAuth();

  const [bloodPressure, setBloodPressure] = useState({ systolic: "", diastolic: "" });
  const [heartRate, setHeartRate] = useState("");
  const [temperature, setTemperature] = useState("");
  const [respiratoryRate, setRespiratoryRate] = useState("");
  const [oxygenSaturation, setOxygenSaturation] = useState("");
  const [bloodSugar, setBloodSugar] = useState("");
  const [painScore, setPainScore] = useState("");

  const bloodPressureMutation = useVitalSignMutation({
    patientId: patient.id,
    user,
    onSuccess: () => setBloodPressure({ systolic: "", diastolic: "" }),
  });

  const heartRateMutation = useVitalSignMutation({
    patientId: patient.id,
    user,
    onSuccess: () => setHeartRate(""),
  });

  const temperatureMutation = useVitalSignMutation({
    patientId: patient.id,
    user,
    onSuccess: () => setTemperature(""),
  });

  const respiratoryRateMutation = useVitalSignMutation({
    patientId: patient.id,
    user,
    onSuccess: () => setRespiratoryRate(""),
  });

  const oxygenSaturationMutation = useVitalSignMutation({
    patientId: patient.id,
    user,
    onSuccess: () => setOxygenSaturation(""),
  });

  const bloodSugarMutation = useVitalSignMutation({
    patientId: patient.id,
    user,
    onSuccess: () => setBloodSugar(""),
  });

  const painScoreMutation = useVitalSignMutation({
    patientId: patient.id,
    user,
    onSuccess: () => setPainScore(""),
  });

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-4">
      <BloodPressureInput
        systolic={bloodPressure.systolic}
        diastolic={bloodPressure.diastolic}
        onSystolicChange={(value) => setBloodPressure({ ...bloodPressure, systolic: value })}
        onDiastolicChange={(value) => setBloodPressure({ ...bloodPressure, diastolic: value })}
        onSubmit={() => {
          const payload = createBloodPressurePayload(
            Number(bloodPressure.systolic),
            Number(bloodPressure.diastolic),
            patient.id,
            user.id
          );
          bloodPressureMutation.mutate(payload);
        }}
        isLoading={bloodPressureMutation.isPending}
      />

      <VitalSignInput
        config={VITAL_SIGN_CONFIGS.heartRate}
        value={heartRate}
        onChange={setHeartRate}
        onSubmit={() => {
          const payload = createHeartRatePayload(Number(heartRate), patient.id, user.id);
          heartRateMutation.mutate(payload);
        }}
        isLoading={heartRateMutation.isPending}
      />

      <VitalSignInput
        config={VITAL_SIGN_CONFIGS.temperature}
        value={temperature}
        onChange={setTemperature}
        onSubmit={() => {
          const payload = createBodyTemperaturePayload(temperature, patient.id, user.id);
          temperatureMutation.mutate(payload);
        }}
        isLoading={temperatureMutation.isPending}
      />

      <VitalSignInput
        config={VITAL_SIGN_CONFIGS.respiratoryRate}
        value={respiratoryRate}
        onChange={setRespiratoryRate}
        onSubmit={() => {
          const payload = createRespiratoryRatePayload(
            Number(respiratoryRate),
            patient.id,
            user.id
          );
          respiratoryRateMutation.mutate(payload);
        }}
        isLoading={respiratoryRateMutation.isPending}
      />

      <VitalSignInput
        config={VITAL_SIGN_CONFIGS.oxygenSaturation}
        value={oxygenSaturation}
        onChange={setOxygenSaturation}
        onSubmit={() => {
          const payload = createOxygenSaturationPayload(
            Number(oxygenSaturation),
            patient.id,
            user.id
          );
          oxygenSaturationMutation.mutate(payload);
        }}
        isLoading={oxygenSaturationMutation.isPending}
      />

      <VitalSignInput
        config={VITAL_SIGN_CONFIGS.bloodSugar}
        value={bloodSugar}
        onChange={setBloodSugar}
        onSubmit={() => {
          const payload = createBloodSugarPayload(bloodSugar, patient.id, user.id);
          bloodSugarMutation.mutate(payload);
        }}
        isLoading={bloodSugarMutation.isPending}
      />

      <VitalSignInput
        config={VITAL_SIGN_CONFIGS.painScore}
        value={painScore}
        onChange={setPainScore}
        onSubmit={() => {
          const payload = createPainScorePayload(Number(painScore), patient.id, user.id);
          painScoreMutation.mutate(payload);
        }}
        isLoading={painScoreMutation.isPending}
      />
    </div>
  );
}

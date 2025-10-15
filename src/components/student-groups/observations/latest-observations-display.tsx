import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { VITAL_SIGN_CONFIGS, BLOOD_PRESSURE, formatVitalSign } from "@/lib/vital-signs";

interface VitalSigns {
  bloodPressure?: string;
  heartRate?: number;
  temperature?: string;
  respiratoryRate?: number;
  oxygenSaturation?: number;
  bloodSugar?: number;
  painScore?: number;
}

interface LatestObservationsDisplayProps {
  vitals?: VitalSigns;
}

/**
 * Latest observations display component
 * Displays latest vital signs using centralized configuration
 */
export function LatestObservationsDisplay({ vitals }: LatestObservationsDisplayProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Latest Observations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <Label className="text-sm text-gray-600">{BLOOD_PRESSURE.label}</Label>
            <p className="font-medium">
              {vitals?.bloodPressure ? `${vitals.bloodPressure} ${BLOOD_PRESSURE.unit}` : "N/A"}
            </p>
          </div>
          <div className="space-y-1">
            <Label className="text-sm text-gray-600">{VITAL_SIGN_CONFIGS.heartRate.label}</Label>
            <p className="font-medium">{formatVitalSign("heartRate", vitals?.heartRate)}</p>
          </div>
          <div className="space-y-1">
            <Label className="text-sm text-gray-600">{VITAL_SIGN_CONFIGS.temperature.label}</Label>
            <p className="font-medium">{formatVitalSign("temperature", vitals?.temperature)}</p>
          </div>
          <div className="space-y-1">
            <Label className="text-sm text-gray-600">
              {VITAL_SIGN_CONFIGS.respiratoryRate.label}
            </Label>
            <p className="font-medium">
              {formatVitalSign("respiratoryRate", vitals?.respiratoryRate)}
            </p>
          </div>
          <div className="space-y-1">
            <Label className="text-sm text-gray-600">
              {VITAL_SIGN_CONFIGS.oxygenSaturation.label}
            </Label>
            <p className="font-medium">
              {formatVitalSign("oxygenSaturation", vitals?.oxygenSaturation)}
            </p>
          </div>
          <div className="space-y-1">
            <Label className="text-sm text-gray-600">{VITAL_SIGN_CONFIGS.bloodSugar.label}</Label>
            <p className="font-medium">{formatVitalSign("bloodSugar", vitals?.bloodSugar)}</p>
          </div>
          <div className="space-y-1">
            <Label className="text-sm text-gray-600">{VITAL_SIGN_CONFIGS.painScore.label}</Label>
            <p className="font-medium">
              {vitals?.painScore !== undefined ? vitals.painScore : "N/A"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

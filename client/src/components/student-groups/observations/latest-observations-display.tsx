import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

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
 */
export function LatestObservationsDisplay({ vitals }: LatestObservationsDisplayProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Latest Observations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <Label className="text-sm text-gray-600">Blood Pressure</Label>
            <p className="font-medium">{vitals?.bloodPressure || "N/A"}</p>
          </div>
          <div className="space-y-1">
            <Label className="text-sm text-gray-600">Heart Rate</Label>
            <p className="font-medium">{vitals?.heartRate || "N/A"} bpm</p>
          </div>
          <div className="space-y-1">
            <Label className="text-sm text-gray-600">Temperature</Label>
            <p className="font-medium">{vitals?.temperature || "N/A"}</p>
          </div>
          <div className="space-y-1">
            <Label className="text-sm text-gray-600">Respiratory Rate</Label>
            <p className="font-medium">{vitals?.respiratoryRate || "N/A"} /min</p>
          </div>
          <div className="space-y-1">
            <Label className="text-sm text-gray-600">O2 Saturation</Label>
            <p className="font-medium">{vitals?.oxygenSaturation || "N/A"}%</p>
          </div>
          <div className="space-y-1">
            <Label className="text-sm text-gray-600">Blood Sugar</Label>
            <p className="font-medium">{vitals?.bloodSugar || "N/A"} mg/dL</p>
          </div>
          <div className="space-y-1">
            <Label className="text-sm text-gray-600">Pain Score</Label>
            <p className="font-medium">{vitals?.painScore || "N/A"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

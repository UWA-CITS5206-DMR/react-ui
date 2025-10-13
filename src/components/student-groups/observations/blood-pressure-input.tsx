import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Activity } from "lucide-react";
import { BLOOD_PRESSURE_CONFIG } from "./vital-sign-config";

interface BloodPressureInputProps {
  systolic: string;
  diastolic: string;
  onSystolicChange: (value: string) => void;
  onDiastolicChange: (value: string) => void;
  onSubmit: () => void;
  isLoading?: boolean;
}

/**
 * Blood pressure input component (requires two fields)
 */
export function BloodPressureInput({
  systolic,
  diastolic,
  onSystolicChange,
  onDiastolicChange,
  onSubmit,
  isLoading = false,
}: BloodPressureInputProps) {
  const isValid = systolic && diastolic;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Activity className="h-4 w-4" />
          Blood Pressure
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <Label htmlFor="bp-systolic">
              {BLOOD_PRESSURE_CONFIG.systolic.label} ({BLOOD_PRESSURE_CONFIG.systolic.unit})
            </Label>
            <Input
              id="bp-systolic"
              type={BLOOD_PRESSURE_CONFIG.systolic.type}
              placeholder={BLOOD_PRESSURE_CONFIG.systolic.placeholder}
              value={systolic}
              onChange={(e) => onSystolicChange(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="bp-diastolic">
              {BLOOD_PRESSURE_CONFIG.diastolic.label} ({BLOOD_PRESSURE_CONFIG.diastolic.unit})
            </Label>
            <Input
              id="bp-diastolic"
              type={BLOOD_PRESSURE_CONFIG.diastolic.type}
              placeholder={BLOOD_PRESSURE_CONFIG.diastolic.placeholder}
              value={diastolic}
              onChange={(e) => onDiastolicChange(e.target.value)}
            />
          </div>
          <Button onClick={onSubmit} disabled={!isValid || isLoading}>
            {isLoading ? "Recording..." : "Record"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

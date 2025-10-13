import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Activity } from "lucide-react";
import type { VitalSignConfig } from "./vital-sign-config";

interface VitalSignInputProps {
  config: VitalSignConfig;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading?: boolean;
}

/**
 * Single vital sign input component
 */
export function VitalSignInput({
  config,
  value,
  onChange,
  onSubmit,
  isLoading = false,
}: VitalSignInputProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Activity className="h-4 w-4" />
          {config.label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <div>
            <Label htmlFor={config.key}>
              {config.label} {config.unit && `(${config.unit})`}
            </Label>
            <Input
              id={config.key}
              type={config.type}
              placeholder={config.placeholder}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              step={config.step}
              min={config.min}
              max={config.max}
            />
          </div>
          <Button onClick={onSubmit} disabled={!value || isLoading}>
            {isLoading ? "Recording..." : "Record"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from "lucide-react";

export interface MedicationFormData {
  medication: string;
  dosage: string;
  instructions: string;
}

interface MedicationOrderCardProps {
  index: number;
  medication: MedicationFormData;
  canRemove: boolean;
  onUpdate: (field: keyof MedicationFormData, value: string) => void;
  onRemove: () => void;
}

/**
 * Single medication order input card component
 */
export function MedicationOrderCard({
  index,
  medication,
  canRemove,
  onUpdate,
  onRemove,
}: MedicationOrderCardProps) {
  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-lg">Medication {index + 1}</CardTitle>
        {canRemove && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRemove}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor={`medication-${index}`} className="text-sm font-medium">
              Medication Name *
            </Label>
            <Input
              id={`medication-${index}`}
              value={medication.medication}
              onChange={(e) => onUpdate("medication", e.target.value)}
              placeholder="e.g., Paracetamol, Ibuprofen"
              required
            />
          </div>
          <div>
            <Label htmlFor={`dosage-${index}`} className="text-sm font-medium">
              Dosage *
            </Label>
            <Input
              id={`dosage-${index}`}
              value={medication.dosage}
              onChange={(e) => onUpdate("dosage", e.target.value)}
              placeholder="e.g., 500mg, 10mg/kg"
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor={`instructions-${index}`} className="text-sm font-medium">
            Instructions *
          </Label>
          <Textarea
            id={`instructions-${index}`}
            value={medication.instructions}
            onChange={(e) => onUpdate("instructions", e.target.value)}
            placeholder="e.g., Take twice daily (BD) orally (PO) for 7 days. For pain relief."
            rows={3}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Include frequency, route, duration, and indication in your instructions
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

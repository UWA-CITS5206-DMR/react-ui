import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SignOffSectionProps {
  name: string;
  role: string;
  onNameChange: (name: string) => void;
  onRoleChange: (role: string) => void;
  idPrefix?: string;
}

/**
 * Sign-off information component - Used for investigation request forms
 */
export function SignOffSection({
  name,
  role,
  onNameChange,
  onRoleChange,
  idPrefix = "signoff",
}: SignOffSectionProps) {
  return (
    <Card className="bg-muted/50">
      <CardHeader>
        <CardTitle className="text-sm">Sign-off Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`${idPrefix}-name`}>Name *</Label>
            <Input
              id={`${idPrefix}-name`}
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="Enter your full name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${idPrefix}-role`}>Role *</Label>
            <Input
              id={`${idPrefix}-role`}
              value={role}
              onChange={(e) => onRoleChange(e.target.value)}
              placeholder="e.g., Medical Student"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface AccessRule {
  id: string;
  groupId: string;
  groupName: string;
  canView: boolean;
  canEdit: boolean;
  canUpload: boolean;
  lastAccess: string;
}

interface AccessControlProps {
  patientId: string;
}

export const AccessControl: React.FC<AccessControlProps> = ({ patientId }) => {
  const [accessRules, setAccessRules] = useState<AccessRule[]>([]);

  useEffect(() => {
    fetchAccessRules();
  }, [patientId]);

  const fetchAccessRules = async () => {
    try {
      const response = await fetch(`/api/patients/${patientId}/access/`);
      const data = await response.json();
      setAccessRules(data);
    } catch (error) {
      console.error('Error fetching access rules:', error);
    }
  };

  const updateAccessRule = async (ruleId: string, updates: Partial<AccessRule>) => {
    try {
      const response = await fetch(`/api/patients/${patientId}/access/${ruleId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        fetchAccessRules(); // Refresh the list
      }
    } catch (error) {
      console.error('Error updating access rule:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Access Control</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {accessRules.map((rule) => (
            <div
              key={rule.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-medium">{rule.groupName}</span>
                  <Badge variant={rule.canEdit ? 'default' : 'outline'}>
                    {rule.canEdit ? 'Editor' : 'Viewer'}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  Last accessed: {rule.lastAccess ? new Date(rule.lastAccess).toLocaleDateString() : 'Never'}
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={rule.canView}
                    onCheckedChange={(checked) => 
                      updateAccessRule(rule.id, { canView: checked })
                    }
                  />
                  <Label>View</Label>
                </div>
                
                <div className="flex items-center gap-2">
                  <Switch
                    checked={rule.canEdit}
                    onCheckedChange={(checked) => 
                      updateAccessRule(rule.id, { canEdit: checked })
                    }
                  />
                  <Label>Edit</Label>
                </div>
                
                <div className="flex items-center gap-2">
                  <Switch
                    checked={rule.canUpload}
                    onCheckedChange={(checked) => 
                      updateAccessRule(rule.id, { canUpload: checked })
                    }
                  />
                  <Label>Upload</Label>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {accessRules.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No access rules configured.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
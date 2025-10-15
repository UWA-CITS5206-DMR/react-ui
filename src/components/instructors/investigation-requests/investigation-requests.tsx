import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { BloodTestRequestList } from "./blood-test-request-list";
import { ImagingRequestList } from "./imaging-request-list";

interface InstructorInvestigationRequestsProps {
  patientId?: number;
}

/**
 * Main instructor investigation requests component for approving requests
 *
 * Shows blood test and imaging requests with approval functionality.
 * Includes toggle to show completed requests.
 */
export default function InstructorInvestigationRequests({
  patientId,
}: InstructorInvestigationRequestsProps) {
  const [showCompleted, setShowCompleted] = useState(false);

  return (
    <div className="h-full flex flex-col">
      {/* Show Completed Toggle */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Switch id="show-completed" checked={showCompleted} onCheckedChange={setShowCompleted} />
          <Label htmlFor="show-completed" className="text-sm font-medium">
            Show Completed Requests
          </Label>
        </div>
      </div>

      <Tabs defaultValue="blood" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="blood">Blood Tests</TabsTrigger>
          <TabsTrigger value="imaging">Imaging Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="blood" className="flex-1 overflow-hidden mt-4">
          <BloodTestRequestList patientId={patientId} showCompleted={showCompleted} />
        </TabsContent>

        <TabsContent value="imaging" className="flex-1 overflow-hidden mt-4">
          <ImagingRequestList patientId={patientId} showCompleted={showCompleted} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

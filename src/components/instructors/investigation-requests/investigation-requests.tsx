import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { apiClientV2 } from "@/lib/queryClient";
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
  const [showCompleted, setShowCompleted] = useState(() => {
    // Initialize from localStorage
    const saved = localStorage.getItem("instructor-investigation-show-completed");
    return saved ? JSON.parse(saved) : false;
  });

  // Save to localStorage when showCompleted changes
  useEffect(() => {
    localStorage.setItem("instructor-investigation-show-completed", JSON.stringify(showCompleted));
  }, [showCompleted]);

  // Fetch blood test requests stats for this patient
  const { data: bloodTestsStats } = useQuery({
    queryKey: ["instructors", "blood-test-requests", "stats", patientId],
    queryFn: () => apiClientV2.instructors.bloodTestRequests.stats({ patient: patientId }),
  });

  // Fetch imaging requests stats for this patient
  const { data: imagingRequestsStats } = useQuery({
    queryKey: ["instructors", "imaging-requests", "stats", patientId],
    queryFn: () => apiClientV2.instructors.imagingRequests.stats({ patient: patientId }),
  });

  const bloodTestsTotal = showCompleted
    ? (bloodTestsStats as any)?.total || 0
    : (bloodTestsStats as any)?.pending || 0;
  const imagingRequestsTotal = showCompleted
    ? (imagingRequestsStats as any)?.total || 0
    : (imagingRequestsStats as any)?.pending || 0;

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
          <TabsTrigger value="blood">Blood Tests ({bloodTestsTotal})</TabsTrigger>
          <TabsTrigger value="imaging">Imaging Requests ({imagingRequestsTotal})</TabsTrigger>
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

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FlaskConical, Scan } from "lucide-react";
import { apiClientV2 } from "@/lib/queryClient";
import { formatUserDisplay } from "@/lib/utils";
import { BloodTestRequestList } from "./blood-test-request-list";
import { ImagingRequestList } from "./imaging-request-list";
import PageLayout from "@/components/layout/page-layout";

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

  const [selectedUser, setSelectedUser] = useState<string>("all");

  // Save to localStorage when showCompleted changes
  useEffect(() => {
    localStorage.setItem("instructor-investigation-show-completed", JSON.stringify(showCompleted));
  }, [showCompleted]);

  // Fetch student groups
  const { data: studentGroups } = useQuery({
    queryKey: ["instructors", "student-groups"],
    queryFn: () => apiClientV2.instructors.studentGroups.list(),
  });

  // Fetch blood test requests stats for this patient
  const { data: bloodTestsStats } = useQuery({
    queryKey: ["instructors", "blood-test-requests", "stats", patientId, selectedUser],
    queryFn: () =>
      apiClientV2.instructors.bloodTestRequests.stats({
        patient: patientId,
        ...(selectedUser !== "all" && { user: parseInt(selectedUser) }),
      }),
  });

  // Fetch imaging requests stats for this patient
  const { data: imagingRequestsStats } = useQuery({
    queryKey: ["instructors", "imaging-requests", "stats", patientId, selectedUser],
    queryFn: () =>
      apiClientV2.instructors.imagingRequests.stats({
        patient: patientId,
        ...(selectedUser !== "all" && { user: parseInt(selectedUser) }),
      }),
  });

  const bloodTestsTotal = showCompleted
    ? (bloodTestsStats as any)?.total || 0
    : (bloodTestsStats as any)?.pending || 0;
  const imagingRequestsTotal = showCompleted
    ? (imagingRequestsStats as any)?.total || 0
    : (imagingRequestsStats as any)?.pending || 0;

  return (
    <PageLayout
      title="Investigation Requests"
      description="Approve blood test and imaging requests for patients."
    >
      <div className="h-full flex flex-col">
        {/* Show Completed Toggle and User Filter */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="show-completed"
              checked={showCompleted}
              onCheckedChange={setShowCompleted}
            />
            <Label htmlFor="show-completed" className="text-sm font-medium">
              Show Completed Requests
            </Label>
          </div>
          <Select value={selectedUser} onValueChange={setSelectedUser}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All groups" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All groups</SelectItem>
              {studentGroups?.map((group) => (
                <SelectItem key={group.id} value={group.id.toString()}>
                  {formatUserDisplay(group)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="blood" className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="blood">
              <FlaskConical className="h-4 w-4 mr-1" />
              Blood Tests ({bloodTestsTotal})
            </TabsTrigger>
            <TabsTrigger value="imaging">
              <Scan className="h-4 w-4 mr-1" />
              Imaging Requests ({imagingRequestsTotal})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="blood" className="flex-1 overflow-hidden mt-4">
            <BloodTestRequestList
              patientId={patientId}
              showCompleted={showCompleted}
              user={selectedUser}
            />
          </TabsContent>

          <TabsContent value="imaging" className="flex-1 overflow-hidden mt-4">
            <ImagingRequestList
              patientId={patientId}
              showCompleted={showCompleted}
              user={selectedUser}
            />
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}

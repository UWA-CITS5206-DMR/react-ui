import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FlaskConical, Scan, List, Plus } from "lucide-react";
import { BloodTestRequestForm } from "./blood-test-request-form";
import { BloodTestRequestList } from "./blood-test-request-list";
import { ImagingRequestForm } from "./imaging-request-form";
import { ImagingRequestList } from "./imaging-request-list";

interface InvestigationRequestsProps {
  patientId: string;
}

/**
 * Main investigation requests component
 *
 * This component has been refactored into smaller, more focused sub-components
 * Includes blood test and imaging request types
 */
export default function InvestigationRequests({ patientId }: InvestigationRequestsProps) {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <Tabs defaultValue="blood-tests" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="blood-tests">
            <FlaskConical className="h-4 w-4 mr-2" />
            Blood Tests
          </TabsTrigger>
          <TabsTrigger value="imaging">
            <Scan className="h-4 w-4 mr-2" />
            Imaging
          </TabsTrigger>
        </TabsList>

        <TabsContent value="blood-tests">
          <Tabs defaultValue="view" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="view">
                <List className="h-4 w-4 mr-2" />
                View Requests
              </TabsTrigger>
              <TabsTrigger value="create">
                <Plus className="h-4 w-4 mr-2" />
                Create Request
              </TabsTrigger>
            </TabsList>

            <TabsContent value="view">
              <BloodTestRequestList patientId={patientId} />
            </TabsContent>

            <TabsContent value="create">
              <BloodTestRequestForm patientId={patientId} />
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="imaging">
          <Tabs defaultValue="view" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="view">
                <List className="h-4 w-4 mr-2" />
                View Requests
              </TabsTrigger>
              <TabsTrigger value="create">
                <Plus className="h-4 w-4 mr-2" />
                Create Request
              </TabsTrigger>
            </TabsList>

            <TabsContent value="view">
              <ImagingRequestList patientId={patientId} />
            </TabsContent>

            <TabsContent value="create">
              <ImagingRequestForm patientId={patientId} />
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  );
}

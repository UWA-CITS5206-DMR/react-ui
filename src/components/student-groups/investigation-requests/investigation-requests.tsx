import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FlaskConical, Scan, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { BloodTestRequestForm } from "./blood-test-request-form";
import { BloodTestRequestList } from "./blood-test-request-list";
import { ImagingRequestForm } from "./imaging-request-form";
import { ImagingRequestList } from "./imaging-request-list";

interface InvestigationRequestsProps {
  patientId: string;
}

/**
 * Main investigation requests component with floating action button
 *
 * The floating button activates based on the currently selected tab (blood tests or imaging).
 * Shows the appropriate request form in a modal dialog.
 */
export default function InvestigationRequests({ patientId }: InvestigationRequestsProps) {
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"blood-tests" | "imaging">("blood-tests");

  const handleOpenRequestDialog = () => {
    setRequestDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setRequestDialogOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as "blood-tests" | "imaging")}
        className="w-full"
      >
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
          <BloodTestRequestList patientId={patientId} />
        </TabsContent>

        <TabsContent value="imaging">
          <ImagingRequestList patientId={patientId} />
        </TabsContent>
      </Tabs>

      {/* Floating Action Button */}
      <Button
        onClick={handleOpenRequestDialog}
        className="fixed bottom-8 right-8 h-14 w-14 rounded-full shadow-lg bg-hospital-blue hover:bg-hospital-blue/90 z-50"
        title={activeTab === "blood-tests" ? "Create blood test request" : "Create imaging request"}
      >
        <Plus className="h-6 w-6" />
      </Button>

      {/* Request Dialog - Shows appropriate form based on active tab */}
      <Dialog open={requestDialogOpen} onOpenChange={setRequestDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {activeTab === "blood-tests" ? "Create Blood Test Request" : "Create Imaging Request"}
            </DialogTitle>
            <DialogDescription>
              Fill in the investigation request information below. Fields marked with * are
              required.
            </DialogDescription>
          </DialogHeader>

          {activeTab === "blood-tests" ? (
            <BloodTestRequestForm
              patientId={patientId}
              onSuccess={handleCloseDialog}
              onCancel={handleCloseDialog}
            />
          ) : (
            <ImagingRequestForm
              patientId={patientId}
              onSuccess={handleCloseDialog}
              onCancel={handleCloseDialog}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

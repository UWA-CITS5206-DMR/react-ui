import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListChecks, Layers } from "lucide-react";
import CurrentObservations from "./current-observations";
import { IndividualVitalSignsForm } from "./individual-vital-signs-form";
import { BulkVitalSignsForm } from "./bulk-vital-signs-form";
import type { Patient } from "@/lib/api-client-v2";

interface ObservationsProps {
  patient: Patient;
}

/**
 * Main observations component with floating action button
 *
 * Displays current observations by default with a floating button to add new observations.
 * The add dialog includes both individual and bulk entry options.
 */
export default function Observations({ patient }: ObservationsProps) {
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const handleOpenAddDialog = () => {
    setAddDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setAddDialogOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 relative pb-20">
      {/* Current Observations Display */}
      <CurrentObservations patient={patient} />

      {/* Floating Action Button */}
      <Button
        onClick={handleOpenAddDialog}
        className="fixed bottom-8 right-8 h-14 w-14 rounded-full shadow-lg bg-hospital-blue hover:bg-hospital-blue/90 z-50"
        title="Add new observations"
      >
        <Plus className="h-6 w-6" />
      </Button>

      {/* Add Observations Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Observations</DialogTitle>
            <DialogDescription>
              Fill in the observations information below. Fields marked with * are required.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="individual" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="individual">
                <ListChecks className="h-4 w-4 mr-2" />
                Individual Entry
              </TabsTrigger>
              <TabsTrigger value="bulk">
                <Layers className="h-4 w-4 mr-2" />
                Bulk Entry
              </TabsTrigger>
            </TabsList>

            <TabsContent value="individual">
              <IndividualVitalSignsForm patient={patient} onSuccess={handleCloseDialog} />
            </TabsContent>

            <TabsContent value="bulk">
              <BulkVitalSignsForm
                patient={patient}
                onSuccess={handleCloseDialog}
                onCancel={handleCloseDialog}
              />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}

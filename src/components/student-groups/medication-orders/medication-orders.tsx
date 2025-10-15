import { useState } from "react";
import { Plus, Pill } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { MedicationOrderForm } from "./medication-order-form";
import { MedicationOrderList } from "./medication-order-list";
import PageLayout from "@/components/layout/page-layout";

interface MedicationOrdersProps {
  patientId: string;
}

/**
 * Main medication orders component with floating action button
 *
 * Displays medication order list by default with a floating button to create new orders.
 */
export default function MedicationOrders({ patientId }: MedicationOrdersProps) {
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);

  const handleOpenOrderDialog = () => {
    setOrderDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setOrderDialogOpen(false);
  };

  return (
    <PageLayout
      title="Medication Orders"
      description="View and manage medication orders for this patient. Use the + button to prescribe new medications."
    >
      {/* Medication Order List */}
      <MedicationOrderList patientId={patientId} />

      {/* Floating Action Button */}
      <Button
        onClick={handleOpenOrderDialog}
        className="fixed bottom-8 right-8 h-14 w-14 rounded-full shadow-lg bg-hospital-blue hover:bg-hospital-blue/90 z-50"
        title="Create medication order"
      >
        <Plus className="h-6 w-6" />
      </Button>

      {/* Create Order Dialog */}
      <Dialog open={orderDialogOpen} onOpenChange={setOrderDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Medication Order</DialogTitle>
            <DialogDescription>
              Fill in the medication order information below. Fields marked with * are required.
            </DialogDescription>
          </DialogHeader>

          <MedicationOrderForm patientId={patientId} onSuccess={handleCloseDialog} />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button
              type="submit"
              form="medication-order-form"
              className="bg-hospital-blue hover:bg-hospital-blue/90"
            >
              <Pill className="h-4 w-4 mr-2" />
              Submit Medication Orders
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}

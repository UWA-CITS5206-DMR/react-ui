import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import VitalsPaperChart from "@/components/vitals-paper-chart";
import type { Patient } from "@shared/schema";

interface ObservationChartProps {
  patient: Patient;
}

export default function ObservationChart({ patient }: ObservationChartProps) {
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [nextUpdate, setNextUpdate] = useState<Date>(
    new Date(Date.now() + 4 * 60 * 60 * 1000)
  );

  // Auto-update countdown (mock - doesn't actually fetch new data)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      if (now >= nextUpdate) {
        setLastUpdate(new Date());
        setNextUpdate(new Date(Date.now() + 4 * 60 * 60 * 1000));
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [nextUpdate]);

  const handleManualRefresh = () => {
    setLastUpdate(new Date());
    setNextUpdate(new Date(Date.now() + 4 * 60 * 60 * 1000));
  };

  const getTimeUntilNextUpdate = () => {
    const now = new Date();
    const diff = nextUpdate.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Observation Chart
          </h2>
          <p className="text-sm text-gray-500">
            Updates automatically every 4 hours
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">
            <div>Last updated: {lastUpdate.toLocaleString()}</div>
            <div>Next update: {getTimeUntilNextUpdate()}</div>
          </div>
          <Button variant="outline" size="sm" onClick={handleManualRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <VitalsPaperChart />
      </div>

      <div className="text-xs text-gray-500 text-center">
        Chart automatically refreshes every 4 hours. Use the refresh button for
        manual updates.
      </div>
    </div>
  );
}

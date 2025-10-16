import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import type {
  BloodPressureRecord,
  HeartRateRecord,
  BodyTemperatureRecord,
  RespiratoryRateRecord,
  BloodSugarRecord,
  OxygenSaturationRecord,
  PainScoreRecord,
} from "@/lib/api-client-v2";
import {
  VITAL_SIGN_CONFIGS,
  BLOOD_PRESSURE,
  BLOOD_PRESSURE_CONFIG,
  formatVitalSignForChart,
} from "@/lib/vital-signs";

interface ObservationChartProps {
  bloodPressures?: BloodPressureRecord[];
  heartRates?: HeartRateRecord[];
  bodyTemperatures?: BodyTemperatureRecord[];
  respiratoryRates?: RespiratoryRateRecord[];
  bloodSugars?: BloodSugarRecord[];
  oxygenSaturations?: OxygenSaturationRecord[];
  painScores?: PainScoreRecord[];
  onRefresh?: () => Promise<unknown> | void;
}

/**
 * Observation Chart Component
 *
 * Displays vital signs data in interactive charts using Recharts library.
 * Shows historical trends for different observation types.
 */
export function ObservationChart({
  bloodPressures = [],
  heartRates = [],
  bodyTemperatures = [],
  respiratoryRates = [],
  bloodSugars = [],
  oxygenSaturations = [],
  painScores = [],
  onRefresh,
}: ObservationChartProps) {
  // Controlled tab state: remember selected tab in localStorage so it persists
  const [activeTab, setActiveTab] = useState<string | undefined>(() => {
    try {
      return localStorage.getItem("observation-chart-active-tab") || undefined;
    } catch {
      return undefined;
    }
  });

  // Local state to force re-render when user hits refresh (useful if props are updated but parent doesn't rerender)
  const [, setTick] = useState(0);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      if (activeTab) localStorage.setItem("observation-chart-active-tab", activeTab);
    } catch {
      // ignore storage errors
    }
  }, [activeTab]);

  async function handleRefresh() {
    // show loading animation for a minimum duration and await parent refresh if provided
    const MIN_MS = 800;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setLoading(true);
    const start = Date.now();

    // trigger parent refresh if provided
    try {
      if (typeof onRefresh === "function") {
        await onRefresh();
      }
    } catch (err) {
      // swallow errors here — parent can surface them via toasts
      // eslint-disable-next-line no-console
      console.error("ObservationChart refresh error:", err);
    }

    // force a local re-render; if parent passes new props this will also reflect updated data
    setTick((t: number) => t + 1);

    const elapsed = Date.now() - start;
    const remaining = Math.max(0, MIN_MS - elapsed);
    if (remaining > 0) {
      timerRef.current = setTimeout(() => {
        setLoading(false);
        timerRef.current = null;
      }, remaining);
    } else {
      setLoading(false);
    }
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);
  // Generic transformer for records with created_at timestamp
  function transformByCreatedAt<T, R extends { time: string; fullTime: string }>(
    records: T[] | undefined,
    mapFn: (rec: T) => Omit<R, "time" | "fullTime">
  ): R[] {
    if (!records || records.length === 0) return [];
    return records
      .slice()
      .sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      .map((rec: any) => {
        const base = mapFn(rec as T) as any;
        const created = new Date(rec.created_at);
        return {
          ...base,
          time: format(created, "MMM dd HH:mm"),
          fullTime: format(created, "MMM dd, yyyy HH:mm"),
        } as R;
      });
  }

  const bpData = transformByCreatedAt(bloodPressures, (bp) => ({
    systolic: (bp as BloodPressureRecord).systolic,
    diastolic: (bp as BloodPressureRecord).diastolic,
  }));

  const hrData = transformByCreatedAt(heartRates, (hr) => ({
    heartRate: (hr as HeartRateRecord).heart_rate,
  }));

  const tempData = transformByCreatedAt(bodyTemperatures, (temp) => ({
    temperature: parseFloat((temp as BodyTemperatureRecord).temperature),
  }));

  const rrData = transformByCreatedAt(respiratoryRates, (rr) => ({
    respiratoryRate: (rr as RespiratoryRateRecord).respiratory_rate,
  }));

  const bsData = transformByCreatedAt(bloodSugars, (bs) => ({
    bloodSugar: parseFloat((bs as BloodSugarRecord).sugar_level),
  }));

  const o2Data = transformByCreatedAt(oxygenSaturations, (o2) => ({
    oxygenSaturation: (o2 as OxygenSaturationRecord).saturation_percentage,
  }));

  const painData = transformByCreatedAt(painScores, (pain) => ({
    painScore: (pain as PainScoreRecord).score,
  }));

  const hasData =
    bpData.length > 0 ||
    hrData.length > 0 ||
    tempData.length > 0 ||
    rrData.length > 0 ||
    bsData.length > 0 ||
    o2Data.length > 0 ||
    painData.length > 0;

  if (!hasData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Observations Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            No observation data available to display charts.
          </div>
        </CardContent>
      </Card>
    );
  }
  // compute available tabs in preferred order
  const availableTabs: string[] = [];
  if (bpData.length > 0) availableTabs.push("blood-pressure");
  if (hrData.length > 0) availableTabs.push("heart-rate");
  if (tempData.length > 0) availableTabs.push("temperature");
  if (rrData.length > 0) availableTabs.push("respiratory");
  if (bsData.length > 0) availableTabs.push("blood-sugar");
  if (o2Data.length > 0) availableTabs.push("oxygen");
  if (painData.length > 0) availableTabs.push("pain");

  const defaultTab = availableTabs[0] ?? "blood-pressure";
  const currentTab = activeTab ?? defaultTab;

  return (
    <Card>
      <CardHeader>
        <div className="w-full flex items-start justify-between">
          <div>
            <CardTitle>Observations Chart</CardTitle>
            <p className="text-sm text-gray-600">Historical trends of vital signs over time</p>
          </div>
          <div className="ml-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              title="Refresh charts"
              className="h-6 w-6 p-0"
              disabled={loading}
              aria-pressed={loading}
              aria-busy={loading}
            >
              <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative">
        {/* no overlay; button indicates loading via spin + disabled */}
        <Tabs value={currentTab} onValueChange={(v) => setActiveTab(v)} className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
            {bpData.length > 0 && (
              <TabsTrigger value="blood-pressure">{BLOOD_PRESSURE.abbreviation}</TabsTrigger>
            )}
            {hrData.length > 0 && (
              <TabsTrigger value="heart-rate">
                {VITAL_SIGN_CONFIGS.heartRate.abbreviation}
              </TabsTrigger>
            )}
            {tempData.length > 0 && (
              <TabsTrigger value="temperature">
                {VITAL_SIGN_CONFIGS.temperature.abbreviation}
              </TabsTrigger>
            )}
            {rrData.length > 0 && (
              <TabsTrigger value="respiratory">
                {VITAL_SIGN_CONFIGS.respiratoryRate.abbreviation}
              </TabsTrigger>
            )}
            {bsData.length > 0 && (
              <TabsTrigger value="blood-sugar">
                {VITAL_SIGN_CONFIGS.bloodSugar.abbreviation}
              </TabsTrigger>
            )}
            {o2Data.length > 0 && (
              <TabsTrigger value="oxygen">
                {VITAL_SIGN_CONFIGS.oxygenSaturation.abbreviation}
              </TabsTrigger>
            )}
            {painData.length > 0 && (
              <TabsTrigger value="pain">{VITAL_SIGN_CONFIGS.painScore.abbreviation}</TabsTrigger>
            )}
          </TabsList>

          {/* Blood Pressure Chart */}
          {bpData.length > 0 && (
            <TabsContent value="blood-pressure">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={bpData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" angle={-45} textAnchor="end" height={80} />
                    <YAxis domain={BLOOD_PRESSURE.chartDomain} />
                    <Tooltip
                      labelFormatter={(value, payload) => {
                        if (payload && payload.length > 0) {
                          return `Time: ${payload[0].payload.fullTime}`;
                        }
                        return `Time: ${value}`;
                      }}
                      formatter={(value: number, name: string) => [
                        `${value} ${BLOOD_PRESSURE.unit}`,
                        name === "systolic"
                          ? BLOOD_PRESSURE_CONFIG.systolic.label
                          : BLOOD_PRESSURE_CONFIG.diastolic.label,
                      ]}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="systolic"
                      stroke={BLOOD_PRESSURE_CONFIG.systolic.chartColor}
                      strokeWidth={2}
                      name={BLOOD_PRESSURE_CONFIG.systolic.label}
                    />
                    <Line
                      type="monotone"
                      dataKey="diastolic"
                      stroke={BLOOD_PRESSURE_CONFIG.diastolic.chartColor}
                      strokeWidth={2}
                      name={BLOOD_PRESSURE_CONFIG.diastolic.label}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          )}

          {/* Heart Rate Chart */}
          {hrData.length > 0 && (
            <TabsContent value="heart-rate">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={hrData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" angle={-45} textAnchor="end" height={80} />
                    <YAxis domain={VITAL_SIGN_CONFIGS.heartRate.chartDomain} />
                    <Tooltip
                      labelFormatter={(value, payload) => {
                        if (payload && payload.length > 0) {
                          return `Time: ${payload[0].payload.fullTime}`;
                        }
                        return `Time: ${value}`;
                      }}
                      formatter={(value: number) => [
                        formatVitalSignForChart("heartRate", value),
                        VITAL_SIGN_CONFIGS.heartRate.label,
                      ]}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="heartRate"
                      stroke={VITAL_SIGN_CONFIGS.heartRate.chartColor}
                      strokeWidth={2}
                      name={`${VITAL_SIGN_CONFIGS.heartRate.label} (${VITAL_SIGN_CONFIGS.heartRate.unit})`}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          )}

          {/* Temperature Chart */}
          {tempData.length > 0 && (
            <TabsContent value="temperature">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={tempData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" angle={-45} textAnchor="end" height={80} />
                    <YAxis domain={VITAL_SIGN_CONFIGS.temperature.chartDomain} />
                    <Tooltip
                      labelFormatter={(value, payload) => {
                        if (payload && payload.length > 0) {
                          return `Time: ${payload[0].payload.fullTime}`;
                        }
                        return `Time: ${value}`;
                      }}
                      formatter={(value: number) => [
                        formatVitalSignForChart("temperature", value),
                        VITAL_SIGN_CONFIGS.temperature.label,
                      ]}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="temperature"
                      stroke={VITAL_SIGN_CONFIGS.temperature.chartColor}
                      strokeWidth={2}
                      name={`${VITAL_SIGN_CONFIGS.temperature.label} (${VITAL_SIGN_CONFIGS.temperature.unit})`}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          )}

          {/* Respiratory Rate Chart */}
          {rrData.length > 0 && (
            <TabsContent value="respiratory">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={rrData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" angle={-45} textAnchor="end" height={80} />
                    <YAxis domain={VITAL_SIGN_CONFIGS.respiratoryRate.chartDomain} />
                    <Tooltip
                      labelFormatter={(value, payload) => {
                        if (payload && payload.length > 0) {
                          return `Time: ${payload[0].payload.fullTime}`;
                        }
                        return `Time: ${value}`;
                      }}
                      formatter={(value: number) => [
                        formatVitalSignForChart("respiratoryRate", value),
                        VITAL_SIGN_CONFIGS.respiratoryRate.label,
                      ]}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="respiratoryRate"
                      stroke={VITAL_SIGN_CONFIGS.respiratoryRate.chartColor}
                      strokeWidth={2}
                      name={`${VITAL_SIGN_CONFIGS.respiratoryRate.label} (${VITAL_SIGN_CONFIGS.respiratoryRate.unit})`}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          )}

          {/* Blood Sugar Chart */}
          {bsData.length > 0 && (
            <TabsContent value="blood-sugar">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={bsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" angle={-45} textAnchor="end" height={80} />
                    <YAxis domain={VITAL_SIGN_CONFIGS.bloodSugar.chartDomain} />
                    <Tooltip
                      labelFormatter={(value, payload) => {
                        if (payload && payload.length > 0) {
                          return `Time: ${payload[0].payload.fullTime}`;
                        }
                        return `Time: ${value}`;
                      }}
                      formatter={(value: number) => [
                        formatVitalSignForChart("bloodSugar", value),
                        VITAL_SIGN_CONFIGS.bloodSugar.label,
                      ]}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="bloodSugar"
                      stroke={VITAL_SIGN_CONFIGS.bloodSugar.chartColor}
                      strokeWidth={2}
                      name={`${VITAL_SIGN_CONFIGS.bloodSugar.label} (${VITAL_SIGN_CONFIGS.bloodSugar.unit})`}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          )}

          {/* Oxygen Saturation Chart */}
          {o2Data.length > 0 && (
            <TabsContent value="oxygen">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={o2Data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" angle={-45} textAnchor="end" height={80} />
                    <YAxis domain={VITAL_SIGN_CONFIGS.oxygenSaturation.chartDomain} />
                    <Tooltip
                      labelFormatter={(value, payload) => {
                        if (payload && payload.length > 0) {
                          return `Time: ${payload[0].payload.fullTime}`;
                        }
                        return `Time: ${value}`;
                      }}
                      formatter={(value: number) => [
                        formatVitalSignForChart("oxygenSaturation", value),
                        VITAL_SIGN_CONFIGS.oxygenSaturation.label,
                      ]}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="oxygenSaturation"
                      stroke={VITAL_SIGN_CONFIGS.oxygenSaturation.chartColor}
                      strokeWidth={2}
                      name={`${VITAL_SIGN_CONFIGS.oxygenSaturation.label} (${VITAL_SIGN_CONFIGS.oxygenSaturation.unit})`}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          )}

          {/* Pain Score Chart */}
          {painData.length > 0 && (
            <TabsContent value="pain">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={painData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" angle={-45} textAnchor="end" height={80} />
                    <YAxis domain={VITAL_SIGN_CONFIGS.painScore.chartDomain} />
                    <Tooltip
                      labelFormatter={(value, payload) => {
                        if (payload && payload.length > 0) {
                          return `Time: ${payload[0].payload.fullTime}`;
                        }
                        return `Time: ${value}`;
                      }}
                      formatter={(value: number) => [
                        `${value}/10`,
                        VITAL_SIGN_CONFIGS.painScore.label,
                      ]}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="painScore"
                      stroke={VITAL_SIGN_CONFIGS.painScore.chartColor}
                      strokeWidth={2}
                      name={VITAL_SIGN_CONFIGS.painScore.label}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
}

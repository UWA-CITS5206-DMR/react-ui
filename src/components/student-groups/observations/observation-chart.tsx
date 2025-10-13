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
import type {
  BloodPressureRecord,
  HeartRateRecord,
  BodyTemperatureRecord,
  RespiratoryRateRecord,
  BloodSugarRecord,
  OxygenSaturationRecord,
  PainScoreRecord,
} from "@/lib/api-client-v2";

interface ObservationChartProps {
  bloodPressures?: BloodPressureRecord[];
  heartRates?: HeartRateRecord[];
  bodyTemperatures?: BodyTemperatureRecord[];
  respiratoryRates?: RespiratoryRateRecord[];
  bloodSugars?: BloodSugarRecord[];
  oxygenSaturations?: OxygenSaturationRecord[];
  painScores?: PainScoreRecord[];
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
}: ObservationChartProps) {
  // Transform blood pressure data for chart
  // Sort by created_at in ascending order (oldest to newest) and format with full date
  const bpData = bloodPressures
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    .map((bp) => ({
      time: format(new Date(bp.created_at), "MMM dd HH:mm"),
      systolic: bp.systolic,
      diastolic: bp.diastolic,
      fullTime: format(new Date(bp.created_at), "MMM dd, yyyy HH:mm"),
    }));

  // Transform heart rate data for chart
  const hrData = heartRates
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    .map((hr) => ({
      time: format(new Date(hr.created_at), "MMM dd HH:mm"),
      heartRate: hr.heart_rate,
      fullTime: format(new Date(hr.created_at), "MMM dd, yyyy HH:mm"),
    }));

  // Transform temperature data for chart
  const tempData = bodyTemperatures
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    .map((temp) => ({
      time: format(new Date(temp.created_at), "MMM dd HH:mm"),
      temperature: parseFloat(temp.temperature),
      fullTime: format(new Date(temp.created_at), "MMM dd, yyyy HH:mm"),
    }));

  // Transform respiratory rate data for chart
  const rrData = respiratoryRates
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    .map((rr) => ({
      time: format(new Date(rr.created_at), "MMM dd HH:mm"),
      respiratoryRate: rr.respiratory_rate,
      fullTime: format(new Date(rr.created_at), "MMM dd, yyyy HH:mm"),
    }));

  // Transform blood sugar data for chart
  const bsData = bloodSugars
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    .map((bs) => ({
      time: format(new Date(bs.created_at), "MMM dd HH:mm"),
      bloodSugar: parseFloat(bs.sugar_level),
      fullTime: format(new Date(bs.created_at), "MMM dd, yyyy HH:mm"),
    }));

  // Transform oxygen saturation data for chart
  const o2Data = oxygenSaturations
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    .map((o2) => ({
      time: format(new Date(o2.created_at), "MMM dd HH:mm"),
      oxygenSaturation: o2.saturation_percentage,
      fullTime: format(new Date(o2.created_at), "MMM dd, yyyy HH:mm"),
    }));

  // Transform pain score data for chart
  const painData = painScores
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    .map((pain) => ({
      time: format(new Date(pain.created_at), "MMM dd HH:mm"),
      painScore: pain.score,
      fullTime: format(new Date(pain.created_at), "MMM dd, yyyy HH:mm"),
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Observations Chart</CardTitle>
        <p className="text-sm text-gray-600">Historical trends of vital signs over time</p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="blood-pressure" className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
            {bpData.length > 0 && <TabsTrigger value="blood-pressure">BP</TabsTrigger>}
            {hrData.length > 0 && <TabsTrigger value="heart-rate">HR</TabsTrigger>}
            {tempData.length > 0 && <TabsTrigger value="temperature">Temp</TabsTrigger>}
            {rrData.length > 0 && <TabsTrigger value="respiratory">RR</TabsTrigger>}
            {bsData.length > 0 && <TabsTrigger value="blood-sugar">BS</TabsTrigger>}
            {o2Data.length > 0 && <TabsTrigger value="oxygen">O2</TabsTrigger>}
            {painData.length > 0 && <TabsTrigger value="pain">Pain</TabsTrigger>}
          </TabsList>

          {/* Blood Pressure Chart */}
          {bpData.length > 0 && (
            <TabsContent value="blood-pressure">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={bpData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" angle={-45} textAnchor="end" height={80} />
                    <YAxis domain={[60, 180]} />
                    <Tooltip
                      labelFormatter={(value, payload) => {
                        if (payload && payload.length > 0) {
                          return `Time: ${payload[0].payload.fullTime}`;
                        }
                        return `Time: ${value}`;
                      }}
                      formatter={(value: number, name: string) => [
                        `${value} mmHg`,
                        name === "systolic" ? "Systolic" : "Diastolic",
                      ]}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="systolic"
                      stroke="#ef4444"
                      strokeWidth={2}
                      name="Systolic"
                    />
                    <Line
                      type="monotone"
                      dataKey="diastolic"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      name="Diastolic"
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
                    <YAxis domain={[40, 140]} />
                    <Tooltip
                      labelFormatter={(value, payload) => {
                        if (payload && payload.length > 0) {
                          return `Time: ${payload[0].payload.fullTime}`;
                        }
                        return `Time: ${value}`;
                      }}
                      formatter={(value: number) => [`${value} bpm`, "Heart Rate"]}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="heartRate"
                      stroke="#10b981"
                      strokeWidth={2}
                      name="Heart Rate (bpm)"
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
                    <YAxis domain={[35, 40]} />
                    <Tooltip
                      labelFormatter={(value, payload) => {
                        if (payload && payload.length > 0) {
                          return `Time: ${payload[0].payload.fullTime}`;
                        }
                        return `Time: ${value}`;
                      }}
                      formatter={(value: number) => [`${value}°C`, "Temperature"]}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="temperature"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      name="Temperature (°C)"
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
                    <YAxis domain={[10, 30]} />
                    <Tooltip
                      labelFormatter={(value, payload) => {
                        if (payload && payload.length > 0) {
                          return `Time: ${payload[0].payload.fullTime}`;
                        }
                        return `Time: ${value}`;
                      }}
                      formatter={(value: number) => [`${value} /min`, "Respiratory Rate"]}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="respiratoryRate"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      name="Respiratory Rate (/min)"
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
                    <YAxis domain={[60, 200]} />
                    <Tooltip
                      labelFormatter={(value, payload) => {
                        if (payload && payload.length > 0) {
                          return `Time: ${payload[0].payload.fullTime}`;
                        }
                        return `Time: ${value}`;
                      }}
                      formatter={(value: number) => [`${value} mg/dL`, "Blood Sugar"]}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="bloodSugar"
                      stroke="#ec4899"
                      strokeWidth={2}
                      name="Blood Sugar (mg/dL)"
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
                    <YAxis domain={[90, 100]} />
                    <Tooltip
                      labelFormatter={(value, payload) => {
                        if (payload && payload.length > 0) {
                          return `Time: ${payload[0].payload.fullTime}`;
                        }
                        return `Time: ${value}`;
                      }}
                      formatter={(value: number) => [`${value}%`, "O2 Saturation"]}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="oxygenSaturation"
                      stroke="#06b6d4"
                      strokeWidth={2}
                      name="O2 Saturation (%)"
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
                    <YAxis domain={[0, 10]} />
                    <Tooltip
                      labelFormatter={(value, payload) => {
                        if (payload && payload.length > 0) {
                          return `Time: ${payload[0].payload.fullTime}`;
                        }
                        return `Time: ${value}`;
                      }}
                      formatter={(value: number) => [`${value}/10`, "Pain Score"]}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="painScore"
                      stroke="#dc2626"
                      strokeWidth={2}
                      name="Pain Score"
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

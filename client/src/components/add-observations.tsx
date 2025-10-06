import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { apiClientV2 } from "@/lib/queryClient";
import type { ObservationCreateBundle, Patient } from "@/lib/api-client-v2";
import { Activity } from "lucide-react";

interface AddObservationsProps {
  patient: Patient;
}

export default function AddObservations({ patient }: AddObservationsProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // 单项观察数据状态
  const [bloodPressure, setBloodPressure] = useState({ systolic: "", diastolic: "" });
  const [heartRate, setHeartRate] = useState("");
  const [temperature, setTemperature] = useState("");
  const [respiratoryRate, setRespiratoryRate] = useState("");
  const [oxygenSaturation, setOxygenSaturation] = useState("");
  const [bloodSugar, setBloodSugar] = useState("");
  const [painScore, setPainScore] = useState("");

  // 批量添加表单数据
  const [bulkFormData, setBulkFormData] = useState({
    systolic: "",
    diastolic: "",
    heartRate: "",
    temperature: "",
    respiratoryRate: "",
    oxygenSaturation: "",
    bloodSugar: "",
    painScore: "",
  });

  // 单项添加 - 血压
  const addBloodPressureMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("User not authenticated");
      
      const payload: ObservationCreateBundle = {
        blood_pressure: {
          systolic: Number(bloodPressure.systolic),
          diastolic: Number(bloodPressure.diastolic),
          patient: patient.id,
          user: user.id,
        }
      };
      return apiClientV2.studentGroups.observations.createBundle(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/patients", patient.id, "vitals"] });
      setBloodPressure({ systolic: "", diastolic: "" });
    },
  });

  // 单项添加 - 心率
  const addHeartRateMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("User not authenticated");
      
      const payload: ObservationCreateBundle = {
        heart_rate: {
          heart_rate: Number(heartRate),
          patient: patient.id,
          user: user.id,
        }
      };
      return apiClientV2.studentGroups.observations.createBundle(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/patients", patient.id, "vitals"] });
      setHeartRate("");
    },
  });

  // 单项添加 - 体温
  const addTemperatureMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("User not authenticated");
      
      const payload: ObservationCreateBundle = {
        body_temperature: {
          temperature: temperature,
          patient: patient.id,
          user: user.id,
        }
      };
      return apiClientV2.studentGroups.observations.createBundle(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/patients", patient.id, "vitals"] });
      setTemperature("");
    },
  });

  // 单项添加 - 呼吸率
  const addRespiratoryRateMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("User not authenticated");
      
      const payload: ObservationCreateBundle = {
        respiratory_rate: {
          respiratory_rate: Number(respiratoryRate),
          patient: patient.id,
          user: user.id,
        }
      };
      return apiClientV2.studentGroups.observations.createBundle(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/patients", patient.id, "vitals"] });
      setRespiratoryRate("");
    },
  });

  // 单项添加 - 血氧饱和度
  const addOxygenSaturationMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("User not authenticated");
      
      const payload: ObservationCreateBundle = {
        oxygen_saturation: {
          saturation_percentage: Number(oxygenSaturation),
          patient: patient.id,
          user: user.id,
        }
      };
      return apiClientV2.studentGroups.observations.createBundle(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/patients", patient.id, "vitals"] });
      setOxygenSaturation("");
    },
  });

  // 单项添加 - 血糖
  const addBloodSugarMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("User not authenticated");
      
      const payload: ObservationCreateBundle = {
        blood_sugar: {
          sugar_level: bloodSugar,
          patient: patient.id,
          user: user.id,
        }
      };
      return apiClientV2.studentGroups.observations.createBundle(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/patients", patient.id, "vitals"] });
      setBloodSugar("");
    },
  });

  // 单项添加 - 疼痛评分
  const addPainScoreMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("User not authenticated");
      
      const payload: ObservationCreateBundle = {
        pain_score: {
          score: Number(painScore),
          patient: patient.id,
          user: user.id,
        }
      };
      return apiClientV2.studentGroups.observations.createBundle(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/patients", patient.id, "vitals"] });
      setPainScore("");
    },
  });

  // 批量添加
  const createBulkObservationsMutation = useMutation({
    mutationFn: async (newVitals: typeof bulkFormData) => {
      if (!user) {
        throw new Error("User not authenticated. Cannot record observations.");
      }

      const payload: ObservationCreateBundle = {
        blood_pressure: (newVitals.systolic && newVitals.diastolic) ? {
          systolic: Number(newVitals.systolic),
          diastolic: Number(newVitals.diastolic),
          patient: patient.id,
          user: user.id,
        } : undefined,
        heart_rate: newVitals.heartRate ? {
          heart_rate: Number(newVitals.heartRate),
          patient: patient.id,
          user: user.id,
        } : undefined,
        body_temperature: newVitals.temperature ? {
          temperature: newVitals.temperature,
          patient: patient.id,
          user: user.id,
        } : undefined,
        respiratory_rate: newVitals.respiratoryRate ? {
          respiratory_rate: Number(newVitals.respiratoryRate),
          patient: patient.id,
          user: user.id,
        } : undefined,
        blood_sugar: newVitals.bloodSugar ? {
          sugar_level: newVitals.bloodSugar,
          patient: patient.id,
          user: user.id,
        } : undefined,
        oxygen_saturation: newVitals.oxygenSaturation ? {
          saturation_percentage: Number(newVitals.oxygenSaturation),
          patient: patient.id,
          user: user.id,
        } : undefined,
        pain_score: newVitals.painScore ? {
          score: Number(newVitals.painScore),
          patient: patient.id,
          user: user.id,
        } : undefined,
      };

      const response = await apiClientV2.studentGroups.observations.createBundle(payload);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/patients", patient.id, "vitals"],
      });

      setBulkFormData({
        systolic: "",
        diastolic: "",
        heartRate: "",
        temperature: "",
        respiratoryRate: "",
        oxygenSaturation: "",
        bloodSugar: "",
        painScore: "",
      });
    },
    onError: (error: Error) => {
      console.error("Failed to record new vitals:", error);
      alert(`Error: ${error.message}`);
    },
  });

  const handleBulkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createBulkObservationsMutation.mutate(bulkFormData);
  };

  return (
    <div className="bg-bg-light p-6">
      <div className="max-w-7xl mx-auto">
        <Tabs defaultValue="individual" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="individual">Individual Entry</TabsTrigger>
            <TabsTrigger value="bulk">Bulk Entry</TabsTrigger>
          </TabsList>

          {/* 单项添加 */}
          <TabsContent value="individual" className="space-y-4">
            {/* 血压 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Blood Pressure
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div>
                    <Label htmlFor="bp-systolic">Systolic (mmHg)</Label>
                    <Input
                      id="bp-systolic"
                      type="number"
                      placeholder="120"
                      value={bloodPressure.systolic}
                      onChange={(e) => setBloodPressure({ ...bloodPressure, systolic: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="bp-diastolic">Diastolic (mmHg)</Label>
                    <Input
                      id="bp-diastolic"
                      type="number"
                      placeholder="80"
                      value={bloodPressure.diastolic}
                      onChange={(e) => setBloodPressure({ ...bloodPressure, diastolic: e.target.value })}
                    />
                  </div>
                  <Button
                    onClick={() => addBloodPressureMutation.mutate()}
                    disabled={!bloodPressure.systolic || !bloodPressure.diastolic || addBloodPressureMutation.isPending}
                  >
                    {addBloodPressureMutation.isPending ? "Recording..." : "Record"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 心率 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Heart Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                  <div>
                    <Label htmlFor="heart-rate">Heart Rate (bpm)</Label>
                    <Input
                      id="heart-rate"
                      type="number"
                      placeholder="72"
                      value={heartRate}
                      onChange={(e) => setHeartRate(e.target.value)}
                    />
                  </div>
                  <Button
                    onClick={() => addHeartRateMutation.mutate()}
                    disabled={!heartRate || addHeartRateMutation.isPending}
                  >
                    {addHeartRateMutation.isPending ? "Recording..." : "Record"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 体温 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Body Temperature
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                  <div>
                    <Label htmlFor="temperature">Temperature (°C)</Label>
                    <Input
                      id="temperature"
                      type="number"
                      step="0.1"
                      placeholder="36.5"
                      value={temperature}
                      onChange={(e) => setTemperature(e.target.value)}
                    />
                  </div>
                  <Button
                    onClick={() => addTemperatureMutation.mutate()}
                    disabled={!temperature || addTemperatureMutation.isPending}
                  >
                    {addTemperatureMutation.isPending ? "Recording..." : "Record"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 呼吸率 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Respiratory Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                  <div>
                    <Label htmlFor="respiratory-rate">Respiratory Rate (/min)</Label>
                    <Input
                      id="respiratory-rate"
                      type="number"
                      placeholder="16"
                      value={respiratoryRate}
                      onChange={(e) => setRespiratoryRate(e.target.value)}
                    />
                  </div>
                  <Button
                    onClick={() => addRespiratoryRateMutation.mutate()}
                    disabled={!respiratoryRate || addRespiratoryRateMutation.isPending}
                  >
                    {addRespiratoryRateMutation.isPending ? "Recording..." : "Record"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 血氧饱和度 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Oxygen Saturation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                  <div>
                    <Label htmlFor="oxygen-saturation">O2 Saturation (%)</Label>
                    <Input
                      id="oxygen-saturation"
                      type="number"
                      placeholder="98"
                      value={oxygenSaturation}
                      onChange={(e) => setOxygenSaturation(e.target.value)}
                    />
                  </div>
                  <Button
                    onClick={() => addOxygenSaturationMutation.mutate()}
                    disabled={!oxygenSaturation || addOxygenSaturationMutation.isPending}
                  >
                    {addOxygenSaturationMutation.isPending ? "Recording..." : "Record"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 血糖 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Blood Sugar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                  <div>
                    <Label htmlFor="blood-sugar">Blood Sugar (mmol/L)</Label>
                    <Input
                      id="blood-sugar"
                      type="number"
                      step="0.1"
                      placeholder="5.5"
                      value={bloodSugar}
                      onChange={(e) => setBloodSugar(e.target.value)}
                    />
                  </div>
                  <Button
                    onClick={() => addBloodSugarMutation.mutate()}
                    disabled={!bloodSugar || addBloodSugarMutation.isPending}
                  >
                    {addBloodSugarMutation.isPending ? "Recording..." : "Record"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 疼痛评分 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Pain Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                  <div>
                    <Label htmlFor="pain-score">Pain Score (0-10)</Label>
                    <Input
                      id="pain-score"
                      type="number"
                      min="0"
                      max="10"
                      placeholder="0"
                      value={painScore}
                      onChange={(e) => setPainScore(e.target.value)}
                    />
                  </div>
                  <Button
                    onClick={() => addPainScoreMutation.mutate()}
                    disabled={!painScore || addPainScoreMutation.isPending}
                  >
                    {addPainScoreMutation.isPending ? "Recording..." : "Record"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 批量添加 */}
          <TabsContent value="bulk">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Record All Observations</CardTitle>
                <p className="text-sm text-gray-600">
                  Enter multiple observations at once
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleBulkSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bulk-systolic">Systolic BP (mmHg)</Label>
                      <Input
                        id="bulk-systolic"
                        type="number"
                        placeholder="120"
                        value={bulkFormData.systolic}
                        onChange={(e) =>
                          setBulkFormData({ ...bulkFormData, systolic: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bulk-diastolic">Diastolic BP (mmHg)</Label>
                      <Input
                        id="bulk-diastolic"
                        type="number"
                        placeholder="80"
                        value={bulkFormData.diastolic}
                        onChange={(e) =>
                          setBulkFormData({ ...bulkFormData, diastolic: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bulk-heartRate">Heart Rate (bpm)</Label>
                      <Input
                        id="bulk-heartRate"
                        type="number"
                        placeholder="72"
                        value={bulkFormData.heartRate}
                        onChange={(e) =>
                          setBulkFormData({ ...bulkFormData, heartRate: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bulk-temperature">Temperature (°C)</Label>
                      <Input
                        id="bulk-temperature"
                        type="number"
                        step="0.1"
                        placeholder="36.5"
                        value={bulkFormData.temperature}
                        onChange={(e) =>
                          setBulkFormData({ ...bulkFormData, temperature: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bulk-respiratoryRate">Respiratory Rate (/min)</Label>
                      <Input
                        id="bulk-respiratoryRate"
                        type="number"
                        placeholder="16"
                        value={bulkFormData.respiratoryRate}
                        onChange={(e) =>
                          setBulkFormData({
                            ...bulkFormData,
                            respiratoryRate: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bulk-oxygenSaturation">O2 Saturation (%)</Label>
                      <Input
                        id="bulk-oxygenSaturation"
                        type="number"
                        placeholder="98"
                        value={bulkFormData.oxygenSaturation}
                        onChange={(e) =>
                          setBulkFormData({
                            ...bulkFormData,
                            oxygenSaturation: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bulk-bloodSugar">Blood Sugar (mmol/L)</Label>
                      <Input
                        id="bulk-bloodSugar"
                        type="number"
                        step="0.1"
                        placeholder="5.5"
                        value={bulkFormData.bloodSugar}
                        onChange={(e) =>
                          setBulkFormData({ ...bulkFormData, bloodSugar: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bulk-painScore">Pain Score (0-10)</Label>
                      <Input
                        id="bulk-painScore"
                        type="number"
                        min="0"
                        max="10"
                        placeholder="0"
                        value={bulkFormData.painScore}
                        onChange={(e) =>
                          setBulkFormData({ ...bulkFormData, painScore: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={createBulkObservationsMutation.isPending}
                    className="w-full"
                  >
                    {createBulkObservationsMutation.isPending
                      ? "Recording..."
                      : "Record All Observations"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

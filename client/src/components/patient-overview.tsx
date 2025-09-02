import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Clock, AlertTriangle, CheckCircle, User, Calendar } from "lucide-react";
import { api } from "@/lib/api-client";
import type { Patient, VitalSigns, LabResult, MedicalHistory, Medication, SoapNote } from "@shared/schema";

interface PatientOverviewProps {
  patient: Patient;
}

export default function PatientOverview({ patient }: PatientOverviewProps) {
  const [activeTab, setActiveTab] = useState("overview");

  const { data: vitals } = useQuery<VitalSigns>({
    queryKey: ["patients", patient.id, "vitals"],
    queryFn: () => api.patients.getVitals(patient.id),
  });

  const { data: labResults = [] } = useQuery<LabResult[]>({
    queryKey: ["patients", patient.id, "labs"],
    queryFn: () => api.patients.getLabs(patient.id),
  });

  const { data: medicalHistory = [] } = useQuery<MedicalHistory[]>({
    queryKey: ["patients", patient.id, "history"],
    queryFn: () => api.patients.getHistory(patient.id),
  });

  const { data: medications = [] } = useQuery<Medication[]>({
    queryKey: ["patients", patient.id, "medications"],
    queryFn: () => api.patients.getMedications(patient.id),
  });

  const { data: soapNotes = [] } = useQuery<SoapNote[]>({
    queryKey: ["patients", patient.id, "soap-notes"],
    queryFn: () => api.patients.getSoapNotes(patient.id),
  });

  const getVitalStatus = (value: number | string | null, normal: { min?: number; max?: number }) => {
    if (typeof value !== "number") return "normal";
    if (normal.min && value < normal.min) return "low";
    if (normal.max && value > normal.max) return "high";
    return "normal";
  };

  const getVitalColor = (status: string) => {
    switch (status) {
      case "high":
        return "text-critical-red";
      case "low":
        return "text-alert-yellow";
      default:
        return "text-gray-900";
    }
  };

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "vitals", label: "Vitals & Monitoring" },
    { id: "labs", label: "Laboratory Results" },
    { id: "medications", label: "Medications" },
    { id: "orders", label: "Orders" },
    { id: "notes", label: "Notes" },
    { id: "imaging", label: "Imaging" },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200">
        <nav className="flex space-x-8 px-6" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`border-b-2 py-3 px-1 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "border-hospital-blue text-hospital-blue"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto bg-bg-light p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Chief Complaint */}
              <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Chief Complaint</h2>
                    <span className="text-sm text-gray-500">Today, 2:45 PM</span>
                  </div>
                  <div className="space-y-3">
                    <p className="text-gray-800">{patient.chiefComplaint}</p>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Onset</label>
                        <p className="text-sm text-gray-600">2 hours ago, sudden</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Pain Scale</label>
                        <p className="text-sm text-gray-600">8/10</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vital Signs */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Current Vitals</h2>
                    <span className="text-xs bg-success-green/10 text-green-800 px-2 py-1 rounded-full">
                      Updated 5 min ago
                    </span>
                  </div>
                  <div className="space-y-4">
                    {vitals && (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Blood Pressure</span>
                          <span className="text-sm font-semibold text-critical-red">
                            {vitals.bloodPressure}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Heart Rate</span>
                          <span className={`text-sm font-semibold ${getVitalColor(getVitalStatus(vitals.heartRate, { max: 100 }))}`}>
                            {vitals.heartRate} bpm
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Respiratory Rate</span>
                          <span className={`text-sm font-semibold ${getVitalColor(getVitalStatus(vitals.respiratoryRate, { max: 20 }))}`}>
                            {vitals.respiratoryRate}/min
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Temperature</span>
                          <span className="text-sm font-semibold text-gray-900">
                            {vitals.temperature}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">SpO2</span>
                          <span className={`text-sm font-semibold ${getVitalColor(getVitalStatus(vitals.oxygenSaturation, { min: 95 }))}`}>
                            {vitals.oxygenSaturation}%
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Medical History */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Medical History</h2>
                  <div className="space-y-3">
                    {Array.isArray(medicalHistory) && medicalHistory.length > 0 ? medicalHistory.map((history) => (
                      <div key={history.id} className="flex items-center justify-between">
                        <span className="text-sm text-gray-800">{history.condition}</span>
                        <span className="text-xs text-gray-500">{history.diagnosedYear}</span>
                      </div>
                    )) : (
                      <div className="text-sm text-gray-500">No medical history available</div>
                    )}
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Current Medications</h3>
                    <div className="space-y-2">
                      {Array.isArray(medications) && medications.length > 0 ? medications.map((medication) => (
                        <div key={medication.id} className="text-sm text-gray-600">
                          • {medication.name} {medication.dosage} {medication.frequency}
                        </div>
                      )) : (
                        <div className="text-sm text-gray-500">No current medications</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Lab Results */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Lab Results</h2>
                    {labResults?.some(lab => lab.status === 'pending') && (
                      <span className="text-xs bg-alert-yellow/20 text-orange-800 px-2 py-1 rounded-full flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        Pending: Troponin
                      </span>
                    )}
                  </div>
                  <div className="space-y-3">
                    {Array.isArray(labResults) && labResults.length > 0 ? labResults.map((lab) => (
                      <div key={lab.id}>
                        {lab.status === 'completed' ? (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">{lab.testName}</span>
                            <span className="text-sm font-semibold text-gray-900">
                              {lab.value} {lab.unit}
                            </span>
                          </div>
                        ) : (
                          <div className="p-3 bg-alert-yellow/10 border border-alert-yellow/20 rounded-md">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 text-alert-yellow mr-2" />
                              <span className="text-sm font-medium text-orange-800">
                                {lab.testName} results pending
                              </span>
                            </div>
                            <p className="text-xs text-orange-700 mt-1">Expected in 15 minutes</p>
                          </div>
                        )}
                      </div>
                    )) : (
                      <div className="text-sm text-gray-500">No lab results available</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Vitals & Monitoring Tab */}
          {activeTab === "vitals" && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Vital Signs Monitoring</h2>
                    <span className="text-xs bg-success-green/10 text-green-800 px-3 py-1 rounded-full">
                      Live Monitoring
                    </span>
                  </div>
                  {vitals && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">Blood Pressure</span>
                          <span className="text-xs text-gray-500">mmHg</span>
                        </div>
                        <div className="text-2xl font-bold text-critical-red">{vitals.bloodPressure}</div>
                        <div className="text-xs text-gray-500 mt-1">Hypertensive Range</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">Heart Rate</span>
                          <span className="text-xs text-gray-500">bpm</span>
                        </div>
                        <div className={`text-2xl font-bold ${getVitalColor(getVitalStatus(vitals.heartRate, { max: 100 }))}`}>
                          {vitals.heartRate}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">Tachycardic</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">Respiratory Rate</span>
                          <span className="text-xs text-gray-500">/min</span>
                        </div>
                        <div className={`text-2xl font-bold ${getVitalColor(getVitalStatus(vitals.respiratoryRate, { max: 20 }))}`}>
                          {vitals.respiratoryRate}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">Tachypneic</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">Temperature</span>
                          <span className="text-xs text-gray-500">°F</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900">{vitals.temperature}</div>
                        <div className="text-xs text-gray-500 mt-1">Normal</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">Oxygen Saturation</span>
                          <span className="text-xs text-gray-500">%</span>
                        </div>
                        <div className={`text-2xl font-bold ${getVitalColor(getVitalStatus(vitals.oxygenSaturation, { min: 95 }))}`}>
                          {vitals.oxygenSaturation}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">Hypoxic</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Laboratory Results Tab */}
          {activeTab === "labs" && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Laboratory Results</h2>
                    {labResults?.some(lab => lab.status === 'pending') && (
                      <span className="text-sm bg-alert-yellow/20 text-orange-800 px-3 py-1 rounded-full flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        Pending Results
                      </span>
                    )}
                  </div>
                  <div className="space-y-4">
                    {Array.isArray(labResults) && labResults.length > 0 ? labResults.map((lab) => (
                      <div key={lab.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-gray-900">{lab.testName}</h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            lab.status === 'completed' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {lab.status}
                          </span>
                        </div>
                        {lab.status === 'completed' ? (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Result:</span>
                              <span className="text-sm font-semibold text-gray-900">
                                {lab.value} {lab.unit}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Reference Range:</span>
                              <span className="text-sm text-gray-600">{lab.referenceRange}</span>
                            </div>
                            {lab.completedAt && (
                              <div className="text-xs text-gray-500">
                                Completed: {new Date(lab.completedAt).toLocaleString()}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center text-sm text-orange-700">
                            <Clock className="h-4 w-4 mr-2" />
                            Results expected within 15 minutes
                          </div>
                        )}
                      </div>
                    )) : (
                      <div className="text-center py-8 text-gray-500">
                        No lab results available
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Medications Tab */}
          {activeTab === "medications" && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Current Medications</h2>
                    <span className="text-sm text-gray-500">{medications?.length || 0} active medications</span>
                  </div>
                  <div className="space-y-4">
                    {Array.isArray(medications) && medications.length > 0 ? medications.map((medication) => (
                      <div key={medication.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-gray-900">{medication.name}</h3>
                          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                            Active
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-sm text-gray-600">Dosage:</span>
                            <span className="text-sm font-medium text-gray-900 ml-2">{medication.dosage}</span>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600">Frequency:</span>
                            <span className="text-sm font-medium text-gray-900 ml-2">{medication.frequency}</span>
                          </div>
                        </div>
                        {medication.prescribedAt && (
                          <div className="text-xs text-gray-500 mt-2">
                            Prescribed: {new Date(medication.prescribedAt).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    )) : (
                      <div className="text-center py-8 text-gray-500">
                        No medications prescribed
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Medical History */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Medical History</h2>
                  <div className="space-y-4">
                    {Array.isArray(medicalHistory) && medicalHistory.length > 0 ? medicalHistory.map((history) => (
                      <div key={history.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-gray-900">{history.condition}</h3>
                          <span className="text-sm text-gray-500">{history.diagnosedYear}</span>
                        </div>
                        {history.notes && (
                          <p className="text-sm text-gray-600">{history.notes}</p>
                        )}
                      </div>
                    )) : (
                      <div className="text-center py-8 text-gray-500">
                        No medical history available
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Current Orders</h2>
                  <div className="text-center py-8">
                    <p className="text-gray-500">No active orders at this time</p>
                    <p className="text-sm text-gray-400 mt-2">Orders will appear here when placed by clinical staff</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notes Tab */}
          {activeTab === "notes" && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Clinical Notes</h2>
                    <span className="text-sm text-gray-500">{soapNotes?.length || 0} SOAP notes</span>
                  </div>
                  
                  {soapNotes && soapNotes.length > 0 ? (
                    <div className="space-y-4">
                      {soapNotes.map((note) => (
                        <div key={note.id} className="border rounded-lg p-6 bg-gray-50">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4 text-gray-500" />
                              <span className="text-sm font-medium text-gray-700">Clinical Assessment</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(note.createdAt).toLocaleString()}</span>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <div>
                                <h4 className="text-sm font-semibold text-gray-900 mb-2">Subjective</h4>
                                <div className="bg-white p-3 rounded border text-sm text-gray-700">
                                  {note.subjective || "No subjective data recorded"}
                                </div>
                              </div>
                              
                              <div>
                                <h4 className="text-sm font-semibold text-gray-900 mb-2">Objective</h4>
                                <div className="bg-white p-3 rounded border text-sm text-gray-700">
                                  {note.objective || "No objective data recorded"}
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-4">
                              <div>
                                <h4 className="text-sm font-semibold text-gray-900 mb-2">Assessment</h4>
                                <div className="bg-white p-3 rounded border text-sm text-gray-700">
                                  {note.assessment || "No assessment recorded"}
                                </div>
                              </div>
                              
                              <div>
                                <h4 className="text-sm font-semibold text-gray-900 mb-2">Plan</h4>
                                <div className="bg-white p-3 rounded border text-sm text-gray-700">
                                  {note.plan || "No plan recorded"}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No clinical notes recorded</p>
                      <p className="text-sm text-gray-400 mt-2">SOAP notes will appear here when submitted</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Imaging Tab */}
          {activeTab === "imaging" && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Imaging Studies</h2>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900">Chest X-Ray</h3>
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                          Available
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm text-gray-600">
                          <strong>Study Date:</strong> {new Date().toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-600">
                          <strong>Indication:</strong> Chest pain, rule out pneumonia
                        </div>
                        <div className="text-sm text-gray-600">
                          <strong>Preliminary Findings:</strong> No acute cardiopulmonary abnormalities. Heart size normal. Lungs clear bilaterally.
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900">ECG (12-Lead)</h3>
                        <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                          Pending Review
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm text-gray-600">
                          <strong>Study Date:</strong> {new Date().toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-600">
                          <strong>Indication:</strong> Chest pain, rule out MI
                        </div>
                        <div className="text-sm text-orange-600">
                          <strong>Status:</strong> Awaiting cardiologist interpretation
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

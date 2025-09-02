import { User } from "lucide-react";
import type { Patient } from "@shared/schema";

interface PatientListProps {
  patients: Patient[];
  selectedPatientId?: string;
  onPatientSelect: (patientId: string) => void;
}

export default function PatientList({ patients, selectedPatientId, onPatientSelect }: PatientListProps) {
  // 确保patients始终是数组，提供防护措施
  const safePatients = Array.isArray(patients) ? patients : [];
  
  // 如果数据格式异常，记录错误信息
  if (!Array.isArray(patients) && patients !== undefined) {
    console.error('⚠️ PatientList组件接收到的patients不是数组:', typeof patients, patients);
  }
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical":
        return "bg-critical-red/10 text-critical-red";
      case "stable":
        return "bg-success-green/10 text-success-green";
      case "monitoring":
        return "bg-alert-yellow/20 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "critical":
        return "Critical";
      case "stable":
        return "Stable";
      case "monitoring":
        return "Monitoring";
      default:
        return status;
    }
  };

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Patient List</h2>
        <p className="text-sm text-gray-500">Select a patient to view records</p>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {safePatients.length > 0 ? safePatients.map((patient) => (
          <div
            key={patient.id}
            onClick={() => onPatientSelect(patient.id)}
            className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
              selectedPatientId === patient.id ? "bg-hospital-blue/5 border-hospital-blue/20" : ""
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-hospital-blue/10 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="h-5 w-5 text-hospital-blue" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {patient.firstName} {patient.lastName}
                  </h3>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(patient.status)}`}>
                    {getStatusLabel(patient.status)}
                  </span>
                </div>
                <p className="text-xs text-gray-500">MRN: {patient.mrn}</p>
                <div className="flex items-center space-x-4 mt-1">
                  <span className="text-xs text-gray-500">{calculateAge(patient.dateOfBirth)}y</span>
                  <span className="text-xs text-gray-500">{patient.gender}</span>
                  <span className="text-xs text-gray-500">{patient.location}</span>
                </div>
                {patient.status === "critical" && (
                  <div className="mt-2 flex items-center space-x-2">
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-alert-yellow/20 text-orange-800">
                      New Lab Results
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )) : (
          <div className="p-4 text-center text-gray-500">
            {!Array.isArray(patients) && patients !== undefined ? (
              <div>
                <p>数据格式错误 (接收到的数据类型: {typeof patients})</p>
                <p className="text-xs mt-1">请联系管理员检查数据源</p>
              </div>
            ) : (
              <p>暂无患者数据</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

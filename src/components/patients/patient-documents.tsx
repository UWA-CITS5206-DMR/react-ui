import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Heart, TestTube, Camera } from "lucide-react";
import type { Patient } from "@/lib/api-client-v2";

interface PatientDocumentsProps {
  patient: Patient;
}

export default function PatientDocuments({ patient }: PatientDocumentsProps) {
  return (
    <div className="bg-bg-light p-6">
      <div className="max-w-7xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Patient Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* ECG in Diagnostics category */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Heart className="h-5 w-5 text-red-500" />
                  <div>
                    <div className="font-medium">12-Lead ECG</div>
                    <div className="text-sm text-gray-500">
                      Diagnostics • Available
                    </div>
                  </div>
                </div>
                <Badge variant="default">View</Badge>
              </div>

              {/* Admission Proforma */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-gray-500" />
                  <div>
                    <div className="font-medium">Admission Proforma</div>
                    <div className="text-sm text-gray-500">
                      Admission • Pre-loaded
                    </div>
                  </div>
                </div>
                <Badge variant="default">View</Badge>
              </div>

              {/* Pathology Results */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <TestTube className="h-5 w-5 text-blue-500" />
                  <div>
                    <div className="font-medium">Blood Test Results</div>
                    <div className="text-sm text-gray-500">
                      Pathology • Released when requested
                    </div>
                  </div>
                </div>
                <Badge variant="secondary">Request Required</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

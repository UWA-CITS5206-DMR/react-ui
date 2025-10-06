import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiClientV2 } from "@/lib/queryClient";
import { X, FileCheck, Clock, CheckCircle, XCircle } from "lucide-react";
import type { BloodTestRequest, ImagingRequest } from "@/lib/api-client-v2";

interface InstructorControlsProps {
  patientId: string;
  isVisible: boolean;
  onClose: () => void;
}

export default function InstructorControls({ patientId, isVisible, onClose }: InstructorControlsProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch pending blood test requests
  const { data: pendingBloodTests = [] } = useQuery({
    queryKey: ["instructors", "blood-test-requests", "pending"],
    queryFn: () => apiClientV2.instructors.bloodTestRequests.pending().then(res => res.results || []),
    enabled: isVisible,
  });

  // Fetch pending imaging requests
  const { data: pendingImagingTests = [] } = useQuery({
    queryKey: ["instructors", "imaging-requests", "pending"],
    queryFn: () => apiClientV2.instructors.imagingRequests.pending().then(res => res.results || []),
    enabled: isVisible,
  });

  // Update blood test request status
  const updateBloodTestMutation = useMutation({
    mutationFn: async ({ id, status, approved_files }: { 
      id: number; 
      status: "pending" | "completed"; 
      approved_files?: Array<{ file_id: string; page_range?: string }>
    }) => {
      return apiClientV2.instructors.bloodTestRequests.updateStatus(id, { 
        status, 
        approved_files 
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["instructors", "blood-test-requests"] });
      toast({
        title: "Blood Test Request Updated",
        description: "Request status and file access have been updated.",
      });
    },
  });

  // Update imaging request status
  const updateImagingMutation = useMutation({
    mutationFn: async ({ id, status, approved_files }: { 
      id: number; 
      status: "pending" | "completed"; 
      approved_files?: Array<{ file_id: string; page_range?: string }>
    }) => {
      return apiClientV2.instructors.imagingRequests.updateStatus(id, { 
        status, 
        approved_files 
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["instructors", "imaging-requests"] });
      toast({
        title: "Imaging Request Updated",
        description: "Request status and file access have been updated.",
      });
    },
  });

  const handleApproveBloodTest = (request: BloodTestRequest) => {
    // Approve with mock approved files - in real implementation, this would be based on actual files
    const approved_files = [
      { file_id: `blood-result-${request.id}`, page_range: "1-2" }
    ];
    
    updateBloodTestMutation.mutate({
      id: request.id,
      status: "completed",
      approved_files
    });
  };

  const handleApproveImaging = (request: ImagingRequest) => {
    // Approve with mock approved files
    const approved_files = [
      { file_id: `imaging-result-${request.id}`, page_range: "1-3" }
    ];
    
    updateImagingMutation.mutate({
      id: request.id,
      status: "completed",
      approved_files
    });
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 w-96 z-50">
      <Card className="shadow-xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-gray-900">
              Lab Request Management
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="blood" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="blood" className="text-xs">
                Blood Tests ({pendingBloodTests.length})
              </TabsTrigger>
              <TabsTrigger value="imaging" className="text-xs">
                Imaging ({pendingImagingTests.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="blood" className="mt-3">
              <ScrollArea className="h-48">
                {pendingBloodTests.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No pending blood test requests
                  </p>
                ) : (
                  <div className="space-y-2">
                    {pendingBloodTests.map((request) => (
                      <div key={request.id} className="border rounded-lg p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            {request.test_type}
                          </span>
                          <Badge variant="outline">
                            <Clock className="h-3 w-3 mr-1" />
                            {request.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600">{request.reason}</p>
                        <p className="text-xs text-gray-500">
                          Requested by: {request.name} ({request.role})
                        </p>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleApproveBloodTest(request)}
                            disabled={updateBloodTestMutation.isPending}
                            className="flex-1 bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Approve
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="imaging" className="mt-3">
              <ScrollArea className="h-48">
                {pendingImagingTests.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No pending imaging requests
                  </p>
                ) : (
                  <div className="space-y-2">
                    {pendingImagingTests.map((request) => (
                      <div key={request.id} className="border rounded-lg p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            {request.test_type}
                          </span>
                          <Badge variant="outline">
                            <Clock className="h-3 w-3 mr-1" />
                            {request.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600">{request.reason}</p>
                        <p className="text-xs text-gray-500">
                          Requested by: {request.name} ({request.role})
                        </p>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleApproveImaging(request)}
                            disabled={updateImagingMutation.isPending}
                            className="flex-1 bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Approve
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

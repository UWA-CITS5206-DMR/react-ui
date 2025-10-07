import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { apiClientV2 } from "@/lib/queryClient";
import { 
  CheckCircle, 
  Clock, 
  ChevronLeft, 
  ChevronRight,
  FileText,
  Calendar,
  User
} from "lucide-react";
import type { 
  BloodTestRequest, 
  ImagingRequest,
  ApprovedFileRequest,
  PatientFile 
} from "@/lib/api-client-v2";

interface InstructorLabRequestsProps {
  patientId?: number;
}

interface ApprovalDialogState {
  open: boolean;
  requestType: "blood" | "imaging" | null;
  request: BloodTestRequest | ImagingRequest | null;
}

export default function InstructorLabRequests({ patientId }: InstructorLabRequestsProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Pagination state
  const [bloodTestPage, setBloodTestPage] = useState(1);
  const [imagingRequestPage, setImagingRequestPage] = useState(1);
  const [pageSize] = useState(10);
  
  // Approval dialog state
  const [approvalDialog, setApprovalDialog] = useState<ApprovalDialogState>({
    open: false,
    requestType: null,
    request: null,
  });
  
  // File selection state for approval
  const [selectedFiles, setSelectedFiles] = useState<ApprovedFileRequest[]>([]);
  const [pageRangeInput, setPageRangeInput] = useState<Record<string, string>>({});

  // Fetch blood test requests (with pagination)
  const { data: bloodTestsData, isLoading: isLoadingBloodTests } = useQuery({
    queryKey: ["instructors", "blood-test-requests", bloodTestPage, pageSize, patientId],
    queryFn: () => 
      apiClientV2.instructors.bloodTestRequests.list({
        page: bloodTestPage,
        page_size: pageSize,
        ...(patientId && { patient: patientId }),
      }),
  });

  // Fetch imaging requests (with pagination)
  const { data: imagingRequestsData, isLoading: isLoadingImagingRequests } = useQuery({
    queryKey: ["instructors", "imaging-requests", imagingRequestPage, pageSize, patientId],
    queryFn: () =>
      apiClientV2.instructors.imagingRequests.list({
        page: imagingRequestPage,
        page_size: pageSize,
        ...(patientId && { patient: patientId }),
      }),
  });

  // Fetch patient files for approval dialog
  const { data: patientFilesData } = useQuery({
    queryKey: ["patients", approvalDialog.request?.patient, "files"],
    queryFn: async () => {
      if (!approvalDialog.request?.patient) {
        return { count: 0, next: null, previous: null, results: [] };
      }
      return apiClientV2.patients.files.list(approvalDialog.request.patient);
    },
    enabled: approvalDialog.open && !!approvalDialog.request?.patient,
  });

  // Update blood test request status
  const updateBloodTestMutation = useMutation({
    mutationFn: async ({ 
      id, 
      status, 
      approved_files 
    }: { 
      id: number; 
      status: "pending" | "completed"; 
      approved_files?: ApprovedFileRequest[]
    }) => {
      return apiClientV2.instructors.bloodTestRequests.updateStatus(id, { 
        status, 
        approved_files 
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["instructors", "blood-test-requests"] });
      toast({
        title: "Success",
        description: "Blood test request has been updated.",
      });
      closeApprovalDialog();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update request: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Update imaging request status
  const updateImagingMutation = useMutation({
    mutationFn: async ({ 
      id, 
      status, 
      approved_files 
    }: { 
      id: number; 
      status: "pending" | "completed"; 
      approved_files?: ApprovedFileRequest[]
    }) => {
      return apiClientV2.instructors.imagingRequests.updateStatus(id, { 
        status, 
        approved_files 
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["instructors", "imaging-requests"] });
      toast({
        title: "Success",
        description: "Imaging request has been updated.",
      });
      closeApprovalDialog();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update request: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const openApprovalDialog = (
    requestType: "blood" | "imaging",
    request: BloodTestRequest | ImagingRequest
  ) => {
    setApprovalDialog({
      open: true,
      requestType,
      request,
    });
    // Pre-populate with existing approved files if any
    if (request.approved_files && request.approved_files.length > 0) {
      const existingFiles = request.approved_files.map(af => ({
        file_id: af.file_id,
        page_range: af.page_range || undefined,
      }));
      setSelectedFiles(existingFiles);
      
      const pageRanges: Record<string, string> = {};
      request.approved_files.forEach(af => {
        if (af.page_range) {
          pageRanges[af.file_id] = af.page_range;
        }
      });
      setPageRangeInput(pageRanges);
    } else {
      setSelectedFiles([]);
      setPageRangeInput({});
    }
  };

  const closeApprovalDialog = () => {
    setApprovalDialog({
      open: false,
      requestType: null,
      request: null,
    });
    setSelectedFiles([]);
    setPageRangeInput({});
  };

  const handleFileSelection = (file: PatientFile, checked: boolean) => {
    if (checked) {
      setSelectedFiles(prev => [
        ...prev,
        { file_id: file.id, page_range: pageRangeInput[file.id] || undefined }
      ]);
    } else {
      setSelectedFiles(prev => prev.filter(f => f.file_id !== file.id));
      setPageRangeInput(prev => {
        const newState = { ...prev };
        delete newState[file.id];
        return newState;
      });
    }
  };

  const handlePageRangeChange = (fileId: string, pageRange: string) => {
    setPageRangeInput(prev => ({ ...prev, [fileId]: pageRange }));
    setSelectedFiles(prev => 
      prev.map(f => 
        f.file_id === fileId 
          ? { ...f, page_range: pageRange || undefined }
          : f
      )
    );
  };

  const handleApprove = () => {
    if (!approvalDialog.request) return;

    const payload = {
      id: approvalDialog.request.id,
      status: "completed" as const,
      approved_files: selectedFiles.length > 0 ? selectedFiles : undefined,
    };

    if (approvalDialog.requestType === "blood") {
      updateBloodTestMutation.mutate(payload);
    } else if (approvalDialog.requestType === "imaging") {
      updateImagingMutation.mutate(payload);
    }
  };

  const bloodTests = bloodTestsData?.results || [];
  const imagingRequests = imagingRequestsData?.results || [];
  const patientFiles = patientFilesData?.results || [];

  const totalBloodTestPages = bloodTestsData 
    ? Math.ceil(bloodTestsData.count / pageSize) 
    : 1;
  const totalImagingPages = imagingRequestsData 
    ? Math.ceil(imagingRequestsData.count / pageSize) 
    : 1;

  const renderRequestCard = (
    request: BloodTestRequest | ImagingRequest,
    type: "blood" | "imaging"
  ) => (
    <Card key={request.id} className="mb-4">
      <CardContent className="pt-6">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-lg">{request.test_type}</h3>
                <Badge 
                  variant={request.status === "completed" ? "default" : "secondary"}
                  className={request.status === "completed" ? "bg-green-600" : ""}
                >
                  {request.status === "completed" ? (
                    <CheckCircle className="h-3 w-3 mr-1" />
                  ) : (
                    <Clock className="h-3 w-3 mr-1" />
                  )}
                  {request.status}
                </Badge>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Requested by: {request.name} ({request.role})</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(request.created_at).toLocaleDateString()} at{" "}
                    {new Date(request.created_at).toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <FileText className="h-4 w-4 mt-0.5" />
                  <span className="flex-1">
                    <strong>Reason:</strong> {request.reason}
                  </span>
                </div>
              </div>

              {request.approved_files && request.approved_files.length > 0 && (
                <div className="mt-3 pt-3 border-t">
                  <p className="text-sm font-medium mb-2">Approved Files:</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {request.approved_files.map((file) => (
                      <li key={file.id} className="flex items-center gap-2">
                        <FileText className="h-3 w-3" />
                        <span>
                          {file.display_name}
                          {file.page_range && ` (Pages: ${file.page_range})`}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {request.status === "pending" && (
            <div className="flex gap-2 pt-3 border-t">
              <Button
                onClick={() => openApprovalDialog(type, request)}
                className="flex-1 bg-green-600 hover:bg-green-700"
                size="sm"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve Request
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const renderPagination = (
    currentPage: number,
    totalPages: number,
    onPageChange: (page: number) => void
  ) => (
    <div className="flex items-center justify-between gap-4 mt-6">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Previous
      </Button>
      
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        <Input
          type="number"
          min={1}
          max={totalPages}
          value={currentPage}
          onChange={(e) => {
            const page = parseInt(e.target.value);
            if (page >= 1 && page <= totalPages) {
              onPageChange(page);
            }
          }}
          className="w-20 text-center"
        />
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      >
        Next
        <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
    </div>
  );

  return (
    <>
      <div className="h-full flex flex-col">
        <Tabs defaultValue="blood" className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="blood">
              Blood Tests ({bloodTestsData?.count || 0})
            </TabsTrigger>
            <TabsTrigger value="imaging">
              Imaging Requests ({imagingRequestsData?.count || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="blood" className="flex-1 overflow-hidden mt-4">
            <ScrollArea className="h-full pr-4">
              {isLoadingBloodTests ? (
                <p className="text-center text-gray-500 py-8">Loading...</p>
              ) : bloodTests.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  No blood test requests found
                </p>
              ) : (
                <>
                  {bloodTests.map((request) => 
                    renderRequestCard(request, "blood")
                  )}
                  {renderPagination(
                    bloodTestPage,
                    totalBloodTestPages,
                    setBloodTestPage
                  )}
                </>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="imaging" className="flex-1 overflow-hidden mt-4">
            <ScrollArea className="h-full pr-4">
              {isLoadingImagingRequests ? (
                <p className="text-center text-gray-500 py-8">Loading...</p>
              ) : imagingRequests.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  No imaging requests found
                </p>
              ) : (
                <>
                  {imagingRequests.map((request) =>
                    renderRequestCard(request, "imaging")
                  )}
                  {renderPagination(
                    imagingRequestPage,
                    totalImagingPages,
                    setImagingRequestPage
                  )}
                </>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>

      {/* Approval Dialog */}
      <Dialog open={approvalDialog.open} onOpenChange={closeApprovalDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Approve Request</DialogTitle>
            <DialogDescription>
              Select files to approve and specify page ranges if needed.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-hidden flex flex-col gap-4">
            {approvalDialog.request && (
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">
                    {approvalDialog.request.test_type}
                  </h4>
                  <Badge>{approvalDialog.request.status}</Badge>
                </div>
                <p className="text-sm text-gray-600">
                  <strong>Reason:</strong> {approvalDialog.request.reason}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Requested by:</strong> {approvalDialog.request.name} (
                  {approvalDialog.request.role})
                </p>
              </div>
            )}

            <div className="flex-1 overflow-hidden">
              <Label className="mb-2 block">Select Files to Approve:</Label>
              <ScrollArea className="h-full border rounded-lg p-4">
                {patientFiles.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No files available for this patient
                  </p>
                ) : (
                  <div className="space-y-3">
                    {patientFiles.map((file) => {
                      const isSelected = selectedFiles.some(
                        f => f.file_id === file.id
                      );
                      return (
                        <div
                          key={file.id}
                          className="flex items-start gap-3 p-3 border rounded-lg"
                        >
                          <Checkbox
                            id={`file-${file.id}`}
                            checked={isSelected}
                            onCheckedChange={(checked) =>
                              handleFileSelection(file, checked as boolean)
                            }
                          />
                          <div className="flex-1 space-y-2">
                            <Label
                              htmlFor={`file-${file.id}`}
                              className="cursor-pointer"
                            >
                              {file.display_name}
                              {file.category && (
                                <Badge variant="outline" className="ml-2">
                                  {file.category}
                                </Badge>
                              )}
                              {file.requires_pagination && (
                                <Badge variant="secondary" className="ml-2">
                                  Paginated
                                </Badge>
                              )}
                            </Label>
                            {isSelected && file.requires_pagination && (
                              <div className="space-y-1">
                                <Label
                                  htmlFor={`page-range-${file.id}`}
                                  className="text-xs"
                                >
                                  Page Range (required for paginated files, e.g., "1-5" or "1,3,5"):
                                </Label>
                                <Input
                                  id={`page-range-${file.id}`}
                                  placeholder="e.g., 1-5 or 1,3,5"
                                  value={pageRangeInput[file.id] || ""}
                                  onChange={(e) =>
                                    handlePageRangeChange(file.id, e.target.value)
                                  }
                                  className="text-sm"
                                  required
                                />
                              </div>
                            )}
                            {isSelected && !file.requires_pagination && (
                              <p className="text-xs text-gray-500">
                                This file does not require page range specification.
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </ScrollArea>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeApprovalDialog}>
              Cancel
            </Button>
            <Button
              onClick={handleApprove}
              disabled={
                updateBloodTestMutation.isPending ||
                updateImagingMutation.isPending
              }
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve & Complete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

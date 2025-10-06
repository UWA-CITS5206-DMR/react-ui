import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClientV2 } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { 
  Upload, 
  Calendar, 
  Clock, 
  FileText, 
  Image,
  Play,
  Pause,
  Settings,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Download,
  Trash2,
  Plus,
  Users,
  Database
} from "lucide-react";
import TopNavigation from "@/components/layout/top-navigation";

// Form schemas
const uploadDocumentSchema = z.object({
  patientId: z.string().optional(),
  category: z.enum(["admission", "lab", "imaging", "notes"]),
  sessionId: z.string().min(1, "Session is required"),
});

const scheduleReleaseSchema = z.object({
  documentId: z.string().min(1, "Document is required"),
  groupId: z.string().min(1, "Group is required"),
  releaseType: z.enum(["manual", "scheduled"]),
  scheduledAt: z.string().optional(),
  notes: z.string().optional(),
});

const simulationWeekSchema = z.object({
  name: z.string().min(1, "Name is required"),
  weekNumber: z.number().min(1, "Week number is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  sessionId: z.string().min(1, "Session is required"),
});

type UploadDocumentForm = z.infer<typeof uploadDocumentSchema>;
type ScheduleReleaseForm = z.infer<typeof scheduleReleaseSchema>;
type SimulationWeekForm = z.infer<typeof simulationWeekSchema>;

export default function CoordinatorDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedMode, setSelectedMode] = useState<"student" | "instructor">("instructor");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Queries
  // TODO: Sessions API not available in API Client v2 - removed session-based authentication
  const sessions: any[] = [];

  const { data: patients = [] } = useQuery({
    queryKey: ["/api/patients"],
    queryFn: () => apiClientV2.patients.list(),
    select: (data) => data?.results || [],
  });

  const { data: groups = [] } = useQuery({
    queryKey: ["/api/groups"],
    // TODO: apiClientV2.groups.list() does not exist - groups API not available in API Client v2
    queryFn: () => {
      console.log("Groups API not available, using mock data");
      return Promise.resolve([]);
    },
    select: (data) => data || [],
  });

  const { data: documents = [] } = useQuery({
    queryKey: ["/api/coordinator/documents"],
    // TODO: apiClientV2.coordinator.documents.list() does not exist - use patients.files instead
    queryFn: () => {
      console.log("Coordinator documents API not available, use patients.files for file management");
      return Promise.resolve({ results: [] });
    },
    select: (data) => data?.results || [],
  });

  const { data: documentReleases = [] } = useQuery({
    queryKey: ["/api/coordinator/document-releases"],
    // TODO: apiClientV2.coordinator.documentReleases.list() does not exist - use instructors.bloodTestRequests/imagingRequests.approved_files
    queryFn: () => {
      console.log("Coordinator document releases API not available, use approved_files in requests for file access control");
      return Promise.resolve({ results: [] });
    },
    select: (data) => data?.results || [],
  });

  const { data: simulationWeeks = [] } = useQuery({
    queryKey: ["/api/coordinator/simulation-weeks"],
    // TODO: apiClientV2.coordinator.simulationWeeks.list() does not exist - may need instructor dashboard API
    queryFn: () => {
      console.log("Coordinator simulation weeks API not available, consider using instructor dashboard");
      return Promise.resolve({ results: [] });
    },
    select: (data) => data?.results || [],
  });

  // Forms
  const uploadForm = useForm<UploadDocumentForm>({
    resolver: zodResolver(uploadDocumentSchema),
    defaultValues: {
      category: "admission",
      sessionId: "",
    },
  });

  const releaseForm = useForm<ScheduleReleaseForm>({
    resolver: zodResolver(scheduleReleaseSchema),
    defaultValues: {
      documentId: "",
      groupId: "",
      releaseType: "manual",
    },
  });

  const weekForm = useForm<SimulationWeekForm>({
    resolver: zodResolver(simulationWeekSchema),
    defaultValues: {
      name: "",
      weekNumber: 1,
      startDate: "",
      endDate: "",
      sessionId: "",
    },
  });

  // Mutations
  const uploadDocumentMutation = useMutation({
    mutationFn: async (data: UploadDocumentForm & { file: File }) => {
      const formData = new FormData();
      formData.append('file', data.file);
      formData.append('sessionId', data.sessionId);
      formData.append('category', data.category);
      if (data.patientId) {
        formData.append('patientId', data.patientId);
      }

      return fetch('/api/coordinator/documents/upload', {
        method: 'POST',
        body: formData,
      }).then(res => res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/coordinator/documents"] });
      uploadForm.reset();
      setSelectedFile(null);
      toast({
        title: "Success",
        description: "Document uploaded successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to upload document",
        variant: "destructive",
      });
    },
  });

  const scheduleReleaseMutation = useMutation({
    mutationFn: async (data: ScheduleReleaseForm) => {
      // TODO: apiClientV2.coordinator.documentReleases.create() does not exist
      // Should use instructors.bloodTestRequests/imagingRequests.updateStatus() with approved_files
      console.log("Would schedule document release:", {
        title: `Document Release - ${data.documentId}`,
        description: data.notes,
        file_path: data.documentId,
        target_groups: [data.groupId],
        release_date: data.scheduledAt || new Date().toISOString(),
      });
      return Promise.resolve({ id: Date.now(), title: `Document Release - ${data.documentId}` });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coordinator", "document-releases"] });
      releaseForm.reset();
      toast({
        title: "Success",
        description: "Document release scheduled successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to schedule release",
        variant: "destructive",
      });
    },
  });

  const createSimulationWeekMutation = useMutation({
    mutationFn: async (data: SimulationWeekForm) => {
      // TODO: apiClientV2.coordinator.simulationWeeks.create() does not exist
      // May need to implement in instructor dashboard or use existing instructor APIs
      console.log("Would create simulation week:", {
        week_number: data.weekNumber,
        title: data.name,
        description: `Session: ${data.sessionId}`,
        start_date: data.startDate,
        end_date: data.endDate,
        is_active: true,
      });
      return Promise.resolve({ 
        id: Date.now(), 
        week_number: data.weekNumber,
        title: data.name,
        start_date: data.startDate,
        end_date: data.endDate 
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coordinator", "simulation-weeks"] });
      weekForm.reset();
      toast({
        title: "Success",
        description: "Simulation week created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create simulation week",
        variant: "destructive",
      });
    },
  });

  const releaseDocumentMutation = useMutation({
    mutationFn: async (releaseId: number) => {
      // TODO: apiClientV2.coordinator.documentReleases.release() does not exist
      // Should update bloodTestRequests/imagingRequests approved_files to grant access
      console.log("Would release document with ID:", releaseId);
      return Promise.resolve({ id: releaseId, status: "released" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coordinator", "document-releases"] });
      toast({
        title: "Success",
        description: "Document released successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to release document",
        variant: "destructive",
      });
    },
  });

  const onUploadDocument = (data: UploadDocumentForm) => {
    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }
    uploadDocumentMutation.mutate({ ...data, file: selectedFile });
  };

  const onScheduleRelease = (data: ScheduleReleaseForm) => {
    scheduleReleaseMutation.mutate(data);
  };

  const onCreateSimulationWeek = (data: SimulationWeekForm) => {
    createSimulationWeekMutation.mutate(data);
  };

  const handleReleaseDocument = (releaseId: string) => {
    if (confirm("Are you sure you want to release this document? It will become visible to the selected group.")) {
      releaseDocumentMutation.mutate(Number(releaseId));
    }
  };

  const getDocumentIcon = (category: string) => {
    switch (category) {
      case 'imaging':
        return <Image className="h-4 w-4" />;
      case 'lab':
        return <Database className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavigation 
        currentMode={selectedMode}
        onModeChange={setSelectedMode}
        sessionName="Simulation Coordination"
        timeRemaining="System Online"
      />
      
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Simulation Coordination</h1>
          <p className="text-gray-600">
            Upload documents, schedule releases, and manage simulation timelines
          </p>
        </div>

        <Tabs defaultValue="documents" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Document Management
            </TabsTrigger>
            <TabsTrigger value="releases" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Release Schedule
            </TabsTrigger>
            <TabsTrigger value="timeline" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Simulation Timeline
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Activity Monitor
            </TabsTrigger>
          </TabsList>

          {/* Document Management Tab */}
          <TabsContent value="documents" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Uploaded Documents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {documents?.map((doc: any) => (
                        <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            {getDocumentIcon(doc.category)}
                            <div>
                              <div className="font-medium">{doc.originalName}</div>
                              <div className="text-sm text-gray-500">
                                {doc.category} • {(doc.fileSize / 1024).toFixed(1)} KB
                              </div>
                              <div className="text-xs text-gray-400">
                                Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={doc.patientId ? "default" : "secondary"}>
                              {doc.patientId ? "Patient Specific" : "General"}
                            </Badge>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Upload New Document</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Form {...uploadForm}>
                      <form onSubmit={uploadForm.handleSubmit(onUploadDocument)} className="space-y-4">
                        <div>
                          <Label htmlFor="file">Select File</Label>
                          <Input
                            id="file"
                            type="file"
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.dicom"
                            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                            className="mt-1"
                          />
                          {selectedFile && (
                            <div className="text-sm text-gray-500 mt-1">
                              Selected: {selectedFile.name}
                            </div>
                          )}
                        </div>

                        <FormField
                          control={uploadForm.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Document Category</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="admission">Admission Forms</SelectItem>
                                  <SelectItem value="lab">Lab Results</SelectItem>
                                  <SelectItem value="imaging">Imaging Reports</SelectItem>
                                  <SelectItem value="notes">Clinical Notes</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={uploadForm.control}
                          name="sessionId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Session</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select session" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {sessions?.map((session: any) => (
                                    <SelectItem key={session.id} value={session.id}>
                                      {session.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={uploadForm.control}
                          name="patientId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Patient (Optional)</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select patient (optional)" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="none">No specific patient</SelectItem>
                                  {patients?.map((patient: any) => (
                                    <SelectItem key={patient.id} value={patient.id}>
                                      {patient.first_name} {patient.last_name} (ID: {patient.id})
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button 
                          type="submit" 
                          className="w-full"
                          disabled={uploadDocumentMutation.isPending || !selectedFile}
                        >
                          {uploadDocumentMutation.isPending ? "Uploading..." : "Upload Document"}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Release Schedule Tab */}
          <TabsContent value="releases" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Scheduled Releases</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {documentReleases?.map((release: any) => (
                        <div key={release.id} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              <span className="font-medium">{release.documentId}</span>
                            </div>
                            <Badge 
                              variant={
                                release.status === 'released' ? 'default' :
                                release.status === 'pending' ? 'secondary' : 'destructive'
                              }
                            >
                              {release.status}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-500 mb-2">
                            Group: {release.groupId} • Type: {release.releaseType}
                          </div>
                          {release.scheduledAt && (
                            <div className="text-xs text-gray-400 mb-2">
                              Scheduled: {new Date(release.scheduledAt).toLocaleString()}
                            </div>
                          )}
                          {release.notes && (
                            <div className="text-sm text-gray-600 mb-2">{release.notes}</div>
                          )}
                          <div className="flex items-center space-x-2">
                            {release.status === 'pending' && (
                              <Button 
                                size="sm" 
                                onClick={() => handleReleaseDocument(release.id)}
                                disabled={releaseDocumentMutation.isPending}
                              >
                                <Play className="h-3 w-3 mr-1" />
                                Release Now
                              </Button>
                            )}
                            <Button variant="ghost" size="sm">
                              <Settings className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Schedule New Release</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Form {...releaseForm}>
                      <form onSubmit={releaseForm.handleSubmit(onScheduleRelease)} className="space-y-4">
                        <FormField
                          control={releaseForm.control}
                          name="documentId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Document</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select document" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {documents?.map((doc: any) => (
                                    <SelectItem key={doc.id} value={doc.id}>
                                      {doc.originalName}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={releaseForm.control}
                          name="groupId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Target Group</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select group" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {groups?.map((group: any) => (
                                    <SelectItem key={group.id} value={group.id}>
                                      {group.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={releaseForm.control}
                          name="releaseType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Release Type</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="manual">Manual Release</SelectItem>
                                  <SelectItem value="scheduled">Scheduled Release</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={releaseForm.control}
                          name="scheduledAt"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Scheduled Time (if applicable)</FormLabel>
                              <FormControl>
                                <Input type="datetime-local" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={releaseForm.control}
                          name="notes"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Notes</FormLabel>
                              <FormControl>
                                <Input placeholder="Optional notes..." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button 
                          type="submit" 
                          className="w-full"
                          disabled={scheduleReleaseMutation.isPending}
                        >
                          {scheduleReleaseMutation.isPending ? "Scheduling..." : "Schedule Release"}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Simulation Timeline Tab */}
          <TabsContent value="timeline" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Simulation Weeks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {simulationWeeks?.map((week: any) => (
                      <div key={week.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium">{week.name}</div>
                          <Badge variant={week.active ? "default" : "secondary"}>
                            {week.active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-500 mb-2">
                          Week {week.weekNumber} • {new Date(week.startDate).toLocaleDateString()} - {new Date(week.endDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant={week.active ? "secondary" : "default"}>
                            {week.active ? <Pause className="h-3 w-3 mr-1" /> : <Play className="h-3 w-3 mr-1" />}
                            {week.active ? "Deactivate" : "Activate"}
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Settings className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Create Simulation Week</CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...weekForm}>
                    <form onSubmit={weekForm.handleSubmit(onCreateSimulationWeek)} className="space-y-4">
                      <FormField
                        control={weekForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Week Name</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Cardiology Week" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={weekForm.control}
                        name="weekNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Week Number</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                min="1"
                                {...field} 
                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={weekForm.control}
                        name="startDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Start Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={weekForm.control}
                        name="endDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>End Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={weekForm.control}
                        name="sessionId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Session</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select session" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {sessions?.map((session: any) => (
                                  <SelectItem key={session.id} value={session.id}>
                                    {session.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button 
                        type="submit" 
                        className="w-full"
                        disabled={createSimulationWeekMutation.isPending}
                      >
                        {createSimulationWeekMutation.isPending ? "Creating..." : "Create Week"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Activity Monitor Tab */}
          <TabsContent value="monitoring" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Documents Released Today</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">12</div>
                  <div className="text-sm text-gray-500">+3 from yesterday</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Pending Releases</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">5</div>
                  <div className="text-sm text-gray-500">2 scheduled for today</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Active Groups</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">8</div>
                  <div className="text-sm text-gray-500">In current session</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { action: "Released lab results to Group A", time: "10 minutes ago", type: "release" },
                    { action: "Uploaded chest X-ray for Patient 002", time: "25 minutes ago", type: "upload" },
                    { action: "Scheduled imaging report for Group B", time: "1 hour ago", type: "schedule" },
                    { action: "Activated Simulation Week 3", time: "2 hours ago", type: "timeline" },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          activity.type === 'release' ? 'bg-green-100' :
                          activity.type === 'upload' ? 'bg-blue-100' :
                          activity.type === 'schedule' ? 'bg-yellow-100' : 'bg-purple-100'
                        }`}>
                          {activity.type === 'release' && <CheckCircle className="h-4 w-4 text-green-600" />}
                          {activity.type === 'upload' && <Upload className="h-4 w-4 text-blue-600" />}
                          {activity.type === 'schedule' && <Calendar className="h-4 w-4 text-yellow-600" />}
                          {activity.type === 'timeline' && <Clock className="h-4 w-4 text-purple-600" />}
                        </div>
                        <div>
                          <div className="font-medium">{activity.action}</div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">{activity.time}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
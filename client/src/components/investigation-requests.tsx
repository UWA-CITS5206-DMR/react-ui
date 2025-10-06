import { useState, useEffect } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { apiClientV2 } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Send, FlaskConical, Scan, List, Clock, CheckCircle, Plus } from "lucide-react";
import type { BloodTestType, ImagingTestType, BloodTestRequest, ImagingRequest } from "@/lib/api-client-v2";

interface InvestigationRequestsProps {
  patientId: string;
}

export default function InvestigationRequests({ patientId }: InvestigationRequestsProps) {
  // Blood Test Request State
  const [bloodTestType, setBloodTestType] = useState<BloodTestType | "">("");
  const [bloodTestReason, setBloodTestReason] = useState("");
  
  // Imaging Request State
  const [imagingTestType, setImagingTestType] = useState<ImagingTestType | "">("");
  const [imagingReason, setImagingReason] = useState("");
  
  // Shared Sign-off state
  const [signOffName, setSignOffName] = useState("");
  const [signOffRole, setSignOffRole] = useState("");
  
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Initialize name and role from user
  useEffect(() => {
    if (user) {
      const userName = user.first_name && user.last_name 
        ? `${user.first_name} ${user.last_name}` 
        : user.username;
      const userRole = user.role || "student";
      setSignOffName(userName);
      setSignOffRole(userRole);
    }
  }, [user]);

  // Fetch blood test requests
  const { data: bloodTestRequests } = useQuery({
    queryKey: ["blood-test-requests", patientId],
    queryFn: () => apiClientV2.studentGroups.bloodTestRequests.list({ patient: patientId }),
  });

  // Fetch imaging requests
  const { data: imagingRequests } = useQuery({
    queryKey: ["imaging-requests", patientId],
    queryFn: () => apiClientV2.studentGroups.imagingRequests.list({ patient: patientId }),
  });

  // Blood test options from API BloodTestType
  const bloodTestOptions: BloodTestType[] = [
    "FBC",
    "EUC",
    "LFTs",
    "Coags",
    "CRP",
    "TFT",
    "Group and Hold"
  ];

  // Imaging test options from API ImagingTestType
  const imagingTestOptions: ImagingTestType[] = [
    "X-ray",
    "CT scan",
    "MRI scan",
    "Ultrasound scan",
    "Echocardiogram"
  ];

  // Create blood test request mutation
  const createBloodTestMutation = useMutation({
    mutationFn: async () => {
      if (!user) {
        throw new Error("User not authenticated");
      }

      return apiClientV2.studentGroups.bloodTestRequests.create({
        patient: parseInt(patientId),
        user: user.id,
        test_type: bloodTestType as BloodTestType,
        reason: bloodTestReason,
        status: "pending",
        name: signOffName,
        role: signOffRole
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blood-test-requests", patientId] });
      toast({
        title: "Success",
        description: "Blood test request submitted successfully!"
      });
      // Reset form
      setBloodTestType("");
      setBloodTestReason("");
    },
    onError: () => {
      toast({
        title: "Error", 
        description: "Failed to submit blood test request. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Create imaging request mutation
  const createImagingMutation = useMutation({
    mutationFn: async () => {
      if (!user) {
        throw new Error("User not authenticated");
      }

      return apiClientV2.studentGroups.imagingRequests.create({
        patient: parseInt(patientId),
        user: user.id,
        test_type: imagingTestType as ImagingTestType,
        reason: imagingReason,
        status: "pending",
        name: signOffName,
        role: signOffRole
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["imaging-requests", patientId] });
      toast({
        title: "Success",
        description: "Imaging request submitted successfully!"
      });
      // Reset form
      setImagingTestType("");
      setImagingReason("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit imaging request. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleBloodTestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bloodTestType || !bloodTestReason || !signOffName || !signOffRole) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields including your name and role.",
        variant: "destructive"
      });
      return;
    }

    createBloodTestMutation.mutate();
  };

  const handleImagingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!imagingTestType || !imagingReason || !signOffName || !signOffRole) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields including your name and role.",
        variant: "destructive"
      });
      return;
    }

    createImagingMutation.mutate();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-AU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="blood-tests" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="blood-tests">
            <FlaskConical className="h-4 w-4 mr-2" />
            Blood Tests
          </TabsTrigger>
          <TabsTrigger value="imaging">
            <Scan className="h-4 w-4 mr-2" />
            Imaging
          </TabsTrigger>
        </TabsList>

        {/* Blood Tests Tab */}
        <TabsContent value="blood-tests">
          <Tabs defaultValue="create" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="create">
                <Plus className="h-4 w-4 mr-2" />
                Create Request
              </TabsTrigger>
              <TabsTrigger value="view">
                <List className="h-4 w-4 mr-2" />
                View Requests
              </TabsTrigger>
            </TabsList>

            {/* Create Blood Test */}
            <TabsContent value="create">
              <form onSubmit={handleBloodTestSubmit}>
                <Card>
                  <CardHeader>
                    <CardTitle>Blood Test Request</CardTitle>
                    <CardDescription>Submit a new blood test request for this patient</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Test Type Selection */}
                    <div className="space-y-2">
                      <Label htmlFor="blood-test-type">Test Type *</Label>
                      <Select
                        value={bloodTestType}
                        onValueChange={(value) => setBloodTestType(value as BloodTestType)}
                      >
                        <SelectTrigger id="blood-test-type">
                          <SelectValue placeholder="Select blood test type" />
                        </SelectTrigger>
                        <SelectContent>
                          {bloodTestOptions.map((test) => (
                            <SelectItem key={test} value={test}>
                              {test}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Clinical Reason */}
                    <div className="space-y-2">
                      <Label htmlFor="blood-test-reason">Clinical Reasoning *</Label>
                      <Textarea
                        id="blood-test-reason"
                        value={bloodTestReason}
                        onChange={(e) => setBloodTestReason(e.target.value)}
                        placeholder="Explain your reasoning for this blood test request..."
                        rows={4}
                      />
                    </div>

                    {/* Sign-off Section - Horizontal Layout */}
                    <Card className="bg-muted/50">
                      <CardHeader>
                        <CardTitle className="text-sm">Sign-off Information</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="signoff-name">Name *</Label>
                            <Input
                              id="signoff-name"
                              value={signOffName}
                              onChange={(e) => setSignOffName(e.target.value)}
                              placeholder="Enter your full name"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="signoff-role">Role *</Label>
                            <Input
                              id="signoff-role"
                              value={signOffRole}
                              onChange={(e) => setSignOffRole(e.target.value)}
                              placeholder="e.g., Medical Student"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Button
                      type="submit"
                      className="w-full bg-hospital-blue hover:bg-hospital-blue/90"
                      disabled={createBloodTestMutation.isPending}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      {createBloodTestMutation.isPending ? "Submitting..." : "Submit Blood Test Request"}
                    </Button>
                  </CardContent>
                </Card>
              </form>
            </TabsContent>

            {/* View Blood Test Requests */}
            <TabsContent value="view">
              <Card>
                <CardHeader>
                  <CardTitle>Blood Test Requests</CardTitle>
                  <CardDescription>View all blood test requests for this patient</CardDescription>
                </CardHeader>
                <CardContent>
                  {!bloodTestRequests || bloodTestRequests.results.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No blood test requests found</p>
                  ) : (
                    <div className="space-y-4">
                      {bloodTestRequests.results.map((request: BloodTestRequest) => (
                        <Card key={request.id}>
                          <CardContent className="pt-6">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h3 className="font-semibold text-lg">{request.test_type}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {formatDate(request.created_at)}
                                </p>
                              </div>
                              <Badge variant={request.status === "completed" ? "default" : "secondary"}>
                                {request.status === "completed" ? (
                                  <><CheckCircle className="h-3 w-3 mr-1" /> Completed</>
                                ) : (
                                  <><Clock className="h-3 w-3 mr-1" /> Pending</>
                                )}
                              </Badge>
                            </div>
                            <div className="space-y-2">
                              <div>
                                <p className="text-sm font-medium">Reason:</p>
                                <p className="text-sm text-muted-foreground">{request.reason}</p>
                              </div>
                              <div className="border-t pt-2 mt-2">
                                <p className="text-xs text-muted-foreground">
                                  Requested by: {request.name} ({request.role})
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* Imaging Tab */}
        <TabsContent value="imaging">
          <Tabs defaultValue="create" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="create">
                <Plus className="h-4 w-4 mr-2" />
                Create Request
              </TabsTrigger>
              <TabsTrigger value="view">
                <List className="h-4 w-4 mr-2" />
                View Requests
              </TabsTrigger>
            </TabsList>

            {/* Create Imaging Request */}
            <TabsContent value="create">
              <form onSubmit={handleImagingSubmit}>
                <Card>
                  <CardHeader>
                    <CardTitle>Imaging Request</CardTitle>
                    <CardDescription>Submit a new imaging request for this patient</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Test Type Selection */}
                    <div className="space-y-2">
                      <Label htmlFor="imaging-test-type">Imaging Type *</Label>
                      <Select
                        value={imagingTestType}
                        onValueChange={(value) => setImagingTestType(value as ImagingTestType)}
                      >
                        <SelectTrigger id="imaging-test-type">
                          <SelectValue placeholder="Select imaging type" />
                        </SelectTrigger>
                        <SelectContent>
                          {imagingTestOptions.map((imaging) => (
                            <SelectItem key={imaging} value={imaging}>
                              {imaging}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Clinical Reason */}
                    <div className="space-y-2">
                      <Label htmlFor="imaging-reason">Clinical Reasoning *</Label>
                      <Textarea
                        id="imaging-reason"
                        value={imagingReason}
                        onChange={(e) => setImagingReason(e.target.value)}
                        placeholder="Explain your reasoning for this imaging request..."
                        rows={4}
                      />
                    </div>

                    {/* Sign-off Section - Horizontal Layout */}
                    <Card className="bg-muted/50">
                      <CardHeader>
                        <CardTitle className="text-sm">Sign-off Information</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="signoff-name-imaging">Name *</Label>
                            <Input
                              id="signoff-name-imaging"
                              value={signOffName}
                              onChange={(e) => setSignOffName(e.target.value)}
                              placeholder="Enter your full name"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="signoff-role-imaging">Role *</Label>
                            <Input
                              id="signoff-role-imaging"
                              value={signOffRole}
                              onChange={(e) => setSignOffRole(e.target.value)}
                              placeholder="e.g., Medical Student"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Button
                      type="submit"
                      className="w-full bg-hospital-blue hover:bg-hospital-blue/90"
                      disabled={createImagingMutation.isPending}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      {createImagingMutation.isPending ? "Submitting..." : "Submit Imaging Request"}
                    </Button>
                  </CardContent>
                </Card>
              </form>
            </TabsContent>

            {/* View Imaging Requests */}
            <TabsContent value="view">
              <Card>
                <CardHeader>
                  <CardTitle>Imaging Requests</CardTitle>
                  <CardDescription>View all imaging requests for this patient</CardDescription>
                </CardHeader>
                <CardContent>
                  {!imagingRequests || imagingRequests.results.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No imaging requests found</p>
                  ) : (
                    <div className="space-y-4">
                      {imagingRequests.results.map((request: ImagingRequest) => (
                        <Card key={request.id}>
                          <CardContent className="pt-6">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h3 className="font-semibold text-lg">{request.test_type}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {formatDate(request.created_at)}
                                </p>
                              </div>
                              <Badge variant={request.status === "completed" ? "default" : "secondary"}>
                                {request.status === "completed" ? (
                                  <><CheckCircle className="h-3 w-3 mr-1" /> Completed</>
                                ) : (
                                  <><Clock className="h-3 w-3 mr-1" /> Pending</>
                                )}
                              </Badge>
                            </div>
                            <div className="space-y-2">
                              <div>
                                <p className="text-sm font-medium">Reason:</p>
                                <p className="text-sm text-muted-foreground">{request.reason}</p>
                              </div>
                              <div className="border-t pt-2 mt-2">
                                <p className="text-xs text-muted-foreground">
                                  Requested by: {request.name} ({request.role})
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  );
}

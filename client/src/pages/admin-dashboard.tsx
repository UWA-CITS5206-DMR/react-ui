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
  Users, 
  Database, 
  UserPlus, 
  Settings, 
  Activity, 
  Shield,
  Edit3,
  Trash2,
  Eye,
  Plus,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";
import TopNavigation from "@/components/layout/top-navigation";

// Form schemas
const createDataVersionSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  version: z.string().min(1, "Version is required"),
  sessionId: z.string().min(1, "Session is required"),
});

const createGroupAccountSchema = z.object({
  groupId: z.string().min(1, "Group is required"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const createUserSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  role: z.enum(["student", "instructor", "coordinator"]),
});

type CreateDataVersionForm = z.infer<typeof createDataVersionSchema>;
type CreateGroupAccountForm = z.infer<typeof createGroupAccountSchema>;
type CreateUserForm = z.infer<typeof createUserSchema>;

export default function AdminDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedMode, setSelectedMode] = useState<"student" | "instructor">("instructor");

  // Queries using API Client v2
  // Note: Sessions API removed as backend uses token auth instead of session auth
  
  // TODO: Admin API endpoints not available in API Client v2 - implement when backend provides these endpoints
  const { data: usersResponse } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: () => {
      // TODO: apiClientV2.admin.users.list() does not exist
      return Promise.resolve({ results: [] });
    },
  });
  const users = usersResponse?.results || [];

  // TODO: dataVersions API not available in API Client v2
  const { data: dataVersionsResponse } = useQuery({
    queryKey: ["admin", "data-versions"],
    queryFn: () => {
      // TODO: apiClientV2.admin.dataVersions.list() does not exist
      return Promise.resolve({ results: [] });
    },
  });
  const dataVersions = dataVersionsResponse?.results || [];

  // TODO: groupAccounts API not available in API Client v2
  const { data: groupAccountsResponse } = useQuery({
    queryKey: ["admin", "group-accounts"],
    queryFn: () => {
      // TODO: apiClientV2.admin.groupAccounts.list() does not exist
      return Promise.resolve({ results: [] });
    },
  });
  const groupAccounts = groupAccountsResponse?.results || [];

  // TODO: auditLogs API not available in API Client v2
  const { data: auditLogsResponse } = useQuery({
    queryKey: ["admin", "audit-logs"],
    queryFn: () => {
      // TODO: apiClientV2.admin.auditLogs.list() does not exist
      return Promise.resolve({ results: [] });
    },
  });
  const auditLogs = auditLogsResponse?.results || [];

  // Forms
  const dataVersionForm = useForm<CreateDataVersionForm>({
    resolver: zodResolver(createDataVersionSchema),
    defaultValues: {
      name: "",
      description: "",
      version: "",
      sessionId: "",
    },
  });

  const groupAccountForm = useForm<CreateGroupAccountForm>({
    resolver: zodResolver(createGroupAccountSchema),
    defaultValues: {
      groupId: "",
      username: "",
      password: "",
    },
  });

  const userForm = useForm<CreateUserForm>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      username: "",
      password: "",
      firstName: "",
      lastName: "",
      role: "student",
    },
  });

  // Mutations using API Client v2
  const createDataVersionMutation = useMutation({
    mutationFn: async (data: CreateDataVersionForm) => {
      // TODO: apiClientV2.admin.dataVersions.create() does not exist
      console.log("Would create data version:", data);
      return Promise.resolve({ id: Date.now(), ...data });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "data-versions"] });
      dataVersionForm.reset();
      toast({
        title: "Success",
        description: "Data version created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create data version",
        variant: "destructive",
      });
    },
  });

  const createGroupAccountMutation = useMutation({
    mutationFn: async (data: CreateGroupAccountForm) => {
      // TODO: apiClientV2.admin.groupAccounts.create() does not exist
      console.log("Would create group account:", data);
      return Promise.resolve({ id: Date.now(), ...data });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "group-accounts"] });
      groupAccountForm.reset();
      toast({
        title: "Success",
        description: "Group account created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create group account",
        variant: "destructive",
      });
    },
  });

  const createUserMutation = useMutation({
    mutationFn: async (data: CreateUserForm) => {
      // TODO: apiClientV2.admin.users.create() does not exist
      console.log("Would create user:", {
        username: data.username,
        password: data.password,
        first_name: data.firstName,
        last_name: data.lastName,
        role: data.role,
      });
      return Promise.resolve({ 
        id: Date.now(), 
        username: data.username,
        first_name: data.firstName,
        last_name: data.lastName,
        role: data.role,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      userForm.reset();
      toast({
        title: "Success",
        description: "User created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create user",
        variant: "destructive",
      });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: number) => {
      // TODO: apiClientV2.admin.users.delete() does not exist
      console.log("Would delete user:", userId);
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete user",
        variant: "destructive",
      });
    },
  });

  const onCreateDataVersion = (data: CreateDataVersionForm) => {
    createDataVersionMutation.mutate(data);
  };

  const onCreateGroupAccount = (data: CreateGroupAccountForm) => {
    createGroupAccountMutation.mutate(data);
  };

  const onCreateUser = (data: CreateUserForm) => {
    createUserMutation.mutate(data);
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      deleteUserMutation.mutate(parseInt(userId));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavigation 
        currentMode={selectedMode}
        onModeChange={setSelectedMode}
        sessionName="System Administration"
        timeRemaining="System Online"
      />
      
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">System Administration</h1>
          <p className="text-gray-600">
            Manage group versions, user accounts, and system permissions
          </p>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              User Management
            </TabsTrigger>
            <TabsTrigger value="versions" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Data Versions
            </TabsTrigger>
            <TabsTrigger value="accounts" className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Group Accounts
            </TabsTrigger>
            <TabsTrigger value="permissions" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Permissions
            </TabsTrigger>
            <TabsTrigger value="audit" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Audit Trail
            </TabsTrigger>
          </TabsList>

          {/* User Management Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>All Users</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {users?.map((user: any) => (
                        <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <div className="font-medium">{user.first_name} {user.last_name}</div>
                            <div className="text-sm text-gray-500">@{user.username}</div>
                            <Badge 
                              variant={user.role === 'admin' ? 'destructive' : 
                                      user.role === 'coordinator' ? 'secondary' : 
                                      user.role === 'instructor' ? 'default' : 'outline'}
                            >
                              {user.role}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeleteUser(user.id)}
                              disabled={user.role === 'admin'}
                            >
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
                    <CardTitle>Create New User</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Form {...userForm}>
                      <form onSubmit={userForm.handleSubmit(onCreateUser)} className="space-y-4">
                        <FormField
                          control={userForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Username</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={userForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <Input type="password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={userForm.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={userForm.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={userForm.control}
                          name="role"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Role</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="student">Student</SelectItem>
                                  <SelectItem value="instructor">Instructor</SelectItem>
                                  <SelectItem value="coordinator">Coordinator</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button 
                          type="submit" 
                          className="w-full"
                          disabled={createUserMutation.isPending}
                        >
                          {createUserMutation.isPending ? "Creating..." : "Create User"}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Data Versions Tab */}
          <TabsContent value="versions" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Data Versions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {dataVersions?.map((version: any) => (
                        <div key={version.id} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-medium">{version.name}</div>
                            <Badge>{version.version}</Badge>
                          </div>
                          <div className="text-sm text-gray-500 mb-2">{version.description}</div>
                          <div className="text-xs text-gray-400">
                            Created: {new Date(version.createdAt).toLocaleDateString()}
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
                    <CardTitle>Create Data Version</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Form {...dataVersionForm}>
                      <form onSubmit={dataVersionForm.handleSubmit(onCreateDataVersion)} className="space-y-4">
                        <FormField
                          control={dataVersionForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={dataVersionForm.control}
                          name="version"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Version</FormLabel>
                              <FormControl>
                                <Input placeholder="v1.0" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={dataVersionForm.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={dataVersionForm.control}
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
                                  {/* TODO: Sessions API not available - implement when backend provides session management */}
                                  <SelectItem value="no-sessions">No sessions available</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button 
                          type="submit" 
                          className="w-full"
                          disabled={createDataVersionMutation.isPending}
                        >
                          {createDataVersionMutation.isPending ? "Creating..." : "Create Version"}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Group Accounts Tab */}
          <TabsContent value="accounts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Group Account Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    {groupAccounts?.map((account: any) => (
                      <div key={account.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">@{account.username}</div>
                            <div className="text-sm text-gray-500">Group: {account.groupId}</div>
                            <Badge variant={account.active ? "default" : "secondary"}>
                              {account.active ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <h3 className="font-medium mb-4">Create Group Account</h3>
                    <Alert className="mb-4">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        Group accounts provide shared access for student groups to assigned patient data versions.
                      </AlertDescription>
                    </Alert>
                    {/* Group account creation form would go here */}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Permissions Tab */}
          <TabsContent value="permissions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Permission Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      Configure role-based permissions for different user types.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Students</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          View assigned patients
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          Write SOAP notes
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          Place orders
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Instructors</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          All student permissions
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          Control scenarios
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          Manage groups
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Coordinators</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          Upload documents
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          Schedule releases
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          Manage timeline
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Admins</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          All permissions
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          User management
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          System configuration
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Audit Trail Tab */}
          <TabsContent value="audit" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Activity Audit Trail</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {auditLogs?.slice(0, 10).map((log: any) => (
                    <div key={log.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Activity className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium">{log.action}</div>
                          <div className="text-sm text-gray-500">
                            {log.entityType} • {log.entityId}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{log.performedBy}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(log.timestamp).toLocaleString()}
                        </div>
                      </div>
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
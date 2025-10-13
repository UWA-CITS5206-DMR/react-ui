import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Users,
  Clock,
  Shield,
  Stethoscope,
  GraduationCap,
  UserCog,
  BookOpen,
} from "lucide-react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { getErrorMessage } from "@/lib/error-utils";

export default function Landing() {
  useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const { login } = useAuth();

  const loginMutation = useMutation({
    mutationFn: async ({ username, password }: { username: string; password: string }) => {
      const success = await login(username, password);
      if (!success) {
        throw new Error("Invalid username or password");
      }

      // Get user from localStorage to determine role for immediate redirect
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        return user;
      }
      throw new Error("Login failed");
    },
    onSuccess: (user) => {
      // Use immediate window.location for fastest navigation
      const targetPath =
        user.role === "admin" ? "/admin" : user.role === "instructor" ? "/instructor" : "/student";

      // Force immediate navigation
      window.location.href = targetPath;
    },
    onError: (error: any) => {
      toast({
        title: "Login Failed",
        description: getErrorMessage(error, "Invalid username or password."),
        variant: "destructive",
      });
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password) {
      loginMutation.mutate({ username, password });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Stethoscope className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">
              Digital Medical Records (DMR) Simulation System
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A web-based Digital Medical Record simulation system for UWA's ward simulation program,
            helping final-year medical students and nurses practice with electronic medical systems
            before entering hospital workplaces.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left Side - Features */}
          <div className="space-y-6">
            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-blue-200 hover:shadow-lg transition-shadow">
                <CardHeader className="text-center pb-4">
                  <FileText className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                  <CardTitle className="text-lg">Realistic EHR Interface</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 text-center">
                    Experience authentic hospital EHR systems with patient records, vitals, labs,
                    and imaging studies.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-green-200 hover:shadow-lg transition-shadow">
                <CardHeader className="text-center pb-4">
                  <Users className="h-12 w-12 text-green-600 mx-auto mb-2" />
                  <CardTitle className="text-lg">Team Collaboration</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 text-center">
                    Work together in real-time with fellow students on complex patient cases and
                    scenarios.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-orange-200 hover:shadow-lg transition-shadow">
                <CardHeader className="text-center pb-4">
                  <Clock className="h-12 w-12 text-orange-600 mx-auto mb-2" />
                  <CardTitle className="text-lg">Dynamic Scenarios</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 text-center">
                    Experience time-based patient progression with evolving symptoms and test
                    results.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-purple-200 hover:shadow-lg transition-shadow">
                <CardHeader className="text-center pb-4">
                  <Shield className="h-12 w-12 text-purple-600 mx-auto mb-2" />
                  <CardTitle className="text-lg">Instructor Controls</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 text-center">
                    Instructors can create scenarios, monitor progress, and guide learning
                    experiences.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* User Role Badges */}
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Platform Users</h3>
              <div className="flex flex-wrap justify-center gap-2">
                <Badge variant="outline" className="px-4 py-2 text-blue-600 border-blue-300">
                  <GraduationCap className="h-4 w-4 mr-2" />
                  Nursing Students
                </Badge>
                <Badge variant="outline" className="px-4 py-2 text-green-600 border-green-300">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Medical Students
                </Badge>
                <Badge variant="outline" className="px-4 py-2 text-purple-600 border-purple-300">
                  <UserCog className="h-4 w-4 mr-2" />
                  Clinical Instructors
                </Badge>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="flex justify-center">
            <Card className="w-full max-w-md shadow-xl border-0">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-gray-900">Welcome Back</CardTitle>
                <CardDescription>Sign in to access the DMR simulation system</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your username"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Platform Benefits */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Why Choose Our Platform?</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Safe Learning Environment</h4>
              <p className="text-gray-600">
                Practice without risk to real patients. Make mistakes and learn from them in a
                controlled environment.
              </p>
            </div>
            <div className="p-6">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Comprehensive Tracking</h4>
              <p className="text-gray-600">
                Monitor progress with detailed analytics and assessment tools for continuous
                improvement.
              </p>
            </div>
            <div className="p-6">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Collaborative Learning</h4>
              <p className="text-gray-600">
                Work in teams just like in real healthcare settings, building essential
                communication skills.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-200 text-center text-gray-600">
          <p>
            &copy; 2025 Digital Medical Records (DMR) Simulation System - UWA Ward Simulation
            Program
          </p>
        </footer>
      </div>
    </div>
  );
}

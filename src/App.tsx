import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import Landing from "@/pages/landing";
import StudentDashboard from "@/pages/student-dashboard";
import InstructorDashboard from "@/pages/instructor-dashboard";
import AdminDashboard from "@/pages/admin-dashboard";
import CoordinatorDashboard from "@/pages/coordinator-dashboard";
import GroupManager from "@/pages/group-manager";
import NotFound from "@/pages/not-found";

function AppRouter() {
  const { user, isLoading } = useAuth();

  // Reduce loading time by checking localStorage immediately
  if (isLoading) {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      // If we have stored user, minimize loading screen time
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-lg">Loading...</div>
        </div>
      );
    }
    return <Landing />;
  }

  if (!user) {
    return <Landing />;
  }

  const getDashboard = () => {
    switch (user.role) {
      case "admin":
        return AdminDashboard;
      case "coordinator":
        return CoordinatorDashboard;
      case "instructor":
        return InstructorDashboard;
      case "student":
        return StudentDashboard;
      default:
        return StudentDashboard;
    }
  };

  return (
    <Switch>
      <Route path="/" component={getDashboard()} />
      <Route path="/student" component={StudentDashboard} />
      <Route path="/instructor" component={InstructorDashboard} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/coordinator" component={CoordinatorDashboard} />
      <Route path="/group-manager" component={GroupManager} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <AppRouter />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

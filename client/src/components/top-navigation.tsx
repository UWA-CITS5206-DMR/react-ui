import { Hospital, Users, User, Settings } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

interface TopNavigationProps {
  currentMode: "student" | "instructor";
  onModeChange: (mode: "student" | "instructor") => void;
  sessionName?: string;
  timeRemaining?: string;
}

export default function TopNavigation({ 
  currentMode, 
  onModeChange, 
  sessionName = "Emergency Department Scenario",
  timeRemaining = "42:15"
}: TopNavigationProps) {
  const { user, logout } = useAuth();

  return (
    <header className="bg-hospital-blue text-white px-6 py-4 flex items-center justify-between shadow-lg">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Hospital className="h-6 w-6" />
          <h1 className="text-xl font-semibold">Digital Medical Records</h1>
          <span className="bg-white/20 px-2 py-1 rounded text-sm font-medium">
            Simulation Platform
          </span>
        </div>
      </div>
      
      <div className="flex items-center space-x-6">
        {user?.role === "instructor" && (
          <>
            <div className="flex items-center space-x-2">
              <span className="text-sm">Mode:</span>
              <select 
                value={currentMode}
                onChange={(e) => onModeChange(e.target.value as "student" | "instructor")}
                className="bg-white/10 border border-white/20 rounded px-3 py-1 text-sm"
              >
                <option value="instructor">Instructor Mode</option>
                <option value="student">Student Mode</option>
              </select>
            </div>
            <Link href="/group-manager">
              <Button 
                variant="ghost" 
                size="sm"
                className="bg-white/10 hover:bg-white/20 text-white flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Group Manager
              </Button>
            </Link>
          </>
        )}
        
        <div className="flex items-center space-x-2">
          <Users className="h-4 w-4" />
          <span className="text-sm">{sessionName}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm">Time: {timeRemaining}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <User className="h-4 w-4" />
          </div>
          <span className="text-sm">{user?.firstName} {user?.lastName}</span>
        </div>
        
        <Button 
          onClick={logout}
          variant="ghost" 
          size="sm"
          className="bg-white/10 hover:bg-white/20 text-white"
        >
          Logout
        </Button>
      </div>
    </header>
  );
}

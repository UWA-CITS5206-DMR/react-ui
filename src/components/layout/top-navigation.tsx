import { Hospital, User } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

interface TopNavigationProps {
  // Empty for now, but kept for future extensions
}

export default function TopNavigation(_: TopNavigationProps) {
  const { user, logout } = useAuth();

  return (
    <header className="bg-hospital-blue text-white px-2 sm:px-4 md:px-6 py-3 sm:py-4 flex items-center justify-between shadow-lg min-w-0">
      <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4 min-w-0 flex-1">
        <Hospital className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" />
        <h1 className="text-sm sm:text-base md:text-xl font-semibold truncate min-w-0">
          <span className="hidden sm:inline">Digital Medical Records (DMR)</span>
          <span className="sm:hidden">DMR</span>
        </h1>
        <span className="hidden md:inline-block bg-white/20 px-2 py-1 rounded text-sm font-medium flex-shrink-0">
          Simulation System
        </span>
      </div>
      
      <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-6 flex-shrink-0">
        <div className="flex items-center space-x-1 sm:space-x-2">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
            <User className="h-4 w-4" />
          </div>
          <span className="text-xs sm:text-sm hidden md:inline-block truncate max-w-[120px]">
            {user?.first_name} {user?.last_name}
          </span>
        </div>
        
        <Button 
          onClick={logout}
          variant="ghost" 
          size="sm"
          className="bg-white/10 hover:bg-white/20 text-white text-xs px-2 sm:px-4 flex-shrink-0"
        >
          Logout
        </Button>
      </div>
    </header>
  );
}

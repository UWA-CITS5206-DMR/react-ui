import { createContext, useContext, useState, useEffect } from "react";
import { apiClientV2 } from "@/lib/queryClient";
import type { User } from "@/lib/api-client-v2";

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    // Initialize state directly from localStorage to avoid delay
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Listen for storage events from other tabs/windows
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "user") {
        setUser(e.newValue ? JSON.parse(e.newValue) : null);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // --- English version of the login function ---
  const login = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    try {
      setIsLoading(true);
      // Call apiClientV2 login method
      const response = await apiClientV2.auth.login({ username, password });
      
      // Check if response contains both user and token
      if (response && response.user && response.token) {
        // Store user info in component state
        setUser(response.user);
        // Store complete auth data (user + token) in localStorage
        localStorage.setItem("user", JSON.stringify({
          ...response.user,
          token: response.token
        }));
        setIsLoading(false);
        return true;
      }
      
      // If response is missing user or token, treat as failure
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error("Login error:", error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = async () => {
    try {
      // Call backend logout endpoint (good practice)
      await apiClientV2.auth.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear user info from frontend regardless of backend success
      setUser(null);
      localStorage.removeItem("user");
      // Force page refresh to ensure complete state reset
      window.location.reload();
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
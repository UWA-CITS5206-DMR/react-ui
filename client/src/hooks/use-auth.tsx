import { createContext, useContext, useState, useEffect } from "react";
import { apiClientV2 } from "@/lib/api-client-v2";
import type { User } from "@shared/schema";

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

  // --- 这是我们修改的核心部分 ---
  const login = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    try {
      setIsLoading(true);
      // 调用 apiClientV2 的登录方法
      const response = await apiClientV2.auth.login({ username, password });
      
      // 检查 response 和 response.user 是否存在
      if (response && response.user) {
        setUser(response.user);
        localStorage.setItem("user", JSON.stringify(response.user));
        setIsLoading(false);
        return true;
      }
      
      // 如果 response 或 user 不存在，也视为失败
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
      // 同时调用后端的登出接口（好习惯）
      await apiClientV2.auth.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // 无论后端是否成功，前端都清除用户信息
      setUser(null);
      localStorage.removeItem("user");
      // 强制刷新页面以确保状态完全重置
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
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { ApiUser, LoginRequest, RegisterRequest } from "../types/api";
import { loginApi, registerApi, logoutApi } from "../api/services/auth";
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
  decodeToken,
  isTokenExpired,
} from "../api/tokenStorage";

interface AuthContextType {
  user: ApiUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<ApiUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session from stored token on mount
  useEffect(() => {
    const token = getAccessToken();
    if (token && !isTokenExpired(token)) {
      const payload = decodeToken(token);
      if (payload) {
        setUser({
          id: Number(payload.user_id),
          email: payload.email ?? "",
          full_name: "",
          role: (payload.role as ApiUser["role"]) ?? "student",
        });
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (data: LoginRequest) => {
    const res = await loginApi(data);
    setTokens(res.access, res.refresh);
    setUser(res.user);
    queryClient.invalidateQueries();
  }, [queryClient]);

  const register = useCallback(async (data: RegisterRequest) => {
    const res = await registerApi(data);
    setTokens(res.tokens.access, res.tokens.refresh);
    setUser(res.user);
    queryClient.invalidateQueries();
  }, [queryClient]);

  const logout = useCallback(async () => {
    const refresh = getRefreshToken();
    try {
      if (refresh) await logoutApi({ refresh });
    } catch {
      // Ignore logout API errors (token may already be blacklisted)
    } finally {
      clearTokens();
      setUser(null);
      queryClient.removeQueries();
    }
  }, [queryClient]);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    isLoading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

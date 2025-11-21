import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { insertUserSchema, User as SelectUser, InsertUser } from "@shared/schema";
import { getQueryFn, apiRequest, queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type AuthContextType = {
  user: SelectUser | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<SelectUser, Error, LoginData>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerMutation: UseMutationResult<SelectUser, Error, InsertUser>;
  isGuest: boolean;
};

type LoginData = Pick<InsertUser, "username" | "password">;

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [isGuest, setIsGuest] = useState(false);
  const [guestUser, setGuestUser] = useState<SelectUser | null>(null);

  // Check for guest user on mount, or create default guest
  useEffect(() => {
    const storedGuestUser = sessionStorage.getItem('guestUser');
    if (storedGuestUser) {
      setGuestUser(JSON.parse(storedGuestUser));
      setIsGuest(true);
    } else {
      // Create default guest user since auth is removed
      const defaultGuest = {
        id: 'guest',
        username: 'guest',
        displayName: 'Fire Safety Hero',
        ageGroup: 'kids' as const,
        level: 1,
        points: 0,
        progress: 0,
        isAdmin: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setGuestUser(defaultGuest);
      setIsGuest(true);
      sessionStorage.setItem('guestUser', JSON.stringify(defaultGuest));
    }
  }, []);

  const {
    data: user,
    error,
    isLoading,
  } = useQuery<SelectUser | null, Error>({
    queryKey: ['/api/user'],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: !isGuest, // Only fetch from server if not in guest mode
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData) => {
      const res = await apiRequest("POST", "/api/login", credentials);
      return await res.json();
    },
    onSuccess: (user: SelectUser) => {
      // Clear guest mode when logging in
      sessionStorage.removeItem('guestUser');
      setIsGuest(false);
      setGuestUser(null);
      queryClient.setQueryData(["/api/user"], user);
      toast({
        title: "Login successful",
        description: `Welcome back, ${user.displayName || user.username}!`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (credentials: InsertUser) => {
      const res = await apiRequest("POST", "/api/register", credentials);
      return await res.json();
    },
    onSuccess: (user: SelectUser) => {
      // Clear guest mode when registering
      sessionStorage.removeItem('guestUser');
      setIsGuest(false);
      setGuestUser(null);
      queryClient.setQueryData(["/api/user"], user);
      toast({
        title: "Registration successful",
        description: `Welcome, ${user.displayName || user.username}!`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/logout");
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/user"], null);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Return guest user if in guest mode, otherwise return server user
  const currentUser = isGuest ? guestUser : user;

  return (
    <AuthContext.Provider
      value={{
        user: currentUser ?? null,
        isLoading: isGuest ? false : isLoading,
        error,
        loginMutation,
        logoutMutation,
        registerMutation,
        isGuest,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
import { createContext, ReactNode, useContext } from "react";
import { AuthProvider, useAuth as useAuthHook } from "@/hooks/use-auth";

export function ContextProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}

export const useAuth = useAuthHook;

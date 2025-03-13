import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { Loader2 } from "lucide-react";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-fire-red" />
      </div>
    );
  }

  if (!user || (user.id !== 1 && user.username !== 'admin')) {
    return <Redirect to="/auth" />;
  }

  return <>{children}</>;
}
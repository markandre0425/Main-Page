import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";

export function ProtectedRoute({
  path,
  component: Component,
}: {
  path: string;
  component: () => React.JSX.Element;
}) {
  const { user, isLoading } = useAuth();

  console.log("Protected route check - path:", path, "user:", user, "loading:", isLoading);

  if (isLoading) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-fire-red" />
        </div>
      </Route>
    );
  }

  if (!user) {
    console.log("No user found, redirecting to /auth");
    return (
      <Route path={path}>
        <Redirect to="/auth" />
      </Route>
    );
  }

  console.log("User authenticated, rendering component for path:", path);
  return (
    <Route path={path}>
      <Component />
    </Route>
  );
}

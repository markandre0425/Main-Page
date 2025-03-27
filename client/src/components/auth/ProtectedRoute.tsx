import { ReactNode } from 'react';
import { useLocation, Redirect } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const [location] = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-[#FF5722] mx-auto" />
          <p className="mt-4 font-fredoka text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Redirect to={`/auth?redirect=${encodeURIComponent(location)}`} />;
  }

  return <>{children}</>;
}
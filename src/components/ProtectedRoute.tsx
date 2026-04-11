import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="gradient-card p-8 shadow-card">
          <div className="text-center space-y-4">
            <div className="inline-block w-8 h-8 border-4 border-transparent border-t-primary rounded-full animate-spin" />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </Card>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

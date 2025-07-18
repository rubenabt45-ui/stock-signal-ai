
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ChartCandlestick } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // CRITICAL: Only redirect if we're actually on an /app route AND user is not authenticated
    if (!loading && !user && location.pathname.startsWith('/app')) {
      console.log('🔒 ProtectedRoute: Redirecting unauthenticated user from:', location.pathname);
      navigate('/login');
      return;
    }
  }, [user, loading, navigate, location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen bg-tradeiq-navy flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <ChartCandlestick className="h-12 w-12 text-tradeiq-blue animate-pulse" />
          <div className="text-white text-lg font-medium">Loading...</div>
          <div className="text-gray-400 text-sm">TradeIQ</div>
        </div>
      </div>
    );
  }

  // Don't render if no user and we're on a protected route
  if (!user && location.pathname.startsWith('/app')) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

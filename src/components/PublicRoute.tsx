
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import { ChartCandlestick } from 'lucide-react';

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // CRITICAL: Only redirect authenticated users away from auth pages, never from landing
    if (!loading && user) {
      const currentPath = window.location.pathname;
      if (currentPath === '/login' || currentPath === '/signup' || currentPath === '/forgot-password') {
        console.log('🔓 PublicRoute: Redirecting authenticated user from auth page:', currentPath);
        navigate('/app/dashboard');
      }
    }
  }, [user, loading, navigate]);

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

  // If user is authenticated and on an auth page, don't render (let redirect happen)
  if (user) {
    const currentPath = window.location.pathname;
    if (currentPath === '/login' || currentPath === '/signup' || currentPath === '/forgot-password') {
      return null;
    }
  }

  return <>{children}</>;
};

export default PublicRoute;

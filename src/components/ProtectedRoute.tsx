
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
    if (!loading) {
      // If user is authenticated and tries to visit login/signup, redirect to trading chat
      if (user && (location.pathname === '/login' || location.pathname === '/signup')) {
        navigate('/trading-chat');
        return;
      }
      
      // If user is not authenticated and tries to access protected route, redirect to login
      if (!user && location.pathname !== '/login' && location.pathname !== '/signup' && location.pathname !== '/pricing') {
        navigate('/login');
        return;
      }
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

  if (!user) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

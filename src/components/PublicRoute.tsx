
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ChartCandlestick } from 'lucide-react';

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate('/app');
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

  if (user) {
    return null;
  }

  return <>{children}</>;
};

export default PublicRoute;

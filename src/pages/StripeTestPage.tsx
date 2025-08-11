
import React, { Suspense } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

// Lazy load the StripeTestRunner to avoid bundling in production
const StripeTestRunner = React.lazy(() => import('@/components/StripeTestRunner'));

const StripeTestPage = () => {
  const { user } = useAuth();
  
  // Check if Stripe testing is enabled
  const isStripeTestEnabled = import.meta.env.VITE_ENABLE_STRIPE_TEST === 'true';
  
  if (!isStripeTestEnabled) {
    return <Navigate to="/app" replace />;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        }>
          <StripeTestRunner />
        </Suspense>
      </div>
    </div>
  );
};

export default StripeTestPage;

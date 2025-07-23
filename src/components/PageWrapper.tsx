import React, { Suspense } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ErrorFallback } from '@/components/ErrorFallback';

interface PageWrapperProps {
  children: React.ReactNode;
  pageName?: string;
}

const PageLoadingFallback = () => (
  <div className="min-h-screen bg-tradeiq-navy flex items-center justify-center">
    <div className="text-white text-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tradeiq-blue mx-auto"></div>
      <div className="text-lg">Loading...</div>
    </div>
  </div>
);

export const PageWrapper: React.FC<PageWrapperProps> = ({ children, pageName }) => {
  return (
    <ErrorBoundary 
      componentName={pageName || 'Page'}
      fallback={<ErrorFallback message="⚠️ Our servers are currently experiencing issues. Please try again later." />}
    >
      <Suspense fallback={<PageLoadingFallback />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
};
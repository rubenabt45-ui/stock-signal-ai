
import React, { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from './ErrorFallback';
import I18nErrorBoundary from './I18nErrorBoundary';

interface PageWrapperProps {
  children: React.ReactNode;
  pageName?: string;
}

const LoadingFallback = ({ pageName }: { pageName?: string }) => (
  <div className="min-h-screen bg-tradeiq-navy flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tradeiq-blue mx-auto mb-4"></div>
      <p className="text-white">Loading {pageName || 'page'}...</p>
    </div>
  </div>
);

export const PageWrapper: React.FC<PageWrapperProps> = ({ children, pageName }) => {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        console.error(`🚨 [PAGE_ERROR] Error in ${pageName || 'Unknown'} page:`, error);
        console.error('🚨 [PAGE_ERROR] Error info:', errorInfo);
      }}
    >
      <I18nErrorBoundary>
        <Suspense fallback={<LoadingFallback pageName={pageName} />}>
          {children}
        </Suspense>
      </I18nErrorBoundary>
    </ErrorBoundary>
  );
};

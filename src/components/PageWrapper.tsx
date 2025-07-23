
import React, { Suspense } from 'react';
import { ErrorBoundary } from './ErrorBoundary';
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
      componentName={`${pageName || 'Unknown'}Page`}
      fallback={
        <div className="min-h-screen bg-tradeiq-navy flex items-center justify-center">
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 m-4 max-w-md">
            <div className="text-red-400 text-center">
              <h3 className="font-semibold mb-2">Page Error</h3>
              <p className="text-red-300 mb-4">
                Something went wrong loading this page. Please try refreshing.
              </p>
              <button 
                onClick={() => window.location.reload()}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      }
    >
      <I18nErrorBoundary>
        <Suspense fallback={<LoadingFallback pageName={pageName} />}>
          {children}
        </Suspense>
      </I18nErrorBoundary>
    </ErrorBoundary>
  );
};


import React from 'react';
import { ErrorBoundary } from './ErrorBoundary';

interface I18nErrorBoundaryProps {
  children: React.ReactNode;
}

const I18nErrorBoundary: React.FC<I18nErrorBoundaryProps> = ({ children }) => {
  return (
    <ErrorBoundary 
      componentName="I18nErrorBoundary"
      fallback={
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 m-4">
          <div className="text-red-400 text-sm">
            <h3 className="font-semibold mb-2">Translation Error</h3>
            <p className="text-red-300">
              There was an issue loading translations. The app will continue with fallback content.
            </p>
          </div>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
};

export default I18nErrorBoundary;

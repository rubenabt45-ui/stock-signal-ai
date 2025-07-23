
import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from './ErrorFallback';

interface I18nErrorBoundaryProps {
  children: React.ReactNode;
}

const I18nErrorBoundary: React.FC<I18nErrorBoundaryProps> = ({ children }) => {
  const handleError = (error: Error, errorInfo: any) => {
    console.error('🌐 [I18N_ERROR_BOUNDARY] Caught error:', error);
    console.error('🌐 [I18N_ERROR_BOUNDARY] Error info:', errorInfo);
    
    // Check if it's an i18n related error
    if (error.message.includes('i18n') || error.message.includes('translation')) {
      console.error('🌐 [I18N_ERROR_BOUNDARY] i18n system error detected');
    }
    
    // Check if it's a Supabase related error
    if (error.message.includes('supabase') || error.message.includes('auth')) {
      console.error('🔐 [SUPABASE_ERROR_BOUNDARY] Supabase error detected');
    }
  };

  return (
    <ErrorBoundary 
      FallbackComponent={ErrorFallback}
      onError={handleError}
    >
      {children}
    </ErrorBoundary>
  );
};

export default I18nErrorBoundary;

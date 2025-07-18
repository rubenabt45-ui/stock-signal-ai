import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface DiagnosticWrapperProps {
  children: React.ReactNode;
  routeName: string;
}

export const DiagnosticWrapper: React.FC<DiagnosticWrapperProps> = ({ children, routeName }) => {
  const location = useLocation();
  
  useEffect(() => {
    console.log(`🔍 ${routeName} route rendered at:`, location.pathname);
    
    // Prevent any navigation away from landing page when it should be accessible
    if (routeName === 'Landing' && location.pathname === '/') {
      console.log('🏠 Landing page successfully rendered - no redirects should occur');
      
      // Override any potential redirects for the landing page
      const originalPushState = window.history.pushState;
      const originalReplaceState = window.history.replaceState;
      
      const preventRedirect = (target: string) => {
        if (target.includes('/login') && location.pathname === '/') {
          console.error('🚨 BLOCKED: Attempted redirect from Landing to /login');
          return false;
        }
        return true;
      };
      
      window.history.pushState = function(state, title, url) {
        if (preventRedirect(url?.toString() || '')) {
          return originalPushState.call(this, state, title, url);
        }
      };
      
      window.history.replaceState = function(state, title, url) {
        if (preventRedirect(url?.toString() || '')) {
          return originalReplaceState.call(this, state, title, url);
        }
      };
      
      // Cleanup on unmount
      return () => {
        window.history.pushState = originalPushState;
        window.history.replaceState = originalReplaceState;
      };
    }
  }, [location.pathname, routeName]);
  
  return <>{children}</>;
};
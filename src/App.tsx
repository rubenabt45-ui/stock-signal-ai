
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Analytics } from '@/components/Analytics';
import { LoadingFallback } from '@/components/LoadingFallback';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import ProtectedRoute from '@/components/ProtectedRoute';
import PublicRoute from '@/components/PublicRoute';
import { Toaster } from '@/components/ui/toaster';
import { SEOHead } from '@/components/SEOHead';
import { setupGlobalErrorHandling, errorLogger } from '@/utils/errorLogging';
import { logEnvironmentValidation } from '@/utils/envValidation';
import { logPerformanceMetrics } from '@/utils/performanceMetrics';

// Standard imports for always-needed pages
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import NotFound from '@/pages/NotFound';
import ResetPasswordRequest from '@/pages/ResetPasswordRequest';
import ResetPassword from '@/pages/ResetPassword';
import VerifyEmail from '@/pages/VerifyEmail';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import TermsOfService from '@/pages/TermsOfService';
import CookiePolicy from '@/pages/CookiePolicy';
import BillingSuccess from '@/pages/BillingSuccess';
import Cancel from '@/pages/Cancel';
import Success from '@/pages/Success';
import Pricing from '@/pages/Pricing';
import LearnPreview from '@/pages/LearnPreview';

// Lazy imports for heavy components
import { 
  LazyDashboard,
  LazyTradingChat,
  LazyMarketUpdates,
  LazyEconomicEvents,
  LazySettings,
  LazyBilling,
  LazyNewsAI,
  LazyLearn
} from '@/utils/lazyImports';

// Conditional imports based on environment
import StripeTestPage from '@/pages/StripeTestPage';

// Create a stable query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // Don't retry on auth errors
        if (error?.message?.includes('unauthorized') || error?.status === 401) {
          return false;
        }
        return failureCount < 2;
      },
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (previously cacheTime)
    },
  },
});

// Initialize production readiness features
const initializeApp = () => {
  // Set up global error handling
  setupGlobalErrorHandling();
  
  // Validate environment
  logEnvironmentValidation();
  
  // Log performance metrics in production
  logPerformanceMetrics();
  
  // Log app initialization
  errorLogger.logInfo('TradeIQ application initialized', {
    environment: import.meta.env.MODE,
    production: import.meta.env.PROD
  });
};

// Initialize app
initializeApp();

function App() {
  const isStripeTestEnabled = import.meta.env.VITE_ENABLE_STRIPE_TEST === 'true';

  return (
    <ErrorBoundary>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <ThemeProvider>
              <Router>
                <SEOHead />
                <Analytics />
                
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={
                    <PublicRoute>
                      <Index />
                    </PublicRoute>
                  } />
                  
                  <Route path="/login" element={
                    <PublicRoute>
                      <Login />
                    </PublicRoute>
                  } />
                  
                  <Route path="/signup" element={
                    <PublicRoute>
                      <Signup />
                    </PublicRoute>
                  } />
                  
                  <Route path="/reset-password-request" element={
                    <PublicRoute>
                      <ResetPasswordRequest />
                    </PublicRoute>
                  } />
                  
                  <Route path="/reset-password" element={
                    <PublicRoute>
                      <ResetPassword />
                    </PublicRoute>
                  } />
                  
                  <Route path="/verify-email" element={
                    <PublicRoute>
                      <VerifyEmail />
                    </PublicRoute>
                  } />

                  {/* Legal pages */}
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/terms-of-service" element={<TermsOfService />} />
                  <Route path="/cookie-policy" element={<CookiePolicy />} />
                  
                  {/* Marketing pages */}
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/learn-preview" element={<LearnPreview />} />
                  
                  {/* Payment result pages */}
                  <Route path="/billing/success" element={<BillingSuccess />} />
                  <Route path="/cancel" element={<Cancel />} />
                  <Route path="/success" element={<Success />} />

                  {/* Protected app routes */}
                  <Route path="/app" element={
                    <ProtectedRoute>
                      <LazyDashboard />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/app/trading-chat" element={
                    <ProtectedRoute>
                      <LazyTradingChat />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/app/market-updates" element={
                    <ProtectedRoute>
                      <LazyMarketUpdates />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/app/economic-events" element={
                    <ProtectedRoute>
                      <LazyEconomicEvents />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/app/news-ai" element={
                    <ProtectedRoute>
                      <LazyNewsAI />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/app/learn" element={
                    <ProtectedRoute>
                      <LazyLearn />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/app/settings" element={
                    <ProtectedRoute>
                      <LazySettings />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/billing" element={
                    <ProtectedRoute>
                      <LazyBilling />
                    </ProtectedRoute>
                  } />

                  {/* Development/Test routes - conditionally enabled */}
                  {isStripeTestEnabled && (
                    <Route path="/dev/stripe-test" element={
                      <ProtectedRoute>
                        <StripeTestPage />
                      </ProtectedRoute>
                    } />
                  )}

                  {/* 404 fallback */}
                  <Route path="*" element={<NotFound />} />
                </Routes>

                <Toaster />
              </Router>
            </ThemeProvider>
          </AuthProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;

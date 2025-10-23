import React, { Suspense, lazy, Component, ErrorInfo, ReactNode } from "react";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import PublicRoute from "@/components/PublicRoute";
import BottomNavigation from "@/components/BottomNavigation";
import Footer from "@/components/Footer";

// Error boundary for lazy loaded routes
class LazyLoadErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Lazy load error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-tradeiq-navy flex items-center justify-center p-4">
          <div className="text-center space-y-4 max-w-md">
            <h2 className="text-xl font-bold text-white">Loading Error</h2>
            <p className="text-gray-400">Failed to load this page. This is usually a temporary issue.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-tradeiq-blue hover:bg-tradeiq-blue/80 text-white rounded-lg transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Helper function to retry failed lazy imports
const retryLazyImport = (fn: () => Promise<any>, retriesLeft = 3, interval = 1000): Promise<any> => {
  return new Promise((resolve, reject) => {
    fn()
      .then(resolve)
      .catch((error) => {
        setTimeout(() => {
          if (retriesLeft === 1) {
            // If this was the last retry, reload the page to clear cache
            console.error('Failed to load module after retries, reloading page...');
            window.location.reload();
            reject(error);
            return;
          }

          console.log(`Retrying import... (${retriesLeft - 1} retries left)`);
          retryLazyImport(fn, retriesLeft - 1, interval).then(resolve, reject);
        }, interval);
      });
  });
};

// Lazy load pages for code splitting with retry logic
const Landing = lazy(() => retryLazyImport(() => import("./pages/Landing")));
const LearnPreview = lazy(() => retryLazyImport(() => import("./pages/LearnPreview")));
const Dashboard = lazy(() => retryLazyImport(() => import("./pages/Dashboard")));
const ChartIA = lazy(() => retryLazyImport(() => import("./pages/Index")));
const Favorites = lazy(() => retryLazyImport(() => import("./pages/Favorites")));
const TradingChat = lazy(() => retryLazyImport(() => import("./pages/TradingChat")));
const Learn = lazy(() => retryLazyImport(() => import("./pages/Learn")));
const MarketUpdates = lazy(() => retryLazyImport(() => import("./pages/MarketUpdates")));
const News = lazy(() => retryLazyImport(() => import("./pages/News")));
const Settings = lazy(() => retryLazyImport(() => import("./pages/Settings")));
const Success = lazy(() => retryLazyImport(() => import("./pages/Success")));
const Cancel = lazy(() => retryLazyImport(() => import("./pages/Cancel")));
const Login = lazy(() => retryLazyImport(() => import("./pages/Login")));
const Signup = lazy(() => retryLazyImport(() => import("./pages/Signup")));
const ForgotPassword = lazy(() => retryLazyImport(() => import("./pages/ForgotPassword")));
const ResetPassword = lazy(() => retryLazyImport(() => import("./pages/ResetPassword")));
const ResetPasswordRequest = lazy(() => retryLazyImport(() => import("./pages/ResetPasswordRequest")));
const Pricing = lazy(() => retryLazyImport(() => import("./pages/Pricing")));
const VerifyEmail = lazy(() => retryLazyImport(() => import("./pages/VerifyEmail")));
const NotFound = lazy(() => retryLazyImport(() => import("./pages/NotFound")));
const PrivacyPolicy = lazy(() => retryLazyImport(() => import("./pages/PrivacyPolicy")));
const TermsOfService = lazy(() => retryLazyImport(() => import("./pages/TermsOfService")));
const CookiePolicy = lazy(() => retryLazyImport(() => import("./pages/CookiePolicy")));
const About = lazy(() => retryLazyImport(() => import("./pages/About")));
const Blog = lazy(() => retryLazyImport(() => import("./pages/Blog")));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen bg-tradeiq-navy flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tradeiq-blue mx-auto mb-4"></div>
      <p className="text-white">Loading...</p>
    </div>
  </div>
);

// Component to handle conditional footer rendering for app routes
const AppFooterWrapper = () => {
  const location = useLocation();
  const isStrategyAI = location.pathname === '/app/strategy-ai';
  
  return (
    <div className={isStrategyAI ? "" : "pb-20"}>
      {!isStrategyAI && <Footer />}
      <BottomNavigation />
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-tradeiq-navy">
        <LazyLoadErrorBoundary>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* PUBLIC LANDING PAGES */}
              <Route path="/" element={<Landing />} />
              <Route path="/learn-preview" element={<LearnPreview />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/cookie-policy" element={<CookiePolicy />} />
              <Route path="/about" element={<About />} />
              <Route path="/blog" element={<Blog />} />
              
              {/* AUTHENTICATION ROUTES */}
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
              <Route path="/forgot-password" element={
                <PublicRoute>
                 <ForgotPassword />
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
              
              {/* PROTECTED APP ROUTES */}
              <Route path="/app" element={
                <ProtectedRoute>
                  <Navigate to="/app/dashboard" replace />
                </ProtectedRoute>
              } />
              <Route path="/app/chartia" element={
                <ProtectedRoute>
                  <ChartIA />
                </ProtectedRoute>
              } />
              <Route path="/app/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/app/strategy-ai" element={
                <ProtectedRoute>
                  <TradingChat />
                </ProtectedRoute>
              } />
              <Route path="/app/learn" element={
                <ProtectedRoute>
                  <Learn />
                </ProtectedRoute>
              } />
              <Route path="/app/market-updates" element={
                <ProtectedRoute>
                  <MarketUpdates />
                </ProtectedRoute>
              } />
              <Route path="/app/news" element={
                <ProtectedRoute>
                  <News />
                </ProtectedRoute>
              } />
              <Route path="/app/favorites" element={
                <ProtectedRoute>
                  <Favorites />
                </ProtectedRoute>
              } />
              <Route path="/app/settings" element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } />
              
              {/* PAYMENT ROUTES */}
              <Route path="/success" element={
                <ProtectedRoute>
                  <Success />
                </ProtectedRoute>
              } />
              <Route path="/cancel" element={
                <ProtectedRoute>
                  <Cancel />
                </ProtectedRoute>
              } />
              
              {/* 404 FALLBACK */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </LazyLoadErrorBoundary>
          
          {/* CONDITIONAL FOOTER AND NAVIGATION */}
          <Routes>
            {/* Footer and bottom nav for app routes with conditional logic */}
            <Route path="/app/*" element={<AppFooterWrapper />} />
          </Routes>
        </div>
      </BrowserRouter>
  );
};

export default App;

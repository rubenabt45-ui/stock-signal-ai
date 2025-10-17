import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AppProviders } from "@/providers/AppProviders";
import ProtectedRoute from "@/components/ProtectedRoute";
import PublicRoute from "@/components/PublicRoute";
import BottomNavigation from "@/components/BottomNavigation";
import Footer from "@/components/Footer";

// Lazy load pages for code splitting
const Landing = lazy(() => import("./pages/Landing"));
const LearnPreview = lazy(() => import("./pages/LearnPreview"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const ChartIA = lazy(() => import("./pages/Index"));
const Favorites = lazy(() => import("./pages/Favorites"));
const TradingChat = lazy(() => import("./pages/TradingChat"));
const Learn = lazy(() => import("./pages/Learn"));
const MarketUpdates = lazy(() => import("./pages/MarketUpdates"));
const News = lazy(() => import("./pages/News"));
const Settings = lazy(() => import("./pages/Settings"));
const Success = lazy(() => import("./pages/Success"));
const Cancel = lazy(() => import("./pages/Cancel"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const ResetPasswordRequest = lazy(() => import("./pages/ResetPasswordRequest"));
const Pricing = lazy(() => import("./pages/Pricing"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));
const NotFound = lazy(() => import("./pages/NotFound"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const CookiePolicy = lazy(() => import("./pages/CookiePolicy"));
const About = lazy(() => import("./pages/About"));
const Blog = lazy(() => import("./pages/Blog"));
const Careers = lazy(() => import("./pages/Careers"));

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
    <AppProviders>
      <BrowserRouter>
        <div className="min-h-screen bg-tradeiq-navy">
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
              <Route path="/careers" element={<Careers />} />
              
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
                  <Navigate to="/app/chartia" replace />
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
          
          {/* CONDITIONAL FOOTER AND NAVIGATION */}
          <Routes>
            {/* Footer and bottom nav for app routes with conditional logic */}
            <Route path="/app/*" element={<AppFooterWrapper />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AppProviders>
  );
};

export default App;

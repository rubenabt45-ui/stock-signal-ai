
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { CookieConsent } from "@/components/CookieConsent";
import I18nErrorBoundary from "@/components/I18nErrorBoundary";

// Page imports
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ResetPasswordRequest from "./pages/ResetPasswordRequest";
import VerifyEmail from "./pages/VerifyEmail";
import Dashboard from "./pages/Dashboard";
import TradingChat from "./pages/TradingChat";
import Learn from "./pages/Learn";
import LearnPreview from "./pages/LearnPreview";
import Settings from "./pages/Settings";
import Pricing from "./pages/Pricing";
import Success from "./pages/Success";
import Cancel from "./pages/Cancel";
import EconomicEvents from "./pages/EconomicEvents";
import MarketUpdates from "./pages/MarketUpdates";
import Favorites from "./pages/Favorites";
import NewsAI from "./pages/NewsAI";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Blog from "./pages/Blog";
import Careers from "./pages/Careers";
import Configuration from "./pages/Configuration";

// Legal pages
import Terms from "./pages/legal/Terms";
import Privacy from "./pages/legal/Privacy";
import Cookies from "./pages/legal/Cookies";

// Legacy legal pages (redirect to new ones)
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CookiePolicy from "./pages/CookiePolicy";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

// Diagnostic components
const LandingRoute = () => {
  React.useEffect(() => {
    console.log('🏠 Landing route component mounted - SUCCESS!');
  }, []);
  return (
    <I18nErrorBoundary>
      <Landing />
    </I18nErrorBoundary>
  );
};

const NotFoundRoute = () => {
  React.useEffect(() => {
    console.log('❌ 404 route matched for path:', window.location.pathname);
  }, []);
  return <NotFound />;
};

// Legacy redirect component
const LegacyRedirect = ({ to }: { to: string }) => {
  React.useEffect(() => {
    window.location.replace(to);
  }, [to]);
  return <div>Redirecting...</div>;
};

const App = () => {
  // Add route debugging
  React.useEffect(() => {
    console.log('🚀 App mounted, current pathname:', window.location.pathname);
    console.log('🚀 App mounted, current href:', window.location.href);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LanguageProvider>
          <I18nErrorBoundary>
            <ThemeProvider>
              <TooltipProvider>
                <BrowserRouter>
                  <Routes>
                    {/* Main routes */}
                    <Route path="/" element={<Index />} />
                    <Route path="/landing" element={<LandingRoute />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/reset-password-request" element={<ResetPasswordRequest />} />
                    <Route path="/verify-email" element={<VerifyEmail />} />
                    <Route path="/app" element={<Dashboard />} />
                    <Route path="/chat" element={<TradingChat />} />
                    <Route path="/learn" element={<Learn />} />
                    <Route path="/learn-preview" element={<LearnPreview />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/pricing" element={<Pricing />} />
                    <Route path="/success" element={<Success />} />
                    <Route path="/cancel" element={<Cancel />} />
                    <Route path="/economic-events" element={<EconomicEvents />} />
                    <Route path="/market-updates" element={<MarketUpdates />} />
                    <Route path="/favorites" element={<Favorites />} />
                    <Route path="/news-ai" element={<NewsAI />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/careers" element={<Careers />} />
                    <Route path="/configuration" element={<Configuration />} />

                    {/* New Legal pages */}
                    <Route path="/terms-of-service" element={<Terms />} />
                    <Route path="/privacy-policy" element={<Privacy />} />
                    <Route path="/cookie-policy" element={<Cookies />} />

                    {/* Legacy redirects for old legal pages */}
                    <Route 
                      path="/terms" 
                      element={<LegacyRedirect to="/terms-of-service" />} 
                    />
                    <Route 
                      path="/privacy" 
                      element={<LegacyRedirect to="/privacy-policy" />} 
                    />
                    <Route 
                      path="/cookies" 
                      element={<LegacyRedirect to="/cookie-policy" />} 
                    />

                    {/* Catch all - 404 page */}
                    <Route path="*" element={<NotFoundRoute />} />
                  </Routes>
                  <CookieConsent />
                </BrowserRouter>
                <Toaster />
                <Sonner />
              </TooltipProvider>
            </ThemeProvider>
          </I18nErrorBoundary>
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;

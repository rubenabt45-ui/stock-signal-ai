
import { Suspense, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ErrorBoundary } from "./components/ErrorBoundary";
import I18nErrorBoundary from "./components/I18nErrorBoundary";
import "./App.css";

// Lazy load pages for better performance
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ResetPasswordRequest from "./pages/ResetPasswordRequest";
import VerifyEmail from "./pages/VerifyEmail";
import AuthCallback from "./pages/AuthCallback";
import Dashboard from "./pages/Dashboard";
import TradingChat from "./pages/TradingChat";
import NewsAI from "./pages/NewsAI";
import EconomicEvents from "./pages/EconomicEvents";
import MarketUpdates from "./pages/MarketUpdates";
import Favorites from "./pages/Favorites";
import Settings from "./pages/Settings";
import Configuration from "./pages/Configuration";
import Pricing from "./pages/Pricing";
import About from "./pages/About";
import Learn from "./pages/Learn";
import LearnPreview from "./pages/LearnPreview";
import Blog from "./pages/Blog";
import Careers from "./pages/Careers";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookiePolicy from "./pages/CookiePolicy";
import Success from "./pages/Success";
import Cancel from "./pages/Cancel";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

const queryClient = new QueryClient();

function App() {
  useEffect(() => {
    console.log('🚀 App mounted, current pathname:', window.location.pathname);
    console.log('🚀 App mounted, current href:', window.location.href);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <I18nErrorBoundary>
        <LanguageProvider>
          <ThemeProvider>
            <AuthProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <ErrorBoundary>
                    <div className="min-h-screen bg-background">
                      <Suspense fallback={<div>Loading...</div>}>
                        <Routes>
                          {/* Public routes */}
                          <Route path="/" element={<Index />} />
                          <Route path="/landing" element={<Landing />} />
                          <Route path="/pricing" element={<Pricing />} />
                          <Route path="/about" element={<About />} />
                          <Route path="/learn" element={<Learn />} />
                          <Route path="/learn-preview" element={<LearnPreview />} />
                          <Route path="/blog" element={<Blog />} />
                          <Route path="/careers" element={<Careers />} />
                          <Route path="/privacy" element={<PrivacyPolicy />} />
                          <Route path="/terms" element={<TermsOfService />} />
                          <Route path="/cookies" element={<CookiePolicy />} />
                          
                          {/* Auth routes */}
                          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                          <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
                          <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
                          <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />
                          <Route path="/reset-password-request" element={<PublicRoute><ResetPasswordRequest /></PublicRoute>} />
                          <Route path="/verify-email" element={<PublicRoute><VerifyEmail /></PublicRoute>} />
                          <Route path="/auth/callback" element={<AuthCallback />} />
                          
                          {/* Payment routes */}
                          <Route path="/success" element={<Success />} />
                          <Route path="/cancel" element={<Cancel />} />
                          
                          {/* Protected routes */}
                          <Route path="/app" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                          <Route path="/chat" element={<ProtectedRoute><TradingChat /></ProtectedRoute>} />
                          <Route path="/news" element={<ProtectedRoute><NewsAI /></ProtectedRoute>} />
                          <Route path="/events" element={<ProtectedRoute><EconomicEvents /></ProtectedRoute>} />
                          <Route path="/market-updates" element={<ProtectedRoute><MarketUpdates /></ProtectedRoute>} />
                          <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
                          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                          <Route path="/configuration" element={<ProtectedRoute><Configuration /></ProtectedRoute>} />
                          
                          {/* 404 route */}
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </Suspense>
                    </div>
                  </ErrorBoundary>
                </BrowserRouter>
              </TooltipProvider>
            </AuthProvider>
          </ThemeProvider>
        </LanguageProvider>
      </I18nErrorBoundary>
    </QueryClientProvider>
  );
}

export default App;


import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { I18nErrorBoundary } from "@/components/I18nErrorBoundary";

// Pages
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AuthCallback from "./pages/AuthCallback";
import VerifyEmail from "./pages/VerifyEmail";
import ResetPasswordRequest from "./pages/ResetPasswordRequest";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import TradingChat from "./pages/TradingChat";
import Favorites from "./pages/Favorites";
import NewsAI from "./pages/NewsAI";
import EconomicEvents from "./pages/EconomicEvents";
import MarketUpdates from "./pages/MarketUpdates";
import About from "./pages/About";
import Pricing from "./pages/Pricing";
import Learn from "./pages/Learn";
import LearnPreview from "./pages/LearnPreview";
import Blog from "./pages/Blog";
import Careers from "./pages/Careers";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookiePolicy from "./pages/CookiePolicy";
import Success from "./pages/Success";
import Cancel from "./pages/Cancel";
import Configuration from "./pages/Configuration";
import NotFound from "./pages/NotFound";

import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LanguageProvider>
          <I18nErrorBoundary>
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
              <TooltipProvider>
                <Router>
                  <ErrorBoundary>
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/home" element={<Landing />} />
                      <Route path="/app" element={<Dashboard />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/signup" element={<Signup />} />
                      <Route path="/auth/callback" element={<AuthCallback />} />
                      <Route path="/verify-email" element={<VerifyEmail />} />
                      <Route path="/reset-password-request" element={<ResetPasswordRequest />} />
                      <Route path="/reset-password" element={<ResetPassword />} />
                      <Route path="/forgot-password" element={<ForgotPassword />} />
                      <Route path="/trading-chat" element={<TradingChat />} />
                      <Route path="/favorites" element={<Favorites />} />
                      <Route path="/news-ai" element={<NewsAI />} />
                      <Route path="/economic-events" element={<EconomicEvents />} />
                      <Route path="/market-updates" element={<MarketUpdates />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/pricing" element={<Pricing />} />
                      <Route path="/learn" element={<Learn />} />
                      <Route path="/learn-preview" element={<LearnPreview />} />
                      <Route path="/blog" element={<Blog />} />
                      <Route path="/careers" element={<Careers />} />
                      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                      <Route path="/terms-of-service" element={<TermsOfService />} />
                      <Route path="/cookie-policy" element={<CookiePolicy />} />
                      <Route path="/success" element={<Success />} />
                      <Route path="/cancel" element={<Cancel />} />
                      <Route path="/configuration" element={<Configuration />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </ErrorBoundary>
                </Router>
                <Toaster />
                <Sonner />
              </TooltipProvider>
            </ThemeProvider>
          </I18nErrorBoundary>
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

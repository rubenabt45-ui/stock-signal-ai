
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";
import "./App.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import I18nErrorBoundary from "@/components/I18nErrorBoundary";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPasswordRequest from "./pages/ResetPasswordRequest";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
import AuthCallback from "./pages/AuthCallback";
import OAuthDebug from "./pages/OAuthDebug";
import Dashboard from "./pages/Dashboard";
import TradingChat from "./pages/TradingChat";
import NewsAI from "./pages/NewsAI";
import MarketUpdates from "./pages/MarketUpdates";
import EconomicEvents from "./pages/EconomicEvents";
import Favorites from "./pages/Favorites";
import Settings from "./pages/Settings";
import Configuration from "./pages/Configuration";
import Pricing from "./pages/Pricing";
import Success from "./pages/Success";
import Cancel from "./pages/Cancel";
import About from "./pages/About";
import Blog from "./pages/Blog";
import Learn from "./pages/Learn";
import LearnPreview from "./pages/LearnPreview";
import Careers from "./pages/Careers";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookiePolicy from "./pages/CookiePolicy";
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";

// Protected and Public Route components
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

const queryClient = new QueryClient();

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <I18nErrorBoundary>
            <AuthProvider>
              <LanguageProvider>
                <ThemeProvider>
                  <Router>
                    <div className="App">
                      <Routes>
                        {/* Public routes */}
                        <Route path="/" element={<Index />} />
                        <Route path="/landing" element={<Landing />} />
                        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                        <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
                        <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
                        <Route path="/reset-password-request" element={<PublicRoute><ResetPasswordRequest /></PublicRoute>} />
                        <Route path="/reset-password" element={<ResetPassword />} />
                        <Route path="/verify-email" element={<VerifyEmail />} />
                        <Route path="/auth/callback" element={<AuthCallback />} />
                        <Route path="/oauth-debug" element={<OAuthDebug />} />
                        <Route path="/pricing" element={<Pricing />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/blog" element={<Blog />} />
                        <Route path="/learn" element={<Learn />} />
                        <Route path="/learn-preview" element={<LearnPreview />} />
                        <Route path="/careers" element={<Careers />} />
                        <Route path="/privacy" element={<PrivacyPolicy />} />
                        <Route path="/terms" element={<TermsOfService />} />
                        <Route path="/cookies" element={<CookiePolicy />} />

                        {/* Protected routes */}
                        <Route path="/app" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                        <Route path="/chat" element={<ProtectedRoute><TradingChat /></ProtectedRoute>} />
                        <Route path="/news" element={<ProtectedRoute><NewsAI /></ProtectedRoute>} />
                        <Route path="/market-updates" element={<ProtectedRoute><MarketUpdates /></ProtectedRoute>} />
                        <Route path="/economic-events" element={<ProtectedRoute><EconomicEvents /></ProtectedRoute>} />
                        <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
                        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                        <Route path="/configuration" element={<ProtectedRoute><Configuration /></ProtectedRoute>} />
                        <Route path="/success" element={<ProtectedRoute><Success /></ProtectedRoute>} />
                        <Route path="/cancel" element={<ProtectedRoute><Cancel /></ProtectedRoute>} />

                        {/* Catch all route */}
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                      <Toaster />
                    </div>
                  </Router>
                </ThemeProvider>
              </LanguageProvider>
            </AuthProvider>
          </I18nErrorBoundary>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;

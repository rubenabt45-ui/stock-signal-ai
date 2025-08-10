import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import PublicRoute from "@/components/PublicRoute";
import ErrorBoundary from "@/components/ErrorBoundary";

// Lazy load pages for better performance
const Index = lazy(() => import("./pages/Index"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const AuthCallback = lazy(() => import("./pages/AuthCallback"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const ResetPasswordRequest = lazy(() => import("./pages/ResetPasswordRequest"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));
const Pricing = lazy(() => import("./pages/Pricing"));
const AppLayout = lazy(() => import("@/layouts/AppLayout"));
const Dashboard = lazy(() => import("./pages/app/Dashboard"));
const StrategyAI = lazy(() => import("./pages/app/StrategyAI"));
const MarketUpdates = lazy(() => import("./pages/app/MarketUpdates"));
const Alerts = lazy(() => import("./pages/app/Alerts"));
const Learn = lazy(() => import("./pages/app/Learn"));
const Settings = lazy(() => import("./pages/app/Settings"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <Suspense fallback={<div>Loading...</div>}>
                  <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<PublicRoute><Index /></PublicRoute>} />
                    <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                    <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
                    <Route path="/auth/callback" element={<AuthCallback />} />
                    <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
                    <Route path="/reset-password/:token" element={<PublicRoute><ResetPassword /></PublicRoute>} />
                    <Route path="/reset-password-request" element={<PublicRoute><ResetPasswordRequest /></PublicRoute>} />
                    <Route path="/verify-email" element={<PublicRoute><VerifyEmail /></PublicRoute>} />
                    <Route path="/pricing" element={<PublicRoute><Pricing /></PublicRoute>} />

                    {/* App routes - Protected */}
                    <Route path="/app" element={<ProtectedRoute><AppLayout><Dashboard /></AppLayout></ProtectedRoute>} />
                    <Route path="/app/strategy-ai" element={<ProtectedRoute><AppLayout><StrategyAI /></AppLayout></ProtectedRoute>} />
                    <Route path="/app/market-updates" element={<ProtectedRoute><AppLayout><MarketUpdates /></AppLayout></ProtectedRoute>} />
                    <Route path="/app/alerts" element={<ProtectedRoute><AppLayout><Alerts /></AppLayout></ProtectedRoute>} />
                    <Route path="/app/learn" element={<ProtectedRoute><AppLayout><Learn /></AppLayout></ProtectedRoute>} />
                    <Route path="/app/settings" element={<ProtectedRoute><AppLayout><Settings /></AppLayout></ProtectedRoute>} />

                    {/* Not Found */}
                    <Route path="*" element={<PublicRoute><NotFound /></PublicRoute>} />
                  </Routes>
                </Suspense>
              </TooltipProvider>
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;

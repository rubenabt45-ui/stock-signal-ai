
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import PublicRoute from "@/components/PublicRoute";
import { PageWrapper } from "@/components/PageWrapper";
import I18nErrorBoundary from "@/components/I18nErrorBoundary";

const Home = lazy(() => import("@/pages/Index"));
const Login = lazy(() => import("@/pages/Login"));
const Signup = lazy(() => import("@/pages/Signup"));
const ResetPasswordRequest = lazy(() => import("@/pages/ResetPasswordRequest"));
const ResetPassword = lazy(() => import("@/pages/ResetPassword"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Settings = lazy(() => import("@/pages/Settings"));
const VerifyEmail = lazy(() => import("@/pages/VerifyEmail"));
const AuthCallback = lazy(() => import("@/pages/AuthCallback"));

const queryClient = new QueryClient();

function App() {
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
                  <Suspense fallback={<div>Loading...</div>}>
                    <Routes>
                      <Route path="/" element={<PageWrapper pageName="Home"><PublicRoute><Home /></PublicRoute></PageWrapper>} />
                      <Route path="/login" element={<PageWrapper pageName="Login"><PublicRoute><Login /></PublicRoute></PageWrapper>} />
                      <Route path="/signup" element={<PageWrapper pageName="Signup"><PublicRoute><Signup /></PublicRoute></PageWrapper>} />
                      <Route path="/reset-password-request" element={<PageWrapper pageName="Reset Password Request"><PublicRoute><ResetPasswordRequest /></PublicRoute></PageWrapper>} />
                      <Route path="/reset-password" element={<PageWrapper pageName="Reset Password"><PublicRoute><ResetPassword /></PublicRoute></PageWrapper>} />
                      <Route path="/verify-email" element={<PageWrapper pageName="Verify Email"><PublicRoute><VerifyEmail /></PublicRoute></PageWrapper>} />
                      
                      <Route
                        path="/app"
                        element={
                          <ProtectedRoute>
                            <Dashboard />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/app/account"
                        element={
                          <ProtectedRoute>
                            <Settings />
                          </ProtectedRoute>
                        }
                      />
                      
                      {/* OAuth Callback Route */}
                      <Route
                        path="/auth/callback"
                        element={<AuthCallback />}
                      />
                      
                      <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                  </Suspense>
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

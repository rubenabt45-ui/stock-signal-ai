
import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { RealTimePriceProvider } from "@/components/RealTimePriceProvider";
import ProtectedRoute from "@/components/ProtectedRoute";
import PublicRoute from "@/components/PublicRoute";
import BottomNavigation from "@/components/BottomNavigation";
import Footer from "@/components/Footer";
import { DiagnosticWrapper } from "@/components/DiagnosticWrapper";
import Landing from "./pages/Landing";
import LearnPreview from "./pages/LearnPreview";
import Dashboard from "./pages/Dashboard";
import Favorites from "./pages/Favorites";
import TradingChat from "./pages/TradingChat";
import Learn from "./pages/Learn";
import EconomicEvents from "./pages/EconomicEvents";
import MarketUpdates from "./pages/MarketUpdates";
import Settings from "./pages/Settings";
import Success from "./pages/Success";
import Cancel from "./pages/Cancel";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Pricing from "./pages/Pricing";
import VerifyEmail from "./pages/VerifyEmail";
import NotFound from "./pages/NotFound";

// Diagnostic components
const LandingRoute = () => {
  useEffect(() => {
    console.log('🏠 Landing route component mounted - SUCCESS!');
  }, []);
  return (
    <DiagnosticWrapper routeName="Landing">
      <Landing />
    </DiagnosticWrapper>
  );
};

const NotFoundRoute = () => {
  useEffect(() => {
    console.log('❌ 404 route matched for path:', window.location.pathname);
  }, []);
  return <NotFound />;
};

const queryClient = new QueryClient();

const App = () => {
  // Add route debugging
  useEffect(() => {
    console.log('🚀 App mounted, current pathname:', window.location.pathname);
    console.log('🚀 App mounted, current href:', window.location.href);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <LanguageProvider>
            <RealTimePriceProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <div className="min-h-screen bg-tradeiq-navy">
                    <Routes>
                      {/* PUBLIC LANDING PAGES - ZERO AUTH RESTRICTIONS */}
                      <Route path="/" element={<LandingRoute />} />
                      <Route path="/learn-preview" element={<LearnPreview />} />
                      <Route path="/pricing" element={<Pricing />} />
                      
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
                     <Route path="/verify-email" element={
                       <PublicRoute>
                         <VerifyEmail />
                       </PublicRoute>
                     } />
                     
                      
                      {/* PROTECTED APP ROUTES */}
                      <Route path="/app" element={
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
                      <Route path="/app/events" element={
                        <ProtectedRoute>
                          <EconomicEvents />
                        </ProtectedRoute>
                      } />
                      <Route path="/app/market-updates" element={
                        <ProtectedRoute>
                          <MarketUpdates />
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
                      
                      {/* LEGACY COMPATIBILITY ROUTES */}
                      <Route path="/app/trading-chat" element={
                        <ProtectedRoute>
                          <TradingChat />
                        </ProtectedRoute>
                      } />
                      <Route path="/app/configuration" element={
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
                      
                      {/* 404 FALLBACK - MUST BE LAST */}
                      <Route path="*" element={<NotFoundRoute />} />
                    </Routes>
                    
                    {/* CONDITIONAL FOOTER/NAV FOR APP ROUTES ONLY */}
                    <Routes>
                      <Route path="/app/*" element={
                        <div className="pb-20">
                          <Footer />
                          <BottomNavigation />
                        </div>
                      } />
                    </Routes>
                  </div>
                </BrowserRouter>
              </TooltipProvider>
            </RealTimePriceProvider>
          </LanguageProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;

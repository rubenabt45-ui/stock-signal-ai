
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider>
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <div className="min-h-screen bg-tradeiq-navy">
                <Routes>
                  {/* Public Landing Pages - NO AUTH LOGIC IN ROUTING */}
                  <Route path="/" element={<Landing />} />
                  <Route path="/learn-preview" element={<LearnPreview />} />
                  <Route path="/pricing" element={<Pricing />} />
                  
                  {/* Authentication Routes */}
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
                  
                  {/* Protected App Routes with RealTimePriceProvider */}
                  <Route path="/app/*" element={
                    <RealTimePriceProvider>
                      <Routes>
                        <Route path="/" element={
                          <ProtectedRoute>
                            <Dashboard />
                          </ProtectedRoute>
                        } />
                        <Route path="/strategy-ai" element={
                          <ProtectedRoute>
                            <TradingChat />
                          </ProtectedRoute>
                        } />
                        <Route path="/learn" element={
                          <ProtectedRoute>
                            <Learn />
                          </ProtectedRoute>
                        } />
                        <Route path="/events" element={
                          <ProtectedRoute>
                            <EconomicEvents />
                          </ProtectedRoute>
                        } />
                        <Route path="/market-updates" element={
                          <ProtectedRoute>
                            <MarketUpdates />
                          </ProtectedRoute>
                        } />
                        <Route path="/favorites" element={
                          <ProtectedRoute>
                            <Favorites />
                          </ProtectedRoute>
                        } />
                        <Route path="/settings" element={
                          <ProtectedRoute>
                            <Settings />
                          </ProtectedRoute>
                        } />
                        
                        {/* Legacy redirects for compatibility */}
                        <Route path="/trading-chat" element={
                          <ProtectedRoute>
                            <TradingChat />
                          </ProtectedRoute>
                        } />
                        <Route path="/configuration" element={
                          <ProtectedRoute>
                            <Settings />
                          </ProtectedRoute>
                        } />
                      </Routes>
                    </RealTimePriceProvider>
                  } />
                  
                  {/* Payment Routes */}
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
                  
                  {/* Catch-all */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
                
                {/* Footer and Navigation for /app routes only */}
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
        </LanguageProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

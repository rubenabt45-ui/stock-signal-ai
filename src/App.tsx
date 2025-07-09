
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
import Favorites from "./pages/Favorites";
import TradingChat from "./pages/TradingChat";
import Learn from "./pages/Learn";
import EconomicEvents from "./pages/EconomicEvents";
import Settings from "./pages/Settings";
import Success from "./pages/Success";
import Cancel from "./pages/Cancel";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Pricing from "./pages/Pricing";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
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
                    <Route path="/success" element={
                      <ProtectedRoute>
                        <Success />
                      </ProtectedRoute>
                    } />
                    <Route path="/" element={
                      <ProtectedRoute>
                        <TradingChat />
                      </ProtectedRoute>
                    } />
                    <Route path="/favorites" element={
                      <ProtectedRoute>
                        <Favorites />
                      </ProtectedRoute>
                    } />
                    <Route path="/trading-chat" element={
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
                    <Route path="/settings" element={
                      <ProtectedRoute>
                        <Settings />
                      </ProtectedRoute>
                    } />
                    <Route path="/configuration" element={
                      <ProtectedRoute>
                        <Settings />
                      </ProtectedRoute>
                    } />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                  <Routes>
                    <Route path="/login" element={null} />
                    <Route path="/signup" element={null} />
                    <Route path="/success" element={null} />
                    <Route path="*" element={<BottomNavigation />} />
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

export default App;

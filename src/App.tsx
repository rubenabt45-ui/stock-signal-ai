
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
                    {/* Public Landing Page */}
                    <Route path="/" element={<Landing />} />
                    
                    {/* Public Routes */}
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
                    <Route path="/pricing" element={<Pricing />} />
                    <Route path="/learn" element={<Learn />} />
                    
                    {/* Protected App Routes */}
                    <Route path="/app" element={
                      <ProtectedRoute>
                        <TradingChat />
                      </ProtectedRoute>
                    } />
                    <Route path="/app/favorites" element={
                      <ProtectedRoute>
                        <Favorites />
                      </ProtectedRoute>
                    } />
                    <Route path="/app/trading-chat" element={
                      <ProtectedRoute>
                        <TradingChat />
                      </ProtectedRoute>
                    } />
                    <Route path="/app/events" element={
                      <ProtectedRoute>
                        <EconomicEvents />
                      </ProtectedRoute>
                    } />
                    <Route path="/app/settings" element={
                      <ProtectedRoute>
                        <Settings />
                      </ProtectedRoute>
                    } />
                    <Route path="/app/configuration" element={
                      <ProtectedRoute>
                        <Settings />
                      </ProtectedRoute>
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
                   <Routes>
                     <Route path="/" element={null} />
                     <Route path="/login" element={null} />
                     <Route path="/signup" element={null} />
                     <Route path="/pricing" element={null} />
                     <Route path="/learn" element={null} />
                     <Route path="/success" element={null} />
                     <Route path="/cancel" element={null} />
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

export default App;

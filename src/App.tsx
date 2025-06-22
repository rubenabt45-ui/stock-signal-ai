

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { MarketDataProvider } from "@/contexts/MarketDataContext";
import Index from "./pages/Index";
import Favorites from "./pages/Favorites";
import Configuration from "./pages/Configuration";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Success from "./pages/Success";
import Cancel from "./pages/Cancel";
import Learn from "./pages/Learn";
import TradingChat from "./pages/TradingChat";
import NewsAI from "./pages/NewsAI";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "@/components/ProtectedRoute";
import PublicRoute from "@/components/PublicRoute";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <LanguageProvider>
            <ThemeProvider>
              <MarketDataProvider>
                <TooltipProvider>
                  <Toaster />
                  <Sonner />
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/favorites" element={<Favorites />} />
                    <Route path="/learn" element={<Learn />} />
                    <Route path="/trading-chat" element={<TradingChat />} />
                    <Route path="/news-ai" element={<NewsAI />} />
                    <Route 
                      path="/configuration" 
                      element={
                        <ProtectedRoute>
                          <Configuration />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/settings" 
                      element={
                        <ProtectedRoute>
                          <Settings />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/login" 
                      element={
                        <PublicRoute>
                          <Login />
                        </PublicRoute>
                      } 
                    />
                    <Route 
                      path="/signup" 
                      element={
                        <PublicRoute>
                          <Signup />
                        </PublicRoute>
                      } 
                    />
                    <Route path="/success" element={<Success />} />
                    <Route path="/cancel" element={<Cancel />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </TooltipProvider>
              </MarketDataProvider>
            </ThemeProvider>
          </LanguageProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;


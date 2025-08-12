
import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n/config';
import Learn from '@/pages/Learn';
import LearnPreview from '@/pages/LearnPreview';
import Home from '@/pages/Index';
import Pricing from '@/pages/Pricing';
import Configuration from '@/pages/Configuration';
import Login from '@/pages/Login';
import Register from '@/pages/Signup';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import AppLayout from '@/layouts/AppLayout';
import StrategyAI from '@/pages/TradingChat';
import NewsAI from '@/pages/NewsAI';
import TradingChat from '@/pages/TradingChat';
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import PublicRoute from "@/components/PublicRoute";
import Success from '@/pages/Success';

const queryClient = new QueryClient();

// Conditionally import StripeTest only if testing is enabled
const StripeTest = import.meta.env.VITE_ENABLE_STRIPE_TEST === 'true' 
  ? React.lazy(() => import("@/pages/StripeTest"))
  : null;

function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-tradeiq-navy flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-tradeiq-blue"></div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <I18nextProvider i18n={i18n}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/learn-preview" element={<LearnPreview />} />
            <Route path="/pricing" element={<Pricing />} />
            
            <Route path="/login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />
            <Route path="/register" element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } />
            <Route path="/forgot-password" element={
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            } />
            <Route path="/reset-password/:token" element={
              <PublicRoute>
                <ResetPassword />
              </PublicRoute>
            } />

            <Route path="/app" element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }>
              <Route index element={<StrategyAI />} />
              <Route path="strategy-ai" element={<StrategyAI />} />
              <Route path="news-ai" element={<NewsAI />} />
              <Route path="trading-chat" element={<TradingChat />} />
              <Route path="configuration" element={<Configuration />} />
            </Route>

            <Route
              path="/success"
              element={
                <ProtectedRoute>
                  <Success />
                </ProtectedRoute>
              }
            />
            
            {/* Conditional Stripe test route */}
            {StripeTest && (
              <Route
                path="/dev/stripe-test"
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<div className="min-h-screen bg-tradeiq-navy flex items-center justify-center"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-tradeiq-blue"></div></div>}>
                      <StripeTest />
                    </Suspense>
                  </ProtectedRoute>
                }
              />
            )}
          </Routes>
        </I18nextProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;

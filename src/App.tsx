
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { StartupChecklist } from "@/components/StartupChecklist";

// Lazy load all route components for better code splitting
const Landing = React.lazy(() => import('./pages/Landing'));
const Learn = React.lazy(() => import('./pages/Learn'));
const LearnPreview = React.lazy(() => import('./pages/LearnPreview'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Login = React.lazy(() => import('./pages/Login'));
const Signup = React.lazy(() => import('./pages/Signup'));
const Pricing = React.lazy(() => import('./pages/Pricing'));
const Settings = React.lazy(() => import('./pages/Settings'));
const BillingSuccess = React.lazy(() => import('./pages/BillingSuccess'));
const Billing = React.lazy(() => import('./pages/Billing'));
const StripeTestPage = React.lazy(() => import('./pages/StripeTestPage'));

// Loading fallback component
const PageLoadingFallback = () => (
  <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
    <div className="text-center space-y-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <ThemeProvider>
          <TooltipProvider>
            <StartupChecklist />
            <Router>
              <div className="min-h-screen bg-background text-foreground">
                <Suspense fallback={<PageLoadingFallback />}>
                  <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<Landing />} />
                    <Route path="/learn" element={<Learn />} />
                    <Route path="/learn-preview" element={<LearnPreview />} />
                    <Route path="/pricing" element={<Pricing />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Signup />} />
                    
                    {/* App routes (require authentication) */}
                    <Route path="/app" element={<Dashboard />} />
                    <Route path="/app/settings" element={<Settings />} />
                    
                    {/* Billing routes */}
                    <Route path="/billing/success" element={<BillingSuccess />} />
                    <Route path="/billing" element={<Billing />} />
                    
                    {/* Developer routes */}
                    <Route path="/dev/stripe-test" element={<StripeTestPage />} />
                  </Routes>
                </Suspense>
              </div>
            </Router>
          </TooltipProvider>
        </ThemeProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;

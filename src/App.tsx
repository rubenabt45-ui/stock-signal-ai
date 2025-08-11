
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { StartupChecklist } from "@/components/StartupChecklist";
import Landing from './pages/Landing';
import Learn from './pages/Learn';
import LearnPreview from './pages/LearnPreview';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Pricing from './pages/Pricing';
import Settings from './pages/Settings';
import BillingSuccess from "./pages/BillingSuccess";
import Billing from "./pages/Billing";
import StripeTestPage from "./pages/StripeTestPage";

function App() {
  const theme = "dark";

  return (
    <AuthProvider>
      <LanguageProvider>
        <ThemeProvider>
          <TooltipProvider>
            <StartupChecklist />
            <Router>
              <div className="min-h-screen bg-background text-foreground">
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
              </div>
            </Router>
          </TooltipProvider>
        </ThemeProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from "@/components/ThemeProvider"
import LandingPage from './pages/LandingPage';
import Learn from './pages/Learn';
import LearnPreview from './pages/LearnPreview';
import StrategyAI from './pages/StrategyAI';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Pricing from './pages/Pricing';
import Settings from './pages/Settings';
import BillingSuccess from "./pages/BillingSuccess";
import Billing from "./pages/Billing";

function App() {
  const theme = "dark";

  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/learn-preview" element={<LearnPreview />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* App routes (require authentication) */}
          <Route path="/app" element={<Dashboard />} />
          <Route path="/app/strategy-ai" element={<StrategyAI />} />
          <Route path="/app/settings" element={<Settings />} />
          
          {/* Billing routes */}
          <Route path="/billing/success" element={<BillingSuccess />} />
          <Route path="/billing" element={<Billing />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

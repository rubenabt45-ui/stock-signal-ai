
import { Settings as SettingsIcon, User, Bell, Palette, Info, LogOut, Crown, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import PlanModal from "@/components/PlanModal";
import { supabase } from "@/integrations/supabase/client";

const Settings = () => {
  const { signOut, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile to get pro status
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user profile:', error);
        } else {
          setUserProfile(data);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
      navigate("/login");
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "There was an error logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Format registration date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const isPro = userProfile?.is_pro || false;

  return (
    <div className="min-h-screen bg-tradeiq-navy">
      {/* Header */}
      <header className="border-b border-gray-800/50 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <SettingsIcon className="h-8 w-8 text-tradeiq-blue" />
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Settings</h1>
                <p className="text-sm text-gray-400 font-medium">Manage your preferences and account</p>
              </div>
            </div>
            {!isPro && (
              <Button
                onClick={() => setIsPlanModalOpen(true)}
                className="bg-tradeiq-blue hover:bg-blue-600 text-white font-medium"
                disabled={loading}
              >
                <Crown className="h-4 w-4 mr-2" />
                Upgrade to Pro
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-6 pb-24 space-y-6">
        {/* Account Section */}
        <Card className="tradeiq-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-tradeiq-blue" />
                <CardTitle className="text-white">Account</CardTitle>
              </div>
              {isPro && (
                <div className="flex items-center space-x-2 bg-green-500/10 border border-green-500/20 rounded-full px-3 py-1">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-green-400 text-sm font-medium">Pro Plan Active</span>
                </div>
              )}
            </div>
            <CardDescription>Your TradeIQ profile</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-white font-medium">Email</p>
              <p className="text-gray-400 text-sm">{user?.email}</p>
            </div>
            <div className="space-y-2">
              <p className="text-white font-medium">User ID</p>
              <p className="text-gray-400 text-sm font-mono">{user?.id}</p>
            </div>
            <div className="space-y-2">
              <p className="text-white font-medium">Plan Status</p>
              <p className="text-gray-400 text-sm">
                {loading ? 'Loading...' : (isPro ? 'Pro Plan - $9.99/month' : 'Free Plan')}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-white font-medium">Member since</p>
              <p className="text-gray-400 text-sm">
                {user?.created_at ? formatDate(user.created_at) : 'Unknown'}
              </p>
            </div>
            <Button
              onClick={handleLogout}
              variant="destructive"
              className="w-full"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Log Out
            </Button>
          </CardContent>
        </Card>

        {/* Subscription Management Card */}
        {isPro && (
          <Card className="tradeiq-card border-green-500/20">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Crown className="h-5 w-5 text-green-500" />
                <CardTitle className="text-white">Pro Subscription</CardTitle>
              </div>
              <CardDescription>Manage your Pro subscription</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-white font-medium">Current Plan</p>
                <p className="text-green-400 text-sm">TradeIQ Pro - $9.99/month</p>
              </div>
              <div className="space-y-2">
                <p className="text-white font-medium">Benefits</p>
                <ul className="text-gray-400 text-sm space-y-1">
                  <li>• Unlimited ChartIA access</li>
                  <li>• Advanced TradingChat with memory</li>
                  <li>• Real-time NewsAI + favorites</li>
                  <li>• Priority support access</li>
                </ul>
              </div>
              <div className="text-gray-500 text-xs">
                <p>Subscription managed through Stripe. Contact support for assistance.</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Notifications */}
        <Card className="tradeiq-card">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Bell className="h-5 w-5 text-tradeiq-blue" />
              <CardTitle className="text-white">Notifications</CardTitle>
            </div>
            <CardDescription>Choose which types of alerts you want to receive</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Price Alerts</p>
                <p className="text-gray-400 text-sm">Get notified when assets hit target prices</p>
              </div>
              <Switch defaultChecked disabled={!isPro} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Pattern Alerts</p>
                <p className="text-gray-400 text-sm">AI-detected pattern notifications {!isPro && '(Pro only)'}</p>
              </div>
              <Switch defaultChecked={isPro} disabled={!isPro} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Market News</p>
                <p className="text-gray-400 text-sm">Breaking market news and updates</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* App Appearance */}
        <Card className="tradeiq-card">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Palette className="h-5 w-5 text-tradeiq-blue" />
              <CardTitle className="text-white">Appearance</CardTitle>
            </div>
            <CardDescription>Customize your app appearance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Dark Mode</p>
                <p className="text-gray-400 text-sm">Currently enabled</p>
              </div>
              <Switch defaultChecked disabled />
            </div>
          </CardContent>
        </Card>

        {/* App Info */}
        <Card className="tradeiq-card">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Info className="h-5 w-5 text-tradeiq-blue" />
              <CardTitle className="text-white">App Info</CardTitle>
            </div>
            <CardDescription>Version 1.0.0</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-white font-medium">TradeIQ</p>
              <p className="text-gray-400 text-sm">AI-powered trading insights and analysis</p>
            </div>
            <div className="space-y-2">
              <p className="text-white font-medium">What's New</p>
              <p className="text-gray-400 text-sm">• Pro subscription with Stripe integration</p>
              <p className="text-gray-400 text-sm">• Real-time chart analysis</p>
              <p className="text-gray-400 text-sm">• AI trading assistant</p>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Plan Modal */}
      <PlanModal
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
      />
    </div>
  );
};

export default Settings;

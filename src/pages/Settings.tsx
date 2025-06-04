import { Settings as SettingsIcon, User, Bell, Palette, Info, LogOut, Crown } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import PlanModal from "@/components/PlanModal";

const Settings = () => {
  const { signOut, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);

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
            <Button
              onClick={() => setIsPlanModalOpen(true)}
              className="bg-tradeiq-blue hover:bg-blue-600 text-white font-medium"
            >
              <Crown className="h-4 w-4 mr-2" />
              Upgrade
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-6 pb-24 space-y-6">
        {/* Account Section */}
        <Card className="tradeiq-card">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-tradeiq-blue" />
              <CardTitle className="text-white">Account</CardTitle>
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
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Pattern Alerts</p>
                <p className="text-gray-400 text-sm">AI-detected pattern notifications</p>
              </div>
              <Switch defaultChecked />
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
              <p className="text-gray-400 text-sm">• Initial release with core features</p>
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

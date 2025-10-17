import { Settings, Bell, Palette, Shield, Download, LogOut } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Configuration = () => {
  const { signOut, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen bg-tradeiq-navy">
      {/* Header */}
      <header className="border-b border-gray-800/50 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <Settings className="h-8 w-8 text-tradeiq-blue" />
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Configuration</h1>
              <p className="text-sm text-gray-400 font-medium">App Settings & Preferences</p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-6 pb-24 space-y-6">
        {/* Account */}
        <Card className="tradeiq-card">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <LogOut className="h-5 w-5 text-tradeiq-blue" />
              <CardTitle className="text-white">Account</CardTitle>
            </div>
            <CardDescription>Manage your TradeIQ account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Signed in as</p>
                <p className="text-gray-400 text-sm">{user?.email}</p>
              </div>
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
            <CardDescription>Manage your alert preferences</CardDescription>
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

        {/* Appearance */}
        <Card className="tradeiq-card">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Palette className="h-5 w-5 text-tradeiq-blue" />
              <CardTitle className="text-white">Appearance</CardTitle>
            </div>
            <CardDescription>Customize your trading interface</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Dark Mode</p>
                <p className="text-gray-400 text-sm">Currently enabled</p>
              </div>
              <Switch defaultChecked disabled />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Compact View</p>
                <p className="text-gray-400 text-sm">Show more data in less space</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Animation Effects</p>
                <p className="text-gray-400 text-sm">Enable smooth transitions</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card className="tradeiq-card">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Shield className="h-5 w-5 text-tradeiq-blue" />
              <CardTitle className="text-white">Security & Privacy</CardTitle>
            </div>
            <CardDescription>Protect your trading data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Auto-lock</p>
                <p className="text-gray-400 text-sm">Lock app after inactivity</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Analytics</p>
                <p className="text-gray-400 text-sm">Help improve TradeIQ</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Button variant="outline" className="border-gray-700 hover:bg-gray-800 text-gray-300">
              Clear Cache
            </Button>
          </CardContent>
        </Card>

        {/* Data Export */}
        <Card className="tradeiq-card">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Download className="h-5 w-5 text-tradeiq-blue" />
              <CardTitle className="text-white">Data Management</CardTitle>
            </div>
            <CardDescription>Export your trading data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="border-gray-700 hover:bg-gray-800 text-gray-300 w-full">
              Export Favorites
            </Button>
            <Button variant="outline" className="border-gray-700 hover:bg-gray-800 text-gray-300 w-full">
              Export Chat History
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Configuration;

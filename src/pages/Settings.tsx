
import { Settings as SettingsIcon, Crown, CheckCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import PlanModal from "@/components/PlanModal";
import { supabase } from "@/integrations/supabase/client";
import { ProfileSection } from "@/components/ProfileSection";
import { PreferencesSection } from "@/components/PreferencesSection";
import { LogoutSection } from "@/components/LogoutSection";

const Settings = () => {
  const { user } = useAuth();
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

  const handleProfileUpdate = (updatedProfile: any) => {
    setUserProfile(updatedProfile);
  };

  const isPro = userProfile?.is_pro || false;

  if (!user) {
    return (
      <div className="min-h-screen bg-tradeiq-navy flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

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
              <div className="flex items-center space-x-4">
                {isPro && (
                  <div className="flex items-center space-x-2 bg-green-500/10 border border-green-500/20 rounded-full px-3 py-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-green-400 text-sm font-medium">Pro Plan Active</span>
                  </div>
                )}
                <button
                  onClick={() => setIsPlanModalOpen(true)}
                  className="bg-tradeiq-blue hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                  disabled={loading}
                >
                  <Crown className="h-4 w-4" />
                  <span>Upgrade to Pro</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-6 pb-24 space-y-6">
        {/* Profile Section */}
        <ProfileSection 
          user={user} 
          userProfile={userProfile} 
          onProfileUpdate={handleProfileUpdate}
        />

        {/* Preferences Section */}
        <PreferencesSection />

        {/* Pro Subscription Management */}
        {isPro && (
          <div className="tradeiq-card border-green-500/20 bg-black/20 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Crown className="h-5 w-5 text-green-500" />
              <h3 className="text-white text-lg font-semibold">Pro Subscription</h3>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-white font-medium">Current Plan</p>
                <p className="text-green-400 text-sm">TradeIQ Pro - $9.99/month</p>
              </div>
              <div>
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
            </div>
          </div>
        )}

        {/* Logout Section */}
        <LogoutSection />
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

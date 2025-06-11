
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Monitor, Sun, Moon, Clock, Globe, Info, Loader } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export const PreferencesSection = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState('1min');
  const [language, setLanguage] = useState('en');
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchPreferences = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from('user_profiles')
            .select('refresh_interval, language')
            .eq('id', user.id)
            .single();

          if (data && !error) {
            setRefreshInterval(data.refresh_interval || '1min');
            setLanguage(data.language || 'en');
          }
        } catch (error) {
          console.error('Error fetching preferences:', error);
        }
      }
    };

    fetchPreferences();
  }, [user]);

  const handleSavePreferences = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          refresh_interval: refreshInterval,
          language: language,
        })
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      toast({
        title: "Preferences updated",
        description: "Your preferences have been saved successfully.",
      });
    } catch (error) {
      console.error('Preferences update error:', error);
      toast({
        title: "Update failed",
        description: "Failed to update preferences. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light': return Sun;
      case 'dark': return Moon;
      case 'system': return Monitor;
      default: return Monitor;
    }
  };

  const ThemeIcon = getThemeIcon();

  return (
    <Card className="tradeiq-card">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <Settings className="h-5 w-5 text-tradeiq-blue" />
          <CardTitle className="text-white">Preferences</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Theme Selection */}
        <div className="space-y-3">
          <Label className="text-white font-medium">Theme</Label>
          <Select value={theme} onValueChange={(value: 'light' | 'dark' | 'system') => setTheme(value)}>
            <SelectTrigger className="bg-black/20 border-gray-700 text-white focus:border-tradeiq-blue">
              <div className="flex items-center space-x-2">
                <ThemeIcon className="h-4 w-4" />
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-700">
              <SelectItem value="light" className="text-white hover:bg-gray-800">
                <div className="flex items-center space-x-2">
                  <Sun className="h-4 w-4" />
                  <span>Light</span>
                </div>
              </SelectItem>
              <SelectItem value="dark" className="text-white hover:bg-gray-800">
                <div className="flex items-center space-x-2">
                  <Moon className="h-4 w-4" />
                  <span>Dark</span>
                </div>
              </SelectItem>
              <SelectItem value="system" className="text-white hover:bg-gray-800">
                <div className="flex items-center space-x-2">
                  <Monitor className="h-4 w-4" />
                  <span>System</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Refresh Interval */}
        <div className="space-y-3">
          <Label className="text-white font-medium">Chart Refresh Interval</Label>
          <Select value={refreshInterval} onValueChange={setRefreshInterval}>
            <SelectTrigger className="bg-black/20 border-gray-700 text-white focus:border-tradeiq-blue">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-700">
              <SelectItem value="30s" className="text-white hover:bg-gray-800">30 seconds</SelectItem>
              <SelectItem value="1min" className="text-white hover:bg-gray-800">1 minute</SelectItem>
              <SelectItem value="5min" className="text-white hover:bg-gray-800">5 minutes</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-gray-400 text-sm">
            How often charts and price data should refresh automatically
          </p>
        </div>

        {/* Language Selection */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Label className="text-white font-medium">Language</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Multi-language support coming soon</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="bg-black/20 border-gray-700 text-white focus:border-tradeiq-blue">
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4" />
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-700">
              <SelectItem value="en" className="text-white hover:bg-gray-800">English</SelectItem>
              <SelectItem value="es" className="text-white hover:bg-gray-800">Español (Coming Soon)</SelectItem>
              <SelectItem value="fr" className="text-white hover:bg-gray-800">Français (Coming Soon)</SelectItem>
              <SelectItem value="de" className="text-white hover:bg-gray-800">Deutsch (Coming Soon)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleSavePreferences}
          disabled={isLoading}
          className="w-full bg-tradeiq-blue hover:bg-blue-600 text-white"
        >
          {isLoading ? (
            <>
              <Loader className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Preferences'
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

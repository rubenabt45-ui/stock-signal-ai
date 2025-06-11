
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Palette, Clock, Globe } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useRefreshInterval } from '@/hooks/useRefreshInterval';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const PreferencesSection = () => {
  const { theme, setTheme } = useTheme();
  const { refreshInterval, setRefreshInterval } = useRefreshInterval();
  const [language, setLanguageState] = useState('en');
  const { user } = useAuth();
  const { toast } = useToast();

  // Load language from user_profiles
  useEffect(() => {
    const loadLanguage = async () => {
      if (!user?.id) return;

      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('language')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error loading language:', error);
          return;
        }

        if (data?.language) {
          setLanguageState(data.language);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    loadLanguage();
  }, [user?.id]);

  const handleLanguageChange = async (newLanguage: string) => {
    setLanguageState(newLanguage);

    if (user?.id) {
      try {
        const { error } = await supabase
          .from('user_profiles')
          .update({ language: newLanguage })
          .eq('id', user.id);

        if (error) {
          console.error('Error updating language:', error);
          toast({
            title: "Failed to save language",
            description: "Language preference couldn't be saved.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Language preference saved",
            description: "Language support coming soon",
          });
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  return (
    <Card className="tradeiq-card">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <Palette className="h-5 w-5 text-tradeiq-blue" />
          <CardTitle className="text-white">Preferences</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Theme Selection */}
        <div className="space-y-2">
          <Label className="text-white flex items-center space-x-2">
            <Palette className="h-4 w-4" />
            <span>Theme</span>
          </Label>
          <Select value={theme} onValueChange={setTheme}>
            <SelectTrigger className="bg-black/20 border-gray-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-700">
              <SelectItem value="light" className="text-white hover:bg-gray-800">Light</SelectItem>
              <SelectItem value="dark" className="text-white hover:bg-gray-800">Dark</SelectItem>
              <SelectItem value="system" className="text-white hover:bg-gray-800">System</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Data Refresh Interval */}
        <div className="space-y-2">
          <Label className="text-white flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>Data Refresh Interval</span>
          </Label>
          <Select value={refreshInterval} onValueChange={setRefreshInterval}>
            <SelectTrigger className="bg-black/20 border-gray-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-700">
              <SelectItem value="30s" className="text-white hover:bg-gray-800">30 seconds</SelectItem>
              <SelectItem value="1min" className="text-white hover:bg-gray-800">1 minute</SelectItem>
              <SelectItem value="5min" className="text-white hover:bg-gray-800">5 minutes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Language Preference */}
        <div className="space-y-2">
          <Label className="text-white flex items-center space-x-2">
            <Globe className="h-4 w-4" />
            <span>Language</span>
          </Label>
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="bg-black/20 border-gray-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-700">
              <SelectItem value="en" className="text-white hover:bg-gray-800">English</SelectItem>
              <SelectItem value="es" className="text-white hover:bg-gray-800">Español (Coming Soon)</SelectItem>
              <SelectItem value="fr" className="text-white hover:bg-gray-800">Français (Coming Soon)</SelectItem>
              <SelectItem value="de" className="text-white hover:bg-gray-800">Deutsch (Coming Soon)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="text-xs text-gray-500 mt-4">
          <p>• Theme changes apply immediately</p>
          <p>• Data refresh settings affect market data updates</p>
          <p>• Language support is coming in future updates</p>
        </div>
      </CardContent>
    </Card>
  );
};

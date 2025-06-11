
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Palette, Clock, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type Theme = 'light' | 'dark' | 'system';
type RefreshInterval = '30s' | '1min' | '5min';

export const PreferencesSection = () => {
  const [theme, setTheme] = useState<Theme>('dark');
  const [refreshInterval, setRefreshInterval] = useState<RefreshInterval>('1min');
  const [language, setLanguage] = useState('en');
  const { toast } = useToast();

  useEffect(() => {
    // Load preferences from localStorage
    const savedTheme = localStorage.getItem('tradeiq-theme') as Theme;
    const savedInterval = localStorage.getItem('tradeiq-refresh-interval') as RefreshInterval;
    const savedLanguage = localStorage.getItem('tradeiq-language');

    if (savedTheme) setTheme(savedTheme);
    if (savedInterval) setRefreshInterval(savedInterval);
    if (savedLanguage) setLanguage(savedLanguage);
  }, []);

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('tradeiq-theme', newTheme);
    
    // Apply theme immediately (basic implementation)
    if (newTheme === 'light') {
      document.documentElement.classList.remove('dark');
    } else if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      // System theme - check system preference
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (systemPrefersDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }

    toast({
      title: "Theme updated",
      description: `Theme changed to ${newTheme}`,
    });
  };

  const handleRefreshIntervalChange = (newInterval: RefreshInterval) => {
    setRefreshInterval(newInterval);
    localStorage.setItem('tradeiq-refresh-interval', newInterval);
    
    toast({
      title: "Refresh interval updated",
      description: `Market data will refresh every ${newInterval}`,
    });
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    localStorage.setItem('tradeiq-language', newLanguage);
    
    toast({
      title: "Language preference saved",
      description: "Language support coming soon",
    });
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
          <Select value={theme} onValueChange={handleThemeChange}>
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
          <Select value={refreshInterval} onValueChange={handleRefreshIntervalChange}>
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

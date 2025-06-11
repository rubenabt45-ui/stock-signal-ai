
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Bell } from 'lucide-react';

export const NotificationsSection = () => {
  return (
    <Card className="tradeiq-card">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <Bell className="h-5 w-5 text-tradeiq-blue" />
          <CardTitle className="text-white">Notifications</CardTitle>
        </div>
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
  );
};

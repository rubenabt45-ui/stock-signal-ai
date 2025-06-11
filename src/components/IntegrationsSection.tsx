
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plug, Calendar } from 'lucide-react';

export const IntegrationsSection = () => {
  return (
    <Card className="tradeiq-card">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <Plug className="h-5 w-5 text-tradeiq-blue" />
          <CardTitle className="text-white">Integrations</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center py-4">
          <Calendar className="h-12 w-12 text-gray-500 mx-auto mb-3" />
          <p className="text-white font-medium mb-2">Coming Soon</p>
          <p className="text-gray-400 text-sm mb-6">
            Connect your brokerage accounts and trading tools for enhanced functionality.
          </p>
        </div>

        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full border-gray-600 text-gray-400 hover:bg-gray-800 cursor-not-allowed"
            disabled
          >
            Connect Binance
          </Button>
          <Button
            variant="outline"
            className="w-full border-gray-600 text-gray-400 hover:bg-gray-800 cursor-not-allowed"
            disabled
          >
            Connect MetaTrader
          </Button>
          <Button
            variant="outline"
            className="w-full border-gray-600 text-gray-400 hover:bg-gray-800 cursor-not-allowed"
            disabled
          >
            Connect TradingView
          </Button>
        </div>

        <div className="text-xs text-gray-500 text-center mt-4">
          <p>These integrations will be available in a future update.</p>
        </div>
      </CardContent>
    </Card>
  );
};

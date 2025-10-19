
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Bug } from 'lucide-react';

export const SupportSection = () => {
  const handleReportBug = () => {
    const subject = encodeURIComponent('TradeIQ Bug Report');
    const body = encodeURIComponent(`
Hi TradeIQ Support,

I would like to report a bug:

Bug Description:
[Please describe the issue you encountered]

Steps to Reproduce:
1. [First step]
2. [Second step]
3. [Third step]

Expected Behavior:
[What you expected to happen]

Actual Behavior:
[What actually happened]

Device/Browser Information:
- Browser: ${navigator.userAgent}
- Screen Resolution: ${window.screen.width}x${window.screen.height}

Additional Information:
[Any other relevant details]

Thank you for your assistance!
    `);
    
    window.open(`mailto:support@tradeiq.ai?subject=${subject}&body=${body}`);
  };

  return (
    <Card className="tradeiq-card">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <Mail className="h-5 w-5 text-tradeiq-blue" />
          <CardTitle className="text-white">Support</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div>
            <p className="text-white font-medium">Need Help?</p>
            <p className="text-gray-400 text-sm">
              For any questions or issues, contact our support team:
            </p>
            <a
              href="mailto:support@tradeiq.ai"
              className="text-tradeiq-blue hover:text-blue-400 transition-colors text-sm font-medium"
            >
              support@tradeiq.ai
            </a>
          </div>

          <div className="pt-2">
            <Button
              onClick={handleReportBug}
              variant="outline"
              className="w-full !border-gray-600 !bg-gray-800/50 !text-white hover:!bg-gray-700"
            >
              <Bug className="h-4 w-4 mr-2" />
              Report a Bug
            </Button>
          </div>
        </div>

        <div className="text-xs text-gray-500 pt-2">
          <p>• Average response time: 24-48 hours</p>
          <p>• For urgent issues, include "URGENT" in the subject line</p>
        </div>
      </CardContent>
    </Card>
  );
};

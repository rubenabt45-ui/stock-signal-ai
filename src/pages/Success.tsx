
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { CheckCircle, ChartCandlestick, Crown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Success = () => {
  const { toast } = useToast();

  useEffect(() => {
    toast({
      title: "Payment Successful! 🎉",
      description: "Welcome to TradeIQ Pro! Your subscription is now active.",
      duration: 5000,
    });
  }, [toast]);

  return (
    <div className="min-h-screen bg-tradeiq-navy flex items-center justify-center p-4">
      <Card className="tradeiq-card w-full max-w-md text-center">
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <CheckCircle className="h-16 w-16 text-green-500" />
              <Crown className="h-6 w-6 text-yellow-500 absolute -top-1 -right-1" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            Welcome to TradeIQ Pro!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <p className="text-gray-300">
              Your payment was successful and your Pro subscription is now active.
            </p>
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <p className="text-green-400 font-medium">Pro Features Unlocked:</p>
              <ul className="text-green-300 text-sm mt-2 space-y-1">
                <li>• Advanced AI Analysis</li>
                <li>• Real-time Market Data</li>
                <li>• Premium News Feed</li>
                <li>• Priority Support</li>
              </ul>
            </div>
          </div>
          
          <div className="space-y-3">
            <Link to="/">
              <Button className="tradeiq-button-primary w-full">
                <ChartCandlestick className="h-4 w-4 mr-2" />
                Start Trading with Pro
              </Button>
            </Link>
            <Link to="/settings">
              <Button variant="outline" className="w-full border-gray-700 hover:bg-gray-800 text-gray-300">
                Manage Subscription
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Success;

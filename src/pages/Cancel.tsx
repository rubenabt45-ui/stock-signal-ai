
import { Link } from "react-router-dom";
import { XCircle, ChartCandlestick, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Cancel = () => {
  return (
    <div className="min-h-screen bg-tradeiq-navy flex items-center justify-center p-4">
      <Card className="tradeiq-card w-full max-w-md text-center">
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            <XCircle className="h-16 w-16 text-yellow-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            Payment Cancelled
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <p className="text-gray-300">
              Your payment was cancelled. No charge was made to your account.
            </p>
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
              <p className="text-yellow-400 font-medium">Need Help?</p>
              <p className="text-yellow-300 text-sm mt-2">
                If you experienced any issues during checkout, please contact our support team.
              </p>
            </div>
          </div>
          
          <div className="space-y-3">
            <Link to="/">
              <Button className="tradeiq-button-primary w-full">
                <ChartCandlestick className="h-4 w-4 mr-2" />
                Continue with Free Version
              </Button>
            </Link>
            <Link to="/pricing">
              <Button variant="outline" className="w-full border-gray-700 hover:bg-gray-800 text-gray-300">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Try Upgrade Again
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Cancel;

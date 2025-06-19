
import { Link } from "react-router-dom";
import { AlertTriangle, ChartCandlestick, Home } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-tradeiq-navy flex items-center justify-center p-4">
      <Card className="tradeiq-card w-full max-w-md text-center">
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            <AlertTriangle className="h-16 w-16 text-yellow-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            Page Not Found
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <p className="text-gray-300">
              The page you're looking for doesn't exist or has been moved.
            </p>
            <div className="text-6xl font-bold text-gray-600">
              404
            </div>
          </div>
          
          <div className="space-y-3">
            <Link to="/">
              <Button className="tradeiq-button-primary w-full">
                <Home className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <Link to="/trading-chat">
              <Button variant="outline" className="w-full border-gray-700 hover:bg-gray-800 text-gray-300">
                <ChartCandlestick className="h-4 w-4 mr-2" />
                Get Help in Chat
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;

// Future Feature: NewsAI - Commented out for V1 launch

// Temporary placeholder for V1 launch
import { Card, CardContent } from "@/components/ui/card";
import { Newspaper } from "lucide-react";

const NewsAI = () => {
  return (
    <div className="min-h-screen bg-tradeiq-navy">
      <main className="container mx-auto px-4 py-6 pb-24">
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="tradeiq-card max-w-lg w-full">
            <CardContent className="text-center py-16">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-tradeiq-blue/20 rounded-full">
                  <Newspaper className="h-12 w-12 text-tradeiq-blue" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">AI News Analysis</h2>
              <p className="text-gray-400 text-lg mb-6">Coming Soon</p>
              <p className="text-gray-500 text-sm max-w-md mx-auto">
                We're building advanced AI-powered news analysis with real-time market insights 
                and sentiment analysis. Stay tuned for updates!
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default NewsAI;
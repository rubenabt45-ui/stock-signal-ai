import React from "react";
import { Calendar } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

const EconomicEvents = () => {
  return (
    <div className="min-h-screen bg-tradeiq-navy">
      {/* Header */}
      <header className="border-b border-gray-800/50 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Calendar className="h-8 w-8 text-tradeiq-blue" />
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Economic Events</h1>
                <p className="text-sm text-gray-400 font-medium">High-impact macroeconomic events</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-6 pb-24">
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="tradeiq-card max-w-lg w-full">
            <CardContent className="text-center py-16">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-tradeiq-blue/20 rounded-full">
                  <Calendar className="h-12 w-12 text-tradeiq-blue" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Economic Events</h2>
              <p className="text-gray-400 text-lg mb-6">Coming Soon</p>
              <p className="text-gray-500 text-sm max-w-md mx-auto">
                We're building a comprehensive economic calendar with high-impact events, 
                earnings reports, and market-moving announcements. Stay tuned for updates!
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default EconomicEvents;
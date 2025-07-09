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
          <Card className="tradeiq-card max-w-md w-full">
            <CardHeader className="text-center py-12">
              <h2 className="text-2xl font-bold text-white mb-3">Economic Events – Coming Soon</h2>
              <p className="text-gray-400 text-lg">We're working on a better economic calendar. Stay tuned!</p>
            </CardHeader>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default EconomicEvents;

import { Book, TrendingUp, BarChart3, PieChart } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Learn = () => {
  const learningModules = [
    {
      title: "Technical Analysis Basics",
      description: "Learn to read charts, identify patterns, and understand key indicators",
      icon: BarChart3,
      difficulty: "Beginner",
      duration: "2 hours",
      color: "text-green-400"
    },
    {
      title: "Risk Management",
      description: "Master position sizing, stop losses, and portfolio management",
      icon: PieChart,
      difficulty: "Intermediate",
      duration: "1.5 hours",
      color: "text-yellow-400"
    },
    {
      title: "Advanced Strategies",
      description: "Explore swing trading, scalping, and algorithmic approaches",
      icon: TrendingUp,
      difficulty: "Advanced",
      duration: "3 hours",
      color: "text-red-400"
    }
  ];

  return (
    <div className="min-h-screen bg-tradeiq-navy">
      {/* Header */}
      <header className="border-b border-gray-800/50 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <Book className="h-8 w-8 text-tradeiq-blue" />
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Learn</h1>
              <p className="text-sm text-gray-400 font-medium">Trading Education Hub</p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-6 pb-24">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">Featured Courses</h2>
            <p className="text-gray-400">Master trading with our comprehensive learning modules</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {learningModules.map((module) => (
              <Card key={module.title} className="tradeiq-card hover:border-tradeiq-blue/50 transition-colors cursor-pointer">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-tradeiq-blue/20">
                      <module.icon className="h-6 w-6 text-tradeiq-blue" />
                    </div>
                    <div>
                      <CardTitle className="text-white text-lg">{module.title}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`text-xs px-2 py-1 rounded ${module.color} bg-gray-800/50`}>
                          {module.difficulty}
                        </span>
                        <span className="text-xs text-gray-400">{module.duration}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-300">
                    {module.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Reference</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="tradeiq-card">
                <CardHeader>
                  <CardTitle className="text-white text-base">Trading Terminology</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Bull Market</span>
                    <span className="text-green-400">Rising prices</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Bear Market</span>
                    <span className="text-red-400">Falling prices</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">RSI</span>
                    <span className="text-gray-400">Momentum indicator</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">MACD</span>
                    <span className="text-gray-400">Trend indicator</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="tradeiq-card">
                <CardHeader>
                  <CardTitle className="text-white text-base">Key Patterns</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Head & Shoulders</span>
                    <span className="text-red-400">Reversal</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Double Top</span>
                    <span className="text-red-400">Bearish</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Cup & Handle</span>
                    <span className="text-green-400">Bullish</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Triangle</span>
                    <span className="text-yellow-400">Breakout</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Learn;


import { Book, CheckCircle, FileText, AlertTriangle, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const Learn = () => {
  const [completedModules, setCompletedModules] = useState<string[]>([]);

  const learningModules = [
    {
      id: "pre-trade-checklist",
      title: "Trade with Confidence",
      description: "Learn how to follow a proven checklist before each trade to reduce mistakes and improve discipline.",
      icon: CheckCircle,
      difficulty: "Beginner",
      duration: "10 min read",
      color: "text-green-400",
      pdfUrl: "https://xnrvqfclyroagzknedhs.supabase.co/storage/v1/object/public/learn-modules//TradeIQ%20-%20Pre-Trade%20Checklist%20(1).pdf",
      category: "Preparation"
    },
    {
      id: "visual-dictionary",
      title: "Key Trading Concepts",
      description: "Understand essential terms like support, resistance, trend, liquidity, stop-loss and more.",
      icon: FileText,
      difficulty: "Beginner",
      duration: "15 min read",
      color: "text-blue-400",
      pdfUrl: "https://xnrvqfclyroagzknedhs.supabase.co/storage/v1/object/public/learn-modules//TradeIQ%20-%20Visual%20Dictionary%20(1).pdf",
      category: "Fundamentals"
    },
    {
      id: "trading-mistakes",
      title: "5 Trading Mistakes to Avoid",
      description: "Discover the most common pitfalls new traders make and how to avoid them for a smarter trading journey.",
      icon: AlertTriangle,
      difficulty: "Beginner",
      duration: "8 min read",
      color: "text-yellow-400",
      pdfUrl: "https://xnrvqfclyroagzknedhs.supabase.co/storage/v1/object/public/learn-modules//TradeIQ-5-Trading-Mistakes.pdf",
      category: "Strategy"
    }
  ];

  const handleModuleClick = (moduleId: string, pdfUrl: string) => {
    console.log(`Opening PDF: ${pdfUrl}`);
    // Open PDF in new tab
    window.open(pdfUrl, '_blank', 'noopener,noreferrer');
    
    // Mark module as completed
    if (!completedModules.includes(moduleId)) {
      setCompletedModules([...completedModules, moduleId]);
    }
  };

  const isCompleted = (moduleId: string) => completedModules.includes(moduleId);

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
        <div className="space-y-8">
          {/* Start Learning Banner */}
          <div className="tradeiq-card p-6 text-center animate-fade-in">
            <div className="flex items-center justify-center mb-4">
              <TrendingUp className="h-12 w-12 text-tradeiq-blue" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Start Your Trading Journey</h2>
            <p className="text-gray-300 mb-4 max-w-2xl mx-auto">
              Master the fundamentals with our beginner-friendly modules. Each resource is designed to build your confidence and help you trade smarter.
            </p>
            <div className="flex justify-center space-x-4 text-sm text-gray-400">
              <span>✓ Real-world examples</span>
              <span>✓ Practical guidance</span>
              <span>✓ Expert insights</span>
            </div>
          </div>

          {/* Learning Modules */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-6">Essential Learning Modules</h3>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {learningModules.map((module) => (
                <Card 
                  key={module.id} 
                  className="tradeiq-card hover:border-tradeiq-blue/50 transition-all duration-200 cursor-pointer hover-scale relative overflow-hidden"
                  onClick={() => handleModuleClick(module.id, module.pdfUrl)}
                >
                  {/* Completion Badge */}
                  {isCompleted(module.id) && (
                    <div className="absolute top-3 right-3 z-10">
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        ✓ Completed
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="pb-4">
                    <div className="flex items-start space-x-3">
                      <div className="p-3 rounded-lg bg-tradeiq-blue/20 flex-shrink-0">
                        <module.icon className="h-6 w-6 text-tradeiq-blue" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
                            {module.category}
                          </Badge>
                        </div>
                        <CardTitle className="text-white text-lg leading-tight">{module.title}</CardTitle>
                        <div className="flex items-center space-x-3 mt-2">
                          <span className={`text-xs px-2 py-1 rounded ${module.color} bg-gray-800/50`}>
                            {module.difficulty}
                          </span>
                          <span className="text-xs text-gray-400">{module.duration}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <CardDescription className="text-gray-300 mb-4 leading-relaxed">
                      {module.description}
                    </CardDescription>
                    
                    <Button 
                      className="w-full tradeiq-button-primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleModuleClick(module.id, module.pdfUrl);
                      }}
                    >
                      {isCompleted(module.id) ? "Review" : "Read Now"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Progress Overview */}
          <div className="tradeiq-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Your Progress</h3>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-300">Modules Completed</span>
                  <span className="text-tradeiq-blue font-medium">
                    {completedModules.length} / {learningModules.length}
                  </span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div 
                    className="bg-tradeiq-blue h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(completedModules.length / learningModules.length) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="text-2xl">
                {completedModules.length === learningModules.length ? "🎉" : "📚"}
              </div>
            </div>
          </div>

          {/* Coming Soon Footer */}
          <div className="text-center py-8">
            <div className="inline-flex items-center space-x-2 text-gray-400">
              <div className="w-2 h-2 bg-tradeiq-blue rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">More modules coming soon...</span>
              <div className="w-2 h-2 bg-tradeiq-blue rounded-full animate-pulse"></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Advanced strategies, market analysis, and more</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Learn;

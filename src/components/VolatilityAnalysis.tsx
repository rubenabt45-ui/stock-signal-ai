
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, AlertCircle, Shield, TrendingUp as VolHigh } from "lucide-react";

interface VolatilityAnalysisProps {
  asset: string;
  timeframe: string;
}

const generateVolatilityData = () => {
  const volatility = Math.random() * 100;
  let level: 'Low' | 'Medium' | 'High';
  let icon;
  let color;

  if (volatility < 30) {
    level = 'Low';
    icon = Shield;
    color = 'text-tradeiq-success';
  } else if (volatility < 70) {
    level = 'Medium';
    icon = AlertCircle;
    color = 'text-tradeiq-warning';
  } else {
    level = 'High';
    icon = VolHigh;
    color = 'text-tradeiq-danger';
  }

  return { volatility, level, icon, color };
};

export const VolatilityAnalysis = ({ asset, timeframe }: VolatilityAnalysisProps) => {
  const { volatility, level, icon: VolIcon, color } = generateVolatilityData();

  return (
    <Card className="tradeiq-card p-6 rounded-2xl">
      <div className="flex items-center space-x-3 mb-6">
        <Zap className="h-6 w-6 text-tradeiq-warning" />
        <h3 className="text-xl font-bold text-white">Volatility Analysis</h3>
      </div>

      <div className="space-y-6">
        {/* Volatility Level */}
        <div className="text-center space-y-4">
          <div className={`inline-flex items-center space-x-3 p-4 rounded-2xl ${
            level === 'Low' ? 'bg-tradeiq-success/10 border border-tradeiq-success/30' :
            level === 'Medium' ? 'bg-tradeiq-warning/10 border border-tradeiq-warning/30' :
            'bg-tradeiq-danger/10 border border-tradeiq-danger/30'
          }`}>
            <VolIcon className={`h-8 w-8 ${color}`} />
            <span className={`text-2xl font-bold ${color}`}>
              {level}
            </span>
          </div>
        </div>

        {/* Volatility Metrics */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 font-medium">Volatility Index</span>
              <span className="text-white font-bold">{volatility.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all duration-500 ${
                  volatility > 70 ? 'bg-tradeiq-danger' : 
                  volatility > 30 ? 'bg-tradeiq-warning' : 'bg-tradeiq-success'
                }`}
                style={{ width: `${Math.min(volatility, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Risk Assessment */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-black/20 rounded-xl text-center">
            <div className="text-gray-400 text-sm mb-1">Risk Level</div>
            <Badge variant="outline" className={`border-gray-600 font-bold ${color} border-opacity-30`}>
              {level}
            </Badge>
          </div>
          <div className="p-3 bg-black/20 rounded-xl text-center">
            <div className="text-gray-400 text-sm mb-1">Timeframe</div>
            <div className="text-white font-bold">{timeframe}</div>
          </div>
        </div>

        {/* Volatility Description */}
        <div className="p-4 bg-black/20 rounded-xl">
          <p className="text-gray-300 text-sm leading-relaxed">
            {level === 'Low' && 'Price movements are relatively stable with minimal fluctuations expected.'}
            {level === 'Medium' && 'Moderate price swings expected. Monitor for potential breakouts.'}
            {level === 'High' && 'Significant price movements likely. Exercise caution with position sizing.'}
          </p>
        </div>
      </div>
    </Card>
  );
};

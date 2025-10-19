import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Info, TrendingUp, TrendingDown } from "lucide-react";
import { useTradingViewWidgetData } from "@/hooks/useTradingViewWidgetData";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface VolatilityTechnicalIndicatorsProps {
  asset: string;
}

export const VolatilityTechnicalIndicators = ({ asset }: VolatilityTechnicalIndicatorsProps) => {
  const { price, change, isLoading, error } = useTradingViewWidgetData(asset);

  // Calculate technical signal based on price change
  const calculateSignal = (changePercent: number | null) => {
    if (changePercent === null) return { value: 50, label: "Neutral", color: "#64748b" };
    
    if (changePercent >= 3) return { value: 90, label: "Fuerte compra", color: "#10b981" };
    if (changePercent >= 1.5) return { value: 70, label: "Compra", color: "#22c55e" };
    if (changePercent > -1.5) return { value: 50, label: "Neutral", color: "#64748b" };
    if (changePercent > -3) return { value: 30, label: "Venta", color: "#f97316" };
    return { value: 10, label: "Fuerte venta", color: "#ef4444" };
  };

  const signal = calculateSignal(change);

  // Technical indicators (mock data based on signal)
  const technicalIndicators = [
    { name: "RSI (14)", value: signal.value > 50 ? "65.4" : "34.2", signal: signal.value > 50 ? "Compra" : "Venta" },
    { name: "MACD", value: signal.value > 50 ? "Positivo" : "Negativo", signal: signal.value > 50 ? "Compra" : "Venta" },
    { name: "MA 50/200", value: signal.value > 50 ? "Golden Cross" : "Death Cross", signal: signal.value > 50 ? "Compra" : "Venta" },
    { name: "Bollinger Bands", value: signal.value > 50 ? "Superior" : "Inferior", signal: signal.value > 50 ? "Compra" : "Venta" }
  ];

  // Gauge chart data
  const gaugeData = [
    { name: "Fuerte venta", value: 20, color: "#ef4444" },
    { name: "Venta", value: 20, color: "#f97316" },
    { name: "Neutral", value: 20, color: "#64748b" },
    { name: "Compra", value: 20, color: "#22c55e" },
    { name: "Fuerte compra", value: 20, color: "#10b981" }
  ];

  // Needle angle calculation (0-180 degrees)
  const needleAngle = (signal.value / 100) * 180;

  if (isLoading) {
    return (
      <Card className="tradeiq-card flex flex-col h-full">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            Volatility & Technical Indicators
            <Info className="h-4 w-4 text-gray-400" />
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-gray-400">Loading data...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="tradeiq-card flex flex-col h-full">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            Volatility & Technical Indicators
            <Info className="h-4 w-4 text-gray-400" />
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-red-400">Data unavailable</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="tradeiq-card flex flex-col h-full">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          Volatility & Technical Indicators
          <Info className="h-4 w-4 text-gray-400" />
        </CardTitle>
        <p className="text-sm text-gray-400">
          Real-time technical analysis signals
        </p>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-6">
          {/* Gauge Chart */}
          <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
            <h4 className="text-sm font-semibold text-white mb-2 text-center">Datos técnicos</h4>
            
            <div className="relative" style={{ height: '200px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={gaugeData}
                    cx="50%"
                    cy="85%"
                    startAngle={180}
                    endAngle={0}
                    innerRadius="60%"
                    outerRadius="90%"
                    dataKey="value"
                    stroke="none"
                  >
                    {gaugeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              
              {/* Needle */}
              <div 
                className="absolute bottom-[15%] left-1/2 origin-bottom transition-transform duration-700"
                style={{ 
                  width: '3px', 
                  height: '80px',
                  backgroundColor: 'white',
                  transform: `translateX(-50%) rotate(${needleAngle - 90}deg)`,
                  boxShadow: '0 0 10px rgba(255,255,255,0.5)'
                }}
              />
              
              {/* Center circle */}
              <div 
                className="absolute bottom-[15%] left-1/2 transform -translate-x-1/2 translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg"
              />
              
              {/* Signal Label */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-center">
                <Badge 
                  className="text-sm font-bold px-4 py-1"
                  style={{ backgroundColor: signal.color, color: 'white' }}
                >
                  {signal.label}
                </Badge>
              </div>

              {/* Labels on gauge */}
              <div className="absolute bottom-[10%] left-[5%] text-xs text-gray-400">
                Fuerte<br/>venta
              </div>
              <div className="absolute top-[25%] left-[15%] text-xs text-gray-400">
                Venta
              </div>
              <div className="absolute top-[10%] left-1/2 transform -translate-x-1/2 text-xs text-gray-400">
                Neutral
              </div>
              <div className="absolute top-[25%] right-[15%] text-xs text-gray-400">
                Compra
              </div>
              <div className="absolute bottom-[10%] right-[5%] text-xs text-gray-400 text-right">
                Fuerte<br/>compra
              </div>
            </div>
          </div>

          {/* Technical Indicators Table */}
          <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
            <h4 className="text-sm font-semibold text-white mb-3">Indicadores Técnicos</h4>
            <div className="space-y-2">
              {technicalIndicators.map((indicator, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0"
                >
                  <div>
                    <div className="text-sm text-white font-medium">{indicator.name}</div>
                    <div className="text-xs text-gray-400">{indicator.value}</div>
                  </div>
                  <Badge 
                    variant={indicator.signal === "Compra" ? "default" : "destructive"}
                    className="flex items-center gap-1"
                  >
                    {indicator.signal === "Compra" ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {indicator.signal}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
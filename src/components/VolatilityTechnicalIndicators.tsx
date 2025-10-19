import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";
import { useTradingViewWidgetData } from "@/hooks/useTradingViewWidgetData";
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

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

  // Volatility curve data (mock data - 31 days)
  const volatilityData = [
    { day: 110, volatility: 92 },
    { day: 125, volatility: 85 },
    { day: 140, volatility: 78 },
    { day: 155, volatility: 68 },
    { day: 170, volatility: 58 },
    { day: 185, volatility: 48 },
    { day: 200, volatility: 38 },
    { day: 215, volatility: 32 },
    { day: 230, volatility: 28 },
    { day: 245, volatility: 26 },
    { day: 260, volatility: 25 },
    { day: 275, volatility: 26 },
    { day: 290, volatility: 28 },
    { day: 295, volatility: 30 }
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
        <p className="text-xs text-gray-400 mt-1">
          Real-time technical analysis signals
        </p>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto">
        <div className="space-y-4">
          {/* Gauge Chart */}
          <div className="bg-gray-900/40 rounded-lg p-4 border border-gray-800/50">
            <h4 className="text-sm font-semibold text-white mb-2 text-center">Datos técnicos</h4>
            
            <div className="relative" style={{ height: '160px' }}>
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
                  height: '60px',
                  backgroundColor: 'white',
                  transform: `translateX(-50%) rotate(${needleAngle - 90}deg)`,
                  boxShadow: '0 0 10px rgba(255,255,255,0.5)'
                }}
              />
              
              {/* Center circle */}
              <div 
                className="absolute bottom-[15%] left-1/2 transform -translate-x-1/2 translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg"
              />
              
              {/* Signal Label */}
              <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-center">
                <Badge 
                  className="text-xs font-bold px-3 py-0.5"
                  style={{ backgroundColor: signal.color, color: 'white' }}
                >
                  {signal.label}
                </Badge>
              </div>

              {/* Labels on gauge */}
              <div className="absolute bottom-[10%] left-[8%] text-[10px] text-gray-500">
                Fuerte<br/>venta
              </div>
              <div className="absolute top-[25%] left-[18%] text-[10px] text-gray-500">
                Venta
              </div>
              <div className="absolute top-[12%] left-1/2 transform -translate-x-1/2 text-[10px] text-gray-500">
                Neutral
              </div>
              <div className="absolute top-[25%] right-[18%] text-[10px] text-gray-500">
                Compra
              </div>
              <div className="absolute bottom-[10%] right-[8%] text-[10px] text-gray-500 text-right">
                Fuerte<br/>compra
              </div>
            </div>
          </div>

          {/* Volatility Curve */}
          <div className="bg-gray-900/40 rounded-lg p-4 border border-gray-800/50">
            <h4 className="text-sm font-semibold text-white mb-3">Curva de volatilidad (31 días)</h4>
            <ResponsiveContainer width="100%" height={140}>
              <LineChart data={volatilityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="day" 
                  stroke="hsl(var(--muted-foreground))"
                  style={{ fontSize: '10px' }}
                  ticks={[110, 205, 295]}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  style={{ fontSize: '10px' }}
                  tickFormatter={(value) => `${value}%`}
                  domain={[0, 100]}
                  ticks={[25, 50, 75, 100]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '11px'
                  }}
                  formatter={(value: number) => [`${value.toFixed(2)}%`, 'Volatilidad']}
                />
                <Line 
                  type="monotone" 
                  dataKey="volatility" 
                  stroke="hsl(var(--tradeiq-blue))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--tradeiq-blue))', r: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
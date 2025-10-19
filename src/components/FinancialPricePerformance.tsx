import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Info } from "lucide-react";

interface FinancialPricePerformanceProps {
  asset: string;
}

export const FinancialPricePerformance = ({ asset }: FinancialPricePerformanceProps) => {
  // Mock financial data
  const financialData = [
    { year: '2020', revenue: 274.50, netRevenue: 57.40, netMargin: 20.9 },
    { year: '2021', revenue: 365.80, netRevenue: 94.68, netMargin: 25.9 },
    { year: '2022', revenue: 394.30, netRevenue: 99.80, netMargin: 25.3 },
    { year: '2023', revenue: 383.30, netRevenue: 97.00, netMargin: 25.3 },
    { year: '2024', revenue: 391.00, netRevenue: 93.70, netMargin: 24.0 }
  ];

  // Mock performance data
  const performanceData = [
    { period: '1W', return: 7.28, positive: true },
    { period: '1M', return: 12.50, positive: true },
    { period: '3M', return: 26.30, positive: true },
    { period: '6M', return: 14.92, positive: true },
    { period: 'YTD', return: 2.21, positive: true },
    { period: '1Y', return: 11.92, positive: true }
  ];

  return (
    <Card className="tradeiq-card flex flex-col h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white flex items-center gap-2">
              Financial & Price Performance
              <Info className="h-4 w-4 text-gray-400" />
            </CardTitle>
            <p className="text-xs text-gray-400 mt-1">
              Historical financials and return performance metrics
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Financial Chart */}
          <div className="bg-gray-900/40 rounded-lg p-4 border border-gray-800/50">
            <div className="flex items-center gap-2 mb-4">
              <h4 className="text-sm font-semibold text-white">Performance</h4>
              <Info className="h-3 w-3 text-gray-500" />
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <ComposedChart data={financialData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="year" 
                  stroke="hsl(var(--muted-foreground))"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  yAxisId="left"
                  stroke="hsl(var(--muted-foreground))"
                  style={{ fontSize: '12px' }}
                  label={{ value: 'B', angle: 0, position: 'top', offset: 10, style: { fill: 'hsl(var(--muted-foreground))' } }}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  stroke="hsl(var(--muted-foreground))"
                  style={{ fontSize: '12px' }}
                  label={{ value: '%', angle: 0, position: 'top', offset: 10, style: { fill: 'hsl(var(--muted-foreground))' } }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--popover-foreground))'
                  }}
                  formatter={(value: number, name: string) => {
                    if (name === 'netMargin') return [`${value}%`, 'Net Margin %'];
                    return [`${value}B`, name === 'revenue' ? 'Revenue' : 'Net Revenue'];
                  }}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                  formatter={(value) => {
                    if (value === 'revenue') return 'Revenue';
                    if (value === 'netRevenue') return 'Net Revenue';
                    if (value === 'netMargin') return 'Net Margin %';
                    return value;
                  }}
                />
                <Bar 
                  yAxisId="left"
                  dataKey="revenue" 
                  fill="hsl(var(--tradeiq-blue))" 
                  radius={[4, 4, 0, 0]}
                  maxBarSize={40}
                />
                <Bar 
                  yAxisId="left"
                  dataKey="netRevenue" 
                  fill="hsl(var(--tradeiq-success))" 
                  radius={[4, 4, 0, 0]}
                  maxBarSize={40}
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="netMargin" 
                  stroke="#fb923c" 
                  strokeWidth={2}
                  dot={{ fill: '#fb923c', r: 4 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Performance Returns */}
          <div className="bg-gray-900/40 rounded-lg p-4 border border-gray-800/50">
            <h4 className="text-sm font-semibold text-white mb-3">Returns</h4>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                {performanceData.map((perf) => (
                  <div
                    key={perf.period}
                    className="bg-tradeiq-success/10 border border-tradeiq-success/30 rounded-md px-2 py-2.5 text-center min-h-[65px] flex flex-col justify-center items-center"
                  >
                    <div className="text-[13px] font-bold text-tradeiq-success leading-tight whitespace-nowrap">
                      {perf.return > 0 ? '+' : ''}{perf.return}%
                    </div>
                    <div className="text-[11px] text-gray-500 mt-1.5 font-medium">{perf.period}</div>
                  </div>
                ))}
              </div>
              
              <div className="pt-3 border-t border-gray-800/50">
                <p className="text-xs text-gray-500 leading-relaxed">
                  Each percentage indicates how much the {asset} stock price has risen or fallen 
                  during that specific time period. Positive returns (green) show price appreciation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
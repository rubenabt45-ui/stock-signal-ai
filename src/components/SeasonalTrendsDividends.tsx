import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface SeasonalTrendsDividendsProps {
  asset: string;
}

export const SeasonalTrendsDividends = ({ asset }: SeasonalTrendsDividendsProps) => {
  // Mock seasonal data for demonstration
  const seasonalData = [
    { month: 'Jan', year2023: 100, year2024: 95, year2025: 98 },
    { month: 'Feb', year2023: 105, year2024: 100, year2025: 102 },
    { month: 'Mar', year2023: 115, year2024: 110, year2025: 108 },
    { month: 'Apr', year2023: 120, year2024: 105, year2025: 115 },
    { month: 'May', year2023: 125, year2024: 115, year2025: 120 },
    { month: 'Jun', year2023: 130, year2024: 120, year2025: 125 },
    { month: 'Jul', year2023: 128, year2024: 118, year2025: 130 },
    { month: 'Aug', year2023: 135, year2024: 125, year2025: 135 },
    { month: 'Sep', year2023: 140, year2024: 130, year2025: 138 },
    { month: 'Oct', year2023: 138, year2024: 128, year2025: null },
    { month: 'Nov', year2023: 142, year2024: 135, year2025: null },
    { month: 'Dec', year2023: 145, year2024: 140, year2025: null }
  ];

  // Mock dividend data
  const dividendYield = 15.35;
  const dividendData = [
    { name: 'Dividend Payout Ratio', value: dividendYield, color: 'hsl(var(--tradeiq-success))' },
    { name: 'Retained Earnings', value: 100 - dividendYield, color: 'hsl(var(--muted))' }
  ];

  const dividendDetails = {
    yieldTTM: '0.40%',
    lastPayment: '0.26',
    exDividendDate: 'Aug 11, 2025',
    paymentDate: 'Aug 14, 2025'
  };

  return (
    <Card className="tradeiq-card flex flex-col h-full">
      <CardHeader>
        <CardTitle className="text-white">Seasonal Trends & Dividend Performance</CardTitle>
        <p className="text-xs text-gray-400 mt-1">
          Year-over-year seasonal patterns and dividend distribution
        </p>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
          {/* Seasonal Trends Chart */}
          <div className="bg-gray-900/40 rounded-lg p-4 border border-gray-800/50">
            <h4 className="text-sm font-semibold text-white mb-4">Seasonal Trends</h4>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={seasonalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="month" 
                  stroke="hsl(var(--muted-foreground))"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--popover-foreground))'
                  }}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '12px' }}
                  iconType="line"
                />
                <Line 
                  type="monotone" 
                  dataKey="year2023" 
                  stroke="#a855f7" 
                  strokeWidth={2}
                  name="2023"
                  dot={{ fill: '#a855f7', r: 3 }}
                  connectNulls
                />
                <Line 
                  type="monotone" 
                  dataKey="year2024" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  name="2024"
                  dot={{ fill: '#ef4444', r: 3 }}
                  connectNulls
                />
                <Line 
                  type="monotone" 
                  dataKey="year2025" 
                  stroke="hsl(var(--tradeiq-blue))" 
                  strokeWidth={2}
                  name="2025"
                  dot={{ fill: 'hsl(var(--tradeiq-blue))', r: 3 }}
                  connectNulls
                />
              </LineChart>
            </ResponsiveContainer>
            <p className="text-xs text-gray-500 mt-3">
              Seasonal evolution of {asset} stock comparing performance across different years
            </p>
          </div>

          {/* Dividend Performance */}
          <div className="bg-gray-900/40 rounded-lg p-4 border border-gray-800/50">
            <h4 className="text-sm font-semibold text-white mb-4">Dividends</h4>
            <div className="flex flex-col items-center justify-center h-[250px]">
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={dividendData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {dividendData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="text-center -mt-2">
                <p className="text-2xl font-bold text-tradeiq-success">{dividendYield}%</p>
                <p className="text-xs text-gray-500">Dividend Payout Ratio (TTM)</p>
              </div>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Retained Earnings</span>
                <span className="text-gray-400">●</span>
              </div>
              <div className="flex justify-between">
                <span className="text-tradeiq-success">Dividend Payout Ratio (TTM)</span>
                <span className="text-tradeiq-success">●</span>
              </div>
              <div className="h-px bg-gray-800 my-3"></div>
              <div className="flex justify-between">
                <span className="text-gray-400">Dividend Yield TTM</span>
                <span className="text-white font-semibold">{dividendDetails.yieldTTM}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Last Payment</span>
                <span className="text-white font-semibold">{dividendDetails.lastPayment}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Ex-Dividend Date</span>
                <span className="text-white font-semibold">{dividendDetails.exDividendDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Payment Date</span>
                <span className="text-white font-semibold">{dividendDetails.paymentDate}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
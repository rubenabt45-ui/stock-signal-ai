
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface StockChartProps {
  symbol: string;
}

// Generate mock chart data
const generateChartData = () => {
  const data = [];
  let price = 150 + Math.random() * 50;
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Add some volatility
    price += (Math.random() - 0.5) * 10;
    price = Math.max(price, 50); // Minimum price
    
    data.push({
      date: date.toISOString().split('T')[0],
      price: parseFloat(price.toFixed(2)),
      volume: Math.floor(Math.random() * 10000000)
    });
  }
  
  return data;
};

export const StockChart = ({ symbol }: StockChartProps) => {
  const data = generateChartData();
  
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="date" 
            stroke="#9ca3af"
            fontSize={12}
            tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          />
          <YAxis 
            stroke="#9ca3af"
            fontSize={12}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1f2937', 
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#ffffff'
            }}
            labelFormatter={(value) => `Date: ${new Date(value).toLocaleDateString()}`}
            formatter={(value: any) => [`$${value}`, 'Price']}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke="#10b981"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorPrice)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

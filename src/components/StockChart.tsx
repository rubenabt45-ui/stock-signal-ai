
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { useEffect, useState } from 'react';
import { useRealTimePriceContext } from '@/components/RealTimePriceProvider';

interface StockChartProps {
  symbol: string;
}

// Generate initial historical data
const generateHistoricalData = (currentPrice?: number) => {
  const data = [];
  let price = currentPrice || (150 + Math.random() * 50);
  
  for (let i = 30; i >= 1; i--) {
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
  const { prices, isConnected, subscribe } = useRealTimePriceContext();
  const [chartData, setChartData] = useState(() => generateHistoricalData());

  useEffect(() => {
    // Subscribe to real-time updates for this symbol
    subscribe([symbol]);
  }, [symbol, subscribe]);

  useEffect(() => {
    // Update chart data when new price data comes in
    const currentPriceData = prices[symbol];
    if (currentPriceData) {
      setChartData(prevData => {
        const newData = [...prevData];
        
        // Add today's real-time price as the current data point
        const today = new Date().toISOString().split('T')[0];
        const todayIndex = newData.findIndex(item => item.date === today);
        
        if (todayIndex >= 0) {
          // Update today's price
          newData[todayIndex] = {
            ...newData[todayIndex],
            price: currentPriceData.currentPrice,
            volume: Math.floor(Math.random() * 10000000)
          };
        } else {
          // Add today's data point
          newData.push({
            date: today,
            price: currentPriceData.currentPrice,
            volume: Math.floor(Math.random() * 10000000)
          });
        }
        
        return newData;
      });
    }
  }, [prices, symbol]);
  
  return (
    <div className="h-80 relative">
      {/* Real-time connection indicator */}
      <div className="absolute top-2 right-2 z-10 flex items-center space-x-2">
        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
        <span className="text-xs text-gray-400">{isConnected ? 'Live' : 'Offline'}</span>
      </div>
      
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(37, 99, 235, 0.1)" />
          <XAxis 
            dataKey="date" 
            stroke="#64748B"
            fontSize={12}
            fontFamily="Inter"
            tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          />
          <YAxis 
            stroke="#64748B"
            fontSize={12}
            fontFamily="Inter"
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(11, 17, 32, 0.95)', 
              border: '1px solid rgba(37, 99, 235, 0.2)',
              borderRadius: '12px',
              color: '#ffffff',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
              backdropFilter: 'blur(10px)'
            }}
            labelFormatter={(value) => `Date: ${new Date(value).toLocaleDateString()}`}
            formatter={(value: any) => [`$${value}`, 'Price']}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke="#2563EB"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorPrice)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

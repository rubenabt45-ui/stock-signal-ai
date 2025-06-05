import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, ReferenceLine } from 'recharts';
import { useEffect, useState } from 'react';
import { useRealTimePriceContext } from '@/components/RealTimePriceProvider';
import { useMarketData } from '@/hooks/useMarketData';

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
      time: date.getTime(),
      price: parseFloat(price.toFixed(2)),
      volume: Math.floor(Math.random() * 10000000)
    });
  }
  
  return data;
};

export const StockChart = ({ symbol }: StockChartProps) => {
  const { prices, isConnected } = useRealTimePriceContext();
  const { price: marketPrice, isLoading, error } = useMarketData(symbol);
  const [chartData, setChartData] = useState(() => generateHistoricalData());
  const [realTimePrice, setRealTimePrice] = useState<number | null>(null);

  useEffect(() => {
    // Update chart data when market data changes
    if (marketPrice && !isLoading) {
      setRealTimePrice(marketPrice);
      
      setChartData(prevData => {
        const newData = [...prevData];
        
        // Add market data as the latest data point
        const now = new Date();
        const timeKey = now.getTime();
        
        newData.push({
          date: now.toISOString().split('T')[0],
          time: timeKey,
          price: marketPrice,
          volume: Math.floor(Math.random() * 10000000),
          isRealTime: true
        });
        
        // Keep only the last 50 data points for performance
        return newData.slice(-50);
      });
    }
  }, [marketPrice, isLoading]);

  useEffect() => {
    // Also handle WebSocket price updates from RealTimePriceProvider
    const currentPriceData = prices[symbol];
    if (currentPriceData && currentPriceData.currentPrice !== realTimePrice) {
      setRealTimePrice(currentPriceData.currentPrice);
      
      setChartData(prevData => {
        const newData = [...prevData];
        
        const now = new Date();
        const timeKey = now.getTime();
        
        newData.push({
          date: now.toISOString().split('T')[0],
          time: timeKey,
          price: currentPriceData.currentPrice,
          volume: Math.floor(Math.random() * 10000000),
          isRealTime: true
        });
        
        return newData.slice(-50);
      });
    }
  }, [prices, symbol, realTimePrice]);

  // Show error state if market data fails
  if (error && !isConnected) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-2">Data unavailable</p>
          <p className="text-gray-500 text-sm">Unable to fetch market data</p>
        </div>
      </div>
    );
  }

  // Show loading state
  if (isLoading && !realTimePrice) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tradeiq-blue mx-auto mb-2"></div>
          <p className="text-gray-400 text-sm">Loading market data...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-80 relative">
      {/* Real-time connection and price indicator */}
      <div className="absolute top-2 right-2 z-10 flex items-center space-x-3">
        {realTimePrice && (
          <div className="bg-black/80 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-gray-700">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-bold text-white">${realTimePrice.toFixed(2)}</span>
              <div className={`w-2 h-2 rounded-full ${
                (isConnected || !isLoading) ? 'bg-green-500 animate-pulse' : 'bg-red-500'
              }`}></div>
            </div>
          </div>
        )}
        <div className="bg-black/80 backdrop-blur-sm rounded-lg px-2 py-1">
          <span className="text-xs text-gray-300">
            {error ? 'Offline' : isLoading ? 'Loading...' : 'Live'}
          </span>
        </div>
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
            dataKey="time" 
            stroke="#64748B"
            fontSize={12}
            fontFamily="Inter"
            tickFormatter={(value) => {
              const date = new Date(value);
              return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            }}
          />
          <YAxis 
            stroke="#64748B"
            fontSize={12}
            fontFamily="Inter"
            tickFormatter={(value) => `$${value.toFixed(2)}`}
            domain={['dataMin - 5', 'dataMax + 5']}
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
            labelFormatter={(value) => {
              const date = new Date(value);
              return `Time: ${date.toLocaleString()}`;
            }}
            formatter={(value: any, name: string, props: any) => [
              `$${value.toFixed(2)}`,
              props.payload.isRealTime ? 'Live Price' : 'Price'
            ]}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke="#2563EB"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorPrice)"
            dot={(props: any) => {
              // Highlight real-time data points
              if (props.payload.isRealTime) {
                return (
                  <circle
                    cx={props.cx}
                    cy={props.cy}
                    r={4}
                    fill="#10B981"
                    stroke="#ffffff"
                    strokeWidth={2}
                  />
                );
              }
              return null;
            }}
          />
          {realTimePrice && (
            <ReferenceLine 
              y={realTimePrice} 
              stroke="#10B981" 
              strokeDasharray="2 2"
              strokeWidth={2}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

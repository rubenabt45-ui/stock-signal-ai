import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, ReferenceLine } from 'recharts';
import { useEffect, useState } from 'react';
import { useRealTimePriceContext } from '@/components/RealTimePriceProvider';
import { useMarketData } from '@/hooks/useMarketData';

interface StockChartProps {
  symbol: string;
  timeframe?: string;
}

// Generate initial historical data based on timeframe
const generateHistoricalData = (currentPrice?: number, timeframe: string = '1D') => {
  const data = [];
  let price = currentPrice || (150 + Math.random() * 50);
  
  // Determine number of data points based on timeframe
  const getDataPoints = (tf: string) => {
    switch (tf) {
      case '1D': return 24; // Hourly data for 1 day
      case '1W': return 7;   // Daily data for 1 week
      case '1M': return 30;  // Daily data for 1 month
      case '3M': return 90;  // Daily data for 3 months
      case '6M': return 180; // Daily data for 6 months
      case '1Y': return 365; // Daily data for 1 year
      default: return 30;
    }
  };

  const points = getDataPoints(timeframe);
  
  for (let i = points; i >= 1; i--) {
    const date = new Date();
    
    // Set time intervals based on timeframe
    if (timeframe === '1D') {
      date.setHours(date.getHours() - i);
    } else {
      date.setDate(date.getDate() - i);
    }
    
    // Add volatility based on timeframe (longer timeframes = more volatility)
    const volatilityMultiplier = timeframe === '1D' ? 0.02 : 
                                timeframe === '1W' ? 0.03 :
                                timeframe === '1M' ? 0.04 :
                                timeframe === '3M' ? 0.05 :
                                timeframe === '6M' ? 0.06 : 0.08;
    
    const volatility = (Math.random() - 0.5) * volatilityMultiplier;
    price *= (1 + volatility);
    price = Math.max(price, 50); // Minimum price
    
    data.push({
      date: date.toISOString().split('T')[0],
      time: date.getTime(),
      price: parseFloat(price.toFixed(2)),
      volume: Math.floor(Math.random() * 10000000),
      timeframe: timeframe
    });
  }
  
  return data;
};

export const StockChart = ({ symbol, timeframe = '1D' }: StockChartProps) => {
  const { prices, isConnected } = useRealTimePriceContext();
  const { price: marketPrice, change, isLoading, error, lastUpdated } = useMarketData(symbol);
  const [chartData, setChartData] = useState(() => generateHistoricalData(undefined, timeframe));
  const [lastDataUpdate, setLastDataUpdate] = useState<number | null>(null);
  const [currentTimeframe, setCurrentTimeframe] = useState(timeframe);

  // Regenerate chart data when timeframe changes
  useEffect(() => {
    if (timeframe !== currentTimeframe) {
      console.log(`📈 Chart timeframe changed from ${currentTimeframe} to ${timeframe} for ${symbol}`);
      setCurrentTimeframe(timeframe);
      const newData = generateHistoricalData(marketPrice, timeframe);
      setChartData(newData);
      setLastDataUpdate(null); // Reset to allow fresh data
    }
  }, [timeframe, currentTimeframe, symbol, marketPrice]);

  // Update chart data when market data changes
  useEffect(() => {
    if (marketPrice && lastUpdated && (!lastDataUpdate || lastUpdated > lastDataUpdate)) {
      console.log(`📊 Updating chart data for ${symbol}:`, { price: marketPrice, timeframe, timestamp: new Date(lastUpdated).toLocaleTimeString() });
      
      setChartData(prevData => {
        const newData = [...prevData];
        
        // Add market data as the latest data point
        newData.push({
          date: new Date(lastUpdated).toISOString().split('T')[0],
          time: lastUpdated,
          price: marketPrice,
          volume: Math.floor(Math.random() * 10000000),
          isRealTime: true,
          isLatest: true,
          timeframe: timeframe
        });
        
        // Keep appropriate number of data points based on timeframe
        const maxPoints = timeframe === '1D' ? 50 : 
                         timeframe === '1W' ? 40 :
                         timeframe === '1M' ? 60 : 100;
        
        return newData.slice(-maxPoints);
      });
      
      setLastDataUpdate(lastUpdated);
    }
  }, [marketPrice, lastUpdated, symbol, lastDataUpdate, timeframe]);

  // Also handle WebSocket price updates from RealTimePriceProvider as fallback
  useEffect(() => {
    const currentPriceData = prices[symbol];
    if (currentPriceData && currentPriceData.timestamp && (!lastDataUpdate || currentPriceData.timestamp > lastDataUpdate)) {
      console.log(`🔄 WebSocket update for ${symbol}:`, { price: currentPriceData.currentPrice, timeframe, timestamp: new Date(currentPriceData.timestamp).toLocaleTimeString() });
      
      setChartData(prevData => {
        const newData = [...prevData];
        
        newData.push({
          date: new Date(currentPriceData.timestamp).toISOString().split('T')[0],
          time: currentPriceData.timestamp,
          price: currentPriceData.currentPrice,
          volume: Math.floor(Math.random() * 10000000),
          isRealTime: true,
          isWebSocket: true,
          timeframe: timeframe
        });
        
        const maxPoints = timeframe === '1D' ? 50 : 
                         timeframe === '1W' ? 40 :
                         timeframe === '1M' ? 60 : 100;
        
        return newData.slice(-maxPoints);
      });
      
      setLastDataUpdate(currentPriceData.timestamp);
    }
  }, [prices, symbol, lastDataUpdate, timeframe]);

  // Determine connection status based on data freshness
  const getConnectionStatus = () => {
    const hasRecentData = lastDataUpdate && (Date.now() - lastDataUpdate) < 120000; // 2 minutes
    const hasMarketData = marketPrice && !isLoading && !error;
    const hasWebSocketData = isConnected && prices[symbol];
    
    if (hasRecentData && (hasMarketData || hasWebSocketData)) {
      return { status: 'Live', color: 'text-green-500', bgColor: 'bg-green-500' };
    }
    if (isLoading) {
      return { status: 'Loading...', color: 'text-blue-500', bgColor: 'bg-blue-500' };
    }
    if (error) {
      return { status: 'Error', color: 'text-red-500', bgColor: 'bg-red-500' };
    }
    return { status: 'Connecting...', color: 'text-yellow-500', bgColor: 'bg-yellow-500' };
  };

  const connectionStatus = getConnectionStatus();
  const displayPrice = marketPrice || (prices[symbol]?.currentPrice);

  // Show error state if no data available
  if (error && !displayPrice && !isConnected) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-2">Data unavailable</p>
          <p className="text-gray-500 text-sm">Unable to fetch market data</p>
        </div>
      </div>
    );
  }

  // Show loading state only if no data at all
  if (isLoading && !displayPrice && chartData.length <= 30) {
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
        {displayPrice && (
          <div className="bg-black/80 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-gray-700">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-bold text-white">${displayPrice.toFixed(2)}</span>
              <div className={`w-2 h-2 rounded-full ${connectionStatus.bgColor} ${
                connectionStatus.status === 'Live' ? 'animate-pulse' : ''
              }`}></div>
            </div>
          </div>
        )}
        <div className="bg-black/80 backdrop-blur-sm rounded-lg px-2 py-1">
          <span className={`text-xs ${connectionStatus.color}`}>
            {connectionStatus.status}
          </span>
        </div>
        <div className="bg-black/80 backdrop-blur-sm rounded-lg px-2 py-1">
          <span className="text-xs text-blue-400 font-medium">
            {timeframe}
          </span>
        </div>
        {lastDataUpdate && (
          <div className="bg-black/80 backdrop-blur-sm rounded-lg px-2 py-1">
            <span className="text-xs text-gray-300">
              {new Date(lastDataUpdate).toLocaleTimeString()}
            </span>
          </div>
        )}
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
              if (timeframe === '1D') {
                return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
              }
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
            formatter={(value: any, name: string, props: any) => {
              const isRealTime = props.payload.isRealTime;
              const isWebSocket = props.payload.isWebSocket;
              const isLatest = props.payload.isLatest;
              
              let label = 'Price';
              if (isLatest) label = 'Latest Price';
              else if (isWebSocket) label = 'WebSocket Price';
              else if (isRealTime) label = 'Live Price';
              
              return [`$${value.toFixed(2)}`, label];
            }}
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
                const color = props.payload.isLatest ? "#10B981" : props.payload.isWebSocket ? "#8B5CF6" : "#F59E0B";
                return (
                  <circle
                    cx={props.cx}
                    cy={props.cy}
                    r={props.payload.isLatest ? 5 : 3}
                    fill={color}
                    stroke="#ffffff"
                    strokeWidth={2}
                  />
                );
              }
              return null;
            }}
          />
          {displayPrice && (
            <ReferenceLine 
              y={displayPrice} 
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

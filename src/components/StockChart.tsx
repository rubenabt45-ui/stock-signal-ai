import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, ReferenceLine } from 'recharts';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { useRealTimePriceContext } from '@/components/RealTimePriceProvider';
import { useMarketData } from '@/hooks/useMarketData';

interface StockChartProps {
  symbol: string;
  timeframe?: string;
}

interface ChartDataPoint {
  date: string;
  time: number;
  price: number;
  volume: number;
  isRealTime?: boolean;
  isLatest?: boolean;
  isWebSocket?: boolean;
  timeframe: string;
}

// Generate realistic historical data based on timeframe with proper intervals
const generateHistoricalData = (currentPrice: number, timeframe: string): ChartDataPoint[] => {
  const data: ChartDataPoint[] = [];
  let price = currentPrice || (150 + Math.random() * 50);
  
  // Configure data points and intervals based on timeframe
  const timeframeConfig = {
    '1D': { points: 78, intervalMinutes: 5, volatility: 0.008 }, // 5-minute intervals for 6.5 hours
    '1W': { points: 7, intervalMinutes: 1440, volatility: 0.015 }, // Daily intervals
    '1M': { points: 30, intervalMinutes: 1440, volatility: 0.02 }, // Daily intervals
    '3M': { points: 12, intervalMinutes: 10080, volatility: 0.03 }, // Weekly intervals
    '6M': { points: 26, intervalMinutes: 10080, volatility: 0.035 }, // Weekly intervals
    '1Y': { points: 12, intervalMinutes: 43200, volatility: 0.04 }, // Monthly intervals
  };

  const config = timeframeConfig[timeframe as keyof typeof timeframeConfig] || timeframeConfig['1D'];
  
  for (let i = config.points; i >= 1; i--) {
    const date = new Date();
    
    // Calculate proper time intervals
    date.setMinutes(date.getMinutes() - (i * config.intervalMinutes));
    
    // Add realistic volatility with trend component
    const trendComponent = Math.sin(i / config.points * Math.PI) * 0.01;
    const randomComponent = (Math.random() - 0.5) * config.volatility;
    const volatility = trendComponent + randomComponent;
    
    price *= (1 + volatility);
    price = Math.max(price, 50); // Minimum price floor
    
    data.push({
      date: date.toISOString(),
      time: date.getTime(),
      price: parseFloat(price.toFixed(2)),
      volume: Math.floor(Math.random() * 5000000 + 1000000),
      timeframe: timeframe
    });
  }
  
  return data.sort((a, b) => a.time - b.time);
};

export const StockChart = ({ symbol, timeframe = '1D' }: StockChartProps) => {
  const { prices, isConnected, error: wsError } = useRealTimePriceContext();
  const { price: marketPrice, change, isLoading, error: marketError, lastUpdated } = useMarketData(symbol);
  
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [lastDataUpdate, setLastDataUpdate] = useState<number | null>(null);
  const [isChartLoading, setIsChartLoading] = useState(true);

  // Memoize base price for consistent data generation
  const basePrice = useMemo(() => {
    return marketPrice || (prices[symbol]?.currentPrice) || (150 + Math.random() * 50);
  }, [marketPrice, prices, symbol]);

  // Generate fresh chart data when timeframe or symbol changes
  const regenerateChartData = useCallback(() => {
    console.log(`📈 Regenerating chart data for ${symbol} with timeframe ${timeframe}`);
    setIsChartLoading(true);
    
    // Small delay to show loading state
    setTimeout(() => {
      const newData = generateHistoricalData(basePrice, timeframe);
      setChartData(newData);
      setLastDataUpdate(null); // Reset to allow fresh real-time data
      setIsChartLoading(false);
      console.log(`✅ Chart data regenerated: ${newData.length} points for ${timeframe}`);
    }, 300);
  }, [symbol, timeframe, basePrice]);

  // Regenerate data when timeframe or symbol changes
  useEffect(() => {
    regenerateChartData();
  }, [regenerateChartData]);

  // Add real-time market data updates
  useEffect(() => {
    if (marketPrice && lastUpdated && (!lastDataUpdate || lastUpdated > lastDataUpdate)) {
      console.log(`📊 Adding market data update for ${symbol}: $${marketPrice}`);
      
      setChartData(prevData => {
        const newData = [...prevData];
        
        // Add market data as the latest point
        newData.push({
          date: new Date(lastUpdated).toISOString(),
          time: lastUpdated,
          price: marketPrice,
          volume: Math.floor(Math.random() * 5000000 + 1000000),
          isRealTime: true,
          isLatest: true,
          timeframe: timeframe
        });
        
        // Keep appropriate number of points
        const maxPoints = timeframe === '1D' ? 80 : 
                         timeframe === '1W' ? 10 :
                         timeframe === '1M' ? 35 : 50;
        
        return newData.slice(-maxPoints);
      });
      
      setLastDataUpdate(lastUpdated);
    }
  }, [marketPrice, lastUpdated, symbol, lastDataUpdate, timeframe]);

  // Add WebSocket updates as fallback
  useEffect(() => {
    const currentPriceData = prices[symbol];
    if (currentPriceData && currentPriceData.timestamp && (!lastDataUpdate || currentPriceData.timestamp > lastDataUpdate)) {
      console.log(`🔄 Adding WebSocket update for ${symbol}: $${currentPriceData.currentPrice}`);
      
      setChartData(prevData => {
        const newData = [...prevData];
        
        newData.push({
          date: new Date(currentPriceData.timestamp).toISOString(),
          time: currentPriceData.timestamp,
          price: currentPriceData.currentPrice,
          volume: Math.floor(Math.random() * 5000000 + 1000000),
          isRealTime: true,
          isWebSocket: true,
          timeframe: timeframe
        });
        
        const maxPoints = timeframe === '1D' ? 80 : 
                         timeframe === '1W' ? 10 :
                         timeframe === '1M' ? 35 : 50;
        
        return newData.slice(-maxPoints);
      });
      
      setLastDataUpdate(currentPriceData.timestamp);
    }
  }, [prices, symbol, lastDataUpdate, timeframe]);

  // Calculate Y-axis domain with proper scaling
  const yAxisDomain = useMemo(() => {
    if (chartData.length === 0) return ['dataMin - 5', 'dataMax + 5'];
    
    const prices = chartData.map(d => d.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const padding = (maxPrice - minPrice) * 0.1; // 10% padding
    
    return [
      Math.max(0, minPrice - padding),
      maxPrice + padding
    ];
  }, [chartData]);

  // Format X-axis based on timeframe
  const formatXAxis = useCallback((value: number) => {
    const date = new Date(value);
    
    switch (timeframe) {
      case '1D':
        return date.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        });
      case '1W':
      case '1M':
        return date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        });
      case '3M':
      case '6M':
        return date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        });
      case '1Y':
        return date.toLocaleDateString('en-US', { 
          month: 'short',
          year: '2-digit'
        });
      default:
        return date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        });
    }
  }, [timeframe]);

  // Determine connection status
  const getConnectionStatus = () => {
    if (isChartLoading) {
      return { status: 'Loading...', color: 'text-blue-500', bgColor: 'bg-blue-500' };
    }
    
    const hasRecentData = lastDataUpdate && (Date.now() - lastDataUpdate) < 120000; // 2 minutes
    const hasMarketData = marketPrice && !isLoading && !marketError;
    const hasWebSocketData = isConnected && prices[symbol];
    
    if (wsError && wsError.includes('Maximum reconnection')) {
      return { status: 'Connection Failed', color: 'text-red-500', bgColor: 'bg-red-500' };
    }
    
    if (wsError && wsError.includes('reconnecting')) {
      return { status: 'Reconnecting...', color: 'text-yellow-500', bgColor: 'bg-yellow-500' };
    }
    
    if (hasRecentData && (hasMarketData || hasWebSocketData)) {
      return { status: 'Live', color: 'text-green-500', bgColor: 'bg-green-500' };
    }
    
    if (isLoading) {
      return { status: 'Loading...', color: 'text-blue-500', bgColor: 'bg-blue-500' };
    }
    
    if (marketError && !basePrice) {
      return { status: 'Error', color: 'text-red-500', bgColor: 'bg-red-500' };
    }
    
    return { status: 'Demo Mode', color: 'text-gray-500', bgColor: 'bg-gray-500' };
  };

  const connectionStatus = getConnectionStatus();
  const displayPrice = marketPrice || (prices[symbol]?.currentPrice) || basePrice;

  if (isChartLoading) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tradeiq-blue mx-auto mb-2"></div>
          <p className="text-gray-400 text-sm">Loading {timeframe} chart data...</p>
        </div>
      </div>
    );
  }

  if (marketError && !displayPrice && chartData.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-2">Chart unavailable</p>
          <p className="text-gray-500 text-sm">Unable to load {timeframe} data for {symbol}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-80 relative">
      {/* Chart status indicators */}
      <div className="absolute top-2 right-2 z-10 flex items-center space-x-2">
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
          <span className={`text-xs font-medium ${connectionStatus.color}`}>
            {connectionStatus.status}
          </span>
        </div>
        <div className="bg-black/80 backdrop-blur-sm rounded-lg px-2 py-1">
          <span className="text-xs text-blue-400 font-bold">
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
        <AreaChart data={chartData} key={`${symbol}-${timeframe}`}>
          <defs>
            <linearGradient id={`colorPrice-${symbol}-${timeframe}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(37, 99, 235, 0.15)" />
          <XAxis 
            dataKey="time" 
            stroke="#64748B"
            fontSize={11}
            fontFamily="Inter"
            tickFormatter={formatXAxis}
            domain={['dataMin', 'dataMax']}
            type="number"
            scale="time"
          />
          <YAxis 
            stroke="#64748B"
            fontSize={11}
            fontFamily="Inter"
            tickFormatter={(value) => `$${value.toFixed(2)}`}
            domain={yAxisDomain}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(11, 17, 32, 0.95)', 
              border: '1px solid rgba(37, 99, 235, 0.3)',
              borderRadius: '12px',
              color: '#ffffff',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(10px)',
              fontSize: '13px'
            }}
            labelFormatter={(value) => {
              const date = new Date(value);
              return `${timeframe}: ${date.toLocaleString()}`;
            }}
            formatter={(value: any, name: string, props: any) => {
              const isRealTime = props.payload.isRealTime;
              const isWebSocket = props.payload.isWebSocket;
              const isLatest = props.payload.isLatest;
              
              let label = 'Price';
              if (isLatest) label = '🔴 Latest Price';
              else if (isWebSocket) label = '🟡 WebSocket Price';
              else if (isRealTime) label = '🟢 Live Price';
              
              return [`$${value.toFixed(2)}`, label];
            }}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke="#2563EB"
            strokeWidth={2.5}
            fillOpacity={1}
            fill={`url(#colorPrice-${symbol}-${timeframe})`}
            dot={(props: any) => {
              if (props.payload.isRealTime) {
                const color = props.payload.isLatest ? "#10B981" : 
                             props.payload.isWebSocket ? "#8B5CF6" : "#F59E0B";
                return (
                  <circle
                    cx={props.cx}
                    cy={props.cy}
                    r={props.payload.isLatest ? 4 : 2.5}
                    fill={color}
                    stroke="#ffffff"
                    strokeWidth={1.5}
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
              strokeDasharray="3 3"
              strokeWidth={1.5}
              strokeOpacity={0.7}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

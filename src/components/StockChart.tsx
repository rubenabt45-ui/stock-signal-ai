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

// Enhanced data generation with proper timeframe-specific intervals
const generateHistoricalData = (currentPrice: number, timeframe: string): ChartDataPoint[] => {
  const data: ChartDataPoint[] = [];
  let price = currentPrice || (150 + Math.random() * 50);
  
  // Comprehensive timeframe configuration
  const timeframeConfig = {
    '1D': { points: 48, intervalMinutes: 15, volatility: 0.008, label: 'Hourly' }, // 15-min intervals for day trading
    '1W': { points: 7, intervalMinutes: 1440, volatility: 0.015, label: 'Daily' }, // Daily for week
    '1M': { points: 22, intervalMinutes: 1440, volatility: 0.02, label: 'Daily' }, // Business days in month
    '3M': { points: 13, intervalMinutes: 10080, volatility: 0.03, label: 'Weekly' }, // Weekly for quarter
    '6M': { points: 26, intervalMinutes: 10080, volatility: 0.035, label: 'Weekly' }, // Bi-weekly
    '1Y': { points: 12, intervalMinutes: 43800, volatility: 0.04, label: 'Monthly' }, // Monthly for year
  };

  const config = timeframeConfig[timeframe as keyof typeof timeframeConfig] || timeframeConfig['1D'];
  console.log(`📊 Generating ${config.points} data points for ${timeframe} with ${config.label} intervals`);
  
  for (let i = config.points; i >= 1; i--) {
    const date = new Date();
    
    // Calculate proper time intervals based on timeframe
    if (timeframe === '1D') {
      date.setMinutes(date.getMinutes() - (i * config.intervalMinutes));
    } else if (timeframe === '1W' || timeframe === '1M') {
      date.setDate(date.getDate() - i);
    } else {
      date.setDate(date.getDate() - (i * 7)); // Weekly intervals for longer periods
    }
    
    // Realistic price movement with timeframe-appropriate volatility
    const trendComponent = Math.sin(i / config.points * Math.PI * 2) * 0.02;
    const randomComponent = (Math.random() - 0.5) * config.volatility;
    const marketHours = timeframe === '1D' ? (date.getHours() >= 9 && date.getHours() <= 16 ? 1.2 : 0.8) : 1;
    
    price *= (1 + (trendComponent + randomComponent) * marketHours);
    price = Math.max(price, 50); // Price floor
    
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
  const [chartKey, setChartKey] = useState(`${symbol}-${timeframe}-${Date.now()}`);

  // Memoize base price for consistent data generation
  const basePrice = useMemo(() => {
    return marketPrice || (prices[symbol]?.currentPrice) || (150 + Math.random() * 50);
  }, [marketPrice, prices, symbol]);

  // Generate fresh chart data when timeframe or symbol changes
  const regenerateChartData = useCallback(() => {
    console.log(`📈 IMMEDIATE: Regenerating chart data for ${symbol} with timeframe ${timeframe}`);
    setIsChartLoading(true);
    setChartKey(`${symbol}-${timeframe}-${Date.now()}`); // Force chart re-render
    
    // Immediate update for responsive UX
    const newData = generateHistoricalData(basePrice, timeframe);
    setChartData(newData);
    setLastDataUpdate(null);
    setIsChartLoading(false);
    console.log(`✅ Chart data regenerated IMMEDIATELY: ${newData.length} points for ${timeframe}`);
  }, [symbol, timeframe, basePrice]);

  // IMMEDIATE regeneration on timeframe/symbol change
  useEffect(() => {
    regenerateChartData();
  }, [timeframe, symbol, regenerateChartData]);

  // Add real-time market data updates
  useEffect(() => {
    if (marketPrice && lastUpdated && (!lastDataUpdate || lastUpdated > lastDataUpdate)) {
      console.log(`📊 Adding market data update for ${symbol}: $${marketPrice}`);
      
      setChartData(prevData => {
        const newData = [...prevData];
        
        newData.push({
          date: new Date(lastUpdated).toISOString(),
          time: lastUpdated,
          price: marketPrice,
          volume: Math.floor(Math.random() * 5000000 + 1000000),
          isRealTime: true,
          isLatest: true,
          timeframe: timeframe
        });
        
        // Keep appropriate number of points based on timeframe
        const maxPoints = timeframe === '1D' ? 50 : 
                         timeframe === '1W' ? 10 :
                         timeframe === '1M' ? 25 : 30;
        
        return newData.slice(-maxPoints);
      });
      
      setLastDataUpdate(lastUpdated);
    }
  }, [marketPrice, lastUpdated, symbol, lastDataUpdate, timeframe]);

  // Enhanced Y-axis domain calculation with proper scaling
  const yAxisDomain = useMemo(() => {
    if (chartData.length === 0) return ['dataMin - 5', 'dataMax + 5'];
    
    const prices = chartData.map(d => d.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const range = maxPrice - minPrice;
    const padding = Math.max(range * 0.1, 0.5); // At least $0.50 padding
    
    return [
      Math.max(0, minPrice - padding),
      maxPrice + padding
    ];
  }, [chartData]);

  // Enhanced X-axis formatting based on timeframe
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
        return date.toLocaleDateString('en-US', { 
          weekday: 'short',
          month: 'short', 
          day: 'numeric' 
        });
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

  // Enhanced connection status logic
  const getConnectionStatus = () => {
    if (isChartLoading) {
      return { status: 'Loading...', color: 'text-blue-500', bgColor: 'bg-blue-500' };
    }
    
    const hasRecentData = lastDataUpdate && (Date.now() - lastDataUpdate) < 300000; // 5 minutes
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
      return { status: 'Loading Data...', color: 'text-blue-500', bgColor: 'bg-blue-500' };
    }
    
    if (marketError) {
      return { status: 'Data Error', color: 'text-red-500', bgColor: 'bg-red-500' };
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
      {/* Enhanced chart status indicators */}
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
        <div className="bg-tradeiq-blue/20 backdrop-blur-sm rounded-lg px-2 py-1 border border-tradeiq-blue/30">
          <span className="text-xs text-tradeiq-blue font-bold">
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
        <AreaChart data={chartData} key={chartKey}>
          <defs>
            <linearGradient id={`colorPrice-${chartKey}`} x1="0" y1="0" x2="0" y2="1">
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
            interval="preserveStartEnd"
          />
          <YAxis 
            stroke="#64748B"
            fontSize={11}
            fontFamily="Inter"
            tickFormatter={(value) => `$${value.toFixed(2)}`}
            domain={yAxisDomain}
            width={60}
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
              const isLatest = props.payload.isLatest;
              
              let label = 'Price';
              if (isLatest) label = '🔴 Live Price';
              else if (isRealTime) label = '🟢 Real-time';
              
              return [`$${value.toFixed(2)}`, label];
            }}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke="#2563EB"
            strokeWidth={2.5}
            fillOpacity={1}
            fill={`url(#colorPrice-${chartKey})`}
            dot={(props: any) => {
              if (props.payload.isRealTime) {
                const color = props.payload.isLatest ? "#10B981" : "#F59E0B";
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

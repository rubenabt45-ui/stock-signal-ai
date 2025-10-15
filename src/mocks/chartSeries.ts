export interface MockChartDataPoint {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

const generateMockChartData = (symbol: string, days: number = 30): MockChartDataPoint[] => {
  const data: MockChartDataPoint[] = [];
  const basePrice = 100 + Math.random() * 100;
  const now = Date.now();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now - i * 24 * 60 * 60 * 1000);
    const volatility = 0.02;
    const trend = Math.sin(i / 10) * 5;
    
    const open = basePrice + trend + (Math.random() - 0.5) * basePrice * volatility;
    const close = open + (Math.random() - 0.5) * basePrice * volatility;
    const high = Math.max(open, close) + Math.random() * basePrice * volatility * 0.5;
    const low = Math.min(open, close) - Math.random() * basePrice * volatility * 0.5;
    
    data.push({
      time: date.toISOString().split('T')[0],
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume: Math.floor(Math.random() * 10000000),
    });
  }
  
  return data;
};

export const mockChartData: Record<string, MockChartDataPoint[]> = {
  'AAPL': generateMockChartData('AAPL'),
  'GOOGL': generateMockChartData('GOOGL'),
  'MSFT': generateMockChartData('MSFT'),
  'TSLA': generateMockChartData('TSLA'),
  'AMZN': generateMockChartData('AMZN'),
};

export const getMockChartData = (symbol: string): MockChartDataPoint[] => {
  return mockChartData[symbol] || generateMockChartData(symbol);
};

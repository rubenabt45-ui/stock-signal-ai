export interface MockSignal {
  id: string;
  symbol: string;
  type: 'buy' | 'sell' | 'hold';
  strength: number; // 0-100
  reason: string;
  timestamp: string;
}

export const mockSignals: MockSignal[] = [
  {
    id: '1',
    symbol: 'AAPL',
    type: 'buy',
    strength: 85,
    reason: 'Strong upward momentum with bullish indicators',
    timestamp: new Date().toISOString(),
  },
  {
    id: '2',
    symbol: 'TSLA',
    type: 'sell',
    strength: 72,
    reason: 'Overbought conditions detected, RSI above 70',
    timestamp: new Date().toISOString(),
  },
  {
    id: '3',
    symbol: 'MSFT',
    type: 'hold',
    strength: 65,
    reason: 'Consolidation phase, await breakout',
    timestamp: new Date().toISOString(),
  },
];

export const getMockSignalsForSymbol = (symbol: string): MockSignal[] => {
  return mockSignals.filter(s => s.symbol === symbol);
};

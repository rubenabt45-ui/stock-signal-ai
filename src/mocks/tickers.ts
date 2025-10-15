export interface MockTicker {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap?: number;
}

export const mockTickers: MockTicker[] = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 178.25,
    change: 2.35,
    changePercent: 1.34,
    volume: 52840000,
    marketCap: 2800000000000,
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    price: 142.18,
    change: -0.82,
    changePercent: -0.57,
    volume: 25360000,
    marketCap: 1780000000000,
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    price: 415.63,
    change: 5.21,
    changePercent: 1.27,
    volume: 22450000,
    marketCap: 3090000000000,
  },
  {
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    price: 248.92,
    change: -3.45,
    changePercent: -1.37,
    volume: 95420000,
    marketCap: 790000000000,
  },
  {
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    price: 178.35,
    change: 1.89,
    changePercent: 1.07,
    volume: 42180000,
    marketCap: 1850000000000,
  },
];

export const getMockTickerBySymbol = (symbol: string): MockTicker | undefined => {
  return mockTickers.find(t => t.symbol === symbol);
};

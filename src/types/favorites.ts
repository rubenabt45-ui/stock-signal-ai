
export type CategoryFilter = 'all' | 'stocks' | 'crypto' | 'forex' | 'indices' | 'commodities' | 'etf';

export interface FavoriteInput {
  symbol: string;
  name: string;
  category: CategoryFilter;
}

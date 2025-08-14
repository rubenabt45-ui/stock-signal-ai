
export type CategoryFilter = 'all' | 'stocks' | 'crypto' | 'forex' | 'indices' | 'commodities' | 'etf';

export interface FavoriteInput {
  symbol: string;
  name: string;
  category: CategoryFilter;
}

export interface FavoriteItem extends FavoriteInput {
  id?: string;
  user_id?: string;
  created_at?: string;
  display_order?: number;
}

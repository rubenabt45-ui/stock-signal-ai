
import { useSupabaseFavorites } from './useSupabaseFavorites';

// Re-export the Supabase-based favorites hook
export const useFavorites = useSupabaseFavorites;

// Export types for backward compatibility
export type { CategoryFilter } from '@/pages/Favorites';

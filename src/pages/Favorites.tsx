
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Star, 
  Search, 
  TrendingUp, 
  Plus,
  Trash2,
  GripVertical,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '@/contexts/auth/auth.provider';
import { useFavorites } from '@/hooks/useFavorites';
import { PageWrapper } from '@/components/PageWrapper';
import { AddSymbolModal } from '@/components/AddSymbolModal';
import { LivePriceBadge } from '@/components/LivePriceBadge';
import { useTranslationWithFallback } from '@/hooks/useTranslationWithFallback';
import { CategoryFilter, FavoriteInput } from '@/types/favorites';

export type { CategoryFilter };

const Favorites = () => {
  const { user } = useAuth();
  const { favorites, loading, addFavorite, removeFavorite, reorderFavorites, refreshFavorites } = useFavorites();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { t } = useTranslationWithFallback();

  useEffect(() => {
    if (!loading && favorites) {
      console.log('Favorites loaded:', favorites);
    }
  }, [favorites, loading]);

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleAddSymbol = async (symbol: string) => {
    if (user) {
      const favoriteInput: FavoriteInput = {
        symbol,
        name: symbol,
        category: 'stocks'
      };
      await addFavorite(favoriteInput);
      handleCloseAddModal();
    } else {
      console.warn('User not logged in, cannot add favorite.');
    }
  };

  const handleRemoveSymbol = async (symbol: string) => {
    if (user) {
      await removeFavorite(symbol);
    } else {
      console.warn('User not logged in, cannot remove favorite.');
    }
  };

  const handleReorder = async (newOrder: string[]) => {
    if (user) {
      await reorderFavorites(newOrder);
    } else {
      console.warn('User not logged in, cannot reorder favorites.');
    }
  };

  const handleRefresh = async () => {
    if (user) {
      await refreshFavorites();
    } else {
      console.warn('User not logged in, cannot refresh favorites.');
    }
  };

  const filteredFavorites = favorites?.filter(fav =>
    fav.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageWrapper pageName="Favorites">
      <div className="min-h-screen bg-tradeiq-navy p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header Section */}
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white">{t('favorites.title')}</h1>
            <div className="flex space-x-4">
              <Button
                variant="outline"
                onClick={handleRefresh}
                className="border-gray-700/50 text-gray-300 hover:bg-black/30 hover:border-tradeiq-blue/50 rounded-xl"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                {t('favorites.refresh')}
              </Button>
              <Button onClick={handleOpenAddModal} className="tradeiq-button-primary">
                <Plus className="h-4 w-4 mr-2" />
                {t('favorites.addSymbol')}
              </Button>
            </div>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Input
              type="text"
              placeholder={t('favorites.searchPlaceholder')}
              className="bg-tradeiq-card border-gray-700 text-white rounded-xl pl-12"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-4 top-3 h-5 w-5 text-gray-400" />
          </div>

          {/* Favorites List */}
          {loading ? (
            <div className="flex items-center justify-center min-h-[200px]">
              <div className="text-center text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tradeiq-blue mx-auto mb-3"></div>
                <p>{t('favorites.loading')}</p>
              </div>
            </div>
          ) : filteredFavorites && filteredFavorites.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFavorites.map((favorite) => (
                <Card key={favorite.id} className="tradeiq-card rounded-2xl">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span>{favorite.symbol}</span>
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveSymbol(favorite.symbol)}
                        className="hover:bg-red-500/20 text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <CardDescription className="text-gray-400">
                        <LivePriceBadge symbol={favorite.symbol} />
                      </CardDescription>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center min-h-[200px]">
              <p className="text-gray-500">{t('favorites.noFavorites')}</p>
            </div>
          )}
        </div>

        {/* Add Symbol Modal */}
        <AddSymbolModal
          isOpen={isAddModalOpen}
          onClose={handleCloseAddModal}
          onAddSymbol={handleAddSymbol}
          existingSymbols={favorites?.map(f => f.symbol) || []}
        />
      </div>
    </PageWrapper>
  );
};

export default Favorites;

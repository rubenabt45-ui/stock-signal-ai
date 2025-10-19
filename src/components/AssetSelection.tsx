
import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, DollarSign, Activity, BarChart3, Zap, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { CategoryFilter } from '@/types/favorites';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface AssetSelectionProps {
  onAssetSelect: (symbol: string) => void;
  selectedAsset?: string;
}

const categories = [
  { key: 'stocks' as const, label: 'Stocks', icon: TrendingUp, color: 'text-green-500' },
  { key: 'crypto' as const, label: 'Crypto', icon: DollarSign, color: 'text-orange-500' },
  { key: 'forex' as const, label: 'Forex', icon: Globe, color: 'text-blue-500' },
  { key: 'indices' as const, label: 'Indices', icon: BarChart3, color: 'text-purple-500' },
  { key: 'commodities' as const, label: 'Commodities', icon: Zap, color: 'text-yellow-500' },
  { key: 'etf' as const, label: 'ETFs', icon: Activity, color: 'text-cyan-500' },
];

const popularAssets = {
  stocks: ['AAPL', 'MSFT', 'GOOGL', 'TSLA', 'AMZN', 'NVDA', 'META', 'NFLX'],
  crypto: ['BTCUSD', 'ETHUSD', 'ADAUSD', 'SOLUSD', 'DOTUSD', 'LINKUSD', 'AVAXUSD', 'MATICUSD'],
  forex: ['EURUSD', 'GBPUSD', 'USDJPY', 'USDCHF', 'AUDUSD', 'USDCAD', 'NZDUSD', 'EURGBP'],
  indices: ['SPX', 'NDX', 'DJI', 'RUT', 'VIX', 'FTSE', 'DAX', 'NIKKEI'],
  commodities: ['XAUUSD', 'XAGUSD', 'USOIL', 'UKOIL', 'NATGAS', 'COPPER', 'PLATINUM', 'CORN'],
  etf: ['SPY', 'QQQ', 'IWM', 'VTI', 'ARKK', 'GLD', 'SLV', 'TLT'],
};

export const AssetSelection: React.FC<AssetSelectionProps> = ({ onAssetSelect, selectedAsset }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('stocks');
  const [filteredAssets, setFilteredAssets] = useState<string[]>([]);

  useEffect(() => {
    const assets = popularAssets[selectedCategory] || [];
    if (searchTerm) {
      setFilteredAssets(
        assets.filter(asset => 
          asset.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredAssets(assets);
    }
  }, [searchTerm, selectedCategory]);

  const handleSymbolClick = (symbol: string) => {
    onAssetSelect(symbol);
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search symbols..."
          className="pl-10 bg-gray-800 border-gray-600 text-white"
        />
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Button
              key={category.key}
              variant={selectedCategory === category.key ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.key)}
              className={`${
                selectedCategory === category.key 
                  ? 'tradeiq-button-primary' 
                  : 'border-gray-600 hover:bg-gray-800 text-gray-300'
              }`}
            >
              <Icon className={`h-4 w-4 mr-2 ${category.color}`} />
              {category.label}
            </Button>
          );
        })}
      </div>

      {/* Assets Carousel */}
      <div className="relative px-12">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {filteredAssets.map((symbol) => (
              <CarouselItem key={symbol} className="pl-2 md:pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4">
                <Card
                  className={`cursor-pointer transition-all hover:scale-105 ${
                    selectedAsset === symbol 
                      ? 'ring-2 ring-tradeiq-blue bg-tradeiq-blue/10' 
                      : 'tradeiq-card hover:bg-gray-800/80'
                  }`}
                  onClick={() => handleSymbolClick(symbol)}
                >
                  <CardContent className="p-3 text-center">
                    <div className="font-semibold text-white text-sm mb-1">
                      {symbol}
                    </div>
                    <Badge 
                      variant="secondary" 
                      className="text-xs bg-gray-700 text-gray-300"
                    >
                      {selectedCategory}
                    </Badge>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute -left-4 bg-gray-800 border-gray-600 hover:bg-gray-700" />
          <CarouselNext className="absolute -right-4 bg-gray-800 border-gray-600 hover:bg-gray-700" />
        </Carousel>
      </div>

      {filteredAssets.length === 0 && searchTerm && (
        <div className="text-center py-8 text-gray-500">
          <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>No symbols found matching "{searchTerm}"</p>
          <p className="text-sm mt-1">Try searching for a different symbol</p>
        </div>
      )}
    </div>
  );
};

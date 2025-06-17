
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { X } from "lucide-react";

export interface FilterState {
  categories: string[];
  sentiments: string[];
  newsTypes: string[];
}

interface NewsFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  newsCount: number;
}

const CATEGORY_OPTIONS = [
  { value: "stocks", label: "Stocks" },
  { value: "crypto", label: "Crypto" },
  { value: "forex", label: "Forex" },
  { value: "indices", label: "Indices" },
  { value: "etfs", label: "ETFs" },
  { value: "commodities", label: "Commodities" }
];

const SENTIMENT_OPTIONS = [
  { value: "Bullish", label: "Bullish", color: "text-green-400 bg-green-500/20 border-green-500/30" },
  { value: "Bearish", label: "Bearish", color: "text-red-400 bg-red-500/20 border-red-500/30" },
  { value: "Neutral", label: "Neutral", color: "text-gray-400 bg-gray-500/20 border-gray-500/30" }
];

const NEWS_TYPE_OPTIONS = [
  { value: "earnings", label: "Earnings" },
  { value: "analyst", label: "Analyst" },
  { value: "corporate", label: "Corporate" },
  { value: "market", label: "Market" },
  { value: "technical", label: "Technical" },
  { value: "macro", label: "Macro" }
];

export const NewsFilters = ({ filters, onFilterChange, newsCount }: NewsFiltersProps) => {
  const handleCategoryChange = (values: string[]) => {
    console.log('📰 Category filters changed:', values);
    onFilterChange({
      ...filters,
      categories: values
    });
  };

  const handleSentimentChange = (values: string[]) => {
    console.log('📊 Sentiment filters changed:', values);
    onFilterChange({
      ...filters,
      sentiments: values
    });
  };

  const handleNewsTypeChange = (values: string[]) => {
    console.log('📑 News type filters changed:', values);
    onFilterChange({
      ...filters,
      newsTypes: values
    });
  };

  const clearAllFilters = () => {
    console.log('🗑️ Clearing all news filters');
    onFilterChange({
      categories: [],
      sentiments: [],
      newsTypes: []
    });
  };

  const hasActiveFilters = filters.categories.length > 0 || filters.sentiments.length > 0 || filters.newsTypes.length > 0;

  return (
    <div data-testid="news-filters" className="space-y-6 bg-black/20 p-6 rounded-xl border border-gray-800/50">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h3 className="text-lg font-semibold text-white">Filter News</h3>
          <Badge variant="outline" className="text-xs text-gray-400 border-gray-600/50">
            {newsCount} articles
          </Badge>
        </div>
        {hasActiveFilters && (
          <Button
            onClick={clearAllFilters}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white hover:bg-gray-700/50 cursor-pointer"
          >
            <X className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      {/* Asset Categories */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-300">Asset Categories</h4>
        <ToggleGroup
          type="multiple"
          value={filters.categories}
          onValueChange={handleCategoryChange}
          className="flex flex-wrap gap-2 justify-start"
        >
          {CATEGORY_OPTIONS.map((option) => (
            <ToggleGroupItem
              key={option.value}
              value={option.value}
              variant="outline"
              size="sm"
              className="data-[state=on]:bg-tradeiq-blue/20 data-[state=on]:text-tradeiq-blue data-[state=on]:border-tradeiq-blue/50 border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white cursor-pointer transition-all"
            >
              {option.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      {/* Sentiment Filters */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-300">Market Sentiment</h4>
        <ToggleGroup
          type="multiple"
          value={filters.sentiments}
          onValueChange={handleSentimentChange}
          className="flex flex-wrap gap-2 justify-start"
        >
          {SENTIMENT_OPTIONS.map((option) => (
            <ToggleGroupItem
              key={option.value}
              value={option.value}
              variant="outline"
              size="sm"
              className={`border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white cursor-pointer transition-all ${
                filters.sentiments.includes(option.value) ? option.color : ''
              }`}
            >
              {option.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      {/* News Types */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-300">News Types</h4>
        <ToggleGroup
          type="multiple"
          value={filters.newsTypes}
          onValueChange={handleNewsTypeChange}
          className="flex flex-wrap gap-2 justify-start"
        >
          {NEWS_TYPE_OPTIONS.map((option) => (
            <ToggleGroupItem
              key={option.value}
              value={option.value}
              variant="outline"
              size="sm"
              className="data-[state=on]:bg-tradeiq-blue/20 data-[state=on]:text-tradeiq-blue data-[state=on]:border-tradeiq-blue/50 border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white cursor-pointer transition-all"
            >
              {option.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
    </div>
  );
};

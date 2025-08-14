
import { Filter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { CategoryFilter } from "@/types/favorites";
import { useState } from "react";

interface FilterDropdownProps {
  selectedCategory: CategoryFilter;
  onCategoryChange: (category: CategoryFilter) => void;
}

const categories = [
  { key: 'all' as const, label: 'All Assets', emoji: '📊' },
  { key: 'stocks' as const, label: 'Stocks', emoji: '📈' },
  { key: 'crypto' as const, label: 'Crypto', emoji: '💰' },
  { key: 'forex' as const, label: 'Forex', emoji: '🌐' },
  { key: 'indices' as const, label: 'Indices', emoji: '📊' },
  { key: 'commodities' as const, label: 'Commodities', emoji: '⚙️' },
  { key: 'etf' as const, label: 'ETFs', emoji: '📊' },
];

export const FilterDropdown = ({ selectedCategory, onCategoryChange }: FilterDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedCategoryData = categories.find(cat => cat.key === selectedCategory);

  const handleCategorySelect = (category: CategoryFilter) => {
    onCategoryChange(category);
    // Don't close the dropdown immediately - let user continue selecting
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="border-gray-700 hover:bg-gray-800 text-gray-300"
        >
          <Filter className="h-4 w-4 mr-2" />
          {selectedCategoryData?.emoji} {selectedCategoryData?.label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="tradeiq-card border-gray-700 bg-tradeiq-navy z-50"
        align="end"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        {categories.map((category) => (
          <DropdownMenuItem
            key={category.key}
            onClick={(e) => {
              e.preventDefault();
              handleCategorySelect(category.key);
            }}
            className={`cursor-pointer hover:bg-gray-800 text-gray-300 ${
              selectedCategory === category.key ? 'bg-tradeiq-blue/20 text-tradeiq-blue' : ''
            }`}
          >
            <span className="mr-2">{category.emoji}</span>
            {category.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

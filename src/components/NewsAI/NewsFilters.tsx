
interface NewsFiltersProps {
  // Placeholder props for future filter functionality
  onFilterChange?: (filters: any) => void;
}

export const NewsFilters = ({ onFilterChange }: NewsFiltersProps) => {
  return (
    <div data-testid="news-filters" className="space-y-4">
      {/* Placeholder for future filter UI */}
      <div className="text-gray-400 text-sm">
        News filters will be implemented here
      </div>
    </div>
  );
};

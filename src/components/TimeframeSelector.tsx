
import { Card } from "@/components/ui/card";
import { Clock } from "lucide-react";

interface TimeframeSelectorProps {
  selectedTimeframe: string;
  onTimeframeSelect: (timeframe: any) => void;
}

const timeframes = [
  { value: "1D", label: "1D" },
  { value: "1W", label: "1W" },
  { value: "1M", label: "1M" },
  { value: "3M", label: "3M" },
  { value: "6M", label: "6M" },
  { value: "1Y", label: "1Y" },
];

export const TimeframeSelector = ({ selectedTimeframe, onTimeframeSelect }: TimeframeSelectorProps) => {
  return (
    <Card className="tradeiq-card p-4 rounded-2xl">
      <div className="flex items-center space-x-3 mb-4">
        <Clock className="h-5 w-5 text-tradeiq-blue" />
        <span className="text-white font-semibold">Timeframe</span>
      </div>
      
      <div className="flex space-x-2 overflow-x-auto">
        {timeframes.map((timeframe) => (
          <button
            key={timeframe.value}
            onClick={() => onTimeframeSelect(timeframe.value)}
            className={`px-4 py-2 rounded-xl font-semibold min-w-[60px] transition-all duration-200 ${
              selectedTimeframe === timeframe.value
                ? 'bg-tradeiq-blue text-white shadow-lg'
                : 'bg-black/30 text-gray-400 hover:bg-black/50 hover:text-white'
            }`}
          >
            {timeframe.label}
          </button>
        ))}
      </div>
    </Card>
  );
};

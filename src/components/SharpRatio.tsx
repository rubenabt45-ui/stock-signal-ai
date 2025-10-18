import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";

interface SharpRatioProps {
  asset: string;
}

export const SharpRatio = ({ asset }: SharpRatioProps) => {
  const [ratio, setRatio] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const calculateSharpRatio = () => {
      setLoading(true);
      
      // Simulate calculation with realistic values
      // Sharpe Ratio typically ranges from -3 to 3, with >1 being good, >2 being very good
      const mockRatio = (Math.random() * 4) - 1; // Range from -1 to 3
      
      setTimeout(() => {
        setRatio(mockRatio);
        setLoading(false);
      }, 800);
    };

    calculateSharpRatio();
  }, [asset]);

  const getRatioQuality = (value: number) => {
    if (value > 2) return { label: "Excelente", color: "text-green-400", bg: "bg-green-500/10" };
    if (value > 1) return { label: "Bueno", color: "text-blue-400", bg: "bg-blue-500/10" };
    if (value > 0) return { label: "Aceptable", color: "text-yellow-400", bg: "bg-yellow-500/10" };
    return { label: "Bajo", color: "text-red-400", bg: "bg-red-500/10" };
  };

  const quality = ratio !== null ? getRatioQuality(ratio) : null;

  return (
    <Card className="h-full flex flex-col bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-all">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-tradeiq-blue" />
          Sharpe Ratio
        </CardTitle>
        <p className="text-sm text-gray-400 mt-1">
          Retorno ajustado por riesgo
        </p>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between">
        {loading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-20 bg-gray-800/50 rounded-lg"></div>
            <div className="h-16 bg-gray-800/50 rounded-lg"></div>
            <div className="h-12 bg-gray-800/50 rounded-lg"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Ratio Display */}
            <div className={`${quality?.bg} rounded-xl p-6 text-center border border-gray-800`}>
              <div className="text-4xl font-bold text-white mb-2">
                {ratio?.toFixed(2)}
              </div>
              <div className={`text-sm font-medium ${quality?.color}`}>
                {quality?.label}
              </div>
            </div>

            {/* Interpretation */}
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-gray-800/30 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-tradeiq-blue flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-300">
                    {ratio && ratio > 1 
                      ? "El activo muestra un retorno favorable ajustado por riesgo."
                      : ratio && ratio > 0
                      ? "El activo tiene retorno positivo pero con volatilidad considerable."
                      : "El activo muestra bajo retorno en relación al riesgo asumido."}
                  </p>
                </div>
              </div>

              {/* Reference Scale */}
              <div className="p-4 bg-gray-800/20 rounded-lg border border-gray-800">
                <p className="text-xs text-gray-400 mb-3 font-medium">Escala de Referencia:</p>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400">&gt; 2.0</span>
                    <span className="text-green-400">Excelente</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">1.0 - 2.0</span>
                    <span className="text-blue-400">Bueno</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">0 - 1.0</span>
                    <span className="text-yellow-400">Aceptable</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">&lt; 0</span>
                    <span className="text-red-400">Bajo</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart3, TrendingUp, Package, DollarSign } from "lucide-react";
import { ABCClassification } from "@/types/inventory";

interface ABCAnalysisProps {
  classifications: ABCClassification[];
}

export function ABCAnalysis({ classifications }: ABCAnalysisProps) {
  // Garantir que classifications é sempre um array
  const safeClassifications = classifications || [];
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(value);
  };

  const getTotalProducts = (category: ABCClassification) => {
    return category.produtos_a + category.produtos_b + category.produtos_c;
  };

  const getTotalRevenue = (category: ABCClassification) => {
    return category.faturamento_a + category.faturamento_b + category.faturamento_c;
  };

  const getPercentage = (value: number, total: number) => {
    return ((value / total) * 100).toFixed(1);
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <BarChart3 className="h-5 w-5 text-primary" />
          Análise ABC por Categoria
        </CardTitle>
        <CardDescription>
          Classificação de produtos por faturamento e performance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="max-h-96 overflow-y-auto">
          <div className="space-y-6">
          {safeClassifications.map((category) => {
            const totalProducts = getTotalProducts(category);
            const totalRevenue = getTotalRevenue(category);
            
            return (
              <div key={category.categoria} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Package className="h-4 w-4 text-primary" />
                    {category.categoria}
                  </h3>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Faturamento Total</p>
                    <p className="font-bold text-primary">{formatCurrency(totalRevenue)}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  {/* Classe A */}
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Badge variant="critical" className="gap-1 w-fit">
                        <TrendingUp className="h-3 w-3" />
                        Classe A
                      </Badge>
                      <div className="text-sm font-medium text-foreground">
                        {category.produtos_a} produtos
                      </div>
                    </div>
                    <Progress 
                      value={(category.produtos_a / totalProducts) * 100} 
                      className="h-2"
                    />
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <DollarSign className="h-3 w-3" />
                        {formatCurrency(category.faturamento_a)}
                      </div>
                      <span className="font-medium text-critical">
                        {getPercentage(category.faturamento_a, totalRevenue)}%
                      </span>
                    </div>
                  </div>

                  {/* Classe B */}
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Badge variant="warning" className="gap-1 w-fit">
                        <TrendingUp className="h-3 w-3" />
                        Classe B
                      </Badge>
                      <div className="text-sm font-medium text-foreground">
                        {category.produtos_b} produtos
                      </div>
                    </div>
                    <Progress 
                      value={(category.produtos_b / totalProducts) * 100} 
                      className="h-2"
                    />
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <DollarSign className="h-3 w-3" />
                        {formatCurrency(category.faturamento_b)}
                      </div>
                      <span className="font-medium text-warning">
                        {getPercentage(category.faturamento_b, totalRevenue)}%
                      </span>
                    </div>
                  </div>

                  {/* Classe C */}
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Badge variant="secondary" className="gap-1 w-fit">
                        <TrendingUp className="h-3 w-3" />
                        Classe C
                      </Badge>
                      <div className="text-sm font-medium text-foreground">
                        {category.produtos_c} produtos
                      </div>
                    </div>
                    <Progress 
                      value={(category.produtos_c / totalProducts) * 100} 
                      className="h-2"
                    />
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <DollarSign className="h-3 w-3" />
                        {formatCurrency(category.faturamento_c)}
                      </div>
                      <span className="font-medium text-muted-foreground">
                        {getPercentage(category.faturamento_c, totalRevenue)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
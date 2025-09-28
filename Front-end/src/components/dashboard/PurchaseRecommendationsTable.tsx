import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ShoppingCart, 
  Brain, 
  TrendingUp,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import { PurchaseRecommendation } from "@/types/inventory";
import { cn } from "@/lib/utils";

interface PurchaseRecommendationsTableProps {
  recommendations: PurchaseRecommendation[];
}

export function PurchaseRecommendationsTable({ recommendations }: PurchaseRecommendationsTableProps) {
  // Garantir que recommendations é sempre um array
  const rawRecommendations = recommendations || [];

  // Estado para ordenação - inicializar com quantidade_sugerida em ordem decrescente
  const [sortField, setSortField] = useState<string>('quantidade_sugerida');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Função de ordenação
  const sortData = (field: string) => {
    const direction = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(direction);
  };

  // Dados ordenados
  const safeRecommendations = [...rawRecommendations].sort((a, b) => {
    // Se não há campo de ordenação, ordenar por quantidade_sugerida decrescente
    const currentSortField = sortField || 'quantidade_sugerida';
    const currentSortDirection = sortField ? sortDirection : 'desc';
    
    let aValue = a[currentSortField as keyof typeof a];
    let bValue = b[currentSortField as keyof typeof b];
    
    // Tratar diferentes tipos de dados
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (aValue < bValue) return currentSortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return currentSortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Componente para ícone de ordenação
  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4 text-muted-foreground" />;
    }
    return sortDirection === 'asc' ? 
      <ArrowUp className="h-4 w-4 text-primary" /> : 
      <ArrowDown className="h-4 w-4 text-primary" />;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'alta':
        return 'destructive';
      case 'média':
        return 'default';
      case 'baixa':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const totalInvestment = safeRecommendations.reduce((sum, rec) => sum + rec.valor_investimento, 0);

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Brain className="h-5 w-5 text-primary" />
              Recomendações de Compra IA
            </CardTitle>
            <CardDescription>
              Sugestões inteligentes baseadas em análise preditiva de demanda
            </CardDescription>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Investimento Total</p>
            <p className="text-lg font-bold text-primary">{formatCurrency(totalInvestment)}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-x-auto">
          <div className="rounded-md border">
            <div className="max-h-80 overflow-y-auto">
              <Table style={{ minWidth: '1100px' }}>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="min-w-[200px]">
                  <Button variant="ghost" onClick={() => sortData('nome')} className="h-auto p-0 font-semibold">
                    Produto <SortIcon field="nome" />
                  </Button>
                </TableHead>
                <TableHead className="text-center min-w-[120px]">
                  <Button variant="ghost" onClick={() => sortData('prioridade')} className="h-auto p-0 font-semibold mx-auto flex">
                    Prioridade <SortIcon field="prioridade" />
                  </Button>
                </TableHead>
                <TableHead className="text-center min-w-[120px]">
                  <Button variant="ghost" onClick={() => sortData('quantidade_sugerida')} className="h-auto p-0 font-semibold mx-auto flex">
                    Quantidade <SortIcon field="quantidade_sugerida" />
                  </Button>
                </TableHead>
                <TableHead className="text-center min-w-[130px]">
                  <Button variant="ghost" onClick={() => sortData('estoque_atual')} className="h-auto p-0 font-semibold mx-auto flex">
                    Estoque Atual <SortIcon field="estoque_atual" />
                  </Button>
                </TableHead>
                <TableHead className="text-center min-w-[130px]">
                  <Button variant="ghost" onClick={() => sortData('valor_investimento')} className="h-auto p-0 font-semibold mx-auto flex">
                    Investimento <SortIcon field="valor_investimento" />
                  </Button>
                </TableHead>
                <TableHead className="min-w-[250px]">Motivo IA</TableHead>
                <TableHead className="text-center min-w-[100px]">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {safeRecommendations.map((rec) => (
                <TableRow key={rec.sku} className="hover:bg-muted/30 transition-colors">
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">{rec.nome}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-sm text-muted-foreground">{rec.sku}</p>
                        <Badge variant="outline" className="text-xs">
                          {rec.categoria}
                        </Badge>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={getPriorityColor(rec.prioridade)}>
                      {rec.prioridade.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center font-semibold">
                    {rec.quantidade_sugerida} un
                  </TableCell>
                  <TableCell className="text-center">
                    <p className="font-medium">{rec.estoque_atual} un</p>
                  </TableCell>
                  <TableCell className="text-center font-semibold text-primary">
                    {formatCurrency(rec.valor_investimento)}
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <div className="flex items-start gap-2">
                      <TrendingUp className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-muted-foreground">{rec.motivo}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button 
                      size="sm" 
                      className="gap-1"
                      variant={rec.prioridade === 'alta' ? 'default' : 'outline'}
                    >
                      <ShoppingCart className="h-3 w-3" />
                      Comprar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
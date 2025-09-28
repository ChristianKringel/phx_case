import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useSKUSalesAnalysis } from "@/hooks/useApi";
import { mockSKUSalesAnalysis } from "@/data/mockData";
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  BarChart3, 
  Eye,
  Loader2,
  AlertCircle,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from "lucide-react";

interface SKUSalesTableProps {
  // Props opcionais para filtros futuros
  categoria?: string;
}

export const SKUSalesTable = ({ categoria }: SKUSalesTableProps) => {
  const [selectedSKU, setSelectedSKU] = useState<string | null>(null);
  const { data: salesData, isLoading, error } = useSKUSalesAnalysis();
  
  // Fallback para dados mock se a API não estiver disponível
  const useMockData = import.meta.env.VITE_ENABLE_MOCK_DATA === 'true';
  const rawData = salesData || mockSKUSalesAnalysis;

  // Estado para ordenação
  const [sortField, setSortField] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Função de ordenação
  const sortData = (field: string) => {
    const direction = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(direction);
  };

  // Dados ordenados
  const data = [...rawData].sort((a, b) => {
    if (!sortField) return 0;
    
    let aValue, bValue;
    
    // Tratar campos aninhados das vendas
    if (sortField.includes('.')) {
      const [period, metric] = sortField.split('.');
      aValue = a[`vendas_${period}` as keyof typeof a][metric as any];
      bValue = b[`vendas_${period}` as keyof typeof b][metric as any];
    } else {
      aValue = a[sortField as keyof typeof a];
      bValue = b[sortField as keyof typeof b];
    }
    
    // Tratar diferentes tipos de dados
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(value);
  };

  const getTendenciaIcon = (tendencia: string) => {
    switch (tendencia) {
      case 'crescente':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'decrescente':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTendenciaBadge = (tendencia: string) => {
    const variants = {
      crescente: 'default' as const,
      estavel: 'secondary' as const,
      decrescente: 'destructive' as const
    };
    
    return (
      <Badge variant={variants[tendencia as keyof typeof variants]}>
        <div className="flex items-center gap-1">
          {getTendenciaIcon(tendencia)}
          {tendencia.charAt(0).toUpperCase() + tendencia.slice(1)}
        </div>
      </Badge>
    );
  };

  const selectedProduct = data.find(item => item.sku === selectedSKU);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <CardTitle>Vendas por SKU - Análise Histórica</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Carregando...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error && !useMockData) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <CardTitle>Vendas por SKU - Análise Histórica</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32 text-destructive">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>Erro ao carregar dados: {error.message}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <CardTitle>Vendas por SKU - Análise Histórica</CardTitle>
        </div>
        <CardDescription>
          Análise comparativa de vendas em períodos de 30, 90 e 365 dias por produto
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-x-auto">
          <div className="rounded-md border">
            <div className="max-h-96 overflow-y-auto">
              <Table style={{ minWidth: '1000px' }}>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[120px]">
                  <Button variant="ghost" onClick={() => sortData('sku')} className="h-auto p-0 font-semibold">
                    SKU <SortIcon field="sku" />
                  </Button>
                </TableHead>
                <TableHead className="min-w-[200px]">
                  <Button variant="ghost" onClick={() => sortData('nome')} className="h-auto p-0 font-semibold">
                    Produto <SortIcon field="nome" />
                  </Button>
                </TableHead>
                <TableHead className="min-w-[120px]">
                  <Button variant="ghost" onClick={() => sortData('categoria')} className="h-auto p-0 font-semibold">
                    Categoria <SortIcon field="categoria" />
                  </Button>
                </TableHead>
                <TableHead className="text-right min-w-[120px]">
                  <Button variant="ghost" onClick={() => sortData('30d.quantidade')} className="h-auto p-0 font-semibold ml-auto flex">
                    30 dias <SortIcon field="30d.quantidade" />
                  </Button>
                </TableHead>
                <TableHead className="text-right min-w-[120px]">
                  <Button variant="ghost" onClick={() => sortData('90d.quantidade')} className="h-auto p-0 font-semibold ml-auto flex">
                    90 dias <SortIcon field="90d.quantidade" />
                  </Button>
                </TableHead>
                <TableHead className="text-right min-w-[120px]">
                  <Button variant="ghost" onClick={() => sortData('365d.quantidade')} className="h-auto p-0 font-semibold ml-auto flex">
                    365 dias <SortIcon field="365d.quantidade" />
                  </Button>
                </TableHead>
                <TableHead className="text-center min-w-[120px]">
                  <Button variant="ghost" onClick={() => sortData('tendencia')} className="h-auto p-0 font-semibold mx-auto flex">
                    Tendência <SortIcon field="tendencia" />
                  </Button>
                </TableHead>
                <TableHead className="text-center min-w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.sku}>
                  <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                  <TableCell className="font-medium">{item.nome}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.categoria}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="space-y-1">
                      <div className="font-medium">{item.vendas_30d.quantidade} un</div>
                      <div className="text-sm text-muted-foreground">
                        {formatCurrency(item.vendas_30d.valor_total)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="space-y-1">
                      <div className="font-medium">{item.vendas_90d.quantidade} un</div>
                      <div className="text-sm text-muted-foreground">
                        {formatCurrency(item.vendas_90d.valor_total)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="space-y-1">
                      <div className="font-medium">{item.vendas_365d.quantidade} un</div>
                      <div className="text-sm text-muted-foreground">
                        {formatCurrency(item.vendas_365d.valor_total)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {getTendenciaBadge(item.tendencia)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setSelectedSKU(item.sku)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5" />
                            Detalhes de Vendas - {selectedProduct?.nome}
                          </DialogTitle>
                          <DialogDescription>
                            SKU: {selectedProduct?.sku} | Categoria: {selectedProduct?.categoria}
                          </DialogDescription>
                        </DialogHeader>
                        
                        {selectedProduct && (
                          <div className="space-y-6">
                            {/* Resumo da Tendência */}
                            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                              <div>
                                <h4 className="font-medium">Tendência Geral</h4>
                                <p className="text-sm text-muted-foreground">
                                  Baseada na análise dos últimos períodos
                                </p>
                              </div>
                              {getTendenciaBadge(selectedProduct.tendencia)}
                            </div>

                            {/* Dados Detalhados */}
                            <div className="grid grid-cols-3 gap-4">
                              <div className="text-center p-4 border rounded-lg">
                                <h4 className="font-medium text-lg mb-2">30 dias</h4>
                                <div className="space-y-1">
                                  <p className="text-2xl font-bold text-primary">
                                    {selectedProduct.vendas_30d.quantidade}
                                  </p>
                                  <p className="text-sm text-muted-foreground">unidades</p>
                                  <p className="font-medium">
                                    {formatCurrency(selectedProduct.vendas_30d.valor_total)}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    Média: {selectedProduct.vendas_30d.media_diaria.toFixed(2)} un/dia
                                  </p>
                                </div>
                              </div>

                              <div className="text-center p-4 border rounded-lg">
                                <h4 className="font-medium text-lg mb-2">90 dias</h4>
                                <div className="space-y-1">
                                  <p className="text-2xl font-bold text-primary">
                                    {selectedProduct.vendas_90d.quantidade}
                                  </p>
                                  <p className="text-sm text-muted-foreground">unidades</p>
                                  <p className="font-medium">
                                    {formatCurrency(selectedProduct.vendas_90d.valor_total)}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    Média: {selectedProduct.vendas_90d.media_diaria.toFixed(2)} un/dia
                                  </p>
                                </div>
                              </div>

                              <div className="text-center p-4 border rounded-lg">
                                <h4 className="font-medium text-lg mb-2">365 dias</h4>
                                <div className="space-y-1">
                                  <p className="text-2xl font-bold text-primary">
                                    {selectedProduct.vendas_365d.quantidade}
                                  </p>
                                  <p className="text-sm text-muted-foreground">unidades</p>
                                  <p className="font-medium">
                                    {formatCurrency(selectedProduct.vendas_365d.valor_total)}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    Média: {selectedProduct.vendas_365d.media_diaria.toFixed(2)} un/dia
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
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
};
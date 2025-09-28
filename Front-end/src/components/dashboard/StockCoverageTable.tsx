import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useStockCoverage } from "@/hooks/useApi";
import { mockStockCoverage } from "@/data/mockData";
import { 
  Clock, 
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  XCircle,
  Loader2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from "lucide-react";

export const StockCoverageTable = () => {
  const { data: coverageData, isLoading, error } = useStockCoverage();
  
  // Fallback para dados mock se a API não estiver disponível
  const useMockData = import.meta.env.VITE_ENABLE_MOCK_DATA === 'true';
  const rawData = coverageData || mockStockCoverage;

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
    
    let aValue = a[sortField as keyof typeof a];
    let bValue = b[sortField as keyof typeof b];
    
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

  const getRiscoIcon = (risco: string) => {
    switch (risco) {
      case 'baixo':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'medio':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'alto':
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'critico':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getRiscoBadge = (risco: string) => {
    const variants = {
      baixo: 'default' as const,
      medio: 'secondary' as const,
      alto: 'destructive' as const,
      critico: 'destructive' as const
    };
    
    return (
      <Badge variant={variants[risco as keyof typeof variants]}>
        <div className="flex items-center gap-1">
          {getRiscoIcon(risco)}
          {risco.charAt(0).toUpperCase() + risco.slice(1)}
        </div>
      </Badge>
    );
  };

  const formatCobertura = (dias: number) => {
    if (dias >= 999) return "999+ dias";
    return `${dias} dias`;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            <CardTitle>Cobertura de Estoque por Produto</CardTitle>
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
            <Clock className="h-5 w-5 text-primary" />
            <CardTitle>Cobertura de Estoque por Produto</CardTitle>
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
          <Clock className="h-5 w-5 text-primary" />
          <CardTitle>Cobertura de Estoque por Produto</CardTitle>
        </div>
        <CardDescription>
          Análise de duração do estoque atual baseado no histórico de vendas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-x-auto">
          <div className="rounded-md border">
            <div className="max-h-96 overflow-y-auto">
              <Table style={{ minWidth: '900px' }}>
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
                  <Button variant="ghost" onClick={() => sortData('estoque_atual')} className="h-auto p-0 font-semibold ml-auto flex">
                    Estoque Atual <SortIcon field="estoque_atual" />
                  </Button>
                </TableHead>
                <TableHead className="text-right min-w-[100px]">
                  <Button variant="ghost" onClick={() => sortData('vendas_30d')} className="h-auto p-0 font-semibold ml-auto flex">
                    Vendas 30d <SortIcon field="vendas_30d" />
                  </Button>
                </TableHead>
                <TableHead className="text-right min-w-[110px]">
                  <Button variant="ghost" onClick={() => sortData('media_vendas_diaria')} className="h-auto p-0 font-semibold ml-auto flex">
                    Média Diária <SortIcon field="media_vendas_diaria" />
                  </Button>
                </TableHead>
                <TableHead className="text-right min-w-[100px]">
                  <Button variant="ghost" onClick={() => sortData('cobertura_dias')} className="h-auto p-0 font-semibold ml-auto flex">
                    Cobertura <SortIcon field="cobertura_dias" />
                  </Button>
                </TableHead>
                <TableHead className="text-center min-w-[100px]">
                  <Button variant="ghost" onClick={() => sortData('risco_ruptura')} className="h-auto p-0 font-semibold mx-auto flex">
                    Risco <SortIcon field="risco_ruptura" />
                  </Button>
                </TableHead>
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
                  <TableCell className="text-right font-medium">
                    {item.estoque_atual} un
                  </TableCell>
                  <TableCell className="text-right">
                    {item.vendas_30d} un
                  </TableCell>
                  <TableCell className="text-right">
                    {item.media_vendas_diaria.toFixed(2)} un/dia
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    <span className={`${
                      item.cobertura_dias <= 15 ? 'text-red-600 font-bold' :
                      item.cobertura_dias <= 30 ? 'text-orange-600' :
                      item.cobertura_dias <= 60 ? 'text-yellow-600' :
                      'text-green-600'
                    }`}>
                      {formatCobertura(item.cobertura_dias)}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    {getRiscoBadge(item.risco_ruptura)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
              </Table>
            </div>
          </div>
        </div>
        
        {/* Legenda */}
        <div className="mt-4 p-4 bg-muted rounded-lg">
          <h4 className="font-medium mb-2">Legenda de Cobertura:</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-600 rounded"></div>
              <span>≤ 15 dias: Crítico</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-600 rounded"></div>
              <span>16-30 dias: Alto</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-600 rounded"></div>
              <span>31-60 dias: Médio</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-600 rounded"></div>
              <span>61+ dias: Baixo</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
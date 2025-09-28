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
  AlertTriangle, 
  Clock, 
  DollarSign, 
  Tag,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import { OverstockAlert } from "@/types/inventory";

interface OverstockAlertsProps {
  alerts: OverstockAlert[];
}

export function OverstockAlerts({ alerts }: OverstockAlertsProps) {
  // Garantir que alerts é sempre um array
  const rawAlerts = alerts || [];
  
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
  const safeAlerts = [...rawAlerts].sort((a, b) => {
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
  
  // Lógica baseada nos dias sem venda (>=180 crítico, <180 alerta)
  const getTipoByDias = (dias_sem_venda: number) => {
    return dias_sem_venda >= 180 ? 'critico' : 'warning';
  };
  
  const getAlertVariant = (dias_sem_venda: number) => {
    const tipo = getTipoByDias(dias_sem_venda);
    return tipo === 'critico' ? 'destructive' : 'warning';
  };

  const getAlertIcon = (dias_sem_venda: number) => {
    const tipo = getTipoByDias(dias_sem_venda);
    return tipo === 'critico' ? (
      <AlertTriangle className="h-4 w-4" />
    ) : (
      <Clock className="h-4 w-4" />
    );
  };

  const getAlertLabel = (dias_sem_venda: number) => {
    const tipo = getTipoByDias(dias_sem_venda);
    return tipo === 'critico' ? 'CRÍTICO' : 'ALERTA';
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const totalImobilizado = safeAlerts.reduce((sum, alert) => {
    // Converter string para número se necessário
    const valor = typeof alert.valor_imobilizado === 'string' 
      ? parseFloat(alert.valor_imobilizado) 
      : alert.valor_imobilizado;
    return sum + (valor || 0);
  }, 0);
  const alertasCriticos = safeAlerts.filter(alert => alert.dias_sem_venda >= 180).length;

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-xl">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Alertas de Overstock
            </CardTitle>
            <CardDescription>
              Produtos parados com capital imobilizado
            </CardDescription>
          </div>
          <div className="text-right space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="critical">{alertasCriticos} Críticos</Badge>
              <Badge variant="warning">{safeAlerts.length - alertasCriticos} Alertas</Badge>
            </div>
            <p className="text-sm text-muted-foreground">Total Imobilizado</p>
            <p className="text-lg font-bold text-critical">{formatCurrency(totalImobilizado)}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            <div className="rounded-md border">
              <div className="max-h-80 overflow-y-auto">
                <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="min-w-[100px]">
                  <Button variant="ghost" onClick={() => sortData('dias_sem_venda')} className="h-auto p-0 font-semibold">
                    Status <SortIcon field="dias_sem_venda" />
                  </Button>
                </TableHead>
                <TableHead className="min-w-[200px]">
                  <Button variant="ghost" onClick={() => sortData('nome')} className="h-auto p-0 font-semibold">
                    Produto <SortIcon field="nome" />
                  </Button>
                </TableHead>
                <TableHead className="text-center min-w-[120px]">
                  <Button variant="ghost" onClick={() => sortData('dias_sem_venda')} className="h-auto p-0 font-semibold mx-auto flex">
                    Dias Parado <SortIcon field="dias_sem_venda" />
                  </Button>
                </TableHead>
                <TableHead className="text-center min-w-[100px]">
                  <Button variant="ghost" onClick={() => sortData('estoque_atual')} className="h-auto p-0 font-semibold mx-auto flex">
                    Estoque <SortIcon field="estoque_atual" />
                  </Button>
                </TableHead>
                <TableHead className="text-center min-w-[140px]">
                  <Button variant="ghost" onClick={() => sortData('valor_imobilizado')} className="h-auto p-0 font-semibold mx-auto flex">
                    Valor Imobilizado <SortIcon field="valor_imobilizado" />
                  </Button>
                </TableHead>
                <TableHead className="text-center min-w-[160px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {safeAlerts.map((alert) => (
                <TableRow key={alert.sku} className="hover:bg-muted/30 transition-colors">
                  <TableCell>
                    <Badge 
                      variant={getAlertVariant(alert.dias_sem_venda)}
                      className="gap-1"
                    >
                      {getAlertIcon(alert.dias_sem_venda)}
                      {getAlertLabel(alert.dias_sem_venda)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">{alert.nome}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-sm text-muted-foreground">{alert.sku}</p>
                        <Badge variant="outline" className="text-xs">
                          {alert.categoria}
                        </Badge>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold text-foreground">{alert.dias_sem_venda}</span>
                      <span className="text-sm text-muted-foreground">dias</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center font-semibold">
                    {alert.estoque_atual} un
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <DollarSign className="h-4 w-4 text-critical" />
                      <span className="font-semibold text-critical">
                        {formatCurrency(alert.valor_imobilizado)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center gap-1 justify-center">
                      <Button size="sm" variant="outline" className="gap-1 text-xs">
                        <Tag className="h-3 w-3" />
                        Promoção
                      </Button>
                      <Button size="sm" variant="ghost" className="gap-1 text-xs">
                        <AlertTriangle className="h-3 w-3" />
                        Análise
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
              </Table>
            </div>
          </div>
        </div>
        </div>
      </CardContent>
    </Card>
  );
}
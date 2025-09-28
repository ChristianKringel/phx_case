import { KPICard } from "@/components/dashboard/KPICard";
import { PurchaseRecommendationsTable } from "@/components/dashboard/PurchaseRecommendationsTable";
import { OverstockAlerts } from "@/components/dashboard/OverstockAlerts";
import { ABCAnalysis } from "@/components/dashboard/ABCAnalysis";
import { SKUSalesTable } from "@/components/dashboard/SKUSalesTable";
import { StockCoverageTable } from "@/components/dashboard/StockCoverageTable";
import {
  useDashboardKPIs,
  usePurchaseRecommendations,
  useOverstockAlerts,
  useABCClassification
} from "@/hooks/useApi";
import {
  mockDashboardKPIs,
  mockPurchaseRecommendations,
  mockOverstockAlerts,
  mockABCClassification
} from "@/data/mockData";
import {
  Package,
  AlertTriangle,
  DollarSign,
  Calendar,
  ShoppingCart,
  TrendingUp,
  BarChart3,
  Brain,
  Loader2,
  AlertCircle
} from "lucide-react";

const Dashboard = () => {
  // Hooks para buscar dados da API
  const { data: kpis, isLoading: kpisLoading, error: kpisError } = useDashboardKPIs();
  const { data: purchaseRecommendations, isLoading: purchaseLoading, error: purchaseError } = usePurchaseRecommendations();
  const { data: overstockAlerts, isLoading: overstockLoading, error: overstockError } = useOverstockAlerts();
  const { data: abcClassification, isLoading: abcLoading, error: abcError } = useABCClassification();

  // Fallback para dados mock se a API não estiver disponível
  const useMockData = import.meta.env.VITE_ENABLE_MOCK_DATA === 'true';

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(value);
  };

  // Função para renderizar componente com loading/error states
  const renderWithState = (
    isLoading: boolean,
    error: Error | null,
    data: any,
    mockData: any,
    component: (data: any) => React.ReactNode
  ) => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-32">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2">Carregando...</span>
        </div>
      );
    }

    if (error && !useMockData) {
      return (
        <div className="flex items-center justify-center h-32 text-destructive">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>Erro ao carregar dados: {error.message}</span>
        </div>
      );
    }

    return component(data || mockData);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Brain className="h-6 w-6 text-primary" />
                PHX Consulting - Gestão Inteligente de Estoque
              </h1>
              <p className="text-muted-foreground mt-1">
                Sistema de recomendações automáticas com Inteligência Artificial
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Última atualização</p>
              <p className="font-medium text-foreground">
                {new Date().toLocaleString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* KPIs Section */}
        <section>
          {renderWithState(kpisLoading, kpisError, kpis, mockDashboardKPIs, (data) => (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <KPICard
                title="Produtos Ativos"
                value={data.produtos_ativos || mockDashboardKPIs.totalProdutos}
                subtitle="No catálogo"
                icon={<Package className="h-5 w-5" />}
                variant="default"
              />
              <KPICard
                title="Produtos Críticos"
                value={data.produtos_criticos || mockDashboardKPIs.produtosRisco}
                subtitle="Risco de ruptura"
                icon={<AlertTriangle className="h-5 w-5" />}
                variant="warning"
              />
              <KPICard
                title="Valor do Estoque"
                value={formatCurrency(data.valor_estoque || mockDashboardKPIs.valorImobilizado)}
                subtitle="Capital imobilizado"
                icon={<DollarSign className="h-5 w-5" />}
                variant="default"
              />
              <KPICard
                title="Cobertura de Estoque"
                value={`${data.cobertura_estoque_dias || mockDashboardKPIs.coberturaMedia} dias`}
                subtitle="Duração média atual"
                icon={<Calendar className="h-5 w-5" />}
                variant="default"
              />
              <KPICard
                title="Produtos Zerados"
                value={data.produtos_zerados || 0}
                subtitle="Sem estoque"
                icon={<AlertTriangle className="h-5 w-5" />}
                variant="warning"
              />
              <KPICard
                title="Vendas 30 dias"
                value={formatCurrency(data.total_vendas_30d || mockDashboardKPIs.faturamento30d)}
                subtitle="Faturamento mensal"
                icon={<Calendar className="h-5 w-5" />}
                variant="default"
              />
              <KPICard
                title="Média Diária"
                value={formatCurrency(data.media_vendas_diaria || mockDashboardKPIs.faturamento30d / 30)}
                subtitle="Vendas por dia"
                icon={<ShoppingCart className="h-5 w-5" />}
                variant="default"
              />
            </div>
          ))}
        </section>

        {/* Purchase Recommendations */}
        <section>
          {renderWithState(purchaseLoading, purchaseError, purchaseRecommendations, mockPurchaseRecommendations, (data) => (
            <PurchaseRecommendationsTable recommendations={data} />
          ))}
        </section>

        {/* Stock Coverage Analysis */}
        <section>
          <StockCoverageTable />
        </section>

        {/* SKU Sales Analysis */}
        <section>
          <SKUSalesTable />
        </section>

        {/* Overstock Alerts and ABC Analysis Grid */}
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div>
            {renderWithState(overstockLoading, overstockError, overstockAlerts, mockOverstockAlerts, (data) => (
              <OverstockAlerts alerts={data} />
            ))}
          </div>
          <div>
            {renderWithState(abcLoading, abcError, abcClassification, mockABCClassification, (data) => (
              <ABCAnalysis classifications={data} />
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <p>© 2024 PHX Consulting - Sistema de Gestão Inteligente</p>
              <div className="flex items-center gap-1">
                <Brain className="h-4 w-4 text-primary" />
                <span>Powered by AI</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span>Backend: N8N Integration</span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                Sistema Online
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
import { 
  Product, 
  Sale, 
  CurrentStock, 
  StockIndicator,
  PurchaseRecommendation,
  OverstockAlert,
  ABCClassification 
} from '@/types/inventory';

// Dados mockados para simulação do sistema
export const mockProducts: Product[] = [
  {
    sku: 'TEST001',
    nome: 'Produto Popular Baixo Estoque',
    categoria: 'Eletrônicos',
    fabricante: 'Samsung',
    preco_custo: 250.00,
    lead_time_dias: 15,
    status: 'ativo'
  },
  {
    sku: 'TEST002',
    nome: 'Produto Sem Venda 150 dias',
    categoria: 'Casa & Jardim',
    fabricante: 'Philips',
    preco_custo: 89.90,
    lead_time_dias: 10,
    status: 'ativo'
  },
  {
    sku: 'TEST003',
    nome: 'Produto Crítico 200 dias',
    categoria: 'Esportes',
    fabricante: 'Nike',
    preco_custo: 299.90,
    lead_time_dias: 20,
    status: 'ativo'
  },
  // Mais produtos para demonstração
  {
    sku: 'ELE001',
    nome: 'Smartphone Galaxy S24',
    categoria: 'Eletrônicos',
    fabricante: 'Samsung',
    preco_custo: 1200.00,
    lead_time_dias: 12,
    status: 'ativo'
  },
  {
    sku: 'MOD001',
    nome: 'Tênis Air Max',
    categoria: 'Moda',
    fabricante: 'Nike',
    preco_custo: 450.00,
    lead_time_dias: 25,
    status: 'ativo'
  }
];

export const mockStockIndicators: StockIndicator[] = [
  {
    sku: 'TEST001',
    nome: 'Produto Popular Baixo Estoque',
    categoria: 'Eletrônicos',
    vendas_30d: 45,
    vendas_90d: 128,
    vendas_365d: 520,
    cobertura_atual: 8,
    classificacao_abc: 'A',
    dias_sem_venda: 2,
    risco_ruptura: true
  },
  {
    sku: 'TEST002',
    nome: 'Produto Sem Venda 150 dias',
    categoria: 'Casa & Jardim',
    vendas_30d: 0,
    vendas_90d: 0,
    vendas_365d: 12,
    cobertura_atual: 180,
    classificacao_abc: 'C',
    dias_sem_venda: 150,
    risco_ruptura: false
  },
  {
    sku: 'TEST003',
    nome: 'Produto Crítico 200 dias',
    categoria: 'Esportes',
    vendas_30d: 0,
    vendas_90d: 0,
    vendas_365d: 8,
    cobertura_atual: 220,
    classificacao_abc: 'C',
    dias_sem_venda: 200,
    risco_ruptura: false
  },
  {
    sku: 'ELE001',
    nome: 'Smartphone Galaxy S24',
    categoria: 'Eletrônicos',
    vendas_30d: 28,
    vendas_90d: 85,
    vendas_365d: 340,
    cobertura_atual: 22,
    classificacao_abc: 'A',
    dias_sem_venda: 3,
    risco_ruptura: false
  },
  {
    sku: 'MOD001',
    nome: 'Tênis Air Max',
    categoria: 'Moda',
    vendas_30d: 18,
    vendas_90d: 52,
    vendas_365d: 195,
    cobertura_atual: 35,
    classificacao_abc: 'B',
    dias_sem_venda: 5,
    risco_ruptura: false
  }
];

export const mockPurchaseRecommendations: PurchaseRecommendation[] = [
  {
    sku: 'TEST001',
    nome: 'Produto Popular Baixo Estoque',
    categoria: 'Eletrônicos',
    estoque_atual: 15,
    quantidade_sugerida: 120,
    prioridade: 'alta',
    valor_investimento: 30000.00,
    motivo: 'Alto giro, estoque crítico. IA prevê aumento de 15% na demanda.'
  },
  {
    sku: 'ELE001', 
    nome: 'Smartphone Galaxy S24',
    categoria: 'Eletrônicos',
    estoque_atual: 32,
    quantidade_sugerida: 75,
    prioridade: 'media',
    valor_investimento: 90000.00,
    motivo: 'Tendência de crescimento identificada pela IA. Sazonalidade favorável.'
  },
  {
    sku: 'MOD001',
    nome: 'Tênis Air Max',
    categoria: 'Moda',
    estoque_atual: 28,
    quantidade_sugerida: 40,
    prioridade: 'baixa',
    valor_investimento: 18000.00,
    motivo: 'Padrão sazonal detectado. Reposição preventiva recomendada.'
  }
];

export const mockOverstockAlerts: OverstockAlert[] = [
  {
    sku: 'TEST002',
    nome: 'Produto Sem Venda 150 dias',
    categoria: 'Casa & Jardim',
    estoque_atual: 45,
    dias_sem_venda: 150,
    valor_imobilizado: 4045.50,
    tipo: 'warning',
    recomendacao: 'Considere promoção ou liquidação parcial'
  },
  {
    sku: 'TEST003',
    nome: 'Produto Crítico 200 dias',
    categoria: 'Esportes',
    estoque_atual: 22,
    dias_sem_venda: 200,
    valor_imobilizado: 6597.80,
    tipo: 'warning', // Mesmo com tipo warning, vai aparecer como crítico por causa dos dias
    recomendacao: 'Crítico: Liquidação ou queima de estoque urgente'
  },
  {
    sku: 'TEST004',
    nome: 'Produto Parado 180 dias exatos',
    categoria: 'Moda',
    estoque_atual: 15,
    dias_sem_venda: 180,
    valor_imobilizado: 3750.00,
    tipo: 'warning', // Mesmo com tipo warning, vai aparecer como crítico
    recomendacao: 'Limite crítico atingido - ação imediata necessária'
  }
];

export const mockABCClassification: ABCClassification[] = [
  {
    categoria: 'Eletrônicos',
    produtos_a: 12,
    produtos_b: 18,
    produtos_c: 25,
    faturamento_a: 580000,
    faturamento_b: 180000,
    faturamento_c: 45000
  },
  {
    categoria: 'Moda',
    produtos_a: 8,
    produtos_b: 15,
    produtos_c: 22,
    faturamento_a: 350000,
    faturamento_b: 120000,
    faturamento_c: 35000
  },
  {
    categoria: 'Casa & Jardim',
    produtos_a: 3,
    produtos_b: 8,
    produtos_c: 28,
    faturamento_a: 85000,
    faturamento_b: 45000,
    faturamento_c: 25000
  },
  {
    categoria: 'Esportes',
    produtos_a: 5,
    produtos_b: 12,
    produtos_c: 18,
    faturamento_a: 195000,
    faturamento_b: 78000,
    faturamento_c: 28000
  }
];

// KPIs Principais do Dashboard
export const mockDashboardKPIs = {
  totalProdutos: 245,
  produtosRisco: 8,
  valorImobilizado: 125850.50,
  coberturaMedia: 42,
  recomendacoesCompra: 15,
  alertasOverstock: 12,
  faturamento30d: 2850000,
  variacao30d: 12.5
};

// Dados mock para Cobertura de Estoque
export const mockStockCoverage = [
  {
    sku: 'TEST001',
    nome: 'Produto Popular Baixo Estoque',
    categoria: 'Eletrônicos',
    estoque_atual: 25,
    vendas_30d: 45,
    vendas_90d: 120,
    vendas_365d: 480,
    cobertura_dias: 17,
    media_vendas_diaria: 1.5,
    risco_ruptura: 'alto' as const
  },
  {
    sku: 'TEST002',
    nome: 'Produto Sem Venda 150 dias',
    categoria: 'Casa & Jardim',
    estoque_atual: 150,
    vendas_30d: 0,
    vendas_90d: 2,
    vendas_365d: 8,
    cobertura_dias: 999,
    media_vendas_diaria: 0.02,
    risco_ruptura: 'baixo' as const
  },
  {
    sku: 'ELE001',
    nome: 'Smartphone Galaxy S24',
    categoria: 'Eletrônicos',
    estoque_atual: 80,
    vendas_30d: 24,
    vendas_90d: 72,
    vendas_365d: 290,
    cobertura_dias: 100,
    media_vendas_diaria: 0.8,
    risco_ruptura: 'medio' as const
  }
];

// Dados mock para Análise de Vendas por SKU
export const mockSKUSalesAnalysis = [
  {
    sku: 'TEST001',
    nome: 'Produto Popular Baixo Estoque',
    categoria: 'Eletrônicos',
    vendas_30d: {
      quantidade: 45,
      valor_total: 11250.00,
      media_diaria: 1.5
    },
    vendas_90d: {
      quantidade: 120,
      valor_total: 30000.00,
      media_diaria: 1.33
    },
    vendas_365d: {
      quantidade: 480,
      valor_total: 120000.00,
      media_diaria: 1.31
    },
    tendencia: 'crescente' as const
  },
  {
    sku: 'ELE001',
    nome: 'Smartphone Galaxy S24',
    categoria: 'Eletrônicos',
    vendas_30d: {
      quantidade: 24,
      valor_total: 28800.00,
      media_diaria: 0.8
    },
    vendas_90d: {
      quantidade: 72,
      valor_total: 86400.00,
      media_diaria: 0.8
    },
    vendas_365d: {
      quantidade: 290,
      valor_total: 348000.00,
      media_diaria: 0.79
    },
    tendencia: 'estavel' as const
  },
  {
    sku: 'TEST002',
    nome: 'Produto Sem Venda 150 dias',
    categoria: 'Casa & Jardim',
    vendas_30d: {
      quantidade: 0,
      valor_total: 0.00,
      media_diaria: 0
    },
    vendas_90d: {
      quantidade: 2,
      valor_total: 179.80,
      media_diaria: 0.02
    },
    vendas_365d: {
      quantidade: 8,
      valor_total: 719.20,
      media_diaria: 0.02
    },
    tendencia: 'decrescente' as const
  }
];
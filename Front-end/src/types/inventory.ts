// Tipos para o Sistema de Gestão de Estoque PHX Consulting

export interface Product {
  sku: string;
  nome: string;
  categoria: string;
  fabricante: string;
  preco_custo: number;
  lead_time_dias: number;
  status: 'ativo' | 'inativo';
}

export interface Sale {
  data_venda: string;
  sku: string;
  quantidade: number;
  canal: string;
  valor_total: number;
}

export interface CurrentStock {
  sku: string;
  estoque_fisico: number;
  estoque_vindo: number;
}

// Interface para Cobertura de Estoque
export interface StockCoverage {
  sku: string;
  nome: string;
  categoria: string;
  estoque_atual: number;
  vendas_30d: number;
  vendas_90d: number;
  vendas_365d: number;
  cobertura_dias: number;
  media_vendas_diaria: number;
  risco_ruptura: 'baixo' | 'medio' | 'alto' | 'critico';
}

// Interface para Vendas por SKU com múltiplos períodos
export interface SKUSalesAnalysis {
  sku: string;
  nome: string;
  categoria: string;
  vendas_30d: {
    quantidade: number;
    valor_total: number;
    media_diaria: number;
  };
  vendas_90d: {
    quantidade: number;
    valor_total: number;
    media_diaria: number;
  };
  vendas_365d: {
    quantidade: number;
    valor_total: number;
    media_diaria: number;
  };
  tendencia: 'crescente' | 'estavel' | 'decrescente';
}

export interface PastPurchase {
  sku: string;
  data_compra: string;
  quantidade: number;
  fabricante: string;
}

export interface Parameter {
  tipo_parametro: string;
  categoria: string;
  valor: number;
}

// Interfaces para indicadores calculados
export interface StockIndicator {
  sku: string;
  nome: string;
  categoria: string;
  vendas_30d: number;
  vendas_90d: number;
  vendas_365d: number;
  cobertura_atual: number;
  classificacao_abc: 'A' | 'B' | 'C';
  dias_sem_venda: number;
  risco_ruptura: boolean;
}

export interface PurchaseRecommendation {
  sku: string;
  nome: string;
  categoria: string;
  estoque_atual: number;
  quantidade_sugerida: number;
  prioridade: 'alta' | 'media' | 'baixa';
  valor_investimento: number;
  motivo: string;
}

export interface OverstockAlert {
  sku: string;
  nome: string;
  categoria: string;
  estoque_atual: number;
  dias_sem_venda: number;
  valor_imobilizado: number;
  tipo: 'critico' | 'warning';
  recomendacao: string;
}

export interface ABCClassification {
  categoria: string;
  produtos_a: number;
  produtos_b: number;
  produtos_c: number;
  faturamento_a: number;
  faturamento_b: number;
  faturamento_c: number;
}
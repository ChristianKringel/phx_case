import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { apiService, DashboardKPIs } from '@/services/api';
import {
  Product,
  Sale,
  CurrentStock,
  StockIndicator,
  PurchaseRecommendation,
  OverstockAlert,
  ABCClassification,
  StockCoverage,
  SKUSalesAnalysis
} from '@/types/inventory';

// Hook para KPIs do Dashboard
export const useDashboardKPIs = (): UseQueryResult<DashboardKPIs, Error> => {
  return useQuery({
    queryKey: ['dashboardKPIs'],
    queryFn: () => apiService.getDashboardKPIs(),
    staleTime: Infinity, // Dados nunca ficam stale, só atualiza com F5
    refetchOnWindowFocus: false, // Não refaz quando foca na janela
  });
};

// Hook para produtos
export const useProducts = (): UseQueryResult<Product[], Error> => {
  return useQuery({
    queryKey: ['products'],
    queryFn: () => apiService.getProducts(),
    staleTime: Infinity, // Dados nunca ficam stale, só atualiza com F5
    refetchOnWindowFocus: false, // Não refaz quando foca na janela
  });
};

// Hook para indicadores de estoque
export const useStockIndicators = (): UseQueryResult<StockIndicator[], Error> => {
  return useQuery({
    queryKey: ['stockIndicators'],
    queryFn: () => apiService.getStockIndicators(),
    staleTime: Infinity, // Dados nunca ficam stale, só atualiza com F5
    refetchOnWindowFocus: false, // Não refaz quando foca na janela
  });
};

// Hook para recomendações de compra
export const usePurchaseRecommendations = (): UseQueryResult<PurchaseRecommendation[], Error> => {
  return useQuery({
    queryKey: ['purchaseRecommendations'],
    queryFn: () => apiService.getPurchaseRecommendations(),
    staleTime: Infinity, // Dados nunca ficam stale, só atualiza com F5
    refetchOnWindowFocus: false, // Não refaz quando foca na janela
  });
};

// Hook para alertas de excesso de estoque
export const useOverstockAlerts = (): UseQueryResult<OverstockAlert[], Error> => {
  return useQuery({
    queryKey: ['overstockAlerts'],
    queryFn: () => apiService.getOverstockAlerts(),
    staleTime: Infinity, // Dados nunca ficam stale, só atualiza com F5
    refetchOnWindowFocus: false, // Não refaz quando foca na janela
  });
};

// Hook para classificação ABC
export const useABCClassification = (): UseQueryResult<ABCClassification[], Error> => {
  return useQuery({
    queryKey: ['abcClassification'],
    queryFn: () => apiService.getABCClassification(),
    staleTime: Infinity, // Dados nunca ficam stale, só atualiza com F5
    refetchOnWindowFocus: false, // Não refaz quando foca na janela
  });
};

// Hook para vendas
export const useSales = (startDate?: string, endDate?: string): UseQueryResult<Sale[], Error> => {
  return useQuery({
    queryKey: ['sales', startDate, endDate],
    queryFn: () => apiService.getSales(startDate, endDate),
    staleTime: Infinity, // Dados nunca ficam stale, só atualiza com F5
    refetchOnWindowFocus: false, // Não refaz quando foca na janela
    enabled: !!startDate || !!endDate, // Só executa se tiver datas
  });
};

// Hook para estoque atual
export const useCurrentStock = (): UseQueryResult<CurrentStock[], Error> => {
  return useQuery({
    queryKey: ['currentStock'],
    queryFn: () => apiService.getCurrentStock(),
    staleTime: Infinity, // Dados nunca ficam stale, só atualiza com F5
    refetchOnWindowFocus: false, // Não refaz quando foca na janela
  });
};

// Hook para cobertura de estoque
export const useStockCoverage = (): UseQueryResult<StockCoverage[], Error> => {
  return useQuery({
    queryKey: ['stockCoverage'],
    queryFn: () => apiService.getStockCoverage(),
    staleTime: Infinity, // Dados nunca ficam stale, só atualiza com F5
    refetchOnWindowFocus: false, // Não refaz quando foca na janela
  });
};

// Hook para análise de vendas por SKU
export const useSKUSalesAnalysis = (): UseQueryResult<SKUSalesAnalysis[], Error> => {
  return useQuery({
    queryKey: ['skuSalesAnalysis'],
    queryFn: () => apiService.getSKUSalesAnalysis(),
    staleTime: Infinity, // Dados nunca ficam stale, só atualiza com F5
    refetchOnWindowFocus: false, // Não refaz quando foca na janela
  });
};
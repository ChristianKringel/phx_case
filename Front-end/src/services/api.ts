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

// Configuração da API
const API_BASE_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || 'http://localhost:5678';

// Interface para respostas da API
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Interface para KPIs do Dashboard
export interface DashboardKPIs {
  produtos_ativos: number;
  valor_estoque: number;
  produtos_zerados: number;
  produtos_criticos: number;
  total_vendas_30d: number;
  media_vendas_diaria: number;
  cobertura_estoque_dias: number;
}

class ApiService {
  private async fetchFromN8N<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<T> = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'API request failed');
      }

      return result.data;
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      throw error;
    }
  }

  // Endpoints para buscar dados do N8N
  async getDashboardKPIs(): Promise<DashboardKPIs> {
    return this.fetchFromN8N<DashboardKPIs>('/webhook/dashboard-kpis');
  }

  async getProducts(): Promise<Product[]> {
    return this.fetchFromN8N<Product[]>('/webhook/products');
  }

  async getStockIndicators(): Promise<StockIndicator[]> {
    return this.fetchFromN8N<StockIndicator[]>('/webhook/stock-indicators');
  }

  async getPurchaseRecommendations(): Promise<PurchaseRecommendation[]> {
    return this.fetchFromN8N<PurchaseRecommendation[]>('/webhook/purchase-recommendations');
  }

  async getOverstockAlerts(): Promise<OverstockAlert[]> {
    return this.fetchFromN8N<OverstockAlert[]>('/webhook/overstock-alerts');
  }

  async getABCClassification(): Promise<ABCClassification[]> {
    return this.fetchFromN8N<ABCClassification[]>('/webhook/abc-classification');
  }

  async getSales(startDate?: string, endDate?: string): Promise<Sale[]> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.fetchFromN8N<Sale[]>(`/webhook/sales${query}`);
  }

  async getCurrentStock(): Promise<CurrentStock[]> {
    return this.fetchFromN8N<CurrentStock[]>('/webhook/current-stock');
  }

  async getStockCoverage(): Promise<StockCoverage[]> {
    return this.fetchFromN8N<StockCoverage[]>('/webhook/stock-coverage');
  }

  async getSKUSalesAnalysis(): Promise<SKUSalesAnalysis[]> {
    return this.fetchFromN8N<SKUSalesAnalysis[]>('/webhook/sku-sales-analysis');
  }
}

export const apiService = new ApiService();
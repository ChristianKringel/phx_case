# PHX Consulting - Sistema de Gestão Inteligente de Estoque

Sistema de recomendações automáticas de estoque com Inteligência Artificial desenvolvido para otimizar a gestão de inventário através de análises avançadas.

## Front-end

### Tecnologias
- **React 18** com **TypeScript**
- **Vite** - Build tool e dev server
- **TailwindCSS** - Framework CSS utilitário
- **ShadCN/UI** - Biblioteca de componentes React

### Estrutura
- **Dashboard Principal**: Apresenta KPIs, alertas de overstock, recomendações de compra e análise ABC
- **Componentes Dashboard**:
  - `KPICard` - Cartões de indicadores chave
  - `PurchaseRecommendationsTable` - Tabela de recomendações de compra
  - `OverstockAlerts` - Alertas de excesso de estoque
  - `ABCAnalysis` - Análise de classificação ABC
  - `SKUSalesTable` - Tabela de vendas por SKU
  - `StockCoverageTable` - Cobertura de estoque
- **Tipos**: Interfaces TypeScript para produtos, vendas, estoque e análises
- **Serviços**: Integração com API via N8N webhooks
- **Hooks Customizados**: Gerenciamento de chamadas API com React Query

### Scripts Disponíveis
- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run build:dev` - Build para desenvolvimento
- `npm run lint` - Executa linting
- `npm run preview` - Preview do build

## Back-end
### overstock-alerts
Workflow responsável por retornar produtos com overstock. <br>
Realiza uma Query no Postgres direcionada a todos os produtos com Overstock e então retorna um array no data

### sku-sales-analysis
Workflow responsável por retornar a análise de cada produto <br>
Realiza uma Query no Postgres que retorna os produtos agrupados por métricas mensais. <br>
Retorna um objeto com cada métrica mensal separada para amostragem no front-end.

### stock-coverage
Workflow responsável por trazer a cobertura de estoque <br>
Realiza uma Query no Postgres que traz o SKU e algumas métricas extras (risco de ruptura, media de vendas, cobertura, etc). <br>
Esses dados podem ser potencializados se aplicado um AI Agent sobre eles <br>

### dashboard-kpis
Workflow responsável por mandar os dados do Dashboard principal do front-end <br>
Realiza uma Query no Postgres que retorna métricas como quantidade de produtos zerados, número total de produtos, etc


### abc-classification
Workflow responsável pela categorizacão de ABC <br>
Realiza uma Query no Postgres agrupando pelas categorias ABC 

### purchase-recomendations
Workflow responsável por recomendar compras <br>
Realiza uma Query no Postgres com os supostos melhores produtos para o AI Agent <br>
Utiliza um AI Agent responsável por: 
- Prever a demanda diária de cada produto (Com base em sazonalidade, crescimento mensal ou decrescimento)
- Retorna uma justificativa para essa previsão <br>
<br>
#### Modelo utilizado
- Gemini 2.5 Flash <br>
- Baixo custo e bom desempenho para esse tipo de tarefa

## Endpoints

O front-end consome dados através de webhooks do N8N nas seguintes rotas:

### Dashboard e KPIs
- `GET /webhook/dashboard-kpis` - Retorna indicadores chave do dashboard
  - Produtos ativos, valor do estoque, produtos zerados/críticos
  - Vendas dos últimos 30 dias, média diária, cobertura de estoque

### Produtos e Estoque
- `GET /webhook/products` - Lista todos os produtos
- `GET /webhook/stock-coverage` - Análise de cobertura de estoque

### Vendas e Análises
- `GET /webhook/sku-sales-analysis` - Análise de vendas por SKU

### Recomendações e Alertas
- `GET /webhook/purchase-recommendations` - Recomendações automáticas de compra
- `GET /webhook/overstock-alerts` - Alertas de produtos com excesso de estoque
- `GET /webhook/abc-classification` - Classificação ABC dos produtos

### Configuração da API
Base URL configurada via variável de ambiente `VITE_N8N_WEBHOOK_URL` (padrão: `http://localhost:5679`)

---

**Desenvolvido por Christian Kringel** Para **PHX Consulting** - Sistema de recomendações inteligentes para gestão otimizada de estoque

-- Tabela de produtos
CREATE TABLE IF NOT EXISTS produtos (
    sku VARCHAR(50) PRIMARY KEY,
    nome VARCHAR(200) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    fabricante VARCHAR(100),
    preco_custo DECIMAL(10,2),
    lead_time_dias INTEGER,
    status VARCHAR(20) DEFAULT 'ATIVO'
);

-- Tabela de vendas
CREATE TABLE IF NOT EXISTS vendas (
    id SERIAL PRIMARY KEY,
    data_venda DATE NOT NULL,
    sku VARCHAR(50) REFERENCES produtos(sku),
    quantidade INTEGER NOT NULL,
    canal VARCHAR(50),
    valor_total DECIMAL(10,2)
);

-- Tabela de estoque atual
CREATE TABLE IF NOT EXISTS estoque_atual (
    sku VARCHAR(50) PRIMARY KEY REFERENCES produtos(sku),
    estoque_fisico INTEGER DEFAULT 0,
    estoque_em_transito INTEGER DEFAULT 0,
    ultima_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de compras passadas
CREATE TABLE IF NOT EXISTS compras_passadas (
    id SERIAL PRIMARY KEY,
    sku VARCHAR(50) REFERENCES produtos(sku),
    data_compra DATE NOT NULL,
    quantidade INTEGER NOT NULL,
    fabricante VARCHAR(100),
    preco_unitario DECIMAL(10,2)
);

-- Tabela de parâmetros
CREATE TABLE IF NOT EXISTS parametros (
    id SERIAL PRIMARY KEY,
    tipo_parametro VARCHAR(100) NOT NULL,
    categoria VARCHAR(100),
    valor VARCHAR(200) NOT NULL
);

-- Inserir dados de teste (produtos de exemplo)
INSERT INTO produtos (sku, nome, categoria, fabricante, preco_custo, lead_time_dias, status) VALUES
('TEST001', 'Produto Teste Popular', 'Categoria A', 'Fabricante A', 50.00, 15, 'ATIVO'),
('TEST002', 'Produto Sem Venda 150 dias', 'Categoria B', 'Fabricante B', 30.00, 20, 'ATIVO'),
('TEST003', 'Produto Sem Venda 200 dias', 'Categoria C', 'Fabricante C', 25.00, 10, 'ATIVO'),
('SKU001', 'Smartphone XYZ', 'Eletrônicos', 'TechCorp', 800.00, 21, 'ATIVO'),
('SKU002', 'Notebook ABC', 'Eletrônicos', 'TechCorp', 1200.00, 30, 'ATIVO'),
('SKU003', 'Camiseta Básica', 'Vestuário', 'Fashion Ltd', 25.00, 7, 'ATIVO'),
('SKU004', 'Tênis Esportivo', 'Calçados', 'SportBrand', 150.00, 14, 'ATIVO'),
('SKU005', 'Livro Técnico', 'Livros', 'Alpha Editora', 45.00, 5, 'ATIVO');

-- Estoque atual para produtos de teste
INSERT INTO estoque_atual (sku, estoque_fisico, estoque_em_transito) VALUES
('TEST001', 5, 0),      -- Estoque baixo - deve recomendar compra
('TEST002', 50, 0),     -- Estoque alto sem vendas
('TEST003', 100, 0),    -- Excesso de estoque crítico
('SKU001', 25, 10),
('SKU002', 8, 5),
('SKU003', 100, 20),
('SKU004', 15, 0),
('SKU005', 30, 10);

-- Vendas recentes (TEST001 popular, TEST002/003 sem vendas)
INSERT INTO vendas (data_venda, sku, quantidade, canal, valor_total) VALUES
-- Vendas do produto popular (TEST001)
(CURRENT_DATE - INTERVAL '5 days', 'TEST001', 3, 'Online', 180.00),
(CURRENT_DATE - INTERVAL '10 days', 'TEST001', 2, 'Loja Física', 120.00),
(CURRENT_DATE - INTERVAL '15 days', 'TEST001', 5, 'Online', 300.00),
(CURRENT_DATE - INTERVAL '25 days', 'TEST001', 1, 'Online', 60.00),

-- Vendas antigas do TEST002 (150 dias atrás)
(CURRENT_DATE - INTERVAL '150 days', 'TEST002', 1, 'Online', 35.00),
(CURRENT_DATE - INTERVAL '160 days', 'TEST002', 2, 'Loja Física', 70.00),

-- Vendas muito antigas do TEST003 (200+ dias atrás)
(CURRENT_DATE - INTERVAL '200 days', 'TEST003', 1, 'Online', 30.00),
(CURRENT_DATE - INTERVAL '220 days', 'TEST003', 3, 'Loja Física', 90.00),

-- Vendas de outros produtos
(CURRENT_DATE - INTERVAL '2 days', 'SKU001', 2, 'Online', 1800.00),
(CURRENT_DATE - INTERVAL '7 days', 'SKU002', 1, 'Online', 1350.00),
(CURRENT_DATE - INTERVAL '3 days', 'SKU003', 10, 'Online', 300.00),
(CURRENT_DATE - INTERVAL '12 days', 'SKU004', 3, 'Loja Física', 500.00),
(CURRENT_DATE - INTERVAL '8 days', 'SKU005', 2, 'Online', 100.00);

-- Parâmetros do sistema
INSERT INTO parametros (tipo_parametro, categoria, valor) VALUES
('cobertura_curva_a', 'A', '45'),
('cobertura_curva_b', 'B', '60'),
('cobertura_curva_c', 'C', '90'),
('limite_alerta_sobreestoque', 'geral', '90'),
('limite_critico_sobreestoque', 'geral', '180'),
('margem_seguranca', 'geral', '1.2');

-- Criar índices para otimização de performance
CREATE INDEX IF NOT EXISTS idx_vendas_data_sku ON vendas(data_venda, sku);
CREATE INDEX IF NOT EXISTS idx_vendas_sku ON vendas(sku);
CREATE INDEX IF NOT EXISTS idx_produtos_categoria ON produtos(categoria);

-- Adicionar comentários às tabelas
COMMENT ON TABLE produtos IS 'Catálogo de produtos com informações básicas';
COMMENT ON TABLE vendas IS 'Histórico de vendas para análise de demanda';
COMMENT ON TABLE estoque_atual IS 'Posição atual do estoque físico e em trânsito';
COMMENT ON TABLE compras_passadas IS 'Registros históricos de compras de produtos';
COMMENT ON TABLE parametros IS 'Configurações para o sistema de recomendação';

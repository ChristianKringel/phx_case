import pandas as pd
import numpy as np
from faker import Faker
import random
from datetime import datetime, timedelta
import json

# Configurar o Faker para português brasileiro
fake = Faker('pt_BR')
Faker.seed(42)  # Para reproduzibilidade
np.random.seed(42)
random.seed(42)

# Configurações
NUM_PRODUTOS = 250
NUM_VENDAS = 12000
NUM_COMPRAS = 3000

# Definir categorias com lead times específicos
CATEGORIAS = {
    'Eletrônicos': {'lead_time': (14, 30), 'margem': (0.15, 0.40)},
    'Roupas': {'lead_time': (7, 14), 'margem': (0.45, 0.65)},
    'Casa e Jardim': {'lead_time': (10, 21), 'margem': (0.25, 0.50)},
    'Esportes': {'lead_time': (7, 18), 'margem': (0.30, 0.55)},
    'Livros': {'lead_time': (3, 7), 'margem': (0.20, 0.35)},
    'Beleza': {'lead_time': (5, 12), 'margem': (0.50, 0.70)},
    'Automotivo': {'lead_time': (15, 30), 'margem': (0.20, 0.45)},
    'Alimentação': {'lead_time': (1, 3), 'margem': (0.10, 0.25)}
}

# Fabricantes por categoria
FABRICANTES = {
    'Eletrônicos': ['Samsung', 'Apple', 'Sony', 'LG', 'Philips', 'JBL', 'Motorola'],
    'Roupas': ['Nike', 'Adidas', 'Zara', 'H&M', 'Lacoste', 'Calvin Klein', 'Levi\'s'],
    'Casa e Jardim': ['Tramontina', 'Electrolux', 'Vonder', 'Black & Decker', 'Inox'],
    'Esportes': ['Nike', 'Adidas', 'Puma', 'Under Armour', 'Speedo', 'Wilson'],
    'Livros': ['Saraiva', 'Companhia das Letras', 'Globo', 'Record'],
    'Beleza': ['L\'Oréal', 'Natura', 'Boticário', 'Avon', 'Nivea', 'Dove'],
    'Automotivo': ['Shell', 'Mobil', 'Castrol', '3M', 'Bosch', 'NGK'],
    'Alimentação': ['Nestlé', 'Coca-Cola', 'Unilever', 'Sadia', 'Perdigão']
}

def gerar_sku():
    """Gera um SKU único"""
    return fake.lexify(text='???-####').upper()

def escape_sql_string(value):
    """Escapa strings para SQL"""
    if value is None:
        return 'NULL'
    escaped_value = str(value).replace("'", "''")
    return f"'{escaped_value}'"

def gerar_produtos():
    """Gera dataset de produtos conforme tabela do banco"""
    produtos = []
    skus_gerados = set()
    
    for i in range(NUM_PRODUTOS):
        # Gerar SKU único
        sku = gerar_sku()
        while sku in skus_gerados:
            sku = gerar_sku()
        skus_gerados.add(sku)
        
        categoria = random.choice(list(CATEGORIAS.keys()))
        fabricante = random.choice(FABRICANTES[categoria])
        
        # Definir cenários especiais para estoque
        cenario = random.choices(
            ['normal', 'sazonal', 'ruptura', 'overstock'], 
            weights=[70, 15, 10, 5]
        )[0]
        
        # Preço baseado na categoria
        if categoria == 'Eletrônicos':
            preco_custo = round(random.uniform(100, 2000), 2)
        elif categoria == 'Roupas':
            preco_custo = round(random.uniform(25, 150), 2)
        elif categoria == 'Casa e Jardim':
            preco_custo = round(random.uniform(15, 250), 2)
        elif categoria == 'Livros':
            preco_custo = round(random.uniform(10, 50), 2)
        else:
            preco_custo = round(random.uniform(15, 200), 2)
        
        lead_time_range = CATEGORIAS[categoria]['lead_time']
        lead_time = random.randint(lead_time_range[0], lead_time_range[1])
        
        # Ajustes de estoque baseado no cenário
        if cenario == 'ruptura':
            estoque_fisico = random.randint(0, 5)
            estoque_em_transito = random.randint(0, 20)
        elif cenario == 'overstock':
            estoque_fisico = random.randint(500, 2000)
            estoque_em_transito = random.randint(0, 100)
        else:
            estoque_fisico = random.randint(10, 300)
            estoque_em_transito = random.randint(0, 50)
        
        produto = {
            'sku': sku,
            'nome': f'{fabricante} {fake.catch_phrase()}'[:200],  # Limitar a 200 chars
            'categoria': categoria,
            'fabricante': fabricante,
            'preco_custo': preco_custo,
            'lead_time_dias': lead_time,
            'status': random.choices(['ATIVO', 'INATIVO'], weights=[85, 15])[0],
            # Dados para estoque (não vai na tabela produtos)
            'estoque_fisico': estoque_fisico,
            'estoque_em_transito': estoque_em_transito,
            'cenario': cenario
        }
        produtos.append(produto)
    
    return pd.DataFrame(produtos)

def gerar_vendas(df_produtos):
    """Gera dataset de vendas dos últimos 12 meses"""
    vendas = []
    
    # Data base: últimos 12 meses
    data_fim = datetime.now().date()
    data_inicio = data_fim - timedelta(days=365)
    
    produtos_ativos = df_produtos[df_produtos['status'] == 'ATIVO']['sku'].tolist()
    
    canais = ['ONLINE', 'LOJA_FISICA', 'MARKETPLACE', 'TELEFONE', 'WHATSAPP']
    
    for i in range(NUM_VENDAS):
        sku = random.choice(produtos_ativos)
        
        # Buscar dados do produto
        produto = df_produtos[df_produtos['sku'] == sku].iloc[0]
        
        # Quantidade baseada no cenário do produto
        if produto['cenario'] == 'ruptura':
            quantidade = random.choices([1, 2], weights=[80, 20])[0]
        elif produto['cenario'] == 'overstock':
            quantidade = random.choices([1, 2, 3, 4, 5], weights=[40, 30, 20, 7, 3])[0]
        else:
            quantidade = random.choices([1, 2, 3, 4], weights=[60, 25, 10, 5])[0]
        
        # Valor total baseado no preço de custo + margem
        margem_categoria = CATEGORIAS[produto['categoria']]['margem']
        margem = random.uniform(margem_categoria[0], margem_categoria[1])
        preco_venda = produto['preco_custo'] * (1 + margem)
        
        # Aplicar desconto ocasional
        desconto_pct = random.choices([0, 5, 10, 15], weights=[75, 15, 7, 3])[0]
        preco_final = preco_venda * (1 - desconto_pct/100)
        valor_total = round(preco_final * quantidade, 2)
        
        data_venda = fake.date_between(start_date=data_inicio, end_date=data_fim)
        canal = random.choice(canais)
        
        venda = {
            'data_venda': data_venda,
            'sku': sku,
            'quantidade': quantidade,
            'canal': canal,
            'valor_total': valor_total
        }
        vendas.append(venda)
    
    return pd.DataFrame(vendas)

def gerar_compras_passadas(df_produtos):
    """Gera histórico de compras dos últimos 24 meses"""
    compras = []
    
    # Data base: últimos 24 meses
    data_fim = datetime.now().date()
    data_inicio = data_fim - timedelta(days=730)
    
    skus_disponiveis = df_produtos['sku'].tolist()
    
    for i in range(NUM_COMPRAS):
        sku = random.choice(skus_disponiveis)
        produto = df_produtos[df_produtos['sku'] == sku].iloc[0]
        
        # Quantidade de compra baseada no cenário
        if produto['cenario'] == 'overstock':
            quantidade = random.randint(100, 1000)
        elif produto['cenario'] == 'ruptura':
            quantidade = random.randint(10, 100)
        else:
            quantidade = random.randint(50, 500)
        
        # Preço unitário com alguma variação do custo atual
        variacao = random.uniform(0.8, 1.2)  # ±20% de variação
        preco_unitario = round(produto['preco_custo'] * variacao, 2)
        
        data_compra = fake.date_between(start_date=data_inicio, end_date=data_fim)
        
        compra = {
            'sku': sku,
            'data_compra': data_compra,
            'quantidade': quantidade,
            'fabricante': produto['fabricante'],
            'preco_unitario': preco_unitario
        }
        compras.append(compra)
    
    return pd.DataFrame(compras)

def gerar_parametros():
    """Gera parâmetros do sistema"""
    parametros = [
        # Parâmetros de estoque mínimo por categoria
        {'tipo_parametro': 'ESTOQUE_MINIMO', 'categoria': 'Eletrônicos', 'valor': '20'},
        {'tipo_parametro': 'ESTOQUE_MINIMO', 'categoria': 'Roupas', 'valor': '15'},
        {'tipo_parametro': 'ESTOQUE_MINIMO', 'categoria': 'Casa e Jardim', 'valor': '25'},
        {'tipo_parametro': 'ESTOQUE_MINIMO', 'categoria': 'Esportes', 'valor': '18'},
        {'tipo_parametro': 'ESTOQUE_MINIMO', 'categoria': 'Livros', 'valor': '10'},
        {'tipo_parametro': 'ESTOQUE_MINIMO', 'categoria': 'Beleza', 'valor': '12'},
        {'tipo_parametro': 'ESTOQUE_MINIMO', 'categoria': 'Automotivo', 'valor': '30'},
        {'tipo_parametro': 'ESTOQUE_MINIMO', 'categoria': 'Alimentação', 'valor': '50'},
        
        # Parâmetros de ponto de pedido por categoria
        {'tipo_parametro': 'PONTO_PEDIDO', 'categoria': 'Eletrônicos', 'valor': '50'},
        {'tipo_parametro': 'PONTO_PEDIDO', 'categoria': 'Roupas', 'valor': '30'},
        {'tipo_parametro': 'PONTO_PEDIDO', 'categoria': 'Casa e Jardim', 'valor': '60'},
        {'tipo_parametro': 'PONTO_PEDIDO', 'categoria': 'Esportes', 'valor': '40'},
        {'tipo_parametro': 'PONTO_PEDIDO', 'categoria': 'Livros', 'valor': '25'},
        {'tipo_parametro': 'PONTO_PEDIDO', 'categoria': 'Beleza', 'valor': '35'},
        {'tipo_parametro': 'PONTO_PEDIDO', 'categoria': 'Automotivo', 'valor': '80'},
        {'tipo_parametro': 'PONTO_PEDIDO', 'categoria': 'Alimentação', 'valor': '100'},
        
        # Parâmetros globais
        {'tipo_parametro': 'MARGEM_SEGURANCA', 'categoria': None, 'valor': '1.5'},
        {'tipo_parametro': 'DIAS_PREVISAO', 'categoria': None, 'valor': '90'},
        {'tipo_parametro': 'FREQUENCIA_CALCULO', 'categoria': None, 'valor': 'DIARIO'},
    ]
    
    return pd.DataFrame(parametros)

def gerar_sql_inserts(df_produtos, df_vendas, df_compras, df_parametros):
    """Gera comandos SQL INSERT para todas as tabelas"""
    
    sql_commands = []
    
    # INSERTs para tabela produtos
    sql_commands.append("-- ========================================")
    sql_commands.append("-- INSERTS PARA TABELA PRODUTOS")
    sql_commands.append("-- ========================================")
    sql_commands.append("")
    
    for _, produto in df_produtos.iterrows():
        sql = f"""INSERT INTO produtos (sku, nome, categoria, fabricante, preco_custo, lead_time_dias, status) VALUES ({escape_sql_string(produto['sku'])}, {escape_sql_string(produto['nome'])}, {escape_sql_string(produto['categoria'])}, {escape_sql_string(produto['fabricante'])}, {produto['preco_custo']}, {produto['lead_time_dias']}, {escape_sql_string(produto['status'])});"""
        sql_commands.append(sql)
    
    # INSERTs para tabela estoque_atual
    sql_commands.append("")
    sql_commands.append("-- ========================================")
    sql_commands.append("-- INSERTS PARA TABELA ESTOQUE_ATUAL")
    sql_commands.append("-- ========================================")
    sql_commands.append("")
    
    for _, produto in df_produtos.iterrows():
        sql = f"""INSERT INTO estoque_atual (sku, estoque_fisico, estoque_em_transito, ultima_atualizacao) VALUES ({escape_sql_string(produto['sku'])}, {produto['estoque_fisico']}, {produto['estoque_em_transito']}, CURRENT_TIMESTAMP);"""
        sql_commands.append(sql)
    
    # INSERTs para tabela vendas
    sql_commands.append("")
    sql_commands.append("-- ========================================")
    sql_commands.append("-- INSERTS PARA TABELA VENDAS")
    sql_commands.append("-- ========================================")
    sql_commands.append("")
    
    for _, venda in df_vendas.iterrows():
        sql = f"""INSERT INTO vendas (data_venda, sku, quantidade, canal, valor_total) VALUES ('{venda['data_venda']}', {escape_sql_string(venda['sku'])}, {venda['quantidade']}, {escape_sql_string(venda['canal'])}, {venda['valor_total']});"""
        sql_commands.append(sql)
    
    # INSERTs para tabela compras_passadas
    sql_commands.append("")
    sql_commands.append("-- ========================================")
    sql_commands.append("-- INSERTS PARA TABELA COMPRAS_PASSADAS")
    sql_commands.append("-- ========================================")
    sql_commands.append("")
    
    for _, compra in df_compras.iterrows():
        sql = f"""INSERT INTO compras_passadas (sku, data_compra, quantidade, fabricante, preco_unitario) VALUES ({escape_sql_string(compra['sku'])}, '{compra['data_compra']}', {compra['quantidade']}, {escape_sql_string(compra['fabricante'])}, {compra['preco_unitario']});"""
        sql_commands.append(sql)
    
    # INSERTs para tabela parametros
    sql_commands.append("")
    sql_commands.append("-- ========================================")
    sql_commands.append("-- INSERTS PARA TABELA PARAMETROS")
    sql_commands.append("-- ========================================")
    sql_commands.append("")
    
    for _, parametro in df_parametros.iterrows():
        categoria_val = escape_sql_string(parametro['categoria']) if pd.notna(parametro['categoria']) else 'NULL'
        sql = f"""INSERT INTO parametros (tipo_parametro, categoria, valor) VALUES ({escape_sql_string(parametro['tipo_parametro'])}, {categoria_val}, {escape_sql_string(parametro['valor'])});"""
        sql_commands.append(sql)
    
    return sql_commands

def main():
    print("Gerando dados fictícios para sistema de estoque...")
    
    # Gerar datasets
    print("Gerando produtos...")
    df_produtos = gerar_produtos()
    
    print("Gerando vendas...")
    df_vendas = gerar_vendas(df_produtos)
    
    print("Gerando compras passadas...")
    df_compras = gerar_compras_passadas(df_produtos)
    
    print("Gerando parâmetros...")
    df_parametros = gerar_parametros()
    
    # Gerar comandos SQL
    print("Gerando comandos SQL INSERT...")
    sql_commands = gerar_sql_inserts(df_produtos, df_vendas, df_compras, df_parametros)
    
    # Salvar SQL em arquivo TXT
    with open('inserts_dados_ficticios.txt', 'w', encoding='utf-8') as f:
        f.write("-- ========================================\n")
        f.write("-- SCRIPT DE INSERT DE DADOS FICTÍCIOS\n")
        f.write("-- Sistema de Controle de Estoque\n")
        f.write(f"-- Gerado em: {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}\n")
        f.write("-- ========================================\n\n")
        f.write("-- IMPORTANTE: Execute os comandos na ordem apresentada\n")
        f.write("-- para respeitar as foreign keys!\n\n")
        
        for command in sql_commands:
            f.write(command + '\n')
        
        f.write("\n-- ========================================\n")
        f.write("-- FIM DO SCRIPT\n")
        f.write("-- ========================================\n")
    
    # Relatório de resumo
    print("\nRELATÓRIO DE DADOS GERADOS:")
    print(f"{len(df_produtos)} produtos em {df_produtos['categoria'].nunique()} categorias")
    print(f"{len(df_vendas)} vendas nos últimos 12 meses")
    print(f"{len(df_compras)} compras nos últimos 24 meses")
    print(f"{len(df_parametros)} parâmetros de configuração")
    print(f"Cenários especiais:")
    
    cenarios = df_produtos['cenario'].value_counts()
    for cenario, count in cenarios.items():
        print(f"   - Produtos {cenario}: {count}")
    
    print(f"Lead times: {df_produtos['lead_time_dias'].min()}-{df_produtos['lead_time_dias'].max()} dias")
    print(f"Período de vendas: {df_vendas['data_venda'].min()} até {df_vendas['data_venda'].max()}")
    print(f"Período de compras: {df_compras['data_compra'].min()} até {df_compras['data_compra'].max()}")
    
    # Análise por categoria
    print("\nVENDAS POR CATEGORIA:")
    vendas_categoria = df_vendas.merge(df_produtos[['sku', 'categoria']], on='sku')
    resumo_categoria = vendas_categoria.groupby('categoria').agg({
        'valor_total': ['sum', 'count'],
        'quantidade': 'sum'
    }).round(2)
    resumo_categoria.columns = ['Faturamento_Total', 'Num_Vendas', 'Qtd_Vendida']
    print(resumo_categoria)
    
    print(f"\nARQUIVO SQL GERADO: inserts_dados_ficticios.txt")

if __name__ == "__main__":
    main()
# Sistema de Acompanhamento de Vendas - Planejamento Técnico

## Visão Geral do Projeto

Baseado nas telas fornecidas e nos arquivos CSV analisados, o sistema deve permitir:

1. **Importação diária de arquivos CSV** com dados de vendas
2. **Dashboard de acompanhamento por operador** mostrando:
   - Nome do operador
   - Loja
   - Meta mensal
   - Tarifa acumulada
   - Percentual da meta atingido
   - Barra de progresso visual
   - Status (Meta Atingida, Próxima da Meta)

3. **Visão geral por loja** mostrando:
   - Nome da loja
   - Número de vendedores
   - Valor atual vs meta
   - Percentual atingido
   - Valor que falta para atingir a meta
   - Barra de progresso visual

## Análise dos Dados CSV

### Estrutura dos Arquivos
- **Cabeçalho**: Valor Bruto Comissão, Premiação Funcionários, Resultado do Período
- **Dados por linha**: Data, Funcionário, Valor Custo, Valor Comissão Lotérica, Valor Venda
- **Totalizador**: Linha final com totais

### Campos Identificados
- **Data**: Data da venda (formato "DD de Mês")
- **Funcionário**: Nome do vendedor/operador
- **Valor Custo**: Valor base da venda
- **Valor Comissão**: Comissão da lotérica
- **Valor Venda**: Valor total (custo + comissão)

### Lojas Identificadas nos Dados
- Belvedere
- Contagem  
- Independência
- Betim
- Ibirité
- Taquaril

## Arquitetura Técnica

### Backend (Flask)
- **API REST** para operações CRUD
- **Endpoints principais**:
  - `/api/upload-csv` - Upload e processamento de CSV
  - `/api/operadores` - Listagem de operadores com métricas
  - `/api/lojas` - Visão geral por loja
  - `/api/metas` - Configuração de metas
  - `/api/vendas` - Dados de vendas

### Frontend (React)
- **Componentes principais**:
  - Dashboard de operadores
  - Visão geral por loja
  - Upload de CSV
  - Configuração de metas
- **Bibliotecas**:
  - React Router para navegação
  - Axios para API calls
  - Chart.js ou similar para gráficos
  - Material-UI ou Tailwind para UI

### Banco de Dados (Supabase)

#### Tabela: lojas
```sql
CREATE TABLE lojas (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  meta_mensal DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### Tabela: operadores
```sql
CREATE TABLE operadores (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  loja_id INTEGER REFERENCES lojas(id),
  meta_mensal DECIMAL(10,2) DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### Tabela: vendas
```sql
CREATE TABLE vendas (
  id SERIAL PRIMARY KEY,
  data_venda DATE NOT NULL,
  operador_id INTEGER REFERENCES operadores(id),
  loja_id INTEGER REFERENCES lojas(id),
  valor_custo DECIMAL(10,2),
  valor_comissao DECIMAL(10,2),
  valor_venda DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### Tabela: uploads_csv
```sql
CREATE TABLE uploads_csv (
  id SERIAL PRIMARY KEY,
  nome_arquivo VARCHAR(255),
  data_upload TIMESTAMP DEFAULT NOW(),
  total_registros INTEGER,
  status VARCHAR(50) DEFAULT 'processado'
);
```

## Funcionalidades Detalhadas

### 1. Upload e Processamento de CSV
- Interface drag-and-drop para upload
- Validação do formato do arquivo
- Processamento automático dos dados
- Associação automática de operadores às lojas
- Log de importações realizadas

### 2. Dashboard de Operadores
- Tabela responsiva com todos os operadores
- Cálculo automático de percentual da meta
- Barras de progresso visuais
- Status colorido (verde para meta atingida, laranja para próximo)
- Ordenação por diferentes critérios

### 3. Visão Geral por Loja
- Cards ou lista com resumo por loja
- Número de vendedores ativos
- Progresso da meta consolidada
- Valor faltante para atingir meta
- Indicadores visuais de performance

### 4. Configuração de Metas
- Interface para definir metas mensais por operador
- Metas por loja (soma das metas individuais)
- Histórico de alterações de metas

### 5. Relatórios e Filtros
- Filtro por período
- Filtro por loja
- Exportação de relatórios
- Gráficos de evolução temporal

## Considerações de Implementação

### Segurança
- Autenticação básica para acesso ao sistema
- Validação de dados de entrada
- Sanitização de uploads CSV

### Performance
- Indexação adequada no banco de dados
- Cache de consultas frequentes
- Paginação para grandes volumes de dados

### Usabilidade
- Interface responsiva para mobile
- Feedback visual para ações do usuário
- Loading states durante processamento

### Manutenibilidade
- Código bem documentado
- Separação clara entre frontend e backend
- Logs de sistema para debugging

## Próximos Passos

1. Configurar projeto Supabase
2. Criar estrutura do banco de dados
3. Desenvolver API Flask
4. Implementar frontend React
5. Integrar funcionalidade de upload CSV
6. Criar dashboards e visualizações
7. Realizar testes completos
8. Deploy do sistema

Este planejamento serve como base para o desenvolvimento do sistema completo de acompanhamento de vendas.


# Sistema de Acompanhamento de Vendas das Lojas

Sistema web completo para acompanhamento de vendas com dashboard interativo, upload de CSV e integração com Supabase.

## 🚀 Funcionalidades

- **Dashboard Interativo** com métricas em tempo real
- **Upload de CSV** com processamento automático
- **Acompanhamento por Operador** com metas e percentuais
- **Visão Geral por Loja** com progresso visual
- **Interface Responsiva** para desktop e mobile
- **Integração Supabase** para banco de dados

## 📊 Capturas de Tela

### Dashboard Principal
![Dashboard](docs/dashboard.png)

### Acompanhamento por Operador
- Tabela com ordenação por performance
- Barras de progresso visuais
- Status colorido (Meta Atingida, Próximo da Meta, Abaixo da Meta)

### Visão Geral por Loja
- Consolidação por loja
- Número de vendedores por loja
- Progresso em relação às metas

## 🛠️ Tecnologias

### Backend
- **Flask** - Framework web Python
- **Supabase** - Banco de dados PostgreSQL
- **Python 3.11** - Linguagem de programação

### Frontend
- **React** - Biblioteca JavaScript
- **Tailwind CSS** - Framework CSS
- **shadcn/ui** - Componentes UI
- **Lucide React** - Ícones

## 📁 Estrutura do Projeto

```
sistema-vendas-lojas/
├── src/                     # Backend Flask
│   ├── main.py             # Aplicação principal
│   ├── config.py           # Configurações
│   ├── database.py         # Conexão banco
│   ├── routes/             # APIs REST
│   └── static/             # Frontend build
├── frontend/               # Código fonte React
│   ├── src/
│   ├── public/
│   └── package.json
├── requirements.txt        # Dependências Python
├── DEPLOY_INSTRUCTIONS.md  # Instruções de deploy
└── README.md              # Este arquivo
```

## 🚀 Como Executar

### Pré-requisitos
- Python 3.11+
- Node.js 18+
- Conta no Supabase

### Backend (Flask)

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/Robertobh77/sistema-vendas-lojas.git
   cd sistema-vendas-lojas
   ```

2. **Configure o ambiente virtual**:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # Linux/Mac
   # ou
   venv\Scripts\activate     # Windows
   ```

3. **Instale as dependências**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure as variáveis de ambiente** (`.env`):
   ```
   SUPABASE_URL=sua_url_supabase
   SUPABASE_SERVICE_KEY=sua_service_key
   ```

5. **Execute o servidor**:
   ```bash
   python src/main.py
   ```

### Frontend (React) - Desenvolvimento

1. **Navegue para o frontend**:
   ```bash
   cd frontend
   ```

2. **Instale as dependências**:
   ```bash
   npm install
   # ou
   pnpm install
   ```

3. **Execute o servidor de desenvolvimento**:
   ```bash
   npm run dev
   # ou
   pnpm run dev
   ```

## 📤 Upload de CSV

O sistema aceita arquivos CSV com o seguinte formato:

```csv
Data;Funcionário;Valor Custo;Valor Comissão Lotérica(Tarifa de Serviço);Valor Venda
01 de Setembro;ROBERTO;R$ 18.248,12;R$ 0,02;R$ 18.248,14
01 de Setembro;SUELEM;R$ 5.432,29;R$ 1.559,81;R$ 6.992,10
```

### Campos obrigatórios:
- **Data**: Data da venda
- **Funcionário**: Nome do operador
- **Valor Custo**: Valor de custo
- **Valor Comissão**: Comissão/tarifa
- **Valor Venda**: Valor total da venda

## 🎯 Como Usar

1. **Acesse o sistema** no navegador
2. **Faça upload** dos arquivos CSV diários na aba "Upload CSV"
3. **Acompanhe** o desempenho no Dashboard
4. **Configure** metas dos operadores conforme necessário
5. **Monitore** o progresso em tempo real

## 🔧 Configuração do Banco

O sistema cria automaticamente as seguintes tabelas:
- `lojas` - Informações das lojas
- `operadores` - Dados dos operadores/vendedores
- `vendas` - Registros de vendas
- `uploads_csv` - Histórico de uploads

## 📈 Métricas Calculadas

- **Tarifa Acumulada**: Soma das vendas do operador
- **% da Meta**: Percentual atingido em relação à meta mensal
- **Status**: Meta Atingida (≥100%), Próximo da Meta (≥80%), Abaixo da Meta (<80%)

## 🚀 Deploy

Consulte o arquivo [DEPLOY_INSTRUCTIONS.md](DEPLOY_INSTRUCTIONS.md) para instruções detalhadas de deploy em produção.

### Opções de Deploy:
- **VPS/Servidor próprio** (Recomendado)
- **Heroku** (Gratuito)
- **Railway** (Gratuito)
- **Vercel/Netlify** (Frontend apenas)

## 📝 Licença

Este projeto foi desenvolvido para uso interno das lojas.

## 🤝 Contribuição

Para contribuir com o projeto:
1. Faça um fork
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Abra um Pull Request

## 📞 Suporte

Para dúvidas ou suporte, entre em contato através dos issues do GitHub.

---

**Desenvolvido com ❤️ para otimizar o acompanhamento de vendas das lojas**

# Deploy forçado Mon Sep 15 10:29:27 EDT 2025

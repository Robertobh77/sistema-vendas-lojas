# Instruções de Deploy - Sistema de Acompanhamento de Vendas

## 📁 Arquivos do Sistema

O sistema está completo e pronto para deploy em `/home/ubuntu/vendas-api/`:

```
vendas-api/
├── src/
│   ├── main.py              # Aplicação Flask principal
│   ├── config.py            # Configurações do Supabase
│   ├── database.py          # Conexão com banco
│   ├── routes/              # APIs REST
│   └── static/              # Frontend React (build)
├── requirements.txt         # Dependências Python
└── venv/                   # Ambiente virtual
```

## 🚀 Opções de Deploy

### Opção 1: Servidor VPS (Recomendado)

1. **Faça upload dos arquivos** para seu servidor
2. **Configure o ambiente**:
   ```bash
   cd vendas-api
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

3. **Configure as variáveis de ambiente** (`.env`):
   ```
   SUPABASE_URL=https://yhiikdnvoxmnpwejphnz.supabase.co
   SUPABASE_SERVICE_KEY=sua_service_key_aqui
   ```

4. **Execute com Gunicorn** (produção):
   ```bash
   pip install gunicorn
   gunicorn -w 4 -b 0.0.0.0:5000 src.main:app
   ```

5. **Configure Nginx** (proxy reverso):
   ```nginx
   server {
       listen 80;
       server_name metas.grandepremioloterias.com.br;
       
       location / {
           proxy_pass http://127.0.0.1:5000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

### Opção 2: Heroku (Gratuito)

1. **Instale Heroku CLI**
2. **Crie arquivo `Procfile`**:
   ```
   web: gunicorn -w 4 -b 0.0.0.0:$PORT src.main:app
   ```
3. **Deploy**:
   ```bash
   heroku create metas-vendas
   git push heroku main
   ```

### Opção 3: Railway (Gratuito)

1. **Conecte seu repositório GitHub**
2. **Configure variáveis de ambiente**
3. **Deploy automático**

## 🔧 Configuração DNS

No seu painel de DNS, adicione:
```
Tipo: CNAME
Nome: metas
Valor: seu-servidor.com
```

Ou:
```
Tipo: A
Nome: metas
Valor: IP.DO.SEU.SERVIDOR
```

## 📊 Funcionalidades Implementadas

✅ **Dashboard Completo**
- Métricas gerais (operadores, lojas, vendas, performance)
- Tabela de operadores com ordenação
- Visão geral por loja com progresso visual
- Interface responsiva e profissional

✅ **Upload de CSV**
- Processamento automático de arquivos
- Associação operador-loja automática
- Cálculo de percentuais e status
- Validação de dados

✅ **API REST Completa**
- `/api/operadores` - CRUD operadores
- `/api/lojas` - CRUD lojas
- `/api/vendas` - CRUD vendas
- `/api/upload-csv` - Upload de arquivos

✅ **Banco de Dados**
- Supabase configurado
- Tabelas: lojas, operadores, vendas, uploads_csv
- Relacionamentos e índices otimizados

## 🔐 Segurança

- Variáveis de ambiente para credenciais
- Validação de uploads
- CORS configurado
- Sanitização de dados

## 📱 Responsividade

- Design mobile-first
- Interface adaptável
- Componentes otimizados
- Performance otimizada

## 🎯 Como Usar

1. **Acesse** `metas.grandepremioloterias.com.br`
2. **Faça upload** dos arquivos CSV diários
3. **Acompanhe** o desempenho em tempo real
4. **Configure** metas conforme necessário

O sistema está pronto para uso em produção!


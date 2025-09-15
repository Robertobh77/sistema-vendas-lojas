#!/usr/bin/env python3
"""
Script para limpar o banco de dados e recomeçar do zero
"""

import os
import sys
sys.path.insert(0, os.path.dirname(__file__))

from src.database import get_supabase_client

def limpar_banco():
    supabase = get_supabase_client()
    
    print("🧹 Limpando banco de dados...")
    
    # Limpar tabelas na ordem correta (respeitando foreign keys)
    tabelas = [
        'vendas',      # Primeiro as vendas (dependem de operadores)
        'operadores',  # Depois operadores (dependem de lojas)
        'lojas',       # Depois lojas
        'usuarios'     # Por último usuarios (exceto admin)
    ]
    
    for tabela in tabelas:
        try:
            if tabela == 'usuarios':
                # Manter apenas o usuário admin
                response = supabase.table(tabela).delete().neq('email', 'admin@grandepremioloterias.com.br').execute()
                print(f"✅ {tabela} - mantido apenas admin")
            else:
                # Limpar completamente
                response = supabase.table(tabela).delete().gte('id', 0).execute()
                print(f"✅ {tabela} - limpa")
                
        except Exception as e:
            print(f"❌ {tabela} - erro: {str(e)}")
    
    print("\n🏪 Cadastrando lojas corretas...")
    
    # Cadastrar apenas as 7 lojas corretas
    lojas_corretas = [
        "BELVEDERE",
        "BARÃO", 
        "BETIM",
        "CONTAGEM",
        "INDEPENDÊNCIA",
        "IBIRITÉ",
        "TAQUARIL"
    ]
    
    for nome_loja in lojas_corretas:
        try:
            loja_data = {
                'nome': nome_loja,
                'meta_mensal': 0
            }
            
            response = supabase.table("lojas").insert(loja_data).execute()
            
            if response.data:
                print(f"✅ {nome_loja} - cadastrada (ID: {response.data[0]['id']})")
            else:
                print(f"❌ {nome_loja} - erro ao cadastrar")
                
        except Exception as e:
            print(f"❌ {nome_loja} - erro: {str(e)}")
    
    print("\n📊 Verificando estado final...")
    
    # Verificar estado das tabelas
    for tabela in ['lojas', 'operadores', 'vendas', 'usuarios']:
        try:
            count = supabase.table(tabela).select("id", count="exact").execute()
            print(f"  {tabela}: {count.count} registros")
        except Exception as e:
            print(f"  {tabela}: erro ao contar - {str(e)}")
    
    print("\n🎉 Banco de dados limpo e pronto para testes!")
    print("\n📋 Próximos passos:")
    print("1. Testar login com: admin@grandepremioloterias.com.br / admin123")
    print("2. Cadastrar gerente da Loja Barão")
    print("3. Cadastrar funcionários da Loja Barão")
    print("4. Testar acesso restrito por loja")

if __name__ == "__main__":
    limpar_banco()


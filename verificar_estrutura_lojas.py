#!/usr/bin/env python3
"""
Verificar estrutura da tabela lojas
"""

import os
import sys
sys.path.insert(0, os.path.dirname(__file__))

from src.database import get_supabase_client

def verificar_estrutura():
    supabase = get_supabase_client()
    
    print("🔍 Verificando estrutura da tabela lojas...")
    
    try:
        # Tentar inserir com apenas nome
        result = supabase.table("lojas").insert({
            "nome": "TESTE_ESTRUTURA"
        }).execute()
        
        if result.data:
            print("✅ Estrutura básica funciona - apenas 'nome' necessário")
            # Remover teste
            supabase.table("lojas").delete().eq("nome", "TESTE_ESTRUTURA").execute()
        
    except Exception as e:
        print(f"❌ Erro: {str(e)}")
        
        # Tentar ver o que existe na tabela
        try:
            result = supabase.table("lojas").select("*").limit(1).execute()
            print(f"📊 Dados existentes: {result.data}")
        except Exception as e2:
            print(f"❌ Erro ao consultar: {str(e2)}")

if __name__ == "__main__":
    verificar_estrutura()


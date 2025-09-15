#!/usr/bin/env python3
"""
FASE 1 - Limpar banco completamente e recomeçar
"""

import os
import sys
sys.path.insert(0, os.path.dirname(__file__))

from src.database import get_supabase_client

def limpar_banco_completo():
    supabase = get_supabase_client()
    
    print("🧹 FASE 1 - Limpando banco completamente...")
    
    try:
        # Limpar vendas primeiro (tem foreign keys)
        print("1. Limpando vendas...")
        supabase.table("vendas").delete().neq("id", 0).execute()
        
        # Limpar operadores
        print("2. Limpando operadores...")
        supabase.table("operadores").delete().neq("id", 0).execute()
        
        # Limpar usuários (exceto admin)
        print("3. Limpando usuários (mantendo admin)...")
        supabase.table("usuarios").delete().neq("email", "admin@grandepremioloterias.com.br").execute()
        
        # Limpar lojas
        print("4. Limpando lojas...")
        supabase.table("lojas").delete().neq("id", 0).execute()
        
        print("✅ Banco limpo com sucesso!")
        
        # Verificar limpeza
        print("\n📊 Verificando limpeza:")
        vendas = supabase.table("vendas").select("*").execute()
        operadores = supabase.table("operadores").select("*").execute()
        users = supabase.table("usuarios").select("*").execute()
        lojas = supabase.table("lojas").select("*").execute()
        
        print(f"- Vendas: {len(vendas.data)} registros")
        print(f"- Operadores: {len(operadores.data)} registros")
        print(f"- Usuários: {len(users.data)} registros")
        print(f"- Lojas: {len(lojas.data)} registros")
        
        return True
        
    except Exception as e:
        print(f"❌ Erro ao limpar banco: {str(e)}")
        return False

if __name__ == "__main__":
    limpar_banco_completo()


#!/usr/bin/env python3
"""
Script para debugar problema de criação de operadores
"""

import os
import sys
sys.path.insert(0, os.path.dirname(__file__))

from src.database import get_supabase_client

def debug_operadores():
    supabase = get_supabase_client()
    
    print("🔍 Debugando problema de criação de operadores...")
    
    # Testar criação de operador
    try:
        print("\n1. Testando criação de operador...")
        
        # Primeiro, verificar se há lojas disponíveis
        lojas_response = supabase.table("lojas").select("*").execute()
        print(f"Lojas disponíveis: {len(lojas_response.data)}")
        
        if lojas_response.data:
            loja_teste = lojas_response.data[0]
            print(f"Usando loja: {loja_teste['nome']} (ID: {loja_teste['id']})")
            
            # Tentar criar operador
            operador_data = {
                "nome": "TESTE OPERADOR",
                "loja_id": loja_teste['id'],
                "meta_mensal": 10000,
                "ativo": True
            }
            
            print(f"Dados do operador: {operador_data}")
            
            response = supabase.table("operadores").insert(operador_data).execute()
            
            if response.data:
                print(f"✅ Operador criado com sucesso: {response.data[0]}")
                
                # Limpar teste
                supabase.table("operadores").delete().eq("nome", "TESTE OPERADOR").execute()
                print("🧹 Operador de teste removido")
            else:
                print(f"❌ Erro ao criar operador: {response}")
                
        else:
            print("❌ Nenhuma loja encontrada")
    
    except Exception as e:
        print(f"❌ Erro na criação: {str(e)}")
    
    # Verificar estrutura da tabela
    try:
        print("\n2. Verificando operadores existentes...")
        operadores_response = supabase.table("operadores").select("*").execute()
        print(f"Operadores existentes: {len(operadores_response.data)}")
        
        if operadores_response.data:
            print("Primeiro operador:", operadores_response.data[0])
    
    except Exception as e:
        print(f"❌ Erro ao verificar operadores: {str(e)}")
    
    # Verificar logs de erro
    try:
        print("\n3. Testando com dados do formulário...")
        
        # Simular dados do formulário que deu erro
        form_data = {
            "nome": "ONLINE T",
            "loja_id": 22,  # TAQUARIL
            "meta_mensal": 10000,
            "ativo": True
        }
        
        print(f"Dados do formulário: {form_data}")
        
        # Verificar se a loja existe
        loja_check = supabase.table("lojas").select("*").eq("id", 22).execute()
        if loja_check.data:
            print(f"✅ Loja encontrada: {loja_check.data[0]['nome']}")
        else:
            print("❌ Loja ID 22 não encontrada")
            
        # Tentar criar com dados do formulário
        response = supabase.table("operadores").insert(form_data).execute()
        
        if response.data:
            print(f"✅ Operador criado: {response.data[0]}")
            # Limpar
            supabase.table("operadores").delete().eq("nome", "ONLINE T").execute()
        else:
            print(f"❌ Erro: {response}")
    
    except Exception as e:
        print(f"❌ Erro com dados do formulário: {str(e)}")

if __name__ == "__main__":
    debug_operadores()


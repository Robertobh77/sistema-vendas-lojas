#!/usr/bin/env python3
"""
Verificar estrutura da tabela vendas
"""

import os
import sys
sys.path.insert(0, os.path.dirname(__file__))

from src.database import get_supabase_client

def verificar_tabela_vendas():
    supabase = get_supabase_client()
    
    print("🔍 Verificando estrutura da tabela vendas...")
    
    try:
        # Tentar fazer uma consulta simples para ver as colunas
        result = supabase.table("vendas").select("*").limit(1).execute()
        
        print(f"📊 Tabela vendas existe. Registros: {len(result.data)}")
        
        if result.data:
            print("📋 Colunas encontradas:")
            for coluna in result.data[0].keys():
                print(f"  - {coluna}")
        else:
            print("📋 Tabela vazia, tentando inserir teste...")
            
            # Tentar inserir um registro de teste para ver quais colunas existem
            test_data = {
                "operador_id": 1,
                "valor_comissao": 10.0
            }
            
            try:
                test_result = supabase.table("vendas").insert(test_data).execute()
                print("✅ Teste de inserção funcionou")
                
                # Deletar o registro de teste
                if test_result.data:
                    supabase.table("vendas").delete().eq("id", test_result.data[0]["id"]).execute()
                    print("🗑️ Registro de teste removido")
                    
            except Exception as e:
                print(f"❌ Erro no teste de inserção: {str(e)}")
        
    except Exception as e:
        print(f"❌ Erro ao verificar tabela vendas: {str(e)}")

if __name__ == "__main__":
    verificar_tabela_vendas()


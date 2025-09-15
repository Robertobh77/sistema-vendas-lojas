#!/usr/bin/env python3
"""
FASE 1 - Cadastrar as 7 lojas corretas
"""

import os
import sys
sys.path.insert(0, os.path.dirname(__file__))

from src.database import get_supabase_client

def cadastrar_lojas_corretas():
    supabase = get_supabase_client()
    
    print("🏪 FASE 1 - Cadastrando as 7 lojas corretas...")
    
    # As 7 lojas definidas pelo usuário
    lojas = [
        "BELVEDERE",
        "BARÃO", 
        "BETIM",
        "CONTAGEM",
        "INDEPENDÊNCIA",
        "IBIRITÉ",
        "TAQUARIL"
    ]
    
    try:
        lojas_criadas = []
        
        for i, nome_loja in enumerate(lojas, 1):
            print(f"{i}. Cadastrando loja: {nome_loja}")
            
            result = supabase.table("lojas").insert({
                "nome": nome_loja
            }).execute()
            
            if result.data:
                loja_id = result.data[0]['id']
                lojas_criadas.append({"id": loja_id, "nome": nome_loja})
                print(f"   ✅ Criada com ID: {loja_id}")
            else:
                print(f"   ❌ Erro ao criar {nome_loja}")
        
        print(f"\n✅ {len(lojas_criadas)} lojas cadastradas com sucesso!")
        
        # Verificar cadastro
        print("\n📊 Lojas cadastradas:")
        for loja in lojas_criadas:
            print(f"- ID {loja['id']}: {loja['nome']}")
        
        return lojas_criadas
        
    except Exception as e:
        print(f"❌ Erro ao cadastrar lojas: {str(e)}")
        return []

if __name__ == "__main__":
    cadastrar_lojas_corretas()


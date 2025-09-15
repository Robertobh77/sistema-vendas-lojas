#!/usr/bin/env python3
"""
Script para cadastrar as lojas no sistema
"""

import os
import sys
sys.path.insert(0, os.path.dirname(__file__))

from src.database import get_supabase_client

def cadastrar_lojas():
    supabase = get_supabase_client()
    
    # Lista das lojas para cadastrar
    lojas = [
        "BELVEDERE",
        "BARÃO", 
        "BETIM",
        "CONTAGEM",
        "INDEPENDÊNCIA",
        "IBIRITÉ",
        "TAQUARIL"
    ]
    
    print("🏪 Cadastrando lojas no sistema...")
    
    for nome_loja in lojas:
        try:
            # Verificar se loja já existe
            existing = supabase.table("lojas").select("*").eq("nome", nome_loja).execute()
            
            if existing.data:
                print(f"✅ {nome_loja} - já existe")
                continue
            
            # Cadastrar nova loja
            loja_data = {
                'nome': nome_loja,
                'meta_mensal': 0  # Pode ser definida depois
            }
            
            response = supabase.table("lojas").insert(loja_data).execute()
            
            if response.data:
                print(f"✅ {nome_loja} - cadastrada com sucesso (ID: {response.data[0]['id']})")
            else:
                print(f"❌ {nome_loja} - erro ao cadastrar")
                
        except Exception as e:
            print(f"❌ {nome_loja} - erro: {str(e)}")
    
    print("\n📊 Resumo das lojas cadastradas:")
    
    # Listar todas as lojas
    try:
        all_lojas = supabase.table("lojas").select("*").order("nome").execute()
        
        if all_lojas.data:
            print(f"Total de lojas no sistema: {len(all_lojas.data)}")
            for loja in all_lojas.data:
                print(f"  - {loja['nome']} (ID: {loja['id']})")
        else:
            print("Nenhuma loja encontrada no sistema")
            
    except Exception as e:
        print(f"Erro ao listar lojas: {str(e)}")
    
    print("\n🎉 Processo concluído!")

if __name__ == "__main__":
    cadastrar_lojas()


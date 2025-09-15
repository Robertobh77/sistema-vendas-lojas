#!/usr/bin/env python3
"""
Testar API de lojas
"""

import os
import sys
sys.path.insert(0, os.path.dirname(__file__))

from src.database import get_supabase_client

def testar_api_lojas():
    supabase = get_supabase_client()
    
    print("🔍 Testando API de lojas...")
    
    try:
        # Verificar se lojas existem no banco
        result = supabase.table("lojas").select("*").execute()
        
        print(f"📊 Lojas no banco: {len(result.data)}")
        
        for loja in result.data:
            print(f"- ID {loja['id']}: {loja['nome']}")
        
        return result.data
        
    except Exception as e:
        print(f"❌ Erro ao consultar lojas: {str(e)}")
        return []

if __name__ == "__main__":
    testar_api_lojas()


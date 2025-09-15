#!/usr/bin/env python3
"""
Script para criar usuário administrador inicial
"""

import os
from werkzeug.security import generate_password_hash
from src.database import get_supabase_client

def create_admin_user():
    supabase = get_supabase_client()
    
    # Dados do usuário admin
    admin_data = {
        'nome': 'Administrador',
        'email': 'admin@grandepremioloterias.com.br',
        'senha_hash': generate_password_hash('admin123'),  # Mude esta senha!
        'tipo': 'admin',
        'ativo': True
    }
    
    try:
        # Verificar se já existe
        existing = supabase.table("usuarios").select("*").eq("email", admin_data['email']).execute()
        
        if existing.data:
            print("❌ Usuário admin já existe!")
            return
        
        # Criar usuário admin
        response = supabase.table("usuarios").insert(admin_data).execute()
        
        print("✅ Usuário admin criado com sucesso!")
        print(f"📧 Email: {admin_data['email']}")
        print(f"🔑 Senha: admin123")
        print("⚠️  IMPORTANTE: Altere a senha após o primeiro login!")
        
    except Exception as e:
        print(f"❌ Erro ao criar usuário admin: {e}")

if __name__ == "__main__":
    create_admin_user()


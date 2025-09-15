#!/usr/bin/env python3
"""
Script para criar tabela de usuários no Supabase
"""

from src.database import get_supabase_client

def create_users_table():
    supabase = get_supabase_client()
    
    # SQL para criar tabela de usuários
    sql_create_table = """
    CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        senha_hash VARCHAR(255) NOT NULL,
        tipo VARCHAR(50) NOT NULL DEFAULT 'gerente', -- 'admin' ou 'gerente'
        loja_id INTEGER REFERENCES lojas(id),
        ativo BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    
    -- Índices para performance
    CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
    CREATE INDEX IF NOT EXISTS idx_usuarios_tipo ON usuarios(tipo);
    CREATE INDEX IF NOT EXISTS idx_usuarios_loja_id ON usuarios(loja_id);
    """
    
    try:
        # Executar SQL usando a função exec que criamos anteriormente
        supabase.rpc('exec', {'sql': sql_create_table}).execute()
        print("✅ Tabela 'usuarios' criada com sucesso!")
        
    except Exception as e:
        print(f"❌ Erro ao criar tabela: {e}")

if __name__ == "__main__":
    create_users_table()


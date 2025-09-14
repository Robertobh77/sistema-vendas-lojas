from supabase import create_client, Client
from src.config import Config

# Instância global do cliente Supabase
supabase: Client = create_client(Config.SUPABASE_URL, Config.SUPABASE_SERVICE_KEY)

def get_supabase_client():
    """Retorna a instância do cliente Supabase"""
    return supabase


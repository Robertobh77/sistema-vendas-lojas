from src.database import get_supabase_client

def verificar_usuarios():
    supabase = get_supabase_client()
    
    try:
        # Buscar todos os usuários
        response = supabase.table("usuarios").select("*").execute()
        
        print("=== USUÁRIOS NO BANCO ===")
        for user in response.data:
            print(f"ID: {user['id']}")
            print(f"Nome: {user['nome']}")
            print(f"Email: {user['email']}")
            print(f"Tipo: {user['tipo']}")
            print(f"Loja ID: {user.get('loja_id', 'N/A')}")
            print("---")
            
        print(f"\nTotal de usuários: {len(response.data)}")
        
        # Verificar se há usuários do tipo gerente
        gerentes = [u for u in response.data if u['tipo'] == 'gerente']
        print(f"Gerentes encontrados: {len(gerentes)}")
        
        for gerente in gerentes:
            print(f"Gerente: {gerente['nome']} - Loja ID: {gerente.get('loja_id', 'N/A')}")
            
    except Exception as e:
        print(f"Erro: {e}")

if __name__ == "__main__":
    verificar_usuarios()


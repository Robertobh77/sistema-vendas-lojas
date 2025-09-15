from flask import Blueprint, jsonify
from src.database import get_supabase_client

operadores_dashboard_bp = Blueprint('operadores_dashboard', __name__)
supabase = get_supabase_client()

@operadores_dashboard_bp.route('/operadores/simples', methods=['GET'])
def get_operadores_dashboard():
    """Retorna dados dos operadores para dashboard - FASE 3"""
    try:
        # Buscar operadores com informações da loja
        operadores_response = supabase.table("operadores").select("""
            id,
            nome,
            meta_mensal,
            ativo,
            loja_id,
            lojas (
                id,
                nome
            )
        """).eq("ativo", True).execute()
        
        operadores = operadores_response.data
        
        result = []
        for operador in operadores:
            # Buscar vendas do operador
            vendas_response = supabase.table("vendas").select("valor_comissao").eq("operador_id", operador["id"]).execute()
            
            # Calcular total de vendas (usando valor_comissao - 4ª coluna)
            vendas_total = sum(venda["valor_comissao"] or 0 for venda in vendas_response.data)
            
            # Calcular percentual da meta
            meta_mensal = operador.get("meta_mensal", 0)
            percentual = (vendas_total / meta_mensal * 100) if meta_mensal > 0 else 0
            
            # Determinar status
            if percentual >= 100:
                status = "Meta Atingida"
            elif percentual >= 80:
                status = "Próximo da Meta"
            else:
                status = "Abaixo da Meta"
            
            result.append({
                "id": operador["id"],
                "nome": operador["nome"],
                "loja_id": operador["loja_id"],
                "loja_nome": operador["lojas"]["nome"] if operador["lojas"] else "N/A",
                "meta_mensal": meta_mensal,
                "vendas_total": vendas_total,
                "percentual": round(percentual, 1),
                "status": status,
                "ativo": operador["ativo"]
            })
        
        # Ordenar por percentual decrescente
        result.sort(key=lambda x: x["percentual"], reverse=True)
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


from flask import Blueprint, jsonify, request
from src.database import get_supabase_client

operadores_bp = Blueprint('operadores', __name__)
supabase = get_supabase_client()

@operadores_bp.route('/operadores', methods=['GET'])
def get_operadores():
    """Retorna todos os operadores com suas métricas"""
    try:
        # Buscar operadores com informações da loja
        operadores_response = supabase.table("operadores").select("""
            *,
            lojas (
                nome
            )
        """).eq("ativo", True).execute()
        
        operadores = operadores_response.data
        
        result = []
        for operador in operadores:
            # Buscar vendas do operador no mês atual
            vendas_response = supabase.table("vendas").select("valor_venda").eq("operador_id", operador["id"]).execute()
            tarifa_acumulada = sum(venda["valor_venda"] or 0 for venda in vendas_response.data)
            
            # Calcular percentual da meta
            meta_mensal = operador["meta_mensal"] or 0
            percentual = (tarifa_acumulada / meta_mensal * 100) if meta_mensal > 0 else 0
            
            # Determinar status
            if percentual >= 100:
                status = "Meta Atingida"
            elif percentual >= 80:
                status = "Próxima da Meta"
            else:
                status = "Abaixo da Meta"
            
            result.append({
                "id": operador["id"],
                "nome": operador["nome"],
                "loja": operador["lojas"]["nome"] if operador["lojas"] else "N/A",
                "loja_id": operador["loja_id"],
                "meta_mensal": meta_mensal,
                "tarifa_acumulada": tarifa_acumulada,
                "percentual": round(percentual, 1),
                "status": status
            })
        
        # Ordenar por percentual decrescente
        result.sort(key=lambda x: x["percentual"], reverse=True)
        
        return jsonify(result)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@operadores_bp.route('/operadores', methods=['POST'])
def create_operador():
    """Cria um novo operador"""
    try:
        data = request.get_json()
        
        response = supabase.table("operadores").insert({
            "nome": data["nome"],
            "loja_id": data["loja_id"],
            "meta_mensal": data.get("meta_mensal", 0),
            "ativo": data.get("ativo", True)
        }).execute()
        
        return jsonify(response.data[0]), 201
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@operadores_bp.route('/operadores/<int:operador_id>', methods=['PUT'])
def update_operador(operador_id):
    """Atualiza um operador"""
    try:
        data = request.get_json()
        
        response = supabase.table("operadores").update({
            "nome": data.get("nome"),
            "loja_id": data.get("loja_id"),
            "meta_mensal": data.get("meta_mensal"),
            "ativo": data.get("ativo")
        }).eq("id", operador_id).execute()
        
        return jsonify(response.data[0])
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@operadores_bp.route('/operadores/<int:operador_id>', methods=['DELETE'])
def delete_operador(operador_id):
    """Desativa um operador (soft delete)"""
    try:
        response = supabase.table("operadores").update({
            "ativo": False
        }).eq("id", operador_id).execute()
        
        return jsonify({"message": "Operador desativado com sucesso"})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


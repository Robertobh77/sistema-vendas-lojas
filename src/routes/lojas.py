from flask import Blueprint, jsonify, request
from src.database import get_supabase_client

lojas_bp = Blueprint('lojas', __name__)
supabase = get_supabase_client()

@lojas_bp.route('/lojas', methods=['GET'])
def get_lojas():
    """Retorna todas as lojas com suas métricas"""
    try:
        # Buscar todas as lojas
        lojas_response = supabase.table("lojas").select("*").execute()
        lojas = lojas_response.data
        
        result = []
        for loja in lojas:
            # Buscar operadores da loja
            operadores_response = supabase.table("operadores").select("*").eq("loja_id", loja["id"]).eq("ativo", True).execute()
            operadores = operadores_response.data
            
            # Calcular vendas totais da loja no mês atual (usando valor_comissao)
            vendas_response = supabase.table("vendas").select("valor_comissao").eq("loja_id", loja["id"]).execute()
            vendas_total = sum(venda["valor_comissao"] or 0 for venda in vendas_response.data)
            
            # Calcular meta total da loja (soma das metas dos operadores)
            meta_total = sum(op["meta_mensal"] or 0 for op in operadores)
            
            # Calcular percentual
            percentual = (vendas_total / meta_total * 100) if meta_total > 0 else 0
            
            # Valor faltante
            valor_faltante = max(0, meta_total - vendas_total)
            
            result.append({
                "id": loja["id"],
                "nome": loja["nome"],
                "meta_mensal": loja["meta_mensal"],
                "vendedores_count": len(operadores),
                "vendas_total": vendas_total,
                "meta_total": meta_total,
                "percentual": round(percentual, 1),
                "valor_faltante": valor_faltante,
                "status": "Meta Atingida" if percentual >= 100 else "Próxima da Meta" if percentual >= 80 else "Abaixo da Meta"
            })
        
        return jsonify(result)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@lojas_bp.route('/lojas', methods=['POST'])
def create_loja():
    """Cria uma nova loja"""
    try:
        data = request.get_json()
        
        response = supabase.table("lojas").insert({
            "nome": data["nome"],
            "meta_mensal": data.get("meta_mensal", 0)
        }).execute()
        
        return jsonify(response.data[0]), 201
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@lojas_bp.route('/lojas/<int:loja_id>', methods=['PUT'])
def update_loja(loja_id):
    """Atualiza uma loja"""
    try:
        data = request.get_json()
        
        response = supabase.table("lojas").update({
            "nome": data.get("nome"),
            "meta_mensal": data.get("meta_mensal")
        }).eq("id", loja_id).execute()
        
        return jsonify(response.data[0])
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@lojas_bp.route('/lojas/<int:loja_id>', methods=['DELETE'])
def delete_loja(loja_id):
    """Deleta uma loja"""
    try:
        response = supabase.table("lojas").delete().eq("id", loja_id).execute()
        return jsonify({"message": "Loja deletada com sucesso"})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


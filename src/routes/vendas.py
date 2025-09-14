from flask import Blueprint, jsonify, request
from datetime import datetime
from src.database import get_supabase_client

vendas_bp = Blueprint('vendas', __name__)
supabase = get_supabase_client()

@vendas_bp.route('/vendas', methods=['GET'])
def get_vendas():
    """Retorna todas as vendas com filtros opcionais"""
    try:
        query = supabase.table("vendas").select("""
            *,
            operadores (
                nome
            ),
            lojas (
                nome
            )
        """)
        
        # Filtros opcionais
        loja_id = request.args.get('loja_id')
        operador_id = request.args.get('operador_id')
        data_inicio = request.args.get('data_inicio')
        data_fim = request.args.get('data_fim')
        
        if loja_id:
            query = query.eq("loja_id", loja_id)
        
        if operador_id:
            query = query.eq("operador_id", operador_id)
        
        if data_inicio:
            query = query.gte("data_venda", data_inicio)
        
        if data_fim:
            query = query.lte("data_venda", data_fim)
        
        response = query.order("data_venda", desc=True).execute()
        
        return jsonify(response.data)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@vendas_bp.route('/vendas', methods=['POST'])
def create_venda():
    """Cria uma nova venda"""
    try:
        data = request.get_json()
        
        response = supabase.table("vendas").insert({
            "data_venda": data["data_venda"],
            "operador_id": data["operador_id"],
            "loja_id": data["loja_id"],
            "valor_custo": data.get("valor_custo", 0),
            "valor_comissao": data.get("valor_comissao", 0),
            "valor_venda": data.get("valor_venda", 0)
        }).execute()
        
        return jsonify(response.data[0]), 201
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@vendas_bp.route('/vendas/<int:venda_id>', methods=['PUT'])
def update_venda(venda_id):
    """Atualiza uma venda"""
    try:
        data = request.get_json()
        
        response = supabase.table("vendas").update({
            "data_venda": data.get("data_venda"),
            "operador_id": data.get("operador_id"),
            "loja_id": data.get("loja_id"),
            "valor_custo": data.get("valor_custo"),
            "valor_comissao": data.get("valor_comissao"),
            "valor_venda": data.get("valor_venda")
        }).eq("id", venda_id).execute()
        
        return jsonify(response.data[0])
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@vendas_bp.route('/vendas/<int:venda_id>', methods=['DELETE'])
def delete_venda(venda_id):
    """Deleta uma venda"""
    try:
        response = supabase.table("vendas").delete().eq("id", venda_id).execute()
        return jsonify({"message": "Venda deletada com sucesso"})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@vendas_bp.route('/vendas/resumo', methods=['GET'])
def get_resumo_vendas():
    """Retorna resumo das vendas por período"""
    try:
        # Filtros opcionais
        data_inicio = request.args.get('data_inicio')
        data_fim = request.args.get('data_fim')
        
        query = supabase.table("vendas").select("*")
        
        if data_inicio:
            query = query.gte("data_venda", data_inicio)
        
        if data_fim:
            query = query.lte("data_venda", data_fim)
        
        response = query.execute()
        vendas = response.data
        
        # Calcular totais
        total_vendas = len(vendas)
        total_valor_custo = sum(venda["valor_custo"] or 0 for venda in vendas)
        total_valor_comissao = sum(venda["valor_comissao"] or 0 for venda in vendas)
        total_valor_venda = sum(venda["valor_venda"] or 0 for venda in vendas)
        
        return jsonify({
            "total_vendas": total_vendas,
            "total_valor_custo": total_valor_custo,
            "total_valor_comissao": total_valor_comissao,
            "total_valor_venda": total_valor_venda
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


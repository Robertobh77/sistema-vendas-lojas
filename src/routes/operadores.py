from flask import Blueprint, jsonify, request
from src.database import get_supabase_client
from src.routes.auth import token_required

operadores_bp = Blueprint('operadores', __name__)
supabase = get_supabase_client()

@operadores_bp.route('/operadores', methods=['GET'])
@token_required
def get_operadores(current_user):
    """Retorna operadores com suas métricas (filtrado por loja para gerentes)"""
    try:
        # Construir query baseado no tipo de usuário
        query = supabase.table("operadores").select("""
            *,
            lojas (
                nome
            )
        """).eq("ativo", True)
        
        # Se for gerente, filtrar apenas operadores da sua loja
        if current_user['tipo'] == 'gerente' and current_user.get('loja_id'):
            query = query.eq("loja_id", current_user['loja_id'])
        
        operadores_response = query.execute()
        operadores = operadores_response.data
        
        result = []
        for operador in operadores:
            # Buscar vendas do operador no mês atual (usando valor_comissao para cálculo)
            vendas_response = supabase.table("vendas").select("valor_comissao").eq("operador_id", operador["id"]).execute()
            tarifa_acumulada = sum(venda["valor_comissao"] or 0 for venda in vendas_response.data)
            
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

@operadores_bp.route('/operadores/simples', methods=['POST'])
def create_operador_simples():
    """Cria operador sem autenticação - FASE 1"""
    try:
        data = request.get_json()
        
        result = supabase.table("operadores").insert({
            "nome": data["nome"],
            "loja_id": data["loja_id"],
            "meta_mensal": data.get("meta_mensal", 2000),
            "ativo": data.get("ativo", True)
        }).execute()
        
        return jsonify(result.data[0]), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@operadores_bp.route('/operadores', methods=['POST'])
@token_required
def create_operador(current_user):
    """Cria um novo operador (apenas admin ou gerente da loja)"""
    try:
        data = request.get_json()
        
        # Verificar permissões
        if current_user['tipo'] == 'gerente':
            # Gerente só pode criar operadores na sua loja
            if current_user.get('loja_id') != data.get('loja_id'):
                return jsonify({'message': 'Acesso negado'}), 403
        
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
@token_required
def update_operador(current_user, operador_id):
    """Atualiza um operador (apenas admin ou gerente da loja)"""
    try:
        data = request.get_json()
        
        # Verificar se operador existe e permissões
        operador_response = supabase.table("operadores").select("*").eq("id", operador_id).execute()
        if not operador_response.data:
            return jsonify({'message': 'Operador não encontrado'}), 404
        
        operador = operador_response.data[0]
        
        if current_user['tipo'] == 'gerente':
            # Gerente só pode editar operadores da sua loja
            if current_user.get('loja_id') != operador['loja_id']:
                return jsonify({'message': 'Acesso negado'}), 403
        
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
@token_required
def delete_operador(current_user, operador_id):
    """Desativa um operador (apenas admin ou gerente da loja)"""
    try:
        # Verificar se operador existe e permissões
        operador_response = supabase.table("operadores").select("*").eq("id", operador_id).execute()
        if not operador_response.data:
            return jsonify({'message': 'Operador não encontrado'}), 404
        
        operador = operador_response.data[0]
        
        if current_user['tipo'] == 'gerente':
            # Gerente só pode desativar operadores da sua loja
            if current_user.get('loja_id') != operador['loja_id']:
                return jsonify({'message': 'Acesso negado'}), 403
        
        response = supabase.table("operadores").update({
            "ativo": False
        }).eq("id", operador_id).execute()
        
        return jsonify({"message": "Operador desativado com sucesso"})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


from flask import Blueprint, jsonify, request, session
from werkzeug.security import check_password_hash, generate_password_hash
from src.database import get_supabase_client
import jwt
import datetime
from functools import wraps

auth_bp = Blueprint('auth', __name__)
supabase = get_supabase_client()

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        
        if not token:
            return jsonify({'message': 'Token é obrigatório'}), 401
        
        try:
            if token.startswith('Bearer '):
                token = token[7:]
            
            data = jwt.decode(token, 'sua-chave-secreta', algorithms=['HS256'])
            current_user_id = data['user_id']
            
            # Buscar usuário no banco
            user_response = supabase.table("usuarios").select("*").eq("id", current_user_id).execute()
            if not user_response.data:
                return jsonify({'message': 'Token inválido'}), 401
            
            current_user = user_response.data[0]
            
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token expirado'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Token inválido'}), 401
        
        return f(current_user, *args, **kwargs)
    
    return decorated

@auth_bp.route('/login', methods=['POST'])
def login():
    """Realiza login do usuário"""
    try:
        data = request.get_json()
        email = data.get('email')
        senha = data.get('senha')
        
        if not email or not senha:
            return jsonify({'message': 'Email e senha são obrigatórios'}), 400
        
        # Buscar usuário
        user_response = supabase.table("usuarios").select("*").eq("email", email).eq("ativo", True).execute()
        
        if not user_response.data:
            return jsonify({'message': 'Credenciais inválidas'}), 401
        
        user = user_response.data[0]
        
        # Verificar senha
        if not check_password_hash(user['senha_hash'], senha):
            return jsonify({'message': 'Credenciais inválidas'}), 401
        
        # Gerar token JWT
        token = jwt.encode({
            'user_id': user['id'],
            'email': user['email'],
            'tipo': user['tipo'],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, 'sua-chave-secreta', algorithm='HS256')
        
        return jsonify({
            'token': token,
            'user': {
                'id': user['id'],
                'nome': user['nome'],
                'email': user['email'],
                'tipo': user['tipo'],
                'loja_id': user.get('loja_id')
            }
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/register', methods=['POST'])
def register():
    """Registra um novo usuário (apenas admin pode criar)"""
    try:
        data = request.get_json()
        
        # Verificar se já existe usuário com este email
        existing_user = supabase.table("usuarios").select("*").eq("email", data['email']).execute()
        if existing_user.data:
            return jsonify({'message': 'Email já cadastrado'}), 400
        
        # Hash da senha
        senha_hash = generate_password_hash(data['senha'])
        
        # Criar usuário
        user_data = {
            'nome': data['nome'],
            'email': data['email'],
            'senha_hash': senha_hash,
            'tipo': data.get('tipo', 'gerente'),  # admin, gerente
            'loja_id': data.get('loja_id'),  # Para gerentes
            'ativo': True
        }
        
        response = supabase.table("usuarios").insert(user_data).execute()
        
        return jsonify({
            'message': 'Usuário criado com sucesso',
            'user': {
                'id': response.data[0]['id'],
                'nome': response.data[0]['nome'],
                'email': response.data[0]['email'],
                'tipo': response.data[0]['tipo']
            }
        }), 201
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/me', methods=['GET'])
@token_required
def get_current_user(current_user):
    """Retorna informações do usuário atual"""
    return jsonify({
        'id': current_user['id'],
        'nome': current_user['nome'],
        'email': current_user['email'],
        'tipo': current_user['tipo'],
        'loja_id': current_user.get('loja_id')
    })

@auth_bp.route('/usuarios', methods=['GET'])
@token_required
def get_usuarios(current_user):
    """Lista usuários (apenas admin)"""
    if current_user['tipo'] != 'admin':
        return jsonify({'message': 'Acesso negado'}), 403
    
    try:
        response = supabase.table("usuarios").select("""
            id, nome, email, tipo, ativo, created_at,
            lojas (
                nome
            )
        """).execute()
        
        return jsonify(response.data)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


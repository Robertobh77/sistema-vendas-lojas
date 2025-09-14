from flask import Blueprint, jsonify, request
import csv
import io
from datetime import datetime
from src.database import get_supabase_client

upload_bp = Blueprint('upload', __name__)
supabase = get_supabase_client()

def parse_date(date_str):
    """Converte string de data do formato 'DD de Mês' para YYYY-MM-DD"""
    meses = {
        'Janeiro': '01', 'Fevereiro': '02', 'Março': '03', 'Abril': '04',
        'Maio': '05', 'Junho': '06', 'Julho': '07', 'Agosto': '08',
        'Setembro': '09', 'Outubro': '10', 'Novembro': '11', 'Dezembro': '12'
    }
    
    try:
        # Formato: "01 de Setembro"
        parts = date_str.split(' de ')
        dia = parts[0].zfill(2)
        mes_nome = parts[1]
        mes = meses.get(mes_nome, '01')
        ano = str(datetime.now().year)  # Assume ano atual
        
        return f"{ano}-{mes}-{dia}"
    except:
        return datetime.now().strftime('%Y-%m-%d')

def parse_currency(value_str):
    """Converte string de moeda brasileira para float"""
    if not value_str or value_str.strip() == '':
        return 0.0
    
    # Remove 'R$', espaços e converte vírgula para ponto
    cleaned = value_str.replace('R$', '').replace(' ', '').replace('.', '').replace(',', '.')
    
    # Remove sinal negativo se presente
    if cleaned.startswith('-'):
        cleaned = cleaned[1:]
        return -float(cleaned)
    
    try:
        return float(cleaned)
    except:
        return 0.0

def get_or_create_loja(nome_loja):
    """Busca ou cria uma loja pelo nome"""
    # Mapeamento de nomes de operadores para lojas
    loja_mapping = {
        'ROBERTO': 'Belvedere',
        'SUELEM': 'Belvedere', 
        'GABRIELA': 'Belvedere',
        'ONLINE': 'Belvedere',
        'KEYLA': 'Belvedere',
        'ARETHA': 'Belvedere',
        'JENIFFER': 'Belvedere',
        'IZA': 'Contagem',
        'ALICE': 'Independência',
        'CHEILA': 'Independência',
        'ONLINE ID': 'Independência',
        'SUSANE': 'Independência',
        'JOSIANE DE PAULA': 'Independência',
        'NASCIMENTO': 'Independência',
        'PILLY': 'Betim',
        'SCARLET': 'Betim',
        'ONLINE BT': 'Betim',
        'Egberto': 'Belvedere',
        'Maiana': 'Belvedere'
    }
    
    # Se o nome_loja é um operador, mapear para a loja correta
    if nome_loja in loja_mapping:
        nome_loja = loja_mapping[nome_loja]
    
    # Buscar loja existente
    response = supabase.table("lojas").select("*").eq("nome", nome_loja).execute()
    
    if response.data:
        return response.data[0]
    
    # Criar nova loja
    new_loja = supabase.table("lojas").insert({
        "nome": nome_loja,
        "meta_mensal": 0
    }).execute()
    
    return new_loja.data[0]

def get_or_create_operador(nome_operador, loja_id):
    """Busca ou cria um operador pelo nome"""
    # Buscar operador existente
    response = supabase.table("operadores").select("*").eq("nome", nome_operador).execute()
    
    if response.data:
        return response.data[0]
    
    # Criar novo operador
    new_operador = supabase.table("operadores").insert({
        "nome": nome_operador,
        "loja_id": loja_id,
        "meta_mensal": 0,
        "ativo": True
    }).execute()
    
    return new_operador.data[0]

@upload_bp.route('/upload-csv', methods=['POST'])
def upload_csv():
    """Processa upload de arquivo CSV"""
    try:
        if 'file' not in request.files:
            return jsonify({"error": "Nenhum arquivo enviado"}), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({"error": "Nenhum arquivo selecionado"}), 400
        
        if not file.filename.endswith('.csv'):
            return jsonify({"error": "Arquivo deve ser CSV"}), 400
        
        # Ler conteúdo do arquivo
        stream = io.StringIO(file.stream.read().decode("UTF8"), newline=None)
        csv_input = csv.reader(stream, delimiter=';')  # Usar ponto e vírgula como delimitador
        
        # Pular as primeiras 3 linhas (cabeçalho com totais)
        for _ in range(3):
            next(csv_input, None)
        
        registros_processados = 0
        registros_com_erro = 0
        
        for row in csv_input:
            if len(row) < 5:
                continue
            
            # Verificar se é a linha de total (última linha)
            if row[0].lower().startswith('total'):
                break
            
            try:
                data_str = row[0]
                nome_funcionario = row[1]
                valor_custo_str = row[2]
                valor_comissao_str = row[3]
                valor_venda_str = row[4]
                
                # Pular linhas com dados inválidos
                if not data_str or not nome_funcionario:
                    continue
                
                # Converter dados
                data_venda = parse_date(data_str)
                valor_custo = parse_currency(valor_custo_str)
                valor_comissao = parse_currency(valor_comissao_str)
                valor_venda = parse_currency(valor_venda_str)
                
                # Obter ou criar loja e operador
                loja = get_or_create_loja(nome_funcionario)
                operador = get_or_create_operador(nome_funcionario, loja["id"])
                
                # Inserir venda
                supabase.table("vendas").insert({
                    "data_venda": data_venda,
                    "operador_id": operador["id"],
                    "loja_id": loja["id"],
                    "valor_custo": valor_custo,
                    "valor_comissao": valor_comissao,
                    "valor_venda": valor_venda
                }).execute()
                
                registros_processados += 1
                
            except Exception as e:
                print(f"Erro ao processar linha: {row}, erro: {str(e)}")
                registros_com_erro += 1
                continue
        
        # Registrar upload
        supabase.table("uploads_csv").insert({
            "nome_arquivo": file.filename,
            "total_registros": registros_processados,
            "status": "processado"
        }).execute()
        
        return jsonify({
            "message": "Arquivo processado com sucesso",
            "registros_processados": registros_processados,
            "registros_com_erro": registros_com_erro
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@upload_bp.route('/uploads', methods=['GET'])
def get_uploads():
    """Retorna histórico de uploads"""
    try:
        response = supabase.table("uploads_csv").select("*").order("data_upload", desc=True).execute()
        return jsonify(response.data)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


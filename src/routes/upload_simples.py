from flask import Blueprint, request, jsonify
import csv
import io
import re
from datetime import datetime
from src.database import get_supabase_client

upload_simples_bp = Blueprint('upload_simples', __name__)
supabase = get_supabase_client()

def converter_data_brasileira(data_str):
    """Converte data brasileira para formato ISO"""
    try:
        # Mapear meses em português
        meses = {
            'janeiro': '01', 'fevereiro': '02', 'março': '03', 'abril': '04',
            'maio': '05', 'junho': '06', 'julho': '07', 'agosto': '08',
            'setembro': '09', 'outubro': '10', 'novembro': '11', 'dezembro': '12'
        }
        
        # Extrair dia e mês (ex: "01 de Setembro")
        match = re.match(r'(\d{1,2})\s+de\s+(\w+)', data_str.lower())
        if match:
            dia = match.group(1).zfill(2)
            mes_nome = match.group(2)
            mes = meses.get(mes_nome, '01')
            ano = '2024'  # Assumir ano atual
            
            return f"{ano}-{mes}-{dia}"
    except:
        pass
    
    return None

def converter_valor_brasileiro(valor_str):
    """Converte valor brasileiro (R$ 1.234,56) para float"""
    try:
        # Remover R$, espaços e pontos, trocar vírgula por ponto
        valor_limpo = valor_str.replace('R$', '').replace(' ', '').replace('.', '').replace(',', '.')
        return float(valor_limpo)
    except:
        return 0.0

def encontrar_funcionario_por_nome(nome, loja_nome):
    """Encontra funcionário pelo nome e loja"""
    try:
        # Primeiro, encontrar a loja
        loja_response = supabase.table("lojas").select("id").eq("nome", loja_nome).execute()
        if not loja_response.data:
            return None
        
        loja_id = loja_response.data[0]['id']
        
        # Buscar funcionário pelo nome na loja
        funcionario_response = supabase.table("operadores").select("id, nome").eq("nome", nome).eq("loja_id", loja_id).execute()
        
        if funcionario_response.data:
            return funcionario_response.data[0]
    except:
        pass
    
    return None

@upload_simples_bp.route('/upload/csv-simples', methods=['POST'])
def upload_csv_simples():
    """Upload e processamento de CSV simples - FASE 2"""
    try:
        if 'file' not in request.files:
            return jsonify({"error": "Nenhum arquivo enviado"}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "Nenhum arquivo selecionado"}), 400
        
        # Determinar loja pelo nome do arquivo
        filename = file.filename.upper()
        loja_nome = None
        
        lojas_conhecidas = ['TAQUARIL', 'CONTAGEM', 'BARÃO', 'BELVEDERE', 'BETIM', 'INDEPENDÊNCIA', 'IBIRITÉ']
        for loja in lojas_conhecidas:
            if loja in filename:
                loja_nome = loja
                break
        
        if not loja_nome:
            return jsonify({"error": "Não foi possível identificar a loja pelo nome do arquivo"}), 400
        
        # Ler arquivo CSV
        stream = io.StringIO(file.stream.read().decode("utf-8"))
        csv_reader = csv.reader(stream, delimiter=';')
        
        # Pular primeira linha se for cabeçalho
        first_row = next(csv_reader, None)
        if first_row and 'Data' in first_row[0]:
            pass  # Era cabeçalho, continuar
        else:
            # Voltar para o início se não era cabeçalho
            stream.seek(0)
            csv_reader = csv.reader(stream, delimiter=';')
        
        vendas_importadas = 0
        total_processados = 0
        funcionarios_encontrados = set()
        funcionarios_nao_encontrados = set()
        erros = []
        
        for row in csv_reader:
            if len(row) < 5:
                continue
            
            total_processados += 1
            
            data_str = row[0].strip()
            funcionario_nome = row[1].strip()
            valor_custo_str = row[2].strip()
            valor_comissao_str = row[3].strip()  # 4ª coluna - Valor Comissão Lotérica
            valor_venda_str = row[4].strip()
            
            # Converter data
            data_iso = converter_data_brasileira(data_str)
            if not data_iso:
                erros.append(f"Data inválida: {data_str}")
                continue
            
            # Converter valores
            valor_custo = converter_valor_brasileiro(valor_custo_str)
            valor_comissao = converter_valor_brasileiro(valor_comissao_str)
            valor_venda = converter_valor_brasileiro(valor_venda_str)
            
            # Encontrar funcionário
            funcionario = encontrar_funcionario_por_nome(funcionario_nome, loja_nome)
            
            if funcionario:
                funcionarios_encontrados.add(funcionario_nome)
                
                # Inserir venda
                venda_data = {
                    "data_venda": data_iso,
                    "operador_id": funcionario['id'],
                    "loja_id": None,  # Será preenchido pela trigger ou deixar None
                    "valor_custo": valor_custo,
                    "valor_comissao": valor_comissao,  # 4ª coluna
                    "valor_venda": valor_venda
                }
                
                result = supabase.table("vendas").insert(venda_data).execute()
                
                if result.data:
                    vendas_importadas += 1
                else:
                    erros.append(f"Erro ao inserir venda para {funcionario_nome}")
            else:
                funcionarios_nao_encontrados.add(funcionario_nome)
                erros.append(f"Funcionário não encontrado: {funcionario_nome}")
        
        return jsonify({
            "success": True,
            "total_processados": total_processados,
            "vendas_importadas": vendas_importadas,
            "funcionarios_encontrados": len(funcionarios_encontrados),
            "funcionarios_nao_encontrados": len(funcionarios_nao_encontrados),
            "loja_identificada": loja_nome,
            "erros": erros[:10]  # Limitar a 10 erros para não sobrecarregar
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


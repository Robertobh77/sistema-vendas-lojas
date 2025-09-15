import React, { useState } from 'react';

const ImportacaoCSVSimples = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [resultado, setResultado] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      setMessage('');
    } else {
      setMessage('❌ Por favor, selecione um arquivo CSV válido');
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('❌ Selecione um arquivo CSV primeiro');
      return;
    }

    setLoading(true);
    setMessage('');
    setResultado(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload/csv-simples', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('✅ Arquivo importado com sucesso!');
        setResultado(data);
        setFile(null);
        // Limpar input
        document.getElementById('csvFile').value = '';
      } else {
        setMessage(`❌ Erro: ${data.error || 'Erro ao importar arquivo'}`);
      }
    } catch (error) {
      console.error('Erro:', error);
      setMessage('❌ Erro ao enviar arquivo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>📁 Importação CSV - FASE 2</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        Importe dados de vendas sem alterar cadastros existentes
      </p>

      {message && (
        <div style={{ 
          padding: '10px', 
          marginBottom: '20px', 
          backgroundColor: message.includes('✅') ? '#d4edda' : '#f8d7da',
          border: `1px solid ${message.includes('✅') ? '#c3e6cb' : '#f5c6cb'}`,
          borderRadius: '4px'
        }}>
          {message}
        </div>
      )}

      <div style={{ 
        border: '2px dashed #ccc', 
        padding: '30px', 
        textAlign: 'center',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h3>📄 Selecionar Arquivo CSV</h3>
        <input
          id="csvFile"
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          style={{ 
            margin: '10px 0',
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
        />
        
        {file && (
          <div style={{ marginTop: '10px', color: '#28a745' }}>
            ✅ Arquivo selecionado: {file.name}
          </div>
        )}
        
        <button 
          onClick={handleUpload}
          disabled={!file || loading}
          style={{
            marginTop: '15px',
            backgroundColor: loading ? '#6c757d' : '#007bff',
            color: 'white',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px'
          }}
        >
          {loading ? '⏳ Importando...' : '📤 Importar CSV'}
        </button>
      </div>

      <div style={{ 
        backgroundColor: '#f8f9fa', 
        padding: '15px', 
        borderRadius: '4px',
        fontSize: '14px'
      }}>
        <h4>📋 Formato esperado do CSV:</h4>
        <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
          <li><strong>Coluna 1:</strong> Data (ex: "01 de Setembro")</li>
          <li><strong>Coluna 2:</strong> Funcionário (ex: "ONLINE T")</li>
          <li><strong>Coluna 3:</strong> Valor Custo (ex: "R$ 33,70")</li>
          <li><strong>Coluna 4:</strong> Valor Comissão Lotérica (ex: "R$ 11,81") ← <strong>Usado nos cálculos</strong></li>
          <li><strong>Coluna 5:</strong> Valor Venda (ex: "R$ 45,51")</li>
        </ul>
        <p style={{ color: '#dc3545', fontWeight: 'bold' }}>
          ⚠️ O sistema associará vendas apenas aos funcionários já cadastrados
        </p>
      </div>

      {resultado && (
        <div style={{ 
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#d4edda',
          border: '1px solid #c3e6cb',
          borderRadius: '4px'
        }}>
          <h4>📊 Resultado da Importação:</h4>
          <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
            <li><strong>Registros processados:</strong> {resultado.total_processados}</li>
            <li><strong>Vendas importadas:</strong> {resultado.vendas_importadas}</li>
            <li><strong>Funcionários encontrados:</strong> {resultado.funcionarios_encontrados}</li>
            <li><strong>Funcionários não encontrados:</strong> {resultado.funcionarios_nao_encontrados}</li>
          </ul>
          
          {resultado.erros && resultado.erros.length > 0 && (
            <div style={{ marginTop: '10px' }}>
              <strong>⚠️ Avisos:</strong>
              <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
                {resultado.erros.map((erro, index) => (
                  <li key={index} style={{ color: '#856404' }}>{erro}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImportacaoCSVSimples;


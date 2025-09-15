import React, { useState, useEffect } from 'react';

const CadastroFuncionariosSimples = () => {
  const [funcionarios, setFuncionarios] = useState([]);
  const [lojas, setLojas] = useState([]);
  const [formData, setFormData] = useState({
    nome: '',
    loja_id: '',
    meta_mensal: 2000,
    ativo: true
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchLojas();
    fetchFuncionarios();
  }, []);

  const fetchLojas = async () => {
    try {
      const response = await fetch('/api/lojas');
      if (response.ok) {
        const data = await response.json();
        setLojas(data);
      }
    } catch (error) {
      console.error('Erro ao buscar lojas:', error);
    }
  };

  const fetchFuncionarios = async () => {
    try {
      const response = await fetch('/api/operadores');
      if (response.ok) {
        const data = await response.json();
        setFuncionarios(data);
      }
    } catch (error) {
      console.error('Erro ao buscar funcionários:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/operadores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          loja_id: parseInt(formData.loja_id),
          meta_mensal: parseFloat(formData.meta_mensal)
        })
      });

      if (response.ok) {
        setMessage('✅ Funcionário cadastrado com sucesso!');
        setFormData({
          nome: '',
          loja_id: '',
          meta_mensal: 2000,
          ativo: true
        });
        fetchFuncionarios();
      } else {
        setMessage('❌ Erro ao cadastrar funcionário');
      }
    } catch (error) {
      console.error('Erro:', error);
      setMessage('❌ Erro ao cadastrar funcionário');
    } finally {
      setLoading(false);
    }
  };

  const getLojaName = (lojaId) => {
    const loja = lojas.find(l => l.id === lojaId);
    return loja ? loja.nome : 'N/A';
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>📋 Cadastro de Funcionários - FASE 1</h2>
      
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

      <form onSubmit={handleSubmit} style={{ marginBottom: '30px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label>Nome do Funcionário:</label>
          <input
            type="text"
            value={formData.nome}
            onChange={(e) => setFormData({...formData, nome: e.target.value})}
            required
            style={{ 
              width: '100%', 
              padding: '8px', 
              marginTop: '5px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Loja:</label>
          <select
            value={formData.loja_id}
            onChange={(e) => setFormData({...formData, loja_id: e.target.value})}
            required
            style={{ 
              width: '100%', 
              padding: '8px', 
              marginTop: '5px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          >
            <option value="">Selecione uma loja</option>
            {lojas.map((loja) => (
              <option key={loja.id} value={loja.id}>
                {loja.nome}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Meta Mensal (R$):</label>
          <input
            type="number"
            step="0.01"
            value={formData.meta_mensal}
            onChange={(e) => setFormData({...formData, meta_mensal: e.target.value})}
            style={{ 
              width: '100%', 
              padding: '8px', 
              marginTop: '5px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>
            <input
              type="checkbox"
              checked={formData.ativo}
              onChange={(e) => setFormData({...formData, ativo: e.target.checked})}
              style={{ marginRight: '8px' }}
            />
            Funcionário ativo
          </label>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Salvando...' : 'Cadastrar Funcionário'}
        </button>
      </form>

      <h3>👥 Funcionários Cadastrados</h3>
      {funcionarios.length === 0 ? (
        <p>Nenhum funcionário cadastrado.</p>
      ) : (
        <div>
          {funcionarios.map((funcionario) => (
            <div 
              key={funcionario.id} 
              style={{ 
                border: '1px solid #ddd', 
                padding: '15px', 
                marginBottom: '10px',
                borderRadius: '4px',
                backgroundColor: '#f9f9f9'
              }}
            >
              <h4>{funcionario.nome}</h4>
              <p><strong>Loja:</strong> {getLojaName(funcionario.loja_id)}</p>
              <p><strong>Meta:</strong> R$ {funcionario.meta_mensal?.toFixed(2) || '0,00'}</p>
              <p><strong>Status:</strong> {funcionario.ativo ? '✅ Ativo' : '❌ Inativo'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CadastroFuncionariosSimples;


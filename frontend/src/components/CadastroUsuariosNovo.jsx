import React, { useState, useEffect } from 'react';

const CadastroUsuariosNovo = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [lojas, setLojas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [novoUsuario, setNovoUsuario] = useState({
    nome: '',
    email: '',
    senha: '',
    tipo: 'gerente',
    loja_id: ''
  });
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  useEffect(() => {
    fetchUsuarios();
    fetchLojas();
  }, []);

  const fetchLojas = async () => {
    try {
      const response = await fetch('/api/lojas/simples');
      if (response.ok) {
        const data = await response.json();
        setLojas(data);
      }
    } catch (error) {
      console.error('Erro ao buscar lojas:', error);
    }
  };

  const fetchUsuarios = async () => {
    try {
      const response = await fetch('/api/users');
      if (response.ok) {
        const data = await response.json();
        setUsuarios(data.filter(u => u.tipo !== 'admin')); // Não mostrar admin
      }
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro('');
    setSucesso('');

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(novoUsuario)
      });

      if (response.ok) {
        setSucesso('Usuário criado com sucesso!');
        setNovoUsuario({
          nome: '',
          email: '',
          senha: '',
          tipo: 'gerente',
          loja_id: ''
        });
        fetchUsuarios();
      } else {
        const errorData = await response.json();
        setErro(errorData.error || 'Erro ao criar usuário');
      }
    } catch (error) {
      setErro('Erro ao criar usuário. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (!confirm('Tem certeza que deseja excluir este usuário?')) return;

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setSucesso('Usuário excluído com sucesso!');
        fetchUsuarios();
      } else {
        setErro('Erro ao excluir usuário');
      }
    } catch (error) {
      setErro('Erro ao excluir usuário');
    }
  };

  return (
    <div style={{
      padding: '20px',
      maxWidth: '1000px',
      margin: '0 auto'
    }}>
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '15px',
        padding: '30px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        backdropFilter: 'blur(10px)'
      }}>
        <h2 style={{
          color: '#1976d2',
          marginBottom: '20px',
          fontSize: '24px',
          fontWeight: 'bold'
        }}>
          👤 Gerenciar Usuários
        </h2>
        <p style={{
          color: '#666',
          marginBottom: '30px'
        }}>
          Cadastre gerentes para acessar apenas os dados de suas lojas
        </p>

        {/* Formulário */}
        <form onSubmit={handleSubmit} style={{ marginBottom: '40px' }}>
          <h3 style={{ color: '#1976d2', marginBottom: '20px' }}>Novo Usuário</h3>
          
          {erro && (
            <div style={{
              backgroundColor: '#ffebee',
              color: '#c62828',
              padding: '15px',
              borderRadius: '8px',
              marginBottom: '20px',
              border: '1px solid #ef5350'
            }}>
              ❌ {erro}
            </div>
          )}

          {sucesso && (
            <div style={{
              backgroundColor: '#e8f5e8',
              color: '#2e7d32',
              padding: '15px',
              borderRadius: '8px',
              marginBottom: '20px',
              border: '1px solid #4caf50'
            }}>
              ✅ {sucesso}
            </div>
          )}

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginBottom: '20px'
          }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
                Nome Completo *
              </label>
              <input
                type="text"
                value={novoUsuario.nome}
                onChange={(e) => setNovoUsuario({...novoUsuario, nome: e.target.value})}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
                placeholder="Ex: João Silva"
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
                Email *
              </label>
              <input
                type="email"
                value={novoUsuario.email}
                onChange={(e) => setNovoUsuario({...novoUsuario, email: e.target.value})}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
                placeholder="joao@email.com"
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
                Senha *
              </label>
              <input
                type="password"
                value={novoUsuario.senha}
                onChange={(e) => setNovoUsuario({...novoUsuario, senha: e.target.value})}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
                placeholder="Mínimo 6 caracteres"
                minLength="6"
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
                Loja *
              </label>
              <select
                value={novoUsuario.loja_id}
                onChange={(e) => setNovoUsuario({...novoUsuario, loja_id: e.target.value})}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
              >
                <option value="">Selecione uma loja</option>
                {lojas.map(loja => (
                  <option key={loja.id} value={loja.id}>
                    {loja.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: loading ? '#ccc' : '#1976d2',
              color: 'white',
              border: 'none',
              padding: '15px 30px',
              borderRadius: '25px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 15px rgba(25, 118, 210, 0.3)',
              transition: 'all 0.3s ease'
            }}
          >
            {loading ? '⏳ Criando...' : '✅ Criar Usuário Gerente'}
          </button>
        </form>

        {/* Lista de Usuários */}
        <div>
          <h3 style={{ color: '#1976d2', marginBottom: '20px' }}>Usuários Cadastrados</h3>
          
          {usuarios.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              color: '#666',
              backgroundColor: '#f5f5f5',
              borderRadius: '10px'
            }}>
              📭 Nenhum usuário gerente cadastrado
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gap: '15px'
            }}>
              {usuarios.map(usuario => (
                <div
                  key={usuario.id}
                  style={{
                    backgroundColor: '#f8f9fa',
                    padding: '20px',
                    borderRadius: '10px',
                    border: '1px solid #e0e0e0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>
                      {usuario.nome}
                    </h4>
                    <p style={{ margin: '0 0 5px 0', color: '#666' }}>
                      📧 {usuario.email}
                    </p>
                    <p style={{ margin: 0, color: '#666' }}>
                      🏪 {usuario.loja_nome || 'Loja não definida'}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => handleDelete(usuario.id)}
                    style={{
                      backgroundColor: '#f44336',
                      color: 'white',
                      border: 'none',
                      padding: '8px 15px',
                      borderRadius: '20px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    🗑️ Excluir
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CadastroUsuariosNovo;


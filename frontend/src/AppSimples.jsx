import React, { useState, useEffect } from 'react';
import CadastroFuncionariosSimples from './components/CadastroFuncionariosSimples';
import ImportacaoCSVSimples from './components/ImportacaoCSVSimples';

const AppSimples = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('funcionarios');
  const [loginData, setLoginData] = useState({
    email: 'admin@grandepremioloterias.com.br',
    senha: 'admin123'
  });

  useEffect(() => {
    // Verificar se há token salvo
    const token = localStorage.getItem('token');
    if (token) {
      setUser({ nome: 'Administrador', tipo: 'admin' });
    }
    setLoading(false);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData)
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        setUser(data.user);
      } else {
        alert('Erro no login');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      alert('Erro no login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: '#f5f5f5'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          width: '400px'
        }}>
          <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>
            🏪 Sistema de Vendas - FASE 1
          </h2>
          
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '20px' }}>
              <label>Email:</label>
              <input
                type="email"
                value={loginData.email}
                onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                style={{
                  width: '100%',
                  padding: '10px',
                  marginTop: '5px',
                  border: '1px solid #ccc',
                  borderRadius: '4px'
                }}
                required
              />
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label>Senha:</label>
              <input
                type="password"
                value={loginData.senha}
                onChange={(e) => setLoginData({...loginData, senha: e.target.value})}
                style={{
                  width: '100%',
                  padding: '10px',
                  marginTop: '5px',
                  border: '1px solid #ccc',
                  borderRadius: '4px'
                }}
                required
              />
            </div>
            
            <button 
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '16px',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
          
          <div style={{ 
            marginTop: '20px', 
            padding: '15px', 
            backgroundColor: '#f8f9fa', 
            borderRadius: '4px',
            fontSize: '14px'
          }}>
            <strong>Credenciais de teste:</strong><br/>
            Email: admin@grandepremioloterias.com.br<br/>
            Senha: admin123
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <header style={{
        backgroundColor: '#007bff',
        color: 'white',
        padding: '15px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1>🏪 Sistema de Vendas - FASE 1</h1>
        <div>
          <span style={{ marginRight: '15px' }}>Olá, {user.nome}</span>
          <button 
            onClick={handleLogout}
            style={{
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              padding: '8px 15px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Sair
          </button>
        </div>
      </header>
      
      <nav style={{
        backgroundColor: '#f8f9fa',
        padding: '10px 20px',
        borderBottom: '1px solid #dee2e6'
      }}>
        <button
          onClick={() => setActiveTab('funcionarios')}
          style={{
            backgroundColor: activeTab === 'funcionarios' ? '#007bff' : 'transparent',
            color: activeTab === 'funcionarios' ? 'white' : '#007bff',
            border: '1px solid #007bff',
            padding: '8px 16px',
            marginRight: '10px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          👥 Funcionários
        </button>
        <button
          onClick={() => setActiveTab('importacao')}
          style={{
            backgroundColor: activeTab === 'importacao' ? '#007bff' : 'transparent',
            color: activeTab === 'importacao' ? 'white' : '#007bff',
            border: '1px solid #007bff',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          📁 Importar CSV
        </button>
      </nav>
      
      <main>
        {activeTab === 'funcionarios' && <CadastroFuncionariosSimples />}
        {activeTab === 'importacao' && <ImportacaoCSVSimples />}
      </main>
    </div>
  );
};

export default AppSimples;


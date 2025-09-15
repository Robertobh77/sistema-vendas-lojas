import React, { useState, useEffect } from 'react';
import CadastroFuncionariosSimples from './components/CadastroFuncionariosSimples';
import ImportacaoCSVSimples from './components/ImportacaoCSVSimples';
import DashboardBonito from './components/DashboardBonito';
import CadastroUsuariosNovo from './components/CadastroUsuariosNovo';

const AppSimples = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
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
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 50%, #90caf9 100%)'
    }}>
      <header style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        padding: '15px 20px',
        boxShadow: '0 2px 20px rgba(0,0,0,0.1)',
        borderBottom: '1px solid rgba(255,255,255,0.2)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <img 
              src="/logofundobranco.png" 
              alt="Grande Prêmio" 
              style={{ 
                height: '50px',
                width: 'auto'
              }} 
            />
            <div>
              <h1 style={{
                margin: 0,
                color: '#1976d2',
                fontSize: 'clamp(18px, 3vw, 24px)',
                fontWeight: 'bold'
              }}>
                Sistema de Vendas
              </h1>
              <p style={{
                margin: 0,
                color: '#666',
                fontSize: 'clamp(12px, 2vw, 14px)'
              }}>
                Acompanhamento de Performance
              </p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ 
              color: '#1976d2', 
              fontSize: 'clamp(14px, 2.5vw, 16px)',
              fontWeight: '500'
            }}>
              Olá, {user?.nome || 'Administrador'}
            </span>
            <button 
              onClick={handleLogout}
              style={{
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '25px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                boxShadow: '0 4px 15px rgba(244, 67, 54, 0.3)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(244, 67, 54, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(244, 67, 54, 0.3)';
              }}
            >
              Sair
            </button>
          </div>
        </div>
      </header>
      
      <nav style={{
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        padding: '10px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.3)',
        overflowX: 'auto'
      }}>
        <div style={{
          display: 'flex',
          gap: '10px',
          minWidth: 'max-content'
        }}>
          <button
            onClick={() => setActiveTab('dashboard')}
            style={{
              backgroundColor: activeTab === 'dashboard' ? '#007bff' : 'transparent',
              color: activeTab === 'dashboard' ? 'white' : '#007bff',
              border: '1px solid #007bff',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            📊 Dashboard
          </button>
          {user?.tipo === 'admin' && (
            <>
              <button
                onClick={() => setActiveTab('funcionarios')}
                style={{
                  backgroundColor: activeTab === 'funcionarios' ? '#007bff' : 'transparent',
                  color: activeTab === 'funcionarios' ? 'white' : '#007bff',
                  border: '1px solid #007bff',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
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
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                📁 Importar CSV
              </button>
              <button
                onClick={() => setActiveTab('usuarios')}
                style={{
                  backgroundColor: activeTab === 'usuarios' ? '#007bff' : 'transparent',
                  color: activeTab === 'usuarios' ? 'white' : '#007bff',
                  border: '1px solid #007bff',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                🔐 Usuários
              </button>
            </>
          )}
        </div>
      </nav>
      
      <main>
        {activeTab === 'dashboard' && <DashboardBonito user={user} />}
        {activeTab === 'funcionarios' && user?.tipo === 'admin' && <CadastroFuncionariosSimples />}
        {activeTab === 'importacao' && user?.tipo === 'admin' && <ImportacaoCSVSimples />}
        {activeTab === 'usuarios' && user?.tipo === 'admin' && <CadastroUsuariosNovo />}
      </main>
    </div>
  );
};

export default AppSimples;


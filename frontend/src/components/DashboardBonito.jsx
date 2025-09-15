import React, { useState, useEffect } from 'react';

const DashboardBonito = ({ user }) => {
  const [dados, setDados] = useState({
    funcionarios: [],
    resumo: {
      totalVendas: 0,
      totalFuncionarios: 0,
      metaTotal: 0,
      percentualGeral: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [filtroLoja, setFiltroLoja] = useState('');
  const [lojas, setLojas] = useState([]);

  useEffect(() => {
    fetchDados();
    fetchLojas();
    
    // Se for gerente, filtrar automaticamente pela sua loja
    if (user?.tipo === 'gerente' && user?.loja_nome) {
      setFiltroLoja(user.loja_nome);
    }
  }, [user]);

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

  const fetchDados = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/operadores/simples');
      if (response.ok) {
        const funcionarios = await response.json();
        
        // Calcular resumo
        const totalVendas = funcionarios.reduce((sum, f) => sum + (f.vendas_total || 0), 0);
        const totalFuncionarios = funcionarios.length;
        const metaTotal = funcionarios.reduce((sum, f) => sum + (f.meta_mensal || 0), 0);
        const percentualGeral = metaTotal > 0 ? (totalVendas / metaTotal) * 100 : 0;

        setDados({
          funcionarios,
          resumo: {
            totalVendas,
            totalFuncionarios,
            metaTotal,
            percentualGeral
          }
        });
      }
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor || 0);
  };

  const getStatusColor = (percentual) => {
    if (percentual >= 100) return '#28a745'; // Verde
    if (percentual >= 80) return '#ffc107';  // Amarelo
    return '#dc3545'; // Vermelho
  };

  const getStatusText = (percentual) => {
    if (percentual >= 100) return 'Meta Atingida';
    if (percentual >= 80) return 'Próximo da Meta';
    return 'Abaixo da Meta';
  };

  const funcionariosFiltrados = filtroLoja 
    ? dados.funcionarios.filter(f => f.loja_nome === filtroLoja)
    : dados.funcionarios;

  // Recalcular resumo baseado no filtro
  const resumoFiltrado = {
    totalVendas: funcionariosFiltrados.reduce((sum, f) => sum + (f.vendas_total || 0), 0),
    totalFuncionarios: funcionariosFiltrados.length,
    metaTotal: funcionariosFiltrados.reduce((sum, f) => sum + (f.meta_mensal || 0), 0),
    percentualGeral: 0
  };
  resumoFiltrado.percentualGeral = resumoFiltrado.metaTotal > 0 
    ? (resumoFiltrado.totalVendas / resumoFiltrado.metaTotal) * 100 
    : 0;

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '400px',
        fontSize: '18px',
        color: '#666'
      }}>
        ⏳ Carregando dashboard...
      </div>
    );
  }

  return (
    <div style={{
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        marginBottom: '30px',
        textAlign: 'center'
      }}>
        <h1 style={{
          color: '#2c3e50',
          marginBottom: '10px',
          fontSize: 'clamp(24px, 4vw, 32px)'
        }}>
          📊 Dashboard de Performance
        </h1>
        <p style={{
          color: '#7f8c8d',
          fontSize: 'clamp(14px, 2.5vw, 16px)'
        }}>
          Acompanhe o desempenho de vendas em tempo real
        </p>
      </div>

      {/* Filtro - apenas para admin */}
      {user?.tipo === 'admin' && (
        <div style={{
          marginBottom: '30px',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <select
            value={filtroLoja}
            onChange={(e) => setFiltroLoja(e.target.value)}
            style={{
              padding: '12px 20px',
              borderRadius: '25px',
              border: '2px solid #3498db',
              fontSize: '16px',
              backgroundColor: 'white',
              color: '#2c3e50',
              cursor: 'pointer',
              minWidth: '200px'
            }}
          >
            <option value="">🏪 Todas as Lojas</option>
            {lojas.map(loja => (
              <option key={loja.id} value={loja.nome}>
                {loja.nome}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Cards de Resumo */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '25px',
        marginBottom: '40px'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '30px',
          borderRadius: '20px',
          boxShadow: '0 15px 35px rgba(102, 126, 234, 0.3)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '100px',
            height: '100px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '50%'
          }} />
          <div style={{ fontSize: '48px', marginBottom: '15px' }}>💰</div>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '20px', fontWeight: '600' }}>Total de Vendas</h3>
          <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold' }}>
            {formatarMoeda(resumoFiltrado.totalVendas)}
          </p>
          <div style={{ 
            marginTop: '10px', 
            fontSize: '14px', 
            opacity: 0.9 
          }}>
            {filtroLoja ? `Loja: ${filtroLoja}` : 'Todas as lojas'}
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          color: 'white',
          padding: '30px',
          borderRadius: '20px',
          boxShadow: '0 15px 35px rgba(240, 147, 251, 0.3)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '100px',
            height: '100px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '50%'
          }} />
          <div style={{ fontSize: '48px', marginBottom: '15px' }}>👥</div>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '20px', fontWeight: '600' }}>Funcionários Ativos</h3>
          <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold' }}>
            {resumoFiltrado.totalFuncionarios}
          </p>
          <div style={{ 
            marginTop: '10px', 
            fontSize: '14px', 
            opacity: 0.9 
          }}>
            {filtroLoja ? `Loja: ${filtroLoja}` : 'Todas as lojas'}
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          color: 'white',
          padding: '30px',
          borderRadius: '20px',
          boxShadow: '0 15px 35px rgba(79, 172, 254, 0.3)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '100px',
            height: '100px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '50%'
          }} />
          <div style={{ fontSize: '48px', marginBottom: '15px' }}>🎯</div>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '20px', fontWeight: '600' }}>Meta Total</h3>
          <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold' }}>
            {formatarMoeda(resumoFiltrado.metaTotal)}
          </p>
          <div style={{ 
            marginTop: '10px', 
            fontSize: '14px', 
            opacity: 0.9 
          }}>
            {filtroLoja ? `Loja: ${filtroLoja}` : 'Todas as lojas'}
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          color: 'white',
          padding: '30px',
          borderRadius: '20px',
          boxShadow: '0 15px 35px rgba(67, 233, 123, 0.3)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '100px',
            height: '100px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '50%'
          }} />
          <div style={{ fontSize: '48px', marginBottom: '15px' }}>📈</div>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '20px', fontWeight: '600' }}>Performance</h3>
          <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold' }}>
            {resumoFiltrado.percentualGeral.toFixed(1)}%
          </p>
          <div style={{ 
            marginTop: '10px', 
            fontSize: '14px', 
            opacity: 0.9 
          }}>
            {getStatusText(resumoFiltrado.percentualGeral)}
          </div>
        </div>
      </div>

      {/* Lista de Funcionários */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '15px',
        boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '20px',
          textAlign: 'center'
        }}>
          <h2 style={{ margin: 0, fontSize: 'clamp(18px, 3vw, 24px)' }}>
            🏆 Ranking de Performance
          </h2>
        </div>

        <div style={{ padding: '20px' }}>
          {funcionariosFiltrados.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              color: '#7f8c8d',
              fontSize: '18px'
            }}>
              📭 Nenhum funcionário encontrado
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gap: '15px'
            }}>
              {funcionariosFiltrados.map((funcionario, index) => {
                const percentual = funcionario.meta_mensal > 0 
                  ? ((funcionario.vendas_total || 0) / funcionario.meta_mensal) * 100 
                  : 0;

                return (
                  <div
                    key={funcionario.id}
                    style={{
                      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                      borderRadius: '12px',
                      padding: '20px',
                      border: '1px solid #dee2e6',
                      transition: 'transform 0.2s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'auto 1fr auto',
                      alignItems: 'center',
                      gap: '15px'
                    }}>
                      {/* Posição */}
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: index < 3 
                          ? 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)'
                          : 'linear-gradient(135deg, #6c757d 0%, #adb5bd 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '16px'
                      }}>
                        {index + 1}
                      </div>

                      {/* Informações */}
                      <div>
                        <h3 style={{
                          margin: '0 0 5px 0',
                          color: '#2c3e50',
                          fontSize: 'clamp(16px, 2.5vw, 20px)'
                        }}>
                          {funcionario.nome}
                        </h3>
                        <p style={{
                          margin: '0 0 10px 0',
                          color: '#7f8c8d',
                          fontSize: 'clamp(12px, 2vw, 14px)'
                        }}>
                          🏪 {funcionario.loja_nome || 'Loja não definida'}
                        </p>
                        
                        {/* Barra de Progresso */}
                        <div style={{
                          backgroundColor: '#e9ecef',
                          borderRadius: '10px',
                          height: '8px',
                          overflow: 'hidden',
                          marginBottom: '5px'
                        }}>
                          <div style={{
                            width: `${Math.min(percentual, 100)}%`,
                            height: '100%',
                            backgroundColor: getStatusColor(percentual),
                            borderRadius: '10px',
                            transition: 'width 0.3s ease'
                          }} />
                        </div>
                        
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontSize: 'clamp(11px, 1.8vw, 13px)',
                          color: '#6c757d'
                        }}>
                          <span>{formatarMoeda(funcionario.vendas_total || 0)}</span>
                          <span>{formatarMoeda(funcionario.meta_mensal || 0)}</span>
                        </div>
                      </div>

                      {/* Status */}
                      <div style={{ textAlign: 'right' }}>
                        <div style={{
                          backgroundColor: getStatusColor(percentual),
                          color: 'white',
                          padding: '8px 12px',
                          borderRadius: '20px',
                          fontSize: 'clamp(11px, 1.8vw, 13px)',
                          fontWeight: 'bold',
                          marginBottom: '5px'
                        }}>
                          {percentual.toFixed(1)}%
                        </div>
                        <div style={{
                          fontSize: 'clamp(10px, 1.6vw, 12px)',
                          color: getStatusColor(percentual),
                          fontWeight: 'bold'
                        }}>
                          {getStatusText(percentual)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        textAlign: 'center',
        marginTop: '40px',
        padding: '20px',
        color: '#7f8c8d',
        fontSize: 'clamp(12px, 2vw, 14px)'
      }}>
        📊 Dashboard atualizado em tempo real • Sistema de Vendas FASE 3
      </div>
    </div>
  );
};

export default DashboardBonito;


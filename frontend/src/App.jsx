import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import OperadoresTable from './components/OperadoresTable';
import LojasOverview from './components/LojasOverview';
import UploadCSV from './components/UploadCSV';
import CadastroUsuarios from './components/CadastroUsuarios';
import { TrendingUp, Users, Store, Upload, UserPlus, LogOut } from 'lucide-react';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [forceLogin, setForceLogin] = useState(false);

  useEffect(() => {
    // Simular loading inicial
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setForceLogin(false);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    // Limpar tudo
    localStorage.clear();
    sessionStorage.clear();
    setUser(null);
    setForceLogin(true);
    setActiveTab('dashboard');
    
    // Forçar reload da página para garantir limpeza completa
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Carregando Sistema de Vendas...</p>
        </div>
      </div>
    );
  }

  // Se não há usuário logado OU forceLogin é true, mostrar tela de login
  if (!user || forceLogin) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header com botão sair sempre visível */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-blue-600 mr-3" />
                <h1 className="text-xl font-semibold text-gray-900">
                  Sistema de Acompanhamento de Vendas
                </h1>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
              >
                <LogOut className="h-4 w-4" />
                <span>Limpar e Sair</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Tela de Login */}
        <div className="flex items-center justify-center py-12">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Acesso ao Sistema
              </h1>
              <p className="text-gray-600">
                Faça login para acessar o sistema de vendas
              </p>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800 font-medium">Credenciais de Teste:</p>
                <p className="text-sm text-blue-700">Email: admin@grandepremioloterias.com.br</p>
                <p className="text-sm text-blue-700">Senha: admin123</p>
              </div>
            </div>
            <Login onLogin={handleLogin} />
          </div>
        </div>
      </div>
    );
  }

  // Sistema logado - mostrar dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">
                Sistema de Acompanhamento de Vendas
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Olá, <span className="font-medium">{user.nome}</span>
                {user.tipo === 'admin' && (
                  <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    Admin
                  </span>
                )}
                {user.tipo === 'gerente' && (
                  <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    Gerente
                  </span>
                )}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
              >
                <LogOut className="h-4 w-4" />
                <span>Sair</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-5 mb-8">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="operadores" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Operadores</span>
            </TabsTrigger>
            <TabsTrigger value="lojas" className="flex items-center space-x-2">
              <Store className="h-4 w-4" />
              <span className="hidden sm:inline">Lojas</span>
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center space-x-2">
              <Upload className="h-4 w-4" />
              <span className="hidden sm:inline">Upload CSV</span>
            </TabsTrigger>
            {user.tipo === 'admin' && (
              <TabsTrigger value="usuarios" className="flex items-center space-x-2">
                <UserPlus className="h-4 w-4" />
                <span className="hidden sm:inline">Usuários</span>
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <Dashboard user={user} />
          </TabsContent>

          <TabsContent value="operadores" className="space-y-6">
            <OperadoresTable user={user} />
          </TabsContent>

          <TabsContent value="lojas" className="space-y-6">
            <LojasOverview user={user} />
          </TabsContent>

          <TabsContent value="upload" className="space-y-6">
            <UploadCSV user={user} />
          </TabsContent>

          {user.tipo === 'admin' && (
            <TabsContent value="usuarios" className="space-y-6">
              <CadastroUsuarios user={user} />
            </TabsContent>
          )}
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="text-center text-sm text-gray-500">
            <p>Sistema de Acompanhamento de Vendas - Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;


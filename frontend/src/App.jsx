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

  useEffect(() => {
    // Simular loading inicial
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setActiveTab('dashboard');
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

  // Se não há usuário logado, mostrar tela de login
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Sistema de Vendas
            </h1>
            <p className="text-gray-600">
              Faça login para acessar o sistema
            </p>
          </div>
          <Login onLogin={handleLogin} />
        </div>
      </div>
    );
  }

  // Determinar abas disponíveis baseado no tipo de usuário
  const availableTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'operadores', label: 'Operadores', icon: Users },
    { id: 'lojas', label: 'Lojas', icon: Store },
    { id: 'upload', label: 'Upload CSV', icon: Upload },
  ];

  // Adicionar aba de usuários apenas para admin
  if (user.tipo === 'admin') {
    availableTabs.push({ id: 'usuarios', label: 'Usuários', icon: UserPlus });
  }

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
                className="flex items-center space-x-2"
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
            {availableTabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex items-center space-x-2"
              >
                <tab.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
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


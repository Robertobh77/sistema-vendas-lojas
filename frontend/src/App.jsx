import React, { useState, useEffect } from 'react';
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
    // Verificar se há token salvo
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
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
              <div className="text-sm text-gray-500">
                Bem-vindo, {user.nome} ({user.tipo === 'admin' ? 'Administrador' : 'Gerente'})
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className={`grid w-full grid-cols-${availableTabs.length} bg-transparent h-12`}>
              {availableTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <TabsTrigger 
                    key={tab.id}
                    value={tab.id}
                    className="flex items-center space-x-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <TabsContent value="dashboard">
                <Dashboard user={user} />
              </TabsContent>

              <TabsContent value="operadores">
                <div className="space-y-6">
                  <div className="flex items-center space-x-2">
                    <Users className="h-6 w-6 text-blue-600" />
                    <h2 className="text-2xl font-bold text-gray-900">Acompanhamento por Operador</h2>
                  </div>
                  <OperadoresTable user={user} />
                </div>
              </TabsContent>

              <TabsContent value="lojas">
                <LojasOverview user={user} />
              </TabsContent>

              <TabsContent value="upload">
                <UploadCSV user={user} />
              </TabsContent>

              {user.tipo === 'admin' && (
                <TabsContent value="usuarios">
                  <CadastroUsuarios user={user} />
                </TabsContent>
              )}
            </main>
          </Tabs>
        </div>
      </nav>
    </div>
  );
}

export default App;

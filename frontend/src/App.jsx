import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import OperadoresTable from './components/OperadoresTable';
import LojasOverview from './components/LojasOverview';
import UploadCSV from './components/UploadCSV';
import { TrendingUp, Users, Store, Upload } from 'lucide-react';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

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
                Última atualização: {new Date().toLocaleDateString('pt-BR')}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-transparent h-12">
              <TabsTrigger 
                value="dashboard" 
                className="flex items-center space-x-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600"
              >
                <TrendingUp className="h-4 w-4" />
                <span>Dashboard</span>
              </TabsTrigger>
              <TabsTrigger 
                value="operadores"
                className="flex items-center space-x-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600"
              >
                <Users className="h-4 w-4" />
                <span>Operadores</span>
              </TabsTrigger>
              <TabsTrigger 
                value="lojas"
                className="flex items-center space-x-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600"
              >
                <Store className="h-4 w-4" />
                <span>Lojas</span>
              </TabsTrigger>
              <TabsTrigger 
                value="upload"
                className="flex items-center space-x-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600"
              >
                <Upload className="h-4 w-4" />
                <span>Upload CSV</span>
              </TabsTrigger>
            </TabsList>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <TabsContent value="dashboard">
                <Dashboard />
              </TabsContent>

              <TabsContent value="operadores">
                <div className="space-y-6">
                  <div className="flex items-center space-x-2">
                    <Users className="h-6 w-6 text-blue-600" />
                    <h2 className="text-2xl font-bold text-gray-900">Acompanhamento por Operador</h2>
                  </div>
                  <OperadoresTable />
                </div>
              </TabsContent>

              <TabsContent value="lojas">
                <LojasOverview />
              </TabsContent>

              <TabsContent value="upload">
                <UploadCSV />
              </TabsContent>
            </main>
          </Tabs>
        </div>
      </nav>
    </div>
  );
}

export default App;

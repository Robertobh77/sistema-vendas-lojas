import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { lojasAPI } from '@/lib/api';
import { Store, Users, Target, TrendingUp, Plus, Settings } from 'lucide-react';
import CadastroLojas from './CadastroLojas';

const LojasOverview = ({ user }) => {
  const [lojas, setLojas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchLojas();
  }, []);

  const fetchLojas = async () => {
    try {
      setLoading(true);
      const response = await lojasAPI.getAll();
      setLojas(response.data);
    } catch (error) {
      console.error('Erro ao buscar lojas:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusColor = (percentual) => {
    if (percentual >= 100) return 'text-green-600';
    if (percentual >= 80) return 'text-orange-600';
    return 'text-red-600';
  };

  const getStatusBadge = (status) => {
    if (status === 'Meta Atingida') {
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Meta Atingida</Badge>;
    } else if (status === 'Próxima da Meta') {
      return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Próxima da Meta</Badge>;
    } else {
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Abaixo da Meta</Badge>;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Visão Geral por Loja</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <Store className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">Gestão de Lojas</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <span>Visão Geral</span>
          </TabsTrigger>
          <TabsTrigger value="manage" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Gerenciar Lojas</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          {loading ? (
            <Card>
              <CardContent>
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {lojas.map((loja) => (
                <Card key={loja.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Store className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">{loja.nome}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                            <div className="flex items-center space-x-1">
                              <Users className="h-4 w-4" />
                              <span>{loja.vendedores_count} vendedores</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Target className="h-4 w-4" />
                              <span>Meta: {formatCurrency(loja.meta_total)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${getStatusColor(loja.percentual)}`}>
                          {loja.percentual}%
                        </div>
                        {getStatusBadge(loja.status)}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {formatCurrency(loja.vendas_total)} de {formatCurrency(loja.meta_total)}
                        </span>
                        <span className="text-gray-600">
                          Faltam {formatCurrency(loja.valor_faltante)}
                        </span>
                      </div>
                      
                      <div className="relative">
                        <Progress 
                          value={Math.min(loja.percentual, 100)} 
                          className="h-3"
                        />
                        {loja.percentual > 100 && (
                          <div className="absolute right-0 top-0 h-3 bg-green-500 rounded-r-full" 
                               style={{ width: `${Math.min((loja.percentual - 100) / 2, 20)}%` }}>
                          </div>
                        )}
                      </div>
                    </div>

                    {loja.percentual >= 100 && (
                      <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center space-x-2 text-green-800">
                          <TrendingUp className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            Meta superada em {formatCurrency(loja.vendas_total - loja.meta_total)}!
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}

              {lojas.length === 0 && (
                <Card>
                  <CardContent className="text-center py-12">
                    <Store className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma loja encontrada</h3>
                    <p className="text-gray-500">
                      Faça upload de um arquivo CSV para começar a visualizar os dados das lojas.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="manage" className="mt-6">
          <CadastroLojas user={user} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LojasOverview;


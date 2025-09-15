import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { operadoresAPI } from '@/lib/api';
import { ArrowUpDown, TrendingUp, TrendingDown, Users, Settings } from 'lucide-react';
import CadastroFuncionarios from './CadastroFuncionarios';

const OperadoresTable = ({ user }) => {
  const [operadores, setOperadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState('percentual');
  const [sortDirection, setSortDirection] = useState('desc');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchOperadores();
  }, []);

  const fetchOperadores = async () => {
    try {
      setLoading(true);
      const response = await operadoresAPI.getAll();
      setOperadores(response.data);
    } catch (error) {
      console.error('Erro ao buscar operadores:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedOperadores = [...operadores].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const getStatusBadge = (status, percentual) => {
    if (status === 'Meta Atingida') {
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Meta Atingida</Badge>;
    } else if (status === 'Próxima da Meta') {
      return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Próxima da Meta</Badge>;
    } else {
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Abaixo da Meta</Badge>;
    }
  };

  const getPercentualColor = (percentual) => {
    if (percentual >= 100) return 'text-green-600';
    if (percentual >= 80) return 'text-orange-600';
    return 'text-red-600';
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (loading) {
    return (
      <Card>
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
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <span>Acompanhamento</span>
          </TabsTrigger>
          <TabsTrigger value="manage" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Gerenciar Funcionários</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Acompanhamento de Vendas por Operador</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th 
                        className="text-left p-3 cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSort('nome')}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Operador</span>
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </th>
                      <th 
                        className="text-left p-3 cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSort('loja')}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Loja</span>
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </th>
                      <th 
                        className="text-left p-3 cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSort('meta_mensal')}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Meta Mensal</span>
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </th>
                      <th 
                        className="text-left p-3 cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSort('tarifa_acumulada')}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Tarifa Acumulada</span>
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </th>
                      <th 
                        className="text-left p-3 cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSort('percentual')}
                      >
                        <div className="flex items-center space-x-1">
                          <span>% da Meta</span>
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </th>
                      <th className="text-left p-3">Progresso</th>
                      <th className="text-left p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedOperadores.map((operador) => (
                      <tr key={operador.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-medium">{operador.nome}</td>
                        <td className="p-3">{operador.loja}</td>
                        <td className="p-3">{formatCurrency(operador.meta_mensal)}</td>
                        <td className="p-3">{formatCurrency(operador.tarifa_acumulada)}</td>
                        <td className="p-3">
                          <div className="flex items-center space-x-2">
                            <span className={`font-semibold ${getPercentualColor(operador.percentual)}`}>
                              {operador.percentual}%
                            </span>
                            {operador.percentual > 100 ? (
                              <TrendingUp className="h-4 w-4 text-green-600" />
                            ) : operador.percentual < 50 ? (
                              <TrendingDown className="h-4 w-4 text-red-600" />
                            ) : null}
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="w-24">
                            <Progress 
                              value={Math.min(operador.percentual, 100)} 
                              className="h-2"
                            />
                          </div>
                        </td>
                        <td className="p-3">
                          {getStatusBadge(operador.status, operador.percentual)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {operadores.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Nenhum operador encontrado. Faça upload de um arquivo CSV para começar.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage" className="mt-6">
          <CadastroFuncionarios user={user} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OperadoresTable;


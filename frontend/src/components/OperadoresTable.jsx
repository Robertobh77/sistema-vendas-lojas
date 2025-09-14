import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { operadoresAPI } from '@/lib/api';
import { ArrowUpDown, TrendingUp, TrendingDown } from 'lucide-react';

const OperadoresTable = () => {
  const [operadores, setOperadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState('percentual');
  const [sortDirection, setSortDirection] = useState('desc');

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
      return <Badge variant="secondary">Abaixo da Meta</Badge>;
    }
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
        <CardHeader>
          <CardTitle>Acompanhamento de Vendas por Operador</CardTitle>
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
                      <span className={`font-semibold ${
                        operador.percentual >= 100 ? 'text-green-600' : 
                        operador.percentual >= 80 ? 'text-orange-600' : 'text-gray-600'
                      }`}>
                        {operador.percentual}%
                      </span>
                      {operador.percentual >= 100 ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="w-32">
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
  );
};

export default OperadoresTable;


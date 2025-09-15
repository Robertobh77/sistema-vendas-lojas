import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import OperadoresTable from './OperadoresTable';
import LojasOverview from './LojasOverview';
import { vendasAPI, operadoresAPI, lojasAPI } from '@/lib/api';
import { TrendingUp, Users, Store, DollarSign, Target } from 'lucide-react';

const Dashboard = ({ user }) => {
  const [stats, setStats] = useState({
    totalOperadores: 0,
    totalLojas: 0,
    totalVendas: 0,
    metaTotal: 0,
    percentualGeral: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Buscar dados em paralelo
      const [operadoresRes, lojasRes, vendasRes] = await Promise.all([
        operadoresAPI.getAll(),
        lojasAPI.getAll(),
        vendasAPI.getResumo()
      ]);

      const operadores = operadoresRes.data;
      const lojas = lojasRes.data;
      const vendas = vendasRes.data;

      // Calcular estatísticas
      const totalOperadores = operadores.length;
      const totalLojas = lojas.length;
      const totalVendas = vendas.total_valor_venda || 0;
      const metaTotal = operadores.reduce((sum, op) => sum + (op.meta_mensal || 0), 0);
      const percentualGeral = metaTotal > 0 ? (totalVendas / metaTotal * 100) : 0;

      setStats({
        totalOperadores,
        totalLojas,
        totalVendas,
        metaTotal,
        percentualGeral: Math.round(percentualGeral * 10) / 10
      });
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
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

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          </div>
          <div className={`p-3 rounded-full ${color.replace('text-', 'bg-').replace('-600', '-100')}`}>
            <Icon className={`h-6 w-6 ${color}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total de Operadores"
          value={stats.totalOperadores}
          icon={Users}
          color="text-blue-600"
        />
        <StatCard
          title="Total de Lojas"
          value={stats.totalLojas}
          icon={Store}
          color="text-green-600"
        />
        <StatCard
          title="Vendas Totais"
          value={formatCurrency(stats.totalVendas)}
          icon={DollarSign}
          color="text-purple-600"
        />
        <StatCard
          title="Performance Geral"
          value={`${stats.percentualGeral}%`}
          icon={Target}
          color={stats.percentualGeral >= 100 ? "text-green-600" : stats.percentualGeral >= 80 ? "text-orange-600" : "text-red-600"}
          subtitle={`Meta: ${formatCurrency(stats.metaTotal)}`}
        />
      </div>

      {/* Tabs com Conteúdo */}
      <Tabs defaultValue="operadores" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="operadores" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Acompanhamento por Operador</span>
          </TabsTrigger>
          <TabsTrigger value="lojas" className="flex items-center space-x-2">
            <Store className="h-4 w-4" />
            <span>Visão Geral por Loja</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="operadores">
          <OperadoresTable />
        </TabsContent>

        <TabsContent value="lojas">
          <LojasOverview />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;


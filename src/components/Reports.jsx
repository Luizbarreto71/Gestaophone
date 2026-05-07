import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  TrendingUp,
  DollarSign,
  Package,
  Users
} from 'lucide-react';
import { Card, MetricCard } from './ui/Card';
import { formatCurrency } from '../lib/utils';
import { monthlyTrendData } from '../data/mockData';

const performanceData = [
  { month: 'Jan', target: 120000, actual: 125000 },
  { month: 'Fev', target: 130000, actual: 142000 },
  { month: 'Mar', target: 140000, actual: 158000 },
  { month: 'Abr', target: 150000, actual: 148000 },
  { month: 'Mai', target: 160000, actual: 175000 },
  { month: 'Jun', target: 170000, actual: 189000 }
];

const categoryPerformance = [
  { name: 'Smartphone', value: 45, color: '#2563eb' },
  { name: 'Tablet', value: 20, color: '#059669' },
  { name: 'Smartwatch', value: 15, color: '#d97706' },
  { name: 'Fones', value: 12, color: '#8b5cf6' },
  { name: 'Acessórios', value: 8, color: '#6b7280' }
];

export function Reports({ products }) {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-navy-900 mb-1">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-xs text-gray-500">
              <span style={{ color: entry.color }} className="font-medium">
                {entry.name}:
              </span>{' '}
              {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-surface border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-navy-900">{data.name}</p>
          <p className="text-xs text-gray-500">
            Participação: {data.value}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-navy-900">Relatórios Analíticos</h2>
        <p className="text-sm text-gray-500 mt-1">
          Análise completa de desempenho e métricas
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={TrendingUp}
          title="Crescimento Mensal"
          value="+15.3%"
          subtitle="Comparado ao mês anterior"
          trend="5.2%"
          trendUp={true}
        />
        <MetricCard
          icon={DollarSign}
          title="Ticket Médio"
          value={formatCurrency(4850)}
          subtitle="Por transação"
          trend="8.1%"
          trendUp={true}
        />
        <MetricCard
          icon={Package}
          title="Giro de Estoque"
          value="2.4x"
          subtitle="Média mensal"
          trend="0.3x"
          trendUp={true}
        />
        <MetricCard
          icon={Users}
          title="Clientes Ativos"
          value="156"
          subtitle="Últimos 30 dias"
          trend="12"
          trendUp={true}
        />
      </div>

      {/* Performance vs Target */}
      <Card>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-navy-900">Performance vs Meta</h3>
          <p className="text-sm text-gray-500">Comparativo mensal de vendas</p>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} tickLine={false} />
              <YAxis 
                stroke="#94A3B8" 
                fontSize={12} 
                tickLine={false}
                tickFormatter={(value) => `R$${(value/1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="target" name="Meta" fill="#CBD5E1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="actual" name="Realizado" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Performance */}
        <Card>
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-navy-900">Performance por Categoria</h3>
            <p className="text-sm text-gray-500">Distribuição de vendas</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryPerformance}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                  labelLine={{ stroke: '#CBD5E1', strokeWidth: 1 }}
                >
                  {categoryPerformance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {categoryPerformance.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full flex-shrink-0" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs text-gray-500 truncate">{item.name}</span>
                <span className="text-xs text-navy-900 ml-auto font-medium">{item.value}%</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Products */}
        <Card>
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-navy-900">Produtos Mais Vendidos</h3>
            <p className="text-sm text-gray-500">Ranking mensal</p>
          </div>
          <div className="space-y-4">
            {products.slice(0, 5).map((product, index) => (
              <div key={product.id} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary-600">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-navy-900">{product.name}</p>
                  <p className="text-xs text-gray-400">{product.brand}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-emerald-600">
                    {formatCurrency(product.salePrice)}
                  </p>
                  <p className="text-xs text-gray-400">{product.quantity} un.</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Monthly Trend */}
      <Card>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-navy-900">Tendência de Receita e Custos</h3>
          <p className="text-sm text-gray-500">Evolução semestral</p>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} tickLine={false} />
              <YAxis 
                stroke="#94A3B8" 
                fontSize={12} 
                tickLine={false}
                tickFormatter={(value) => `R$${(value/1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                name="Receita"
                stroke="#2563eb"
                strokeWidth={3}
                dot={{ r: 4, fill: '#2563eb', strokeWidth: 2 }}
                activeDot={{ r: 6, fill: '#2563eb' }}
              />
              <Line
                type="monotone"
                dataKey="costs"
                name="Custos"
                stroke="#d97706"
                strokeWidth={3}
                dot={{ r: 4, fill: '#d97706', strokeWidth: 2 }}
                activeDot={{ r: 6, fill: '#d97706' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
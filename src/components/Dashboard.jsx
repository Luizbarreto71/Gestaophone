import {
  LineChart,
  Line,
  AreaChart,
  Area,
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
  DollarSign,
  TrendingUp,
  AlertTriangle,
  PieChart as PieChartIcon,
  Package
} from 'lucide-react';
import { Card, MetricCard } from './ui/Card';
import { formatCurrency } from '../lib/utils';
import { calculateMetrics, weeklySalesData, stockTurnoverData, monthlyTrendData } from '../data/mockData';

export function Dashboard({ products }) {
  const metrics = calculateMetrics(products, weeklySalesData);

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
            Giro: {data.value}%
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
        <h2 className="text-2xl font-bold text-navy-900">Dashboard de B.I.</h2>
        <p className="text-sm text-gray-500 mt-1">
          Visão geral de desempenho e métricas da loja
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={Package}
          title="Total em Estoque"
          value={formatCurrency(metrics.totalStockValue)}
          subtitle={`${products.length} produtos cadastrados`}
          trend="12.5%"
          trendUp={true}
        />
        <MetricCard
          icon={DollarSign}
          title="Vendas do Mês"
          value={formatCurrency(metrics.totalSales)}
          subtitle="Últimas 8 semanas"
          trend="8.3%"
          trendUp={true}
        />
        <MetricCard
          icon={AlertTriangle}
          title="Estoque Baixo"
          value={metrics.lowStockItems.toString()}
          subtitle="Itens abaixo do mínimo"
        />
        <MetricCard
          icon={PieChartIcon}
          title="Margem de Lucro"
          value={`${metrics.avgMargin}%`}
          subtitle="Média geral"
          trend="2.1%"
          trendUp={true}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Sales Chart */}
        <Card className="lg:col-span-2">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-navy-900">Evolução das Vendas</h3>
            <p className="text-sm text-gray-500">Desempenho semanal de vendas e lucro</p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklySalesData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis 
                  dataKey="week" 
                  stroke="#94A3B8" 
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis 
                  stroke="#94A3B8" 
                  fontSize={12}
                  tickLine={false}
                  tickFormatter={(value) => `R$${(value/1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="sales"
                  name="Vendas"
                  stroke="#2563eb"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorSales)"
                />
                <Area
                  type="monotone"
                  dataKey="profit"
                  name="Lucro"
                  stroke="#059669"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorProfit)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Stock Turnover Chart */}
        <Card>
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-navy-900">Giro de Estoque</h3>
            <p className="text-sm text-gray-500">Por marca</p>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stockTurnoverData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={{ stroke: '#CBD5E1', strokeWidth: 1 }}
                >
                  {stockTurnoverData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Legend */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            {stockTurnoverData.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full flex-shrink-0" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs text-gray-500 truncate">{item.name}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Monthly Trend Chart */}
      <Card>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-navy-900">Tendência Mensal</h3>
          <p className="text-sm text-gray-500">Receita vs Custos</p>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis 
                dataKey="month" 
                stroke="#94A3B8" 
                fontSize={12}
                tickLine={false}
              />
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
import {
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
  Package,
  PieChart as PieChartIcon,
  AlertTriangle
} from 'lucide-react';
import { Card, MetricCard } from './ui/Card';
import { PageHeader } from './ui/PageHeader';
import { formatCurrency } from '../lib/utils';
import { calculateMetrics, calculateStockTurnover, monthlyTrendData } from '../data/mockData';

function ChartEmpty({ message = 'Sem dados ainda' }) {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center text-center">
      <div className="w-12 h-12 rounded-xl bg-slate-800/60 border border-slate-800 flex items-center justify-center mb-3">
        <TrendingUp className="w-5 h-5 text-slate-600" />
      </div>
      <p className="text-sm text-slate-500">{message}</p>
      <p className="text-xs text-slate-600 mt-1">Os dados aparecem conforme você registra operações</p>
    </div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 shadow-xl">
        <p className="text-sm font-medium text-slate-50 mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-xs text-slate-400">
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
}

function PieTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 shadow-xl">
        <p className="text-sm font-medium text-slate-50">{data.name}</p>
        <p className="text-xs text-slate-400">
          Giro: {data.value}%
        </p>
      </div>
    );
  }
  return null;
}

export function Dashboard({ products, weeklySalesData }) {
  const totalSales = weeklySalesData.reduce((acc, s) => acc + s.sales, 0);
  const metrics = calculateMetrics(products, weeklySalesData);
  const stockTurnover = calculateStockTurnover(products);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <PageHeader
        eyebrow="Painel"
        title="Dashboard de B.I."
        subtitle="Visão geral de desempenho e métricas da loja"
      />

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <MetricCard
          icon={Package}
          title="Total em Estoque"
          value={formatCurrency(metrics.totalStockValue)}
          subtitle={`${metrics.totalUnits} unidades`}
        />
        <MetricCard
          icon={DollarSign}
          title="Vendas Acumuladas"
          value={formatCurrency(totalSales)}
          subtitle="Total registrado"
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
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Sales Chart */}
        <Card className="lg:col-span-2">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-50">Evolução das Vendas</h3>
            <p className="text-sm text-slate-400">Desempenho semanal de vendas e lucro</p>
          </div>
          <div className="h-72">
            {weeklySalesData.length === 0 ? (
              <ChartEmpty message="Nenhuma venda registrada" />
            ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklySalesData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis 
                  dataKey="week" 
                  stroke="#64748B" 
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis 
                  stroke="#64748B" 
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
                  stroke="#3B82F6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorSales)"
                />
                <Area
                  type="monotone"
                  dataKey="profit"
                  name="Lucro"
                  stroke="#10B981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorProfit)"
                />
              </AreaChart>
            </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* Stock Turnover Chart */}
        <Card>
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-50">Giro de Estoque</h3>
            <p className="text-sm text-slate-400">Por marca</p>
          </div>
          <div className="h-52">
            {stockTurnover.length === 0 ? (
              <ChartEmpty message="Sem estoque disponível" />
            ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stockTurnover}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={{ stroke: '#475569', strokeWidth: 1 }}
                >
                  {stockTurnover.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            )}
          </div>
          {/* Legend */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            {stockTurnover.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full flex-shrink-0" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs text-slate-400 truncate">{item.name}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Monthly Trend Chart */}
      <Card>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-slate-50">Tendência Mensal</h3>
          <p className="text-sm text-slate-400">Receita vs Custos</p>
        </div>
        <div className="h-64">
          {monthlyTrendData.length === 0 ? (
            <ChartEmpty message="Sem histórico mensal" />
          ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyTrendData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorCosts" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis 
                dataKey="month" 
                stroke="#64748B" 
                fontSize={12}
                tickLine={false}
              />
              <YAxis 
                stroke="#64748B" 
                fontSize={12}
                tickLine={false}
                tickFormatter={(value) => `R$${(value/1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="revenue"
                name="Receita"
                stroke="#3B82F6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
              <Area
                type="monotone"
                dataKey="costs"
                name="Custos"
                stroke="#F59E0B"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorCosts)"
              />
            </AreaChart>
          </ResponsiveContainer>
          )}
        </div>
      </Card>
    </div>
  );
}
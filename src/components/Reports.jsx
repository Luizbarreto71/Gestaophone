import { useState } from 'react';
import { Download, FileText, TrendingUp, Package, DollarSign } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { PageHeader } from './ui/PageHeader';
import { formatCurrency, formatDate, cn } from '../lib/utils';
import { calculateMetrics } from '../data/mockData';

export function Reports({ products, weeklySalesData }) {
  const [selectedReport, setSelectedReport] = useState('overview');

  const metrics = calculateMetrics(products, weeklySalesData);
  const totalSales = weeklySalesData.reduce((acc, s) => acc + s.sales, 0);
  const totalProfit = weeklySalesData.reduce((acc, s) => acc + s.profit, 0);

  const reportTypes = [
    { id: 'overview', label: 'Visão Geral', icon: FileText },
    { id: 'inventory', label: 'Inventário', icon: Package },
    { id: 'sales', label: 'Vendas', icon: TrendingUp },
    { id: 'financial', label: 'Financeiro', icon: DollarSign },
  ];

  const generateReport = () => {
    // In a real app, this would generate a PDF or export data
    alert('Relatório gerado com sucesso! (Funcionalidade de exportação em breve)');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <PageHeader
        eyebrow="Análises"
        title="Relatórios"
        subtitle="Análises e relatórios do sistema"
        actions={
          <Button onClick={generateReport}>
            <Download className="w-4 h-4 mr-2" />
            Exportar Relatório
          </Button>
        }
      />

      {/* Report Type Selection */}
      <div className="flex gap-2 flex-wrap">
        {reportTypes.map((report) => (
          <button
            key={report.id}
            onClick={() => setSelectedReport(report.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200',
              selectedReport === report.id
                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                : 'text-slate-400 hover:text-slate-50 hover:bg-slate-800 border border-transparent'
            )}
          >
            <report.icon className="w-4 h-4" />
            <span className="text-sm font-medium">{report.label}</span>
          </button>
        ))}
      </div>

      {/* Report Content */}
      {selectedReport === 'overview' && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <div className="text-sm text-slate-400 mb-1">Faturamento Total</div>
              <div className="text-2xl font-bold text-slate-50">
                {formatCurrency(totalSales)}
              </div>
            </Card>
            <Card>
              <div className="text-sm text-slate-400 mb-1">Lucro Total</div>
              <div className="text-2xl font-bold text-emerald-400">
                {formatCurrency(totalProfit)}
              </div>
            </Card>
            <Card>
              <div className="text-sm text-slate-400 mb-1">Produtos em Estoque</div>
              <div className="text-2xl font-bold text-slate-50">
                {products.length}
              </div>
            </Card>
            <Card>
              <div className="text-sm text-slate-400 mb-1">Margem Média</div>
              <div className="text-2xl font-bold text-blue-400">
                {metrics.avgMargin}%
              </div>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <h3 className="text-lg font-semibold text-slate-50 mb-4">Atividade Recente</h3>
            <div className="space-y-3">
              {products.slice(0, 5).map((product, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-slate-800 last:border-b-0">
                  <div>
                    <p className="text-slate-50 font-medium">{product.name}</p>
                    <p className="text-xs text-slate-500">
                      {formatDate(product.createdAt)} • {product.brand}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-50 font-medium">
                      {formatCurrency(product.salePrice)}
                    </p>
                    <span className={cn(
                      'text-xs px-2 py-0.5 rounded-full',
                      product.status === 'disponivel' 
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : product.status === 'reservado'
                        ? 'bg-amber-500/10 text-amber-400'
                        : 'bg-slate-500/10 text-slate-400'
                    )}>
                      {product.status === 'disponivel' ? 'Disponível' : product.status === 'reservado' ? 'Reservado' : 'Vendido'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {selectedReport === 'inventory' && (
        <Card>
          <h3 className="text-lg font-semibold text-slate-50 mb-4">Relatório de Inventário</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Produto</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Marca</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Qtd</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-slate-800/50">
                    <td className="py-3 px-4 text-slate-50">{product.name}</td>
                    <td className="py-3 px-4 text-slate-400">{product.brand}</td>
                    <td className="py-3 px-4 text-slate-50">{product.quantity}</td>
                    <td className="py-3 px-4">
                      <span className={cn(
                        'text-xs px-2 py-0.5 rounded-full',
                        product.status === 'disponivel' 
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : product.status === 'reservado'
                          ? 'bg-amber-500/10 text-amber-400'
                          : 'bg-slate-500/10 text-slate-400'
                      )}>
                        {product.status === 'disponivel' ? 'Disponível' : product.status === 'reservado' ? 'Reservado' : 'Vendido'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {selectedReport === 'sales' && (
        <Card>
          <h3 className="text-lg font-semibold text-slate-50 mb-4">Relatório de Vendas por Semana</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Semana</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Vendas</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Lucro</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Margem</th>
                </tr>
              </thead>
              <tbody>
                {weeklySalesData.map((week, index) => (
                  <tr key={index} className="border-b border-slate-800/50">
                    <td className="py-3 px-4 text-slate-50">{week.week}</td>
                    <td className="py-3 px-4 text-right text-slate-50">{formatCurrency(week.sales)}</td>
                    <td className="py-3 px-4 text-right text-emerald-400">{formatCurrency(week.profit)}</td>
                    <td className="py-3 px-4 text-right text-slate-400">
                      {((week.profit / week.sales) * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {selectedReport === 'financial' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-lg font-semibold text-slate-50 mb-4">Resumo Financeiro</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Faturamento Total</span>
                  <span className="text-slate-50 font-semibold">{formatCurrency(totalSales)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Custos Totais</span>
                  <span className="text-slate-50 font-semibold">{formatCurrency(totalSales - totalProfit)}</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-slate-800">
                  <span className="text-slate-400">Lucro Total</span>
                  <span className="text-emerald-400 font-semibold">{formatCurrency(totalProfit)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Margem Média</span>
                  <span className="text-blue-400 font-semibold">{metrics.avgMargin}%</span>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-slate-50 mb-4">Valor em Estoque</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Valor Total em Estoque</span>
                  <span className="text-slate-50 font-semibold">{formatCurrency(metrics.totalStockValue)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Produtos Disponíveis</span>
                  <span className="text-slate-50 font-semibold">{products.filter(p => p.status === 'disponivel').length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Produtos Vendidos</span>
                  <span className="text-slate-50 font-semibold">{products.filter(p => p.status === 'vendido').length}</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-slate-800">
                  <span className="text-slate-400">Itens com Estoque Baixo</span>
                  <span className="text-rose-400 font-semibold">{metrics.lowStockItems}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
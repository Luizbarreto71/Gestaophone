import { useState } from 'react';
import {
  ShoppingCart,
  CreditCard,
  CheckCircle,
  Clock,
  Search,
  Filter,
  FileText,
  Download
} from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Input, Select } from './ui/Input';
import { Badge } from './ui/Badge';
import { formatCurrency, formatDate } from '../lib/utils';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// Mock sales data with more details for PDF generation
const mockSales = [
  {
    id: '1',
    customer: 'João Silva',
    products: [
      { model: 'iPhone 15 Pro Max', brand: 'Apple', color: 'Titânio Natural', condition: 'Lacrado', imei: '356789012345678', price: 9999 },
      { model: 'AirPods Pro 2', brand: 'Apple', color: 'Branco', condition: 'Lacrado', imei: 'APP234567890', price: 1899 }
    ],
    total: 11898,
    status: 'completed',
    paymentMethod: 'Cartão de Crédito',
    date: '2024-06-15T14:30:00Z'
  },
  {
    id: '2',
    customer: 'Maria Santos',
    products: [
      { model: 'Samsung Galaxy S24 Ultra', brand: 'Samsung', color: 'Titanium Gray', condition: 'Lacrado', imei: '356789012345679', price: 8499 }
    ],
    total: 8499,
    status: 'completed',
    paymentMethod: 'PIX',
    date: '2024-06-15T11:20:00Z'
  },
  {
    id: '3',
    customer: 'Pedro Oliveira',
    products: [
      { model: 'Xiaomi 14 Ultra', brand: 'Xiaomi', color: 'Preto', condition: 'Lacrado', imei: '356789012345680', price: 6299 },
      { model: 'Carregador iPhone 20W', brand: 'Apple', color: 'Branco', condition: 'Lacrado', imei: 'N/A', price: 199 }
    ],
    total: 6498,
    status: 'pending',
    paymentMethod: 'Boleto',
    date: '2024-06-14T16:45:00Z'
  },
  {
    id: '4',
    customer: 'Ana Costa',
    products: [
      { model: 'Apple Watch Ultra 2', brand: 'Apple', color: 'Titânio', condition: 'Lacrado', imei: 'AWU123456789', price: 6999 }
    ],
    total: 6999,
    status: 'completed',
    paymentMethod: 'Cartão de Débito',
    date: '2024-06-14T10:15:00Z'
  },
  {
    id: '5',
    customer: 'Carlos Ferreira',
    products: [
      { model: 'iPad Pro 12.9"', brand: 'Apple', color: 'Space Gray', condition: 'Seminovo', imei: 'DMPH123456789', price: 11499 }
    ],
    total: 11499,
    status: 'cancelled',
    paymentMethod: 'PIX',
    date: '2024-06-13T09:30:00Z'
  }
];

const statusConfig = {
  completed: { label: 'Concluída', variant: 'success', icon: CheckCircle },
  pending: { label: 'Pendente', variant: 'warning', icon: Clock },
  cancelled: { label: 'Cancelada', variant: 'danger', icon: null }
};

// Generate PDF receipt
const generatePDF = (sale) => {
  const doc = new jsPDF();
  
  // Header with store info
  doc.setFillColor(15, 23, 42); // Navy-900
  doc.rect(0, 0, 210, 40, 'F');
  
  // Store name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('Gestaophone Store', 105, 18, { align: 'center' });
  
  // Store details
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Rua das Flores, 123 - Centro, São Paulo - SP', 105, 26, { align: 'center' });
  doc.text('CNPJ: 12.345.678/0001-90 | Tel: (11) 99999-9999', 105, 32, { align: 'center' });
  
  // Receipt title
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('COMPROVANTE DE VENDA', 105, 55, { align: 'center' });
  
  // Receipt number and date
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(`Comprovante #${sale.id}`, 20, 65);
  doc.text(`Data: ${formatDate(sale.date)}`, 20, 72);
  
  // Customer info box
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundRect(20, 80, 170, 20, 3, 'F');
  doc.strokeRect(20, 80, 170, 20);
  
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Cliente:', 25, 93);
  doc.setFont('helvetica', 'normal');
  doc.text(sale.customer, 50, 93);
  
  // Products table
  const tableData = sale.products.map((product, index) => [
    `${index + 1}`,
    product.model,
    product.brand,
    product.color,
    product.condition,
    product.imei,
    formatCurrency(product.price)
  ]);
  
  autoTable(doc, {
    startY: 110,
    head: [['#', 'Modelo', 'Marca', 'Cor', 'Condição', 'IMEI', 'Preço Unit.']],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: [37, 99, 235], // Primary-600
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 9
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [15, 23, 42]
    },
    columnStyles: {
      0: { cellWidth: 15, halign: 'center' },
      1: { cellWidth: 40 },
      2: { cellWidth: 25 },
      3: { cellWidth: 25 },
      4: { cellWidth: 22, halign: 'center' },
      5: { cellWidth: 35 },
      6: { cellWidth: 28, halign: 'right' }
    },
    margin: { left: 20, right: 20 },
    styles: {
      lineColor: [226, 232, 240],
      lineWidth: 0.5
    }
  });
  
  // Total
  const finalY = doc.lastAutoTable.finalY + 10;
  
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(241, 245, 249);
  doc.roundRect(20, finalY, 170, 15, 3, 'F');
  doc.strokeRect(20, finalY, 170, 15);
  
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL:', 155, finalY + 10, { align: 'right' });
  doc.setTextColor(37, 99, 235);
  doc.text(formatCurrency(sale.total), 185, finalY + 10, { align: 'right' });
  
  // Payment method
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(`Forma de Pagamento: ${sale.paymentMethod}`, 20, finalY + 30);
  
  // Footer
  doc.setFontSize(8);
  doc.setTextColor(156, 163, 175);
  doc.text('Este documento é um comprovante de venda.', 105, 280, { align: 'center' });
  doc.text('Gerado em ' + new Date().toLocaleString('pt-BR'), 105, 285, { align: 'center' });
  
  // Save PDF
  doc.save(`comprovante-venda-${sale.id}-${sale.customer.replace(/\s+/g, '_')}.pdf`);
};

export function Sales({ products }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filteredSales = mockSales.filter(sale => {
    const matchesSearch = sale.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.products.some(p => p.model.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = !statusFilter || sale.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalSales = filteredSales
    .filter(s => s.status === 'completed')
    .reduce((acc, s) => acc + s.total, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-navy-900">Gestão de Vendas</h2>
        <p className="text-sm text-gray-500 mt-1">
          Acompanhe todas as vendas realizadas
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-50 rounded-xl">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Vendas Concluídas</p>
              <p className="text-2xl font-bold text-navy-900">
                {mockSales.filter(s => s.status === 'completed').length}
              </p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-50 rounded-xl">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Vendas Pendentes</p>
              <p className="text-2xl font-bold text-navy-900">
                {mockSales.filter(s => s.status === 'pending').length}
              </p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary-50 rounded-xl">
              <CreditCard className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Vendido</p>
              <p className="text-2xl font-bold text-primary-600">
                {formatCurrency(totalSales)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-400" />
          <h3 className="text-lg font-semibold text-navy-900">Filtros</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder="Buscar por cliente ou produto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select
            placeholder="Todos os Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: '', label: 'Todos os Status' },
              { value: 'completed', label: 'Concluída' },
              { value: 'pending', label: 'Pendente' },
              { value: 'cancelled', label: 'Cancelada' }
            ]}
          />
        </div>
      </Card>

      {/* Sales List */}
      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-surface-light">
                <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Venda
                </th>
                <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Produtos
                </th>
                <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Pagamento
                </th>
                <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredSales.map((sale) => {
                const StatusIcon = statusConfig[sale.status].icon;
                return (
                  <tr key={sale.id} className="hover:bg-surface-light transition-colors group">
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-400 font-mono">#{sale.id}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-navy-900 font-medium">{sale.customer}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm text-gray-600">
                        {sale.products.length} item(s)
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {sale.products.slice(0, 2).map(p => p.model).join(', ')}
                        {sale.products.length > 2 && ` +${sale.products.length - 2}`}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-600">{sale.paymentMethod}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm font-semibold text-emerald-600">
                        {formatCurrency(sale.total)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant={statusConfig[sale.status].variant}>
                        {StatusIcon && <StatusIcon className="w-3 h-3 mr-1" />}
                        {statusConfig[sale.status].label}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-500">
                        {formatDate(sale.date)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => generatePDF(sale)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <FileText className="w-4 h-4 mr-1.5" />
                        Comprovante
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredSales.length === 0 && (
          <div className="text-center py-12">
            <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Nenhuma venda encontrada</p>
          </div>
        )}
      </Card>
    </div>
  );
}
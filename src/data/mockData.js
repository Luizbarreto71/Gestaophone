// Mock data for the GestaoPhone system
// Simulates a database with products, sales, and metrics

export const brands = ['Apple', 'Samsung', 'Xiaomi', 'Motorola', 'Google', 'OnePlus', 'Huawei'];

export const categories = ['Smartphone', 'Tablet', 'Smartwatch', 'Acessórios', 'Fones', 'Carregadores'];

export const conditions = ['Novo', 'Seminovo'];

export const statusTags = {
  disponivel: { label: 'Disponível', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  reservado: { label: 'Reservado', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  vendido: { label: 'Vendido', color: 'bg-rose-500/20 text-rose-400 border-rose-500/30' }
};

// Initial products inventory
export const initialProducts = [
  {
    id: '1',
    name: 'iPhone 15 Pro Max',
    brand: 'Apple',
    category: 'Smartphone',
    condition: 'Novo',
    costPrice: 7500,
    salePrice: 9999,
    imei: '356789012345678',
    quantity: 5,
    minQuantity: 2,
    status: 'disponivel',
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    name: 'Samsung Galaxy S24 Ultra',
    brand: 'Samsung',
    category: 'Smartphone',
    condition: 'Novo',
    costPrice: 6200,
    salePrice: 8499,
    imei: '356789012345679',
    quantity: 8,
    minQuantity: 3,
    status: 'disponivel',
    createdAt: '2024-01-18T14:20:00Z'
  },
  {
    id: '3',
    name: 'Xiaomi 14 Ultra',
    brand: 'Xiaomi',
    category: 'Smartphone',
    condition: 'Novo',
    costPrice: 4800,
    salePrice: 6299,
    imei: '356789012345680',
    quantity: 12,
    minQuantity: 5,
    status: 'disponivel',
    createdAt: '2024-01-20T09:15:00Z'
  },
  {
    id: '4',
    name: 'iPhone 14 Pro',
    brand: 'Apple',
    category: 'Smartphone',
    condition: 'Seminovo',
    costPrice: 5000,
    salePrice: 6799,
    imei: '356789012345681',
    quantity: 3,
    minQuantity: 2,
    status: 'reservado',
    createdAt: '2024-01-22T16:45:00Z'
  },
  {
    id: '5',
    name: 'Samsung Galaxy A55',
    brand: 'Samsung',
    category: 'Smartphone',
    condition: 'Novo',
    costPrice: 2100,
    salePrice: 2899,
    imei: '356789012345682',
    quantity: 15,
    minQuantity: 8,
    status: 'disponivel',
    createdAt: '2024-01-25T11:30:00Z'
  },
  {
    id: '6',
    name: 'Motorola Edge 50 Pro',
    brand: 'Motorola',
    category: 'Smartphone',
    condition: 'Novo',
    costPrice: 2800,
    salePrice: 3699,
    imei: '356789012345683',
    quantity: 1,
    minQuantity: 3,
    status: 'disponivel',
    createdAt: '2024-02-01T08:00:00Z'
  },
  {
    id: '7',
    name: 'Google Pixel 8 Pro',
    brand: 'Google',
    category: 'Smartphone',
    condition: 'Novo',
    costPrice: 5500,
    salePrice: 7299,
    imei: '356789012345684',
    quantity: 6,
    minQuantity: 2,
    status: 'disponivel',
    createdAt: '2024-02-05T13:20:00Z'
  },
  {
    id: '8',
    name: 'OnePlus 12',
    brand: 'OnePlus',
    category: 'Smartphone',
    condition: 'Novo',
    costPrice: 4200,
    salePrice: 5499,
    imei: '356789012345685',
    quantity: 4,
    minQuantity: 2,
    status: 'vendido',
    createdAt: '2024-02-08T10:45:00Z'
  },
  {
    id: '9',
    name: 'iPad Pro 12.9"',
    brand: 'Apple',
    category: 'Tablet',
    condition: 'Novo',
    costPrice: 8500,
    salePrice: 11499,
    imei: 'DMPH123456789',
    quantity: 3,
    minQuantity: 1,
    status: 'disponivel',
    createdAt: '2024-02-10T15:30:00Z'
  },
  {
    id: '10',
    name: 'Samsung Galaxy Tab S9 Ultra',
    brand: 'Samsung',
    category: 'Tablet',
    condition: 'Novo',
    costPrice: 6800,
    salePrice: 8999,
    imei: 'DMPH987654321',
    quantity: 2,
    minQuantity: 1,
    status: 'disponivel',
    createdAt: '2024-02-12T09:00:00Z'
  },
  {
    id: '11',
    name: 'Apple Watch Ultra 2',
    brand: 'Apple',
    category: 'Smartwatch',
    condition: 'Novo',
    costPrice: 5200,
    salePrice: 6999,
    imei: 'AWU123456789',
    quantity: 7,
    minQuantity: 3,
    status: 'disponivel',
    createdAt: '2024-02-15T11:15:00Z'
  },
  {
    id: '12',
    name: 'AirPods Pro 2',
    brand: 'Apple',
    category: 'Fones',
    condition: 'Novo',
    costPrice: 1400,
    salePrice: 1899,
    imei: 'APP234567890',
    quantity: 25,
    minQuantity: 10,
    status: 'disponivel',
    createdAt: '2024-02-18T14:00:00Z'
  },
  {
    id: '13',
    name: 'Xiaomi Redmi Buds 5 Pro',
    brand: 'Xiaomi',
    category: 'Fones',
    condition: 'Novo',
    costPrice: 350,
    salePrice: 499,
    imei: 'XRB567890123',
    quantity: 30,
    minQuantity: 15,
    status: 'disponivel',
    createdAt: '2024-02-20T16:30:00Z'
  },
  {
    id: '14',
    name: 'Carregador iPhone 20W',
    brand: 'Apple',
    category: 'Carregadores',
    condition: 'Novo',
    costPrice: 120,
    salePrice: 199,
    imei: 'N/A',
    quantity: 50,
    minQuantity: 20,
    status: 'disponivel',
    createdAt: '2024-02-22T08:45:00Z'
  },
  {
    id: '15',
    name: 'Samsung Galaxy Watch 6',
    brand: 'Samsung',
    category: 'Smartwatch',
    condition: 'Novo',
    costPrice: 1800,
    salePrice: 2499,
    imei: 'SGW345678901',
    quantity: 1,
    minQuantity: 3,
    status: 'disponivel',
    createdAt: '2024-02-25T12:00:00Z'
  }
];

// Weekly sales data for the chart
export const weeklySalesData = [
  { week: 'Sem 1', sales: 45200, profit: 12800 },
  { week: 'Sem 2', sales: 52300, profit: 15100 },
  { week: 'Sem 3', sales: 48700, profit: 13900 },
  { week: 'Sem 4', sales: 61200, profit: 18200 },
  { week: 'Sem 5', sales: 55800, profit: 16400 },
  { week: 'Sem 6', sales: 68900, profit: 20500 },
  { week: 'Sem 7', sales: 72100, profit: 21800 },
  { week: 'Sem 8', sales: 65400, profit: 19200 }
];

// Stock turnover by brand
export const stockTurnoverData = [
  { name: 'Apple', value: 35, color: '#3b82f6' },
  { name: 'Samsung', value: 28, color: '#10b981' },
  { name: 'Xiaomi', value: 18, color: '#f59e0b' },
  { name: 'Motorola', value: 8, color: '#8b5cf6' },
  { name: 'Google', value: 6, color: '#ef4444' },
  { name: 'Outros', value: 5, color: '#6b7280' }
];

// Monthly sales trend
export const monthlyTrendData = [
  { month: 'Jan', revenue: 125000, costs: 89000 },
  { month: 'Fev', revenue: 142000, costs: 98000 },
  { month: 'Mar', revenue: 158000, costs: 108000 },
  { month: 'Abr', revenue: 148000, costs: 102000 },
  { month: 'Mai', revenue: 175000, costs: 118000 },
  { month: 'Jun', revenue: 189000, costs: 125000 }
];

// Calculate dashboard metrics
export function calculateMetrics(products, salesData) {
  const totalStockValue = products.reduce((acc, p) => acc + (p.costPrice * p.quantity), 0);
  const totalSales = salesData.reduce((acc, s) => acc + s.sales, 0);
  const totalProfit = salesData.reduce((acc, s) => acc + s.profit, 0);
  const avgMargin = totalSales > 0 ? ((totalProfit / totalSales) * 100).toFixed(1) : 0;
  const lowStockItems = products.filter(p => p.quantity <= p.minQuantity).length;

  return {
    totalStockValue,
    totalSales,
    totalProfit,
    avgMargin,
    lowStockItems
  };
}
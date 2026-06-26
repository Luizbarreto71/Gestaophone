// GestaoPhone — constantes de domínio e helpers de métricas.
// Os dados começam ZERADOS: produtos, modelos e vendas são criados pelo usuário
// e persistidos via src/lib/repository.js (Supabase ou localStorage).

// Generate unique ID (usado no fallback localStorage)
export function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

export const brands = ['Apple', 'Samsung', 'Xiaomi', 'Motorola', 'Google', 'OnePlus', 'Huawei'];

export const categories = ['Smartphone', 'Tablet', 'Smartwatch', 'Acessórios', 'Fones', 'Carregadores'];

export const conditions = ['Novo', 'Seminovo'];

export const statusTags = {
  disponivel: { label: 'Disponível', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  reservado: { label: 'Reservado', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  vendido: { label: 'Vendido', color: 'bg-slate-500/20 text-slate-400 border-slate-500/30' }
};

// Estado inicial vazio — nada de dados mocados.
export const initialProducts = [];
export const initialTemplates = [];
export const initialSales = [];

// Séries dos gráficos do dashboard começam vazias.
export const initialWeeklySales = [];
export const monthlyTrendData = [];

// Calculate dashboard metrics
export function calculateMetrics(products, salesData) {
  const totalStockValue = products.reduce((acc, p) => acc + (p.costPrice * p.quantity), 0);
  const totalSales = salesData.reduce((acc, s) => acc + s.sales, 0);
  const totalProfit = salesData.reduce((acc, s) => acc + s.profit, 0);
  const avgMargin = totalSales > 0 ? ((totalProfit / totalSales) * 100).toFixed(1) : 0;
  const lowStockItems = products.filter(p => p.quantity <= p.minQuantity).length;
  const totalUnits = products.reduce((acc, p) => acc + p.quantity, 0);

  return {
    totalStockValue,
    totalSales,
    totalProfit,
    avgMargin,
    lowStockItems,
    totalUnits
  };
}

// Calculate stock turnover by brand from products
export function calculateStockTurnover(products) {
  const brandCounts = {};
  let total = 0;

  products.forEach(p => {
    if (p.status === 'disponivel') {
      brandCounts[p.brand] = (brandCounts[p.brand] || 0) + p.quantity;
      total += p.quantity;
    }
  });

  return Object.entries(brandCounts).map(([name, value]) => ({
    name,
    value: total > 0 ? Math.round((value / total) * 100) : 0,
    color: getBrandColor(name)
  })).sort((a, b) => b.value - a.value);
}

function getBrandColor(brand) {
  const colors = {
    'Apple': '#3B82F6',
    'Samsung': '#10B981',
    'Xiaomi': '#F59E0B',
    'Motorola': '#8B5CF6',
    'Google': '#EF4444',
    'OnePlus': '#EC4899',
    'Huawei': '#F97316'
  };
  return colors[brand] || '#6B7280';
}

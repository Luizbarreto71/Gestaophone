import { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { QuickOperation } from './components/QuickOperation';
import { Inventory } from './components/Inventory';
import { Reports } from './components/Reports';
import { Settings } from './components/Settings';
import { Login } from './components/Login';
import { repo } from './lib/repository';
import { isAuthenticated, logout } from './lib/auth';

function App() {
  const [authed, setAuthed] = useState(isAuthenticated());
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [products, setProducts] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [weeklySalesData, setWeeklySalesData] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = useCallback(() => {
    logout();
    setAuthed(false);
  }, []);

  // Load data once authenticated (Supabase when configured, localStorage otherwise)
  useEffect(() => {
    if (!authed) return;
    const loadData = async () => {
      const [storedProducts, storedTemplates, storedWeeklySales] = await Promise.all([
        repo.getProducts(),
        repo.getTemplates(),
        repo.getWeeklySales(),
      ]);
      setProducts(storedProducts);
      setTemplates(storedTemplates);
      setWeeklySalesData(storedWeeklySales);
      setLoading(false);
    };

    loadData();
  }, [authed]);

  // Add new product
  const handleAddProduct = useCallback(async (productData) => {
    const created = await repo.createProduct(productData);
    if (created) setProducts(prev => [created, ...prev]);
  }, []);

  // Edit existing product
  const handleEditProduct = useCallback(async (productData) => {
    const updated = await repo.updateProduct(productData.id, productData);
    if (updated) {
      setProducts(prev => prev.map(p => (p.id === updated.id ? updated : p)));
    }
  }, []);

  // Delete product
  const handleDeleteProduct = useCallback(async (productId) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      await repo.deleteProduct(productId);
      setProducts(prev => prev.filter(p => p.id !== productId));
    }
  }, []);

  // Sell product (mark as sold + record sale + bump weekly chart)
  const handleSellProduct = useCallback(async (product) => {
    const { product: updated, weeklySales } = await repo.sellProduct(product);
    if (updated) {
      setProducts(prev => prev.map(p => (p.id === updated.id ? updated : p)));
    }
    if (weeklySales) setWeeklySalesData(weeklySales);
  }, []);

  // Add new template
  const handleAddTemplate = useCallback(async (templateData) => {
    const created = await repo.createTemplate(templateData);
    if (created) setTemplates(prev => [...prev, created]);
  }, []);

  // Edit template
  const handleEditTemplate = useCallback(async (templateData) => {
    const updated = await repo.updateTemplate(templateData.id, templateData);
    if (updated) {
      setTemplates(prev => prev.map(t => (t.id === updated.id ? updated : t)));
    }
  }, []);

  // Delete template
  const handleDeleteTemplate = useCallback(async (templateId) => {
    if (window.confirm('Tem certeza que deseja excluir este modelo?')) {
      await repo.deleteTemplate(templateId);
      setTemplates(prev => prev.filter(t => t.id !== templateId));
    }
  }, []);

  // Reset all data
  const handleResetData = useCallback(async () => {
    if (window.confirm('Tem certeza que deseja resetar todos os dados? Esta ação não pode ser desfeita.')) {
      const { products: p, templates: t, weeklySales: w } = await repo.resetData();
      setProducts(p);
      setTemplates(t);
      setWeeklySalesData(w);
    }
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            products={products} 
            weeklySalesData={weeklySalesData} 
          />
        );
      case 'quick':
        return (
          <QuickOperation
            products={products}
            onAddProduct={handleAddProduct}
            onSellProduct={handleSellProduct}
            templates={templates}
          />
        );
      case 'inventory':
        return (
          <Inventory
            products={products}
            onAddProduct={handleAddProduct}
            onEditProduct={handleEditProduct}
            onDeleteProduct={handleDeleteProduct}
          />
        );
      case 'reports':
        return (
          <Reports 
            products={products} 
            weeklySalesData={weeklySalesData}
          />
        );
      case 'settings':
        return (
          <Settings
            templates={templates}
            onAddTemplate={handleAddTemplate}
            onEditTemplate={handleEditTemplate}
            onDeleteTemplate={handleDeleteTemplate}
            onResetData={handleResetData}
          />
        );
      default:
        return <Dashboard products={products} weeklySalesData={weeklySalesData} />;
    }
  };

  // Breadcrumb shown in the top bar — kept generic so it never duplicates the
  // big page title rendered inside each section.
  const breadcrumb = {
    dashboard: 'Painel · Visão Geral',
    quick: 'Operações · Bipe',
    inventory: 'Estoque · Inventário',
    reports: 'Análises · Relatórios',
    settings: 'Sistema · Configurações',
  }[activeTab] || 'Painel';

  // Login gate — nothing loads until the store password is entered.
  if (!authed) {
    return <Login onSuccess={() => setAuthed(true)} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Carregando GestaoPhone...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex text-slate-50">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Top Bar — global chrome only. The page title lives in each section. */}
        <header className="sticky top-0 z-10 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-6 sm:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Breadcrumb (small, muted) */}
            <p className="text-xs font-medium uppercase tracking-widest text-slate-500 truncate">
              {breadcrumb}
            </p>

            <div className="flex items-center gap-4">
              <p className="hidden md:block text-xs text-slate-500 capitalize">
                {new Date().toLocaleDateString('pt-BR', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
              {/* User Avatar */}
              <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-slate-100 leading-tight">Admin</p>
                  <p className="text-xs text-slate-500 leading-tight">Administrador</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center ring-1 ring-blue-400/30">
                  <span className="text-white text-sm font-bold">A</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content — generous padding so nothing hugs the edges */}
        <div className="p-6 sm:p-8 max-w-[1600px] mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;
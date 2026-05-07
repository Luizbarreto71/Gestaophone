import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Inventory } from './components/Inventory';
import { Sales } from './components/Sales';
import { Reports } from './components/Reports';
import { Settings } from './components/Settings';
import { initialProducts } from './data/mockData';
import { generateId } from './lib/utils';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulate API fetch on mount
  useEffect(() => {
    const fetchProducts = async () => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      setProducts(initialProducts);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  // Add new product
  const handleAddProduct = (productData) => {
    const newProduct = {
      ...productData,
      id: generateId(),
      createdAt: new Date().toISOString()
    };
    setProducts(prev => [newProduct, ...prev]);
  };

  // Edit existing product
  const handleEditProduct = (productData) => {
    setProducts(prev => prev.map(p => 
      p.id === productData.id ? { ...p, ...productData } : p
    ));
  };

  // Delete product
  const handleDeleteProduct = (productId) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      setProducts(prev => prev.filter(p => p.id !== productId));
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard products={products} />;
      case 'inventory':
        return (
          <Inventory
            products={products}
            onAddProduct={handleAddProduct}
            onEditProduct={handleEditProduct}
            onDeleteProduct={handleDeleteProduct}
          />
        );
      case 'sales':
        return <Sales products={products} />;
      case 'reports':
        return <Reports products={products} />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard products={products} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Carregando GestaoPhone...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Top Bar */}
        <header className="sticky top-0 z-10 bg-surface/80 backdrop-blur-md border-b border-border px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-navy-900">
                {activeTab === 'dashboard' && 'Dashboard'}
                {activeTab === 'inventory' && 'Inventário'}
                {activeTab === 'sales' && 'Vendas'}
                {activeTab === 'reports' && 'Relatórios'}
                {activeTab === 'settings' && 'Configurações'}
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">
                {new Date().toLocaleDateString('pt-BR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <div className="flex items-center gap-4">
              {/* User Avatar */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-navy-900">Admin</p>
                  <p className="text-xs text-gray-400">Administrador</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                  <span className="text-white font-bold">A</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;
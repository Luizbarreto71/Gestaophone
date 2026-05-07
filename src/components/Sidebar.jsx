import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Smartphone,
  LogOut
} from 'lucide-react';
import { cn } from '../lib/utils';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
  { icon: Package, label: 'Inventário', id: 'inventory' },
  { icon: ShoppingCart, label: 'Vendas', id: 'sales' },
  { icon: BarChart3, label: 'Relatórios', id: 'reports' },
  { icon: Settings, label: 'Configurações', id: 'settings' },
];

export function Sidebar({ activeTab, onTabChange, isCollapsed, onToggle }) {
  return (
    <aside
      className={cn(
        'h-full bg-surface border-r border-border flex flex-col transition-all duration-300',
        isCollapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-50 rounded-xl">
            <Smartphone className="w-6 h-6 text-primary-600" />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="text-lg font-bold text-navy-900">GestaoPhone</h1>
              <p className="text-xs text-gray-400">Controle de Estoque</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
              activeTab === item.id
                ? 'bg-primary-50 text-primary-600'
                : 'text-gray-500 hover:text-navy-900 hover:bg-gray-50',
              isCollapsed && 'justify-center'
            )}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && (
              <span className="text-sm font-medium">{item.label}</span>
            )}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-border">
        <button
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-500 hover:text-rose-600 hover:bg-rose-50 transition-all duration-200',
            isCollapsed && 'justify-center'
          )}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && (
            <span className="text-sm font-medium">Sair</span>
          )}
        </button>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 p-1.5 bg-surface border border-border rounded-full text-gray-400 hover:text-navy-900 hover:bg-gray-50 transition-colors"
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>
    </aside>
  );
}
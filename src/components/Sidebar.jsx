import { 
  LayoutDashboard, 
  Zap,
  Package, 
  FileText,
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Smartphone,
  LogOut
} from 'lucide-react';
import { cn } from '../lib/utils';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
  { icon: Zap, label: 'Operação Rápida', id: 'quick' },
  { icon: Package, label: 'Inventário', id: 'inventory' },
  { icon: FileText, label: 'Relatórios', id: 'reports' },
  { icon: Settings, label: 'Configurações', id: 'settings' },
];

export function Sidebar({ activeTab, onTabChange, isCollapsed, onToggle, onLogout }) {
  const handleLogout = () => {
    if (window.confirm('Deseja sair do sistema?')) {
      onLogout?.();
    }
  };

  return (
    <aside
      className={cn(
        'h-full bg-slate-900/40 border-r border-slate-800 flex flex-col transition-all duration-300 backdrop-blur-sm',
        isCollapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-xl">
            <Smartphone className="w-6 h-6 text-blue-400" />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="text-lg font-bold text-slate-50">GestaoPhone</h1>
              <p className="text-xs text-slate-500">Controle de Estoque</p>
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
                ? 'bg-blue-500/10 text-blue-400'
                : 'text-slate-400 hover:text-slate-50 hover:bg-slate-800/60',
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
      <div className="p-3 border-t border-slate-800">
        <button
          onClick={handleLogout}
          title="Sair"
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-200',
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
        className="absolute -right-3 top-20 p-1.5 bg-slate-900 border border-slate-800 rounded-full text-slate-400 hover:text-slate-50 hover:bg-slate-800 transition-colors"
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
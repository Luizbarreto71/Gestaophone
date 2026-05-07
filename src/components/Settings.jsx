import { useState } from 'react';
import {
  Store,
  Bell,
  Shield,
  Database,
  Download,
  Upload,
  Trash2,
  Save
} from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

export function Settings() {
  const [storeSettings, setStoreSettings] = useState({
    name: 'GestaoPhone Store',
    email: 'contato@gestaophone.com.br',
    phone: '(11) 99999-9999',
    address: 'Rua das Flores, 123 - Centro',
    city: 'São Paulo',
    state: 'SP',
    cep: '01234-567',
    cnpj: '12.345.678/0001-90'
  });

  const [notificationSettings, setNotificationSettings] = useState({
    lowStock: true,
    newSale: true,
    dailyReport: true,
    weeklyReport: false
  });

  const handleSave = () => {
    alert('Configurações salvas com sucesso!');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-navy-900">Configurações</h2>
        <p className="text-sm text-gray-500 mt-1">
          Gerencie as preferências do sistema
        </p>
      </div>

      {/* Store Information */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary-50 rounded-lg">
            <Store className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-navy-900">Informações da Loja</h3>
            <p className="text-sm text-gray-500">Dados cadastrais do estabelecimento</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-2">
            <Input
              label="Nome da Loja"
              value={storeSettings.name}
              onChange={(e) => setStoreSettings({...storeSettings, name: e.target.value})}
            />
          </div>
          <Input
            label="E-mail"
            type="email"
            value={storeSettings.email}
            onChange={(e) => setStoreSettings({...storeSettings, email: e.target.value})}
          />
          <Input
            label="Telefone"
            value={storeSettings.phone}
            onChange={(e) => setStoreSettings({...storeSettings, phone: e.target.value})}
          />
          <div className="col-span-2">
            <Input
              label="Endereço"
              value={storeSettings.address}
              onChange={(e) => setStoreSettings({...storeSettings, address: e.target.value})}
            />
          </div>
          <Input
            label="Cidade"
            value={storeSettings.city}
            onChange={(e) => setStoreSettings({...storeSettings, city: e.target.value})}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Estado"
              value={storeSettings.state}
              onChange={(e) => setStoreSettings({...storeSettings, state: e.target.value})}
            />
            <Input
              label="CEP"
              value={storeSettings.cep}
              onChange={(e) => setStoreSettings({...storeSettings, cep: e.target.value})}
            />
          </div>
          <Input
            label="CNPJ"
            value={storeSettings.cnpj}
            onChange={(e) => setStoreSettings({...storeSettings, cnpj: e.target.value})}
          />
        </div>
      </Card>

      {/* Notification Settings */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-amber-50 rounded-lg">
            <Bell className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-navy-900">Notificações</h3>
            <p className="text-sm text-gray-500">Preferências de alerta e comunicação</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-surface-light rounded-lg">
            <div>
              <p className="text-sm font-medium text-navy-900">Estoque Baixo</p>
              <p className="text-xs text-gray-500">Alerta quando produto atingir estoque mínimo</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationSettings.lowStock}
                onChange={(e) => setNotificationSettings({...notificationSettings, lowStock: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-surface-light rounded-lg">
            <div>
              <p className="text-sm font-medium text-navy-900">Nova Venda</p>
              <p className="text-xs text-gray-500">Notificar quando uma venda for realizada</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationSettings.newSale}
                onChange={(e) => setNotificationSettings({...notificationSettings, newSale: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-surface-light rounded-lg">
            <div>
              <p className="text-sm font-medium text-navy-900">Relatório Diário</p>
              <p className="text-xs text-gray-500">Receber resumo diário por e-mail</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationSettings.dailyReport}
                onChange={(e) => setNotificationSettings({...notificationSettings, dailyReport: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-surface-light rounded-lg">
            <div>
              <p className="text-sm font-medium text-navy-900">Relatório Semanal</p>
              <p className="text-xs text-gray-500">Receber análise semanal por e-mail</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationSettings.weeklyReport}
                onChange={(e) => setNotificationSettings({...notificationSettings, weeklyReport: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>
      </Card>

      {/* System Actions */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-emerald-50 rounded-lg">
            <Database className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-navy-900">Sistema</h3>
            <p className="text-sm text-gray-500">Backup e manutenção de dados</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="flex items-center gap-4 p-4 bg-surface-light rounded-lg hover:bg-gray-100 transition-colors group">
            <div className="p-3 bg-emerald-100 rounded-lg group-hover:bg-emerald-200 transition-colors">
              <Download className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-navy-900">Exportar Dados</p>
              <p className="text-xs text-gray-500">Baixar backup em JSON</p>
            </div>
          </button>

          <button className="flex items-center gap-4 p-4 bg-surface-light rounded-lg hover:bg-gray-100 transition-colors group">
            <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
              <Upload className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-navy-900">Importar Dados</p>
              <p className="text-xs text-gray-500">Restaurar de backup</p>
            </div>
          </button>

          <button className="flex items-center gap-4 p-4 bg-surface-light rounded-lg hover:bg-gray-100 transition-colors group">
            <div className="p-3 bg-amber-100 rounded-lg group-hover:bg-amber-200 transition-colors">
              <Shield className="w-5 h-5 text-amber-600" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-navy-900">Alterar Senha</p>
              <p className="text-xs text-gray-500">Atualizar credenciais</p>
            </div>
          </button>

          <button className="flex items-center gap-4 p-4 bg-surface-light rounded-lg hover:bg-rose-50 transition-colors group">
            <div className="p-3 bg-rose-100 rounded-lg group-hover:bg-rose-200 transition-colors">
              <Trash2 className="w-5 h-5 text-rose-600" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-navy-900">Limpar Dados</p>
              <p className="text-xs text-gray-500">Resetar sistema</p>
            </div>
          </button>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button size="lg" onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          Salvar Configurações
        </Button>
      </div>
    </div>
  );
}
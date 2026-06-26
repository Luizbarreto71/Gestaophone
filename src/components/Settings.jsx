import { useState } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  RotateCcw,
  Save,
  AlertTriangle,
  KeyRound,
  CheckCircle
} from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Input, Select } from './ui/Input';
import { Badge } from './ui/Badge';
import { Modal } from './ui/Modal';
import { PageHeader } from './ui/PageHeader';
import { formatCurrency } from '../lib/utils';
import { brands } from '../data/mockData';
import { getStoredPassword, setStoredPassword } from '../lib/auth';

export function Settings({ 
  templates, 
  onAddTemplate, 
  onEditTemplate, 
  onDeleteTemplate,
  onResetData 
}) {
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <PageHeader
        eyebrow="Sistema"
        title="Configurações"
        subtitle="Gerencie modelos base e configurações do sistema"
      />

      {/* Templates Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-50">Modelos Base</h3>
            <p className="text-sm text-slate-400">
              Modelos pré-cadastrados para operação rápida
            </p>
          </div>
          <Button onClick={() => {
            setEditingTemplate(null);
            setIsTemplateModalOpen(true);
          }}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Modelo
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => (
            <Card key={template.id} className="relative">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-slate-50">{template.name}</h4>
                  <p className="text-xs text-slate-500">{template.brand} • {template.category}</p>
                </div>
                <Badge variant={template.condition === 'Novo' ? 'success' : 'info'}>
                  {template.condition}
                </Badge>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Custo:</span>
                  <span className="text-slate-50">{formatCurrency(template.costPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Venda:</span>
                  <span className="text-emerald-400 font-medium">
                    {formatCurrency(template.salePrice)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Lucro:</span>
                  <span className="text-emerald-400">
                    {formatCurrency(template.salePrice - template.costPrice)}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-800">
                  <span className="text-slate-400">Estoque Mínimo:</span>
                  <span className="text-slate-50">{template.minQuantity} un.</span>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-800">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEditingTemplate(template);
                    setIsTemplateModalOpen(true);
                  }}
                  className="flex-1"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Editar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteTemplate(template.id)}
                  className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {templates.length === 0 && (
          <Card className="text-center py-12">
            <p className="text-slate-400 mb-2">Nenhum modelo cadastrado</p>
            <p className="text-sm text-slate-500">
              Cadastre modelos base para agilizar o cadastro de produtos
            </p>
          </Card>
        )}
      </div>

      {/* System Section */}
      <div>
        <h3 className="text-lg font-semibold text-slate-50 mb-4">Sistema</h3>

        <div className="space-y-4">
        {/* Password card */}
        <PasswordCard />

        <Card>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-rose-500/10 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-rose-400" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-slate-50 mb-2">Resetar Dados do Sistema</h4>
              <p className="text-sm text-slate-400 mb-4">
                Esta ação irá restaurar todos os dados para o estado inicial, 
                apagando todos os produtos, vendas e modelos cadastrados.
              </p>
              <Button
                variant="danger"
                onClick={() => setShowResetConfirm(true)}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Resetar Sistema
              </Button>
            </div>
          </div>
        </Card>
        </div>
      </div>

      {/* Template Modal */}
      <TemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => {
          setIsTemplateModalOpen(false);
          setEditingTemplate(null);
        }}
        onAdd={onAddTemplate}
        onEdit={onEditTemplate}
        template={editingTemplate}
      />

      {/* Reset Confirmation Modal */}
      <Modal
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        title="Confirmar Reset"
        size="md"
      >
        <div className="space-y-4">
          <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-lg">
            <p className="text-rose-400 font-medium">
              ⚠️ Atenção: Esta ação não pode ser desfeita!
            </p>
          </div>
          
          <p className="text-slate-300">
            Você está prestes a resetar todo o sistema. Todos os seguintes dados serão perdidos:
          </p>
          
          <ul className="list-disc list-inside text-slate-400 space-y-1">
            <li>Todos os produtos cadastrados</li>
            <li>Histórico de vendas</li>
            <li>Modelos base personalizados</li>
            <li>Dados do dashboard</li>
          </ul>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <Button variant="secondary" onClick={() => setShowResetConfirm(false)}>
              Cancelar
            </Button>
            <Button 
              variant="danger" 
              onClick={() => {
                onResetData();
                setShowResetConfirm(false);
              }}
            >
              Confirmar Reset
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// Password card — change the store access password (single-password auth)
function PasswordCard() {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(false);
    if (current !== getStoredPassword()) {
      setError('A senha atual está incorreta.');
      return;
    }
    if (next.trim().length < 4) {
      setError('A nova senha precisa ter ao menos 4 caracteres.');
      return;
    }
    if (next !== confirm) {
      setError('A confirmação não corresponde à nova senha.');
      return;
    }
    setStoredPassword(next);
    setError('');
    setCurrent('');
    setNext('');
    setConfirm('');
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <Card>
      <div className="flex items-start gap-4">
        <div className="p-3 bg-blue-500/10 rounded-lg">
          <KeyRound className="w-6 h-6 text-blue-400" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-slate-50 mb-2">Senha de Acesso</h4>
          <p className="text-sm text-slate-400 mb-4">
            Altere a senha única usada para entrar no sistema.
          </p>

          <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              type="password"
              label="Senha atual"
              placeholder="••••••"
              value={current}
              onChange={(e) => { setCurrent(e.target.value); if (error) setError(''); }}
            />
            <Input
              type="password"
              label="Nova senha"
              placeholder="Mín. 4 caracteres"
              value={next}
              onChange={(e) => { setNext(e.target.value); if (error) setError(''); }}
            />
            <Input
              type="password"
              label="Confirmar nova senha"
              placeholder="Repita a nova senha"
              value={confirm}
              onChange={(e) => { setConfirm(e.target.value); if (error) setError(''); }}
            />

            <div className="sm:col-span-3 flex items-center gap-3">
              <Button type="submit">
                <Save className="w-4 h-4 mr-2" />
                Salvar nova senha
              </Button>
              {error && <span className="text-xs text-rose-400">{error}</span>}
              {saved && (
                <span className="inline-flex items-center text-xs text-emerald-400">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Senha atualizada com sucesso!
                </span>
              )}
            </div>
          </form>
        </div>
      </div>
    </Card>
  );
}

// Template Modal Component
function TemplateModal({ isOpen, onClose, onAdd, onEdit, template }) {
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: 'Smartphone',
    condition: 'Novo',
    costPrice: '',
    salePrice: '',
    minQuantity: ''
  });
  const [errors, setErrors] = useState({});

  // Populate form when editing
  useState(() => {
    if (template) {
      setFormData({
        name: template.name,
        brand: template.brand,
        category: template.category,
        condition: template.condition,
        costPrice: template.costPrice.toString(),
        salePrice: template.salePrice.toString(),
        minQuantity: template.minQuantity.toString()
      });
    }
  });

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!formData.brand) newErrors.brand = 'Marca é obrigatória';
    if (!formData.costPrice || parseFloat(formData.costPrice) <= 0) {
      newErrors.costPrice = 'Preço de custo inválido';
    }
    if (!formData.salePrice || parseFloat(formData.salePrice) <= 0) {
      newErrors.salePrice = 'Preço de venda inválido';
    }
    if (!formData.minQuantity || parseInt(formData.minQuantity) < 0) {
      newErrors.minQuantity = 'Quantidade mínima inválida';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const templateData = {
      ...formData,
      costPrice: parseFloat(formData.costPrice),
      salePrice: parseFloat(formData.salePrice),
      minQuantity: parseInt(formData.minQuantity),
      id: template?.id
    };

    if (template) {
      onEdit(templateData);
    } else {
      onAdd(templateData);
    }
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={template ? 'Editar Modelo' : 'Novo Modelo'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Input
              label="Nome do Modelo *"
              placeholder="Ex: iPhone 15 Pro Max 256GB"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
            />
          </div>
          
          <Select
            label="Marca *"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            error={errors.brand}
            placeholder="Selecione a marca"
            options={[
              { value: '', label: 'Selecione a marca' },
              ...brands.map(brand => ({ value: brand, label: brand }))
            ]}
          />
          
          <Select
            label="Categoria *"
            name="category"
            value={formData.category}
            onChange={handleChange}
            options={[
              { value: 'Smartphone', label: 'Smartphone' },
              { value: 'Tablet', label: 'Tablet' },
              { value: 'Smartwatch', label: 'Smartwatch' },
              { value: 'Fones', label: 'Fones' },
              { value: 'Carregadores', label: 'Carregadores' },
              { value: 'Acessórios', label: 'Acessórios' }
            ]}
          />
          
          <Select
            label="Condição"
            name="condition"
            value={formData.condition}
            onChange={handleChange}
            options={[
              { value: 'Novo', label: 'Novo' },
              { value: 'Seminovo', label: 'Seminovo' }
            ]}
          />
          
          <Input
            label="Estoque Mínimo (Alerta) *"
            type="number"
            name="minQuantity"
            value={formData.minQuantity}
            onChange={handleChange}
            error={errors.minQuantity}
            placeholder="0"
            min="0"
          />
          
          <div className="col-span-2 grid grid-cols-2 gap-4">
            <Input
              label="Preço de Custo (R$) *"
              type="number"
              name="costPrice"
              value={formData.costPrice}
              onChange={handleChange}
              error={errors.costPrice}
              placeholder="0,00"
              step="0.01"
            />
            <Input
              label="Preço de Venda (R$) *"
              type="number"
              name="salePrice"
              value={formData.salePrice}
              onChange={handleChange}
              error={errors.salePrice}
              placeholder="0,00"
              step="0.01"
            />
          </div>
        </div>

        {/* Profit preview */}
        {formData.costPrice && formData.salePrice && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Margem de Lucro Estimada</span>
              <span className="text-emerald-400 font-semibold">
                {(((parseFloat(formData.salePrice || 0) - parseFloat(formData.costPrice || 0)) / parseFloat(formData.salePrice || 1)) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit">
            <Save className="w-4 h-4 mr-2" />
            {template ? 'Salvar Alterações' : 'Cadastrar Modelo'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
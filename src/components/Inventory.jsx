import { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  AlertTriangle,
  X
} from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Input, Select } from './ui/Input';
import { Badge } from './ui/Badge';
import { Modal } from './ui/Modal';
import { formatCurrency, formatDate, cn } from '../lib/utils';
import { brands, categories, conditions, statusTags } from '../data/mockData';

export function Inventory({ products, onAddProduct, onEditProduct, onDeleteProduct }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.imei.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesBrand = !selectedBrand || product.brand === selectedBrand;
      const matchesCategory = !selectedCategory || product.category === selectedCategory;
      const matchesCondition = !selectedCondition || product.condition === selectedCondition;
      const matchesStatus = !selectedStatus || product.status === selectedStatus;

      return matchesSearch && matchesBrand && matchesCategory && matchesCondition && matchesStatus;
    });
  }, [products, searchTerm, selectedBrand, selectedCategory, selectedCondition, selectedStatus]);

  // Get unique values for filters
  const uniqueBrands = [...new Set(products.map(p => p.brand))];
  const uniqueCategories = [...new Set(products.map(p => p.category))];

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedBrand('');
    setSelectedCategory('');
    setSelectedCondition('');
    setSelectedStatus('');
  };

  // Check if any filter is active
  const hasActiveFilters = searchTerm || selectedBrand || selectedCategory || selectedCondition || selectedStatus;

  // Low stock warning
  const isLowStock = (product) => product.quantity <= product.minQuantity;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-navy-900">Gestão de Inventário</h2>
          <p className="text-sm text-gray-500 mt-1">
            {filteredProducts.length} de {products.length} produtos
          </p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Produto
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-400" />
          <h3 className="text-lg font-semibold text-navy-900">Filtros Avançados</h3>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="ml-auto">
              <X className="w-3 h-3 mr-1" />
              Limpar
            </Button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Input
            placeholder="Buscar por nome, IMEI ou marca..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="lg:col-span-1"
          />
          <Select
            placeholder="Todas as Marcas"
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            options={[
              { value: '', label: 'Todas as Marcas' },
              ...uniqueBrands.map(brand => ({ value: brand, label: brand }))
            ]}
          />
          <Select
            placeholder="Todas as Categorias"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            options={[
              { value: '', label: 'Todas as Categorias' },
              ...uniqueCategories.map(cat => ({ value: cat, label: cat }))
            ]}
          />
          <Select
            placeholder="Condição"
            value={selectedCondition}
            onChange={(e) => setSelectedCondition(e.target.value)}
            options={[
              { value: '', label: 'Todas as Condições' },
              ...conditions.map(cond => ({ value: cond, label: cond }))
            ]}
          />
          <Select
            placeholder="Status"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            options={[
              { value: '', label: 'Todos os Status' },
              { value: 'disponivel', label: 'Disponível' },
              { value: 'reservado', label: 'Reservado' },
              { value: 'vendido', label: 'Vendido' }
            ]}
          />
        </div>
      </Card>

      {/* Products Table */}
      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-surface-light">
                <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Produto
                </th>
                <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Marca
                </th>
                <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Categoria
                </th>
                <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Condição
                </th>
                <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  IMEI
                </th>
                <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Preço
                </th>
                <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Qtd
                </th>
                <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredProducts.map((product) => (
                <tr 
                  key={product.id} 
                  className="hover:bg-surface-light transition-colors group"
                >
                  <td className="py-4 px-4">
                    <div>
                      <div className="font-medium text-navy-900">{product.name}</div>
                      <div className="text-xs text-gray-400">
                        Criado em {formatDate(product.createdAt)}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-600">{product.brand}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-600">{product.category}</span>
                  </td>
                  <td className="py-4 px-4">
                    <Badge variant={product.condition === 'Novo' ? 'success' : 'info'}>
                      {product.condition}
                    </Badge>
                  </td>
                  <td className="py-4 px-4">
                    <code className="text-xs bg-surface-light px-2 py-1 rounded text-gray-600 font-mono">
                      {product.imei}
                    </code>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <div className="font-medium text-navy-900">
                        {formatCurrency(product.salePrice)}
                      </div>
                      <div className="text-xs text-gray-400">
                        Custo: {formatCurrency(product.costPrice)}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        'font-medium',
                        isLowStock(product) ? 'text-rose-600' : 'text-navy-900'
                      )}>
                        {product.quantity}
                      </span>
                      {isLowStock(product) && (
                        <AlertTriangle className="w-4 h-4 text-rose-500" />
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={cn(
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
                      statusTags[product.status].color
                    )}>
                      {statusTags[product.status].label}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedProduct(product)}
                        title="Visualizar"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingProduct(product)}
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDeleteProduct(product.id)}
                        title="Excluir"
                        className="text-rose-500 hover:text-rose-600 hover:bg-rose-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Nenhum produto encontrado</p>
            <p className="text-sm text-gray-400 mt-1">
              Tente ajustar os filtros ou adicionar um novo produto
            </p>
          </div>
        )}
      </Card>

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={onAddProduct}
      />

      {/* Edit Product Modal */}
      {editingProduct && (
        <AddProductModal
          isOpen={!!editingProduct}
          onClose={() => setEditingProduct(null)}
          onAdd={onEditProduct}
          product={editingProduct}
        />
      )}

      {/* View Product Modal */}
      {selectedProduct && (
        <Modal
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          title="Detalhes do Produto"
          size="md"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-400 mb-1">Nome</p>
                <p className="text-navy-900 font-medium">{selectedProduct.name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Marca</p>
                <p className="text-navy-900">{selectedProduct.brand}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Categoria</p>
                <p className="text-navy-900">{selectedProduct.category}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Condição</p>
                <Badge variant={selectedProduct.condition === 'Novo' ? 'success' : 'info'}>
                  {selectedProduct.condition}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">IMEI</p>
                <code className="text-sm bg-surface-light px-2 py-1 rounded text-gray-600 font-mono">
                  {selectedProduct.imei}
                </code>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Quantidade</p>
                <p className={cn(
                  'text-navy-900',
                  isLowStock(selectedProduct) && 'text-rose-600'
                )}>
                  {selectedProduct.quantity} unidades
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Preço de Custo</p>
                <p className="text-navy-900">{formatCurrency(selectedProduct.costPrice)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Preço de Venda</p>
                <p className="text-emerald-600 font-semibold">
                  {formatCurrency(selectedProduct.salePrice)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Margem de Lucro</p>
                <p className="text-emerald-600">
                  {(((selectedProduct.salePrice - selectedProduct.costPrice) / selectedProduct.salePrice) * 100).toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Status</p>
                <span className={cn(
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
                  statusTags[selectedProduct.status].color
                )}>
                  {statusTags[selectedProduct.status].label}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Estoque Mínimo</p>
                <p className="text-navy-900">{selectedProduct.minQuantity} unidades</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Criado em</p>
                <p className="text-navy-900">{formatDate(selectedProduct.createdAt)}</p>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// Add/Edit Product Modal Component
function AddProductModal({ isOpen, onClose, onAdd, product }) {
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: '',
    condition: 'Novo',
    costPrice: '',
    salePrice: '',
    imei: '',
    quantity: '',
    minQuantity: '',
    status: 'disponivel'
  });
  const [errors, setErrors] = useState({});

  // Populate form when editing
  useState(() => {
    if (product) {
      setFormData({
        name: product.name,
        brand: product.brand,
        category: product.category,
        condition: product.condition,
        costPrice: product.costPrice.toString(),
        salePrice: product.salePrice.toString(),
        imei: product.imei,
        quantity: product.quantity.toString(),
        minQuantity: product.minQuantity.toString(),
        status: product.status
      });
    }
  });

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!formData.brand) newErrors.brand = 'Marca é obrigatória';
    if (!formData.category) newErrors.category = 'Categoria é obrigatória';
    if (!formData.imei.trim()) newErrors.imei = 'IMEI/Número de Série é obrigatório';
    if (!formData.costPrice || parseFloat(formData.costPrice) <= 0) {
      newErrors.costPrice = 'Preço de custo inválido';
    }
    if (!formData.salePrice || parseFloat(formData.salePrice) <= 0) {
      newErrors.salePrice = 'Preço de venda inválido';
    }
    if (!formData.quantity || parseInt(formData.quantity) < 0) {
      newErrors.quantity = 'Quantidade inválida';
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

    const productData = {
      ...formData,
      costPrice: parseFloat(formData.costPrice),
      salePrice: parseFloat(formData.salePrice),
      quantity: parseInt(formData.quantity),
      minQuantity: parseInt(formData.minQuantity),
      id: product?.id
    };

    onAdd(productData);
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
      title={product ? 'Editar Produto' : 'Novo Produto'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Input
              label="Nome do Produto *"
              placeholder="Ex: iPhone 15 Pro Max"
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
            error={errors.category}
            placeholder="Selecione a categoria"
            options={[
              { value: '', label: 'Selecione a categoria' },
              ...categories.map(cat => ({ value: cat, label: cat }))
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
          
          <Select
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={[
              { value: 'disponivel', label: 'Disponível' },
              { value: 'reservado', label: 'Reservado' },
              { value: 'vendido', label: 'Vendido' }
            ]}
          />
          
          <Input
            label="IMEI / Número de Série *"
            placeholder="Ex: 356789012345678"
            name="imei"
            value={formData.imei}
            onChange={handleChange}
            error={errors.imei}
            helperText="Identificador único do dispositivo"
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
          
          <div className="col-span-2 grid grid-cols-2 gap-4">
            <Input
              label="Quantidade *"
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              error={errors.quantity}
              placeholder="0"
              min="0"
            />
            <Input
              label="Quantidade Mínima (Alerta) *"
              type="number"
              name="minQuantity"
              value={formData.minQuantity}
              onChange={handleChange}
              error={errors.minQuantity}
              placeholder="0"
              min="0"
              helperText="Alerta quando estoque atingir este nível"
            />
          </div>
        </div>

        {/* Profit preview */}
        {formData.costPrice && formData.salePrice && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Margem de Lucro Estimada</span>
              <span className="text-emerald-600 font-semibold">
                {(((parseFloat(formData.salePrice || 0) - parseFloat(formData.costPrice || 0)) / parseFloat(formData.salePrice || 1)) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit">
            {product ? 'Salvar Alterações' : 'Adicionar Produto'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
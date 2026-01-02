import { useState, useMemo } from 'react';
import { Plus, Pencil, Trash2, Check, X, HelpCircle, Filter } from 'lucide-react';
import { Product } from '@/data/mockData';
import { useData } from '@/contexts/DataContext';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DeleteConfirmDialog } from '@/components/shared/DeleteConfirmDialog';

export const ProductsTable = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useData();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Product>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; id: string; name: string }>({
    isOpen: false,
    id: '',
    name: ''
  });

  // Filter states
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterSupplier, setFilterSupplier] = useState<string>('all');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  // Get unique categories and suppliers for filter options
  const categories = useMemo(() => {
    const unique = [...new Set(products.map(p => p.category))];
    return unique.sort();
  }, [products]);

  const suppliers = useMemo(() => {
    const unique = [...new Set(products.map(p => p.supplier).filter(Boolean))];
    return unique.sort();
  }, [products]);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (filterCategory !== 'all' && p.category !== filterCategory) return false;
      if (filterStatus !== 'all') {
        if (filterStatus === 'active' && p.status !== 'active') return false;
        if (filterStatus === 'inactive' && p.status !== 'inactive') return false;
      }
      if (filterSupplier !== 'all' && p.supplier !== filterSupplier) return false;
      return true;
    });
  }, [products, filterCategory, filterStatus, filterSupplier]);

  const hasActiveFilters = filterCategory !== 'all' || filterStatus !== 'all' || filterSupplier !== 'all';

  const clearFilters = () => {
    setFilterCategory('all');
    setFilterStatus('all');
    setFilterSupplier('all');
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setEditData(product);
  };

  const handleSave = () => {
    if (editingId) {
      updateProduct(editingId, editData);
    }
    setEditingId(null);
    setEditData({});
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
    setIsAdding(false);
  };

  const handleDeleteClick = (id: string, name: string) => {
    setDeleteDialog({ isOpen: true, id, name });
  };

  const handleDeleteConfirm = () => {
    deleteProduct(deleteDialog.id);
    setDeleteDialog({ isOpen: false, id: '', name: '' });
  };

  const handleAddNew = () => {
    const newProduct = {
      code: `PRD-${String(products.length + 1).padStart(3, '0')}`,
      name: editData.name || 'Novo Produto',
      category: editData.category || 'Geral',
      supplier: editData.supplier || '',
      unit: editData.unit || 'UN',
      purchaseCost: editData.purchaseCost || 0,
      variableCost: editData.variableCost || 0,
      currentPrice: editData.currentPrice || 0,
      status: 'active' as const,
    };
    addProduct(newProduct);
    setIsAdding(false);
    setEditData({});
  };

  // Neon input style helper
  const neonInputStyle = {
    background: '#000000',
    border: '1px solid rgba(0, 209, 255, 0.3)',
    color: '#F8FAFC',
    padding: '10px 14px',
    outline: 'none',
    borderRadius: '8px',
    transition: 'all 0.3s ease'
  };

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.currentTarget.style.border = '1px solid #00D1FF';
    e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 209, 255, 0.5), inset 0 0 10px rgba(0, 209, 255, 0.1)';
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.currentTarget.style.border = '1px solid rgba(0, 209, 255, 0.3)';
    e.currentTarget.style.boxShadow = 'none';
  };

  // Table header style
  const thStyle = {
    background: 'transparent',
    color: '#00D1FF',
    fontWeight: '700' as const,
    textShadow: '0 0 10px rgba(0, 209, 255, 0.5)',
    borderBottom: '1px solid rgba(0, 209, 255, 0.3)',
    padding: '16px'
  };

  // Filter select styles
  const filterSelectStyle = {
    background: 'rgba(0, 0, 0, 0.6)',
    border: '1px solid rgba(0, 209, 255, 0.25)',
    borderRadius: '8px',
  };

  return (
    <TooltipProvider>
      <div className="animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 
              className="text-2xl font-bold"
              style={{ 
                color: '#F8FAFC',
                textShadow: '0 0 10px rgba(248, 250, 252, 0.3)'
              }}
            >
              Cadastro de Produtos
            </h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.75)' }}>Gerencie seus produtos e custos</p>
          </div>
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all duration-300"
            style={{
              background: 'rgba(0, 209, 255, 0.08)',
              border: '1px solid #00D1FF',
              color: '#00D1FF',
              boxShadow: '0 0 15px rgba(0, 209, 255, 0.3), inset 0 0 20px rgba(0, 209, 255, 0.05)',
              backdropFilter: 'blur(10px)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(0, 209, 255, 0.15)';
              e.currentTarget.style.boxShadow = '0 0 25px rgba(0, 209, 255, 0.5), inset 0 0 25px rgba(0, 209, 255, 0.1)';
              e.currentTarget.style.textShadow = '0 0 10px rgba(0, 209, 255, 0.8)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(0, 209, 255, 0.08)';
              e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 209, 255, 0.3), inset 0 0 20px rgba(0, 209, 255, 0.05)';
              e.currentTarget.style.textShadow = 'none';
            }}
          >
            <Plus className="w-4 h-4" style={{ filter: 'drop-shadow(0 0 4px #00D1FF)' }} />
            Novo Produto
          </button>
        </div>

        {/* Quick Filters */}
        <div 
          className="flex items-center gap-4 mb-4 p-3 rounded-lg"
          style={{
            background: 'rgba(0, 0, 0, 0.4)',
            border: '1px solid rgba(0, 209, 255, 0.15)',
          }}
        >
          <div className="flex items-center gap-2" style={{ color: 'rgba(0, 209, 255, 0.7)' }}>
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Filtros:</span>
          </div>

          <div className="flex items-center gap-3 flex-1">
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger 
                className="w-[160px] h-9 text-sm"
                style={{
                  ...filterSelectStyle,
                  color: filterCategory !== 'all' ? '#00D1FF' : 'rgba(255, 255, 255, 0.7)',
                }}
              >
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent style={{ background: '#0a0a0a', border: '1px solid rgba(0, 209, 255, 0.3)' }}>
                <SelectItem value="all" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Todas Categorias</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat} style={{ color: '#F8FAFC' }}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger 
                className="w-[140px] h-9 text-sm"
                style={{
                  ...filterSelectStyle,
                  color: filterStatus !== 'all' ? '#00D1FF' : 'rgba(255, 255, 255, 0.7)',
                }}
              >
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent style={{ background: '#0a0a0a', border: '1px solid rgba(0, 209, 255, 0.3)' }}>
                <SelectItem value="all" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Todos Status</SelectItem>
                <SelectItem value="active" style={{ color: '#39FF14' }}>Ativo</SelectItem>
                <SelectItem value="inactive" style={{ color: '#FF007A' }}>Inativo</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterSupplier} onValueChange={setFilterSupplier}>
              <SelectTrigger 
                className="w-[160px] h-9 text-sm"
                style={{
                  ...filterSelectStyle,
                  color: filterSupplier !== 'all' ? '#00D1FF' : 'rgba(255, 255, 255, 0.7)',
                }}
              >
                <SelectValue placeholder="Fornecedor" />
              </SelectTrigger>
              <SelectContent style={{ background: '#0a0a0a', border: '1px solid rgba(0, 209, 255, 0.3)' }}>
                <SelectItem value="all" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Todos Fornecedores</SelectItem>
                {suppliers.map(sup => (
                  <SelectItem key={sup} value={sup} style={{ color: '#F8FAFC' }}>{sup}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm px-3 py-1.5 rounded transition-all duration-200"
              style={{
                color: '#FF007A',
                border: '1px solid rgba(255, 0, 122, 0.3)',
                background: 'rgba(255, 0, 122, 0.1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 0, 122, 0.2)';
                e.currentTarget.style.boxShadow = '0 0 10px rgba(255, 0, 122, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 0, 122, 0.1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Limpar
            </button>
          )}

          <span className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
            {filteredProducts.length} de {products.length} produtos
          </span>
        </div>

        <div 
          className="rounded-xl overflow-hidden"
          style={{
            background: '#000000',
            border: '1px solid #00D1FF',
            boxShadow: '0 0 20px rgba(0, 209, 255, 0.2)'
          }}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th style={thStyle}>Código</th>
                  <th style={thStyle}>Nome</th>
                  <th style={thStyle}>Categoria</th>
                  <th style={thStyle}>Fornecedor</th>
                  <th style={thStyle}>Unidade</th>
                  <th style={{ ...thStyle, textAlign: 'right' }}>Custo Compra</th>
                  <th style={{ ...thStyle, textAlign: 'right' }}>Custo Variável</th>
                  <th style={{ ...thStyle, textAlign: 'right' }}>
                    <div className="flex items-center justify-end gap-1.5">
                      <span>Preço Venda</span>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button className="focus:outline-none">
                            <HelpCircle 
                              className="w-4 h-4 cursor-help" 
                              style={{ color: 'rgba(0, 209, 255, 0.6)' }} 
                            />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent 
                          side="top" 
                          className="max-w-[280px] text-center"
                          style={{
                            background: 'rgba(0, 0, 0, 0.95)',
                            border: '1px solid rgba(0, 209, 255, 0.4)',
                            color: '#F8FAFC',
                            boxShadow: '0 0 20px rgba(0, 209, 255, 0.2)'
                          }}
                        >
                          <p className="text-sm">
                            Preço final sugerido pelo módulo de precificação. Este valor é calculado automaticamente considerando custos, taxas e margem de lucro desejada.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </th>
                  <th style={thStyle}>Status</th>
                  <th style={{ ...thStyle, textAlign: 'right' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {isAdding && (
                  <tr 
                    style={{
                      background: 'rgba(0, 209, 255, 0.05)',
                      boxShadow: 'inset 0 0 30px rgba(0, 209, 255, 0.08)'
                    }}
                  >
                    <td style={{ padding: '16px', color: 'rgba(255, 255, 255, 0.6)' }}>
                      <span>Auto</span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <input
                        type="text"
                        style={neonInputStyle}
                        placeholder="Nome do produto"
                        value={editData.name || ''}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                      />
                    </td>
                    <td style={{ padding: '16px' }}>
                      <input
                        type="text"
                        style={neonInputStyle}
                        placeholder="Categoria"
                        value={editData.category || ''}
                        onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                      />
                    </td>
                    <td style={{ padding: '16px' }}>
                      <input
                        type="text"
                        style={neonInputStyle}
                        placeholder="Fornecedor"
                        value={editData.supplier || ''}
                        onChange={(e) => setEditData({ ...editData, supplier: e.target.value })}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                      />
                    </td>
                    <td style={{ padding: '16px' }}>
                      <input
                        type="text"
                        style={{ ...neonInputStyle, width: '64px' }}
                        placeholder="UN"
                        value={editData.unit || ''}
                        onChange={(e) => setEditData({ ...editData, unit: e.target.value })}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                      />
                    </td>
                    <td style={{ padding: '16px' }}>
                      <input
                        type="number"
                        style={{ ...neonInputStyle, width: '96px', textAlign: 'right' }}
                        placeholder="0.00"
                        value={editData.purchaseCost || ''}
                        onChange={(e) => setEditData({ ...editData, purchaseCost: parseFloat(e.target.value) })}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                      />
                    </td>
                    <td style={{ padding: '16px' }}>
                      <input
                        type="number"
                        style={{ ...neonInputStyle, width: '96px', textAlign: 'right' }}
                        placeholder="0.00"
                        value={editData.variableCost || ''}
                        onChange={(e) => setEditData({ ...editData, variableCost: parseFloat(e.target.value) })}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                      />
                    </td>
                    <td style={{ padding: '16px' }}>
                      <input
                        type="number"
                        style={{ ...neonInputStyle, width: '96px', textAlign: 'right' }}
                        placeholder="0.00"
                        value={editData.currentPrice || ''}
                        onChange={(e) => setEditData({ ...editData, currentPrice: parseFloat(e.target.value) })}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                      />
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span 
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                        style={{
                          background: 'transparent',
                          border: '1px solid #39FF14',
                          color: '#39FF14',
                          boxShadow: '0 0 10px rgba(57, 255, 20, 0.4)',
                        }}
                      >
                        Ativo
                      </span>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={handleAddNew} 
                          className="p-2 rounded-lg transition-all duration-300"
                          style={{ 
                            color: '#39FF14',
                            filter: 'drop-shadow(0 0 6px #39FF14)'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(57, 255, 20, 0.15)';
                            e.currentTarget.style.boxShadow = '0 0 15px rgba(57, 255, 20, 0.5)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={handleCancel} 
                          className="p-2 rounded-lg transition-all duration-300"
                          style={{ 
                            color: '#FF007A',
                            filter: 'drop-shadow(0 0 6px #FF007A)'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 0, 122, 0.15)';
                            e.currentTarget.style.boxShadow = '0 0 15px rgba(255, 0, 122, 0.5)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
                {filteredProducts.map((product) => (
                  <tr 
                    key={product.id}
                    className="transition-all duration-300"
                    style={{
                      background: 'transparent',
                      borderBottom: '1px solid rgba(0, 209, 255, 0.1)'
                    }}
                    onMouseEnter={(e) => {
                      if (editingId !== product.id) {
                        e.currentTarget.style.background = 'rgba(0, 209, 255, 0.05)';
                        e.currentTarget.style.borderLeft = '3px solid #00D1FF';
                        e.currentTarget.style.boxShadow = 'inset 0 0 30px rgba(0, 209, 255, 0.08)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (editingId !== product.id) {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.borderLeft = 'none';
                        e.currentTarget.style.boxShadow = 'none';
                      }
                    }}
                  >
                    {editingId === product.id ? (
                      <>
                        <td style={{ padding: '16px', color: 'rgba(0, 209, 255, 0.8)' }}>{product.code}</td>
                        <td style={{ padding: '16px' }}>
                          <input
                            type="text"
                            style={neonInputStyle}
                            value={editData.name || ''}
                            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                            onFocus={handleInputFocus}
                            onBlur={handleInputBlur}
                          />
                        </td>
                        <td style={{ padding: '16px' }}>
                          <input
                            type="text"
                            style={neonInputStyle}
                            value={editData.category || ''}
                            onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                            onFocus={handleInputFocus}
                            onBlur={handleInputBlur}
                          />
                        </td>
                        <td style={{ padding: '16px' }}>
                          <input
                            type="text"
                            style={neonInputStyle}
                            value={editData.supplier || ''}
                            onChange={(e) => setEditData({ ...editData, supplier: e.target.value })}
                            onFocus={handleInputFocus}
                            onBlur={handleInputBlur}
                          />
                        </td>
                        <td style={{ padding: '16px' }}>
                          <input
                            type="text"
                            style={{ ...neonInputStyle, width: '64px' }}
                            value={editData.unit || ''}
                            onChange={(e) => setEditData({ ...editData, unit: e.target.value })}
                            onFocus={handleInputFocus}
                            onBlur={handleInputBlur}
                          />
                        </td>
                        <td style={{ padding: '16px' }}>
                          <input
                            type="number"
                            style={{ ...neonInputStyle, width: '96px', textAlign: 'right' }}
                            value={editData.purchaseCost || ''}
                            onChange={(e) => setEditData({ ...editData, purchaseCost: parseFloat(e.target.value) })}
                            onFocus={handleInputFocus}
                            onBlur={handleInputBlur}
                          />
                        </td>
                        <td style={{ padding: '16px' }}>
                          <input
                            type="number"
                            style={{ ...neonInputStyle, width: '96px', textAlign: 'right' }}
                            value={editData.variableCost || ''}
                            onChange={(e) => setEditData({ ...editData, variableCost: parseFloat(e.target.value) })}
                            onFocus={handleInputFocus}
                            onBlur={handleInputBlur}
                          />
                        </td>
                        <td style={{ padding: '16px' }}>
                          <input
                            type="number"
                            style={{ ...neonInputStyle, width: '96px', textAlign: 'right' }}
                            value={editData.currentPrice || ''}
                            onChange={(e) => setEditData({ ...editData, currentPrice: parseFloat(e.target.value) })}
                            onFocus={handleInputFocus}
                            onBlur={handleInputBlur}
                          />
                        </td>
                        <td style={{ padding: '16px' }}>
                          <select
                            style={{
                              ...neonInputStyle,
                              width: '100px',
                            }}
                            value={editData.status || 'active'}
                            onChange={(e) => setEditData({ ...editData, status: e.target.value as 'active' | 'inactive' })}
                            onFocus={handleInputFocus}
                            onBlur={handleInputBlur}
                          >
                            <option value="active" style={{ background: '#000000' }}>Ativo</option>
                            <option value="inactive" style={{ background: '#000000' }}>Inativo</option>
                          </select>
                        </td>
                        <td style={{ padding: '16px', textAlign: 'right' }}>
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={handleSave} 
                              className="p-2 rounded-lg transition-all duration-300"
                              style={{ 
                                color: '#39FF14',
                                filter: 'drop-shadow(0 0 6px #39FF14)'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(57, 255, 20, 0.15)';
                                e.currentTarget.style.boxShadow = '0 0 15px rgba(57, 255, 20, 0.5)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.boxShadow = 'none';
                              }}
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={handleCancel} 
                              className="p-2 rounded-lg transition-all duration-300"
                              style={{ 
                                color: '#FF007A',
                                filter: 'drop-shadow(0 0 6px #FF007A)'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 0, 122, 0.15)';
                                e.currentTarget.style.boxShadow = '0 0 15px rgba(255, 0, 122, 0.5)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.boxShadow = 'none';
                              }}
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td 
                          style={{ 
                            color: '#00D1FF', 
                            padding: '16px',
                            textShadow: '0 0 8px rgba(0, 209, 255, 0.4)'
                          }}
                        >
                          {product.code}
                        </td>
                        <td style={{ color: '#F8FAFC', padding: '16px', fontWeight: '500' }}>{product.name}</td>
                        <td style={{ color: 'rgba(255, 255, 255, 0.7)', padding: '16px' }}>{product.category}</td>
                        <td style={{ color: 'rgba(255, 255, 255, 0.7)', padding: '16px' }}>{product.supplier}</td>
                        <td style={{ color: 'rgba(255, 255, 255, 0.7)', padding: '16px' }}>{product.unit}</td>
                        <td style={{ color: '#F8FAFC', padding: '16px', textAlign: 'right', fontFamily: 'monospace' }}>{formatCurrency(product.purchaseCost)}</td>
                        <td style={{ color: '#F8FAFC', padding: '16px', textAlign: 'right', fontFamily: 'monospace' }}>{formatCurrency(product.variableCost)}</td>
                        <td 
                          style={{ 
                            color: '#39FF14', 
                            padding: '16px', 
                            textAlign: 'right', 
                            fontFamily: 'monospace',
                            fontWeight: '600',
                            textShadow: '0 0 8px rgba(57, 255, 20, 0.5)'
                          }}
                        >
                          {formatCurrency(product.currentPrice)}
                        </td>
                        <td style={{ padding: '16px' }}>
                          {product.status === 'active' ? (
                            <span 
                              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                              style={{
                                background: 'transparent',
                                border: '1px solid #39FF14',
                                color: '#39FF14',
                                boxShadow: '0 0 10px rgba(57, 255, 20, 0.4), inset 0 0 8px rgba(57, 255, 20, 0.1)',
                                textShadow: '0 0 8px rgba(57, 255, 20, 0.6)'
                              }}
                            >
                              Ativo
                            </span>
                          ) : (
                            <span 
                              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                              style={{
                                background: 'transparent',
                                border: '1px solid #FF007A',
                                color: '#FF007A',
                                boxShadow: '0 0 10px rgba(255, 0, 122, 0.4), inset 0 0 8px rgba(255, 0, 122, 0.1)',
                                textShadow: '0 0 8px rgba(255, 0, 122, 0.6)'
                              }}
                            >
                              Inativo
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '16px', textAlign: 'right' }}>
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => handleEdit(product)} 
                              className="p-2 rounded-lg transition-all duration-300"
                              style={{ 
                                color: '#00D1FF',
                                filter: 'drop-shadow(0 0 4px #00D1FF)'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(0, 209, 255, 0.15)';
                                e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 209, 255, 0.5)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.boxShadow = 'none';
                              }}
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteClick(product.id, product.name)} 
                              className="p-2 rounded-lg transition-all duration-300"
                              style={{ 
                                color: '#FF007A',
                                filter: 'drop-shadow(0 0 4px #FF007A)'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 0, 122, 0.15)';
                                e.currentTarget.style.boxShadow = '0 0 15px rgba(255, 0, 122, 0.5)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.boxShadow = 'none';
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <DeleteConfirmDialog
          isOpen={deleteDialog.isOpen}
          onClose={() => setDeleteDialog({ isOpen: false, id: '', name: '' })}
          onConfirm={handleDeleteConfirm}
          itemName={deleteDialog.name}
        />
      </div>
    </TooltipProvider>
  );
};

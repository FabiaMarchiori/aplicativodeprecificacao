import { useState } from 'react';
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import { mockProducts, Product } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

export const ProductsTable = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Product>>({});
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setEditData(product);
  };

  const handleSave = () => {
    if (editingId) {
      setProducts(products.map(p => 
        p.id === editingId ? { ...p, ...editData } as Product : p
      ));
      toast({ title: 'Produto atualizado', description: 'As alterações foram salvas.' });
    }
    setEditingId(null);
    setEditData({});
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
    toast({ title: 'Produto excluído', variant: 'destructive' });
  };

  const handleAddNew = () => {
    const newProduct: Product = {
      id: Date.now().toString(),
      code: `PRD-${String(products.length + 1).padStart(3, '0')}`,
      name: editData.name || 'Novo Produto',
      category: editData.category || 'Geral',
      supplier: editData.supplier || '',
      unit: editData.unit || 'UN',
      purchaseCost: editData.purchaseCost || 0,
      variableCost: editData.variableCost || 0,
      currentPrice: editData.currentPrice || 0,
      status: 'active',
    };
    setProducts([...products, newProduct]);
    setIsAdding(false);
    setEditData({});
    toast({ title: 'Produto adicionado', description: 'Novo produto cadastrado com sucesso.' });
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

  return (
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
          <p style={{ color: '#94a3b8' }}>Gerencie seus produtos e custos</p>
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
                <th style={{ ...thStyle, textAlign: 'right' }}>Preço Venda</th>
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
                  <td style={{ padding: '16px', color: '#64748b' }}>
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
                        boxShadow: '0 0 10px rgba(57, 255, 20, 0.4), inset 0 0 8px rgba(57, 255, 20, 0.1)',
                        textShadow: '0 0 8px rgba(57, 255, 20, 0.6)'
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
              {products.map((product) => (
                <tr 
                  key={product.id}
                  className="transition-all duration-300"
                  style={{
                    background: 'transparent',
                    borderBottom: '1px solid rgba(0, 209, 255, 0.1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(0, 209, 255, 0.05)';
                    e.currentTarget.style.borderLeft = '3px solid #00D1FF';
                    e.currentTarget.style.boxShadow = 'inset 0 0 30px rgba(0, 209, 255, 0.08), -5px 0 15px rgba(0, 209, 255, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.borderLeft = 'none';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {editingId === product.id ? (
                    <>
                      <td style={{ padding: '16px', color: '#00D1FF', fontFamily: 'monospace' }}>{product.code}</td>
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
                          style={{ ...neonInputStyle, cursor: 'pointer' }}
                          value={editData.status || ''}
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
                      <td style={{ padding: '16px', color: '#00D1FF', fontFamily: 'monospace', fontSize: '14px' }}>{product.code}</td>
                      <td style={{ padding: '16px', color: '#F8FAFC', fontWeight: '500' }}>{product.name}</td>
                      <td style={{ padding: '16px', color: '#64748b' }}>{product.category}</td>
                      <td style={{ padding: '16px', color: '#64748b' }}>{product.supplier}</td>
                      <td style={{ padding: '16px', color: '#64748b' }}>{product.unit}</td>
                      <td style={{ padding: '16px', color: '#F8FAFC', textAlign: 'right', fontFamily: 'monospace' }}>{formatCurrency(product.purchaseCost)}</td>
                      <td style={{ padding: '16px', color: '#F8FAFC', textAlign: 'right', fontFamily: 'monospace' }}>{formatCurrency(product.variableCost)}</td>
                      <td style={{ 
                        padding: '16px', 
                        color: '#39FF14', 
                        textAlign: 'right', 
                        fontFamily: 'monospace',
                        fontWeight: '600',
                        textShadow: '0 0 15px rgba(57, 255, 20, 0.8), 0 0 30px rgba(57, 255, 20, 0.4)'
                      }}>
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
                            style={{ color: 'rgba(248, 250, 252, 0.4)' }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.color = '#00D1FF';
                              e.currentTarget.style.filter = 'drop-shadow(0 0 8px #00D1FF)';
                              e.currentTarget.style.background = 'rgba(0, 209, 255, 0.1)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.color = 'rgba(248, 250, 252, 0.4)';
                              e.currentTarget.style.filter = 'none';
                              e.currentTarget.style.background = 'transparent';
                            }}
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(product.id)} 
                            className="p-2 rounded-lg transition-all duration-300"
                            style={{ color: 'rgba(248, 250, 252, 0.4)' }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.color = '#FF007A';
                              e.currentTarget.style.filter = 'drop-shadow(0 0 8px #FF007A)';
                              e.currentTarget.style.background = 'rgba(255, 0, 122, 0.1)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.color = 'rgba(248, 250, 252, 0.4)';
                              e.currentTarget.style.filter = 'none';
                              e.currentTarget.style.background = 'transparent';
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
    </div>
  );
};

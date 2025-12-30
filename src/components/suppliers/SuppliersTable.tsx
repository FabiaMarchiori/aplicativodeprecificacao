import { useState } from 'react';
import { Plus, Pencil, Trash2, Check, X, Globe, MapPin } from 'lucide-react';
import { mockSuppliers, Supplier } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

export const SuppliersTable = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Supplier>>({});
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const handleEdit = (supplier: Supplier) => {
    setEditingId(supplier.id);
    setEditData(supplier);
  };

  const handleSave = () => {
    if (editingId) {
      setSuppliers(suppliers.map(s => 
        s.id === editingId ? { ...s, ...editData } as Supplier : s
      ));
      toast({ title: 'Fornecedor atualizado' });
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
    setSuppliers(suppliers.filter(s => s.id !== id));
    toast({ title: 'Fornecedor excluído', variant: 'destructive' });
  };

  const handleAddNew = () => {
    const newSupplier: Supplier = {
      id: Date.now().toString(),
      name: editData.name || 'Novo Fornecedor',
      type: editData.type || 'national',
      averageDeliveryDays: editData.averageDeliveryDays || 0,
      averageLogisticsCost: editData.averageLogisticsCost || 0,
      notes: editData.notes || '',
    };
    setSuppliers([...suppliers, newSupplier]);
    setIsAdding(false);
    setEditData({});
    toast({ title: 'Fornecedor adicionado' });
  };

  // Neon input styles with focus effects
  const inputStyle = {
    background: '#000000',
    border: '1px solid rgba(255, 172, 0, 0.3)',
    color: '#F8FAFC',
    padding: '10px 14px',
    outline: 'none',
    borderRadius: '8px',
    transition: 'all 0.3s ease'
  };

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.currentTarget.style.border = '1px solid #FFAC00';
    e.currentTarget.style.boxShadow = '0 0 15px rgba(255, 172, 0, 0.5), inset 0 0 10px rgba(255, 172, 0, 0.1)';
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.currentTarget.style.border = '1px solid rgba(255, 172, 0, 0.3)';
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
            Fornecedores
          </h2>
          <p style={{ color: '#94a3b8' }}>Gerencie seus fornecedores e custos logísticos</p>
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
          Novo Fornecedor
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
                <th style={thStyle}>Nome do Fornecedor</th>
                <th style={thStyle}>Tipo</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Prazo Médio (dias)</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Custo Logístico</th>
                <th style={thStyle}>Observações</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {isAdding && (
                <tr 
                  style={{
                    background: 'rgba(255, 172, 0, 0.05)',
                    boxShadow: 'inset 0 0 30px rgba(255, 172, 0, 0.08)'
                  }}
                >
                  <td style={{ padding: '16px' }}>
                    <input
                      type="text"
                      style={inputStyle}
                      className="w-full"
                      placeholder="Nome do fornecedor"
                      value={editData.name || ''}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                    />
                  </td>
                  <td style={{ padding: '16px' }}>
                    <select
                      style={{ ...inputStyle, width: '100%' }}
                      value={editData.type || 'national'}
                      onChange={(e) => setEditData({ ...editData, type: e.target.value as 'national' | 'imported' })}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                    >
                      <option value="national" style={{ background: '#000000' }}>Nacional</option>
                      <option value="imported" style={{ background: '#000000' }}>Importado</option>
                    </select>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <input
                      type="number"
                      style={{ ...inputStyle, width: '96px', textAlign: 'right' }}
                      placeholder="0"
                      value={editData.averageDeliveryDays || ''}
                      onChange={(e) => setEditData({ ...editData, averageDeliveryDays: parseInt(e.target.value) })}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                    />
                  </td>
                  <td style={{ padding: '16px' }}>
                    <input
                      type="number"
                      style={{ ...inputStyle, width: '128px', textAlign: 'right' }}
                      placeholder="0.00"
                      value={editData.averageLogisticsCost || ''}
                      onChange={(e) => setEditData({ ...editData, averageLogisticsCost: parseFloat(e.target.value) })}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                    />
                  </td>
                  <td style={{ padding: '16px' }}>
                    <input
                      type="text"
                      style={inputStyle}
                      className="w-full"
                      placeholder="Observações"
                      value={editData.notes || ''}
                      onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                    />
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
              {suppliers.map((supplier) => (
                <tr 
                  key={supplier.id}
                  className="transition-all duration-300"
                  style={{
                    background: 'transparent',
                    borderBottom: '1px solid rgba(0, 209, 255, 0.1)'
                  }}
                  onMouseEnter={(e) => {
                    if (editingId !== supplier.id) {
                      e.currentTarget.style.background = 'rgba(0, 209, 255, 0.05)';
                      e.currentTarget.style.borderLeft = '3px solid #00D1FF';
                      e.currentTarget.style.boxShadow = 'inset 0 0 30px rgba(0, 209, 255, 0.08)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (editingId !== supplier.id) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.borderLeft = 'none';
                      e.currentTarget.style.boxShadow = 'none';
                    }
                  }}
                >
                  {editingId === supplier.id ? (
                    <>
                      <td style={{ padding: '16px' }}>
                        <input
                          type="text"
                          style={inputStyle}
                          className="w-full"
                          value={editData.name || ''}
                          onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                          onFocus={handleInputFocus}
                          onBlur={handleInputBlur}
                        />
                      </td>
                      <td style={{ padding: '16px' }}>
                        <select
                          style={{ ...inputStyle, width: '100%' }}
                          value={editData.type || 'national'}
                          onChange={(e) => setEditData({ ...editData, type: e.target.value as 'national' | 'imported' })}
                          onFocus={handleInputFocus}
                          onBlur={handleInputBlur}
                        >
                          <option value="national" style={{ background: '#000000' }}>Nacional</option>
                          <option value="imported" style={{ background: '#000000' }}>Importado</option>
                        </select>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <input
                          type="number"
                          style={{ ...inputStyle, width: '96px', textAlign: 'right' }}
                          value={editData.averageDeliveryDays || ''}
                          onChange={(e) => setEditData({ ...editData, averageDeliveryDays: parseInt(e.target.value) })}
                          onFocus={handleInputFocus}
                          onBlur={handleInputBlur}
                        />
                      </td>
                      <td style={{ padding: '16px' }}>
                        <input
                          type="number"
                          style={{ ...inputStyle, width: '128px', textAlign: 'right' }}
                          value={editData.averageLogisticsCost || ''}
                          onChange={(e) => setEditData({ ...editData, averageLogisticsCost: parseFloat(e.target.value) })}
                          onFocus={handleInputFocus}
                          onBlur={handleInputBlur}
                        />
                      </td>
                      <td style={{ padding: '16px' }}>
                        <input
                          type="text"
                          style={inputStyle}
                          className="w-full"
                          value={editData.notes || ''}
                          onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                          onFocus={handleInputFocus}
                          onBlur={handleInputBlur}
                        />
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
                      <td style={{ color: '#F8FAFC', padding: '16px', fontWeight: '500' }}>{supplier.name}</td>
                      <td style={{ padding: '16px' }}>
                        {supplier.type === 'national' ? (
                          <span 
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                            style={{
                              background: 'transparent',
                              border: '1px solid #39FF14',
                              color: '#39FF14',
                              boxShadow: '0 0 10px rgba(57, 255, 20, 0.4), inset 0 0 8px rgba(57, 255, 20, 0.1)',
                              textShadow: '0 0 8px rgba(57, 255, 20, 0.6)'
                            }}
                          >
                            <MapPin className="w-3 h-3" style={{ filter: 'drop-shadow(0 0 4px #39FF14)' }} />
                            Nacional
                          </span>
                        ) : (
                          <span 
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                            style={{
                              background: 'transparent',
                              border: '1px solid #FFAC00',
                              color: '#FFAC00',
                              boxShadow: '0 0 12px rgba(255, 172, 0, 0.5), inset 0 0 10px rgba(255, 172, 0, 0.15)',
                              textShadow: '0 0 10px rgba(255, 172, 0, 0.7)'
                            }}
                          >
                            <Globe className="w-3 h-3" style={{ filter: 'drop-shadow(0 0 5px #FFAC00)' }} />
                            Importado
                          </span>
                        )}
                      </td>
                      <td style={{ 
                        color: '#00D1FF', 
                        textAlign: 'right',
                        padding: '16px',
                        textShadow: '0 0 6px rgba(0, 209, 255, 0.4)',
                        fontFamily: 'monospace'
                      }}>
                        {supplier.averageDeliveryDays} dias
                      </td>
                      <td style={{ 
                        color: '#39FF14', 
                        textAlign: 'right',
                        padding: '16px',
                        textShadow: '0 0 8px rgba(57, 255, 20, 0.5)',
                        fontFamily: 'monospace'
                      }}>
                        {formatCurrency(supplier.averageLogisticsCost)}
                      </td>
                      <td style={{ color: '#64748b', padding: '16px', maxWidth: '200px' }} className="truncate">
                        {supplier.notes}
                      </td>
                      <td style={{ padding: '16px', textAlign: 'right' }}>
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleEdit(supplier)} 
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
                            onClick={() => handleDelete(supplier.id)} 
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

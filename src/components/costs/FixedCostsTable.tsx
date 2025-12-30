import { useState } from 'react';
import { Plus, Pencil, Trash2, Check, X, Info } from 'lucide-react';
import { mockFixedCosts, FixedCost } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

export const FixedCostsTable = () => {
  const [costs, setCosts] = useState<FixedCost[]>(mockFixedCosts);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<FixedCost>>({});
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();

  const totalCosts = costs.reduce((sum, c) => sum + c.monthlyValue, 0);
  const totalAllocation = costs.reduce((sum, c) => sum + c.allocationPercent, 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const handleEdit = (cost: FixedCost) => {
    setEditingId(cost.id);
    setEditData(cost);
  };

  const handleSave = () => {
    if (editingId) {
      setCosts(costs.map(c => 
        c.id === editingId ? { ...c, ...editData } as FixedCost : c
      ));
      toast({ title: 'Custo atualizado' });
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
    setCosts(costs.filter(c => c.id !== id));
    toast({ title: 'Custo excluído', variant: 'destructive' });
  };

  const handleAddNew = () => {
    const newCost: FixedCost = {
      id: Date.now().toString(),
      type: editData.type || 'Novo Custo',
      monthlyValue: editData.monthlyValue || 0,
      allocationPercent: editData.allocationPercent || 0,
    };
    setCosts([...costs, newCost]);
    setIsAdding(false);
    setEditData({});
    toast({ title: 'Custo adicionado' });
  };

  // Neon input style with focus glow
  const inputStyle = {
    background: '#000000',
    border: '1px solid rgba(57, 255, 20, 0.3)',
    color: '#F8FAFC',
    padding: '10px 14px',
    outline: 'none',
    borderRadius: '8px',
    transition: 'all 0.3s ease'
  };

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.border = '1px solid #39FF14';
    e.currentTarget.style.boxShadow = '0 0 15px rgba(57, 255, 20, 0.5), inset 0 0 10px rgba(57, 255, 20, 0.1)';
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.border = '1px solid rgba(57, 255, 20, 0.3)';
    e.currentTarget.style.boxShadow = 'none';
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 
            className="text-2xl font-bold"
            style={{ 
              color: '#F8FAFC',
              textShadow: '0 0 10px rgba(248, 250, 252, 0.3)'
            }}
          >
            Custos Fixos
          </h2>
          <p style={{ color: '#94a3b8' }}>Configure os custos fixos mensais da empresa</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all duration-300"
          style={{
            background: 'transparent',
            border: '2px solid #00D1FF',
            color: '#00D1FF',
            boxShadow: '0 0 15px rgba(0, 209, 255, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(0, 209, 255, 0.15)';
            e.currentTarget.style.boxShadow = '0 0 25px rgba(0, 209, 255, 0.5), inset 0 0 20px rgba(0, 209, 255, 0.1)';
            e.currentTarget.style.textShadow = '0 0 10px rgba(0, 209, 255, 0.8)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 209, 255, 0.3)';
            e.currentTarget.style.textShadow = 'none';
          }}
        >
          <Plus className="w-4 h-4" style={{ filter: 'drop-shadow(0 0 4px #00D1FF)' }} />
          Novo Custo
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Total Custos Fixos - Verde Neon */}
        <div 
          className="p-6 rounded-xl"
          style={{
            background: '#000000',
            border: '1px solid #39FF14',
            boxShadow: '0 0 20px rgba(57, 255, 20, 0.3), 0 0 40px rgba(57, 255, 20, 0.15)'
          }}
        >
          <h3 
            className="text-sm font-medium mb-1"
            style={{ color: '#39FF14', textShadow: '0 0 8px rgba(57, 255, 20, 0.4)' }}
          >
            Total Custos Fixos
          </h3>
          <p 
            className="text-2xl font-bold mono"
            style={{ 
              color: '#39FF14',
              textShadow: '0 0 20px rgba(57, 255, 20, 0.8), 0 0 40px rgba(57, 255, 20, 0.4)'
            }}
          >
            {formatCurrency(totalCosts)}
          </p>
          <p className="text-sm mt-1" style={{ color: '#64748b' }}>Por mês</p>
        </div>

        {/* Alocação Total - Ciano Elétrico */}
        <div 
          className="p-6 rounded-xl"
          style={{
            background: '#000000',
            border: '1px solid #00D1FF',
            boxShadow: '0 0 20px rgba(0, 209, 255, 0.3), 0 0 40px rgba(0, 209, 255, 0.15)'
          }}
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 
                className="text-sm font-medium mb-1"
                style={{ color: '#00D1FF', textShadow: '0 0 8px rgba(0, 209, 255, 0.4)' }}
              >
                Alocação Total
              </h3>
              <p 
                className="text-2xl font-bold mono"
                style={{ 
                  color: '#00D1FF',
                  textShadow: '0 0 20px rgba(0, 209, 255, 0.8), 0 0 40px rgba(0, 209, 255, 0.4)'
                }}
              >
                {totalAllocation}%
              </p>
            </div>
            {totalAllocation !== 100 && (
              <div 
                className="flex items-center gap-1 text-sm"
                style={{ color: '#FFAC00', textShadow: '0 0 8px rgba(255, 172, 0, 0.5)' }}
              >
                <Info className="w-4 h-4" style={{ filter: 'drop-shadow(0 0 6px #FFAC00)' }} />
                <span>Diferente de 100%</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table Container */}
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
                <th style={{ 
                  background: 'transparent',
                  color: '#00D1FF',
                  textShadow: '0 0 10px rgba(0, 209, 255, 0.5)',
                  borderBottom: '1px solid rgba(0, 209, 255, 0.3)',
                  padding: '16px',
                  textAlign: 'left',
                  fontWeight: 600,
                  fontSize: '14px'
                }}>
                  Tipo de Custo
                </th>
                <th style={{ 
                  background: 'transparent',
                  color: '#00D1FF',
                  textShadow: '0 0 10px rgba(0, 209, 255, 0.5)',
                  borderBottom: '1px solid rgba(0, 209, 255, 0.3)',
                  padding: '16px',
                  textAlign: 'right',
                  fontWeight: 600,
                  fontSize: '14px'
                }}>
                  Valor Mensal
                </th>
                <th style={{ 
                  background: 'transparent',
                  color: '#00D1FF',
                  textShadow: '0 0 10px rgba(0, 209, 255, 0.5)',
                  borderBottom: '1px solid rgba(0, 209, 255, 0.3)',
                  padding: '16px',
                  textAlign: 'right',
                  fontWeight: 600,
                  fontSize: '14px'
                }}>
                  Rateio (%)
                </th>
                <th style={{ 
                  background: 'transparent',
                  color: '#00D1FF',
                  textShadow: '0 0 10px rgba(0, 209, 255, 0.5)',
                  borderBottom: '1px solid rgba(0, 209, 255, 0.3)',
                  padding: '16px',
                  textAlign: 'right',
                  fontWeight: 600,
                  fontSize: '14px'
                }}>
                  Valor Rateado
                </th>
                <th style={{ 
                  background: 'transparent',
                  color: '#00D1FF',
                  textShadow: '0 0 10px rgba(0, 209, 255, 0.5)',
                  borderBottom: '1px solid rgba(0, 209, 255, 0.3)',
                  padding: '16px',
                  textAlign: 'right',
                  fontWeight: 600,
                  fontSize: '14px'
                }}>
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {isAdding && (
                <tr style={{ 
                  background: 'rgba(57, 255, 20, 0.05)',
                  borderLeft: '3px solid #39FF14'
                }}>
                  <td style={{ padding: '16px' }}>
                    <input
                      type="text"
                      style={inputStyle}
                      placeholder="Tipo de custo"
                      value={editData.type || ''}
                      onChange={(e) => setEditData({ ...editData, type: e.target.value })}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                    />
                  </td>
                  <td style={{ padding: '16px' }}>
                    <input
                      type="number"
                      style={{ ...inputStyle, width: '130px', textAlign: 'right' }}
                      placeholder="0.00"
                      value={editData.monthlyValue || ''}
                      onChange={(e) => setEditData({ ...editData, monthlyValue: parseFloat(e.target.value) })}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                    />
                  </td>
                  <td style={{ padding: '16px' }}>
                    <input
                      type="number"
                      style={{ ...inputStyle, width: '100px', textAlign: 'right' }}
                      placeholder="0"
                      value={editData.allocationPercent || ''}
                      onChange={(e) => setEditData({ ...editData, allocationPercent: parseFloat(e.target.value) })}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                    />
                  </td>
                  <td style={{ 
                    padding: '16px', 
                    textAlign: 'right',
                    color: '#94a3b8',
                    fontFamily: 'monospace'
                  }}>
                    {formatCurrency((editData.monthlyValue || 0) * (editData.allocationPercent || 0) / 100)}
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
              {costs.map((cost) => (
                <tr 
                  key={cost.id}
                  className="transition-all duration-300"
                  style={{
                    background: 'transparent',
                    borderBottom: '1px solid rgba(0, 209, 255, 0.1)'
                  }}
                  onMouseEnter={(e) => {
                    if (editingId !== cost.id) {
                      e.currentTarget.style.background = 'rgba(57, 255, 20, 0.05)';
                      e.currentTarget.style.borderLeft = '3px solid #39FF14';
                      e.currentTarget.style.boxShadow = 'inset 0 0 20px rgba(57, 255, 20, 0.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (editingId !== cost.id) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.borderLeft = 'none';
                      e.currentTarget.style.boxShadow = 'none';
                    }
                  }}
                >
                  {editingId === cost.id ? (
                    <>
                      <td style={{ padding: '16px' }}>
                        <input
                          type="text"
                          style={inputStyle}
                          value={editData.type || ''}
                          onChange={(e) => setEditData({ ...editData, type: e.target.value })}
                          onFocus={handleInputFocus}
                          onBlur={handleInputBlur}
                        />
                      </td>
                      <td style={{ padding: '16px' }}>
                        <input
                          type="number"
                          style={{ ...inputStyle, width: '130px', textAlign: 'right' }}
                          value={editData.monthlyValue || ''}
                          onChange={(e) => setEditData({ ...editData, monthlyValue: parseFloat(e.target.value) })}
                          onFocus={handleInputFocus}
                          onBlur={handleInputBlur}
                        />
                      </td>
                      <td style={{ padding: '16px' }}>
                        <input
                          type="number"
                          style={{ ...inputStyle, width: '100px', textAlign: 'right' }}
                          value={editData.allocationPercent || ''}
                          onChange={(e) => setEditData({ ...editData, allocationPercent: parseFloat(e.target.value) })}
                          onFocus={handleInputFocus}
                          onBlur={handleInputBlur}
                        />
                      </td>
                      <td style={{ 
                        padding: '16px', 
                        textAlign: 'right',
                        color: '#94a3b8',
                        fontFamily: 'monospace'
                      }}>
                        {formatCurrency((editData.monthlyValue || 0) * (editData.allocationPercent || 0) / 100)}
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
                      <td style={{ padding: '16px', color: '#F8FAFC', fontWeight: 500 }}>{cost.type}</td>
                      <td style={{ 
                        padding: '16px', 
                        textAlign: 'right',
                        fontFamily: 'monospace',
                        color: '#39FF14',
                        textShadow: '0 0 8px rgba(57, 255, 20, 0.5)'
                      }}>
                        {formatCurrency(cost.monthlyValue)}
                      </td>
                      <td style={{ 
                        padding: '16px', 
                        textAlign: 'right',
                        fontFamily: 'monospace',
                        color: '#00D1FF',
                        textShadow: '0 0 8px rgba(0, 209, 255, 0.5)'
                      }}>
                        {cost.allocationPercent}%
                      </td>
                      <td style={{ 
                        padding: '16px', 
                        textAlign: 'right',
                        fontFamily: 'monospace',
                        color: '#94a3b8'
                      }}>
                        {formatCurrency(cost.monthlyValue * cost.allocationPercent / 100)}
                      </td>
                      <td style={{ padding: '16px', textAlign: 'right' }}>
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleEdit(cost)} 
                            className="p-2 rounded-lg transition-all duration-300"
                            style={{ color: 'rgba(0, 209, 255, 0.5)' }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.color = '#00D1FF';
                              e.currentTarget.style.filter = 'drop-shadow(0 0 8px #00D1FF)';
                              e.currentTarget.style.background = 'rgba(0, 209, 255, 0.1)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.color = 'rgba(0, 209, 255, 0.5)';
                              e.currentTarget.style.filter = 'none';
                              e.currentTarget.style.background = 'transparent';
                            }}
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(cost.id)} 
                            className="p-2 rounded-lg transition-all duration-300"
                            style={{ color: 'rgba(255, 0, 122, 0.5)' }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.color = '#FF007A';
                              e.currentTarget.style.filter = 'drop-shadow(0 0 8px #FF007A)';
                              e.currentTarget.style.background = 'rgba(255, 0, 122, 0.1)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.color = 'rgba(255, 0, 122, 0.5)';
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

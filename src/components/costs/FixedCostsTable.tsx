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

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Custos Fixos</h2>
          <p className="text-muted-foreground">Configure os custos fixos mensais da empresa</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Novo Custo
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="kpi-card">
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Total Custos Fixos</h3>
          <p className="text-2xl font-bold text-foreground mono">{formatCurrency(totalCosts)}</p>
          <p className="text-sm text-muted-foreground mt-1">Por mês</p>
        </div>
        <div className="kpi-card">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Alocação Total</h3>
              <p className="text-2xl font-bold text-foreground mono">{totalAllocation}%</p>
            </div>
            {totalAllocation !== 100 && (
              <div className="flex items-center gap-1 text-warning text-sm">
                <Info className="w-4 h-4" />
                <span>Diferente de 100%</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Tipo de Custo</th>
                <th className="text-right">Valor Mensal</th>
                <th className="text-right">Rateio (%)</th>
                <th className="text-right">Valor Rateado</th>
                <th className="text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {isAdding && (
                <tr className="bg-primary/5">
                  <td>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Tipo de custo"
                      value={editData.type || ''}
                      onChange={(e) => setEditData({ ...editData, type: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className="input-field w-32 text-right"
                      placeholder="0.00"
                      value={editData.monthlyValue || ''}
                      onChange={(e) => setEditData({ ...editData, monthlyValue: parseFloat(e.target.value) })}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className="input-field w-24 text-right"
                      placeholder="0"
                      value={editData.allocationPercent || ''}
                      onChange={(e) => setEditData({ ...editData, allocationPercent: parseFloat(e.target.value) })}
                    />
                  </td>
                  <td className="text-right mono text-muted-foreground">
                    {formatCurrency((editData.monthlyValue || 0) * (editData.allocationPercent || 0) / 100)}
                  </td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={handleAddNew} className="p-2 text-success hover:bg-success/10 rounded-lg">
                        <Check className="w-4 h-4" />
                      </button>
                      <button onClick={handleCancel} className="p-2 text-danger hover:bg-danger/10 rounded-lg">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )}
              {costs.map((cost) => (
                <tr key={cost.id}>
                  {editingId === cost.id ? (
                    <>
                      <td>
                        <input
                          type="text"
                          className="input-field"
                          value={editData.type || ''}
                          onChange={(e) => setEditData({ ...editData, type: e.target.value })}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="input-field w-32 text-right"
                          value={editData.monthlyValue || ''}
                          onChange={(e) => setEditData({ ...editData, monthlyValue: parseFloat(e.target.value) })}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="input-field w-24 text-right"
                          value={editData.allocationPercent || ''}
                          onChange={(e) => setEditData({ ...editData, allocationPercent: parseFloat(e.target.value) })}
                        />
                      </td>
                      <td className="text-right mono text-muted-foreground">
                        {formatCurrency((editData.monthlyValue || 0) * (editData.allocationPercent || 0) / 100)}
                      </td>
                      <td className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={handleSave} className="p-2 text-success hover:bg-success/10 rounded-lg">
                            <Check className="w-4 h-4" />
                          </button>
                          <button onClick={handleCancel} className="p-2 text-danger hover:bg-danger/10 rounded-lg">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="font-medium">{cost.type}</td>
                      <td className="text-right mono">{formatCurrency(cost.monthlyValue)}</td>
                      <td className="text-right mono">{cost.allocationPercent}%</td>
                      <td className="text-right mono text-muted-foreground">
                        {formatCurrency(cost.monthlyValue * cost.allocationPercent / 100)}
                      </td>
                      <td className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleEdit(cost)} 
                            className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(cost.id)} 
                            className="p-2 text-muted-foreground hover:text-danger hover:bg-danger/10 rounded-lg"
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

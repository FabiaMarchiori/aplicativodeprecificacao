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

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Fornecedores</h2>
          <p className="text-muted-foreground">Gerencie seus fornecedores e custos logísticos</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Novo Fornecedor
        </button>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nome do Fornecedor</th>
                <th>Tipo</th>
                <th className="text-right">Prazo Médio (dias)</th>
                <th className="text-right">Custo Logístico</th>
                <th>Observações</th>
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
                      placeholder="Nome do fornecedor"
                      value={editData.name || ''}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    />
                  </td>
                  <td>
                    <select
                      className="input-field"
                      value={editData.type || 'national'}
                      onChange={(e) => setEditData({ ...editData, type: e.target.value as 'national' | 'imported' })}
                    >
                      <option value="national">Nacional</option>
                      <option value="imported">Importado</option>
                    </select>
                  </td>
                  <td>
                    <input
                      type="number"
                      className="input-field w-24 text-right"
                      placeholder="0"
                      value={editData.averageDeliveryDays || ''}
                      onChange={(e) => setEditData({ ...editData, averageDeliveryDays: parseInt(e.target.value) })}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className="input-field w-32 text-right"
                      placeholder="0.00"
                      value={editData.averageLogisticsCost || ''}
                      onChange={(e) => setEditData({ ...editData, averageLogisticsCost: parseFloat(e.target.value) })}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Observações"
                      value={editData.notes || ''}
                      onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                    />
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
              {suppliers.map((supplier) => (
                <tr key={supplier.id}>
                  {editingId === supplier.id ? (
                    <>
                      <td>
                        <input
                          type="text"
                          className="input-field"
                          value={editData.name || ''}
                          onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        />
                      </td>
                      <td>
                        <select
                          className="input-field"
                          value={editData.type || 'national'}
                          onChange={(e) => setEditData({ ...editData, type: e.target.value as 'national' | 'imported' })}
                        >
                          <option value="national">Nacional</option>
                          <option value="imported">Importado</option>
                        </select>
                      </td>
                      <td>
                        <input
                          type="number"
                          className="input-field w-24 text-right"
                          value={editData.averageDeliveryDays || ''}
                          onChange={(e) => setEditData({ ...editData, averageDeliveryDays: parseInt(e.target.value) })}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="input-field w-32 text-right"
                          value={editData.averageLogisticsCost || ''}
                          onChange={(e) => setEditData({ ...editData, averageLogisticsCost: parseFloat(e.target.value) })}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input-field"
                          value={editData.notes || ''}
                          onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                        />
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
                      <td className="font-medium">{supplier.name}</td>
                      <td>
                        <span className={`status-badge ${supplier.type === 'national' ? 'status-success' : 'status-warning'}`}>
                          {supplier.type === 'national' ? (
                            <><MapPin className="w-3 h-3" /> Nacional</>
                          ) : (
                            <><Globe className="w-3 h-3" /> Importado</>
                          )}
                        </span>
                      </td>
                      <td className="text-right mono">{supplier.averageDeliveryDays} dias</td>
                      <td className="text-right mono">{formatCurrency(supplier.averageLogisticsCost)}</td>
                      <td className="text-muted-foreground max-w-xs truncate">{supplier.notes}</td>
                      <td className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleEdit(supplier)} 
                            className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(supplier.id)} 
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

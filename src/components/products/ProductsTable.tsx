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

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Cadastro de Produtos</h2>
          <p className="text-muted-foreground">Gerencie seus produtos e custos</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Novo Produto
        </button>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Nome</th>
                <th>Categoria</th>
                <th>Fornecedor</th>
                <th>Unidade</th>
                <th className="text-right">Custo Compra</th>
                <th className="text-right">Custo Variável</th>
                <th className="text-right">Preço Venda</th>
                <th>Status</th>
                <th className="text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {isAdding && (
                <tr className="bg-primary/5">
                  <td>
                    <span className="text-muted-foreground">Auto</span>
                  </td>
                  <td>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Nome do produto"
                      value={editData.name || ''}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Categoria"
                      value={editData.category || ''}
                      onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Fornecedor"
                      value={editData.supplier || ''}
                      onChange={(e) => setEditData({ ...editData, supplier: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="input-field w-16"
                      placeholder="UN"
                      value={editData.unit || ''}
                      onChange={(e) => setEditData({ ...editData, unit: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className="input-field w-24 text-right"
                      placeholder="0.00"
                      value={editData.purchaseCost || ''}
                      onChange={(e) => setEditData({ ...editData, purchaseCost: parseFloat(e.target.value) })}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className="input-field w-24 text-right"
                      placeholder="0.00"
                      value={editData.variableCost || ''}
                      onChange={(e) => setEditData({ ...editData, variableCost: parseFloat(e.target.value) })}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className="input-field w-24 text-right"
                      placeholder="0.00"
                      value={editData.currentPrice || ''}
                      onChange={(e) => setEditData({ ...editData, currentPrice: parseFloat(e.target.value) })}
                    />
                  </td>
                  <td>
                    <span className="status-badge status-success">Ativo</span>
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
              {products.map((product) => (
                <tr key={product.id}>
                  {editingId === product.id ? (
                    <>
                      <td className="mono text-sm">{product.code}</td>
                      <td>
                        <input
                          type="text"
                          className="input-field"
                          value={editData.name || ''}
                          onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input-field"
                          value={editData.category || ''}
                          onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input-field"
                          value={editData.supplier || ''}
                          onChange={(e) => setEditData({ ...editData, supplier: e.target.value })}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input-field w-16"
                          value={editData.unit || ''}
                          onChange={(e) => setEditData({ ...editData, unit: e.target.value })}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="input-field w-24 text-right"
                          value={editData.purchaseCost || ''}
                          onChange={(e) => setEditData({ ...editData, purchaseCost: parseFloat(e.target.value) })}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="input-field w-24 text-right"
                          value={editData.variableCost || ''}
                          onChange={(e) => setEditData({ ...editData, variableCost: parseFloat(e.target.value) })}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="input-field w-24 text-right"
                          value={editData.currentPrice || ''}
                          onChange={(e) => setEditData({ ...editData, currentPrice: parseFloat(e.target.value) })}
                        />
                      </td>
                      <td>
                        <select
                          className="input-field"
                          value={editData.status || ''}
                          onChange={(e) => setEditData({ ...editData, status: e.target.value as 'active' | 'inactive' })}
                        >
                          <option value="active">Ativo</option>
                          <option value="inactive">Inativo</option>
                        </select>
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
                      <td className="mono text-sm text-muted-foreground">{product.code}</td>
                      <td className="font-medium">{product.name}</td>
                      <td className="text-muted-foreground">{product.category}</td>
                      <td className="text-muted-foreground">{product.supplier}</td>
                      <td className="text-muted-foreground">{product.unit}</td>
                      <td className="text-right mono">{formatCurrency(product.purchaseCost)}</td>
                      <td className="text-right mono">{formatCurrency(product.variableCost)}</td>
                      <td className="text-right mono font-medium">{formatCurrency(product.currentPrice)}</td>
                      <td>
                        <span className={`status-badge ${product.status === 'active' ? 'status-success' : 'status-warning'}`}>
                          {product.status === 'active' ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleEdit(product)} 
                            className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(product.id)} 
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

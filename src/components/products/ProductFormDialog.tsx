import { useState, useEffect } from 'react';
import { Product } from '@/data/mockData';
import { useData } from '@/contexts/DataContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface ProductFormDialogProps {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
}

export const ProductFormDialog = ({ isOpen, product, onClose }: ProductFormDialogProps) => {
  const { addProduct, updateProduct } = useData();
  const isEditing = !!product;

  const [form, setForm] = useState({
    name: '',
    purchaseCost: '',
    variableCost: '',
    supplier: '',
    notes: '',
  });

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        purchaseCost: product.purchaseCost.toString(),
        variableCost: product.variableCost.toString(),
        supplier: product.supplier,
        notes: '',
      });
    } else {
      setForm({ name: '', purchaseCost: '', variableCost: '', supplier: '', notes: '' });
    }
  }, [product, isOpen]);

  const handleSubmit = async () => {
    if (!form.name.trim()) return;

    if (isEditing && product) {
      await updateProduct(product.id, {
        name: form.name,
        purchaseCost: parseFloat(form.purchaseCost) || 0,
        variableCost: parseFloat(form.variableCost) || 0,
        supplier: form.supplier,
      });
    } else {
      await addProduct({
        code: `PRD-${Date.now().toString().slice(-4)}`,
        name: form.name,
        category: 'Geral',
        supplier: form.supplier,
        unit: 'UN',
        purchaseCost: parseFloat(form.purchaseCost) || 0,
        variableCost: parseFloat(form.variableCost) || 0,
        currentPrice: 0,
        status: 'active',
      });
    }
    onClose();
  };

  const fieldStyle = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.12)',
    color: '#FFFFFF',
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent
        className="sm:max-w-md rounded-2xl"
        style={{
          background: 'hsl(220 25% 8%)',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <DialogHeader>
          <DialogTitle style={{ color: '#FFFFFF', fontSize: '20px', fontWeight: 700 }}>
            {isEditing ? 'Editar Produto' : 'Novo Produto'}
          </DialogTitle>
          <DialogDescription style={{ color: '#FFFFFF' }}>
            {isEditing ? 'Atualize os dados do produto' : 'Preencha os dados para cadastrar'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label style={{ color: '#FFFFFF', fontSize: '13px' }}>Nome do produto *</Label>
            <Input
              placeholder="Ex: Fone Bluetooth Premium"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="h-11 rounded-xl"
              style={fieldStyle}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label style={{ color: '#FFFFFF', fontSize: '13px' }}>Custo do produto (R$)</Label>
              <Input
                type="number"
                placeholder="0,00"
                value={form.purchaseCost}
                onChange={(e) => setForm({ ...form, purchaseCost: e.target.value })}
                className="h-11 rounded-xl"
                style={fieldStyle}
              />
            </div>
            <div className="space-y-1.5">
              <Label style={{ color: '#FFFFFF', fontSize: '13px' }}>Frete de compra (R$)</Label>
              <Input
                type="number"
                placeholder="0,00"
                value={form.variableCost}
                onChange={(e) => setForm({ ...form, variableCost: e.target.value })}
                className="h-11 rounded-xl"
                style={fieldStyle}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>Fornecedor (opcional)</Label>
            <Input
              placeholder="Ex: Tech Import Ltda"
              value={form.supplier}
              onChange={(e) => setForm({ ...form, supplier: e.target.value })}
              className="h-11 rounded-xl"
              style={fieldStyle}
            />
          </div>

          <div className="space-y-1.5">
            <Label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>Observações (opcional)</Label>
            <Textarea
              placeholder="Anotações sobre o produto..."
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="rounded-xl resize-none min-h-[80px]"
              style={fieldStyle}
            />
          </div>
        </div>

        <div className="flex gap-3 mt-4">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors"
            style={{ color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={!form.name.trim()}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-40"
            style={{
              background: 'linear-gradient(135deg, rgba(0,130,255,0.2), rgba(0,200,255,0.12))',
              border: '1px solid rgba(0,160,255,0.4)',
              color: '#FFFFFF',
            }}
          >
            {isEditing ? 'Salvar' : 'Cadastrar'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

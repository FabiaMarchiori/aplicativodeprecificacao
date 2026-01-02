import { useState, useMemo } from 'react';
import { Plus, Pencil, Trash2, Check, X, Info, HelpCircle, Download, FileText, Filter, ArrowUpDown } from 'lucide-react';
import { FixedCost } from '@/data/mockData';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DeleteConfirmDialog } from '@/components/shared/DeleteConfirmDialog';

// Tooltip Icon Component
const TooltipIcon = ({ content }: { content: string }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex ml-1 cursor-help">
          <HelpCircle 
            className="w-3.5 h-3.5" 
            style={{ 
              color: 'rgba(0, 209, 255, 0.6)',
              filter: 'drop-shadow(0 0 3px rgba(0, 209, 255, 0.4))'
            }} 
          />
        </span>
      </TooltipTrigger>
      <TooltipContent 
        className="max-w-xs text-sm"
        style={{
          background: 'rgba(0, 0, 0, 0.95)',
          border: '1px solid rgba(0, 209, 255, 0.3)',
          color: '#F8FAFC',
          boxShadow: '0 0 20px rgba(0, 209, 255, 0.2)'
        }}
      >
        {content}
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

// Category labels
const categoryLabels: Record<string, string> = {
  operational: 'Operacional',
  administrative: 'Administrativo',
  personnel: 'Pessoal',
  marketing: 'Marketing'
};

export const FixedCostsTable = () => {
  const { fixedCosts: costs, addFixedCost, updateFixedCost, deleteFixedCost } = useData();
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<FixedCost>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'name' | 'value_desc' | 'value_asc'>('name');
  const [updatedIds, setUpdatedIds] = useState<Set<string>>(new Set());
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; id: string; name: string }>({
    isOpen: false,
    id: '',
    name: ''
  });

  const totalCosts = costs.reduce((sum, c) => sum + c.monthlyValue, 0);
  const totalAllocation = costs.reduce((sum, c) => sum + c.allocationPercent, 0);

  // Filter and sort costs
  const filteredCosts = useMemo(() => {
    let result = [...costs];
    
    if (filterCategory !== 'all') {
      result = result.filter(c => c.category === filterCategory);
    }
    
    switch (sortOrder) {
      case 'value_desc':
        result.sort((a, b) => b.monthlyValue - a.monthlyValue);
        break;
      case 'value_asc':
        result.sort((a, b) => a.monthlyValue - b.monthlyValue);
        break;
      case 'name':
      default:
        result.sort((a, b) => a.type.localeCompare(b.type));
    }
    
    return result;
  }, [costs, filterCategory, sortOrder]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const handleEdit = (cost: FixedCost) => {
    setEditingId(cost.id);
    setEditData(cost);
  };

  const handleSave = () => {
    if (!editData.type || editData.type.trim() === '') {
      toast({ title: 'Campo obrigatório', description: 'Informe o tipo de custo', variant: 'destructive' });
      return;
    }
    if (!editData.monthlyValue || editData.monthlyValue <= 0) {
      toast({ title: 'Campo inválido', description: 'O valor mensal deve ser maior que zero', variant: 'destructive' });
      return;
    }
    if (editData.allocationPercent === undefined || editData.allocationPercent < 0) {
      toast({ title: 'Campo inválido', description: 'O rateio deve ser um valor válido', variant: 'destructive' });
      return;
    }
    
    if (editingId) {
      updateFixedCost(editingId, editData);
      setUpdatedIds(prev => new Set(prev).add(editingId));
      setTimeout(() => {
        setUpdatedIds(prev => {
          const next = new Set(prev);
          next.delete(editingId);
          return next;
        });
      }, 2000);
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
    deleteFixedCost(deleteDialog.id);
    setDeleteDialog({ isOpen: false, id: '', name: '' });
  };

  const handleAddNew = () => {
    if (!editData.type || editData.type.trim() === '') {
      toast({ title: 'Campo obrigatório', description: 'Informe o tipo de custo', variant: 'destructive' });
      return;
    }
    if (!editData.monthlyValue || editData.monthlyValue <= 0) {
      toast({ title: 'Campo inválido', description: 'O valor mensal deve ser maior que zero', variant: 'destructive' });
      return;
    }
    
    addFixedCost({
      type: editData.type || 'Novo Custo',
      category: (editData.category as FixedCost['category']) || 'operational',
      monthlyValue: editData.monthlyValue || 0,
      allocationPercent: editData.allocationPercent || 0,
    });
    setIsAdding(false);
    setEditData({});
  };

  // Export functions
  const exportCSV = () => {
    const headers = ['Tipo de Custo', 'Categoria', 'Valor Mensal', 'Rateio (%)', 'Valor Rateado'];
    const rows = costs.map(c => [
      c.type,
      categoryLabels[c.category] || c.category,
      c.monthlyValue.toFixed(2),
      c.allocationPercent.toString(),
      (c.monthlyValue * c.allocationPercent / 100).toFixed(2)
    ]);
    
    const csvContent = [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n');
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `custos_fixos_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast({ title: 'Arquivo CSV exportado' });
  };

  const exportPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast({ title: 'Erro ao exportar', description: 'Permita popups para exportar PDF', variant: 'destructive' });
      return;
    }
    
    const tableRows = costs.map(c => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #333;">${c.type}</td>
        <td style="padding: 12px; border-bottom: 1px solid #333;">${categoryLabels[c.category] || c.category}</td>
        <td style="padding: 12px; border-bottom: 1px solid #333; text-align: right;">${formatCurrency(c.monthlyValue)}</td>
        <td style="padding: 12px; border-bottom: 1px solid #333; text-align: right;">${c.allocationPercent}%</td>
        <td style="padding: 12px; border-bottom: 1px solid #333; text-align: right;">${formatCurrency(c.monthlyValue * c.allocationPercent / 100)}</td>
      </tr>
    `).join('');
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Custos Fixos - Relatório</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; background: #fff; color: #000; }
            h1 { color: #1a1a2e; margin-bottom: 10px; }
            .date { color: #666; margin-bottom: 30px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background: #1a1a2e; color: #fff; padding: 12px; text-align: left; }
            .summary { display: flex; gap: 40px; margin-bottom: 30px; }
            .summary-card { padding: 20px; background: #f5f5f5; border-radius: 8px; }
            .summary-card h3 { margin: 0 0 8px 0; font-size: 14px; color: #666; }
            .summary-card p { margin: 0; font-size: 24px; font-weight: bold; }
          </style>
        </head>
        <body>
          <h1>Relatório de Custos Fixos</h1>
          <p class="date">Exportado em: ${new Date().toLocaleDateString('pt-BR')}</p>
          
          <div class="summary">
            <div class="summary-card">
              <h3>Total Custos Fixos</h3>
              <p>${formatCurrency(totalCosts)}</p>
            </div>
            <div class="summary-card">
              <h3>Alocação Total</h3>
              <p>${totalAllocation}%</p>
            </div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Tipo de Custo</th>
                <th>Categoria</th>
                <th style="text-align: right;">Valor Mensal</th>
                <th style="text-align: right;">Rateio (%)</th>
                <th style="text-align: right;">Valor Rateado</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
    toast({ title: 'PDF gerado para impressão' });
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

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.currentTarget.style.border = '1px solid #39FF14';
    e.currentTarget.style.boxShadow = '0 0 15px rgba(57, 255, 20, 0.5), inset 0 0 10px rgba(57, 255, 20, 0.1)';
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.currentTarget.style.border = '1px solid rgba(57, 255, 20, 0.3)';
    e.currentTarget.style.boxShadow = 'none';
  };

  // Allocation status
  const getAllocationStatus = () => {
    if (totalAllocation === 100) {
      return { type: 'success', message: 'Rateio completo', color: '#39FF14' };
    } else if (totalAllocation < 100) {
      return { type: 'warning', message: `Rateio incompleto: ${100 - totalAllocation}% restantes`, color: '#FFAC00' };
    } else {
      return { type: 'error', message: `Rateio excedido: ${totalAllocation - 100}% acima`, color: '#FF007A' };
    }
  };

  const allocationStatus = getAllocationStatus();

  return (
    <TooltipProvider>
      <div className="animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div className="flex items-center gap-3">
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
              <p style={{ color: 'rgba(255, 255, 255, 0.75)' }}>Configure os custos fixos mensais da empresa</p>
            </div>
            
            {/* Help Button */}
            <Dialog>
              <DialogTrigger asChild>
                <button
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition-all duration-300 text-sm"
                  style={{
                    background: 'rgba(0, 209, 255, 0.1)',
                    border: '1px solid rgba(0, 209, 255, 0.3)',
                    color: '#00D1FF',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(0, 209, 255, 0.2)';
                    e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 209, 255, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(0, 209, 255, 0.1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <HelpCircle className="w-4 h-4" />
                  Como usar
                </button>
              </DialogTrigger>
              <DialogContent 
                className="max-w-lg"
                style={{
                  background: 'rgba(0, 0, 0, 0.98)',
                  border: '1px solid rgba(0, 209, 255, 0.3)',
                  boxShadow: '0 0 40px rgba(0, 209, 255, 0.2)'
                }}
              >
                <DialogHeader>
                  <DialogTitle style={{ color: '#00D1FF', textShadow: '0 0 10px rgba(0, 209, 255, 0.5)' }}>
                    Guia: Custos Fixos
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 text-sm" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                  <div className="p-4 rounded-lg" style={{ background: 'rgba(57, 255, 20, 0.1)', border: '1px solid rgba(57, 255, 20, 0.2)' }}>
                    <h4 className="font-bold mb-2" style={{ color: '#39FF14' }}>O que são Custos Fixos?</h4>
                    <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                      Custos fixos são despesas mensais que sua empresa paga independentemente de quantos produtos vende. 
                      Exemplos: aluguel, salários, contas de luz, internet.
                    </p>
                  </div>
                  
                  <div className="p-4 rounded-lg" style={{ background: 'rgba(0, 209, 255, 0.1)', border: '1px solid rgba(0, 209, 255, 0.2)' }}>
                    <h4 className="font-bold mb-2" style={{ color: '#00D1FF' }}>Como preencher cada campo:</h4>
                    <ul className="space-y-2" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                      <li><strong>Tipo de Custo:</strong> Nome descritivo (ex: Aluguel, Energia)</li>
                      <li><strong>Categoria:</strong> Classificação do custo (Operacional, Pessoal, etc.)</li>
                      <li><strong>Valor Mensal:</strong> Valor exato pago mensalmente</li>
                      <li><strong>Rateio (%):</strong> Quanto deste custo será considerado na precificação</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 rounded-lg" style={{ background: 'rgba(255, 172, 0, 0.1)', border: '1px solid rgba(255, 172, 0, 0.2)' }}>
                    <h4 className="font-bold mb-2" style={{ color: '#FFAC00' }}>Por que o Rateio é importante?</h4>
                    <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                      O rateio define quanto de cada custo fixo será embutido no preço dos seus produtos. 
                      A soma deve ser 100% para distribuir todos os custos de forma justa na precificação.
                    </p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex flex-col xs:flex-row flex-wrap items-stretch xs:items-center gap-2 sm:gap-3">
            {/* Export Buttons */}
            <button 
              onClick={exportCSV}
              className="flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all duration-300 text-sm"
              style={{
                background: 'transparent',
                border: '1px solid rgba(57, 255, 20, 0.3)',
                color: '#39FF14',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(57, 255, 20, 0.15)';
                e.currentTarget.style.boxShadow = '0 0 15px rgba(57, 255, 20, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <Download className="w-4 h-4" />
              CSV
            </button>
            
            <button 
              onClick={exportPDF}
              className="flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all duration-300 text-sm"
              style={{
                background: 'transparent',
                border: '1px solid rgba(0, 209, 255, 0.3)',
                color: '#00D1FF',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(0, 209, 255, 0.15)';
                e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 209, 255, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <FileText className="w-4 h-4" />
              PDF
            </button>
            
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
              <Plus className="w-5 h-5" />
              Novo Custo
            </button>
          </div>
        </div>

        {/* Filters & Sort */}
        <div className="flex items-center gap-4 mb-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4" style={{ color: 'rgba(255, 255, 255, 0.6)' }} />
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger 
                className="w-40"
                style={{
                  background: '#000000',
                  border: '1px solid rgba(0, 209, 255, 0.3)',
                  color: '#F8FAFC'
                }}
              >
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent
                style={{
                  background: '#0a0a0c',
                  border: '1px solid rgba(0, 209, 255, 0.3)'
                }}
              >
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="operational">Operacional</SelectItem>
                <SelectItem value="administrative">Administrativo</SelectItem>
                <SelectItem value="personnel">Pessoal</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4" style={{ color: 'rgba(255, 255, 255, 0.6)' }} />
            <Select value={sortOrder} onValueChange={(v) => setSortOrder(v as typeof sortOrder)}>
              <SelectTrigger 
                className="w-40"
                style={{
                  background: '#000000',
                  border: '1px solid rgba(0, 209, 255, 0.3)',
                  color: '#F8FAFC'
                }}
              >
                <SelectValue placeholder="Ordenar" />
              </SelectTrigger>
              <SelectContent
                style={{
                  background: '#0a0a0c',
                  border: '1px solid rgba(0, 209, 255, 0.3)'
                }}
              >
                <SelectItem value="name">Por Nome</SelectItem>
                <SelectItem value="value_desc">Maior Valor</SelectItem>
                <SelectItem value="value_asc">Menor Valor</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Total Costs */}
          <div 
            className="p-5 rounded-xl"
            style={{
              background: '#0a0a0c',
              border: '1px solid rgba(0, 209, 255, 0.3)',
              boxShadow: '0 0 15px rgba(0, 209, 255, 0.1)'
            }}
          >
            <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Total Custos Fixos</p>
            <p 
              className="text-2xl font-bold mono"
              style={{ 
                color: '#00D1FF',
                textShadow: '0 0 10px rgba(0, 209, 255, 0.5)'
              }}
            >
              {formatCurrency(totalCosts)}
            </p>
          </div>
          
          {/* Allocation Status */}
          <div 
            className="p-5 rounded-xl"
            style={{
              background: '#0a0a0c',
              border: `1px solid ${allocationStatus.color}40`,
              boxShadow: `0 0 15px ${allocationStatus.color}15`
            }}
          >
            <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Alocação Total
              <TooltipIcon content="Soma de todos os percentuais de rateio. Idealmente deve ser 100%." />
            </p>
            <p 
              className="text-2xl font-bold"
              style={{ 
                color: allocationStatus.color,
                textShadow: `0 0 10px ${allocationStatus.color}50`
              }}
            >
              {totalAllocation}%
            </p>
            <p className="text-xs mt-1" style={{ color: allocationStatus.color }}>
              {allocationStatus.message}
            </p>
          </div>
          
          {/* Allocated Value */}
          <div 
            className="p-5 rounded-xl"
            style={{
              background: '#0a0a0c',
              border: '1px solid rgba(57, 255, 20, 0.3)',
              boxShadow: '0 0 15px rgba(57, 255, 20, 0.1)'
            }}
          >
            <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Valor Rateado
              <TooltipIcon content="Valor total que será distribuído nos produtos para precificação." />
            </p>
            <p 
              className="text-2xl font-bold mono"
              style={{ 
                color: '#39FF14',
                textShadow: '0 0 10px rgba(57, 255, 20, 0.5)'
              }}
            >
              {formatCurrency(costs.reduce((sum, c) => sum + (c.monthlyValue * c.allocationPercent / 100), 0))}
            </p>
          </div>
        </div>

        {/* Table */}
        <div 
          className="rounded-xl overflow-hidden"
          style={{
            background: '#0a0a0c',
            border: '1px solid rgba(57, 255, 20, 0.2)',
            boxShadow: '0 0 20px rgba(57, 255, 20, 0.08)'
          }}
        >
          <table className="w-full">
            <thead>
              <tr style={{ background: 'rgba(57, 255, 20, 0.08)' }}>
                <th className="text-left px-6 py-4 text-sm font-semibold" style={{ color: '#39FF14' }}>
                  Tipo de Custo
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold" style={{ color: '#39FF14' }}>
                  Categoria
                </th>
                <th className="text-right px-6 py-4 text-sm font-semibold" style={{ color: '#39FF14' }}>
                  Valor Mensal
                </th>
                <th className="text-right px-6 py-4 text-sm font-semibold" style={{ color: '#39FF14' }}>
                  Rateio (%)
                  <TooltipIcon content="Percentual do custo que será distribuído nos produtos" />
                </th>
                <th className="text-right px-6 py-4 text-sm font-semibold" style={{ color: '#39FF14' }}>
                  Valor Rateado
                </th>
                <th className="text-center px-6 py-4 text-sm font-semibold" style={{ color: '#39FF14' }}>
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Add New Row */}
              {isAdding && (
                <tr 
                  style={{ 
                    background: 'rgba(57, 255, 20, 0.05)',
                    borderBottom: '1px solid rgba(57, 255, 20, 0.1)'
                  }}
                >
                  <td className="px-6 py-4">
                    <input
                      type="text"
                      placeholder="Nome do custo"
                      className="w-full"
                      style={inputStyle}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      value={editData.type || ''}
                      onChange={(e) => setEditData({ ...editData, type: e.target.value })}
                      autoFocus
                    />
                  </td>
                  <td className="px-6 py-4">
                    <select
                      className="w-full"
                      style={inputStyle}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      value={editData.category || 'operational'}
                      onChange={(e) => setEditData({ ...editData, category: e.target.value as FixedCost['category'] })}
                    >
                      <option value="operational">Operacional</option>
                      <option value="administrative">Administrativo</option>
                      <option value="personnel">Pessoal</option>
                      <option value="marketing">Marketing</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="number"
                      placeholder="0,00"
                      className="w-full text-right"
                      style={inputStyle}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      value={editData.monthlyValue || ''}
                      onChange={(e) => setEditData({ ...editData, monthlyValue: parseFloat(e.target.value) || 0 })}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="number"
                      placeholder="0"
                      className="w-full text-right"
                      style={inputStyle}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      value={editData.allocationPercent || ''}
                      onChange={(e) => setEditData({ ...editData, allocationPercent: parseFloat(e.target.value) || 0 })}
                    />
                  </td>
                  <td className="px-6 py-4 text-right" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                    {formatCurrency((editData.monthlyValue || 0) * (editData.allocationPercent || 0) / 100)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={handleAddNew}
                        className="p-2 rounded-lg transition-all duration-200"
                        style={{
                          background: 'rgba(57, 255, 20, 0.15)',
                          border: '1px solid rgba(57, 255, 20, 0.4)'
                        }}
                      >
                        <Check className="w-4 h-4" style={{ color: '#39FF14' }} />
                      </button>
                      <button
                        onClick={handleCancel}
                        className="p-2 rounded-lg transition-all duration-200"
                        style={{
                          background: 'rgba(239, 68, 68, 0.15)',
                          border: '1px solid rgba(239, 68, 68, 0.4)'
                        }}
                      >
                        <X className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              )}
              
              {/* Data Rows */}
              {filteredCosts.map((cost) => (
                <tr 
                  key={cost.id}
                  className={`transition-all duration-500 ${updatedIds.has(cost.id) ? 'animate-pulse' : ''}`}
                  style={{ 
                    borderBottom: '1px solid rgba(57, 255, 20, 0.1)',
                    background: updatedIds.has(cost.id) ? 'rgba(57, 255, 20, 0.1)' : 'transparent'
                  }}
                >
                  {editingId === cost.id ? (
                    <>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          className="w-full"
                          style={inputStyle}
                          onFocus={handleInputFocus}
                          onBlur={handleInputBlur}
                          value={editData.type || ''}
                          onChange={(e) => setEditData({ ...editData, type: e.target.value })}
                          autoFocus
                        />
                      </td>
                      <td className="px-6 py-4">
                        <select
                          className="w-full"
                          style={inputStyle}
                          onFocus={handleInputFocus}
                          onBlur={handleInputBlur}
                          value={editData.category || 'operational'}
                          onChange={(e) => setEditData({ ...editData, category: e.target.value as FixedCost['category'] })}
                        >
                          <option value="operational">Operacional</option>
                          <option value="administrative">Administrativo</option>
                          <option value="personnel">Pessoal</option>
                          <option value="marketing">Marketing</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          className="w-full text-right"
                          style={inputStyle}
                          onFocus={handleInputFocus}
                          onBlur={handleInputBlur}
                          value={editData.monthlyValue || ''}
                          onChange={(e) => setEditData({ ...editData, monthlyValue: parseFloat(e.target.value) || 0 })}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          className="w-full text-right"
                          style={inputStyle}
                          onFocus={handleInputFocus}
                          onBlur={handleInputBlur}
                          value={editData.allocationPercent || ''}
                          onChange={(e) => setEditData({ ...editData, allocationPercent: parseFloat(e.target.value) || 0 })}
                        />
                      </td>
                      <td className="px-6 py-4 text-right" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                        {formatCurrency((editData.monthlyValue || 0) * (editData.allocationPercent || 0) / 100)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={handleSave}
                            className="p-2 rounded-lg transition-all duration-200"
                            style={{
                              background: 'rgba(57, 255, 20, 0.15)',
                              border: '1px solid rgba(57, 255, 20, 0.4)'
                            }}
                          >
                            <Check className="w-4 h-4" style={{ color: '#39FF14' }} />
                          </button>
                          <button
                            onClick={handleCancel}
                            className="p-2 rounded-lg transition-all duration-200"
                            style={{
                              background: 'rgba(239, 68, 68, 0.15)',
                              border: '1px solid rgba(239, 68, 68, 0.4)'
                            }}
                          >
                            <X className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-6 py-4 font-medium" style={{ color: '#F8FAFC' }}>
                        {cost.type}
                      </td>
                      <td className="px-6 py-4">
                        <span 
                          className="px-3 py-1 rounded-full text-xs font-medium"
                          style={{
                            background: 'rgba(0, 209, 255, 0.1)',
                            color: '#00D1FF',
                            border: '1px solid rgba(0, 209, 255, 0.3)'
                          }}
                        >
                          {categoryLabels[cost.category] || cost.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right mono" style={{ color: '#F8FAFC' }}>
                        {formatCurrency(cost.monthlyValue)}
                      </td>
                      <td className="px-6 py-4 text-right font-medium" style={{ color: '#FFAC00' }}>
                        {cost.allocationPercent}%
                      </td>
                      <td className="px-6 py-4 text-right mono" style={{ color: '#39FF14' }}>
                        {formatCurrency(cost.monthlyValue * cost.allocationPercent / 100)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => handleEdit(cost)}
                                className="p-2 rounded-lg transition-all duration-200 hover:scale-105"
                                style={{
                                  background: 'rgba(0, 209, 255, 0.1)',
                                  border: '1px solid rgba(0, 209, 255, 0.3)'
                                }}
                              >
                                <Pencil className="w-4 h-4" style={{ color: '#00D1FF' }} />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>Editar</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => handleDeleteClick(cost.id, cost.type)}
                                className="p-2 rounded-lg transition-all duration-200 hover:scale-105"
                                style={{
                                  background: 'rgba(239, 68, 68, 0.1)',
                                  border: '1px solid rgba(239, 68, 68, 0.3)'
                                }}
                              >
                                <Trash2 className="w-4 h-4 text-red-400" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>Excluir</TooltipContent>
                          </Tooltip>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredCosts.length === 0 && !isAdding && (
            <div className="text-center py-12" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
              <Info className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Nenhum custo encontrado</p>
              <p className="text-sm">Adicione um novo custo ou ajuste os filtros</p>
            </div>
          )}
        </div>

        {/* Delete Confirm Dialog */}
        <DeleteConfirmDialog
          isOpen={deleteDialog.isOpen}
          onClose={() => setDeleteDialog({ isOpen: false, id: '', name: '' })}
          onConfirm={handleDeleteConfirm}
          title="Excluir Custo Fixo"
          description="Tem certeza que deseja excluir este custo fixo?"
          itemName={deleteDialog.name}
        />
      </div>
    </TooltipProvider>
  );
};

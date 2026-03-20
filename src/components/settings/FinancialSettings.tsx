import { useState, useEffect, useCallback } from 'react';
import { useData } from '@/contexts/DataContext';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { DEFAULT_SALES_CHANNELS, SalesChannel } from '@/data/salesChannels';
import { FixedCost, TaxConfig, OtherTax } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import {
  Building2,
  Receipt,
  Store,
  CreditCard,
  Plus,
  X,
  Save,
  Trash2,
  Pencil,
  Check,
  ChevronDown,
  ChevronRight,
  Package,
  Settings2,
  ShoppingCart,
  Info,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Switch } from '@/components/ui/switch';
import { DeleteConfirmDialog } from '@/components/shared/DeleteConfirmDialog';

// ─── Helpers ──────────────────────────────────────────
const fmt = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

// ─── Section wrapper ──────────────────────────────────
const Section = ({
  icon: Icon,
  title,
  description,
  children,
  defaultOpen = true,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div
        className="rounded-xl overflow-hidden transition-all duration-300"
        style={{
          background: 'hsl(var(--card))',
          border: '1px solid hsl(var(--border))',
          boxShadow: '0 2px 16px rgba(0,0,0,0.25)',
        }}
      >
        <CollapsibleTrigger asChild>
          <button
            className="w-full flex items-center gap-4 px-6 py-5 text-left transition-colors hover:bg-white/[0.02]"
          >
            <div
              className="p-2.5 rounded-xl"
              style={{
                background: 'hsl(var(--primary) / 0.1)',
                border: '1px solid hsl(var(--primary) / 0.2)',
              }}
            >
              <Icon className="w-5 h-5" style={{ color: 'hsl(var(--primary))' }} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-foreground">{title}</h3>
              <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
            </div>
            {open ? (
              <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />
            ) : (
              <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
            )}
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-6 pb-6 pt-1">{children}</div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};

// ═══════════════════════════════════════════════════════
// 1. PERFIL DO NEGÓCIO
// ═══════════════════════════════════════════════════════
type OperationType = 'revenda' | 'fabricacao' | 'servicos';
type TaxRegime = 'mei' | 'simples' | 'presumido' | 'real';

interface BusinessProfileData {
  operationType: OperationType;
  taxRegime: TaxRegime;
  companyName: string;
  monthlyRevenue: number;
}

const operationOptions: { value: OperationType; label: string; desc: string }[] = [
  { value: 'revenda', label: 'Revenda', desc: 'Compro e revendo produtos' },
  { value: 'fabricacao', label: 'Fabricação', desc: 'Produzo meus próprios produtos' },
  { value: 'servicos', label: 'Serviços + Produtos', desc: 'Vendo serviços e produtos' },
];

const taxRegimeOptions: { value: TaxRegime; label: string; desc: string }[] = [
  { value: 'mei', label: 'MEI', desc: 'Faturamento até R$ 81 mil/ano' },
  { value: 'simples', label: 'Simples Nacional', desc: 'Faturamento até R$ 4,8 mi/ano' },
  { value: 'presumido', label: 'Lucro Presumido', desc: 'Tributação com base presumida' },
  { value: 'real', label: 'Lucro Real', desc: 'Tributação sobre lucro real' },
];

const BusinessProfileSection = () => {
  const [profile, setProfile] = useLocalStorage<BusinessProfileData>(
    'pricing-app-business-profile',
    { operationType: 'revenda', taxRegime: 'simples', companyName: '', monthlyRevenue: 0 }
  );
  const { toast } = useToast();
  const [local, setLocal] = useState(profile);

  useEffect(() => { setLocal(profile); }, [profile]);

  const save = () => {
    setProfile(local);
    toast({ title: 'Perfil salvo com sucesso' });
  };

  return (
    <div className="space-y-6">
      {/* Company name */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Nome da empresa</label>
        <input
          type="text"
          value={local.companyName}
          onChange={(e) => setLocal({ ...local, companyName: e.target.value })}
          placeholder="Ex: Minha Loja Online"
          className="w-full max-w-md px-4 py-2.5 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
        />
      </div>

      {/* Operation type */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-3">Tipo de operação</label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {operationOptions.map((op) => (
            <button
              key={op.value}
              onClick={() => setLocal({ ...local, operationType: op.value })}
              className="p-4 rounded-xl text-left transition-all duration-200"
              style={{
                background:
                  local.operationType === op.value
                    ? 'hsl(var(--primary) / 0.12)'
                    : 'hsl(var(--background))',
                border:
                  local.operationType === op.value
                    ? '1px solid hsl(var(--primary) / 0.5)'
                    : '1px solid hsl(var(--border))',
              }}
            >
              <span className="block text-sm font-semibold text-foreground">{op.label}</span>
              <span className="block text-xs text-muted-foreground mt-1">{op.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tax regime */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-3">Regime tributário</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {taxRegimeOptions.map((r) => (
            <button
              key={r.value}
              onClick={() => setLocal({ ...local, taxRegime: r.value })}
              className="p-4 rounded-xl text-left transition-all duration-200"
              style={{
                background:
                  local.taxRegime === r.value
                    ? 'hsl(var(--primary) / 0.12)'
                    : 'hsl(var(--background))',
                border:
                  local.taxRegime === r.value
                    ? '1px solid hsl(var(--primary) / 0.5)'
                    : '1px solid hsl(var(--border))',
              }}
            >
              <span className="block text-sm font-semibold text-foreground">{r.label}</span>
              <span className="block text-xs text-muted-foreground mt-1">{r.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Revenue */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Faturamento mensal médio
        </label>
        <div className="relative max-w-xs">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">R$</span>
          <input
            type="number"
            value={local.monthlyRevenue || ''}
            onChange={(e) => setLocal({ ...local, monthlyRevenue: parseFloat(e.target.value) || 0 })}
            placeholder="0,00"
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
          />
        </div>
      </div>

      <button
        onClick={save}
        className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20"
      >
        <Save className="w-4 h-4" />
        Salvar Perfil
      </button>
    </div>
  );
};

// ═══════════════════════════════════════════════════════
// 2. CUSTOS DA EMPRESA
// ═══════════════════════════════════════════════════════
const CompanyCostsSection = () => {
  const { fixedCosts, addFixedCost, updateFixedCost, deleteFixedCost } = useData();
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<FixedCost>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; id: string; name: string }>({
    isOpen: false, id: '', name: '',
  });

  const total = fixedCosts.reduce((s, c) => s + c.monthlyValue, 0);

  const startEdit = (cost: FixedCost) => {
    setEditingId(cost.id);
    setEditData(cost);
  };

  const saveEdit = () => {
    if (!editData.type?.trim()) {
      toast({ title: 'Informe o nome da despesa', variant: 'destructive' });
      return;
    }
    if (editingId) updateFixedCost(editingId, editData);
    setEditingId(null);
    setEditData({});
  };

  const saveNew = () => {
    if (!editData.type?.trim()) {
      toast({ title: 'Informe o nome da despesa', variant: 'destructive' });
      return;
    }
    addFixedCost({
      type: editData.type || '',
      category: (editData.category as FixedCost['category']) || 'operational',
      monthlyValue: editData.monthlyValue || 0,
      allocationPercent: editData.allocationPercent || 0,
    });
    setIsAdding(false);
    setEditData({});
  };

  const cancel = () => {
    setEditingId(null);
    setEditData({});
    setIsAdding(false);
  };

  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm text-muted-foreground">Total mensal</span>
          <p className="text-2xl font-bold text-foreground">{fmt(total)}</p>
        </div>
        <button
          onClick={() => { setIsAdding(true); setEditData({}); }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          Adicionar
        </button>
      </div>

      {/* Cost list */}
      <div className="space-y-2">
        {isAdding && (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-background border border-primary/30">
            <input
              autoFocus
              type="text"
              placeholder="Nome da despesa"
              value={editData.type || ''}
              onChange={(e) => setEditData({ ...editData, type: e.target.value })}
              className="flex-1 px-3 py-2 rounded-lg bg-card border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
            />
            <div className="relative w-32">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">R$</span>
              <input
                type="number"
                placeholder="0,00"
                value={editData.monthlyValue || ''}
                onChange={(e) => setEditData({ ...editData, monthlyValue: parseFloat(e.target.value) || 0 })}
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-card border border-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary/40"
              />
            </div>
            <button onClick={saveNew} className="p-2 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-all">
              <Check className="w-4 h-4" />
            </button>
            <button onClick={cancel} className="p-2 rounded-lg bg-destructive/20 text-destructive hover:bg-destructive/30 transition-all">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {fixedCosts.map((cost) => (
          <div
            key={cost.id}
            className="flex items-center gap-3 p-3 rounded-lg transition-all"
            style={{
              background: editingId === cost.id ? 'hsl(var(--background))' : 'transparent',
              border: editingId === cost.id ? '1px solid hsl(var(--primary) / 0.3)' : '1px solid transparent',
            }}
          >
            {editingId === cost.id ? (
              <>
                <input
                  autoFocus
                  type="text"
                  value={editData.type || ''}
                  onChange={(e) => setEditData({ ...editData, type: e.target.value })}
                  className="flex-1 px-3 py-2 rounded-lg bg-card border border-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary/40"
                />
                <div className="relative w-32">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">R$</span>
                  <input
                    type="number"
                    value={editData.monthlyValue || ''}
                    onChange={(e) => setEditData({ ...editData, monthlyValue: parseFloat(e.target.value) || 0 })}
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-card border border-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary/40"
                  />
                </div>
                <button onClick={saveEdit} className="p-2 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-all">
                  <Check className="w-4 h-4" />
                </button>
                <button onClick={cancel} className="p-2 rounded-lg bg-destructive/20 text-destructive hover:bg-destructive/30 transition-all">
                  <X className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-foreground">{cost.type}</span>
                </div>
                <span className="text-sm font-semibold text-foreground tabular-nums">{fmt(cost.monthlyValue)}</span>
                <button onClick={() => startEdit(cost)} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => setDeleteDialog({ isOpen: true, id: cost.id, name: cost.type })} className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>
        ))}

        {fixedCosts.length === 0 && !isAdding && (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">Nenhuma despesa cadastrada</p>
            <button
              onClick={() => setIsAdding(true)}
              className="mt-3 text-sm text-primary hover:underline"
            >
              Adicionar primeira despesa
            </button>
          </div>
        )}
      </div>

      <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/10">
        <Info className="w-4 h-4 text-primary mt-0.5 shrink-0" />
        <p className="text-xs text-muted-foreground">
          Essas despesas podem ser incluídas no cálculo de preço dos produtos. Ao precificar,
          você escolhe se quer considerar esses custos ou não.
        </p>
      </div>

      <DeleteConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, id: '', name: '' })}
        onConfirm={() => { deleteFixedCost(deleteDialog.id); setDeleteDialog({ isOpen: false, id: '', name: '' }); }}
        itemName={deleteDialog.name}
      />
    </div>
  );
};

// ═══════════════════════════════════════════════════════
// 3. TAXAS PADRÃO
// ═══════════════════════════════════════════════════════
const DefaultTaxesSection = () => {
  const { taxConfig, updateTaxConfig } = useData();
  const [taxes, setTaxes] = useState<TaxConfig>(taxConfig);

  useEffect(() => { setTaxes(taxConfig); }, [taxConfig]);

  const save = () => updateTaxConfig(taxes);

  const otherTotal = taxes.otherFees.reduce((s, f) => s + f.percentage, 0);
  const totalRate = taxes.salesTax + taxes.marketplaceFee + taxes.cardFee + otherTotal;

  const TaxInput = ({
    label,
    icon: Icon,
    value,
    onChange,
  }: {
    label: string;
    icon: React.ElementType;
    value: number;
    onChange: (v: number) => void;
  }) => (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-background border border-border">
      <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
      <span className="flex-1 text-sm text-foreground">{label}</span>
      <div className="relative w-24">
        <input
          type="number"
          step="0.1"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className="w-full pr-7 pl-3 py-2 rounded-lg bg-card border border-border text-foreground text-sm font-semibold text-right focus:outline-none focus:ring-1 focus:ring-primary/40 tabular-nums"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">%</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Total */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-primary/5 border border-primary/15">
        <div>
          <span className="text-sm text-muted-foreground">Taxa total sobre venda</span>
          <p className="text-2xl font-bold text-primary tabular-nums">{totalRate.toFixed(1)}%</p>
        </div>
        <button
          onClick={save}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-all"
        >
          <Save className="w-4 h-4" />
          Salvar
        </button>
      </div>

      {/* Main taxes */}
      <div className="space-y-2">
        <TaxInput
          label="Imposto sobre venda"
          icon={Receipt}
          value={taxes.salesTax}
          onChange={(v) => setTaxes({ ...taxes, salesTax: v })}
        />
        <TaxInput
          label="Comissão / Marketplace"
          icon={Store}
          value={taxes.marketplaceFee}
          onChange={(v) => setTaxes({ ...taxes, marketplaceFee: v })}
        />
        <TaxInput
          label="Taxa de cartão"
          icon={CreditCard}
          value={taxes.cardFee}
          onChange={(v) => setTaxes({ ...taxes, cardFee: v })}
        />
      </div>

      {/* Other fees */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">Outras taxas</span>
          <button
            onClick={() => {
              const newId = (Date.now()).toString();
              setTaxes({ ...taxes, otherFees: [...taxes.otherFees, { id: newId, name: '', percentage: 0 }] });
            }}
            className="flex items-center gap-1 text-xs text-primary hover:underline"
          >
            <Plus className="w-3 h-3" /> Adicionar
          </button>
        </div>
        {taxes.otherFees.map((fee) => (
          <div key={fee.id} className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Nome da taxa"
              value={fee.name}
              onChange={(e) =>
                setTaxes({
                  ...taxes,
                  otherFees: taxes.otherFees.map((f) =>
                    f.id === fee.id ? { ...f, name: e.target.value } : f
                  ),
                })
              }
              className="flex-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
            />
            <div className="relative w-20">
              <input
                type="number"
                step="0.1"
                value={fee.percentage}
                onChange={(e) =>
                  setTaxes({
                    ...taxes,
                    otherFees: taxes.otherFees.map((f) =>
                      f.id === fee.id ? { ...f, percentage: parseFloat(e.target.value) || 0 } : f
                    ),
                  })
                }
                className="w-full pr-7 pl-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm font-semibold text-right focus:outline-none focus:ring-1 focus:ring-primary/40 tabular-nums"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">%</span>
            </div>
            <button
              onClick={() => setTaxes({ ...taxes, otherFees: taxes.otherFees.filter((f) => f.id !== fee.id) })}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════
// 4. CANAIS DE VENDA
// ═══════════════════════════════════════════════════════
const SalesChannelsSection = () => {
  const [channels, setChannels] = useLocalStorage<SalesChannel[]>(
    'pricing-app-sales-channels',
    DEFAULT_SALES_CHANNELS
  );
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<SalesChannel>>({});

  const toggleActive = (id: string) => {
    setChannels(channels.map((c) => (c.id === id ? { ...c, active: !c.active } : c)));
  };

  const startEdit = (ch: SalesChannel) => {
    setEditingId(ch.id);
    setEditData(ch);
  };

  const saveEdit = () => {
    if (editingId) {
      setChannels(channels.map((c) => (c.id === editingId ? { ...c, ...editData } as SalesChannel : c)));
      toast({ title: 'Canal atualizado' });
    }
    setEditingId(null);
    setEditData({});
  };

  const cancel = () => { setEditingId(null); setEditData({}); };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Cada canal possui taxas padrão que são aplicadas automaticamente ao simular preços.
      </p>

      <div className="space-y-3">
        {channels.map((ch) => (
          <div
            key={ch.id}
            className="rounded-xl overflow-hidden transition-all duration-200"
            style={{
              background: editingId === ch.id ? 'hsl(var(--background))' : 'transparent',
              border: editingId === ch.id ? '1px solid hsl(var(--primary) / 0.3)' : '1px solid hsl(var(--border))',
              opacity: ch.active ? 1 : 0.5,
            }}
          >
            {editingId === ch.id ? (
              <div className="p-4 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{ch.icon}</span>
                  <span className="text-sm font-semibold text-foreground">{ch.name}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { label: 'Comissão', key: 'commissionPercent' },
                    { label: 'Imposto', key: 'salesTax' },
                    { label: 'Taxa cartão', key: 'cardFee' },
                    { label: 'Taxa fixa (R$)', key: 'fixedFee' },
                    { label: 'Custo adicional', key: 'additionalCost' },
                  ].map(({ label, key }) => (
                    <div key={key}>
                      <label className="block text-xs text-muted-foreground mb-1">{label}</label>
                      <input
                        type="number"
                        step="0.1"
                        value={(editData as any)[key] ?? 0}
                        onChange={(e) => setEditData({ ...editData, [key]: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 rounded-lg bg-card border border-border text-foreground text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-primary/40 tabular-nums"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button onClick={saveEdit} className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-all">
                    <Check className="w-4 h-4" /> Salvar
                  </button>
                  <button onClick={cancel} className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-muted text-muted-foreground hover:bg-muted/80 transition-all">
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4 p-4">
                <span className="text-xl">{ch.icon}</span>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-semibold text-foreground">{ch.name}</span>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                    {ch.commissionPercent > 0 && (
                      <span className="text-xs text-muted-foreground">Comissão: {ch.commissionPercent}%</span>
                    )}
                    <span className="text-xs text-muted-foreground">Imposto: {ch.salesTax}%</span>
                    {ch.cardFee > 0 && (
                      <span className="text-xs text-muted-foreground">Cartão: {ch.cardFee}%</span>
                    )}
                    {ch.fixedFee > 0 && (
                      <span className="text-xs text-muted-foreground">Fixa: R$ {ch.fixedFee}</span>
                    )}
                  </div>
                </div>
                <Switch
                  checked={ch.active}
                  onCheckedChange={() => toggleActive(ch.id)}
                  className="shrink-0"
                />
                <button
                  onClick={() => startEdit(ch)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all shrink-0"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════
export const FinancialSettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[32px] font-bold text-foreground leading-tight tracking-tight">
          Configurações Financeiras
        </h2>
        <p className="text-base font-medium text-muted-foreground mt-1">
          Configure seu negócio, custos, taxas e canais de venda em um só lugar
        </p>
      </div>

      <div className="space-y-4">
        <Section
          icon={Building2}
          title="Perfil do Negócio"
          description="Tipo de operação, regime tributário e dados da empresa"
        >
          <BusinessProfileSection />
        </Section>

        <Section
          icon={Receipt}
          title="Custos da Empresa"
          description="Despesas fixas mensais que impactam seus preços"
        >
          <CompanyCostsSection />
        </Section>

        <Section
          icon={CreditCard}
          title="Taxas Padrão"
          description="Impostos, comissões e taxas aplicadas nas vendas"
        >
          <DefaultTaxesSection />
        </Section>

        <Section
          icon={ShoppingCart}
          title="Canais de Venda"
          description="Marketplaces ativos e suas taxas por canal"
          defaultOpen={false}
        >
          <SalesChannelsSection />
        </Section>
      </div>
    </div>
  );
};

import { useState, useEffect } from 'react';
import { useData } from '@/contexts/DataContext';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { DEFAULT_SALES_CHANNELS, SalesChannel } from '@/data/salesChannels';
import { FixedCost, TaxConfig } from '@/data/mockData';
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
  ShoppingCart,
  Info,
  TrendingUp,
  Hash,
  Wallet,
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Switch } from '@/components/ui/switch';
import { DeleteConfirmDialog } from '@/components/shared/DeleteConfirmDialog';

// ─── Helpers ──────────────────────────────────────────
const fmt = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

// ─── Premium Section wrapper ──────────────────────────
const Section = ({
  icon: Icon,
  title,
  description,
  children,
  defaultOpen = true,
  accentColor,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  accentColor?: string;
}) => {
  const [open, setOpen] = useState(defaultOpen);
  const accent = accentColor || 'var(--color-blue)';

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div
        className="rounded-2xl overflow-hidden transition-all duration-300"
        style={{
          background: 'hsl(225 18% 7%)',
          border: '1px solid hsl(225 14% 11%)',
          boxShadow: '0 2px 20px rgba(0,0,0,0.2)',
        }}
      >
        <CollapsibleTrigger asChild>
          <button className="w-full flex items-center gap-4 px-6 py-5 text-left transition-colors hover:bg-white/[0.015] group">
            <div
              className="p-2.5 rounded-xl transition-all duration-300 group-hover:scale-105"
              style={{
                background: `hsl(${accent} / 0.08)`,
                border: `1px solid hsl(${accent} / 0.15)`,
              }}
            >
              <Icon className="w-5 h-5" style={{ color: `hsl(${accent})` }} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-[15px] font-semibold text-white">{title}</h3>
              <p className="text-[13px] mt-0.5" style={{ color: 'hsl(215 10% 50%)' }}>
                {description}
              </p>
            </div>
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
              style={{ background: 'hsl(225 16% 10%)' }}
            >
              {open ? (
                <ChevronDown className="w-4 h-4" style={{ color: 'hsl(215 10% 50%)' }} />
              ) : (
                <ChevronRight className="w-4 h-4" style={{ color: 'hsl(215 10% 50%)' }} />
              )}
            </div>
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-6 pb-6 pt-2">{children}</div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};

// ═══════════════════════════════════════════════════════
// SUMMARY STRIP
// ═══════════════════════════════════════════════════════
type TaxRegime = 'mei' | 'simples' | 'presumido' | 'real';
interface BusinessProfileData {
  operationType: string;
  taxRegime: TaxRegime;
  companyName: string;
  monthlyRevenue: number;
}

const regimeLabels: Record<TaxRegime, string> = {
  mei: 'MEI',
  simples: 'Simples Nacional',
  presumido: 'Lucro Presumido',
  real: 'Lucro Real',
};

const SummaryStrip = () => {
  const { taxConfig, fixedCosts } = useData();
  const [profile] = useLocalStorage<BusinessProfileData>('pricing-app-business-profile', {
    operationType: 'revenda',
    taxRegime: 'simples',
    companyName: '',
    monthlyRevenue: 0,
  });
  const [channels] = useLocalStorage<SalesChannel[]>('pricing-app-sales-channels', DEFAULT_SALES_CHANNELS);

  const otherTotal = taxConfig.otherFees.reduce((s, f) => s + f.percentage, 0);
  const totalRate = taxConfig.salesTax + taxConfig.marketplaceFee + taxConfig.cardFee + otherTotal;
  const totalCosts = fixedCosts.reduce((s, c) => s + c.monthlyValue, 0);
  const activeChannels = channels.filter((c) => c.active).length;

  const items = [
    {
      label: 'Regime Tributário',
      value: regimeLabels[profile.taxRegime] || 'Simples Nacional',
      icon: Building2,
      accent: 'var(--color-blue)',
    },
    {
      label: 'Taxa Total Padrão',
      value: `${totalRate.toFixed(1)}%`,
      icon: TrendingUp,
      accent: 'var(--color-orange)',
    },
    {
      label: 'Despesas Mensais',
      value: fmt(totalCosts),
      icon: Wallet,
      accent: 'var(--color-pink)',
    },
    {
      label: 'Canais Ativos',
      value: `${activeChannels}`,
      icon: Hash,
      accent: 'var(--color-green)',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="relative rounded-2xl p-4 overflow-hidden transition-all duration-300 hover:-translate-y-0.5"
          style={{
            background: 'hsl(225 18% 7%)',
            border: '1px solid hsl(225 14% 11%)',
            boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
          }}
        >
          <div
            className="absolute bottom-0 left-0 right-0 h-[2px]"
            style={{ background: `hsl(${item.accent} / 0.4)` }}
          />
          <div className="flex items-center gap-2.5 mb-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                background: `hsl(${item.accent} / 0.08)`,
                border: `1px solid hsl(${item.accent} / 0.15)`,
              }}
            >
              <item.icon className="w-4 h-4" style={{ color: `hsl(${item.accent})` }} />
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.06em]" style={{ color: 'hsl(215 10% 50%)' }}>
              {item.label}
            </span>
          </div>
          <p className="text-lg font-bold text-white mono tabular-nums">{item.value}</p>
        </div>
      ))}
    </div>
  );
};

// ═══════════════════════════════════════════════════════
// 1. PERFIL DO NEGÓCIO
// ═══════════════════════════════════════════════════════
type OperationType = 'revenda' | 'fabricacao' | 'servicos';

const operationOptions: { value: OperationType; label: string; desc: string }[] = [
  { value: 'revenda', label: 'Revenda', desc: 'Compro e revendo produtos' },
  { value: 'fabricacao', label: 'Fabricação', desc: 'Produzo meus próprios produtos' },
  { value: 'servicos', label: 'Serviços + Produtos', desc: 'Vendo serviços e produtos' },
];

const taxRegimeOptions: { value: TaxRegime; label: string; desc: string }[] = [
  { value: 'mei', label: 'MEI', desc: 'Até R$ 81 mil/ano' },
  { value: 'simples', label: 'Simples Nacional', desc: 'Até R$ 4,8 mi/ano' },
  { value: 'presumido', label: 'Lucro Presumido', desc: 'Base presumida' },
  { value: 'real', label: 'Lucro Real', desc: 'Sobre lucro real' },
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

  const OptionCard = ({
    selected,
    onClick,
    label,
    desc,
  }: {
    selected: boolean;
    onClick: () => void;
    label: string;
    desc: string;
  }) => (
    <button
      onClick={onClick}
      className="p-4 rounded-xl text-left transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.97]"
      style={{
        background: selected ? 'hsl(var(--color-blue) / 0.08)' : 'hsl(225 16% 9%)',
        border: selected ? '1px solid hsl(var(--color-blue) / 0.35)' : '1px solid hsl(225 14% 12%)',
        boxShadow: selected ? '0 0 16px hsl(var(--color-blue) / 0.06)' : 'none',
      }}
    >
      <span className="block text-sm font-semibold text-white">{label}</span>
      <span className="block text-xs mt-1" style={{ color: 'hsl(215 10% 50%)' }}>
        {desc}
      </span>
    </button>
  );

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-[13px] font-medium text-white mb-2">Nome da empresa</label>
        <input
          type="text"
          value={local.companyName}
          onChange={(e) => setLocal({ ...local, companyName: e.target.value })}
          placeholder="Ex: Minha Loja Online"
          className="input-field max-w-md"
        />
      </div>

      <div>
        <label className="block text-[13px] font-medium text-white mb-3">Tipo de operação</label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {operationOptions.map((op) => (
            <OptionCard
              key={op.value}
              selected={local.operationType === op.value}
              onClick={() => setLocal({ ...local, operationType: op.value })}
              label={op.label}
              desc={op.desc}
            />
          ))}
        </div>
      </div>

      <div>
        <label className="block text-[13px] font-medium text-white mb-3">Regime tributário</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {taxRegimeOptions.map((r) => (
            <OptionCard
              key={r.value}
              selected={local.taxRegime === r.value}
              onClick={() => setLocal({ ...local, taxRegime: r.value })}
              label={r.label}
              desc={r.desc}
            />
          ))}
        </div>
      </div>

      <div>
        <label className="block text-[13px] font-medium text-white mb-2">
          Faturamento mensal médio
        </label>
        <div className="relative max-w-xs">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm" style={{ color: 'hsl(215 10% 45%)' }}>
            R$
          </span>
          <input
            type="number"
            value={local.monthlyRevenue || ''}
            onChange={(e) => setLocal({ ...local, monthlyRevenue: parseFloat(e.target.value) || 0 })}
            placeholder="0,00"
            className="input-field pl-10"
          />
        </div>
      </div>

      <button
        onClick={save}
        className="btn-primary flex items-center gap-2"
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

  const InlineRow = ({
    nameValue,
    amountValue,
    onNameChange,
    onAmountChange,
    onSave,
    onCancel,
    autoFocusName,
  }: {
    nameValue: string;
    amountValue: number | string;
    onNameChange: (v: string) => void;
    onAmountChange: (v: number) => void;
    onSave: () => void;
    onCancel: () => void;
    autoFocusName?: boolean;
  }) => (
    <div
      className="flex items-center gap-3 p-3 rounded-xl"
      style={{
        background: 'hsl(225 16% 9%)',
        border: '1px solid hsl(var(--color-blue) / 0.2)',
      }}
    >
      <input
        autoFocus={autoFocusName}
        type="text"
        placeholder="Nome da despesa"
        value={nameValue}
        onChange={(e) => onNameChange(e.target.value)}
        className="input-field flex-1 !min-h-[36px] !py-2 text-sm"
      />
      <div className="relative w-32">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: 'hsl(215 10% 45%)' }}>
          R$
        </span>
        <input
          type="number"
          placeholder="0,00"
          value={amountValue || ''}
          onChange={(e) => onAmountChange(parseFloat(e.target.value) || 0)}
          className="input-field w-full !min-h-[36px] !py-2 pl-9 text-sm font-semibold tabular-nums text-right"
        />
      </div>
      <button onClick={onSave} className="p-2 rounded-lg transition-all" style={{ background: 'hsl(var(--color-green) / 0.1)', color: 'hsl(var(--color-green))' }}>
        <Check className="w-4 h-4" />
      </button>
      <button onClick={onCancel} className="p-2 rounded-lg transition-all" style={{ background: 'hsl(var(--color-pink) / 0.1)', color: 'hsl(var(--color-pink))' }}>
        <X className="w-4 h-4" />
      </button>
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Summary bar */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.06em]" style={{ color: 'hsl(215 10% 50%)' }}>
            Total mensal
          </span>
          <p className="text-2xl font-bold text-white mono tabular-nums">{fmt(total)}</p>
        </div>
        <button
          onClick={() => { setIsAdding(true); setEditData({}); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 active:scale-[0.97]"
          style={{
            background: 'hsl(var(--color-blue) / 0.08)',
            border: '1px solid hsl(var(--color-blue) / 0.2)',
            color: 'hsl(var(--color-blue))',
          }}
        >
          <Plus className="w-4 h-4" />
          Adicionar
        </button>
      </div>

      {/* Cost list */}
      <div className="space-y-1.5">
        {isAdding && (
          <InlineRow
            nameValue={editData.type || ''}
            amountValue={editData.monthlyValue || ''}
            onNameChange={(v) => setEditData({ ...editData, type: v })}
            onAmountChange={(v) => setEditData({ ...editData, monthlyValue: v })}
            onSave={saveNew}
            onCancel={cancel}
            autoFocusName
          />
        )}

        {fixedCosts.map((cost) =>
          editingId === cost.id ? (
            <InlineRow
              key={cost.id}
              nameValue={editData.type || ''}
              amountValue={editData.monthlyValue || ''}
              onNameChange={(v) => setEditData({ ...editData, type: v })}
              onAmountChange={(v) => setEditData({ ...editData, monthlyValue: v })}
              onSave={saveEdit}
              onCancel={cancel}
              autoFocusName
            />
          ) : (
            <div
              key={cost.id}
              className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group hover:bg-white/[0.015]"
              style={{ border: '1px solid transparent' }}
            >
              <div
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ background: 'hsl(var(--color-blue) / 0.4)' }}
              />
              <span className="flex-1 text-sm font-medium text-white">{cost.type}</span>
              <span className="text-sm font-semibold text-white tabular-nums mono">
                {fmt(cost.monthlyValue)}
              </span>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => startEdit(cost)}
                  className="p-1.5 rounded-lg hover:bg-white/5 transition-all"
                  style={{ color: 'hsl(215 10% 55%)' }}
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeleteDialog({ isOpen: true, id: cost.id, name: cost.type })}
                  className="p-1.5 rounded-lg hover:bg-red-500/10 transition-all"
                  style={{ color: 'hsl(215 10% 55%)' }}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )
        )}

        {fixedCosts.length === 0 && !isAdding && (
          <div className="text-center py-10">
            <Wallet className="w-8 h-8 mx-auto mb-3" style={{ color: 'hsl(215 10% 30%)' }} />
            <p className="text-sm" style={{ color: 'hsl(215 10% 45%)' }}>Nenhuma despesa cadastrada</p>
            <button
              onClick={() => setIsAdding(true)}
              className="mt-3 text-sm font-medium hover:underline"
              style={{ color: 'hsl(var(--color-blue))' }}
            >
              Adicionar primeira despesa
            </button>
          </div>
        )}
      </div>

      <div
        className="flex items-start gap-3 p-4 rounded-xl"
        style={{
          background: 'hsl(var(--color-blue) / 0.04)',
          border: '1px solid hsl(var(--color-blue) / 0.08)',
        }}
      >
        <Info className="w-4 h-4 mt-0.5 shrink-0" style={{ color: 'hsl(var(--color-blue))' }} />
        <p className="text-xs" style={{ color: 'hsl(215 10% 55%)' }}>
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

  const taxItems: { label: string; icon: React.ElementType; value: number; key: string; accent: string }[] = [
    { label: 'Imposto sobre venda', icon: Receipt, value: taxes.salesTax, key: 'salesTax', accent: 'var(--color-orange)' },
    { label: 'Comissão / Marketplace', icon: Store, value: taxes.marketplaceFee, key: 'marketplaceFee', accent: 'var(--color-purple)' },
    { label: 'Taxa de cartão', icon: CreditCard, value: taxes.cardFee, key: 'cardFee', accent: 'var(--color-green)' },
  ];

  return (
    <div className="space-y-5">
      {/* Total highlight */}
      <div
        className="flex items-center justify-between p-5 rounded-2xl"
        style={{
          background: 'linear-gradient(135deg, hsl(var(--color-blue) / 0.06) 0%, hsl(225 18% 7%) 100%)',
          border: '1px solid hsl(var(--color-blue) / 0.15)',
        }}
      >
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.06em]" style={{ color: 'hsl(215 10% 50%)' }}>
            Taxa total sobre venda
          </span>
          <p className="text-3xl font-bold mono tabular-nums" style={{ color: 'hsl(var(--color-blue))' }}>
            {totalRate.toFixed(1)}%
          </p>
        </div>
        <button
          onClick={save}
          className="btn-primary flex items-center gap-2 text-sm"
        >
          <Save className="w-4 h-4" />
          Salvar Taxas
        </button>
      </div>

      {/* Main tax items */}
      <div className="space-y-2">
        {taxItems.map((item) => (
          <div
            key={item.key}
            className="flex items-center gap-4 p-4 rounded-xl transition-all duration-200 hover:bg-white/[0.01]"
            style={{
              background: 'hsl(225 16% 9%)',
              border: '1px solid hsl(225 14% 12%)',
            }}
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
              style={{
                background: `hsl(${item.accent} / 0.08)`,
                border: `1px solid hsl(${item.accent} / 0.15)`,
              }}
            >
              <item.icon className="w-4 h-4" style={{ color: `hsl(${item.accent})` }} />
            </div>
            <span className="flex-1 text-sm font-medium text-white">{item.label}</span>
            <div className="relative w-24">
              <input
                type="number"
                step="0.1"
                value={(taxes as any)[item.key]}
                onChange={(e) => setTaxes({ ...taxes, [item.key]: parseFloat(e.target.value) || 0 })}
                className="input-field w-full !min-h-[38px] !py-2 pr-8 text-right text-sm font-bold tabular-nums mono"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: 'hsl(215 10% 40%)' }}>
                %
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Other fees */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-medium text-white">Outras taxas</span>
          <button
            onClick={() => {
              const newId = Date.now().toString();
              setTaxes({ ...taxes, otherFees: [...taxes.otherFees, { id: newId, name: '', percentage: 0 }] });
            }}
            className="flex items-center gap-1.5 text-xs font-medium transition-all"
            style={{ color: 'hsl(var(--color-blue))' }}
          >
            <Plus className="w-3.5 h-3.5" /> Adicionar
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
              className="input-field flex-1 !min-h-[36px] !py-2 text-sm"
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
                className="input-field w-full !min-h-[36px] !py-2 pr-7 text-right text-sm font-semibold tabular-nums mono"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: 'hsl(215 10% 40%)' }}>
                %
              </span>
            </div>
            <button
              onClick={() => setTaxes({ ...taxes, otherFees: taxes.otherFees.filter((f) => f.id !== fee.id) })}
              className="p-1.5 rounded-lg transition-all hover:bg-red-500/10"
              style={{ color: 'hsl(215 10% 50%)' }}
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
      {/* Disclaimer */}
      <div
        className="flex items-start gap-3 p-4 rounded-xl"
        style={{
          background: 'hsl(var(--color-orange) / 0.04)',
          border: '1px solid hsl(var(--color-orange) / 0.1)',
        }}
      >
        <Info className="w-4 h-4 mt-0.5 shrink-0" style={{ color: 'hsl(var(--color-orange))' }} />
        <p className="text-xs leading-relaxed" style={{ color: 'hsl(215 10% 55%)' }}>
          As taxas de cada marketplace podem variar conforme a categoria do produto, tipo de anúncio, plano do vendedor e regras da plataforma.
          Ajuste os valores conforme sua realidade.
        </p>
      </div>

      <div className="space-y-2">
        {channels.map((ch) => (
          <div
            key={ch.id}
            className="rounded-xl overflow-hidden transition-all duration-200"
            style={{
              background: editingId === ch.id ? 'hsl(225 16% 9%)' : 'transparent',
              border: editingId === ch.id ? '1px solid hsl(var(--color-blue) / 0.2)' : '1px solid hsl(225 14% 11%)',
              opacity: ch.active ? 1 : 0.45,
            }}
          >
            {editingId === ch.id ? (
              <div className="p-5 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{ch.icon}</span>
                  <span className="text-sm font-semibold text-white">{ch.name}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { label: 'Comissão (%)', key: 'commissionPercent' },
                    { label: 'Imposto (%)', key: 'salesTax' },
                    { label: 'Taxa cartão (%)', key: 'cardFee' },
                    { label: 'Taxa fixa (R$)', key: 'fixedFee' },
                    { label: 'Custo adicional (R$)', key: 'additionalCost' },
                  ].map(({ label, key }) => (
                    <div key={key}>
                      <label className="block text-[11px] font-medium mb-1.5" style={{ color: 'hsl(215 10% 50%)' }}>
                        {label}
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={(editData as any)[key] ?? 0}
                        onChange={(e) => setEditData({ ...editData, [key]: parseFloat(e.target.value) || 0 })}
                        className="input-field w-full !min-h-[36px] !py-2 text-sm font-semibold tabular-nums"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={saveEdit}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all active:scale-[0.97]"
                    style={{
                      background: 'hsl(var(--color-blue) / 0.1)',
                      border: '1px solid hsl(var(--color-blue) / 0.25)',
                      color: 'hsl(var(--color-blue))',
                    }}
                  >
                    <Check className="w-4 h-4" /> Salvar
                  </button>
                  <button
                    onClick={cancel}
                    className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
                    style={{
                      background: 'hsl(225 16% 10%)',
                      color: 'hsl(215 10% 55%)',
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4 px-4 py-3.5 group">
                <span className="text-xl">{ch.icon}</span>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-semibold text-white">{ch.name}</span>
                  <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-0.5">
                    {ch.commissionPercent > 0 && (
                      <span className="text-[11px]" style={{ color: 'hsl(215 10% 45%)' }}>
                        Comissão: {ch.commissionPercent}%
                      </span>
                    )}
                    <span className="text-[11px]" style={{ color: 'hsl(215 10% 45%)' }}>
                      Imposto: {ch.salesTax}%
                    </span>
                    {ch.cardFee > 0 && (
                      <span className="text-[11px]" style={{ color: 'hsl(215 10% 45%)' }}>
                        Cartão: {ch.cardFee}%
                      </span>
                    )}
                    {ch.fixedFee > 0 && (
                      <span className="text-[11px]" style={{ color: 'hsl(215 10% 45%)' }}>
                        Fixa: R$ {ch.fixedFee}
                      </span>
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
                  className="p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100 hover:bg-white/5"
                  style={{ color: 'hsl(215 10% 55%)' }}
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
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-[28px] font-bold text-white leading-tight tracking-tight">
          Configurações Financeiras
        </h1>
        <p className="text-[15px] mt-1.5" style={{ color: 'hsl(215 10% 50%)' }}>
          Configure seu negócio, custos, taxas e canais de venda em um só lugar
        </p>
      </div>

      {/* Summary strip */}
      <SummaryStrip />

      {/* Sections */}
      <div className="space-y-4">
        <Section
          icon={Building2}
          title="Perfil do Negócio"
          description="Tipo de operação, regime tributário e dados da empresa"
          accentColor="var(--color-blue)"
        >
          <BusinessProfileSection />
        </Section>

        <Section
          icon={Receipt}
          title="Custos da Empresa"
          description="Despesas fixas mensais que impactam seus preços"
          accentColor="var(--color-pink)"
        >
          <CompanyCostsSection />
        </Section>

        <Section
          icon={CreditCard}
          title="Taxas Padrão"
          description="Impostos, comissões e taxas aplicadas nas vendas"
          accentColor="var(--color-orange)"
        >
          <DefaultTaxesSection />
        </Section>

        <Section
          icon={ShoppingCart}
          title="Canais de Venda"
          description="Marketplaces ativos e suas taxas configuráveis"
          accentColor="var(--color-green)"
          defaultOpen={false}
        >
          <SalesChannelsSection />
        </Section>
      </div>
    </div>
  );
};

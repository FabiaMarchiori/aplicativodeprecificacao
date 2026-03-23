import { useState, useMemo, useEffect } from 'react';
import { Product, calculatePricing, FixedCostAllocationMode, TaxConfig } from '@/data/mockData';
import { DEFAULT_SALES_CHANNELS, SalesChannel } from '@/data/salesChannels';
import { useData } from '@/contexts/DataContext';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ArrowRight, ChevronDown, Settings2, Check, Sparkles, TrendingUp, DollarSign, Target, ShieldCheck } from 'lucide-react';
import { MarketplaceLogo, getChannelColor } from './MarketplaceLogos';

interface PricingSimulatorSheetProps {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
}

export const PricingSimulatorSheet = ({ isOpen, product, onClose }: PricingSimulatorSheetProps) => {
  const { fixedCosts, taxConfig, products, updateProduct } = useData();
  const [margin, setMargin] = useState(25);
  const [allocationMode, setAllocationMode] = useState<FixedCostAllocationMode>('exclude');
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [selectedChannelId, setSelectedChannelId] = useState<string>('loja-propria');
  const [applied, setApplied] = useState(false);

  const activeCount = useMemo(() => products.filter(p => p.status === 'active').length, [products]);
  const selectedChannel = useMemo(() => DEFAULT_SALES_CHANNELS.find(c => c.id === selectedChannelId) ?? DEFAULT_SALES_CHANNELS[0], [selectedChannelId]);

  const channelTaxConfig = useMemo<TaxConfig>(() => ({
    salesTax: selectedChannel.salesTax,
    marketplaceFee: selectedChannel.commissionPercent,
    cardFee: selectedChannel.cardFee,
    otherFees: selectedChannel.additionalCost > 0
      ? [{ id: 'channel-additional', name: 'Custo adicional', percentage: selectedChannel.additionalCost }]
      : [],
  }), [selectedChannel]);

  useEffect(() => {
    if (product && isOpen) {
      const saved = DEFAULT_SALES_CHANNELS.find(c => c.id === product.category);
      setSelectedChannelId(saved ? saved.id : 'loja-propria');
      setMargin(25);
      setAllocationMode('exclude');
      setAdvancedOpen(false);
      setApplied(false);
    }
  }, [product, isOpen]);

  const pricing = useMemo(() => {
    if (!product) return null;
    const p = selectedChannel.fixedFee > 0
      ? { ...product, variableCost: product.variableCost + selectedChannel.fixedFee }
      : product;
    return calculatePricing(p, fixedCosts, channelTaxConfig, margin, allocationMode, activeCount);
  }, [product, fixedCosts, channelTaxConfig, margin, allocationMode, activeCount, selectedChannel]);

  const fmt = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  const handleApplyPrice = async () => {
    if (!product || !pricing) return;
    await updateProduct(product.id, {
      currentPrice: pricing.suggestedPrice,
      category: selectedChannelId,
    });
    setApplied(true);
    setTimeout(() => onClose(), 800);
  };

  if (!product || !pricing) return null;

  const marginColor = pricing.realMargin >= 25 ? 'hsl(152 60% 48%)' : pricing.realMargin >= 15 ? 'hsl(42 90% 55%)' : 'hsl(0 70% 55%)';
  const totalFeePercent = selectedChannel.commissionPercent + selectedChannel.salesTax + selectedChannel.cardFee + selectedChannel.additionalCost;
  const minPrice = pricing.totalCost + pricing.taxAmount;

  return (
    <Sheet open={isOpen} onOpenChange={open => { if (!open) onClose(); }}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[440px] overflow-y-auto p-0"
        style={{
          background: 'hsl(225 20% 5%)',
          border: 'none',
          borderLeft: '1px solid hsl(225 14% 9%)',
        }}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4">
          <SheetHeader className="p-0">
            <div className="flex items-center gap-2.5 mb-1">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'hsl(var(--color-blue) / 0.08)', border: '1px solid hsl(var(--color-blue) / 0.15)' }}
              >
                <Sparkles className="w-4 h-4" style={{ color: 'hsl(var(--color-blue))' }} />
              </div>
              <SheetTitle className="text-[17px] font-bold text-white">Simulador de Preço</SheetTitle>
            </div>
            <SheetDescription className="text-[13px] pl-[42px] text-white/70">
              {product.name} · {product.code}
            </SheetDescription>
          </SheetHeader>
        </div>

        <div className="px-6 pb-6 space-y-5">
          {/* Canal */}
          <div>
            <SectionLabel>Onde você vai vender?</SectionLabel>
            <div className="grid grid-cols-2 gap-2.5 mt-3">
              {DEFAULT_SALES_CHANNELS.filter(c => c.active).map(ch => {
                const sel = ch.id === selectedChannelId;
                const fees = ch.commissionPercent + ch.salesTax + ch.cardFee + ch.additionalCost;
                const chColor = getChannelColor(ch.id);
                return (
                  <button
                    key={ch.id}
                    onClick={() => setSelectedChannelId(ch.id)}
                    className="relative flex items-center gap-3 px-4 py-[14px] rounded-xl text-left transition-all duration-200 active:scale-[0.97]"
                    style={{
                      background: sel ? 'hsl(225 20% 11%)' : 'hsl(225 18% 9%)',
                      border: `1.5px solid hsl(${chColor} / ${sel ? '0.6' : '0.25'})`,
                      boxShadow: sel
                        ? `0 0 16px hsl(${chColor} / 0.15), 0 0 4px hsl(${chColor} / 0.1)`
                        : 'none',
                    }}
                    onMouseEnter={e => {
                      if (!sel) {
                        e.currentTarget.style.borderColor = `hsl(${chColor} / 0.4)`;
                        e.currentTarget.style.background = 'hsl(225 20% 10%)';
                      }
                    }}
                    onMouseLeave={e => {
                      if (!sel) {
                        e.currentTarget.style.borderColor = `hsl(${chColor} / 0.25)`;
                        e.currentTarget.style.background = 'hsl(225 18% 9%)';
                      }
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: `hsl(${chColor} / ${sel ? '0.2' : '0.12'})` }}
                    >
                      <MarketplaceLogo channelId={ch.id} size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-semibold text-white truncate leading-tight">{ch.name}</p>
                      <p className="text-[10.5px] font-medium tabular-nums mt-0.5 text-white">
                        {fees.toFixed(1)}% taxas
                      </p>
                    </div>
                    {sel && (
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: `hsl(${chColor} / 0.3)`, border: `1.5px solid hsl(${chColor} / 0.5)` }}
                      >
                        <Check className="w-3 h-3" style={{ color: `hsl(${chColor})` }} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custo */}
          <div
            className="p-4 rounded-xl space-y-2"
            style={{ background: 'hsl(225 16% 7%)', border: '1px solid hsl(225 14% 10%)' }}
          >
            <SectionLabel className="!mb-3">Composição de custo</SectionLabel>
            <Row label="Custo do produto" value={fmt(product.purchaseCost)} />
            <Row label="Custo variável / Frete" value={fmt(product.variableCost)} />
            {selectedChannel.fixedFee > 0 && <Row label="Taxa fixa da plataforma" value={fmt(selectedChannel.fixedFee)} />}
            <div className="pt-2.5 mt-1.5" style={{ borderTop: '1px solid hsl(225 14% 10%)' }}>
              <Row label="Custo total" value={fmt(pricing.totalCost)} bold />
            </div>
            <Row label={`Taxas ${selectedChannel.name}`} value={`${totalFeePercent.toFixed(1)}%`} accent />
            <Row label="Valor das taxas" value={fmt(pricing.taxAmount)} />
          </div>

          {/* Margem */}
          <div
            className="p-4 rounded-xl"
            style={{ background: 'hsl(225 16% 7%)', border: '1px solid hsl(225 14% 10%)' }}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-[13px] font-semibold text-white">Margem desejada</span>
              <span className="text-xl font-bold tabular-nums mono" style={{ color: marginColor }}>{margin}%</span>
            </div>
            <Slider value={[margin]} onValueChange={v => setMargin(v[0])} min={5} max={80} step={1} className="w-full" />
            <div className="flex justify-between text-[10px] font-medium mt-2 text-white/40">
              <span>5%</span><span>80%</span>
            </div>
          </div>

          {/* ═══ RESULTADO PREMIUM ═══ */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(160deg, hsl(225 18% 8%) 0%, hsl(var(--color-blue) / 0.04) 100%)',
              border: '1px solid hsl(var(--color-blue) / 0.15)',
              boxShadow: '0 4px 24px hsl(var(--color-blue) / 0.06)',
            }}
          >
            {/* Preço hero */}
            <div className="px-5 pt-5 pb-4 text-center">
              <p className="text-[10px] font-semibold uppercase tracking-[0.1em] mb-1.5" style={{ color: 'hsl(var(--color-blue))' }}>
                Preço Sugerido
              </p>
              <p
                className="text-[36px] font-extrabold text-white tabular-nums tracking-tight leading-none"
                style={{ textShadow: '0 0 30px hsl(var(--color-blue) / 0.15)' }}
              >
                {fmt(pricing.suggestedPrice)}
              </p>
              <div className="flex items-center justify-center gap-1.5 mt-2">
                <MarketplaceLogo channelId={selectedChannelId} size={16} />
                <span className="text-[11px] font-medium text-white/70">{selectedChannel.name}</span>
              </div>
            </div>

            {/* Métricas */}
            <div
              className="grid grid-cols-3 divide-x"
              style={{
                borderTop: '1px solid hsl(225 14% 10%)',
                background: 'hsl(225 18% 6%)',
              }}
            >
              <ResultMetric
                icon={TrendingUp}
                label="Lucro líquido"
                value={fmt(pricing.profitPerUnit)}
                color="hsl(152 60% 52%)"
              />
              <ResultMetric
                icon={Target}
                label="Margem final"
                value={`${pricing.realMargin.toFixed(1)}%`}
                color={marginColor}
              />
              <ResultMetric
                icon={ShieldCheck}
                label="Preço mínimo"
                value={fmt(minPrice)}
                color="hsl(215 10% 70%)"
              />
            </div>
          </div>

          {/* Avançado */}
          <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
            <CollapsibleTrigger
              className="flex items-center gap-2 w-full py-2.5 text-[13px] transition-colors group/adv text-white/70 hover:text-white"
            >
              <Settings2 className="w-3.5 h-3.5" />
              <span className="font-medium transition-colors">Avançado</span>
              <ChevronDown className={`w-3.5 h-3.5 ml-auto transition-transform duration-200 ${advancedOpen ? 'rotate-180' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 pt-2">
              <div
                className="p-4 rounded-xl space-y-2"
                style={{ background: 'hsl(225 16% 7%)', border: '1px solid hsl(225 14% 10%)' }}
              >
                <SectionLabel className="!mb-2.5">Taxas de {selectedChannel.name}</SectionLabel>
                <Row label="Comissão" value={`${selectedChannel.commissionPercent}%`} />
                <Row label="Imposto sobre venda" value={`${selectedChannel.salesTax}%`} />
                {selectedChannel.cardFee > 0 && <Row label="Taxa do cartão" value={`${selectedChannel.cardFee}%`} />}
                {selectedChannel.additionalCost > 0 && <Row label="Custo adicional" value={`${selectedChannel.additionalCost}%`} />}
                {selectedChannel.fixedFee > 0 && <Row label="Taxa fixa por venda" value={fmt(selectedChannel.fixedFee)} />}
              </div>

              <div className="space-y-2.5">
                <p className="text-[13px] font-semibold text-white">Incluir despesas fixas no preço?</p>
                <div className="flex gap-1.5">
                  {(['exclude', 'distribute', 'include'] as FixedCostAllocationMode[]).map(mode => {
                    const labels: Record<FixedCostAllocationMode, string> = {
                      exclude: 'Não incluir',
                      distribute: `Dividir (÷${activeCount})`,
                      include: 'Incluir 100%',
                    };
                    const isActive = allocationMode === mode;
                    return (
                      <button
                        key={mode}
                        onClick={() => setAllocationMode(mode)}
                        className="flex-1 text-[11px] font-semibold py-2.5 rounded-lg transition-all duration-150"
                        style={{
                          background: isActive ? 'hsl(var(--color-blue) / 0.08)' : 'hsl(225 16% 7.5%)',
                          border: `1px solid ${isActive ? 'hsl(var(--color-blue) / 0.25)' : 'hsl(225 14% 11%)'}`,
                          color: isActive ? 'hsl(var(--color-blue))' : 'white',
                        }}
                      >
                        {labels[mode]}
                      </button>
                    );
                  })}
                </div>
                {allocationMode !== 'exclude' && (
                  <div className="p-3 rounded-lg" style={{ background: 'hsl(225 16% 7.5%)', border: '1px solid hsl(225 14% 11%)' }}>
                    <Row label="Despesas incluídas" value={fmt(pricing.allocatedFixedCost)} />
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* CTA */}
          <button
            onClick={handleApplyPrice}
            disabled={applied}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-[14px] font-bold text-white transition-all duration-200 active:scale-[0.97] disabled:opacity-70"
            style={{
              background: applied ? 'hsl(152 60% 38%)' : 'hsl(var(--color-blue))',
              boxShadow: applied ? '0 2px 16px hsl(152 60% 38% / 0.3)' : '0 2px 16px hsl(var(--color-blue) / 0.3)',
            }}
            onMouseEnter={e => { if (!applied) e.currentTarget.style.filter = 'brightness(1.12)'; }}
            onMouseLeave={e => { e.currentTarget.style.filter = 'brightness(1)'; }}
          >
            {applied ? (
              <>
                <Check className="w-4 h-4" />
                Preço aplicado!
              </>
            ) : (
              <>
                Aplicar este preço
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

/* ─── Sub-components ─── */

const SectionLabel = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <p className={`text-[10px] font-semibold uppercase tracking-[0.08em] text-white/70 ${className}`}>
    {children}
  </p>
);

const Row = ({ label, value, bold, accent }: { label: string; value: string; bold?: boolean; accent?: boolean }) => (
  <div className="flex items-center justify-between py-0.5">
    <span className={`text-[12px] ${bold ? 'font-semibold text-white' : 'text-white/70'}`}>
      {label}
    </span>
    <span
      className={`text-[12px] tabular-nums ${bold ? 'font-bold text-white' : 'font-semibold'}`}
      style={!bold ? { color: accent ? 'hsl(var(--color-blue))' : '#FFFFFF' } : undefined}
    >
      {value}
    </span>
  </div>
);

const ResultMetric = ({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: string; color: string }) => (
  <div className="py-3.5 px-3 text-center" style={{ borderColor: 'hsl(225 14% 10%)' }}>
    <Icon className="w-3.5 h-3.5 mx-auto mb-1.5" style={{ color }} />
    <p className="text-[10px] font-medium mb-0.5 text-white/60">{label}</p>
    <p className="text-[13px] font-bold tabular-nums" style={{ color }}>{value}</p>
  </div>
);

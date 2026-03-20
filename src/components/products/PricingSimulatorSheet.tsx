import { useState, useMemo, useEffect } from 'react';
import { Product, calculatePricing, FixedCostAllocationMode, TaxConfig } from '@/data/mockData';
import { DEFAULT_SALES_CHANNELS, SalesChannel, getChannelFixedCosts } from '@/data/salesChannels';
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
import { ArrowRight, ChevronDown, Settings2, Check } from 'lucide-react';

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
      const savedChannel = DEFAULT_SALES_CHANNELS.find(c => c.id === product.category);
      setSelectedChannelId(savedChannel ? savedChannel.id : 'loja-propria');
      setMargin(25);
      setAllocationMode('exclude');
      setAdvancedOpen(false);
    }
  }, [product, isOpen]);

  const pricing = useMemo(() => {
    if (!product) return null;
    const productWithChannelCosts = selectedChannel.fixedFee > 0
      ? { ...product, variableCost: product.variableCost + selectedChannel.fixedFee }
      : product;
    return calculatePricing(productWithChannelCosts, fixedCosts, channelTaxConfig, margin, allocationMode, activeCount);
  }, [product, fixedCosts, channelTaxConfig, margin, allocationMode, activeCount, selectedChannel]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const handleApplyPrice = async () => {
    if (!product || !pricing) return;
    await updateProduct(product.id, {
      currentPrice: pricing.suggestedPrice,
      category: selectedChannelId,
    });
    onClose();
  };

  if (!product || !pricing) return null;

  const marginColor = pricing.realMargin >= 25 ? 'hsl(152 60% 48%)' : pricing.realMargin >= 15 ? 'hsl(42 90% 55%)' : 'hsl(0 70% 55%)';
  const totalFeePercent = selectedChannel.commissionPercent + selectedChannel.salesTax + selectedChannel.cardFee + selectedChannel.additionalCost;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md overflow-y-auto"
        style={{
          background: 'hsl(225 20% 5%)',
          border: 'none',
          borderLeft: '1px solid hsl(225 14% 10%)',
        }}
      >
        <SheetHeader className="pb-4">
          <SheetTitle className="text-lg font-semibold text-white">
            Simulador de Preço
          </SheetTitle>
          <SheetDescription className="text-sm" style={{ color: 'hsl(215 10% 50%)' }}>
            {product.name}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-5 mt-2">
          {/* Canal de venda */}
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider mb-2.5" style={{ color: 'hsl(215 10% 45%)' }}>
              Onde você vai vender?
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {DEFAULT_SALES_CHANNELS.filter(c => c.active).map(channel => {
                const isSelected = channel.id === selectedChannelId;
                return (
                  <button
                    key={channel.id}
                    onClick={() => setSelectedChannelId(channel.id)}
                    className="relative flex items-center gap-2 px-3 py-2.5 rounded-lg text-left transition-all duration-150"
                    style={{
                      background: isSelected ? 'hsl(var(--color-blue) / 0.08)' : 'hsl(225 16% 8%)',
                      border: `1px solid ${isSelected ? 'hsl(var(--color-blue) / 0.25)' : 'hsl(225 14% 12%)'}`,
                    }}
                  >
                    <span className="text-sm leading-none">{channel.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-white truncate">{channel.name}</p>
                      <p className="text-[10px] tabular-nums" style={{ color: 'hsl(215 10% 45%)' }}>
                        {(channel.commissionPercent + channel.salesTax + channel.cardFee + channel.additionalCost).toFixed(1)}% taxas
                      </p>
                    </div>
                    {isSelected && <Check className="w-3 h-3 flex-shrink-0" style={{ color: 'hsl(var(--color-blue))' }} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custo resumo */}
          <div className="p-4 rounded-lg space-y-2" style={{ background: 'hsl(225 16% 7%)', border: '1px solid hsl(225 14% 11%)' }}>
            <Row label="Custo do produto" value={formatCurrency(product.purchaseCost)} />
            <Row label="Frete" value={formatCurrency(product.variableCost)} />
            {selectedChannel.fixedFee > 0 && <Row label="Taxa fixa" value={formatCurrency(selectedChannel.fixedFee)} />}
            <div className="pt-2 mt-1" style={{ borderTop: '1px solid hsl(225 14% 11%)' }}>
              <Row label="Custo total" value={formatCurrency(pricing.totalCost)} bold />
            </div>
            <Row label={`Taxas ${selectedChannel.name}`} value={`${totalFeePercent.toFixed(1)}%`} />
            <Row label="Total em taxas" value={formatCurrency(pricing.taxAmount)} />
          </div>

          {/* Margem */}
          <div className="p-4 rounded-lg" style={{ background: 'hsl(225 16% 7%)', border: '1px solid hsl(225 14% 11%)' }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-white">Margem desejada</span>
              <span className="text-lg font-bold tabular-nums" style={{ color: marginColor }}>{margin}%</span>
            </div>
            <Slider value={[margin]} onValueChange={(v) => setMargin(v[0])} min={5} max={80} step={1} className="w-full" />
            <div className="flex justify-between text-[10px] mt-1.5" style={{ color: 'hsl(215 10% 40%)' }}>
              <span>5%</span><span>80%</span>
            </div>
          </div>

          {/* Resultado */}
          <div className="p-5 rounded-lg text-center"
            style={{
              background: 'hsl(var(--color-blue) / 0.04)',
              border: '1px solid hsl(var(--color-blue) / 0.12)',
            }}
          >
            <p className="text-[11px] font-medium uppercase tracking-wider mb-1" style={{ color: 'hsl(215 10% 50%)' }}>
              Preço Sugerido
            </p>
            <p className="text-3xl font-bold text-white tabular-nums">{formatCurrency(pricing.suggestedPrice)}</p>
            <div className="flex items-center justify-center gap-5 mt-3">
              <ResultStat label="Lucro líquido" value={formatCurrency(pricing.profitPerUnit)} color="hsl(152 60% 48%)" />
              <div className="w-px h-6" style={{ background: 'hsl(225 14% 14%)' }} />
              <ResultStat label="Margem final" value={`${pricing.realMargin.toFixed(1)}%`} color={marginColor} />
              <div className="w-px h-6" style={{ background: 'hsl(225 14% 14%)' }} />
              <ResultStat label="Preço mínimo" value={formatCurrency(pricing.totalCost + pricing.taxAmount)} color="hsl(215 10% 55%)" />
            </div>
          </div>

          {/* Avançado */}
          <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
            <CollapsibleTrigger className="flex items-center gap-2 w-full py-2 text-sm transition-colors"
              style={{ color: 'hsl(215 10% 45%)' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'hsl(0 0% 100%)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'hsl(215 10% 45%)'; }}
            >
              <Settings2 className="w-3.5 h-3.5" />
              <span className="font-medium">Avançado</span>
              <ChevronDown className={`w-3.5 h-3.5 ml-auto transition-transform duration-200 ${advancedOpen ? 'rotate-180' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 pt-2">
              <div className="p-4 rounded-lg space-y-2" style={{ background: 'hsl(225 16% 7%)', border: '1px solid hsl(225 14% 11%)' }}>
                <p className="text-[11px] font-medium uppercase tracking-wider mb-2" style={{ color: 'hsl(215 10% 45%)' }}>
                  Taxas de {selectedChannel.name}
                </p>
                <Row label="Comissão" value={`${selectedChannel.commissionPercent}%`} />
                <Row label="Imposto sobre venda" value={`${selectedChannel.salesTax}%`} />
                {selectedChannel.cardFee > 0 && <Row label="Taxa do cartão" value={`${selectedChannel.cardFee}%`} />}
                {selectedChannel.additionalCost > 0 && <Row label="Custo adicional" value={`${selectedChannel.additionalCost}%`} />}
                {selectedChannel.fixedFee > 0 && <Row label="Taxa fixa por venda" value={formatCurrency(selectedChannel.fixedFee)} />}
              </div>

              <div className="space-y-2">
                <p className="text-xs font-medium text-white">Incluir despesas da empresa no preço?</p>
                <div className="flex gap-1.5">
                  {(['exclude', 'distribute', 'include'] as FixedCostAllocationMode[]).map(mode => {
                    const labels: Record<FixedCostAllocationMode, string> = {
                      exclude: 'Não',
                      distribute: `Dividir (÷${activeCount})`,
                      include: 'Sim, 100%',
                    };
                    const isActive = allocationMode === mode;
                    return (
                      <button
                        key={mode}
                        onClick={() => setAllocationMode(mode)}
                        className="flex-1 text-xs font-medium py-2 rounded-md transition-all"
                        style={{
                          background: isActive ? 'hsl(var(--color-blue) / 0.08)' : 'hsl(225 16% 8%)',
                          border: `1px solid ${isActive ? 'hsl(var(--color-blue) / 0.25)' : 'hsl(225 14% 12%)'}`,
                          color: 'hsl(0 0% 100%)',
                        }}
                      >
                        {labels[mode]}
                      </button>
                    );
                  })}
                </div>
                {allocationMode !== 'exclude' && (
                  <div className="p-3 rounded-md" style={{ background: 'hsl(225 16% 8%)', border: '1px solid hsl(225 14% 12%)' }}>
                    <Row label="Despesas incluídas" value={formatCurrency(pricing.allocatedFixedCost)} />
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Aplicar */}
          <button
            onClick={handleApplyPrice}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold text-white transition-all duration-200"
            style={{
              background: 'hsl(var(--color-blue))',
              boxShadow: '0 2px 12px hsl(var(--color-blue) / 0.25)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.filter = 'brightness(1.12)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.filter = 'brightness(1)'; }}
          >
            Aplicar este preço
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

const Row = ({ label, value, bold }: { label: string; value: string; bold?: boolean }) => (
  <div className="flex items-center justify-between">
    <span className={`text-sm ${bold ? 'text-white font-medium' : ''}`} style={!bold ? { color: 'hsl(215 10% 55%)' } : undefined}>{label}</span>
    <span className={`text-sm tabular-nums ${bold ? 'text-white font-semibold' : 'text-white font-medium'}`}>{value}</span>
  </div>
);

const ResultStat = ({ label, value, color }: { label: string; value: string; color: string }) => (
  <div className="text-center">
    <p className="text-[10px]" style={{ color: 'hsl(215 10% 50%)' }}>{label}</p>
    <p className="text-sm font-semibold tabular-nums" style={{ color }}>{value}</p>
  </div>
);

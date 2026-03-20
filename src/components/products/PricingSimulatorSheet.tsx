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

  // Build a TaxConfig from the selected channel
  const channelTaxConfig = useMemo<TaxConfig>(() => ({
    salesTax: selectedChannel.salesTax,
    marketplaceFee: selectedChannel.commissionPercent,
    cardFee: selectedChannel.cardFee,
    otherFees: selectedChannel.additionalCost > 0
      ? [{ id: 'channel-additional', name: 'Custo adicional', percentage: selectedChannel.additionalCost }]
      : [],
  }), [selectedChannel]);

  // Restore saved channel from product.category when opening
  useEffect(() => {
    if (product && isOpen) {
      // Restore channel: check if product.category matches a known channel ID
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
    // Save price AND channel to the product
    await updateProduct(product.id, {
      currentPrice: pricing.suggestedPrice,
      category: selectedChannelId,
    });
    onClose();
  };

  if (!product || !pricing) return null;

  const marginColor = pricing.realMargin >= 25 ? 'hsl(142 71% 45%)' : pricing.realMargin >= 15 ? 'hsl(48 96% 53%)' : 'hsl(0 84% 60%)';
  const totalFeePercent = selectedChannel.commissionPercent + selectedChannel.salesTax + selectedChannel.cardFee + selectedChannel.additionalCost;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md overflow-y-auto"
        style={{
          background: 'hsl(220 25% 6%)',
          border: 'none',
          borderLeft: '1px solid hsl(220 20% 15%)',
        }}
      >
        <SheetHeader className="pb-4">
          <SheetTitle className="text-xl font-bold text-white">
            Simulador de Preço
          </SheetTitle>
          <SheetDescription className="text-white">
            {product.name}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-5 mt-2">
          {/* Canal de venda */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-white mb-2.5">
              Onde você vai vender?
            </p>
            <div className="grid grid-cols-2 gap-2">
              {DEFAULT_SALES_CHANNELS.filter(c => c.active).map(channel => {
                const isSelected = channel.id === selectedChannelId;
                return (
                  <button
                    key={channel.id}
                    onClick={() => setSelectedChannelId(channel.id)}
                    className="relative flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all duration-150"
                    style={{
                      background: isSelected ? 'hsl(210 100% 50% / 0.1)' : 'hsl(220 20% 9%)',
                      border: `1px solid ${isSelected ? 'hsl(210 100% 50% / 0.35)' : 'hsl(220 20% 14%)'}`,
                    }}
                  >
                    <span className="text-base leading-none">{channel.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-medium truncate text-white`}>
                        {channel.name}
                      </p>
                      <p className="text-[10px] text-white/70 tabular-nums">
                        {(channel.commissionPercent + channel.salesTax + channel.cardFee + channel.additionalCost).toFixed(1)}% taxas
                      </p>
                    </div>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custo + taxas resumidos */}
          <div className="p-4 rounded-xl space-y-2" style={{ background: 'hsl(220 20% 9%)', border: '1px solid hsl(220 20% 14%)' }}>
            <Row label="Custo do produto" value={formatCurrency(product.purchaseCost)} />
            <Row label="Frete" value={formatCurrency(product.variableCost)} />
            {selectedChannel.fixedFee > 0 && (
              <Row label="Taxa fixa da plataforma" value={formatCurrency(selectedChannel.fixedFee)} />
            )}
            <div className="pt-2 mt-1" style={{ borderTop: '1px solid hsl(220 20% 14%)' }}>
              <Row label="Custo total" value={formatCurrency(pricing.totalCost)} bold />
            </div>
            <div className="pt-1">
              <Row label={`Taxas ${selectedChannel.name}`} value={`${totalFeePercent.toFixed(1)}%`} />
              <Row label="Total em taxas" value={formatCurrency(pricing.taxAmount)} />
            </div>
          </div>

          {/* Margem desejada */}
          <div className="p-4 rounded-xl" style={{ background: 'hsl(220 20% 9%)', border: '1px solid hsl(220 20% 14%)' }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-white">Margem desejada</span>
              <span className="text-lg font-bold tabular-nums" style={{ color: marginColor }}>
                {margin}%
              </span>
            </div>
            <Slider
              value={[margin]}
              onValueChange={(v) => setMargin(v[0])}
              min={5}
              max={80}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs mt-1.5 text-white/70">
              <span>5%</span>
              <span>80%</span>
            </div>
          </div>

          {/* Resultado principal */}
          <div
            className="p-5 rounded-xl text-center"
            style={{
              background: 'linear-gradient(135deg, hsl(210 100% 50% / 0.08), hsl(190 100% 50% / 0.04))',
              border: '1px solid hsl(210 100% 50% / 0.2)',
            }}
          >
            <p className="text-xs font-semibold uppercase tracking-wider mb-1 text-white">
              Preço Sugerido
            </p>
            <p className="text-3xl font-bold text-white">
              {formatCurrency(pricing.suggestedPrice)}
            </p>
            <div className="flex items-center justify-center gap-5 mt-3">
              <ResultStat label="Lucro líquido" value={formatCurrency(pricing.profitPerUnit)} color="hsl(142 71% 45%)" />
              <div className="w-px h-7" style={{ background: 'hsl(220 20% 20%)' }} />
              <ResultStat label="Margem final" value={`${pricing.realMargin.toFixed(1)}%`} color={marginColor} />
              <div className="w-px h-7" style={{ background: 'hsl(220 20% 20%)' }} />
              <ResultStat label="Preço mínimo" value={formatCurrency(pricing.totalCost + pricing.taxAmount)} color="hsl(220 10% 70%)" />
            </div>
          </div>

          {/* Avançado */}
          <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
            <CollapsibleTrigger className="flex items-center gap-2 w-full py-2 text-sm font-medium text-white/70 hover:text-white transition-colors">
              <Settings2 className="w-3.5 h-3.5" />
              <span>Avançado</span>
              <ChevronDown className={`w-3.5 h-3.5 ml-auto transition-transform duration-200 ${advancedOpen ? 'rotate-180' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 pt-2">
              {/* Detalhamento de taxas do canal */}
              <div className="p-4 rounded-xl space-y-2" style={{ background: 'hsl(220 20% 9%)', border: '1px solid hsl(220 20% 14%)' }}>
                <p className="text-xs font-semibold uppercase tracking-wider text-white mb-2">
                  Taxas de {selectedChannel.name}
                </p>
                <Row label="Comissão" value={`${selectedChannel.commissionPercent}%`} />
                <Row label="Imposto sobre venda" value={`${selectedChannel.salesTax}%`} />
                {selectedChannel.cardFee > 0 && <Row label="Taxa do cartão" value={`${selectedChannel.cardFee}%`} />}
                {selectedChannel.additionalCost > 0 && <Row label="Custo adicional" value={`${selectedChannel.additionalCost}%`} />}
                {selectedChannel.fixedFee > 0 && <Row label="Taxa fixa por venda" value={formatCurrency(selectedChannel.fixedFee)} />}
              </div>

              {/* Despesas da empresa */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-white">Incluir despesas da empresa no preço?</p>
                <div className="flex gap-2">
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
                        className="flex-1 text-xs font-medium py-2 rounded-lg transition-all"
                        style={{
                          background: isActive ? 'hsl(210 100% 50% / 0.12)' : 'hsl(220 20% 9%)',
                          border: `1px solid ${isActive ? 'hsl(210 100% 50% / 0.35)' : 'hsl(220 20% 14%)'}`,
                          color: '#FFFFFF',
                        }}
                      >
                        {labels[mode]}
                      </button>
                    );
                  })}
                </div>
                {allocationMode !== 'exclude' && (
                  <div className="p-3 rounded-lg" style={{ background: 'hsl(220 20% 9%)', border: '1px solid hsl(220 20% 14%)' }}>
                    <Row label="Despesas incluídas" value={formatCurrency(pricing.allocatedFixedCost)} />
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Botão aplicar */}
          <button
            onClick={handleApplyPrice}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-200"
            style={{
              background: 'linear-gradient(135deg, hsl(210 100% 50% / 0.2), hsl(190 100% 50% / 0.12))',
              border: '1px solid hsl(210 100% 50% / 0.4)',
              color: '#FFFFFF',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'linear-gradient(135deg, hsl(210 100% 50% / 0.3), hsl(190 100% 50% / 0.2))'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'linear-gradient(135deg, hsl(210 100% 50% / 0.2), hsl(190 100% 50% / 0.12))'; }}
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
    <span className={`text-sm ${bold ? 'text-white font-semibold' : 'text-white'}`}>{label}</span>
    <span className={`text-sm tabular-nums ${bold ? 'text-white font-semibold' : 'text-white font-medium'}`}>{value}</span>
  </div>
);

const ResultStat = ({ label, value, color }: { label: string; value: string; color: string }) => (
  <div className="text-center">
    <p className="text-[10px] text-white">{label}</p>
    <p className="text-sm font-semibold tabular-nums" style={{ color }}>{value}</p>
  </div>
);

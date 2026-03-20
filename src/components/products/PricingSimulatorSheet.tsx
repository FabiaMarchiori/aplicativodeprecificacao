import { useState, useMemo, useEffect } from 'react';
import { Product, calculatePricing, FixedCostAllocationMode } from '@/data/mockData';
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
import { ArrowRight, ChevronDown, Settings2 } from 'lucide-react';

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

  const activeCount = useMemo(() => products.filter(p => p.status === 'active').length, [products]);

  useEffect(() => {
    if (product) {
      setMargin(25);
      setAllocationMode('exclude');
      setAdvancedOpen(false);
    }
  }, [product]);

  const pricing = useMemo(() => {
    if (!product) return null;
    return calculatePricing(product, fixedCosts, taxConfig, margin, allocationMode, activeCount);
  }, [product, fixedCosts, taxConfig, margin, allocationMode, activeCount]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const handleApplyPrice = async () => {
    if (!product || !pricing) return;
    await updateProduct(product.id, { currentPrice: pricing.suggestedPrice });
    onClose();
  };

  if (!product || !pricing) return null;

  const marginColor = pricing.realMargin >= 25 ? 'hsl(142 71% 45%)' : pricing.realMargin >= 15 ? 'hsl(48 96% 53%)' : 'hsl(0 84% 60%)';

  const otherFeesTotal = taxConfig.otherFees.reduce((sum, t) => sum + t.percentage, 0);
  const totalTaxRate = taxConfig.salesTax + taxConfig.marketplaceFee + taxConfig.cardFee + otherFeesTotal;

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
          <SheetDescription className="text-white/50">
            {product.name}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-5 mt-2">
          {/* Resumo do custo — simplificado */}
          <div className="p-4 rounded-xl space-y-2" style={{ background: 'hsl(220 20% 9%)', border: '1px solid hsl(220 20% 14%)' }}>
            <Row label="Custo do produto" value={formatCurrency(pricing.purchaseCost)} />
            <Row label="Frete" value={formatCurrency(pricing.variableCost)} />
            <div className="pt-2 mt-1" style={{ borderTop: '1px solid hsl(220 20% 14%)' }}>
              <Row label="Custo total" value={formatCurrency(pricing.totalCost)} bold />
            </div>
          </div>

          {/* Taxas — resumo simples */}
          <div className="p-4 rounded-xl" style={{ background: 'hsl(220 20% 9%)', border: '1px solid hsl(220 20% 14%)' }}>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/55">Taxas aplicadas</span>
              <span className="text-sm font-semibold text-white tabular-nums">{totalTaxRate.toFixed(1)}%</span>
            </div>
            <div className="flex items-center justify-between mt-1.5">
              <span className="text-sm text-white/55">Total em taxas</span>
              <span className="text-sm font-semibold text-white tabular-nums">{formatCurrency(pricing.taxAmount)}</span>
            </div>
          </div>

          {/* Margem desejada — slider principal */}
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
            <div className="flex justify-between text-xs mt-1.5 text-white/30">
              <span>5%</span>
              <span>80%</span>
            </div>
          </div>

          {/* Resultado — destaque principal */}
          <div
            className="p-5 rounded-xl text-center"
            style={{
              background: 'linear-gradient(135deg, hsl(210 100% 50% / 0.08), hsl(190 100% 50% / 0.04))',
              border: '1px solid hsl(210 100% 50% / 0.2)',
            }}
          >
            <p className="text-xs font-semibold uppercase tracking-wider mb-1 text-white/45">
              Preço Sugerido
            </p>
            <p className="text-3xl font-bold text-white">
              {formatCurrency(pricing.suggestedPrice)}
            </p>
            <div className="flex items-center justify-center gap-4 mt-3">
              <div>
                <p className="text-xs text-white/40">Lucro líquido</p>
                <p className="text-sm font-semibold" style={{ color: 'hsl(142 71% 45%)' }}>
                  {formatCurrency(pricing.profitPerUnit)}
                </p>
              </div>
              <div className="w-px h-7" style={{ background: 'hsl(220 20% 20%)' }} />
              <div>
                <p className="text-xs text-white/40">Margem final</p>
                <p className="text-sm font-semibold" style={{ color: marginColor }}>
                  {pricing.realMargin.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>

          {/* Avançado — seção recolhível */}
          <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
            <CollapsibleTrigger className="flex items-center gap-2 w-full py-2 text-sm font-medium text-white/40 hover:text-white/70 transition-colors">
              <Settings2 className="w-3.5 h-3.5" />
              <span>Avançado</span>
              <ChevronDown className={`w-3.5 h-3.5 ml-auto transition-transform duration-200 ${advancedOpen ? 'rotate-180' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 pt-2">
              {/* Detalhamento de taxas */}
              <div className="p-4 rounded-xl space-y-2" style={{ background: 'hsl(220 20% 9%)', border: '1px solid hsl(220 20% 14%)' }}>
                <p className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-2">Detalhamento de taxas</p>
                <Row label="Imposto sobre venda" value={`${taxConfig.salesTax}%`} />
                <Row label="Taxa marketplace" value={`${taxConfig.marketplaceFee}%`} />
                <Row label="Taxa cartão" value={`${taxConfig.cardFee}%`} />
                {taxConfig.otherFees.map(f => (
                  <Row key={f.id} label={f.name} value={`${f.percentage}%`} />
                ))}
              </div>

              {/* Incluir despesas da empresa no preço */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-white/50">Incluir despesas da empresa no preço?</p>
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
                          color: isActive ? '#FFFFFF' : 'rgba(255,255,255,0.5)',
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
    <span className={`text-sm ${bold ? 'text-white/90 font-semibold' : 'text-white/55'}`}>
      {label}
    </span>
    <span className={`text-sm tabular-nums ${bold ? 'text-white font-semibold' : 'text-white/80 font-medium'}`}>
      {value}
    </span>
  </div>
);

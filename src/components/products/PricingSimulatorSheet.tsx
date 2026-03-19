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
import { TrendingUp, DollarSign, Percent, ArrowRight, Package } from 'lucide-react';

interface PricingSimulatorSheetProps {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
}

export const PricingSimulatorSheet = ({ isOpen, product, onClose }: PricingSimulatorSheetProps) => {
  const { fixedCosts, taxConfig, products, updateProduct } = useData();
  const [margin, setMargin] = useState(25);
  const [allocationMode, setAllocationMode] = useState<FixedCostAllocationMode>('exclude');

  const activeCount = useMemo(() => products.filter(p => p.status === 'active').length, [products]);

  useEffect(() => {
    if (product) {
      setMargin(25);
      setAllocationMode('exclude');
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

  const marginColor = pricing.realMargin >= 25 ? '#22c55e' : pricing.realMargin >= 15 ? '#eab308' : '#ef4444';

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
          borderLeft: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <SheetHeader className="pb-4">
          <SheetTitle style={{ color: '#FFFFFF', fontSize: '20px', fontWeight: 700 }}>
            Simulador de Preço
          </SheetTitle>
          <SheetDescription style={{ color: 'rgba(255,255,255,0.5)' }}>
            {product.name}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-5 mt-2">
          {/* Custo Base */}
          <div
            className="p-4 rounded-xl space-y-3"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <div className="flex items-center gap-2 mb-1">
              <Package className="w-4 h-4" style={{ color: 'rgba(0,180,255,0.8)' }} />
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.45)' }}>
                Custo Base
              </span>
            </div>
            <div className="space-y-2">
              <Row label="Custo do produto" value={formatCurrency(pricing.purchaseCost)} />
              <Row label="Frete / custo variável" value={formatCurrency(pricing.variableCost)} />
              <Row label="Rateio custos fixos" value={formatCurrency(pricing.allocatedFixedCost)} />
              <div className="pt-2 mt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <Row label="Custo total" value={formatCurrency(pricing.totalCost)} bold />
              </div>
            </div>
          </div>

          {/* Taxas */}
          <div
            className="p-4 rounded-xl space-y-3"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <div className="flex items-center gap-2 mb-1">
              <Percent className="w-4 h-4" style={{ color: 'rgba(0,180,255,0.8)' }} />
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.45)' }}>
                Taxas Aplicadas ({totalTaxRate.toFixed(1)}%)
              </span>
            </div>
            <div className="space-y-2">
              <Row label="Imposto sobre venda" value={`${taxConfig.salesTax}%`} />
              <Row label="Taxa marketplace" value={`${taxConfig.marketplaceFee}%`} />
              <Row label="Taxa cartão" value={`${taxConfig.cardFee}%`} />
              {taxConfig.otherFees.map(f => (
                <Row key={f.id} label={f.name} value={`${f.percentage}%`} />
              ))}
              <div className="pt-2 mt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <Row label="Total em impostos" value={formatCurrency(pricing.taxAmount)} bold />
              </div>
            </div>
          </div>

          {/* Margem */}
          <div
            className="p-4 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.45)' }}>
                Margem desejada
              </span>
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
            <div className="flex justify-between text-xs mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
              <span>5%</span>
              <span>80%</span>
            </div>
          </div>

          {/* Rateio mode */}
          <div className="flex gap-2">
            {(['exclude', 'distribute', 'include'] as FixedCostAllocationMode[]).map(mode => {
              const labels: Record<FixedCostAllocationMode, string> = {
                exclude: 'Sem rateio',
                distribute: `Dividir (÷${activeCount})`,
                include: '100% custos',
              };
              const isActive = allocationMode === mode;
              return (
                <button
                  key={mode}
                  onClick={() => setAllocationMode(mode)}
                  className="flex-1 text-xs font-medium py-2 rounded-lg transition-all"
                  style={{
                    background: isActive ? 'rgba(0,140,255,0.15)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${isActive ? 'rgba(0,160,255,0.4)' : 'rgba(255,255,255,0.07)'}`,
                    color: isActive ? '#FFFFFF' : 'rgba(255,255,255,0.5)',
                  }}
                >
                  {labels[mode]}
                </button>
              );
            })}
          </div>

          {/* Result */}
          <div
            className="p-5 rounded-xl text-center"
            style={{
              background: 'linear-gradient(135deg, rgba(0,130,255,0.08), rgba(0,200,255,0.04))',
              border: '1px solid rgba(0,160,255,0.2)',
            }}
          >
            <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Preço Sugerido
            </p>
            <p className="text-3xl font-bold" style={{ color: '#FFFFFF' }}>
              {formatCurrency(pricing.suggestedPrice)}
            </p>
            <div className="flex items-center justify-center gap-4 mt-3">
              <div>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Lucro</p>
                <p className="text-sm font-semibold" style={{ color: '#22c55e' }}>
                  {formatCurrency(pricing.profitPerUnit)}
                </p>
              </div>
              <div style={{ width: '1px', height: '28px', background: 'rgba(255,255,255,0.1)' }} />
              <div>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Margem Final</p>
                <p className="text-sm font-semibold" style={{ color: marginColor }}>
                  {pricing.realMargin.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>

          {/* Apply button */}
          <button
            onClick={handleApplyPrice}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-200"
            style={{
              background: 'linear-gradient(135deg, rgba(0,130,255,0.2), rgba(0,200,255,0.12))',
              border: '1px solid rgba(0,160,255,0.4)',
              color: '#FFFFFF',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0,130,255,0.3), rgba(0,200,255,0.2))'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0,130,255,0.2), rgba(0,200,255,0.12))'; }}
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
    <span className="text-sm" style={{ color: bold ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.55)', fontWeight: bold ? 600 : 400 }}>
      {label}
    </span>
    <span className="text-sm tabular-nums" style={{ color: bold ? '#FFFFFF' : 'rgba(255,255,255,0.8)', fontWeight: bold ? 600 : 500 }}>
      {value}
    </span>
  </div>
);

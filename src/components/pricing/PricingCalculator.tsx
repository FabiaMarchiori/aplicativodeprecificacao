import { useState, useMemo } from 'react';
import { Calculator, TrendingUp, TrendingDown, DollarSign, Percent } from 'lucide-react';
import { mockProducts, mockFixedCosts, mockTaxConfig, calculatePricing, Product } from '@/data/mockData';

export const PricingCalculator = () => {
  const [products] = useState(mockProducts.filter(p => p.status === 'active'));
  const [margins, setMargins] = useState<Record<string, number>>(
    Object.fromEntries(products.map(p => [p.id, 30])) // Default 30% margin
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const handleMarginChange = (productId: string, value: string) => {
    setMargins({ ...margins, [productId]: parseFloat(value) || 0 });
  };

  const getPricingData = (product: Product) => {
    const desiredMargin = margins[product.id] || 30;
    return calculatePricing(product, mockFixedCosts, mockTaxConfig, desiredMargin);
  };

  const getMarginColor = (margin: number) => {
    if (margin >= 25) return 'text-success';
    if (margin >= 15) return 'text-warning';
    return 'text-danger';
  };

  const getMarginStatus = (margin: number) => {
    if (margin >= 25) return { text: 'Saudável', class: 'status-success' };
    if (margin >= 15) return { text: 'Atenção', class: 'status-warning' };
    return { text: 'Crítico', class: 'status-danger' };
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Precificação</h2>
          <p className="text-muted-foreground">Calcule o preço ideal para cada produto em tempo real</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/20">
          <Calculator className="w-4 h-4 text-primary" />
          <span className="text-sm text-foreground">Taxa total: {(mockTaxConfig.salesTax + mockTaxConfig.marketplaceFee + mockTaxConfig.cardFee + mockTaxConfig.otherFees).toFixed(1)}%</span>
        </div>
      </div>

      <div className="space-y-4">
        {products.map((product) => {
          const pricing = getPricingData(product);
          const status = getMarginStatus(pricing.realMargin);
          const priceDiff = pricing.suggestedPrice - product.currentPrice;
          const priceDiffPercent = (priceDiff / product.currentPrice) * 100;

          return (
            <div key={product.id} className="glass-card p-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Product Info */}
                <div className="lg:col-span-3">
                  <p className="text-xs text-muted-foreground mono">{product.code}</p>
                  <h3 className="font-semibold text-foreground">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">{product.category}</p>
                </div>

                {/* Costs */}
                <div className="lg:col-span-2 space-y-1">
                  <p className="text-xs text-muted-foreground">Custo Total</p>
                  <p className="text-lg font-bold mono text-foreground">{formatCurrency(pricing.totalCost)}</p>
                  <p className="text-xs text-muted-foreground">
                    Compra: {formatCurrency(product.purchaseCost)} + Var: {formatCurrency(product.variableCost)}
                  </p>
                </div>

                {/* Taxes */}
                <div className="lg:col-span-2 space-y-1">
                  <p className="text-xs text-muted-foreground">Impostos/Taxas</p>
                  <p className="text-lg font-bold mono text-warning">{formatCurrency(pricing.taxAmount)}</p>
                </div>

                {/* Margin Input */}
                <div className="lg:col-span-2">
                  <p className="text-xs text-muted-foreground mb-1">Margem Desejada</p>
                  <div className="relative">
                    <input
                      type="number"
                      className="input-field text-lg font-bold pr-8 w-full"
                      value={margins[product.id]}
                      onChange={(e) => handleMarginChange(product.id, e.target.value)}
                      min="0"
                      max="100"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
                  </div>
                </div>

                {/* Suggested Price */}
                <div className="lg:col-span-2 space-y-1">
                  <p className="text-xs text-muted-foreground">Preço Sugerido</p>
                  <p className="text-xl font-bold mono text-primary">{formatCurrency(pricing.suggestedPrice)}</p>
                  <div className="flex items-center gap-1 text-xs">
                    {priceDiff >= 0 ? (
                      <TrendingUp className="w-3 h-3 text-success" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-danger" />
                    )}
                    <span className={priceDiff >= 0 ? 'text-success' : 'text-danger'}>
                      {priceDiff >= 0 ? '+' : ''}{formatCurrency(priceDiff)} ({priceDiffPercent.toFixed(1)}%)
                    </span>
                  </div>
                </div>

                {/* Results */}
                <div className="lg:col-span-1 text-right space-y-1">
                  <p className="text-xs text-muted-foreground">Lucro/Un</p>
                  <p className={`text-lg font-bold mono ${getMarginColor(pricing.realMargin)}`}>
                    {formatCurrency(pricing.profitPerUnit)}
                  </p>
                  <span className={`status-badge ${status.class}`}>
                    {pricing.realMargin.toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Progress bar showing cost breakdown */}
              <div className="mt-4 pt-4 border-t border-border/50">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-secondary"></div>
                    <span>Custo ({((pricing.totalCost / pricing.suggestedPrice) * 100).toFixed(0)}%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-warning"></div>
                    <span>Taxas ({((pricing.taxAmount / pricing.suggestedPrice) * 100).toFixed(0)}%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-success"></div>
                    <span>Lucro ({pricing.realMargin.toFixed(0)}%)</span>
                  </div>
                </div>
                <div className="mt-2 h-2 rounded-full bg-secondary overflow-hidden flex">
                  <div 
                    className="h-full bg-muted-foreground/30" 
                    style={{ width: `${(pricing.totalCost / pricing.suggestedPrice) * 100}%` }}
                  />
                  <div 
                    className="h-full bg-warning" 
                    style={{ width: `${(pricing.taxAmount / pricing.suggestedPrice) * 100}%` }}
                  />
                  <div 
                    className="h-full bg-success" 
                    style={{ width: `${pricing.realMargin}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

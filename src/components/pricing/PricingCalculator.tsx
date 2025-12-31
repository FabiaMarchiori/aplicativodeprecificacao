import { useState } from 'react';
import { Calculator, TrendingUp, TrendingDown } from 'lucide-react';
import { mockProducts, mockFixedCosts, mockTaxConfig, calculatePricing, Product } from '@/data/mockData';

export const PricingCalculator = () => {
  const [products] = useState(mockProducts.filter(p => p.status === 'active'));
  const [margins, setMargins] = useState<Record<string, number>>(
    Object.fromEntries(products.map(p => [p.id, 30]))
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

const getMarginNeonConfig = (margin: number) => {
    if (margin >= 25) return { color: '#39FF14', glow: 'rgba(57, 255, 20, 0.2)', label: 'Saudável' };
    if (margin >= 15) return { color: '#FFAC00', glow: 'rgba(255, 172, 0, 0.2)', label: 'Atenção' };
    return { color: '#BC13FE', glow: 'rgba(188, 19, 254, 0.2)', label: 'Crítico' };
  };

  const otherFeesTotal = mockTaxConfig.otherFees.reduce((sum, tax) => sum + tax.percentage, 0);
  const totalTax = (mockTaxConfig.salesTax + mockTaxConfig.marketplaceFee + mockTaxConfig.cardFee + otherFeesTotal).toFixed(1);

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 
            className="text-2xl font-bold"
            style={{ color: '#F8FAFC', textShadow: '0 0 10px rgba(248, 250, 252, 0.3)' }}
          >
            Precificação
          </h2>
          <p style={{ color: '#94a3b8' }}>Calcule o preço ideal para cada produto em tempo real</p>
        </div>
        <div 
          className="flex items-center gap-2 px-4 py-2 rounded-lg"
          style={{
            background: 'rgba(0, 209, 255, 0.1)',
            border: '1px solid rgba(0, 209, 255, 0.3)',
            boxShadow: '0 0 10px rgba(0, 209, 255, 0.15)'
          }}
        >
          <Calculator 
            className="w-4 h-4" 
            style={{ color: '#00D1FF', filter: 'drop-shadow(0 0 3px #00D1FF)' }}
          />
          <span 
            className="text-sm font-semibold"
            style={{ color: '#00D1FF', textShadow: '0 0 6px rgba(0, 209, 255, 0.4)' }}
          >
            Taxa total: {totalTax}%
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {products.map((product) => {
          const pricing = getPricingData(product);
          const marginConfig = getMarginNeonConfig(pricing.realMargin);
          const priceDiff = pricing.suggestedPrice - product.currentPrice;
          const priceDiffPercent = (priceDiff / product.currentPrice) * 100;

          return (
            <div 
              key={product.id} 
              className="rounded-xl p-6 transition-all duration-300"
              style={{
                background: '#0a0a0c',
                border: '1px solid rgba(0, 209, 255, 0.3)',
                boxShadow: '0 0 12px rgba(0, 209, 255, 0.12), inset 0 0 20px rgba(0, 0, 0, 0.6)',
                paddingLeft: '24px',
                paddingRight: '24px'
              }}
            >
              <div className="grid grid-cols-1 xl:grid-cols-12 lg:grid-cols-6 gap-8 items-start">
                {/* Product Info */}
                <div className="xl:col-span-2 lg:col-span-2">
                  <p 
                    className="text-xs mono"
                    style={{ color: '#00D1FF', textShadow: '0 0 4px rgba(0, 209, 255, 0.2)' }}
                  >
                    {product.code}
                  </p>
                  <h3 
                    className="font-semibold"
                    style={{ color: '#F8FAFC', textShadow: '0 0 8px rgba(248, 250, 252, 0.2)' }}
                  >
                    {product.name}
                  </h3>
                  <p className="text-sm" style={{ color: '#64748b' }}>{product.category}</p>
                </div>

                {/* Costs */}
                <div className="xl:col-span-2 lg:col-span-2 space-y-1">
                  <p className="text-xs" style={{ color: '#64748b' }}>Custo Total</p>
                  <p 
                    className="text-lg font-bold mono"
                    style={{ 
                      color: '#F8FAFC',
                      textShadow: '0 0 10px rgba(248, 250, 252, 0.5)'
                    }}
                  >
                    {formatCurrency(pricing.totalCost)}
                  </p>
                  <p className="text-xs" style={{ color: '#475569' }}>
                    Compra: {formatCurrency(product.purchaseCost)} + Var: {formatCurrency(product.variableCost)}
                  </p>
                </div>

                {/* Taxes */}
                <div className="xl:col-span-2 lg:col-span-2 space-y-1">
                  <p className="text-xs" style={{ color: '#64748b' }}>Impostos/Taxas</p>
                  <p 
                    className="text-lg font-bold mono"
                    style={{ 
                      color: '#FFAC00',
                      textShadow: '0 0 8px rgba(255, 172, 0, 0.4)'
                    }}
                  >
                    {formatCurrency(pricing.taxAmount)}
                  </p>
                </div>

                {/* Margin Input */}
                <div className="xl:col-span-2 lg:col-span-2">
                  <p className="text-xs mb-1" style={{ color: '#64748b' }}>Margem Desejada</p>
                  <div className="relative">
                    <input
                      type="number"
                      className="text-lg font-bold pr-10 w-full rounded-lg transition-all duration-300"
                      style={{
                        background: '#000000',
                        border: '1px solid rgba(0, 209, 255, 0.3)',
                        color: '#F8FAFC',
                        padding: '10px 40px 10px 14px',
                        outline: 'none'
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.border = '1px solid #00D1FF';
                        e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 209, 255, 0.5), inset 0 0 10px rgba(0, 209, 255, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.border = '1px solid rgba(0, 209, 255, 0.3)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                      value={margins[product.id]}
                      onChange={(e) => handleMarginChange(product.id, e.target.value)}
                      min="0"
                      max="100"
                    />
                    <span 
                      className="absolute right-4 top-1/2 -translate-y-1/2 font-bold"
                      style={{ color: '#00D1FF', textShadow: '0 0 8px rgba(0, 209, 255, 0.5)' }}
                    >
                      %
                    </span>
                  </div>
                </div>

                {/* Suggested Price */}
                <div className="xl:col-span-2 lg:col-span-2 space-y-1">
                  <p className="text-xs" style={{ color: '#64748b' }}>Preço Sugerido</p>
                  <p 
                    className="text-xl font-bold mono"
                    style={{ 
                      color: '#00D1FF',
                      textShadow: '0 0 12px rgba(0, 209, 255, 0.6), 0 0 24px rgba(0, 209, 255, 0.25)'
                    }}
                  >
                    {formatCurrency(pricing.suggestedPrice)}
                  </p>
                  <div className="flex items-center gap-1 text-xs">
                    {priceDiff >= 0 ? (
                      <TrendingUp 
                        className="w-3 h-3" 
                        style={{ color: '#39FF14', filter: 'drop-shadow(0 0 3px #39FF14)' }}
                      />
                    ) : (
                      <TrendingDown 
                        className="w-3 h-3" 
                        style={{ color: '#BC13FE', filter: 'drop-shadow(0 0 3px #BC13FE)' }}
                      />
                    )}
                    <span style={{ color: priceDiff >= 0 ? '#39FF14' : '#BC13FE' }}>
                      {priceDiff >= 0 ? '+' : ''}{formatCurrency(priceDiff)} ({priceDiffPercent.toFixed(1)}%)
                    </span>
                  </div>
                </div>

                {/* Results */}
                <div className="xl:col-span-2 lg:col-span-2 text-right space-y-1">
                  <p className="text-xs" style={{ color: '#64748b' }}>Lucro/Un</p>
                  <p 
                    className="text-lg font-bold mono"
                    style={{ 
                      color: '#39FF14',
                      textShadow: '0 0 10px rgba(57, 255, 20, 0.5), 0 0 20px rgba(57, 255, 20, 0.2)'
                    }}
                  >
                    {formatCurrency(pricing.profitPerUnit)}
                  </p>
                  <span 
                    className="inline-block px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      background: `${marginConfig.color}15`,
                      border: `1px solid ${marginConfig.color}40`,
                      color: marginConfig.color
                    }}
                  >
                    {pricing.realMargin.toFixed(1)}% • {marginConfig.label}
                  </span>
                </div>
              </div>

              {/* Progress bar showing cost breakdown */}
              <div 
                className="mt-4 pt-4"
                style={{ borderTop: '1px solid rgba(0, 209, 255, 0.2)' }}
              >
                <div className="flex flex-wrap items-center gap-6 text-xs mb-3">
                  {/* LED Custo */}
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ 
                        background: '#4B5563',
                        boxShadow: '0 0 5px rgba(75, 85, 99, 0.4)'
                      }}
                    />
                    <span style={{ color: '#94a3b8' }}>
                      Custo <span className="mono font-medium">{((pricing.totalCost / pricing.suggestedPrice) * 100).toFixed(0)}%</span>
                    </span>
                  </div>

                  {/* LED Taxas */}
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ 
                        background: '#FFAC00',
                        boxShadow: '0 0 5px rgba(255, 172, 0, 0.4)'
                      }}
                    />
                    <span style={{ color: '#FFAC00' }}>
                      Taxas <span className="mono font-medium">{((pricing.taxAmount / pricing.suggestedPrice) * 100).toFixed(0)}%</span>
                    </span>
                  </div>

                  {/* LED Lucro */}
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ 
                        background: '#39FF14',
                        boxShadow: '0 0 5px rgba(57, 255, 20, 0.4)'
                      }}
                    />
                    <span style={{ color: '#39FF14' }}>
                      Lucro <span className="mono font-medium">{pricing.realMargin.toFixed(0)}%</span>
                    </span>
                  </div>
                </div>

                <div 
                  className="overflow-hidden flex"
                  style={{
                    height: '12px',
                    borderRadius: '6px',
                    background: 'rgba(255, 255, 255, 0.05)'
                  }}
                >
                  {/* Segmento Custo */}
                  <div 
                    style={{ 
                      width: `${(pricing.totalCost / pricing.suggestedPrice) * 100}%`,
                      background: 'linear-gradient(90deg, #374151, #4B5563)',
                      boxShadow: 'inset 0 2px 4px rgba(255, 255, 255, 0.1)'
                    }}
                  />
                  {/* Segmento Taxas */}
                  <div 
                    style={{ 
                      width: `${(pricing.taxAmount / pricing.suggestedPrice) * 100}%`,
                      background: 'linear-gradient(90deg, #FFAC00, #FFD000)',
                      boxShadow: '0 0 6px rgba(255, 172, 0, 0.3), inset 0 2px 4px rgba(255, 255, 255, 0.1)'
                    }}
                  />
                  {/* Segmento Lucro */}
                  <div 
                    style={{ 
                      width: `${pricing.realMargin}%`,
                      background: 'linear-gradient(90deg, #39FF14, #50FF30)',
                      boxShadow: '0 0 6px rgba(57, 255, 20, 0.3), inset 0 2px 4px rgba(255, 255, 255, 0.1)'
                    }}
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

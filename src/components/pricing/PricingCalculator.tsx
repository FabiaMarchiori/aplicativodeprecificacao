import { useState, useMemo } from 'react';
import { 
  Calculator, TrendingUp, TrendingDown, Info, Download, FileSpreadsheet, 
  Clock, Smartphone, Headphones, Volume2, Mouse, Watch, Tablet, Cable, Battery
} from 'lucide-react';
import { calculatePricing, Product } from '@/data/mockData';
import { useData } from '@/contexts/DataContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { PriceHistoryModal } from './PriceHistoryModal';

// Get priceHistory from DataContext

export const PricingCalculator = () => {
  const { products: allProducts, fixedCosts, taxConfig, priceHistory } = useData();
  const products = useMemo(() => allProducts.filter(p => p.status === 'active'), [allProducts]);
  const [margins, setMargins] = useState<Record<string, number>>({});
  const [discounts, setDiscounts] = useState<Record<string, { type: 'percent' | 'value', amount: number }>>({});
  const [historyModal, setHistoryModal] = useState<{ isOpen: boolean; product: Product | null }>({
    isOpen: false,
    product: null
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const handleMarginChange = (productId: string, value: string) => {
    setMargins({ ...margins, [productId]: parseFloat(value) || 0 });
  };

  const handleDiscountChange = (productId: string, amount: number, type: 'percent' | 'value') => {
    setDiscounts({ ...discounts, [productId]: { type, amount } });
  };

  const getPricingData = (product: Product) => {
    const desiredMargin = margins[product.id] || 30;
    return calculatePricing(product, fixedCosts, taxConfig, desiredMargin);
  };

  const getDiscountedPrice = (suggestedPrice: number, productId: string) => {
    const discount = discounts[productId];
    if (!discount || discount.amount <= 0) return suggestedPrice;
    
    if (discount.type === 'percent') {
      return suggestedPrice * (1 - discount.amount / 100);
    }
    return Math.max(0, suggestedPrice - discount.amount);
  };

  const getNewMargin = (product: Product, pricing: { totalCost: number; taxAmount: number; suggestedPrice: number }) => {
    const finalPrice = getDiscountedPrice(pricing.suggestedPrice, product.id);
    const taxAmount = finalPrice * (parseFloat(totalTax) / 100);
    const profit = finalPrice - pricing.totalCost - taxAmount;
    return (profit / finalPrice) * 100;
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, JSX.Element> = {
      'Eletrônicos': <Smartphone className="w-4 h-4" />,
      'Acessórios': <Cable className="w-4 h-4" />,
      'Áudio': <Volume2 className="w-4 h-4" />,
      'Periféricos': <Mouse className="w-4 h-4" />,
    };
    return icons[category] || <Battery className="w-4 h-4" />;
  };

  const getMarginNeonConfig = (margin: number) => {
    if (margin >= 25) return { color: '#39FF14', glow: 'rgba(57, 255, 20, 0.2)', label: 'Saudável' };
    if (margin >= 15) return { color: '#FFAC00', glow: 'rgba(255, 172, 0, 0.2)', label: 'Atenção' };
    return { color: '#BC13FE', glow: 'rgba(188, 19, 254, 0.2)', label: 'Crítico' };
  };

  const otherFeesTotal = taxConfig.otherFees.reduce((sum, tax) => sum + tax.percentage, 0);
  const totalTax = (taxConfig.salesTax + taxConfig.marketplaceFee + taxConfig.cardFee + otherFeesTotal).toFixed(1);

  const exportCSV = () => {
    const headers = ['Código', 'Produto', 'Categoria', 'Custo Total', 'Impostos', 'Margem %', 'Preço Sugerido', 'Lucro/Un'];
    const rows = products.map(p => {
      const pricing = getPricingData(p);
      return [
        p.code,
        p.name,
        p.category,
        pricing.totalCost.toFixed(2),
        pricing.taxAmount.toFixed(2),
        pricing.realMargin.toFixed(1),
        pricing.suggestedPrice.toFixed(2),
        pricing.profitPerUnit.toFixed(2)
      ];
    });
    
    const csvContent = [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'precificacao.csv';
    link.click();
  };

  const exportExcel = () => {
    // For simplicity, export as CSV with .xls extension (Excel can open it)
    const headers = ['Código', 'Produto', 'Categoria', 'Custo Total', 'Impostos', 'Margem %', 'Preço Sugerido', 'Lucro/Un'];
    const rows = products.map(p => {
      const pricing = getPricingData(p);
      return [
        p.code,
        p.name,
        p.category,
        pricing.totalCost.toFixed(2),
        pricing.taxAmount.toFixed(2),
        pricing.realMargin.toFixed(1),
        pricing.suggestedPrice.toFixed(2),
        pricing.profitPerUnit.toFixed(2)
      ];
    });
    
    const csvContent = [headers.join('\t'), ...rows.map(r => r.join('\t'))].join('\n');
    const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'precificacao.xls';
    link.click();
  };

  const openHistoryModal = (product: Product) => {
    setHistoryModal({ isOpen: true, product });
  };

  const TooltipIcon = ({ content }: { content: string }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info 
            className="w-3 h-3 cursor-help inline-block ml-1 opacity-60 hover:opacity-100 transition-opacity" 
            style={{ color: '#00D1FF' }}
          />
        </TooltipTrigger>
        <TooltipContent 
          className="max-w-xs text-xs"
          style={{
            background: '#0a0a0c',
            border: '1px solid rgba(0, 209, 255, 0.3)',
            color: 'rgba(255, 255, 255, 0.9)'
          }}
        >
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 
            className="text-3xl font-bold pb-2 inline-block"
            style={{ 
              color: '#F8FAFC', 
              textShadow: '0 0 10px rgba(248, 250, 252, 0.3)',
              borderBottom: '2px solid transparent',
              borderImage: 'linear-gradient(90deg, #00D1FF, transparent) 1'
            }}
          >
            Precificação
          </h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Calcule o preço ideal para cada produto em tempo real</p>
        </div>
        <div className="flex flex-col xs:flex-row flex-wrap items-stretch xs:items-center gap-2 sm:gap-3 w-full sm:w-auto">
          {/* Export Buttons */}
          <Button
            variant="outline"
            size="sm"
            onClick={exportCSV}
            className="transition-all duration-200 hover:brightness-110 w-full xs:w-auto"
            style={{
              background: 'rgba(0, 209, 255, 0.1)',
              border: '1px solid rgba(0, 209, 255, 0.3)',
              color: '#00D1FF'
            }}
          >
            <Download className="w-4 h-4 mr-2" />
            CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={exportExcel}
            className="transition-all duration-200 hover:brightness-110 w-full xs:w-auto"
            style={{
              background: 'rgba(57, 255, 20, 0.1)',
              border: '1px solid rgba(57, 255, 20, 0.3)',
              color: '#39FF14'
            }}
          >
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Excel
          </Button>
          {/* Tax Badge */}
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
      </div>

      {/* Product Cards */}
      <div className="space-y-4">
        {products.map((product) => {
          const pricing = getPricingData(product);
          const marginConfig = getMarginNeonConfig(pricing.realMargin);
          const priceDiff = pricing.suggestedPrice - product.currentPrice;
          const priceDiffPercent = (priceDiff / product.currentPrice) * 100;
          const discount = discounts[product.id];
          const finalPrice = getDiscountedPrice(pricing.suggestedPrice, product.id);
          const hasDiscount = discount && discount.amount > 0;
          const newMargin = hasDiscount ? getNewMargin(product, pricing) : pricing.realMargin;

          return (
            <div 
              key={product.id} 
              className="rounded-xl p-6 transition-all duration-300 hover:scale-[1.005]"
              style={{
                background: '#0a0a0c',
                border: '1px solid rgba(0, 209, 255, 0.3)',
                boxShadow: '0 0 15px rgba(0, 209, 255, 0.12), inset 0 0 20px rgba(0, 0, 0, 0.6)',
                paddingLeft: '24px',
                paddingRight: '24px'
              }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-12 lg:grid-cols-6 gap-4 sm:gap-6 items-start">
                {/* Product Info */}
                <div className="xl:col-span-2 lg:col-span-2 sm:col-span-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span 
                      className="text-xs mono"
                      style={{ color: '#00D1FF', textShadow: '0 0 4px rgba(0, 209, 255, 0.2)' }}
                    >
                      {product.code}
                    </span>
                    <button
                      onClick={() => openHistoryModal(product)}
                      className="p-1 rounded transition-all duration-200 hover:scale-110"
                      style={{
                        background: 'rgba(0, 209, 255, 0.1)',
                        border: '1px solid rgba(0, 209, 255, 0.2)'
                      }}
                      title="Ver histórico de preços"
                    >
                      <Clock className="w-3 h-3" style={{ color: '#00D1FF' }} />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span style={{ color: 'rgba(0, 209, 255, 0.6)' }}>
                      {getCategoryIcon(product.category)}
                    </span>
                    <h3 
                      className="font-semibold"
                      style={{ color: '#F8FAFC', textShadow: '0 0 8px rgba(248, 250, 252, 0.2)' }}
                    >
                      {product.name}
                    </h3>
                  </div>
                  <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>{product.category}</p>
                </div>

                {/* Costs */}
                <div className="xl:col-span-2 lg:col-span-2 sm:col-span-1 space-y-1">
                  <p className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Custo Total
                    <TooltipIcon content="Soma do custo de compra + custo variável + rateio de custos fixos" />
                  </p>
                  <p 
                    className="text-lg font-bold mono"
                    style={{ 
                      color: '#F8FAFC',
                      textShadow: '0 0 10px rgba(248, 250, 252, 0.5)'
                    }}
                  >
                    {formatCurrency(pricing.totalCost)}
                  </p>
                  <p className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                    Compra: {formatCurrency(product.purchaseCost)} + Var: {formatCurrency(product.variableCost)}
                  </p>
                </div>

                {/* Taxes */}
                <div className="xl:col-span-1 lg:col-span-1 space-y-1">
                  <p className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Impostos
                    <TooltipIcon content="Valor calculado com base na taxa total configurada em Impostos" />
                  </p>
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
                  <p className="text-xs mb-1" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Margem Desejada
                    <TooltipIcon content="Percentual de lucro que você deseja obter sobre o preço de venda" />
                  </p>
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

                {/* Discount Field */}
                <div className="xl:col-span-1 lg:col-span-2">
                  <p className="text-xs mb-1" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Desconto
                    <TooltipIcon content="Desconto opcional aplicado sobre o preço sugerido" />
                  </p>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="number"
                        className="text-sm font-medium w-full rounded-lg transition-all duration-300"
                        style={{
                          background: '#000000',
                          border: '1px solid rgba(255, 172, 0, 0.3)',
                          color: '#F8FAFC',
                          padding: '10px 14px',
                          outline: 'none'
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.border = '1px solid #FFAC00';
                          e.currentTarget.style.boxShadow = '0 0 15px rgba(255, 172, 0, 0.5)';
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.border = '1px solid rgba(255, 172, 0, 0.3)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                        value={discount?.amount || ''}
                        onChange={(e) => handleDiscountChange(product.id, parseFloat(e.target.value) || 0, discount?.type || 'percent')}
                        placeholder="0"
                        min="0"
                      />
                    </div>
                    <select
                      className="rounded-lg text-sm px-2 transition-all duration-200"
                      style={{
                        background: '#000000',
                        border: '1px solid rgba(255, 172, 0, 0.3)',
                        color: '#FFAC00',
                        outline: 'none'
                      }}
                      value={discount?.type || 'percent'}
                      onChange={(e) => handleDiscountChange(product.id, discount?.amount || 0, e.target.value as 'percent' | 'value')}
                    >
                      <option value="percent">%</option>
                      <option value="value">R$</option>
                    </select>
                  </div>
                  {hasDiscount && (
                    <p className="text-xs mt-1" style={{ color: '#FFAC00' }}>
                      Final: {formatCurrency(finalPrice)} • Margem: {newMargin.toFixed(1)}%
                    </p>
                  )}
                </div>

                {/* Suggested Price */}
                <div className="xl:col-span-2 lg:col-span-2 space-y-1">
                  <p className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Preço Sugerido
                    <TooltipIcon content="Preço calculado para atingir a margem desejada após custos e impostos" />
                  </p>
                  <p 
                    className="text-xl font-bold mono"
                    style={{ 
                      color: '#00D1FF',
                      textShadow: '0 0 15px rgba(0, 209, 255, 0.7), 0 0 30px rgba(0, 209, 255, 0.3)'
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
                <div className="xl:col-span-2 lg:col-span-1 space-y-1">
                  <p className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Lucro/Un
                    <TooltipIcon content="Lucro líquido por unidade vendida, após todos os custos e impostos" />
                  </p>
                  <p 
                    className="text-lg font-bold mono"
                    style={{ 
                      color: '#39FF14',
                      textShadow: '0 0 12px rgba(57, 255, 20, 0.6), 0 0 25px rgba(57, 255, 20, 0.3)'
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
                        background: '#00D1FF',
                        boxShadow: '0 0 5px rgba(0, 209, 255, 0.4)'
                      }}
                    />
                    <span style={{ color: '#00D1FF' }}>
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
                  {/* Segmento Custo - Ciano */}
                  <div 
                    style={{ 
                      width: `${(pricing.totalCost / pricing.suggestedPrice) * 100}%`,
                      background: 'linear-gradient(90deg, #0891B2, #00D1FF)',
                      boxShadow: '0 0 6px rgba(0, 209, 255, 0.3), inset 0 2px 4px rgba(255, 255, 255, 0.1)'
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

      {/* History Modal */}
      {historyModal.product && (
        <PriceHistoryModal
          isOpen={historyModal.isOpen}
          onClose={() => setHistoryModal({ isOpen: false, product: null })}
          product={historyModal.product}
          history={priceHistory.filter(h => h.productId === historyModal.product?.id)}
        />
      )}
    </div>
  );
};

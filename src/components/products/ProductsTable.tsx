import { useState, useMemo } from 'react';
import { Plus, Pencil, Trash2, Search, Calculator, Package, Filter, TrendingUp, ArrowUpDown } from 'lucide-react';
import { Product, calculatePricing, TaxConfig } from '@/data/mockData';
import { DEFAULT_SALES_CHANNELS } from '@/data/salesChannels';
import { useData } from '@/contexts/DataContext';
import { DeleteConfirmDialog } from '@/components/shared/DeleteConfirmDialog';
import { ProductFormDialog } from './ProductFormDialog';
import { PricingSimulatorSheet } from './PricingSimulatorSheet';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const getProductChannel = (product: Product) =>
  DEFAULT_SALES_CHANNELS.find(c => c.id === product.category) ?? DEFAULT_SALES_CHANNELS[0];

type QuickFilter = 'all' | 'low-margin' | 'top-profit';

const filterLabels: Record<QuickFilter, string> = {
  all: 'Todos',
  'low-margin': 'Margem baixa',
  'top-profit': 'Mais lucrativos',
};

export const ProductsTable = () => {
  const { products, fixedCosts, taxConfig, addProduct, deleteProduct } = useData();
  const [search, setSearch] = useState('');
  const [quickFilter, setQuickFilter] = useState<QuickFilter>('all');
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; id: string; name: string }>({ isOpen: false, id: '', name: '' });
  const [formDialog, setFormDialog] = useState<{ isOpen: boolean; product: Product | null }>({ isOpen: false, product: null });
  const [simulatorSheet, setSimulatorSheet] = useState<{ isOpen: boolean; product: Product | null }>({ isOpen: false, product: null });

  const activeProductsCount = useMemo(() => products.filter(p => p.status === 'active').length, [products]);

  const fmt = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  const getPricing = (product: Product) => {
    const channel = getProductChannel(product);
    const channelTax: TaxConfig = {
      salesTax: channel.salesTax,
      marketplaceFee: channel.commissionPercent,
      cardFee: channel.cardFee,
      otherFees: channel.additionalCost > 0
        ? [{ id: 'ch', name: 'Custo adicional', percentage: channel.additionalCost }]
        : [],
    };
    const prodWithFee = channel.fixedFee > 0
      ? { ...product, variableCost: product.variableCost + channel.fixedFee }
      : product;
    return calculatePricing(prodWithFee, fixedCosts, channelTax, 25, 'exclude', activeProductsCount);
  };

  const productsWithPricing = useMemo(() =>
    products.map(p => ({ product: p, pricing: getPricing(p), channel: getProductChannel(p) })),
    [products, fixedCosts, activeProductsCount]
  );

  const filteredProducts = useMemo(() => {
    let list = productsWithPricing;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(({ product: p }) => p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q));
    }
    if (quickFilter === 'low-margin') list = list.filter(({ pricing }) => pricing.realMargin < 15);
    if (quickFilter === 'top-profit') list = [...list].sort((a, b) => b.pricing.profitPerUnit - a.pricing.profitPerUnit).slice(0, 10);
    return list;
  }, [productsWithPricing, search, quickFilter]);

  const getMarginColor = (m: number) =>
    m >= 25 ? 'hsl(152 60% 48%)' : m >= 15 ? 'hsl(42 90% 55%)' : 'hsl(0 70% 55%)';

  const handleDeleteConfirm = () => {
    deleteProduct(deleteDialog.id);
    setDeleteDialog({ isOpen: false, id: '', name: '' });
  };

  return (
    <TooltipProvider delayDuration={300}>
      <div className="animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-[28px] font-bold text-white leading-tight tracking-tight">Meus Produtos</h1>
            <p className="text-[14px] mt-1" style={{ color: 'hsl(215 10% 50%)' }}>
              Gerencie e precifique seus produtos de forma inteligente
            </p>
          </div>
          <button
            onClick={() => setFormDialog({ isOpen: true, product: null })}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm text-white transition-all duration-200 active:scale-[0.97]"
            style={{
              background: 'hsl(var(--color-blue))',
              boxShadow: '0 2px 12px hsl(var(--color-blue) / 0.3)',
            }}
            onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(1.15)'; }}
            onMouseLeave={e => { e.currentTarget.style.filter = 'brightness(1)'; }}
          >
            <Plus className="w-4 h-4" />
            Novo Produto
          </button>
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'hsl(215 10% 35%)' }} />
            <input
              placeholder="Buscar por nome ou código..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full h-11 pl-11 pr-4 rounded-xl text-sm text-white placeholder:text-[hsl(215_10%_35%)] transition-all duration-200 focus:outline-none"
              style={{
                background: 'hsl(225 18% 7%)',
                border: '1px solid hsl(225 14% 12%)',
              }}
              onFocus={e => { e.currentTarget.style.borderColor = 'hsl(var(--color-blue) / 0.3)'; }}
              onBlur={e => { e.currentTarget.style.borderColor = 'hsl(225 14% 12%)'; }}
            />
          </div>
          <div className="flex gap-1.5">
            {(Object.keys(filterLabels) as QuickFilter[]).map(f => {
              const active = quickFilter === f;
              return (
                <button
                  key={f}
                  onClick={() => setQuickFilter(f)}
                  className="px-3.5 py-2 rounded-lg text-xs font-medium transition-all duration-150 whitespace-nowrap"
                  style={{
                    background: active ? 'hsl(var(--color-blue) / 0.1)' : 'transparent',
                    border: `1px solid ${active ? 'hsl(var(--color-blue) / 0.25)' : 'hsl(225 14% 12%)'}`,
                    color: active ? 'hsl(var(--color-blue))' : 'hsl(215 10% 50%)',
                  }}
                >
                  {filterLabels[f]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Count */}
        <div className="flex items-center gap-2 mb-3">
          <Package className="w-3.5 h-3.5" style={{ color: 'hsl(215 10% 35%)' }} />
          <span className="text-xs font-medium" style={{ color: 'hsl(215 10% 42%)' }}>
            {filteredProducts.length} produto{filteredProducts.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Table */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: 'hsl(225 18% 6.5%)',
            border: '1px solid hsl(225 14% 10%)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
          }}
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px]">
              <thead>
                <tr style={{ background: 'hsl(225 16% 8%)', borderBottom: '1px solid hsl(225 14% 10%)' }}>
                  {[
                    { label: 'Produto', align: 'left' as const },
                    { label: 'Custo', align: 'right' as const },
                    { label: 'Canal', align: 'right' as const },
                    { label: 'Preço Sugerido', align: 'right' as const },
                    { label: 'Lucro', align: 'right' as const },
                    { label: 'Margem', align: 'right' as const },
                    { label: '', align: 'center' as const },
                  ].map((h, i) => (
                    <th
                      key={i}
                      className="text-[10px] font-semibold uppercase tracking-[0.08em] py-3.5 px-5"
                      style={{ color: 'hsl(215 10% 38%)', textAlign: h.align }}
                    >
                      {h.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-20">
                      <Package className="w-10 h-10 mx-auto mb-3" style={{ color: 'hsl(215 10% 20%)' }} />
                      <p className="text-sm font-medium" style={{ color: 'hsl(215 10% 35%)' }}>
                        {search ? 'Nenhum produto encontrado' : 'Nenhum produto cadastrado'}
                      </p>
                      {!search && (
                        <button
                          onClick={() => setFormDialog({ isOpen: true, product: null })}
                          className="mt-3 text-sm font-medium"
                          style={{ color: 'hsl(var(--color-blue))' }}
                        >
                          Cadastrar primeiro produto
                        </button>
                      )}
                    </td>
                  </tr>
                )}
                {filteredProducts.map(({ product, pricing, channel }) => {
                  const margin = pricing.realMargin;
                  const marginColor = getMarginColor(margin);
                  const displayPrice = product.currentPrice > 0 ? product.currentPrice : pricing.suggestedPrice;

                  return (
                    <tr
                      key={product.id}
                      className="group transition-all duration-150"
                      style={{ borderBottom: '1px solid hsl(225 14% 9%)' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'hsl(225 16% 8%)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                    >
                      {/* Produto */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0"
                            style={{ background: 'hsl(var(--color-blue) / 0.06)', color: 'hsl(var(--color-blue) / 0.7)' }}
                          >
                            {product.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-[13px] font-semibold text-white leading-tight">{product.name}</p>
                            <p className="text-[10px] mt-0.5 font-medium" style={{ color: 'hsl(215 10% 35%)' }}>{product.code}</p>
                          </div>
                        </div>
                      </td>

                      {/* Custo */}
                      <td className="py-4 px-5 text-right">
                        <span className="text-[13px] font-medium tabular-nums" style={{ color: 'hsl(215 10% 65%)' }}>
                          {fmt(product.purchaseCost + product.variableCost)}
                        </span>
                      </td>

                      {/* Canal */}
                      <td className="py-4 px-5 text-right">
                        <span
                          className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-lg"
                          style={{ background: 'hsl(225 16% 10%)', color: 'hsl(215 10% 60%)', border: '1px solid hsl(225 14% 13%)' }}
                        >
                          <span className="text-sm leading-none">{channel.icon}</span>
                          <span className="hidden sm:inline">{channel.name}</span>
                        </span>
                      </td>

                      {/* Preço Sugerido - HERO column */}
                      <td className="py-4 px-5 text-right">
                        <span className="text-[15px] font-bold text-white tabular-nums tracking-tight">
                          {fmt(displayPrice)}
                        </span>
                      </td>

                      {/* Lucro */}
                      <td className="py-4 px-5 text-right">
                        <span
                          className="text-[13px] font-semibold tabular-nums"
                          style={{ color: pricing.profitPerUnit >= 0 ? 'hsl(152 60% 52%)' : 'hsl(0 70% 58%)' }}
                        >
                          {fmt(pricing.profitPerUnit)}
                        </span>
                      </td>

                      {/* Margem */}
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-2.5">
                          <div className="w-12 h-1.5 rounded-full overflow-hidden" style={{ background: 'hsl(225 14% 12%)' }}>
                            <div
                              className="h-full rounded-full transition-all duration-300"
                              style={{ width: `${Math.min(margin, 100)}%`, background: marginColor }}
                            />
                          </div>
                          <span className="text-[13px] font-bold tabular-nums min-w-[42px] text-right" style={{ color: marginColor }}>
                            {margin.toFixed(1)}%
                          </span>
                        </div>
                      </td>

                      {/* Ações */}
                      <td className="py-4 px-5">
                        <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => setSimulatorSheet({ isOpen: true, product })}
                                className="p-2 rounded-lg transition-all duration-150"
                                style={{ color: 'hsl(var(--color-blue))' }}
                                onMouseEnter={e => { e.currentTarget.style.background = 'hsl(var(--color-blue) / 0.08)'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                              >
                                <Calculator className="w-4 h-4" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent side="top"><p>Simular preço</p></TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => setFormDialog({ isOpen: true, product })}
                                className="p-2 rounded-lg transition-all duration-150"
                                style={{ color: 'hsl(215 10% 42%)' }}
                                onMouseEnter={e => { e.currentTarget.style.background = 'hsl(225 16% 10%)'; e.currentTarget.style.color = '#fff'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'hsl(215 10% 42%)'; }}
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent side="top"><p>Editar produto</p></TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => setDeleteDialog({ isOpen: true, id: product.id, name: product.name })}
                                className="p-2 rounded-lg transition-all duration-150"
                                style={{ color: 'hsl(215 10% 42%)' }}
                                onMouseEnter={e => { e.currentTarget.style.background = 'hsl(345 70% 50% / 0.08)'; e.currentTarget.style.color = 'hsl(345 70% 58%)'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'hsl(215 10% 42%)'; }}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent side="top"><p>Excluir</p></TooltipContent>
                          </Tooltip>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <ProductFormDialog
          isOpen={formDialog.isOpen}
          product={formDialog.product}
          onClose={() => setFormDialog({ isOpen: false, product: null })}
        />
        <PricingSimulatorSheet
          isOpen={simulatorSheet.isOpen}
          product={simulatorSheet.product}
          onClose={() => setSimulatorSheet({ isOpen: false, product: null })}
        />
        <DeleteConfirmDialog
          isOpen={deleteDialog.isOpen}
          onClose={() => setDeleteDialog({ isOpen: false, id: '', name: '' })}
          onConfirm={handleDeleteConfirm}
          itemName={deleteDialog.name}
        />
      </div>
    </TooltipProvider>
  );
};

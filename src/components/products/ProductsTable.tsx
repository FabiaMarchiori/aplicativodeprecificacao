import { useState, useMemo } from 'react';
import { Plus, Pencil, Trash2, Search, Calculator, Package } from 'lucide-react';
import { Product, calculatePricing, TaxConfig } from '@/data/mockData';
import { DEFAULT_SALES_CHANNELS } from '@/data/salesChannels';
import { useData } from '@/contexts/DataContext';
import { DeleteConfirmDialog } from '@/components/shared/DeleteConfirmDialog';
import { ProductFormDialog } from './ProductFormDialog';
import { PricingSimulatorSheet } from './PricingSimulatorSheet';
import { Input } from '@/components/ui/input';

// Resolve a channel from product.category (which stores the channel ID)
const getProductChannel = (product: Product) => {
  return DEFAULT_SALES_CHANNELS.find(c => c.id === product.category) ?? DEFAULT_SALES_CHANNELS[0];
};

export const ProductsTable = () => {
  const { products, fixedCosts, taxConfig, addProduct, deleteProduct } = useData();
  const [search, setSearch] = useState('');
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; id: string; name: string }>({ isOpen: false, id: '', name: '' });
  const [formDialog, setFormDialog] = useState<{ isOpen: boolean; product: Product | null }>({ isOpen: false, product: null });
  const [simulatorSheet, setSimulatorSheet] = useState<{ isOpen: boolean; product: Product | null }>({ isOpen: false, product: null });

  const activeProductsCount = useMemo(() => products.filter(p => p.status === 'active').length, [products]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const filteredProducts = useMemo(() => {
    if (!search.trim()) return products;
    const q = search.toLowerCase();
    return products.filter(p => p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q));
  }, [products, search]);

  // Calculate pricing per product using its saved channel
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

  const getMarginColor = (margin: number) => {
    if (margin >= 25) return '#22c55e';
    if (margin >= 15) return '#eab308';
    return '#ef4444';
  };

  const handleDeleteConfirm = () => {
    deleteProduct(deleteDialog.id);
    setDeleteDialog({ isOpen: false, id: '', name: '' });
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 style={{ fontSize: '32px', fontWeight: 700, color: '#FFFFFF', lineHeight: 1.15, letterSpacing: '-0.02em' }}>
            Meus Produtos
          </h2>
          <p style={{ fontSize: '15px', fontWeight: 400, color: '#FFFFFF', marginTop: '4px' }}>
            Cadastre, edite e precifique seus produtos em um só lugar
          </p>
        </div>
        <button
          onClick={() => setFormDialog({ isOpen: true, product: null })}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200"
          style={{
            background: 'linear-gradient(135deg, rgba(0,130,255,0.15), rgba(0,200,255,0.08))',
            border: '1px solid rgba(0,160,255,0.4)',
            color: '#FFFFFF',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0,130,255,0.25), rgba(0,200,255,0.15))'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0,130,255,0.15), rgba(0,200,255,0.08))'; }}
        >
          <Plus className="w-4 h-4" />
          Novo Produto
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white" />
        <Input
          placeholder="Buscar por nome ou código..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 h-11 rounded-xl text-sm"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#FFFFFF',
          }}
        />
      </div>

      {/* Product count */}
      <div className="flex items-center gap-2 mb-4">
        <Package className="w-4 h-4 text-white" />
        <span className="text-xs text-white">
          {filteredProducts.length} produto{filteredProducts.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Table */}
      <div
        className="rounded-xl overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                {['Produto', 'Custo', 'Canal de Venda', 'Preço Sugerido', 'Lucro Líquido', 'Margem', 'Ações'].map((h, i) => (
                  <th
                    key={h}
                    className="text-xs font-semibold uppercase tracking-wider py-3.5 px-4"
                    style={{
                      color: '#FFFFFF',
                      textAlign: i >= 1 && i <= 5 ? 'right' : 'left',
                      ...(i === 6 ? { textAlign: 'center' } : {}),
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-white">
                    {search ? 'Nenhum produto encontrado' : 'Nenhum produto cadastrado'}
                  </td>
                </tr>
              )}
              {filteredProducts.map((product) => {
                const pricing = getPricing(product);
                const margin = pricing.realMargin;
                const marginColor = getMarginColor(margin);
                const channel = getProductChannel(product);

                return (
                  <tr
                    key={product.id}
                    className="group transition-colors duration-150"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    {/* Produto */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                          style={{ background: 'rgba(0,140,255,0.12)', color: 'rgba(0,180,255,0.9)' }}
                        >
                          {product.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{product.name}</p>
                          <p className="text-xs text-white">{product.code}</p>
                        </div>
                      </div>
                    </td>

                    {/* Custo */}
                    <td className="py-3.5 px-4 text-right">
                      <span className="text-sm font-medium text-white">
                        {formatCurrency(product.purchaseCost + product.variableCost)}
                      </span>
                    </td>

                    {/* Canal de Venda */}
                    <td className="py-3.5 px-4 text-right">
                      <span
                        className="inline-block text-xs font-medium px-2.5 py-1 rounded-full text-white"
                        style={{ background: 'rgba(255,255,255,0.06)' }}
                      >
                        {channel.icon} {channel.name}
                      </span>
                    </td>

                    {/* Preço Sugerido */}
                    <td className="py-3.5 px-4 text-right">
                      <span className="text-sm font-semibold text-white">
                        {formatCurrency(product.currentPrice > 0 ? product.currentPrice : pricing.suggestedPrice)}
                      </span>
                    </td>

                    {/* Lucro Líquido */}
                    <td className="py-3.5 px-4 text-right">
                      <span className="text-sm font-medium" style={{ color: pricing.profitPerUnit >= 0 ? '#22c55e' : '#ef4444' }}>
                        {formatCurrency(pricing.profitPerUnit)}
                      </span>
                    </td>

                    {/* Margem */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-12 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                          <div className="h-full rounded-full" style={{ width: `${Math.min(margin, 100)}%`, background: marginColor }} />
                        </div>
                        <span className="text-sm font-semibold tabular-nums" style={{ color: marginColor }}>
                          {margin.toFixed(1)}%
                        </span>
                      </div>
                    </td>

                    {/* Ações */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => setSimulatorSheet({ isOpen: true, product })}
                          className="p-2 rounded-lg transition-all duration-150"
                          style={{ color: 'rgba(0,180,255,0.8)' }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,140,255,0.12)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                          title="Simular preço"
                        >
                          <Calculator className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setFormDialog({ isOpen: true, product })}
                          className="p-2 rounded-lg transition-all duration-150 text-white"
                          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                          title="Editar"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteDialog({ isOpen: true, id: product.id, name: product.name })}
                          className="p-2 rounded-lg transition-all duration-150 text-white"
                          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#ef4444'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#FFFFFF'; }}
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dialogs */}
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
  );
};

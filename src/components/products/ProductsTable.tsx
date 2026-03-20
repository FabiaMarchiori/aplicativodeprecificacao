import { useState, useMemo } from 'react';
import { Plus, Pencil, Trash2, Search, Calculator, Package } from 'lucide-react';
import { Product, calculatePricing, TaxConfig } from '@/data/mockData';
import { DEFAULT_SALES_CHANNELS } from '@/data/salesChannels';
import { useData } from '@/contexts/DataContext';
import { DeleteConfirmDialog } from '@/components/shared/DeleteConfirmDialog';
import { ProductFormDialog } from './ProductFormDialog';
import { PricingSimulatorSheet } from './PricingSimulatorSheet';
import { Input } from '@/components/ui/input';

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
    if (margin >= 25) return 'hsl(152 60% 48%)';
    if (margin >= 15) return 'hsl(42 90% 55%)';
    return 'hsl(0 70% 55%)';
  };

  const handleDeleteConfirm = () => {
    deleteProduct(deleteDialog.id);
    setDeleteDialog({ isOpen: false, id: '', name: '' });
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-white">Meus Produtos</h1>
          <p className="text-sm mt-1" style={{ color: 'hsl(215 10% 50%)' }}>
            Cadastre, edite e precifique seus produtos
          </p>
        </div>
        <button
          onClick={() => setFormDialog({ isOpen: true, product: null })}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 text-white"
          style={{
            background: 'hsl(var(--color-blue))',
            boxShadow: '0 2px 8px hsl(var(--color-blue) / 0.25)',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.filter = 'brightness(1.12)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.filter = 'brightness(1)'; }}
        >
          <Plus className="w-4 h-4" />
          Novo Produto
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'hsl(215 10% 40%)' }} />
        <Input
          placeholder="Buscar por nome ou código..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 h-10 rounded-lg text-sm"
          style={{
            background: 'hsl(225 16% 8%)',
            border: '1px solid hsl(225 14% 13%)',
            color: 'hsl(0 0% 100%)',
          }}
        />
      </div>

      {/* Count */}
      <div className="flex items-center gap-2 mb-4">
        <Package className="w-3.5 h-3.5" style={{ color: 'hsl(215 10% 40%)' }} />
        <span className="text-xs" style={{ color: 'hsl(215 10% 45%)' }}>
          {filteredProducts.length} produto{filteredProducts.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Table */}
      <div
        className="rounded-xl overflow-hidden"
        style={{
          background: 'hsl(225 18% 7%)',
          border: '1px solid hsl(225 14% 11%)',
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr style={{ borderBottom: '1px solid hsl(225 14% 11%)' }}>
                {['Produto', 'Custo', 'Canal de Venda', 'Preço Sugerido', 'Lucro Líquido', 'Margem', 'Ações'].map((h, i) => (
                  <th
                    key={h}
                    className="text-[11px] font-medium uppercase tracking-wider py-3 px-4"
                    style={{
                      color: 'hsl(215 10% 42%)',
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
                  <td colSpan={7} className="text-center py-16" style={{ color: 'hsl(215 10% 40%)' }}>
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
                    style={{ borderBottom: '1px solid hsl(225 14% 9%)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'hsl(225 16% 8%)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-md flex items-center justify-center text-xs font-semibold flex-shrink-0"
                          style={{ background: 'hsl(var(--color-blue) / 0.08)', color: 'hsl(var(--color-blue))' }}
                        >
                          {product.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{product.name}</p>
                          <p className="text-[11px]" style={{ color: 'hsl(215 10% 42%)' }}>{product.code}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <span className="text-sm font-medium text-white tabular-nums">
                        {formatCurrency(product.purchaseCost + product.variableCost)}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <span
                        className="inline-block text-[11px] font-medium px-2 py-1 rounded-md"
                        style={{ background: 'hsl(225 16% 10%)', color: 'hsl(215 10% 65%)' }}
                      >
                        {channel.icon} {channel.name}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <span className="text-sm font-semibold text-white tabular-nums">
                        {formatCurrency(product.currentPrice > 0 ? product.currentPrice : pricing.suggestedPrice)}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <span className="text-sm font-medium tabular-nums" style={{ color: pricing.profitPerUnit >= 0 ? 'hsl(152 60% 48%)' : 'hsl(0 70% 55%)' }}>
                        {formatCurrency(pricing.profitPerUnit)}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-10 h-1 rounded-full overflow-hidden" style={{ background: 'hsl(225 14% 14%)' }}>
                          <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(margin, 100)}%`, background: marginColor }} />
                        </div>
                        <span className="text-sm font-semibold tabular-nums" style={{ color: marginColor }}>
                          {margin.toFixed(1)}%
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-center gap-0.5">
                        <button
                          onClick={() => setSimulatorSheet({ isOpen: true, product })}
                          className="p-2 rounded-md transition-all duration-150"
                          style={{ color: 'hsl(var(--color-blue))' }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = 'hsl(var(--color-blue) / 0.08)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                          title="Simular preço"
                        >
                          <Calculator className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setFormDialog({ isOpen: true, product })}
                          className="p-2 rounded-md transition-all duration-150"
                          style={{ color: 'hsl(215 10% 45%)' }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = 'hsl(225 16% 10%)'; e.currentTarget.style.color = 'hsl(0 0% 100%)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'hsl(215 10% 45%)'; }}
                          title="Editar"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteDialog({ isOpen: true, id: product.id, name: product.name })}
                          className="p-2 rounded-md transition-all duration-150"
                          style={{ color: 'hsl(215 10% 45%)' }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = 'hsl(345 70% 50% / 0.08)'; e.currentTarget.style.color = 'hsl(345 70% 55%)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'hsl(215 10% 45%)'; }}
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

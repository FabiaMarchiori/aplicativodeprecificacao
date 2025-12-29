import { useState } from 'react';
import { Save, Info, Receipt, CreditCard, Store, MoreHorizontal } from 'lucide-react';
import { mockTaxConfig, TaxConfig } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

export const TaxesConfig = () => {
  const [taxes, setTaxes] = useState<TaxConfig>(mockTaxConfig);
  const { toast } = useToast();

  const totalTaxes = taxes.salesTax + taxes.marketplaceFee + taxes.cardFee + taxes.otherFees;

  const handleSave = () => {
    toast({ title: 'Configurações salvas', description: 'As taxas foram atualizadas com sucesso.' });
  };

  const handleChange = (field: keyof TaxConfig, value: string) => {
    setTaxes({ ...taxes, [field]: parseFloat(value) || 0 });
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Impostos & Taxas</h2>
          <p className="text-muted-foreground">Configure as alíquotas aplicadas sobre vendas</p>
        </div>
        <button onClick={handleSave} className="btn-primary flex items-center gap-2">
          <Save className="w-4 h-4" />
          Salvar Alterações
        </button>
      </div>

      {/* Total Card */}
      <div className="kpi-card mb-6 max-w-md">
        <div className="flex items-center gap-3 mb-2">
          <Info className="w-5 h-5 text-primary" />
          <h3 className="text-sm font-medium text-muted-foreground">Taxa Total sobre Venda</h3>
        </div>
        <p className="text-3xl font-bold text-foreground mono">{totalTaxes.toFixed(2)}%</p>
        <p className="text-sm text-muted-foreground mt-2">
          Este percentual será aplicado sobre o preço de venda
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sales Tax */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-primary/20">
              <Receipt className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Imposto sobre Venda</h3>
              <p className="text-sm text-muted-foreground">ICMS, PIS, COFINS, etc.</p>
            </div>
          </div>
          <div className="relative">
            <input
              type="number"
              step="0.1"
              className="input-field text-2xl font-bold pr-8"
              value={taxes.salesTax}
              onChange={(e) => handleChange('salesTax', e.target.value)}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">%</span>
          </div>
        </div>

        {/* Marketplace Fee */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-warning/20">
              <Store className="w-5 h-5 text-warning" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Taxa de Marketplace</h3>
              <p className="text-sm text-muted-foreground">Mercado Livre, Amazon, Shopee, etc.</p>
            </div>
          </div>
          <div className="relative">
            <input
              type="number"
              step="0.1"
              className="input-field text-2xl font-bold pr-8"
              value={taxes.marketplaceFee}
              onChange={(e) => handleChange('marketplaceFee', e.target.value)}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">%</span>
          </div>
        </div>

        {/* Card Fee */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-success/20">
              <CreditCard className="w-5 h-5 text-success" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Taxa de Cartão</h3>
              <p className="text-sm text-muted-foreground">Débito, Crédito, Pix com taxa</p>
            </div>
          </div>
          <div className="relative">
            <input
              type="number"
              step="0.1"
              className="input-field text-2xl font-bold pr-8"
              value={taxes.cardFee}
              onChange={(e) => handleChange('cardFee', e.target.value)}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">%</span>
          </div>
        </div>

        {/* Other Fees */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-muted">
              <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Outras Taxas</h3>
              <p className="text-sm text-muted-foreground">Frete, seguros, devoluções</p>
            </div>
          </div>
          <div className="relative">
            <input
              type="number"
              step="0.1"
              className="input-field text-2xl font-bold pr-8"
              value={taxes.otherFees}
              onChange={(e) => handleChange('otherFees', e.target.value)}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">%</span>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-6 p-4 rounded-xl bg-primary/10 border border-primary/20">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <h4 className="font-medium text-foreground">Como funciona o cálculo</h4>
            <p className="text-sm text-muted-foreground mt-1">
              As taxas configuradas aqui são automaticamente incluídas no cálculo de precificação. 
              O preço sugerido considera todos estes percentuais para garantir que sua margem desejada seja atingida.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

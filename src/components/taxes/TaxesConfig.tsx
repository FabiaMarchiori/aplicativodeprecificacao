import { useState } from 'react';
import { Save, Info, Receipt, CreditCard, Store, MoreHorizontal } from 'lucide-react';
import { mockTaxConfig, TaxConfig } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

// Configuração de cores neon por categoria
const taxCardConfigs = {
  salesTax: {
    color: '#BC13FE',
    label: 'Imposto sobre Venda',
    description: 'ICMS, PIS, COFINS, etc.',
    Icon: Receipt
  },
  marketplaceFee: {
    color: '#FFAC00',
    label: 'Taxa de Marketplace',
    description: 'Mercado Livre, Amazon, Shopee, etc.',
    Icon: Store
  },
  cardFee: {
    color: '#39FF14',
    label: 'Taxa de Cartão',
    description: 'Débito, Crédito, Pix com taxa',
    Icon: CreditCard
  },
  otherFees: {
    color: '#64748b',
    label: 'Outras Taxas',
    description: 'Frete, seguros, devoluções',
    Icon: MoreHorizontal
  }
};

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

  const renderTaxCard = (field: keyof TaxConfig) => {
    const config = taxCardConfigs[field];
    const { color, label, description, Icon } = config;

    return (
      <div 
        key={field}
        className="p-6 rounded-xl transition-all duration-300 hover:scale-[1.01]"
        style={{
          background: '#0a0a0c',
          border: `1px solid ${color}40`,
          boxShadow: `0 0 12px ${color}20`
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div 
            className="p-2.5 rounded-xl"
            style={{ 
              background: `${color}15`,
              border: `1px solid ${color}30`
            }}
          >
            <Icon 
              className="w-5 h-5" 
              style={{ color, filter: `drop-shadow(0 0 4px ${color})` }}
            />
          </div>
          <div>
            <h3 className="font-semibold" style={{ color }}>{label}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        <div className="relative">
          <input
            type="number"
            step="0.1"
            className="w-full text-2xl font-bold pr-10 rounded-lg transition-all duration-300"
            style={{
              background: 'rgba(0, 0, 0, 0.4)',
              border: `1px solid ${color}30`,
              color: '#F8FAFC',
              padding: '12px 40px 12px 16px',
              outline: 'none'
            }}
            onFocus={(e) => {
              e.currentTarget.style.border = `1px solid ${color}`;
              e.currentTarget.style.boxShadow = `0 0 12px ${color}50, inset 0 0 10px ${color}10`;
            }}
            onBlur={(e) => {
              e.currentTarget.style.border = `1px solid ${color}30`;
              e.currentTarget.style.boxShadow = 'none';
            }}
            value={taxes[field]}
            onChange={(e) => handleChange(field, e.target.value)}
          />
          <span 
            className="absolute right-4 top-1/2 -translate-y-1/2 font-medium"
            style={{ color: `${color}80` }}
          >
            %
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 
            className="text-2xl font-bold"
            style={{ 
              color: '#F8FAFC',
              textShadow: '0 0 10px rgba(248, 250, 252, 0.3)'
            }}
          >
            Impostos & Taxas
          </h2>
          <p className="text-muted-foreground">Configure as alíquotas aplicadas sobre vendas</p>
        </div>
        <button 
          onClick={handleSave} 
          className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all duration-300"
          style={{
            background: 'rgba(0, 209, 255, 0.1)',
            border: '1px solid rgba(0, 209, 255, 0.4)',
            color: '#00D1FF',
            boxShadow: '0 0 10px rgba(0, 209, 255, 0.2)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(0, 209, 255, 0.15)';
            e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 209, 255, 0.35), inset 0 0 12px rgba(0, 209, 255, 0.08)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(0, 209, 255, 0.1)';
            e.currentTarget.style.boxShadow = '0 0 10px rgba(0, 209, 255, 0.2)';
          }}
        >
          <Save 
            className="w-4 h-4" 
            style={{ filter: 'drop-shadow(0 0 3px #00D1FF)' }}
          />
          Salvar Alterações
        </button>
      </div>

      {/* Total Tax Card - Destaque Ciano */}
      <div 
        className="mb-6 max-w-md p-6 rounded-xl"
        style={{
          background: '#0a0a0c',
          border: '1px solid rgba(0, 209, 255, 0.4)',
          boxShadow: '0 0 20px rgba(0, 209, 255, 0.25), 0 0 40px rgba(0, 209, 255, 0.12), inset 0 0 30px rgba(0, 0, 0, 0.7)'
        }}
      >
        <div className="flex items-center gap-3 mb-2">
          <Info 
            className="w-5 h-5" 
            style={{ color: '#00D1FF', filter: 'drop-shadow(0 0 5px #00D1FF)' }}
          />
          <h3 
            className="text-sm font-medium"
            style={{ color: '#00D1FF', textShadow: '0 0 6px rgba(0, 209, 255, 0.4)' }}
          >
            Taxa Total sobre Venda
          </h3>
        </div>
        <p 
          className="text-4xl font-bold mono"
          style={{ 
            color: '#00D1FF',
            textShadow: '0 0 15px rgba(0, 209, 255, 0.6), 0 0 30px rgba(0, 209, 255, 0.3)'
          }}
        >
          {totalTaxes.toFixed(2)}%
        </p>
        <p 
          className="text-sm mt-2"
          style={{ color: '#64748b' }}
        >
          Este percentual será aplicado sobre o preço de venda
        </p>
      </div>

      {/* Tax Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderTaxCard('salesTax')}
        {renderTaxCard('marketplaceFee')}
        {renderTaxCard('cardFee')}
        {renderTaxCard('otherFees')}
      </div>

      {/* Info Box - Sutil com ícone brilhante */}
      <div 
        className="mt-6 p-4 rounded-xl"
        style={{
          background: '#000000',
          border: '1px solid rgba(75, 85, 99, 0.5)',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)'
        }}
      >
        <div className="flex items-start gap-3">
          <Info 
            className="w-5 h-5 mt-0.5" 
            style={{ 
              color: '#00D1FF',
              filter: 'drop-shadow(0 0 8px #00D1FF)'
            }}
          />
          <div>
            <h4 
              className="font-medium"
              style={{ color: '#94a3b8' }}
            >
              Como funciona o cálculo
            </h4>
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

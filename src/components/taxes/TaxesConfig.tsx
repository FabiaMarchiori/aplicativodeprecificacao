import { useState, useEffect } from 'react';
import { Save, Info, Receipt, CreditCard, Store, MoreHorizontal, Plus, X } from 'lucide-react';
import { TaxConfig, OtherTax } from '@/data/mockData';
import { useData } from '@/contexts/DataContext';
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
  }
};

export const TaxesConfig = () => {
  const { taxConfig, updateTaxConfig } = useData();
  const [taxes, setTaxes] = useState<TaxConfig>(taxConfig);
  const { toast } = useToast();

  // Sync local state when taxConfig changes from context
  useEffect(() => {
    setTaxes(taxConfig);
  }, [taxConfig]);

  const otherFeesTotal = taxes.otherFees.reduce((sum, tax) => sum + tax.percentage, 0);
  const totalTaxes = taxes.salesTax + taxes.marketplaceFee + taxes.cardFee + otherFeesTotal;

  const handleSave = () => {
    updateTaxConfig(taxes);
  };

  const handleChange = (field: keyof Omit<TaxConfig, 'otherFees'>, value: string) => {
    setTaxes({ ...taxes, [field]: parseFloat(value) || 0 });
  };

  const handleOtherFeeChange = (id: string, field: 'name' | 'percentage', value: string) => {
    setTaxes({
      ...taxes,
      otherFees: taxes.otherFees.map(fee => 
        fee.id === id 
          ? { ...fee, [field]: field === 'percentage' ? (parseFloat(value) || 0) : value }
          : fee
      )
    });
  };

  const addOtherFee = () => {
    const newId = (Math.max(...taxes.otherFees.map(f => parseInt(f.id)), 0) + 1).toString();
    setTaxes({
      ...taxes,
      otherFees: [...taxes.otherFees, { id: newId, name: '', percentage: 0 }]
    });
  };

  const removeOtherFee = (id: string) => {
    setTaxes({
      ...taxes,
      otherFees: taxes.otherFees.filter(fee => fee.id !== id)
    });
  };

  const renderTaxCard = (field: 'salesTax' | 'marketplaceFee' | 'cardFee') => {
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
            <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.75)' }}>{description}</p>
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

  const otherFeesColor = '#00D1FF';

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 md:mb-6">
        <div>
          <h2 
            className="text-xl md:text-2xl font-bold"
            style={{ 
              color: '#F8FAFC',
              textShadow: '0 0 10px rgba(248, 250, 252, 0.3)'
            }}
          >
            Impostos & Taxas
          </h2>
          <p className="text-sm md:text-base" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Configure as alíquotas aplicadas sobre vendas</p>
          <p className="text-xs md:text-sm mt-1 hidden sm:block" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
            Estas taxas são usadas como base nos cálculos de precificação e podem ser ajustadas conforme seu modelo de negócio.
          </p>
        </div>
        <button 
          onClick={handleSave} 
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3 md:px-6 md:py-2.5 rounded-lg font-medium transition-all duration-300 touch-target"
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
          <span className="text-sm md:text-base">Salvar Alterações</span>
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
          style={{ color: 'rgba(255, 255, 255, 0.7)' }}
        >
          Este percentual será aplicado sobre o preço de venda
        </p>
      </div>

      {/* Tax Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6">
        {renderTaxCard('salesTax')}
        {renderTaxCard('marketplaceFee')}
        {renderTaxCard('cardFee')}
        
        {/* Outras Taxas - Card Dinâmico */}
        <div 
          className="p-6 rounded-xl transition-all duration-300"
          style={{
            background: '#0a0a0c',
            border: `1px solid ${otherFeesColor}40`,
            boxShadow: `0 0 12px ${otherFeesColor}20`
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div 
                className="p-2.5 rounded-xl"
                style={{ 
                  background: `${otherFeesColor}15`,
                  border: `1px solid ${otherFeesColor}30`
                }}
              >
                <MoreHorizontal 
                  className="w-5 h-5" 
                  style={{ color: otherFeesColor, filter: `drop-shadow(0 0 4px ${otherFeesColor})` }}
                />
              </div>
              <div>
                <h3 className="font-semibold" style={{ color: otherFeesColor }}>Outras Taxas</h3>
                <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.75)' }}>Frete, seguros, devoluções</p>
              </div>
            </div>
            <div 
              className="px-3 py-1 rounded-lg text-sm font-bold"
              style={{ 
                background: `${otherFeesColor}20`,
                color: otherFeesColor
              }}
            >
              Total: {otherFeesTotal.toFixed(1)}%
            </div>
          </div>
          
          {/* Lista de taxas adicionais */}
          <div className="space-y-3 mb-4">
            {taxes.otherFees.map((fee) => (
              <div key={fee.id} className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Nome da taxa"
                  className="flex-1 px-3 py-2 rounded-lg text-sm transition-all duration-300"
                  style={{
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: `1px solid ${otherFeesColor}30`,
                    color: '#F8FAFC',
                    outline: 'none'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.border = `1px solid ${otherFeesColor}`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.border = `1px solid ${otherFeesColor}30`;
                  }}
                  value={fee.name}
                  onChange={(e) => handleOtherFeeChange(fee.id, 'name', e.target.value)}
                />
                <div className="relative w-24">
                  <input
                    type="number"
                    step="0.1"
                    className="w-full px-3 py-2 pr-8 rounded-lg text-sm font-bold transition-all duration-300"
                    style={{
                      background: 'rgba(0, 0, 0, 0.4)',
                      border: `1px solid ${otherFeesColor}30`,
                      color: '#F8FAFC',
                      outline: 'none'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.border = `1px solid ${otherFeesColor}`;
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.border = `1px solid ${otherFeesColor}30`;
                    }}
                    value={fee.percentage}
                    onChange={(e) => handleOtherFeeChange(fee.id, 'percentage', e.target.value)}
                  />
                  <span 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm"
                    style={{ color: `${otherFeesColor}80` }}
                  >
                    %
                  </span>
                </div>
                <button
                  onClick={() => removeOtherFee(fee.id)}
                  className="p-2 rounded-lg transition-all duration-300 hover:scale-110"
                  style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)'
                  }}
                >
                  <X className="w-4 h-4 text-red-400" />
                </button>
              </div>
            ))}
          </div>
          
          {/* Botão Adicionar */}
          <button
            onClick={addOtherFee}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-300"
            style={{
              background: `${otherFeesColor}10`,
              border: `1px dashed ${otherFeesColor}40`,
              color: otherFeesColor
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = `${otherFeesColor}20`;
              e.currentTarget.style.borderStyle = 'solid';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = `${otherFeesColor}10`;
              e.currentTarget.style.borderStyle = 'dashed';
            }}
          >
            <Plus className="w-4 h-4" />
            Adicionar Taxa
          </button>
        </div>
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
              style={{ color: 'rgba(255, 255, 255, 0.85)' }}
            >
              Como funciona o cálculo
            </h4>
            <p className="text-sm mt-1" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              As taxas configuradas aqui são automaticamente incluídas no cálculo de precificação. 
              O preço sugerido considera todos estes percentuais para garantir que sua margem desejada seja atingida.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

import { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import { Competitor } from '@/data/mockData';
import { useData } from '@/contexts/DataContext';
import { Input } from '@/components/ui/input';

export const CompetitionAnalysis = () => {
  const { competitors, updateCompetitorPrice } = useData();
  const [editingPrices, setEditingPrices] = useState<Record<string, string>>({});

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const getStatusConfig = (status: Competitor['status']) => {
    switch (status) {
      case 'competitive':
        return {
          icon: CheckCircle,
          label: 'Competitivo',
          color: '#39FF14',
          glowColor: 'rgba(57, 255, 20, 0.2)'
        };
      case 'attention':
        return {
          icon: AlertTriangle,
          label: 'Atenção',
          color: '#FFAC00',
          glowColor: 'rgba(255, 172, 0, 0.2)'
        };
      case 'above_market':
        return {
          icon: AlertCircle,
          label: 'Acima do Mercado',
          color: '#BC13FE',
          glowColor: 'rgba(188, 19, 254, 0.2)'
        };
    }
  };

  const handlePriceChange = (productId: string, value: string) => {
    setEditingPrices(prev => ({ ...prev, [productId]: value }));
  };

  const handlePriceBlur = (productId: string) => {
    const value = editingPrices[productId];
    if (value === undefined) return;
    
    // Parse the value, handling Brazilian number format
    const cleanValue = value.replace(/[^\d,.-]/g, '').replace(',', '.');
    const numericValue = cleanValue ? parseFloat(cleanValue) : null;
    
    updateCompetitorPrice(productId, numericValue && numericValue > 0 ? numericValue : null);
    
    // Clear editing state
    setEditingPrices(prev => {
      const { [productId]: _, ...rest } = prev;
      return rest;
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent, productId: string) => {
    if (e.key === 'Enter') {
      handlePriceBlur(productId);
      (e.target as HTMLInputElement).blur();
    }
  };

  const getDisplayValue = (competitor: { productId: string; competitorPrice: number | null }) => {
    if (editingPrices[competitor.productId] !== undefined) {
      return editingPrices[competitor.productId];
    }
    if (competitor.competitorPrice !== null) {
      return competitor.competitorPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    }
    return '';
  };

  // Only count products with informed prices
  const competitiveCount = competitors.filter(c => c.competitorPrice !== null && c.status === 'competitive').length;
  const attentionCount = competitors.filter(c => c.competitorPrice !== null && c.status === 'attention').length;
  const aboveMarketCount = competitors.filter(c => c.competitorPrice !== null && c.status === 'above_market').length;
  const pendingCount = competitors.filter(c => c.competitorPrice === null).length;

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Análise da Concorrência</h2>
          <p className="text-muted-foreground">Compare seus preços com o mercado</p>
        </div>
      </div>

      {/* Summary Cards - Premium Style */}
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-6">
        {/* Card Competitivo */}
        <div 
          className="p-4 rounded-xl transition-all duration-300 hover:-translate-y-1"
          style={{
            background: '#0a0a0c',
            border: '1px solid rgba(57, 255, 20, 0.4)',
            boxShadow: '0 0 15px rgba(57, 255, 20, 0.15)'
          }}
        >
          <div className="flex items-center gap-3">
            <CheckCircle 
              className="w-8 h-8" 
              style={{ 
                color: '#39FF14',
                filter: 'drop-shadow(0 0 4px #39FF14)'
              }} 
            />
            <div>
              <p 
                className="text-2xl font-bold"
                style={{ 
                  color: '#39FF14',
                  textShadow: '0 0 6px rgba(57, 255, 20, 0.5)'
                }}
              >
                {competitiveCount}
              </p>
              <p className="text-sm text-muted-foreground">Produtos Competitivos</p>
            </div>
          </div>
        </div>

        {/* Card Atenção */}
        <div 
          className="p-4 rounded-xl transition-all duration-300 hover:-translate-y-1"
          style={{
            background: '#0a0a0c',
            border: '1px solid rgba(255, 172, 0, 0.4)',
            boxShadow: '0 0 15px rgba(255, 172, 0, 0.15)'
          }}
        >
          <div className="flex items-center gap-3">
            <AlertTriangle 
              className="w-8 h-8" 
              style={{ 
                color: '#FFAC00',
                filter: 'drop-shadow(0 0 4px #FFAC00)'
              }} 
            />
            <div>
              <p 
                className="text-2xl font-bold"
                style={{ 
                  color: '#FFAC00',
                  textShadow: '0 0 6px rgba(255, 172, 0, 0.5)'
                }}
              >
                {attentionCount}
              </p>
              <p className="text-sm text-muted-foreground">Requerem Atenção</p>
            </div>
          </div>
        </div>

        {/* Card Acima do Mercado */}
        <div 
          className="p-4 rounded-xl transition-all duration-300 hover:-translate-y-1"
          style={{
            background: '#0a0a0c',
            border: '1px solid rgba(188, 19, 254, 0.4)',
            boxShadow: '0 0 15px rgba(188, 19, 254, 0.15)'
          }}
        >
          <div className="flex items-center gap-3">
            <AlertCircle 
              className="w-8 h-8" 
              style={{ 
                color: '#BC13FE',
                filter: 'drop-shadow(0 0 4px #BC13FE)'
              }} 
            />
            <div>
              <p 
                className="text-2xl font-bold"
                style={{ 
                  color: '#BC13FE',
                  textShadow: '0 0 6px rgba(188, 19, 254, 0.5)'
                }}
              >
                {aboveMarketCount}
              </p>
              <p className="text-sm text-muted-foreground">Acima do Mercado</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pending info */}
      {pendingCount > 0 && (
        <div 
          className="mb-4 p-3 rounded-lg flex items-center gap-2"
          style={{
            background: 'rgba(0, 209, 255, 0.1)',
            border: '1px solid rgba(0, 209, 255, 0.3)'
          }}
        >
          <AlertCircle className="w-4 h-4" style={{ color: '#00D1FF' }} />
          <span className="text-sm" style={{ color: '#00D1FF' }}>
            {pendingCount} produto{pendingCount > 1 ? 's' : ''} sem preço de concorrente informado
          </span>
        </div>
      )}

      {/* Competition Table - Premium Style */}
      <div 
        className="rounded-xl overflow-hidden"
        style={{
          background: '#0a0a0c',
          border: '1px solid rgba(0, 209, 255, 0.3)',
          boxShadow: '0 0 12px rgba(0, 209, 255, 0.1)'
        }}
      >
        <div className="overflow-x-auto -mx-1 px-1 md:mx-0 md:px-0">
          <table className="data-table min-w-[600px] md:min-w-0">
            <thead>
              <tr style={{ background: 'transparent' }}>
                <th style={{ color: '#00D1FF', fontWeight: 700, textShadow: '0 0 6px rgba(0, 209, 255, 0.4)', background: 'transparent' }}>Produto</th>
                <th className="text-right" style={{ color: '#00D1FF', fontWeight: 700, textShadow: '0 0 6px rgba(0, 209, 255, 0.4)', background: 'transparent' }}>Nosso Preço</th>
                <th className="text-right" style={{ color: '#00D1FF', fontWeight: 700, textShadow: '0 0 6px rgba(0, 209, 255, 0.4)', background: 'transparent' }}>Preço Concorrente</th>
                <th className="text-right" style={{ color: '#00D1FF', fontWeight: 700, textShadow: '0 0 6px rgba(0, 209, 255, 0.4)', background: 'transparent' }}>Diferença</th>
                <th style={{ color: '#00D1FF', fontWeight: 700, textShadow: '0 0 6px rgba(0, 209, 255, 0.4)', background: 'transparent' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {competitors.map((competitor) => {
                const statusConfig = getStatusConfig(competitor.status);
                const StatusIcon = statusConfig.icon;
                const hasPrice = competitor.competitorPrice !== null;

                return (
                  <tr 
                    key={competitor.id} 
                    className="transition-all duration-300 hover:bg-white/[0.02]"
                    style={{
                      background: 'transparent',
                      borderBottom: '1px solid rgba(0, 209, 255, 0.1)'
                    }}
                  >
                    <td className="font-medium" style={{ background: 'transparent' }}>{competitor.productName}</td>
                    <td className="text-right mono" style={{ background: 'transparent', color: '#00D1FF' }}>{formatCurrency(competitor.ourPrice)}</td>
                    <td className="text-right" style={{ background: 'transparent' }}>
                      <div className="flex items-center justify-end gap-1">
                        <span className="text-muted-foreground text-xs">R$</span>
                        <Input
                          type="text"
                          inputMode="decimal"
                          placeholder="0,00"
                          className="w-24 h-8 text-right mono bg-transparent border-cyan-500/30 
                                     focus:border-cyan-400 focus:ring-cyan-400/20 text-sm"
                          style={{ 
                            color: hasPrice ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.3)'
                          }}
                          value={getDisplayValue(competitor)}
                          onChange={(e) => handlePriceChange(competitor.productId, e.target.value)}
                          onBlur={() => handlePriceBlur(competitor.productId)}
                          onKeyDown={(e) => handleKeyDown(e, competitor.productId)}
                        />
                      </div>
                    </td>
                    <td className="text-right" style={{ background: 'transparent' }}>
                      {hasPrice ? (
                        <div className="flex items-center justify-end gap-2">
                          {competitor.difference > 0 ? (
                            <TrendingUp 
                              className="w-4 h-4" 
                              style={{ 
                                color: '#BC13FE',
                                filter: 'drop-shadow(0 0 3px #BC13FE)'
                              }} 
                            />
                          ) : competitor.difference < 0 ? (
                            <TrendingDown 
                              className="w-4 h-4" 
                              style={{ 
                                color: '#39FF14',
                                filter: 'drop-shadow(0 0 3px #39FF14)'
                              }} 
                            />
                          ) : (
                            <Minus className="w-4 h-4 text-muted-foreground" />
                          )}
                          <span 
                            className="mono font-medium"
                            style={{
                              color: competitor.difference > 5 ? '#BC13FE' : 
                                     competitor.difference < -5 ? '#39FF14' : 
                                     'rgba(255, 255, 255, 0.5)'
                            }}
                          >
                            {competitor.difference > 0 ? '+' : ''}{competitor.difference.toFixed(1)}%
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-xs italic">Informe o preço</span>
                      )}
                    </td>
                    <td style={{ background: 'transparent' }}>
                      {hasPrice ? (
                        <span 
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                          style={{
                            background: `${statusConfig.color}15`,
                            border: `1px solid ${statusConfig.color}40`,
                            color: statusConfig.color
                          }}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {statusConfig.label}
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-xs italic">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend - Premium Style */}
      <div 
        className="mt-6 p-4 rounded-xl"
        style={{
          background: '#0a0a0c',
          border: '1px solid rgba(0, 209, 255, 0.3)',
          boxShadow: '0 0 10px rgba(0, 209, 255, 0.08)'
        }}
      >
        <h4 
          className="font-medium mb-3"
          style={{ 
            color: '#00D1FF',
            textShadow: '0 0 6px rgba(0, 209, 255, 0.3)'
          }}
        >
          Legenda de Status
        </h4>
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 text-sm">
          {/* LED Verde */}
          <div className="flex items-center gap-3">
            <div 
              className="w-3 h-3 rounded-full"
              style={{
                background: '#39FF14',
                boxShadow: '0 0 6px #39FF14'
              }}
            />
            <span style={{ color: '#39FF14' }}>Competitivo</span>
            <span style={{ color: 'rgba(255, 255, 255, 0.5)' }}>— Igual ou abaixo do mercado</span>
          </div>
          {/* LED Laranja */}
          <div className="flex items-center gap-3">
            <div 
              className="w-3 h-3 rounded-full"
              style={{
                background: '#FFAC00',
                boxShadow: '0 0 6px #FFAC00'
              }}
            />
            <span style={{ color: '#FFAC00' }}>Atenção</span>
            <span style={{ color: 'rgba(255, 255, 255, 0.5)' }}>— Até 5% acima</span>
          </div>
          {/* LED Roxo */}
          <div className="flex items-center gap-3">
            <div 
              className="w-3 h-3 rounded-full"
              style={{
                background: '#BC13FE',
                boxShadow: '0 0 6px #BC13FE'
              }}
            />
            <span style={{ color: '#BC13FE' }}>Acima do Mercado</span>
            <span style={{ color: 'rgba(255, 255, 255, 0.5)' }}>— Mais de 5% acima</span>
          </div>
        </div>
      </div>
    </div>
  );
};

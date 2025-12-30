import { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import { mockCompetitors, Competitor } from '@/data/mockData';

export const CompetitionAnalysis = () => {
  const [competitors] = useState<Competitor[]>(mockCompetitors);

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
          glowColor: 'rgba(57, 255, 20, 0.5)'
        };
      case 'attention':
        return {
          icon: AlertTriangle,
          label: 'Atenção',
          color: '#FFAC00',
          glowColor: 'rgba(255, 172, 0, 0.5)'
        };
      case 'above_market':
        return {
          icon: AlertCircle,
          label: 'Acima do Mercado',
          color: '#FF007A',
          glowColor: 'rgba(255, 0, 122, 0.5)'
        };
    }
  };

  const competitiveCount = competitors.filter(c => c.status === 'competitive').length;
  const attentionCount = competitors.filter(c => c.status === 'attention').length;
  const aboveMarketCount = competitors.filter(c => c.status === 'above_market').length;

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Análise da Concorrência</h2>
          <p className="text-muted-foreground">Compare seus preços com o mercado</p>
        </div>
      </div>

      {/* Summary Cards - Neon Style - Preto Absoluto com Bordas Neon */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Card Competitivo - Verde Neon */}
        <div 
          className="p-4 rounded-xl transition-all duration-300 hover:-translate-y-1"
          style={{
            background: '#000000',
            border: '1px solid #39FF14',
            boxShadow: '0 0 20px rgba(57, 255, 20, 0.4), 0 0 40px rgba(57, 255, 20, 0.2), 0 0 60px rgba(57, 255, 20, 0.1)'
          }}
        >
          <div className="flex items-center gap-3">
            <CheckCircle 
              className="w-8 h-8" 
              style={{ 
                color: '#39FF14',
                filter: 'drop-shadow(0 0 10px #39FF14) drop-shadow(0 0 20px rgba(57, 255, 20, 0.6))'
              }} 
            />
            <div>
              <p 
                className="text-2xl font-bold"
                style={{ 
                  color: '#39FF14',
                  textShadow: '0 0 10px rgba(57, 255, 20, 0.9), 0 0 20px rgba(57, 255, 20, 0.6), 0 0 30px rgba(57, 255, 20, 0.4)'
                }}
              >
                {competitiveCount}
              </p>
              <p className="text-sm text-muted-foreground">Produtos Competitivos</p>
            </div>
          </div>
        </div>

        {/* Card Atenção - Laranja Plasma */}
        <div 
          className="p-4 rounded-xl transition-all duration-300 hover:-translate-y-1"
          style={{
            background: '#000000',
            border: '1px solid #FFAC00',
            boxShadow: '0 0 20px rgba(255, 172, 0, 0.4), 0 0 40px rgba(255, 172, 0, 0.2), 0 0 60px rgba(255, 172, 0, 0.1)'
          }}
        >
          <div className="flex items-center gap-3">
            <AlertTriangle 
              className="w-8 h-8" 
              style={{ 
                color: '#FFAC00',
                filter: 'drop-shadow(0 0 10px #FFAC00) drop-shadow(0 0 20px rgba(255, 172, 0, 0.6))'
              }} 
            />
            <div>
              <p 
                className="text-2xl font-bold"
                style={{ 
                  color: '#FFAC00',
                  textShadow: '0 0 10px rgba(255, 172, 0, 0.9), 0 0 20px rgba(255, 172, 0, 0.6), 0 0 30px rgba(255, 172, 0, 0.4)'
                }}
              >
                {attentionCount}
              </p>
              <p className="text-sm text-muted-foreground">Requerem Atenção</p>
            </div>
          </div>
        </div>

        {/* Card Acima do Mercado - Rosa Pink Shock */}
        <div 
          className="p-4 rounded-xl transition-all duration-300 hover:-translate-y-1"
          style={{
            background: '#000000',
            border: '1px solid #FF007A',
            boxShadow: '0 0 20px rgba(255, 0, 122, 0.4), 0 0 40px rgba(255, 0, 122, 0.2), 0 0 60px rgba(255, 0, 122, 0.1)'
          }}
        >
          <div className="flex items-center gap-3">
            <AlertCircle 
              className="w-8 h-8" 
              style={{ 
                color: '#FF007A',
                filter: 'drop-shadow(0 0 10px #FF007A) drop-shadow(0 0 20px rgba(255, 0, 122, 0.6))'
              }} 
            />
            <div>
              <p 
                className="text-2xl font-bold"
                style={{ 
                  color: '#FF007A',
                  textShadow: '0 0 10px rgba(255, 0, 122, 0.9), 0 0 20px rgba(255, 0, 122, 0.6), 0 0 30px rgba(255, 0, 122, 0.4)'
                }}
              >
                {aboveMarketCount}
              </p>
              <p className="text-sm text-muted-foreground">Acima do Mercado</p>
            </div>
          </div>
        </div>
      </div>

      {/* Competition Table - Neon Style - Preto Absoluto */}
      <div 
        className="rounded-xl overflow-hidden"
        style={{
          background: '#000000',
          border: '1px solid #00D1FF',
          boxShadow: '0 0 20px rgba(0, 209, 255, 0.3), 0 0 40px rgba(0, 209, 255, 0.15)'
        }}
      >
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr style={{ background: 'transparent' }}>
                <th style={{ color: '#00D1FF', fontWeight: 700, textShadow: '0 0 10px rgba(0, 209, 255, 0.8), 0 0 20px rgba(0, 209, 255, 0.5)', background: 'transparent' }}>Produto</th>
                <th className="text-right" style={{ color: '#00D1FF', fontWeight: 700, textShadow: '0 0 10px rgba(0, 209, 255, 0.8), 0 0 20px rgba(0, 209, 255, 0.5)', background: 'transparent' }}>Nosso Preço</th>
                <th className="text-right" style={{ color: '#00D1FF', fontWeight: 700, textShadow: '0 0 10px rgba(0, 209, 255, 0.8), 0 0 20px rgba(0, 209, 255, 0.5)', background: 'transparent' }}>Preço Concorrente</th>
                <th className="text-right" style={{ color: '#00D1FF', fontWeight: 700, textShadow: '0 0 10px rgba(0, 209, 255, 0.8), 0 0 20px rgba(0, 209, 255, 0.5)', background: 'transparent' }}>Diferença</th>
                <th style={{ color: '#00D1FF', fontWeight: 700, textShadow: '0 0 10px rgba(0, 209, 255, 0.8), 0 0 20px rgba(0, 209, 255, 0.5)', background: 'transparent' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {competitors.map((competitor) => {
                const statusConfig = getStatusConfig(competitor.status);
                const StatusIcon = statusConfig.icon;

                return (
                  <tr 
                    key={competitor.id} 
                    className="transition-all duration-300"
                    style={{
                      background: 'transparent',
                      borderBottom: '1px solid rgba(0, 209, 255, 0.1)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = `inset 4px 0 20px ${statusConfig.glowColor}, 0 0 15px ${statusConfig.glowColor}`;
                      e.currentTarget.style.borderLeft = `2px solid ${statusConfig.color}`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.borderLeft = 'none';
                    }}
                  >
                    <td className="font-medium" style={{ background: 'transparent' }}>{competitor.productName}</td>
                    <td className="text-right mono" style={{ background: 'transparent', color: '#00D1FF', textShadow: '0 0 8px rgba(0, 209, 255, 0.5)' }}>{formatCurrency(competitor.ourPrice)}</td>
                    <td className="text-right mono" style={{ background: 'transparent', color: 'rgba(255, 255, 255, 0.5)' }}>{formatCurrency(competitor.competitorPrice)}</td>
                    <td className="text-right" style={{ background: 'transparent' }}>
                      <div className="flex items-center justify-end gap-2">
                        {competitor.difference > 0 ? (
                          <TrendingUp 
                            className="w-4 h-4" 
                            style={{ 
                              color: '#FF007A',
                              filter: 'drop-shadow(0 0 8px #FF007A)'
                            }} 
                          />
                        ) : competitor.difference < 0 ? (
                          <TrendingDown 
                            className="w-4 h-4" 
                            style={{ 
                              color: '#39FF14',
                              filter: 'drop-shadow(0 0 8px #39FF14)'
                            }} 
                          />
                        ) : (
                          <Minus className="w-4 h-4 text-muted-foreground" />
                        )}
                        <span 
                          className="mono font-medium"
                          style={{
                            color: competitor.difference > 5 ? '#FF007A' : 
                                   competitor.difference < -5 ? '#39FF14' : 
                                   'rgba(255, 255, 255, 0.5)',
                            textShadow: competitor.difference > 5 ? '0 0 10px rgba(255, 0, 122, 0.8)' :
                                        competitor.difference < -5 ? '0 0 10px rgba(57, 255, 20, 0.8)' :
                                        'none'
                          }}
                        >
                          {competitor.difference > 0 ? '+' : ''}{competitor.difference.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td style={{ background: 'transparent' }}>
                      <span 
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                        style={{
                          background: 'transparent',
                          border: `1px solid ${statusConfig.color}`,
                          color: statusConfig.color,
                          boxShadow: `0 0 12px ${statusConfig.glowColor}, 0 0 24px ${statusConfig.glowColor}`,
                          textShadow: `0 0 10px ${statusConfig.glowColor}`
                        }}
                      >
                        <StatusIcon 
                          className="w-3 h-3" 
                          style={{ filter: `drop-shadow(0 0 6px ${statusConfig.color})` }}
                        />
                        {statusConfig.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend - LED Style - Preto Absoluto */}
      <div 
        className="mt-6 p-4 rounded-xl"
        style={{
          background: '#000000',
          border: '1px solid #00D1FF',
          boxShadow: '0 0 15px rgba(0, 209, 255, 0.3), 0 0 30px rgba(0, 209, 255, 0.15)'
        }}
      >
        <h4 
          className="font-medium mb-3"
          style={{ 
            color: '#00D1FF',
            textShadow: '0 0 10px rgba(0, 209, 255, 0.8), 0 0 20px rgba(0, 209, 255, 0.5)'
          }}
        >
          Legenda de Status
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          {/* LED Verde */}
          <div className="flex items-center gap-3">
            <div 
              className="w-3 h-3 rounded-full"
              style={{
                background: '#39FF14',
                boxShadow: '0 0 8px #39FF14, 0 0 16px rgba(57, 255, 20, 0.6), 0 0 24px rgba(57, 255, 20, 0.4)'
              }}
            />
            <span style={{ color: '#39FF14', textShadow: '0 0 8px rgba(57, 255, 20, 0.6)' }}>Competitivo</span>
            <span style={{ color: 'rgba(255, 255, 255, 0.4)' }}>— Igual ou abaixo do mercado</span>
          </div>
          {/* LED Laranja */}
          <div className="flex items-center gap-3">
            <div 
              className="w-3 h-3 rounded-full"
              style={{
                background: '#FFAC00',
                boxShadow: '0 0 8px #FFAC00, 0 0 16px rgba(255, 172, 0, 0.6), 0 0 24px rgba(255, 172, 0, 0.4)'
              }}
            />
            <span style={{ color: '#FFAC00', textShadow: '0 0 8px rgba(255, 172, 0, 0.6)' }}>Atenção</span>
            <span style={{ color: 'rgba(255, 255, 255, 0.4)' }}>— Até 10% acima</span>
          </div>
          {/* LED Rosa */}
          <div className="flex items-center gap-3">
            <div 
              className="w-3 h-3 rounded-full"
              style={{
                background: '#FF007A',
                boxShadow: '0 0 8px #FF007A, 0 0 16px rgba(255, 0, 122, 0.6), 0 0 24px rgba(255, 0, 122, 0.4)'
              }}
            />
            <span style={{ color: '#FF007A', textShadow: '0 0 8px rgba(255, 0, 122, 0.6)' }}>Acima do Mercado</span>
            <span style={{ color: 'rgba(255, 255, 255, 0.4)' }}>— Mais de 10% acima</span>
          </div>
        </div>
      </div>
    </div>
  );
};

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

      {/* Summary Cards - Neon Style */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Card Competitivo - Verde Neon */}
        <div 
          className="p-4 rounded-xl transition-all duration-300 hover:-translate-y-1"
          style={{
            background: '#1E293B',
            border: '1px solid #39FF14',
            boxShadow: '0 0 20px rgba(57, 255, 20, 0.3), inset 0 0 30px rgba(0, 0, 0, 0.5)'
          }}
        >
          <div className="flex items-center gap-3">
            <CheckCircle 
              className="w-8 h-8" 
              style={{ 
                color: '#39FF14',
                filter: 'drop-shadow(0 0 10px #39FF14)'
              }} 
            />
            <div>
              <p 
                className="text-2xl font-bold"
                style={{ 
                  color: '#39FF14',
                  textShadow: '0 0 15px rgba(57, 255, 20, 0.8)'
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
            background: '#1E293B',
            border: '1px solid #FFAC00',
            boxShadow: '0 0 20px rgba(255, 172, 0, 0.3), inset 0 0 30px rgba(0, 0, 0, 0.5)'
          }}
        >
          <div className="flex items-center gap-3">
            <AlertTriangle 
              className="w-8 h-8" 
              style={{ 
                color: '#FFAC00',
                filter: 'drop-shadow(0 0 10px #FFAC00)'
              }} 
            />
            <div>
              <p 
                className="text-2xl font-bold"
                style={{ 
                  color: '#FFAC00',
                  textShadow: '0 0 15px rgba(255, 172, 0, 0.8)'
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
            background: '#1E293B',
            border: '1px solid #FF007A',
            boxShadow: '0 0 20px rgba(255, 0, 122, 0.3), inset 0 0 30px rgba(0, 0, 0, 0.5)'
          }}
        >
          <div className="flex items-center gap-3">
            <AlertCircle 
              className="w-8 h-8" 
              style={{ 
                color: '#FF007A',
                filter: 'drop-shadow(0 0 10px #FF007A)'
              }} 
            />
            <div>
              <p 
                className="text-2xl font-bold"
                style={{ 
                  color: '#FF007A',
                  textShadow: '0 0 15px rgba(255, 0, 122, 0.8)'
                }}
              >
                {aboveMarketCount}
              </p>
              <p className="text-sm text-muted-foreground">Acima do Mercado</p>
            </div>
          </div>
        </div>
      </div>

      {/* Competition Table - Neon Style */}
      <div 
        className="rounded-xl overflow-hidden"
        style={{
          background: '#1E293B',
          border: '1px solid rgba(0, 209, 255, 0.3)',
          boxShadow: '0 0 30px rgba(0, 209, 255, 0.1)'
        }}
      >
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ color: '#00D1FF', fontWeight: 700, textShadow: '0 0 10px rgba(0, 209, 255, 0.5)' }}>Produto</th>
                <th className="text-right" style={{ color: '#00D1FF', fontWeight: 700, textShadow: '0 0 10px rgba(0, 209, 255, 0.5)' }}>Nosso Preço</th>
                <th className="text-right" style={{ color: '#00D1FF', fontWeight: 700, textShadow: '0 0 10px rgba(0, 209, 255, 0.5)' }}>Preço Concorrente</th>
                <th className="text-right" style={{ color: '#00D1FF', fontWeight: 700, textShadow: '0 0 10px rgba(0, 209, 255, 0.5)' }}>Diferença</th>
                <th style={{ color: '#00D1FF', fontWeight: 700, textShadow: '0 0 10px rgba(0, 209, 255, 0.5)' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {competitors.map((competitor) => {
                const statusConfig = getStatusConfig(competitor.status);
                const StatusIcon = statusConfig.icon;

                return (
                  <tr 
                    key={competitor.id} 
                    className="transition-all duration-300 hover:bg-white/5"
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                      borderLeft: `3px solid ${statusConfig.color}`
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = `inset 4px 0 15px ${statusConfig.glowColor}`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <td className="font-medium">{competitor.productName}</td>
                    <td className="text-right mono">{formatCurrency(competitor.ourPrice)}</td>
                    <td className="text-right mono text-muted-foreground">{formatCurrency(competitor.competitorPrice)}</td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {competitor.difference > 0 ? (
                          <TrendingUp 
                            className="w-4 h-4" 
                            style={{ 
                              color: '#FF007A',
                              filter: 'drop-shadow(0 0 5px #FF007A)'
                            }} 
                          />
                        ) : competitor.difference < 0 ? (
                          <TrendingDown 
                            className="w-4 h-4" 
                            style={{ 
                              color: '#39FF14',
                              filter: 'drop-shadow(0 0 5px #39FF14)'
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
                                   '#94a3b8',
                            textShadow: competitor.difference > 5 ? '0 0 10px rgba(255, 0, 122, 0.6)' :
                                        competitor.difference < -5 ? '0 0 10px rgba(57, 255, 20, 0.6)' :
                                        'none'
                          }}
                        >
                          {competitor.difference > 0 ? '+' : ''}{competitor.difference.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td>
                      <span 
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                        style={{
                          background: 'transparent',
                          border: `1px solid ${statusConfig.color}`,
                          color: statusConfig.color,
                          boxShadow: `0 0 10px ${statusConfig.glowColor}`,
                          textShadow: `0 0 8px ${statusConfig.glowColor}`
                        }}
                      >
                        <StatusIcon 
                          className="w-3 h-3" 
                          style={{ filter: `drop-shadow(0 0 5px ${statusConfig.color})` }}
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

      {/* Legend - LED Style */}
      <div 
        className="mt-6 p-4 rounded-xl"
        style={{
          background: '#1E293B',
          border: '1px solid rgba(0, 209, 255, 0.2)',
          boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)'
        }}
      >
        <h4 
          className="font-medium mb-3"
          style={{ 
            color: '#00D1FF',
            textShadow: '0 0 10px rgba(0, 209, 255, 0.5)'
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
                boxShadow: '0 0 10px #39FF14, 0 0 20px rgba(57, 255, 20, 0.5)'
              }}
            />
            <span style={{ color: '#39FF14' }}>Competitivo</span>
            <span className="text-muted-foreground">— Igual ou abaixo do mercado</span>
          </div>
          {/* LED Laranja */}
          <div className="flex items-center gap-3">
            <div 
              className="w-3 h-3 rounded-full"
              style={{
                background: '#FFAC00',
                boxShadow: '0 0 10px #FFAC00, 0 0 20px rgba(255, 172, 0, 0.5)'
              }}
            />
            <span style={{ color: '#FFAC00' }}>Atenção</span>
            <span className="text-muted-foreground">— Até 10% acima</span>
          </div>
          {/* LED Rosa */}
          <div className="flex items-center gap-3">
            <div 
              className="w-3 h-3 rounded-full"
              style={{
                background: '#FF007A',
                boxShadow: '0 0 10px #FF007A, 0 0 20px rgba(255, 0, 122, 0.5)'
              }}
            />
            <span style={{ color: '#FF007A' }}>Acima do Mercado</span>
            <span className="text-muted-foreground">— Mais de 10% acima</span>
          </div>
        </div>
      </div>
    </div>
  );
};

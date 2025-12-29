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
          class: 'status-success',
          bgClass: 'bg-success/5 border-success/20',
        };
      case 'attention':
        return {
          icon: AlertTriangle,
          label: 'Atenção',
          class: 'status-warning',
          bgClass: 'bg-warning/5 border-warning/20',
        };
      case 'above_market':
        return {
          icon: AlertCircle,
          label: 'Acima do Mercado',
          class: 'status-danger',
          bgClass: 'bg-danger/5 border-danger/20',
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="kpi-card border-l-4 border-l-success">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-success" />
            <div>
              <p className="text-2xl font-bold text-foreground">{competitiveCount}</p>
              <p className="text-sm text-muted-foreground">Produtos Competitivos</p>
            </div>
          </div>
        </div>
        <div className="kpi-card border-l-4 border-l-warning">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-warning" />
            <div>
              <p className="text-2xl font-bold text-foreground">{attentionCount}</p>
              <p className="text-sm text-muted-foreground">Requerem Atenção</p>
            </div>
          </div>
        </div>
        <div className="kpi-card border-l-4 border-l-danger">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-8 h-8 text-danger" />
            <div>
              <p className="text-2xl font-bold text-foreground">{aboveMarketCount}</p>
              <p className="text-sm text-muted-foreground">Acima do Mercado</p>
            </div>
          </div>
        </div>
      </div>

      {/* Competition Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Produto</th>
                <th className="text-right">Nosso Preço</th>
                <th className="text-right">Preço Concorrente</th>
                <th className="text-right">Diferença</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {competitors.map((competitor) => {
                const statusConfig = getStatusConfig(competitor.status);
                const StatusIcon = statusConfig.icon;

                return (
                  <tr key={competitor.id} className={`border-l-4 ${
                    competitor.status === 'competitive' ? 'border-l-success' :
                    competitor.status === 'attention' ? 'border-l-warning' :
                    'border-l-danger'
                  }`}>
                    <td className="font-medium">{competitor.productName}</td>
                    <td className="text-right mono">{formatCurrency(competitor.ourPrice)}</td>
                    <td className="text-right mono text-muted-foreground">{formatCurrency(competitor.competitorPrice)}</td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {competitor.difference > 0 ? (
                          <TrendingUp className="w-4 h-4 text-danger" />
                        ) : competitor.difference < 0 ? (
                          <TrendingDown className="w-4 h-4 text-success" />
                        ) : (
                          <Minus className="w-4 h-4 text-muted-foreground" />
                        )}
                        <span className={`mono font-medium ${
                          competitor.difference > 5 ? 'text-danger' :
                          competitor.difference < -5 ? 'text-success' :
                          'text-muted-foreground'
                        }`}>
                          {competitor.difference > 0 ? '+' : ''}{competitor.difference.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge ${statusConfig.class}`}>
                        <StatusIcon className="w-3 h-3" />
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

      {/* Legend */}
      <div className="mt-6 p-4 rounded-xl bg-card border border-border">
        <h4 className="font-medium text-foreground mb-3">Legenda de Status</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="status-badge status-success">
              <CheckCircle className="w-3 h-3" />
              Competitivo
            </span>
            <span className="text-muted-foreground">Preço igual ou abaixo do mercado</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="status-badge status-warning">
              <AlertTriangle className="w-3 h-3" />
              Atenção
            </span>
            <span className="text-muted-foreground">Até 10% acima do mercado</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="status-badge status-danger">
              <AlertCircle className="w-3 h-3" />
              Acima do Mercado
            </span>
            <span className="text-muted-foreground">Mais de 10% acima</span>
          </div>
        </div>
      </div>
    </div>
  );
};

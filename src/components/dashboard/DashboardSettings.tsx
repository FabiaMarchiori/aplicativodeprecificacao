import { X, Check } from 'lucide-react';
import { DashboardConfig } from '@/types/dashboard';
import { Checkbox } from '@/components/ui/checkbox';

interface DashboardSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  config: DashboardConfig;
  onSave: (config: DashboardConfig) => void;
}

const KPI_LABELS = {
  revenue: 'Faturamento Estimado',
  margin: 'Margem Média',
  profit: 'Lucro Total',
  mostProfitable: 'Produto Mais Lucrativo',
  lowestMargin: 'Menor Margem',
};

const CHART_LABELS = {
  revenueEvolution: 'Evolução do Faturamento',
  costComposition: 'Composição de Custos',
  marginByProduct: 'Margem por Produto',
  profitRanking: 'Ranking de Lucro',
};

export const DashboardSettings = ({ isOpen, onClose, config, onSave }: DashboardSettingsProps) => {
  if (!isOpen) return null;

  const handleKPIChange = (key: keyof typeof config.visibleKPIs) => {
    const newConfig = {
      ...config,
      visibleKPIs: {
        ...config.visibleKPIs,
        [key]: !config.visibleKPIs[key],
      },
    };
    onSave(newConfig);
  };

  const handleChartChange = (key: keyof typeof config.visibleCharts) => {
    const newConfig = {
      ...config,
      visibleCharts: {
        ...config.visibleCharts,
        [key]: !config.visibleCharts[key],
      },
    };
    onSave(newConfig);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in"
      style={{
        background: 'rgba(0, 0, 0, 0.9)',
        backdropFilter: 'blur(10px)',
      }}
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg rounded-2xl p-6 animate-slide-up mx-4"
        style={{
          background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.98) 0%, rgba(10, 10, 20, 0.98) 100%)',
          border: '1px solid rgba(0, 209, 255, 0.4)',
          boxShadow: '0 0 40px rgba(0, 209, 255, 0.25), 0 0 80px rgba(0, 209, 255, 0.1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4" style={{ borderBottom: '1px solid rgba(0, 209, 255, 0.2)' }}>
          <h2 
            className="text-xl font-bold"
            style={{ 
              color: '#F8FAFC',
              textShadow: '0 0 15px rgba(248, 250, 252, 0.3)'
            }}
          >
            Personalizar Dashboard
          </h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg transition-all duration-300"
            style={{
              background: 'rgba(0, 209, 255, 0.1)',
              border: '1px solid rgba(0, 209, 255, 0.3)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 209, 255, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '';
            }}
          >
            <X 
              className="w-5 h-5"
              style={{ 
                color: '#00D1FF',
                filter: 'drop-shadow(0 0 6px rgba(0, 209, 255, 0.8))'
              }}
            />
          </button>
        </div>

        {/* KPIs Section */}
        <div className="mb-6">
          <h3 
            className="text-sm font-semibold uppercase tracking-wider mb-4"
            style={{ 
              color: '#00D1FF',
              textShadow: '0 0 10px rgba(0, 209, 255, 0.5)'
            }}
          >
            Indicadores (KPIs)
          </h3>
          <div className="space-y-3">
            {(Object.keys(KPI_LABELS) as Array<keyof typeof KPI_LABELS>).map((key) => (
              <label 
                key={key} 
                className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200"
                style={{
                  background: config.visibleKPIs[key] ? 'rgba(0, 209, 255, 0.08)' : 'transparent',
                  border: `1px solid ${config.visibleKPIs[key] ? 'rgba(0, 209, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`,
                }}
              >
                <Checkbox 
                  checked={config.visibleKPIs[key]}
                  onCheckedChange={() => handleKPIChange(key)}
                  className="border-[hsl(var(--color-cyan))] data-[state=checked]:bg-[hsl(var(--color-cyan))] data-[state=checked]:border-[hsl(var(--color-cyan))]"
                />
                <span className="text-foreground text-sm">{KPI_LABELS[key]}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Charts Section */}
        <div className="mb-6">
          <h3 
            className="text-sm font-semibold uppercase tracking-wider mb-4"
            style={{ 
              color: '#39FF14',
              textShadow: '0 0 10px rgba(57, 255, 20, 0.5)'
            }}
          >
            Gráficos
          </h3>
          <div className="space-y-3">
            {(Object.keys(CHART_LABELS) as Array<keyof typeof CHART_LABELS>).map((key) => (
              <label 
                key={key} 
                className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200"
                style={{
                  background: config.visibleCharts[key] ? 'rgba(57, 255, 20, 0.08)' : 'transparent',
                  border: `1px solid ${config.visibleCharts[key] ? 'rgba(57, 255, 20, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`,
                }}
              >
                <Checkbox 
                  checked={config.visibleCharts[key]}
                  onCheckedChange={() => handleChartChange(key)}
                  className="border-[hsl(var(--color-green))] data-[state=checked]:bg-[hsl(var(--color-green))] data-[state=checked]:border-[hsl(var(--color-green))]"
                />
                <span className="text-foreground text-sm">{CHART_LABELS[key]}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div 
          className="flex justify-end gap-3 pt-4"
          style={{ borderTop: '1px solid rgba(0, 209, 255, 0.2)' }}
        >
          <button 
            onClick={onClose}
            className="px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
            style={{
              background: 'rgba(57, 255, 20, 0.1)',
              border: '1px solid #39FF14',
              color: '#39FF14',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 20px rgba(57, 255, 20, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '';
            }}
          >
            <Check className="w-4 h-4" />
            Concluído
          </button>
        </div>
      </div>
    </div>
  );
};

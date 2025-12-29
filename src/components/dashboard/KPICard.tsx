import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon: React.ElementType;
  variant?: 'blue' | 'teal' | 'green' | 'gold' | 'orange';
}

export const KPICard = ({ 
  title, 
  value, 
  subtitle, 
  trend, 
  trendValue, 
  icon: Icon,
  variant = 'blue' 
}: KPICardProps) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-success" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-danger" />;
      default:
        return <Minus className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getIconClass = () => {
    switch (variant) {
      case 'teal':
        return 'icon-teal';
      case 'green':
        return 'icon-green';
      case 'gold':
        return 'icon-gold';
      case 'orange':
        return 'icon-orange';
      default:
        return 'icon-blue';
    }
  };

  const getCardClass = () => {
    switch (variant) {
      case 'teal':
        return 'kpi-teal';
      case 'green':
        return 'kpi-green';
      case 'gold':
        return 'kpi-gold';
      case 'orange':
        return 'kpi-orange';
      default:
        return 'kpi-blue';
    }
  };

  return (
    <div className={`kpi-card animate-fade-in ${getCardClass()}`}>
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className={`kpi-icon ${getIconClass()}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          {trend && trendValue && (
            <div className="flex items-center gap-1.5 text-sm bg-background/30 px-2 py-1 rounded-lg">
              {getTrendIcon()}
              <span className={`font-semibold ${
                trend === 'up' ? 'text-success' : 
                trend === 'down' ? 'text-danger' : 
                'text-muted-foreground'
              }`}>
                {trendValue}
              </span>
            </div>
          )}
        </div>
        
        <h3 className="text-sm font-medium text-muted-foreground mb-1 uppercase tracking-wide">{title}</h3>
        <p className="text-2xl lg:text-3xl font-bold text-foreground mono truncate" title={value}>{value}</p>
        
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-2 truncate" title={subtitle}>{subtitle}</p>
        )}
      </div>
    </div>
  );
};
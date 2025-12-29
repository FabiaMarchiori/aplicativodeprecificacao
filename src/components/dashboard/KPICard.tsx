import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon: React.ElementType;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

export const KPICard = ({ 
  title, 
  value, 
  subtitle, 
  trend, 
  trendValue, 
  icon: Icon,
  variant = 'default' 
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

  const getVariantClasses = () => {
    switch (variant) {
      case 'success':
        return 'border-l-4 border-l-success';
      case 'warning':
        return 'border-l-4 border-l-warning';
      case 'danger':
        return 'border-l-4 border-l-danger';
      default:
        return 'border-l-4 border-l-primary';
    }
  };

  return (
    <div className={`kpi-card animate-fade-in ${getVariantClasses()}`}>
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="p-2.5 rounded-xl bg-primary/20">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          {trend && trendValue && (
            <div className="flex items-center gap-1.5 text-sm">
              {getTrendIcon()}
              <span className={`font-medium ${
                trend === 'up' ? 'text-success' : 
                trend === 'down' ? 'text-danger' : 
                'text-muted-foreground'
              }`}>
                {trendValue}
              </span>
            </div>
          )}
        </div>
        
        <h3 className="text-sm font-medium text-muted-foreground mb-1">{title}</h3>
        <p className="text-2xl lg:text-3xl font-bold text-foreground mono">{value}</p>
        
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-2">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

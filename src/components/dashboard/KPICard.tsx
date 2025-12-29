import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon: React.ElementType;
  variant?: 'blue' | 'orange' | 'green' | 'cyan' | 'pink';
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
        return <TrendingUp className="w-4 h-4 text-white" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-white" />;
      default:
        return <Minus className="w-4 h-4 text-white" />;
    }
  };

  const getIconClass = () => {
    switch (variant) {
      case 'orange':
        return 'icon-orange';
      case 'green':
        return 'icon-green';
      case 'cyan':
        return 'icon-cyan';
      case 'pink':
        return 'icon-pink';
      default:
        return 'icon-blue';
    }
  };

  const getCardClass = () => {
    switch (variant) {
      case 'orange':
        return 'kpi-orange';
      case 'green':
        return 'kpi-green';
      case 'cyan':
        return 'kpi-cyan';
      case 'pink':
        return 'kpi-pink';
      default:
        return 'kpi-blue';
    }
  };

  return (
    <div className={`kpi-card animate-fade-in ${getCardClass()}`}>
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className={`kpi-icon ${getIconClass()}`}>
            <Icon className="w-7 h-7 text-white" />
          </div>
          {trend && trendValue && (
            <div className="flex items-center gap-1.5 text-sm bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
              {getTrendIcon()}
              <span className="font-bold text-white">
                {trendValue}
              </span>
            </div>
          )}
        </div>
        
        <h3 className="kpi-title mb-2">{title}</h3>
        <p className="kpi-value mono truncate" title={value}>{value}</p>
        
        {subtitle && (
          <p className="kpi-subtitle mt-2 truncate" title={subtitle}>{subtitle}</p>
        )}
      </div>
    </div>
  );
};

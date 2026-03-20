import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon: React.ElementType;
  variant?: 'blue' | 'orange' | 'green' | 'cyan' | 'pink' | 'purple';
}

export const KPICard = ({ 
  title, value, subtitle, trend, trendValue, icon: Icon, variant = 'blue' 
}: KPICardProps) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-3 h-3" />;
      case 'down': return <TrendingDown className="w-3 h-3" />;
      default: return <Minus className="w-3 h-3" />;
    }
  };

  const variantMap: Record<string, string> = {
    blue: 'kpi-blue', cyan: 'kpi-cyan', green: 'kpi-green',
    orange: 'kpi-orange', pink: 'kpi-pink', purple: 'kpi-purple',
  };
  const iconMap: Record<string, string> = {
    blue: 'icon-blue', cyan: 'icon-cyan', green: 'icon-green',
    orange: 'icon-orange', pink: 'icon-pink', purple: 'icon-purple',
  };

  return (
    <div className={`kpi-card animate-fade-in ${variantMap[variant]}`}>
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className={`kpi-icon ${iconMap[variant]}`}>
            <Icon />
          </div>
          {trend && trendValue && (
            <div className="flex items-center gap-1 text-[11px] px-2 py-1 rounded-md"
              style={{ 
                background: trend === 'up' ? 'hsl(152 60% 48% / 0.1)' : trend === 'down' ? 'hsl(0 70% 55% / 0.1)' : 'hsl(225 14% 14%)',
                color: trend === 'up' ? 'hsl(152 60% 48%)' : trend === 'down' ? 'hsl(0 70% 55%)' : 'hsl(215 10% 55%)',
              }}
            >
              {getTrendIcon()}
              <span className="font-semibold tabular-nums">{trendValue}</span>
            </div>
          )}
        </div>
        
        <p className="kpi-title mb-1.5">{title}</p>
        <p className="kpi-value mono" title={value}
          style={{
            lineHeight: '1.2',
            fontSize: value.length > 14 ? 'clamp(0.85rem, 2.5vw, 1rem)' : undefined,
          }}
        >
          {value}
        </p>
        
        {subtitle && (
          <p className="kpi-subtitle mt-2 truncate" title={subtitle}>{subtitle}</p>
        )}
      </div>
    </div>
  );
};

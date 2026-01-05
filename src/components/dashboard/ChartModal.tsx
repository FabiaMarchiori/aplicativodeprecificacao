import { X } from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  Area,
  AreaChart,
  LabelList
} from 'recharts';
import { useIsMobile } from '@/hooks/use-mobile';
import { ChartType } from '@/types/dashboard';

interface ChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  chartType: ChartType;
  title: string;
  productMargins: Array<{ name: string; margin: number; profit: number }>;
  costComposition: Array<{ name: string; value: number }>;
  revenueData: Array<{ month: string; revenue: number; profit: number }>;
}

const PIE_COLORS = [
  '#BC13FE', // Roxo Neon
  '#39FF14', // Verde Neon
  '#F29A1B', // Laranja
  '#0ABCE8', // Ciano
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

export const ChartModal = ({ 
  isOpen, 
  onClose, 
  chartType, 
  title,
  productMargins,
  costComposition,
  revenueData
}: ChartModalProps) => {
  const isMobile = useIsMobile();
  
  if (!isOpen) return null;

  const sortedProfits = [...productMargins].sort((a, b) => b.profit - a.profit);
  
  // Mobile optimized data with truncated names
  const mobileMargins = productMargins.map(p => ({
    ...p,
    name: p.name.length > 12 ? p.name.substring(0, 12) + '...' : p.name
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div 
          className="backdrop-blur-lg rounded-xl p-4 shadow-lg"
          style={{
            background: 'rgba(0, 0, 0, 0.95)',
            border: '1px solid rgba(0, 209, 255, 0.5)',
            boxShadow: '0 0 30px rgba(0, 209, 255, 0.3)'
          }}
        >
          <p className="text-sm font-semibold text-foreground mb-3">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-3 text-sm mb-1">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color, boxShadow: `0 0 10px ${entry.color}` }}
              />
              <span className="text-muted-foreground">{entry.name}:</span>
              <span className="font-bold" style={{ color: entry.color, textShadow: `0 0 12px ${entry.color}` }}>
                {formatCurrency(entry.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const color = payload[0].payload.fill;
      return (
        <div 
          className="backdrop-blur-lg rounded-xl p-4 shadow-lg"
          style={{
            background: 'rgba(0, 0, 0, 0.95)',
            border: `1px solid ${color}`,
            boxShadow: `0 0 20px ${color}50`
          }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-4 h-4 rounded-full" 
              style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }}
            />
            <span className="text-foreground font-medium text-base">{payload[0].name}</span>
            <span className="font-bold text-lg" style={{ color: color, textShadow: `0 0 12px ${color}` }}>
              {payload[0].value}%
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    switch (chartType) {
      case 'revenue':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="neonRevenueModal" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0%" stopColor="#00D1FF" stopOpacity={0}/>
                  <stop offset="50%" stopColor="#00D1FF" stopOpacity={0.4}/>
                  <stop offset="100%" stopColor="#00D1FF" stopOpacity={0.8}/>
                </linearGradient>
                <linearGradient id="neonProfitModal" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0%" stopColor="#39FF14" stopOpacity={0}/>
                  <stop offset="50%" stopColor="#39FF14" stopOpacity={0.4}/>
                  <stop offset="100%" stopColor="#39FF14" stopOpacity={0.8}/>
                </linearGradient>
                <filter id="glowCyanModal" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
                <filter id="glowGreenModal" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.15)" />
              <XAxis 
                dataKey="month" 
                stroke="rgba(255,255,255,0.6)"
                fontSize={14}
                tickLine={false}
              />
              <YAxis 
                stroke="rgba(255,255,255,0.6)"
                fontSize={14}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                tickLine={false}
                axisLine={false}
                width={60}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#00D1FF"
                strokeWidth={4}
                fillOpacity={1}
                fill="url(#neonRevenueModal)"
                name="Faturamento"
                filter="url(#glowCyanModal)"
              />
              <Area
                type="monotone"
                dataKey="profit"
                stroke="#39FF14"
                strokeWidth={4}
                fillOpacity={1}
                fill="url(#neonProfitModal)"
                name="Lucro"
                filter="url(#glowGreenModal)"
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'costs':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={costComposition}
                cx="50%"
                cy="50%"
                innerRadius="40%"
                outerRadius="70%"
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {costComposition.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={PIE_COLORS[index % PIE_COLORS.length]}
                    style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomPieTooltip />} />
              <Legend 
                wrapperStyle={{ fontSize: '14px', paddingTop: '20px' }}
                formatter={(value) => <span style={{ color: '#FFFFFF', fontWeight: 500 }}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'margin':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={isMobile ? mobileMargins : productMargins} 
              layout="vertical"
              margin={isMobile 
                ? { top: 10, right: 40, left: 0, bottom: 10 } 
                : { top: 20, right: 40, left: 10, bottom: 20 }
              }
            >
              <defs>
                <linearGradient id="marginGradientModal" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#BC13FE" stopOpacity={1}/>
                  <stop offset="100%" stopColor="#00D1FF" stopOpacity={1}/>
                </linearGradient>
                <filter id="barHoverGlowModal" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur"/>
                  <feMerge>
                    <feMergeNode in="blur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" horizontal={false} />
              <XAxis 
                type="number" 
                stroke="#FFFFFF"
                tick={{ fill: '#FFFFFF' }}
                fontSize={isMobile ? 10 : 14}
                tickFormatter={(value) => `${value}%`}
                tickLine={false}
              />
              <YAxis 
                type="category" 
                dataKey="name" 
                stroke="#FFFFFF"
                fontSize={isMobile ? 9 : 12}
                width={isMobile ? 80 : 120}
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#FFFFFF' }}
              />
              <Tooltip 
                formatter={(value: number) => [`${value}%`, 'Margem']}
                contentStyle={{
                  backgroundColor: 'hsl(234, 35%, 12%)',
                  border: '1px solid hsl(234, 25%, 28%)',
                  borderRadius: '12px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                }}
                labelStyle={{ color: '#FFFFFF', fontWeight: 600 }}
                itemStyle={{ color: '#FFFFFF' }}
                cursor={false}
              />
              <Bar 
                dataKey="margin" 
                fill="url(#marginGradientModal)"
                radius={[0, 6, 6, 0]}
                name="Margem"
                activeBar={{
                  fill: "url(#marginGradientModal)",
                  filter: "url(#barHoverGlowModal)",
                  fillOpacity: 1,
                  stroke: "rgba(0, 209, 255, 0.6)",
                  strokeWidth: 1
                }}
              >
                <LabelList 
                  dataKey="margin" 
                  position="insideRight"
                  formatter={(value: number) => `${value}%`}
                  style={{ 
                    fill: '#FFFFFF', 
                    fontSize: isMobile ? 9 : 12,
                    fontWeight: 600,
                    textShadow: '0 0 4px rgba(0,0,0,0.8)'
                  }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );

      case 'profit':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sortedProfits}>
              <defs>
                <linearGradient id="profitGradientModal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#BC13FE" stopOpacity={1}/>
                  <stop offset="100%" stopColor="#00D1FF" stopOpacity={1}/>
                </linearGradient>
                <filter id="barHoverGlowModal" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur"/>
                  <feMerge>
                    <feMergeNode in="blur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="#FFFFFF"
                tick={{ fill: '#FFFFFF' }}
                fontSize={12}
                angle={-20}
                textAnchor="end"
                height={80}
                tickLine={false}
                interval={0}
              />
              <YAxis 
                stroke="#FFFFFF"
                tick={{ fill: '#FFFFFF' }}
                fontSize={14}
                tickFormatter={(value) => `R$${value}`}
                tickLine={false}
                axisLine={false}
                width={70}
              />
              <Tooltip 
                formatter={(value: number) => [formatCurrency(value), 'Lucro/Un']}
                contentStyle={{
                  backgroundColor: 'hsl(234, 35%, 12%)',
                  border: '1px solid hsl(234, 25%, 28%)',
                  borderRadius: '12px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                }}
                labelStyle={{ color: '#FFFFFF', fontWeight: 600 }}
                itemStyle={{ color: '#FFFFFF' }}
                cursor={false}
              />
              <Bar 
                dataKey="profit" 
                fill="url(#profitGradientModal)"
                radius={[6, 6, 0, 0]}
                name="Lucro/Un"
                activeBar={{
                  fill: "url(#profitGradientModal)",
                  filter: "url(#barHoverGlowModal)",
                  fillOpacity: 1,
                  stroke: "rgba(188, 19, 254, 0.6)",
                  strokeWidth: 1
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in"
      style={{
        background: 'rgba(0, 0, 0, 0.95)',
        backdropFilter: 'blur(10px)',
      }}
      onClick={onClose}
    >
      <div 
        className={`relative w-[95vw] h-[90vh] rounded-2xl animate-slide-up ${isMobile ? 'p-3' : 'p-6'}`}
        style={{
          background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.98) 0%, rgba(10, 10, 20, 0.98) 100%)',
          border: '1px solid rgba(0, 209, 255, 0.4)',
          boxShadow: '0 0 60px rgba(0, 209, 255, 0.3), 0 0 120px rgba(0, 209, 255, 0.15)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`flex items-center justify-between ${isMobile ? 'mb-3' : 'mb-6'}`}>
          <h2 
            className={`font-bold ${isMobile ? 'text-lg' : 'text-2xl'}`}
            style={{ 
              color: '#F8FAFC',
              textShadow: '0 0 20px rgba(248, 250, 252, 0.4)'
            }}
          >
            {title}
          </h2>
          <button 
            onClick={onClose}
            className="p-3 rounded-xl transition-all duration-300"
            style={{
              background: 'rgba(0, 209, 255, 0.1)',
              border: '1px solid rgba(0, 209, 255, 0.3)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 209, 255, 0.5)';
              e.currentTarget.style.borderColor = '#00D1FF';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '';
              e.currentTarget.style.borderColor = 'rgba(0, 209, 255, 0.3)';
            }}
          >
            <X 
              className="w-6 h-6"
              style={{ 
                color: '#00D1FF',
                filter: 'drop-shadow(0 0 8px rgba(0, 209, 255, 0.8))'
              }}
            />
          </button>
        </div>

        {/* Chart Container */}
        <div className={isMobile ? "h-[calc(100%-50px)]" : "h-[calc(100%-80px)]"}>
          {renderChart()}
        </div>
      </div>
    </div>
  );
};

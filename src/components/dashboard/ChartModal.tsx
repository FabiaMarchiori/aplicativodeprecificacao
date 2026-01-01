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
  AreaChart
} from 'recharts';
import { ChartType } from '@/types/dashboard';
import { 
  mockRevenueData, 
  productMargins, 
  costComposition 
} from '@/data/mockData';

interface ChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  chartType: ChartType;
  title: string;
}

const PIE_COLORS = [
  '#FF007A',
  '#39FF14',
  '#FFAC00',
  '#00D1FF',
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

export const ChartModal = ({ isOpen, onClose, chartType, title }: ChartModalProps) => {
  if (!isOpen) return null;

  const sortedProfits = [...productMargins].sort((a, b) => b.profit - a.profit);

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
            <AreaChart data={mockRevenueData}>
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
                innerRadius="35%"
                outerRadius="65%"
                paddingAngle={4}
                dataKey="value"
                stroke="none"
                label={({ name, value }) => `${name}: ${value}%`}
                labelLine={{ stroke: 'rgba(255,255,255,0.3)', strokeWidth: 1 }}
              >
                {costComposition.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={PIE_COLORS[index % PIE_COLORS.length]}
                    style={{ filter: `drop-shadow(0 0 15px ${PIE_COLORS[index % PIE_COLORS.length]}50)` }}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomPieTooltip />} />
              <Legend 
                wrapperStyle={{ fontSize: '14px', paddingTop: '20px' }}
                formatter={(value) => <span className="text-foreground font-medium">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'margin':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={productMargins} layout="vertical">
              <defs>
                <linearGradient id="marginGradientModal" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#FF007A" stopOpacity={1}/>
                  <stop offset="100%" stopColor="#00D1FF" stopOpacity={1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.15)" horizontal={false} />
              <XAxis 
                type="number" 
                stroke="rgba(255,255,255,0.6)"
                fontSize={14}
                tickFormatter={(value) => `${value}%`}
                tickLine={false}
              />
              <YAxis 
                type="category" 
                dataKey="name" 
                stroke="rgba(255,255,255,0.6)"
                fontSize={12}
                width={120}
                tickLine={false}
                axisLine={false}
                tick={{ fill: 'rgba(255,255,255,0.8)' }}
              />
              <Tooltip 
                formatter={(value: number) => [`${value}%`, 'Margem']}
                contentStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.95)',
                  border: '1px solid rgba(0, 209, 255, 0.5)',
                  borderRadius: '12px',
                  boxShadow: '0 0 30px rgba(0, 209, 255, 0.3)',
                }}
                labelStyle={{ color: '#FFFFFF', fontWeight: 600 }}
                itemStyle={{ color: '#FFFFFF' }}
                cursor={false}
              />
              <Bar 
                dataKey="margin" 
                fill="url(#marginGradientModal)"
                radius={[0, 8, 8, 0]}
                name="Margem"
              />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'profit':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sortedProfits}>
              <defs>
                <linearGradient id="profitGradientModal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF007A" stopOpacity={1}/>
                  <stop offset="100%" stopColor="#00D1FF" stopOpacity={1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.15)" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="rgba(255,255,255,0.6)"
                fontSize={12}
                angle={-20}
                textAnchor="end"
                height={80}
                tickLine={false}
                interval={0}
              />
              <YAxis 
                stroke="rgba(255,255,255,0.6)"
                fontSize={14}
                tickFormatter={(value) => `R$${value}`}
                tickLine={false}
                axisLine={false}
                width={70}
              />
              <Tooltip 
                formatter={(value: number) => [formatCurrency(value), 'Lucro/Un']}
                contentStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.95)',
                  border: '1px solid rgba(0, 209, 255, 0.5)',
                  borderRadius: '12px',
                  boxShadow: '0 0 30px rgba(0, 209, 255, 0.3)',
                }}
                labelStyle={{ color: '#FFFFFF', fontWeight: 600 }}
                itemStyle={{ color: '#FFFFFF' }}
                cursor={false}
              />
              <Bar 
                dataKey="profit" 
                fill="url(#profitGradientModal)"
                radius={[8, 8, 0, 0]}
                name="Lucro/Un"
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
        className="relative w-[95vw] h-[90vh] rounded-2xl p-6 animate-slide-up"
        style={{
          background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.98) 0%, rgba(10, 10, 20, 0.98) 100%)',
          border: '1px solid rgba(0, 209, 255, 0.4)',
          boxShadow: '0 0 60px rgba(0, 209, 255, 0.3), 0 0 120px rgba(0, 209, 255, 0.15)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 
            className="text-2xl font-bold"
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
        <div className="h-[calc(100%-80px)]">
          {renderChart()}
        </div>
      </div>
    </div>
  );
};

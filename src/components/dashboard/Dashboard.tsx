import { useState } from 'react';
import { 
  DollarSign, 
  Percent, 
  TrendingUp, 
  Package,
  AlertTriangle,
  Settings
} from 'lucide-react';
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
import { KPICard } from './KPICard';
import { InteractiveChart } from './InteractiveChart';
import { ChartModal } from './ChartModal';
import { DashboardSettings } from './DashboardSettings';
import { 
  mockRevenueData, 
  productMargins, 
  costComposition,
  mockProducts 
} from '@/data/mockData';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { DashboardConfig, defaultDashboardConfig, ChartType } from '@/types/dashboard';

// Neon Electric chart colors
const CHART_COLORS = {
  cyan: '#00D1FF',    // Ciano Elétrico
  green: '#39FF14',   // Verde Neon
  orange: '#FFAC00',  // Laranja Vivo
  pink: '#FF007A',    // Rosa Choque
  purple: '#BF00FF',  // Roxo Neon
};

const PIE_COLORS = [
  '#FF007A', // Pink - Custos Fixos
  '#39FF14', // Green - Custos Variáveis
  '#FFAC00', // Orange - Impostos
  '#00D1FF', // Cyan - Margem
];

// Color function based on margin value
const getMarginColor = (margin: number) => {
  if (margin >= 35) return CHART_COLORS.green;
  if (margin >= 25) return CHART_COLORS.cyan;
  if (margin >= 15) return CHART_COLORS.orange;
  return CHART_COLORS.pink;
};

export const Dashboard = () => {
  const [config, setConfig] = useLocalStorage<DashboardConfig>('dashboard-config', defaultDashboardConfig);
  const [showSettings, setShowSettings] = useState(false);
  const [expandedChart, setExpandedChart] = useState<{ type: ChartType; title: string } | null>(null);

  const totalRevenue = mockRevenueData.reduce((sum, d) => sum + d.revenue, 0);
  const totalProfit = mockRevenueData.reduce((sum, d) => sum + d.profit, 0);
  const avgMargin = (totalProfit / totalRevenue) * 100;
  
  const mostProfitable = [...mockProducts].sort((a, b) => 
    (b.currentPrice - b.purchaseCost - b.variableCost) - 
    (a.currentPrice - a.purchaseCost - a.variableCost)
  )[0];
  
  const lowestMargin = [...mockProducts].sort((a, b) => {
    const marginA = ((a.currentPrice - a.purchaseCost - a.variableCost) / a.currentPrice) * 100;
    const marginB = ((b.currentPrice - b.purchaseCost - b.variableCost) / b.currentPrice) * 100;
    return marginA - marginB;
  })[0];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="backdrop-blur-lg rounded-xl p-3 md:p-4 shadow-lg"
          style={{
            background: 'rgba(0, 0, 0, 0.9)',
            border: '1px solid rgba(0, 209, 255, 0.4)',
            boxShadow: '0 0 20px rgba(0, 209, 255, 0.2)'
          }}
        >
          <p className="text-xs md:text-sm font-semibold text-foreground mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-xs md:text-sm">
              <div 
                className="w-2 h-2 md:w-3 md:h-3 rounded-full" 
                style={{ backgroundColor: entry.color, boxShadow: `0 0 8px ${entry.color}` }}
              />
              <span className="text-muted-foreground">{entry.name}:</span>
              <span className="font-semibold" style={{ color: entry.color, textShadow: `0 0 10px ${entry.color}` }}>
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
        <div className="backdrop-blur-lg rounded-xl p-2 md:p-3 shadow-lg"
          style={{
            background: 'rgba(0, 0, 0, 0.9)',
            border: `1px solid ${color}`,
            boxShadow: `0 0 15px ${color}40`
          }}
        >
          <div className="flex items-center gap-2">
            <div 
              className="w-2 h-2 md:w-3 md:h-3 rounded-full" 
              style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }}
            />
            <span className="text-foreground font-medium text-xs md:text-sm">{payload[0].name}</span>
            <span className="font-bold text-xs md:text-sm" style={{ color: color, textShadow: `0 0 10px ${color}` }}>
              {payload[0].value}%
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  // Use productMargins directly - gradient will be applied via fill="url(#marginGradient)"
  const coloredMargins = productMargins;

  const sortedProfits = [...productMargins].sort((a, b) => b.profit - a.profit);

  const hasVisibleKPIs = Object.values(config.visibleKPIs).some(v => v);
  const hasVisibleCharts = Object.values(config.visibleCharts).some(v => v);

  return (
    <div className="space-y-4 md:space-y-6 animate-fade-in">
      {/* Header with Settings Button */}
      <div className="flex items-center justify-between">
        <h2 
          className="text-xl md:text-2xl font-bold"
          style={{ 
            color: '#F8FAFC',
            textShadow: '0 0 15px rgba(248, 250, 252, 0.3)'
          }}
        >
          Dashboard
        </h2>
        <button 
          onClick={() => setShowSettings(true)}
          className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 rounded-lg font-medium transition-all duration-300"
          style={{
            background: 'rgba(0, 209, 255, 0.08)',
            border: '1px solid rgba(0, 209, 255, 0.4)',
            color: '#00D1FF',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 209, 255, 0.4)';
            e.currentTarget.style.borderColor = '#00D1FF';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '';
            e.currentTarget.style.borderColor = 'rgba(0, 209, 255, 0.4)';
          }}
        >
          <Settings className="w-4 h-4" style={{ filter: 'drop-shadow(0 0 6px rgba(0, 209, 255, 0.8))' }} />
          <span className="hidden sm:inline text-sm">Personalizar</span>
        </button>
      </div>

      {/* KPI Cards */}
      {hasVisibleKPIs && (
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          {config.visibleKPIs.revenue && (
            <KPICard
              title="Faturamento Estimado"
              value={formatCurrency(totalRevenue)}
              trend="up"
              trendValue="+15.3%"
              icon={DollarSign}
              subtitle="Últimos 12 meses"
              variant="blue"
            />
          )}
          {config.visibleKPIs.margin && (
            <KPICard
              title="Margem Média"
              value={`${avgMargin.toFixed(1)}%`}
              trend="up"
              trendValue="+2.4%"
              icon={Percent}
              variant="orange"
            />
          )}
          {config.visibleKPIs.profit && (
            <KPICard
              title="Lucro Total"
              value={formatCurrency(totalProfit)}
              trend="up"
              trendValue="+18.7%"
              icon={TrendingUp}
              variant="green"
            />
          )}
          {config.visibleKPIs.mostProfitable && (
            <KPICard
              title="Mais Lucrativo"
              value={mostProfitable.name}
              subtitle={formatCurrency(mostProfitable.currentPrice - mostProfitable.purchaseCost - mostProfitable.variableCost) + ' /un'}
              icon={Package}
              variant="cyan"
            />
          )}
          {config.visibleKPIs.lowestMargin && (
            <KPICard
              title="Menor Margem"
              value={lowestMargin.name}
              subtitle={`${(((lowestMargin.currentPrice - lowestMargin.purchaseCost - lowestMargin.variableCost) / lowestMargin.currentPrice) * 100).toFixed(1)}%`}
              icon={AlertTriangle}
              variant="purple"
            />
          )}
        </div>
      )}

      {/* Charts Row 1 */}
      {(config.visibleCharts.revenueEvolution || config.visibleCharts.costComposition) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Revenue Area Chart */}
          {config.visibleCharts.revenueEvolution && (
            <InteractiveChart 
              chartType="revenue" 
              title="Evolução do Faturamento"
              onExpand={() => setExpandedChart({ type: 'revenue', title: 'Evolução do Faturamento' })}
            >
              <div className="h-[220px] md:h-[260px] lg:h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockRevenueData}>
                    <defs>
                      {/* Neon gradient - light rising from bottom */}
                      <linearGradient id="neonRevenue" x1="0" y1="1" x2="0" y2="0">
                        <stop offset="0%" stopColor="#00D1FF" stopOpacity={0}/>
                        <stop offset="50%" stopColor="#00D1FF" stopOpacity={0.3}/>
                        <stop offset="100%" stopColor="#00D1FF" stopOpacity={0.7}/>
                      </linearGradient>
                      <linearGradient id="neonProfit" x1="0" y1="1" x2="0" y2="0">
                        <stop offset="0%" stopColor="#39FF14" stopOpacity={0}/>
                        <stop offset="50%" stopColor="#39FF14" stopOpacity={0.3}/>
                        <stop offset="100%" stopColor="#39FF14" stopOpacity={0.7}/>
                      </linearGradient>
                      {/* Glow filter for lines */}
                      <filter id="glowCyan" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                        <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                      <filter id="glowGreen" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                        <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                      dataKey="month" 
                      stroke="rgba(255,255,255,0.5)"
                      fontSize={10}
                      tickLine={false}
                      interval="preserveStartEnd"
                    />
                    <YAxis 
                      stroke="rgba(255,255,255,0.5)"
                      fontSize={10}
                      tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                      tickLine={false}
                      axisLine={false}
                      width={40}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#00D1FF"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#neonRevenue)"
                      name="Faturamento"
                      filter="url(#glowCyan)"
                    />
                    <Area
                      type="monotone"
                      dataKey="profit"
                      stroke="#39FF14"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#neonProfit)"
                      name="Lucro"
                      filter="url(#glowGreen)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </InteractiveChart>
          )}

          {/* Cost Composition Donut */}
          {config.visibleCharts.costComposition && (
            <InteractiveChart 
              chartType="costs" 
              title="Composição de Custos"
              onExpand={() => setExpandedChart({ type: 'costs', title: 'Composição de Custos' })}
            >
              <div className="h-[220px] md:h-[260px] lg:h-[300px]">
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
                      wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                      formatter={(value) => <span className="text-foreground font-medium text-xs md:text-sm">{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </InteractiveChart>
          )}
        </div>
      )}

      {/* Charts Row 2 */}
      {(config.visibleCharts.marginByProduct || config.visibleCharts.profitRanking) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Margin by Product - Gradient bars */}
          {config.visibleCharts.marginByProduct && (
            <InteractiveChart 
              chartType="margin" 
              title="Margem por Produto"
              onExpand={() => setExpandedChart({ type: 'margin', title: 'Margem por Produto' })}
            >
              <div className="h-[220px] md:h-[260px] lg:h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={coloredMargins} layout="vertical">
                    <defs>
                      <linearGradient id="marginGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#FF007A" stopOpacity={1}/>
                        <stop offset="100%" stopColor="#00D1FF" stopOpacity={1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" horizontal={false} />
                    <XAxis 
                      type="number" 
                      stroke="rgba(255,255,255,0.5)"
                      fontSize={10}
                      tickFormatter={(value) => `${value}%`}
                      tickLine={false}
                    />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      stroke="rgba(255,255,255,0.5)"
                      fontSize={9}
                      width={80}
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: 'rgba(255,255,255,0.7)' }}
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
                      cursor={{ fill: 'rgba(227, 14, 127, 0.2)' }}
                    />
                    <Bar 
                      dataKey="margin" 
                      fill="url(#marginGradient)"
                      radius={[0, 6, 6, 0]}
                      name="Margem"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </InteractiveChart>
          )}

          {/* Profit Ranking - Gradient bars */}
          {config.visibleCharts.profitRanking && (
            <InteractiveChart 
              chartType="profit" 
              title="Ranking de Lucro por Produto"
              onExpand={() => setExpandedChart({ type: 'profit', title: 'Ranking de Lucro por Produto' })}
            >
              <div className="h-[220px] md:h-[260px] lg:h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sortedProfits}>
                    <defs>
                      <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#FF007A" stopOpacity={1}/>
                        <stop offset="100%" stopColor="#00D1FF" stopOpacity={1}/>
                      </linearGradient>
                      <filter id="glowBar" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                        <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      stroke="rgba(255,255,255,0.5)"
                      fontSize={8}
                      angle={-25}
                      textAnchor="end"
                      height={50}
                      tickLine={false}
                      interval={0}
                    />
                    <YAxis 
                      stroke="rgba(255,255,255,0.5)"
                      fontSize={10}
                      tickFormatter={(value) => `R$${value}`}
                      tickLine={false}
                      axisLine={false}
                      width={50}
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
                      cursor={{ fill: 'rgba(252, 114, 0, 0.25)' }}
                    />
                    <Bar 
                      dataKey="profit" 
                      fill="url(#profitGradient)"
                      radius={[6, 6, 0, 0]}
                      name="Lucro/Un"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </InteractiveChart>
          )}
        </div>
      )}

      {/* Settings Modal */}
      <DashboardSettings 
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        config={config}
        onSave={setConfig}
      />

      {/* Chart Zoom Modal */}
      {expandedChart && (
        <ChartModal 
          isOpen={!!expandedChart}
          onClose={() => setExpandedChart(null)}
          chartType={expandedChart.type}
          title={expandedChart.title}
        />
      )}
    </div>
  );
};

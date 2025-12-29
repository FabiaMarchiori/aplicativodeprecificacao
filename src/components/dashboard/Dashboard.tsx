import { 
  DollarSign, 
  Percent, 
  TrendingUp, 
  Package,
  AlertTriangle
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
import { 
  mockRevenueData, 
  productMargins, 
  costComposition,
  mockProducts 
} from '@/data/mockData';

// Vibrant chart colors matching the new palette
const CHART_COLORS = {
  cyan: '#0DD9F4',
  green: '#0FE316',
  orange: '#FC7200',
  blue: '#329CF2',
  pink: '#E30E7F',
  purple: '#9A24AF',
};

const PIE_COLORS = [
  '#E30E7F', // Pink - Custos Fixos
  '#0FE316', // Green - Custos Variáveis
  '#FC7200', // Orange - Impostos
  '#0DD9F4', // Cyan - Margem
];

// Color function based on margin value
const getMarginColor = (margin: number) => {
  if (margin >= 35) return CHART_COLORS.green;
  if (margin >= 25) return CHART_COLORS.cyan;
  if (margin >= 15) return CHART_COLORS.orange;
  return CHART_COLORS.pink;
};

export const Dashboard = () => {
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
        <div className="bg-popover/95 backdrop-blur-lg border border-border rounded-xl p-4 shadow-lg">
          <p className="text-sm font-semibold text-foreground mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-muted-foreground">{entry.name}:</span>
              <span className="font-semibold" style={{ color: entry.color }}>
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
      return (
        <div className="bg-popover/95 backdrop-blur-lg border border-border rounded-xl p-3 shadow-lg">
          <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: payload[0].payload.fill }}
            />
            <span className="text-foreground font-medium">{payload[0].name}</span>
            <span className="font-bold text-vibrant-orange">{payload[0].value}%</span>
          </div>
        </div>
      );
    }
    return null;
  };

  // Add colors to margin data
  const coloredMargins = productMargins.map(item => ({
    ...item,
    fill: getMarginColor(item.margin)
  }));

  const sortedProfits = [...productMargins].sort((a, b) => b.profit - a.profit);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard
          title="Faturamento Estimado"
          value={formatCurrency(totalRevenue)}
          trend="up"
          trendValue="+15.3%"
          icon={DollarSign}
          subtitle="Últimos 12 meses"
          variant="blue"
        />
        <KPICard
          title="Margem Média"
          value={`${avgMargin.toFixed(1)}%`}
          trend="up"
          trendValue="+2.4%"
          icon={Percent}
          variant="orange"
        />
        <KPICard
          title="Lucro Total"
          value={formatCurrency(totalProfit)}
          trend="up"
          trendValue="+18.7%"
          icon={TrendingUp}
          variant="green"
        />
        <KPICard
          title="Mais Lucrativo"
          value={mostProfitable.name}
          subtitle={formatCurrency(mostProfitable.currentPrice - mostProfitable.purchaseCost - mostProfitable.variableCost) + ' /un'}
          icon={Package}
          variant="cyan"
        />
        <KPICard
          title="Menor Margem"
          value={lowestMargin.name}
          subtitle={`${(((lowestMargin.currentPrice - lowestMargin.purchaseCost - lowestMargin.variableCost) / lowestMargin.currentPrice) * 100).toFixed(1)}%`}
          icon={AlertTriangle}
          variant="pink"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Area Chart */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold text-foreground mb-4">Evolução do Faturamento</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={mockRevenueData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHART_COLORS.cyan} stopOpacity={0.4}/>
                  <stop offset="95%" stopColor={CHART_COLORS.cyan} stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHART_COLORS.green} stopOpacity={0.4}/>
                  <stop offset="95%" stopColor={CHART_COLORS.green} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="month" 
                stroke="rgba(255,255,255,0.5)"
                fontSize={12}
                tickLine={false}
              />
              <YAxis 
                stroke="rgba(255,255,255,0.5)"
                fontSize={12}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke={CHART_COLORS.cyan}
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorRevenue)"
                name="Faturamento"
              />
              <Area
                type="monotone"
                dataKey="profit"
                stroke={CHART_COLORS.green}
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorProfit)"
                name="Lucro"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Cost Composition Donut */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold text-foreground mb-4">Composição de Custos</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={costComposition}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={110}
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
                wrapperStyle={{ fontSize: '13px', paddingTop: '20px' }}
                formatter={(value) => <span className="text-foreground font-medium">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Margin by Product - Colored bars */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold text-foreground mb-4">Margem por Produto</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={coloredMargins} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" horizontal={false} />
              <XAxis 
                type="number" 
                stroke="rgba(255,255,255,0.5)"
                fontSize={12}
                tickFormatter={(value) => `${value}%`}
                tickLine={false}
              />
              <YAxis 
                type="category" 
                dataKey="name" 
                stroke="rgba(255,255,255,0.5)"
                fontSize={11}
                width={120}
                tickLine={false}
                axisLine={false}
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
                radius={[0, 6, 6, 0]}
                name="Margem"
              >
                {coloredMargins.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Profit Ranking - Gradient bars */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold text-foreground mb-4">Ranking de Lucro por Produto</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sortedProfits}>
              <defs>
                <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={CHART_COLORS.cyan} stopOpacity={1}/>
                  <stop offset="100%" stopColor={CHART_COLORS.green} stopOpacity={0.8}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="rgba(255,255,255,0.5)"
                fontSize={10}
                angle={-20}
                textAnchor="end"
                height={60}
                tickLine={false}
              />
              <YAxis 
                stroke="rgba(255,255,255,0.5)"
                fontSize={12}
                tickFormatter={(value) => `R$${value}`}
                tickLine={false}
                axisLine={false}
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
      </div>
    </div>
  );
};

import { 
  DollarSign, 
  Percent, 
  TrendingUp, 
  Package,
  AlertTriangle
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
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
  Legend
} from 'recharts';
import { KPICard } from './KPICard';
import { 
  mockRevenueData, 
  productMargins, 
  costComposition,
  mockProducts 
} from '@/data/mockData';

const CHART_COLORS = [
  'hsl(190, 70%, 35%)',
  'hsl(145, 63%, 42%)',
  'hsl(38, 92%, 50%)',
  'hsl(210, 60%, 50%)',
];

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
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

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
        />
        <KPICard
          title="Margem Média"
          value={`${avgMargin.toFixed(1)}%`}
          trend="up"
          trendValue="+2.4%"
          icon={Percent}
          variant="success"
        />
        <KPICard
          title="Lucro Total"
          value={formatCurrency(totalProfit)}
          trend="up"
          trendValue="+18.7%"
          icon={TrendingUp}
          variant="success"
        />
        <KPICard
          title="Mais Lucrativo"
          value={mostProfitable.name.length > 15 ? mostProfitable.name.substring(0, 15) + '...' : mostProfitable.name}
          subtitle={formatCurrency(mostProfitable.currentPrice - mostProfitable.purchaseCost - mostProfitable.variableCost) + ' /un'}
          icon={Package}
        />
        <KPICard
          title="Menor Margem"
          value={lowestMargin.name.length > 15 ? lowestMargin.name.substring(0, 15) + '...' : lowestMargin.name}
          subtitle={`${(((lowestMargin.currentPrice - lowestMargin.purchaseCost - lowestMargin.variableCost) / lowestMargin.currentPrice) * 100).toFixed(1)}%`}
          icon={AlertTriangle}
          variant="warning"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Line Chart */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold text-foreground mb-4">Evolução do Faturamento</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockRevenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="month" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="hsl(190, 70%, 35%)" 
                strokeWidth={3}
                dot={{ fill: 'hsl(190, 70%, 35%)', strokeWidth: 2 }}
                name="Faturamento"
              />
              <Line 
                type="monotone" 
                dataKey="profit" 
                stroke="hsl(145, 63%, 42%)" 
                strokeWidth={3}
                dot={{ fill: 'hsl(145, 63%, 42%)', strokeWidth: 2 }}
                name="Lucro"
              />
            </LineChart>
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
                innerRadius={60}
                outerRadius={100}
                paddingAngle={4}
                dataKey="value"
              >
                {costComposition.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => `${value}%`}
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Legend 
                wrapperStyle={{ fontSize: '12px' }}
                formatter={(value) => <span className="text-foreground">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Margin by Product */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold text-foreground mb-4">Margem por Produto</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productMargins} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                type="number" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickFormatter={(value) => `${value}%`}
              />
              <YAxis 
                type="category" 
                dataKey="name" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={11}
                width={120}
              />
              <Tooltip 
                formatter={(value: number) => `${value}%`}
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Bar 
                dataKey="margin" 
                fill="hsl(190, 70%, 35%)" 
                radius={[0, 4, 4, 0]}
                name="Margem"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Profit Ranking */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold text-foreground mb-4">Ranking de Lucro por Produto</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productMargins.sort((a, b) => b.profit - a.profit)}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="name" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={10}
                angle={-20}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickFormatter={(value) => `R$${value}`}
              />
              <Tooltip 
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Bar 
                dataKey="profit" 
                fill="hsl(145, 63%, 42%)" 
                radius={[4, 4, 0, 0]}
                name="Lucro/Un"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

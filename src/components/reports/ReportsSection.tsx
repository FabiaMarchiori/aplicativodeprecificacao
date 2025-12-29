import { useState } from 'react';
import { Download, Filter, FileSpreadsheet, FileText, Calendar } from 'lucide-react';
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
  Legend
} from 'recharts';
import { mockProducts, mockRevenueData, productMargins } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

export const ReportsSection = () => {
  const [selectedProduct, setSelectedProduct] = useState<string>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('12months');
  const { toast } = useToast();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const handleExport = (format: string) => {
    toast({ 
      title: 'Exportação em breve', 
      description: `A exportação em ${format} será disponibilizada em uma versão futura.` 
    });
  };

  const filteredData = selectedPeriod === '6months' 
    ? mockRevenueData.slice(-6) 
    : selectedPeriod === '3months'
    ? mockRevenueData.slice(-3)
    : mockRevenueData;

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
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Relatórios</h2>
          <p className="text-muted-foreground">Visualize e exporte seus dados</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => handleExport('Excel')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-white transition-all duration-300 hover:-translate-y-0.5"
            style={{
              background: 'linear-gradient(135deg, #0FE316 0%, #5EF366 100%)',
              boxShadow: '0 4px 15px rgba(15, 227, 22, 0.3)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 6px 20px rgba(15, 227, 22, 0.4)'}
            onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 4px 15px rgba(15, 227, 22, 0.3)'}
          >
            <FileSpreadsheet className="w-4 h-4" />
            Excel
          </button>
          <button 
            onClick={() => handleExport('PDF')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-white transition-all duration-300 hover:-translate-y-0.5"
            style={{
              background: 'linear-gradient(135deg, #E30E7F 0%, #F84BA6 100%)',
              boxShadow: '0 4px 15px rgba(227, 14, 127, 0.3)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 6px 20px rgba(227, 14, 127, 0.4)'}
            onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 4px 15px rgba(227, 14, 127, 0.3)'}
          >
            <FileText className="w-4 h-4" />
            PDF
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Filtros:</span>
          </div>
          
          <div className="flex items-center gap-2">
            <label className="text-sm text-muted-foreground">Produto:</label>
            <select 
              className="input-field py-1.5"
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
            >
              <option value="all">Todos os produtos</option>
              {mockProducts.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <label className="text-sm text-muted-foreground">Período:</label>
            <select 
              className="input-field py-1.5"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              <option value="12months">Últimos 12 meses</option>
              <option value="6months">Últimos 6 meses</option>
              <option value="3months">Últimos 3 meses</option>
            </select>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue Chart */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold text-foreground mb-4">Faturamento vs Lucro</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={filteredData}>
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
              <Legend />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#E30E7F"
                strokeWidth={3}
                dot={{ fill: '#E30E7F', strokeWidth: 2, r: 5 }}
                activeDot={{ r: 7, fill: '#E30E7F', stroke: '#fff', strokeWidth: 2 }}
                name="Faturamento"
              />
              <Line 
                type="monotone" 
                dataKey="profit" 
                stroke="#0FE316"
                strokeWidth={3}
                dot={{ fill: '#0FE316', strokeWidth: 2, r: 5 }}
                activeDot={{ r: 7, fill: '#0FE316', stroke: '#fff', strokeWidth: 2 }}
                name="Lucro"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Margin by Product */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold text-foreground mb-4">Margem por Produto</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productMargins}>
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
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip 
                formatter={(value: number) => [`${value}%`, 'Margem']}
                contentStyle={{
                  backgroundColor: 'rgba(30, 30, 46, 0.95)',
                  border: '2px solid #FC7200',
                  borderRadius: '8px',
                  color: '#FFFFFF'
                }}
                labelStyle={{ color: '#FFFFFF', fontWeight: 600 }}
                itemStyle={{ color: '#FFFFFF' }}
                cursor={{ fill: 'rgba(252, 114, 0, 0.1)' }}
              />
              <Bar 
                dataKey="margin" 
                fill="#0FE316"
                radius={[8, 8, 0, 0]}
                name="Margem"
                onMouseOver={(data, index, e) => {
                  if (e && e.target) {
                    (e.target as SVGElement).style.fill = '#FC7200';
                  }
                }}
                onMouseOut={(data, index, e) => {
                  if (e && e.target) {
                    (e.target as SVGElement).style.fill = '#0FE316';
                  }
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Table */}
      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold text-foreground">Resumo por Período</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Mês</th>
                <th className="text-right">Faturamento</th>
                <th className="text-right">Lucro</th>
                <th className="text-right">Margem</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((data) => {
                const margin = (data.profit / data.revenue) * 100;
                return (
                  <tr key={data.month}>
                    <td className="font-medium">{data.month}</td>
                    <td className="text-right mono">{formatCurrency(data.revenue)}</td>
                    <td className="text-right mono text-success">{formatCurrency(data.profit)}</td>
                    <td className="text-right">
                      <span className={`mono font-medium ${
                        margin >= 25 ? 'text-success' :
                        margin >= 15 ? 'text-warning' :
                        'text-danger'
                      }`}>
                        {margin.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export Notice */}
      <div className="mt-6 p-4 rounded-xl bg-primary/10 border border-primary/20">
        <div className="flex items-center gap-3">
          <Download className="w-5 h-5 text-primary" />
          <div>
            <h4 className="font-medium text-foreground">Exportação de Dados</h4>
            <p className="text-sm text-muted-foreground">
              A funcionalidade de exportação para Excel e PDF será disponibilizada em breve. 
              Você poderá baixar relatórios completos com todos os filtros aplicados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

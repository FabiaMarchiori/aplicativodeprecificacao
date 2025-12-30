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
  Legend,
  Cell
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
        <div 
          style={{
            background: 'rgba(0, 0, 0, 0.95)',
            border: '2px solid #00D1FF',
            borderRadius: '8px',
            padding: '12px',
            boxShadow: '0 0 20px rgba(0, 209, 255, 0.4), 0 0 40px rgba(0, 209, 255, 0.2)'
          }}
        >
          <p style={{ 
            color: '#FFFFFF', 
            fontWeight: 600, 
            marginBottom: '8px',
            textShadow: '0 0 10px rgba(255, 255, 255, 0.5)'
          }}>
            {label}
          </p>
          {payload.map((entry: any, index: number) => (
            <p 
              key={index} 
              style={{ 
                color: entry.color,
                fontSize: '14px',
                textShadow: `0 0 8px ${entry.color}`
              }}
            >
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
          {/* Botão Excel - Verde Neon Transparente */}
          <button 
            onClick={() => handleExport('Excel')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:-translate-y-0.5"
            style={{
              background: 'transparent',
              border: '2px solid #39FF14',
              color: '#39FF14',
              boxShadow: '0 0 15px rgba(57, 255, 20, 0.3), inset 0 0 10px rgba(57, 255, 20, 0.1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 20px rgba(57, 255, 20, 0.6), 0 0 40px rgba(57, 255, 20, 0.3), inset 0 0 15px rgba(57, 255, 20, 0.2)';
              e.currentTarget.style.background = 'rgba(57, 255, 20, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 0 15px rgba(57, 255, 20, 0.3), inset 0 0 10px rgba(57, 255, 20, 0.1)';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <FileSpreadsheet className="w-4 h-4" style={{ filter: 'drop-shadow(0 0 5px #39FF14)' }} />
            Excel
          </button>
          {/* Botão PDF - Rosa Pink Shock Transparente */}
          <button 
            onClick={() => handleExport('PDF')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:-translate-y-0.5"
            style={{
              background: 'transparent',
              border: '2px solid #FF007A',
              color: '#FF007A',
              boxShadow: '0 0 15px rgba(255, 0, 122, 0.3), inset 0 0 10px rgba(255, 0, 122, 0.1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 0, 122, 0.6), 0 0 40px rgba(255, 0, 122, 0.3), inset 0 0 15px rgba(255, 0, 122, 0.2)';
              e.currentTarget.style.background = 'rgba(255, 0, 122, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 0 15px rgba(255, 0, 122, 0.3), inset 0 0 10px rgba(255, 0, 122, 0.1)';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <FileText className="w-4 h-4" style={{ filter: 'drop-shadow(0 0 5px #FF007A)' }} />
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
        {/* Revenue Chart - Faturamento vs Lucro */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold text-foreground mb-4">Faturamento vs Lucro</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={filteredData}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00D1FF" stopOpacity={0.4}/>
                  <stop offset="100%" stopColor="#00D1FF" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#39FF14" stopOpacity={0.4}/>
                  <stop offset="100%" stopColor="#39FF14" stopOpacity={0}/>
                </linearGradient>
              </defs>
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
              {/* Linha Faturamento - Ciano Elétrico */}
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#00D1FF"
                strokeWidth={3}
                dot={{ fill: '#00D1FF', strokeWidth: 2, r: 5 }}
                activeDot={{ r: 7, fill: '#00D1FF', stroke: '#fff', strokeWidth: 2 }}
                name="Faturamento"
                style={{ filter: 'drop-shadow(0 0 10px rgba(0, 209, 255, 0.8))' }}
              />
              {/* Linha Lucro - Verde Neon */}
              <Line 
                type="monotone" 
                dataKey="profit" 
                stroke="#39FF14"
                strokeWidth={3}
                dot={{ fill: '#39FF14', strokeWidth: 2, r: 5 }}
                activeDot={{ r: 7, fill: '#39FF14', stroke: '#fff', strokeWidth: 2 }}
                name="Lucro"
                style={{ filter: 'drop-shadow(0 0 10px rgba(57, 255, 20, 0.8))' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Margin by Product - Degradê Ciano→Verde + Rosa para baixa margem */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold text-foreground mb-4">Margem por Produto</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productMargins}>
              <defs>
                <linearGradient id="marginGradientReport" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#00D1FF" stopOpacity={1}/>
                  <stop offset="100%" stopColor="#39FF14" stopOpacity={1}/>
                </linearGradient>
              </defs>
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
                  backgroundColor: 'rgba(0, 0, 0, 0.95)',
                  border: '2px solid #00D1FF',
                  borderRadius: '8px',
                  color: '#FFFFFF',
                  boxShadow: '0 0 20px rgba(0, 209, 255, 0.4)'
                }}
                labelStyle={{ color: '#FFFFFF', fontWeight: 600, textShadow: '0 0 8px rgba(255, 255, 255, 0.5)' }}
                itemStyle={{ color: '#00D1FF', textShadow: '0 0 8px #00D1FF' }}
                cursor={{ fill: 'rgba(0, 209, 255, 0.1)' }}
              />
              <Bar 
                dataKey="margin" 
                radius={[8, 8, 0, 0]}
                name="Margem"
              >
                {productMargins.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.margin < 20 ? '#FF007A' : 'url(#marginGradientReport)'} 
                    style={{ 
                      filter: entry.margin < 20 
                        ? 'drop-shadow(0 0 8px rgba(255, 0, 122, 0.6))' 
                        : 'drop-shadow(0 0 8px rgba(0, 209, 255, 0.4))'
                    }}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Table - Cores Neon por Coluna */}
      <div className="glass-card overflow-hidden">
        <div 
          className="p-4 border-b border-border"
          style={{ background: 'rgba(0, 209, 255, 0.05)' }}
        >
          <h3 
            className="font-semibold"
            style={{ 
              color: '#00D1FF',
              textShadow: '0 0 10px rgba(0, 209, 255, 0.5)'
            }}
          >
            Resumo por Período
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Mês</th>
                <th className="text-right" style={{ color: '#00D1FF', textShadow: '0 0 8px rgba(0, 209, 255, 0.5)' }}>Faturamento</th>
                <th className="text-right" style={{ color: '#39FF14', textShadow: '0 0 8px rgba(57, 255, 20, 0.5)' }}>Lucro</th>
                <th className="text-right" style={{ color: '#FFAC00', textShadow: '0 0 8px rgba(255, 172, 0, 0.5)' }}>Margem</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((data) => {
                const margin = (data.profit / data.revenue) * 100;
                return (
                  <tr key={data.month}>
                    <td className="font-medium">{data.month}</td>
                    {/* Faturamento - Ciano Elétrico */}
                    <td 
                      className="text-right mono"
                      style={{ 
                        color: '#00D1FF',
                        textShadow: '0 0 10px rgba(0, 209, 255, 0.6), 0 0 20px rgba(0, 209, 255, 0.3)'
                      }}
                    >
                      {formatCurrency(data.revenue)}
                    </td>
                    {/* Lucro - Verde Neon */}
                    <td 
                      className="text-right mono"
                      style={{ 
                        color: '#39FF14',
                        textShadow: '0 0 10px rgba(57, 255, 20, 0.6), 0 0 20px rgba(57, 255, 20, 0.3)'
                      }}
                    >
                      {formatCurrency(data.profit)}
                    </td>
                    {/* Margem - Laranja Plasma */}
                    <td className="text-right">
                      <span 
                        className="mono font-medium"
                        style={{ 
                          color: '#FFAC00',
                          textShadow: '0 0 10px rgba(255, 172, 0, 0.6), 0 0 20px rgba(255, 172, 0, 0.3)'
                        }}
                      >
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

      {/* Export Notice - Estilo Neon */}
      <div 
        className="mt-6 p-4 rounded-xl"
        style={{
          background: 'rgba(0, 209, 255, 0.05)',
          border: '1px solid rgba(0, 209, 255, 0.3)',
          boxShadow: '0 0 15px rgba(0, 209, 255, 0.1), inset 0 0 20px rgba(0, 0, 0, 0.5)'
        }}
      >
        <div className="flex items-center gap-3">
          <Download 
            className="w-5 h-5" 
            style={{ 
              color: '#00D1FF',
              filter: 'drop-shadow(0 0 8px #00D1FF)'
            }} 
          />
          <div>
            <h4 
              className="font-medium"
              style={{ 
                color: '#00D1FF',
                textShadow: '0 0 8px rgba(0, 209, 255, 0.5)'
              }}
            >
              Exportação de Dados
            </h4>
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

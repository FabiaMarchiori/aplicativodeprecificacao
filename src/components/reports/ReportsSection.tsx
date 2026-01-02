import { useState, useEffect } from 'react';
import { Download, Filter, FileSpreadsheet, FileText, Calendar, HelpCircle, TrendingUp, TrendingDown, X, Eye, EyeOff, ChevronRight, Info } from 'lucide-react';
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
  Cell,
  Brush,
  PieChart,
  Pie
} from 'recharts';
import { mockProducts, mockRevenueData, productMargins } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Switch } from '@/components/ui/switch';

interface RevenueData {
  month: string;
  revenue: number;
  profit: number;
}

// Tutorial steps configuration
const tutorialSteps = [
  {
    title: 'Bem-vindo aos Relatórios!',
    description: 'Vamos guiá-lo rapidamente pelas principais funcionalidades desta página.',
    target: 'intro'
  },
  {
    title: 'Filtros Avançados',
    description: 'Use os filtros para selecionar categoria de produtos, faixa de valor e período específico para análise.',
    target: 'filters'
  },
  {
    title: 'Gráfico Interativo',
    description: 'Clique em qualquer ponto do gráfico para ver detalhes do mês. Use a barra inferior para dar zoom em um período específico.',
    target: 'chart'
  },
  {
    title: 'Indicadores de Tendência',
    description: 'Na tabela, veja as setas indicando se o faturamento e margem aumentaram ou diminuíram em relação ao mês anterior.',
    target: 'table'
  },
  {
    title: 'Modos de Visualização',
    description: 'Alterne entre visualização Simples (apenas essenciais) e Detalhada (com custos e variações extras).',
    target: 'toggle'
  }
];

export const ReportsSection = () => {
  const [selectedProduct, setSelectedProduct] = useState<string>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('12months');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedValueRange, setSelectedValueRange] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'simple' | 'detailed'>('simple');
  const [selectedMonthDetail, setSelectedMonthDetail] = useState<RevenueData | null>(null);
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const { toast } = useToast();

  // Check if first visit
  useEffect(() => {
    const tutorialCompleted = localStorage.getItem('reports_tutorial_completed');
    if (!tutorialCompleted) {
      setShowTutorial(true);
    }
  }, []);

  const completeTutorial = () => {
    localStorage.setItem('reports_tutorial_completed', 'true');
    setShowTutorial(false);
    setTutorialStep(0);
  };

  const nextTutorialStep = () => {
    if (tutorialStep < tutorialSteps.length - 1) {
      setTutorialStep(tutorialStep + 1);
    } else {
      completeTutorial();
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const handleExport = (format: string) => {
    toast({ 
      title: 'Exportação em breve', 
      description: `A exportação em ${format} será disponibilizada em uma versão futura.` 
    });
  };

  // Get unique categories from products
  const categories = ['all', ...new Set(mockProducts.map(p => p.category))];

  // Value ranges
  const valueRanges = [
    { value: 'all', label: 'Todas as faixas' },
    { value: '0-50000', label: 'Até R$ 50k' },
    { value: '50000-100000', label: 'R$ 50k - R$ 100k' },
    { value: '100000-200000', label: 'R$ 100k - R$ 200k' },
    { value: '200000+', label: 'Acima de R$ 200k' }
  ];

  // Filter data by period
  let filteredData = selectedPeriod === '6months' 
    ? mockRevenueData.slice(-6) 
    : selectedPeriod === '3months'
    ? mockRevenueData.slice(-3)
    : mockRevenueData;

  // Apply value range filter
  if (selectedValueRange !== 'all') {
    filteredData = filteredData.filter(data => {
      if (selectedValueRange === '0-50000') return data.revenue <= 50000;
      if (selectedValueRange === '50000-100000') return data.revenue > 50000 && data.revenue <= 100000;
      if (selectedValueRange === '100000-200000') return data.revenue > 100000 && data.revenue <= 200000;
      if (selectedValueRange === '200000+') return data.revenue > 200000;
      return true;
    });
  }

  // Calculate variations for the table
  const dataWithVariations = filteredData.map((data, index) => {
    const prevData = index > 0 ? filteredData[index - 1] : null;
    const revenueVariation = prevData ? ((data.revenue - prevData.revenue) / prevData.revenue) * 100 : null;
    const currentMargin = (data.profit / data.revenue) * 100;
    const prevMargin = prevData ? (prevData.profit / prevData.revenue) * 100 : null;
    const marginVariation = prevMargin !== null ? currentMargin - prevMargin : null;
    
    return {
      ...data,
      margin: currentMargin,
      revenueVariation,
      marginVariation
    };
  });

  // Estimated costs for detail modal
  const getMonthDetails = (data: RevenueData) => {
    const margin = (data.profit / data.revenue) * 100;
    const totalCosts = data.revenue - data.profit;
    const estimatedFixedCosts = totalCosts * 0.4; // 40% fixed
    const estimatedVariableCosts = totalCosts * 0.6; // 60% variable
    
    return {
      revenue: data.revenue,
      profit: data.profit,
      margin,
      fixedCosts: estimatedFixedCosts,
      variableCosts: estimatedVariableCosts,
      totalCosts
    };
  };

  const handleChartClick = (data: any) => {
    if (data && data.activePayload && data.activePayload[0]) {
      setSelectedMonthDetail(data.activePayload[0].payload);
    }
  };

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
          <p style={{ color: '#FFFFFF', fontSize: '12px', marginTop: '8px' }}>
            Clique para ver detalhes
          </p>
        </div>
      );
    }
    return null;
  };

  // Pie chart data for detail modal
  const getPieData = (details: ReturnType<typeof getMonthDetails>) => [
    { name: 'Lucro', value: details.profit, color: '#39FF14' },
    { name: 'Custos Fixos', value: details.fixedCosts, color: '#00D1FF' },
    { name: 'Custos Variáveis', value: details.variableCosts, color: '#BC13FE' }
  ];

  return (
    <TooltipProvider>
      <div className="animate-fade-in">
        {/* Tutorial Overlay */}
        {showTutorial && (
          <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
            <div 
              className="max-w-md w-full rounded-2xl p-6"
              style={{
                background: 'rgba(0, 0, 0, 0.95)',
                border: '2px solid #00D1FF',
                boxShadow: '0 0 30px rgba(0, 209, 255, 0.4), 0 0 60px rgba(0, 209, 255, 0.2)'
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <span 
                  className="text-sm font-medium px-3 py-1 rounded-full"
                  style={{ 
                    background: 'rgba(0, 209, 255, 0.2)', 
                    color: '#00D1FF',
                    border: '1px solid rgba(0, 209, 255, 0.4)'
                  }}
                >
                  Passo {tutorialStep + 1} de {tutorialSteps.length}
                </span>
                <button 
                  onClick={completeTutorial}
                  className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                  style={{ color: '#FFFFFF' }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <h3 
                className="text-xl font-bold mb-2"
                style={{ color: '#FFFFFF', textShadow: '0 0 10px rgba(255, 255, 255, 0.3)' }}
              >
                {tutorialSteps[tutorialStep].title}
              </h3>
              <p style={{ color: '#FFFFFF', lineHeight: 1.6 }}>
                {tutorialSteps[tutorialStep].description}
              </p>
              
              <div className="flex items-center justify-between mt-6">
                <button 
                  onClick={completeTutorial}
                  className="text-sm px-4 py-2 rounded-lg transition-colors"
                  style={{ color: '#FFFFFF' }}
                >
                  Pular tutorial
                </button>
                <button 
                  onClick={nextTutorialStep}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold transition-all"
                  style={{
                    background: 'linear-gradient(135deg, #00D1FF 0%, #39FF14 100%)',
                    color: '#000',
                    boxShadow: '0 0 20px rgba(0, 209, 255, 0.4)'
                  }}
                >
                  {tutorialStep < tutorialSteps.length - 1 ? 'Próximo' : 'Concluir'}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              
              {/* Progress dots */}
              <div className="flex items-center justify-center gap-2 mt-4">
                {tutorialSteps.map((_, index) => (
                  <div 
                    key={index}
                    className="w-2 h-2 rounded-full transition-all"
                    style={{
                      background: index <= tutorialStep ? '#00D1FF' : 'rgba(255, 255, 255, 0.2)',
                      boxShadow: index <= tutorialStep ? '0 0 8px #00D1FF' : 'none'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Month Detail Modal */}
        <Dialog open={!!selectedMonthDetail} onOpenChange={() => setSelectedMonthDetail(null)}>
          <DialogContent 
            className="max-w-2xl"
            style={{
              background: 'rgba(0, 0, 0, 0.95)',
              border: '2px solid #00D1FF',
              boxShadow: '0 0 40px rgba(0, 209, 255, 0.4)'
            }}
          >
            <DialogHeader>
              <DialogTitle 
                className="text-xl"
                style={{ color: '#00D1FF', textShadow: '0 0 10px rgba(0, 209, 255, 0.5)' }}
              >
                Detalhes - {selectedMonthDetail?.month}
              </DialogTitle>
            </DialogHeader>
            
            {selectedMonthDetail && (() => {
              const details = getMonthDetails(selectedMonthDetail);
              const pieData = getPieData(details);
              
              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  {/* Metrics */}
                  <div className="space-y-4">
                    <div 
                      className="p-4 rounded-xl"
                      style={{ background: 'rgba(0, 209, 255, 0.1)', border: '1px solid rgba(0, 209, 255, 0.3)' }}
                    >
                      <p style={{ color: '#FFFFFF', fontSize: '14px' }}>Faturamento</p>
                      <p 
                        className="text-2xl font-bold"
                        style={{ color: '#00D1FF', textShadow: '0 0 10px rgba(0, 209, 255, 0.5)' }}
                      >
                        {formatCurrency(details.revenue)}
                      </p>
                    </div>
                    
                    <div 
                      className="p-4 rounded-xl"
                      style={{ background: 'rgba(57, 255, 20, 0.1)', border: '1px solid rgba(57, 255, 20, 0.3)' }}
                    >
                      <p style={{ color: '#FFFFFF', fontSize: '14px' }}>Lucro Líquido</p>
                      <p 
                        className="text-2xl font-bold"
                        style={{ color: '#39FF14', textShadow: '0 0 10px rgba(57, 255, 20, 0.5)' }}
                      >
                        {formatCurrency(details.profit)}
                      </p>
                    </div>
                    
                    <div 
                      className="p-4 rounded-xl"
                      style={{ background: 'rgba(255, 172, 0, 0.1)', border: '1px solid rgba(255, 172, 0, 0.3)' }}
                    >
                      <p style={{ color: '#FFFFFF', fontSize: '14px' }}>Margem de Lucro</p>
                      <p 
                        className="text-2xl font-bold"
                        style={{ color: '#FFAC00', textShadow: '0 0 10px rgba(255, 172, 0, 0.5)' }}
                      >
                        {details.margin.toFixed(1)}%
                      </p>
                    </div>
                    
                    {viewMode === 'detailed' && (
                      <>
                        <div 
                          className="p-4 rounded-xl"
                          style={{ background: 'rgba(188, 19, 254, 0.1)', border: '1px solid rgba(188, 19, 254, 0.3)' }}
                        >
                          <p style={{ color: '#FFFFFF', fontSize: '14px' }}>Custos Fixos (est.)</p>
                          <p 
                            className="text-xl font-bold"
                            style={{ color: '#BC13FE', textShadow: '0 0 10px rgba(188, 19, 254, 0.5)' }}
                          >
                            {formatCurrency(details.fixedCosts)}
                          </p>
                        </div>
                        
                        <div 
                          className="p-4 rounded-xl"
                          style={{ background: 'rgba(255, 107, 107, 0.1)', border: '1px solid rgba(255, 107, 107, 0.3)' }}
                        >
                          <p style={{ color: '#FFFFFF', fontSize: '14px' }}>Custos Variáveis (est.)</p>
                          <p 
                            className="text-xl font-bold"
                            style={{ color: '#FF6B6B', textShadow: '0 0 10px rgba(255, 107, 107, 0.5)' }}
                          >
                            {formatCurrency(details.variableCosts)}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                  
                  {/* Pie Chart */}
                  <div className="flex flex-col items-center justify-center">
                    <p 
                      className="text-sm font-medium mb-2"
                      style={{ color: '#FFFFFF' }}
                    >
                      Composição do Faturamento
                    </p>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={entry.color}
                              style={{ filter: `drop-shadow(0 0 8px ${entry.color})` }}
                            />
                          ))}
                        </Pie>
                        <Legend 
                          formatter={(value) => <span style={{ color: '#FFFFFF' }}>{value}</span>}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              );
            })()}
          </DialogContent>
        </Dialog>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Relatórios</h2>
            <p style={{ color: '#FFFFFF' }}>Visualize e exporte seus dados</p>
          </div>
          <div className="flex flex-col xs:flex-row flex-wrap items-stretch xs:items-center gap-3 w-full sm:w-auto">
            {/* View Mode Toggle */}
            <div 
              className="flex items-center justify-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 rounded-xl"
              style={{
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <div className="flex items-center gap-1 sm:gap-2">
                <Eye className="w-4 h-4" style={{ color: viewMode === 'simple' ? '#00D1FF' : 'rgba(255, 255, 255, 0.4)' }} />
                <span 
                  className="text-xs sm:text-sm hidden xs:inline"
                  style={{ color: viewMode === 'simple' ? '#00D1FF' : 'rgba(255, 255, 255, 0.4)' }}
                >
                  Simples
                </span>
              </div>
              <Switch 
                checked={viewMode === 'detailed'}
                onCheckedChange={(checked) => setViewMode(checked ? 'detailed' : 'simple')}
                className={viewMode === 'simple' ? '[&[data-state=unchecked]]:bg-[#00D1FF] [&[data-state=unchecked]]:shadow-[0_0_10px_rgba(0,209,255,0.5)]' : ''}
              />
              <div className="flex items-center gap-1 sm:gap-2">
                <span 
                  className="text-xs sm:text-sm hidden xs:inline"
                  style={{ color: viewMode === 'detailed' ? '#39FF14' : 'rgba(255, 255, 255, 0.4)' }}
                >
                  Detalhada
                </span>
                <EyeOff className="w-4 h-4" style={{ color: viewMode === 'detailed' ? '#39FF14' : 'rgba(255, 255, 255, 0.4)' }} />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Tutorial restart button */}
              <UITooltip>
                <TooltipTrigger asChild>
                  <button 
                    onClick={() => { setTutorialStep(0); setShowTutorial(true); }}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300"
                    style={{
                      background: 'transparent',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: '#FFFFFF'
                    }}
                  >
                    <Info className="w-4 h-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Ver tutorial novamente</p>
                </TooltipContent>
              </UITooltip>
              
              {/* Botão Excel */}
              <button 
                onClick={() => handleExport('Excel')}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:-translate-y-0.5"
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
                <span className="hidden xs:inline">Excel</span>
              </button>
              {/* Botão PDF */}
              <button 
                onClick={() => handleExport('PDF')}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  background: 'transparent',
                  border: '2px solid #BC13FE',
                  color: '#BC13FE',
                  boxShadow: '0 0 15px rgba(188, 19, 254, 0.3), inset 0 0 10px rgba(188, 19, 254, 0.1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(188, 19, 254, 0.6), 0 0 40px rgba(188, 19, 254, 0.3), inset 0 0 15px rgba(188, 19, 254, 0.2)';
                  e.currentTarget.style.background = 'rgba(188, 19, 254, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 15px rgba(188, 19, 254, 0.3), inset 0 0 10px rgba(188, 19, 254, 0.1)';
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <FileText className="w-4 h-4" style={{ filter: 'drop-shadow(0 0 5px #BC13FE)' }} />
                <span className="hidden xs:inline">PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="glass-card p-3 sm:p-4 mb-6">
          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4" style={{ color: '#FFFFFF' }} />
              <span className="text-sm font-medium text-foreground">Filtros:</span>
            </div>
            
            <div className="flex flex-col xs:flex-row flex-wrap items-stretch xs:items-center gap-2 sm:gap-3 flex-1">
              <div className="flex items-center gap-2 w-full xs:w-auto">
                <label className="text-sm whitespace-nowrap" style={{ color: '#FFFFFF' }}>Produto:</label>
                <select 
                  className="input-field py-1.5 flex-1 xs:flex-none"
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                >
                  <option value="all">Todos os produtos</option>
                  {mockProducts.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              {/* Category Filter - shown in detailed mode or always for better UX */}
              <div className="flex items-center gap-2 w-full xs:w-auto">
                <label className="text-sm whitespace-nowrap" style={{ color: '#FFFFFF' }}>Categoria:</label>
                <select 
                  className="input-field py-1.5 flex-1 xs:flex-none"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="all">Todas</option>
                  {categories.filter(c => c !== 'all').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Value Range Filter */}
              {viewMode === 'detailed' && (
                <div className="flex items-center gap-2 w-full xs:w-auto">
                  <label className="text-sm whitespace-nowrap" style={{ color: '#FFFFFF' }}>Faixa de Valor:</label>
                  <select 
                    className="input-field py-1.5 flex-1 xs:flex-none"
                    value={selectedValueRange}
                    onChange={(e) => setSelectedValueRange(e.target.value)}
                  >
                    {valueRanges.map(range => (
                      <option key={range.value} value={range.value}>{range.label}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex items-center gap-2 w-full xs:w-auto">
                <Calendar className="w-4 h-4" style={{ color: '#FFFFFF' }} />
                <label className="text-sm whitespace-nowrap" style={{ color: '#FFFFFF' }}>Período:</label>
                <select 
                  className="input-field py-1.5 flex-1 xs:flex-none"
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
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Revenue Chart - Faturamento vs Lucro */}
          <div className="chart-container">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-lg font-semibold text-foreground">Faturamento vs Lucro</h3>
              <UITooltip>
                <TooltipTrigger>
                  <HelpCircle className="w-4 h-4" style={{ color: 'rgba(0, 209, 255, 0.6)' }} />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p><strong>Faturamento:</strong> Valor total das vendas realizadas no período.</p>
                  <p className="mt-1"><strong>Lucro:</strong> Faturamento menos todos os custos (fixos e variáveis).</p>
                  <p className="mt-2 text-xs" style={{ color: '#FFFFFF' }}>Clique em um ponto para ver detalhes do mês.</p>
                </TooltipContent>
              </UITooltip>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={filteredData} onClick={handleChartClick} style={{ cursor: 'pointer' }}>
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
                  stroke="#FFFFFF"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#FFFFFF"
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
                {/* Zoom Brush */}
                <Brush 
                  dataKey="month" 
                  height={30} 
                  stroke="#00D1FF"
                  fill="rgba(0, 0, 0, 0.5)"
                  tickFormatter={(value) => value}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Margin by Product */}
          <div className="chart-container">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-lg font-semibold text-foreground">Margem por Produto</h3>
              <UITooltip>
                <TooltipTrigger>
                  <HelpCircle className="w-4 h-4" style={{ color: 'rgba(0, 209, 255, 0.6)' }} />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p><strong>Margem:</strong> Percentual do lucro sobre o preço de venda.</p>
                  <p className="mt-1">Produtos com margem abaixo de 20% são destacados em roxo, indicando necessidade de atenção.</p>
                </TooltipContent>
              </UITooltip>
            </div>
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
                  stroke="#FFFFFF"
                  fontSize={10}
                  angle={-20}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  stroke="#FFFFFF"
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
                      fill={entry.margin < 20 ? '#BC13FE' : 'url(#marginGradientReport)'} 
                      style={{ 
                        filter: entry.margin < 20 
                          ? 'drop-shadow(0 0 8px rgba(188, 19, 254, 0.6))' 
                          : 'drop-shadow(0 0 8px rgba(0, 209, 255, 0.4))'
                      }}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Summary Table with Trend Indicators */}
        <div className="glass-card overflow-hidden">
          <div 
            className="p-4 border-b border-border"
            style={{ background: 'rgba(0, 209, 255, 0.05)' }}
          >
            <div className="flex items-center gap-2">
              <h3 
                className="font-semibold"
                style={{ 
                  color: '#00D1FF',
                  textShadow: '0 0 10px rgba(0, 209, 255, 0.5)'
                }}
              >
                Resumo por Período
              </h3>
              <UITooltip>
                <TooltipTrigger>
                  <HelpCircle className="w-4 h-4" style={{ color: 'rgba(0, 209, 255, 0.6)' }} />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>As setas indicam a variação em relação ao mês anterior.</p>
                  <p className="mt-1"><span style={{ color: '#39FF14' }}>↑ Verde:</span> Crescimento</p>
                  <p><span style={{ color: '#FF6B6B' }}>↓ Vermelho:</span> Queda</p>
                </TooltipContent>
              </UITooltip>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="text-center">Mês</th>
                  <th className="text-center" style={{ color: '#00D1FF', textShadow: '0 0 8px rgba(0, 209, 255, 0.5)' }}>Faturamento</th>
                  <th className="text-center" style={{ color: '#FFFFFF' }}>Var.</th>
                  <th className="text-center" style={{ color: '#39FF14', textShadow: '0 0 8px rgba(57, 255, 20, 0.5)' }}>Lucro</th>
                  <th className="text-center" style={{ color: '#FFAC00', textShadow: '0 0 8px rgba(255, 172, 0, 0.5)' }}>Margem</th>
                  <th className="text-center" style={{ color: '#FFFFFF' }}>Var. Margem</th>
                  {viewMode === 'detailed' && (
                    <th className="text-center" style={{ color: '#BC13FE', textShadow: '0 0 8px rgba(188, 19, 254, 0.5)' }}>Custos (est.)</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {dataWithVariations.map((data) => {
                  const totalCosts = data.revenue - data.profit;
                  
                  return (
                    <tr key={data.month}>
                      <td className="font-medium" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>{data.month}</td>
                      {/* Faturamento with trend */}
                      <td className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span 
                            className="mono"
                            style={{ 
                              color: '#00D1FF',
                              textShadow: '0 0 10px rgba(0, 209, 255, 0.6), 0 0 20px rgba(0, 209, 255, 0.3)'
                            }}
                          >
                            {formatCurrency(data.revenue)}
                          </span>
                          {data.revenueVariation !== null && (
                            data.revenueVariation >= 0 
                              ? <TrendingUp className="w-4 h-4" style={{ color: '#39FF14', filter: 'drop-shadow(0 0 4px #39FF14)' }} />
                              : <TrendingDown className="w-4 h-4" style={{ color: '#FF6B6B', filter: 'drop-shadow(0 0 4px #FF6B6B)' }} />
                          )}
                        </div>
                      </td>
                      {/* Revenue Variation */}
                      <td className="text-right mono text-sm">
                        {data.revenueVariation !== null ? (
                          <span style={{ color: data.revenueVariation >= 0 ? '#39FF14' : '#FF6B6B' }}>
                            {data.revenueVariation >= 0 ? '+' : ''}{data.revenueVariation.toFixed(1)}%
                          </span>
                        ) : (
                          <span style={{ color: '#FFFFFF' }}>-</span>
                        )}
                      </td>
                      {/* Lucro */}
                      <td 
                        className="text-right mono"
                        style={{ 
                          color: '#39FF14',
                          textShadow: '0 0 10px rgba(57, 255, 20, 0.6), 0 0 20px rgba(57, 255, 20, 0.3)'
                        }}
                      >
                        {formatCurrency(data.profit)}
                      </td>
                      {/* Margem with trend */}
                      <td className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span 
                            className="mono font-medium"
                            style={{ 
                              color: '#FFAC00',
                              textShadow: '0 0 10px rgba(255, 172, 0, 0.6), 0 0 20px rgba(255, 172, 0, 0.3)'
                            }}
                          >
                            {data.margin.toFixed(1)}%
                          </span>
                          {data.marginVariation !== null && (
                            data.marginVariation >= 0 
                              ? <TrendingUp className="w-4 h-4" style={{ color: '#39FF14', filter: 'drop-shadow(0 0 4px #39FF14)' }} />
                              : <TrendingDown className="w-4 h-4" style={{ color: '#FF6B6B', filter: 'drop-shadow(0 0 4px #FF6B6B)' }} />
                          )}
                        </div>
                      </td>
                      {/* Margin Variation */}
                      <td className="text-right mono text-sm">
                        {data.marginVariation !== null ? (
                          <span style={{ color: data.marginVariation >= 0 ? '#39FF14' : '#FF6B6B' }}>
                            {data.marginVariation >= 0 ? '+' : ''}{data.marginVariation.toFixed(1)}pp
                          </span>
                        ) : (
                          <span style={{ color: '#FFFFFF' }}>-</span>
                        )}
                      </td>
                      {/* Costs - only in detailed mode */}
                      {viewMode === 'detailed' && (
                        <td 
                          className="text-right mono"
                          style={{ 
                            color: '#BC13FE',
                            textShadow: '0 0 10px rgba(188, 19, 254, 0.6)'
                          }}
                        >
                          {formatCurrency(totalCosts)}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </TooltipProvider>
  );
};

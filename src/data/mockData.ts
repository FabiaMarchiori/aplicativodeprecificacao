// Mock data for the pricing management app

export interface Product {
  id: string;
  code: string;
  name: string;
  category: string;
  supplier: string;
  unit: string;
  purchaseCost: number;
  variableCost: number;
  currentPrice: number;
  status: 'active' | 'inactive';
}

export interface Supplier {
  id: string;
  name: string;
  type: 'national' | 'imported';
  averageDeliveryDays: number;
  averageLogisticsCost: number;
  notes: string;
}

export interface FixedCost {
  id: string;
  type: string;
  category: 'operational' | 'administrative' | 'personnel' | 'marketing';
  monthlyValue: number;
  allocationPercent: number;
}

export interface OtherTax {
  id: string;
  name: string;
  percentage: number;
}

export interface TaxConfig {
  salesTax: number;
  marketplaceFee: number;
  cardFee: number;
  otherFees: OtherTax[];
}

export interface Competitor {
  id: string;
  productId: string;
  productName: string;
  competitorPrice: number | null; // null = não informado pelo usuário
  ourPrice: number;
  difference: number;
  status: 'competitive' | 'attention' | 'above_market';
}

export interface CompetitorPrice {
  id: string;
  productId: string;
  competitorPrice: number | null;
}

export interface RevenueData {
  month: string;
  revenue: number;
  profit: number;
}

export interface PriceHistory {
  id: string;
  productId: string;
  date: string;
  suggestedPrice: number;
  appliedPrice: number;
  margin: number;
  reason?: string;
}

// Tipo para modo de rateio de custos fixos
export type FixedCostAllocationMode = 
  | 'distribute'   // Distribuir entre todos os produtos ativos
  | 'include'      // Incluir 100% dos custos fixos neste produto
  | 'exclude';     // Não considerar (análise unitária)

// Interface para resultado detalhado do cálculo de precificação
export interface PricingResult {
  purchaseCost: number;
  variableCost: number;
  allocatedFixedCost: number;
  activeProductsCount: number;
  totalCost: number;
  taxAmount: number;
  suggestedPrice: number;
  profitPerUnit: number;
  realMargin: number;
  allocationMode: FixedCostAllocationMode;
}

export const mockProducts: Product[] = [
  { id: '1', code: 'PRD-001', name: 'Smartphone Galaxy X200', category: 'Eletrônicos', supplier: 'Tech Import Ltda', unit: 'UN', purchaseCost: 1200, variableCost: 45, currentPrice: 2499, status: 'active' },
  { id: '2', code: 'PRD-002', name: 'Fone Bluetooth Premium', category: 'Acessórios', supplier: 'Tech Import Ltda', unit: 'UN', purchaseCost: 85, variableCost: 8, currentPrice: 249, status: 'active' },
  { id: '3', code: 'PRD-003', name: 'Carregador Turbo 65W', category: 'Acessórios', supplier: 'Energia Brasil', unit: 'UN', purchaseCost: 35, variableCost: 3, currentPrice: 129, status: 'active' },
  { id: '4', code: 'PRD-004', name: 'Cabo USB-C Premium 2m', category: 'Acessórios', supplier: 'Energia Brasil', unit: 'UN', purchaseCost: 12, variableCost: 1.5, currentPrice: 49, status: 'active' },
  { id: '5', code: 'PRD-005', name: 'Smart Watch Pro', category: 'Eletrônicos', supplier: 'Tech Import Ltda', unit: 'UN', purchaseCost: 450, variableCost: 25, currentPrice: 999, status: 'active' },
  { id: '6', code: 'PRD-006', name: 'Caixa de Som Portátil', category: 'Áudio', supplier: 'Sound Solutions', unit: 'UN', purchaseCost: 180, variableCost: 15, currentPrice: 449, status: 'active' },
  { id: '7', code: 'PRD-007', name: 'Tablet Ultra 10"', category: 'Eletrônicos', supplier: 'Tech Import Ltda', unit: 'UN', purchaseCost: 800, variableCost: 40, currentPrice: 1899, status: 'active' },
  { id: '8', code: 'PRD-008', name: 'Power Bank 20000mAh', category: 'Acessórios', supplier: 'Energia Brasil', unit: 'UN', purchaseCost: 65, variableCost: 5, currentPrice: 189, status: 'inactive' },
  { id: '9', code: 'PRD-009', name: 'Mouse Gamer RGB', category: 'Periféricos', supplier: 'Gaming Store', unit: 'UN', purchaseCost: 95, variableCost: 8, currentPrice: 249, status: 'active' },
  { id: '10', code: 'PRD-010', name: 'Teclado Mecânico', category: 'Periféricos', supplier: 'Gaming Store', unit: 'UN', purchaseCost: 220, variableCost: 18, currentPrice: 549, status: 'active' },
];

export const mockSuppliers: Supplier[] = [
  { id: '1', name: 'Tech Import Ltda', type: 'imported', averageDeliveryDays: 45, averageLogisticsCost: 850, notes: 'Principal fornecedor de eletrônicos. Importação da China.' },
  { id: '2', name: 'Energia Brasil', type: 'national', averageDeliveryDays: 7, averageLogisticsCost: 120, notes: 'Fabricante nacional de acessórios de energia.' },
  { id: '3', name: 'Sound Solutions', type: 'imported', averageDeliveryDays: 30, averageLogisticsCost: 450, notes: 'Especializado em equipamentos de áudio.' },
  { id: '4', name: 'Gaming Store', type: 'national', averageDeliveryDays: 5, averageLogisticsCost: 85, notes: 'Distribuidor de periféricos gamer.' },
];

export const mockFixedCosts: FixedCost[] = [
  { id: '1', type: 'Aluguel', category: 'operational', monthlyValue: 8500, allocationPercent: 25 },
  { id: '2', type: 'Energia Elétrica', category: 'operational', monthlyValue: 1200, allocationPercent: 10 },
  { id: '3', type: 'Funcionários', category: 'personnel', monthlyValue: 25000, allocationPercent: 40 },
  { id: '4', type: 'Internet/Telefone', category: 'operational', monthlyValue: 450, allocationPercent: 5 },
  { id: '5', type: 'Marketing', category: 'marketing', monthlyValue: 3500, allocationPercent: 15 },
  { id: '6', type: 'Contador', category: 'administrative', monthlyValue: 800, allocationPercent: 5 },
];

export const mockTaxConfig: TaxConfig = {
  salesTax: 12.5,
  marketplaceFee: 16,
  cardFee: 3.5,
  otherFees: [
    { id: '1', name: 'Frete', percentage: 0.8 },
    { id: '2', name: 'Seguros', percentage: 0.4 }
  ],
};

// Preços de concorrentes iniciais vazios - usuário deve preencher
export const mockCompetitorPrices: CompetitorPrice[] = [];

export const mockRevenueData: RevenueData[] = [
  { month: 'Jan', revenue: 125000, profit: 28500 },
  { month: 'Fev', revenue: 118000, profit: 26200 },
  { month: 'Mar', revenue: 142000, profit: 35800 },
  { month: 'Abr', revenue: 156000, profit: 41200 },
  { month: 'Mai', revenue: 168000, profit: 45600 },
  { month: 'Jun', revenue: 175000, profit: 48900 },
  { month: 'Jul', revenue: 182000, profit: 52100 },
  { month: 'Ago', revenue: 195000, profit: 58500 },
  { month: 'Set', revenue: 188000, profit: 54200 },
  { month: 'Out', revenue: 210000, profit: 63000 },
  { month: 'Nov', revenue: 245000, profit: 78400 },
  { month: 'Dez', revenue: 285000, profit: 91200 },
];

export const mockPriceHistory: PriceHistory[] = [
  // Smartphone Galaxy X200
  { id: '1', productId: '1', date: '2025-09-01', suggestedPrice: 2280, appliedPrice: 2299, margin: 26.5, reason: 'Lançamento' },
  { id: '2', productId: '1', date: '2025-10-15', suggestedPrice: 2350, appliedPrice: 2399, margin: 27.8, reason: 'Ajuste inflação' },
  { id: '3', productId: '1', date: '2025-11-20', suggestedPrice: 2420, appliedPrice: 2449, margin: 28.5, reason: 'Black Friday' },
  { id: '4', productId: '1', date: '2025-12-10', suggestedPrice: 2480, appliedPrice: 2499, margin: 29.2, reason: 'Natal' },
  { id: '5', productId: '1', date: '2026-01-01', suggestedPrice: 2574, appliedPrice: 2499, margin: 30.0, reason: 'Ano novo' },
  
  // Fone Bluetooth Premium
  { id: '6', productId: '2', date: '2025-09-01', suggestedPrice: 220, appliedPrice: 229, margin: 24.0 },
  { id: '7', productId: '2', date: '2025-10-15', suggestedPrice: 235, appliedPrice: 239, margin: 26.5 },
  { id: '8', productId: '2', date: '2025-12-01', suggestedPrice: 245, appliedPrice: 249, margin: 28.0 },
  
  // Smart Watch Pro
  { id: '9', productId: '5', date: '2025-08-01', suggestedPrice: 920, appliedPrice: 949, margin: 25.5 },
  { id: '10', productId: '5', date: '2025-10-01', suggestedPrice: 965, appliedPrice: 979, margin: 27.0 },
  { id: '11', productId: '5', date: '2025-12-15', suggestedPrice: 990, appliedPrice: 999, margin: 28.5 },
  
  // Tablet Ultra 10"
  { id: '12', productId: '7', date: '2025-07-01', suggestedPrice: 1750, appliedPrice: 1799, margin: 26.0 },
  { id: '13', productId: '7', date: '2025-09-15', suggestedPrice: 1820, appliedPrice: 1849, margin: 27.5 },
  { id: '14', productId: '7', date: '2025-11-30', suggestedPrice: 1880, appliedPrice: 1899, margin: 29.0 },
  
  // Mouse Gamer RGB
  { id: '15', productId: '9', date: '2025-08-15', suggestedPrice: 215, appliedPrice: 229, margin: 25.0 },
  { id: '16', productId: '9', date: '2025-11-01', suggestedPrice: 240, appliedPrice: 249, margin: 27.5 },
  
  // Teclado Mecânico
  { id: '17', productId: '10', date: '2025-09-01', suggestedPrice: 510, appliedPrice: 529, margin: 26.0 },
  { id: '18', productId: '10', date: '2025-12-01', suggestedPrice: 535, appliedPrice: 549, margin: 28.0 },
];

export const costComposition = [
  { name: 'Custos Fixos', value: 35, color: 'hsl(var(--chart-1))' },
  { name: 'Custos Variáveis', value: 25, color: 'hsl(var(--chart-2))' },
  { name: 'Impostos', value: 28, color: 'hsl(var(--chart-3))' },
  { name: 'Margem Líquida', value: 12, color: 'hsl(var(--chart-4))' },
];

export const productMargins = mockProducts.slice(0, 6).map(p => ({
  name: p.name.length > 20 ? p.name.substring(0, 20) + '...' : p.name,
  margin: Math.round(((p.currentPrice - p.purchaseCost - p.variableCost) / p.currentPrice) * 100),
  profit: p.currentPrice - p.purchaseCost - p.variableCost,
}));

/**
 * Calcula a precificação de um produto com controle sobre o rateio de custos fixos
 * 
 * @param product - Produto a ser precificado
 * @param fixedCosts - Lista de custos fixos
 * @param taxes - Configuração de impostos
 * @param desiredMargin - Margem de lucro desejada (%)
 * @param allocationMode - Modo de rateio: 'distribute' | 'include' | 'exclude'
 * @param activeProductsCount - Número de produtos ativos para divisão
 */
export const calculatePricing = (
  product: Product,
  fixedCosts: FixedCost[],
  taxes: TaxConfig,
  desiredMargin: number,
  allocationMode: FixedCostAllocationMode = 'distribute',
  activeProductsCount?: number
): PricingResult => {
  // Calcula o total de custos fixos rateados (usando allocationPercent)
  const totalFixedCostsRateado = fixedCosts.reduce(
    (sum, c) => sum + (c.monthlyValue * c.allocationPercent / 100), 
    0
  );
  
  // Determina o número de produtos para divisão
  const productsCount = activeProductsCount || mockProducts.filter(p => p.status === 'active').length;
  
  // Calcula o rateio de custos fixos baseado no modo selecionado
  let allocatedFixedCost = 0;
  
  switch (allocationMode) {
    case 'distribute':
      // Divide igualmente entre todos os produtos ativos
      allocatedFixedCost = totalFixedCostsRateado / productsCount;
      break;
    case 'include':
      // Inclui 100% dos custos fixos rateados neste produto
      allocatedFixedCost = totalFixedCostsRateado;
      break;
    case 'exclude':
      // Não considera custos fixos (análise unitária pura)
      allocatedFixedCost = 0;
      break;
  }
  
  // Custo total = compra + variável + rateio fixos
  const totalCost = product.purchaseCost + product.variableCost + allocatedFixedCost;
  
  // Calcula taxa total de impostos
  const otherFeesTotal = taxes.otherFees.reduce((sum, tax) => sum + tax.percentage, 0);
  const totalTaxRate = (taxes.salesTax + taxes.marketplaceFee + taxes.cardFee + otherFeesTotal) / 100;
  
  // Preço sugerido usando a fórmula: custo / (1 - margem - taxa)
  const suggestedPrice = totalCost / (1 - desiredMargin / 100 - totalTaxRate);
  
  // Valor dos impostos
  const taxAmount = suggestedPrice * totalTaxRate;
  
  // Lucro por unidade
  const profitPerUnit = suggestedPrice - totalCost - taxAmount;
  
  // Margem real alcançada
  const realMargin = (profitPerUnit / suggestedPrice) * 100;
  
  return {
    purchaseCost: Math.round(product.purchaseCost * 100) / 100,
    variableCost: Math.round(product.variableCost * 100) / 100,
    allocatedFixedCost: Math.round(allocatedFixedCost * 100) / 100,
    activeProductsCount: productsCount,
    totalCost: Math.round(totalCost * 100) / 100,
    taxAmount: Math.round(taxAmount * 100) / 100,
    suggestedPrice: Math.round(suggestedPrice * 100) / 100,
    profitPerUnit: Math.round(profitPerUnit * 100) / 100,
    realMargin: Math.round(realMargin * 10) / 10,
    allocationMode
  };
};

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
  monthlyValue: number;
  allocationPercent: number;
}

export interface TaxConfig {
  salesTax: number;
  marketplaceFee: number;
  cardFee: number;
  otherFees: number;
}

export interface Competitor {
  id: string;
  productId: string;
  productName: string;
  competitorPrice: number;
  ourPrice: number;
  difference: number;
  status: 'competitive' | 'attention' | 'above_market';
}

export interface RevenueData {
  month: string;
  revenue: number;
  profit: number;
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
  { id: '1', type: 'Aluguel', monthlyValue: 8500, allocationPercent: 25 },
  { id: '2', type: 'Energia Elétrica', monthlyValue: 1200, allocationPercent: 10 },
  { id: '3', type: 'Funcionários', monthlyValue: 25000, allocationPercent: 40 },
  { id: '4', type: 'Internet/Telefone', monthlyValue: 450, allocationPercent: 5 },
  { id: '5', type: 'Marketing', monthlyValue: 3500, allocationPercent: 15 },
  { id: '6', type: 'Contador', monthlyValue: 800, allocationPercent: 5 },
];

export const mockTaxConfig: TaxConfig = {
  salesTax: 12.5,
  marketplaceFee: 16,
  cardFee: 3.5,
  otherFees: 1.2,
};

export const mockCompetitors: Competitor[] = [
  { id: '1', productId: '1', productName: 'Smartphone Galaxy X200', competitorPrice: 2299, ourPrice: 2499, difference: 8.7, status: 'attention' },
  { id: '2', productId: '2', productName: 'Fone Bluetooth Premium', competitorPrice: 279, ourPrice: 249, difference: -10.8, status: 'competitive' },
  { id: '3', productId: '3', productName: 'Carregador Turbo 65W', competitorPrice: 149, ourPrice: 129, difference: -13.4, status: 'competitive' },
  { id: '4', productId: '5', productName: 'Smart Watch Pro', competitorPrice: 899, ourPrice: 999, difference: 11.1, status: 'above_market' },
  { id: '5', productId: '6', productName: 'Caixa de Som Portátil', competitorPrice: 429, ourPrice: 449, difference: 4.7, status: 'attention' },
  { id: '6', productId: '7', productName: 'Tablet Ultra 10"', competitorPrice: 1999, ourPrice: 1899, difference: -5.0, status: 'competitive' },
  { id: '7', productId: '9', productName: 'Mouse Gamer RGB', competitorPrice: 229, ourPrice: 249, difference: 8.7, status: 'attention' },
  { id: '8', productId: '10', productName: 'Teclado Mecânico', competitorPrice: 599, ourPrice: 549, difference: -8.3, status: 'competitive' },
];

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

export const calculatePricing = (
  product: Product,
  fixedCosts: FixedCost[],
  taxes: TaxConfig,
  desiredMargin: number
) => {
  const totalFixedCosts = fixedCosts.reduce((sum, c) => sum + c.monthlyValue, 0);
  const avgFixedCostPerProduct = totalFixedCosts / mockProducts.filter(p => p.status === 'active').length;
  const allocatedFixedCost = avgFixedCostPerProduct * 0.1; // Simplified allocation
  
  const totalCost = product.purchaseCost + product.variableCost + allocatedFixedCost;
  const totalTaxRate = (taxes.salesTax + taxes.marketplaceFee + taxes.cardFee + taxes.otherFees) / 100;
  
  const suggestedPrice = totalCost / (1 - desiredMargin / 100 - totalTaxRate);
  const taxAmount = suggestedPrice * totalTaxRate;
  const profitPerUnit = suggestedPrice - totalCost - taxAmount;
  const realMargin = (profitPerUnit / suggestedPrice) * 100;
  
  return {
    totalCost: Math.round(totalCost * 100) / 100,
    taxAmount: Math.round(taxAmount * 100) / 100,
    suggestedPrice: Math.round(suggestedPrice * 100) / 100,
    profitPerUnit: Math.round(profitPerUnit * 100) / 100,
    realMargin: Math.round(realMargin * 10) / 10,
  };
};

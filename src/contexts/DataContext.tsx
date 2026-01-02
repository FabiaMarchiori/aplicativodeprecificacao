import React, { createContext, useContext, ReactNode, useCallback, useMemo } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { 
  Product, 
  Supplier, 
  FixedCost, 
  TaxConfig, 
  Competitor,
  PriceHistory,
  mockProducts, 
  mockSuppliers, 
  mockFixedCosts, 
  mockTaxConfig,
  mockCompetitors,
  mockPriceHistory
} from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

interface DataContextType {
  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, data: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  // Suppliers
  suppliers: Supplier[];
  addSupplier: (supplier: Omit<Supplier, 'id'>) => void;
  updateSupplier: (id: string, data: Partial<Supplier>) => void;
  deleteSupplier: (id: string) => void;
  
  // Fixed Costs
  fixedCosts: FixedCost[];
  addFixedCost: (cost: Omit<FixedCost, 'id'>) => void;
  updateFixedCost: (id: string, data: Partial<FixedCost>) => void;
  deleteFixedCost: (id: string) => void;
  
  // Tax Config
  taxConfig: TaxConfig;
  updateTaxConfig: (config: TaxConfig) => void;
  
  // Derived data (read-only)
  competitors: Competitor[];
  priceHistory: PriceHistory[];
  
  // Utility
  resetToDefaults: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const { toast } = useToast();
  
  // Persisted state with localStorage
  const [products, setProducts] = useLocalStorage<Product[]>('pricing-app-products', mockProducts);
  const [suppliers, setSuppliers] = useLocalStorage<Supplier[]>('pricing-app-suppliers', mockSuppliers);
  const [fixedCosts, setFixedCosts] = useLocalStorage<FixedCost[]>('pricing-app-fixed-costs', mockFixedCosts);
  const [taxConfig, setTaxConfig] = useLocalStorage<TaxConfig>('pricing-app-tax-config', mockTaxConfig);
  const [priceHistory, setPriceHistory] = useLocalStorage<PriceHistory[]>('pricing-app-price-history', mockPriceHistory);
  
  // Products CRUD
  const addProduct = useCallback((product: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
    };
    setProducts(prev => [...prev, newProduct]);
    toast({ title: 'Produto adicionado', description: 'Novo produto cadastrado com sucesso.' });
  }, [setProducts, toast]);
  
  const updateProduct = useCallback((id: string, data: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
    toast({ title: 'Produto atualizado', description: 'As alterações foram salvas.' });
  }, [setProducts, toast]);
  
  const deleteProduct = useCallback((id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    // Also remove related price history
    setPriceHistory(prev => prev.filter(ph => ph.productId !== id));
    toast({ title: 'Produto excluído', variant: 'destructive' });
  }, [setProducts, setPriceHistory, toast]);
  
  // Suppliers CRUD
  const addSupplier = useCallback((supplier: Omit<Supplier, 'id'>) => {
    const newSupplier: Supplier = {
      ...supplier,
      id: Date.now().toString(),
    };
    setSuppliers(prev => [...prev, newSupplier]);
    toast({ title: 'Fornecedor adicionado' });
  }, [setSuppliers, toast]);
  
  const updateSupplier = useCallback((id: string, data: Partial<Supplier>) => {
    setSuppliers(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
    toast({ title: 'Fornecedor atualizado' });
  }, [setSuppliers, toast]);
  
  const deleteSupplier = useCallback((id: string) => {
    setSuppliers(prev => prev.filter(s => s.id !== id));
    toast({ title: 'Fornecedor excluído', variant: 'destructive' });
  }, [setSuppliers, toast]);
  
  // Fixed Costs CRUD
  const addFixedCost = useCallback((cost: Omit<FixedCost, 'id'>) => {
    const newCost: FixedCost = {
      ...cost,
      id: Date.now().toString(),
    };
    setFixedCosts(prev => [...prev, newCost]);
    toast({ title: 'Custo adicionado com sucesso' });
  }, [setFixedCosts, toast]);
  
  const updateFixedCost = useCallback((id: string, data: Partial<FixedCost>) => {
    setFixedCosts(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
    toast({ title: 'Custo atualizado com sucesso' });
  }, [setFixedCosts, toast]);
  
  const deleteFixedCost = useCallback((id: string) => {
    setFixedCosts(prev => prev.filter(c => c.id !== id));
    toast({ title: 'Custo excluído', variant: 'destructive' });
  }, [setFixedCosts, toast]);
  
  // Tax Config
  const updateTaxConfig = useCallback((config: TaxConfig) => {
    setTaxConfig(config);
    toast({ 
      title: 'Configurações salvas', 
      description: 'As taxas e impostos foram atualizados com sucesso.'
    });
  }, [setTaxConfig, toast]);
  
  // Derived data: Competitors based on current products
  const competitors = useMemo<Competitor[]>(() => {
    return products
      .filter(p => p.status === 'active')
      .map(product => {
        // Find existing competitor data or generate mock
        const existingCompetitor = mockCompetitors.find(c => c.productId === product.id);
        
        if (existingCompetitor) {
          // Update with current product price
          const difference = ((product.currentPrice - existingCompetitor.competitorPrice) / existingCompetitor.competitorPrice) * 100;
          const status: Competitor['status'] = 
            difference <= 0 ? 'competitive' : 
            difference <= 10 ? 'attention' : 
            'above_market';
          
          return {
            ...existingCompetitor,
            ourPrice: product.currentPrice,
            productName: product.name,
            difference: Math.round(difference * 10) / 10,
            status
          };
        }
        
        // Generate new competitor data for new products
        const competitorPrice = product.currentPrice * (0.9 + Math.random() * 0.2);
        const difference = ((product.currentPrice - competitorPrice) / competitorPrice) * 100;
        const status: Competitor['status'] = 
          difference <= 0 ? 'competitive' : 
          difference <= 10 ? 'attention' : 
          'above_market';
        
        return {
          id: `comp-${product.id}`,
          productId: product.id,
          productName: product.name,
          competitorPrice: Math.round(competitorPrice),
          ourPrice: product.currentPrice,
          difference: Math.round(difference * 10) / 10,
          status
        };
      });
  }, [products]);
  
  // Reset to defaults
  const resetToDefaults = useCallback(() => {
    setProducts(mockProducts);
    setSuppliers(mockSuppliers);
    setFixedCosts(mockFixedCosts);
    setTaxConfig(mockTaxConfig);
    setPriceHistory(mockPriceHistory);
    toast({ 
      title: 'Dados restaurados', 
      description: 'Todos os dados foram restaurados para os valores padrão.'
    });
  }, [setProducts, setSuppliers, setFixedCosts, setTaxConfig, setPriceHistory, toast]);
  
  const value: DataContextType = {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    suppliers,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    fixedCosts,
    addFixedCost,
    updateFixedCost,
    deleteFixedCost,
    taxConfig,
    updateTaxConfig,
    competitors,
    priceHistory,
    resetToDefaults,
  };
  
  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

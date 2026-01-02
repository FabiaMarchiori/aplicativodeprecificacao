import React, { createContext, useContext, ReactNode, useCallback, useMemo, useEffect, useRef } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { 
  Product, 
  Supplier, 
  FixedCost, 
  TaxConfig, 
  Competitor,
  CompetitorPrice,
  PriceHistory,
  mockProducts, 
  mockSuppliers, 
  mockFixedCosts, 
  mockTaxConfig,
  mockCompetitorPrices,
  mockPriceHistory
} from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

// Função para sanitizar dados de preços de concorrentes (migração silenciosa)
const sanitizeCompetitorPrices = (data: unknown[]): CompetitorPrice[] => {
  if (!Array.isArray(data)) return [];
  
  return data
    .filter((item): item is Record<string, unknown> => 
      item !== null && typeof item === 'object' && 'productId' in item
    )
    .map(item => ({
      id: typeof item.id === 'string' ? item.id : Date.now().toString() + Math.random().toString(36).substr(2, 9),
      productId: String(item.productId),
      competitorPrice: typeof item.competitorPrice === 'number' ? item.competitorPrice : null
    }));
};

// Verifica se os dados precisam de migração (contém campos extras)
const needsMigration = (data: unknown[]): boolean => {
  if (!Array.isArray(data)) return false;
  
  return data.some(item => {
    if (item === null || typeof item !== 'object') return false;
    const obj = item as Record<string, unknown>;
    return 'difference' in obj || 
           'status' in obj || 
           'productName' in obj || 
           'ourPrice' in obj;
  });
};

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
  
  // Competitor prices (user-editable)
  competitors: Competitor[];
  updateCompetitorPrice: (productId: string, price: number | null) => void;
  
  // Price history
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
  const migrationDone = useRef(false);
  
  // Persisted state with localStorage
  const [products, setProducts] = useLocalStorage<Product[]>('pricing-app-products', mockProducts);
  const [suppliers, setSuppliers] = useLocalStorage<Supplier[]>('pricing-app-suppliers', mockSuppliers);
  const [fixedCosts, setFixedCosts] = useLocalStorage<FixedCost[]>('pricing-app-fixed-costs', mockFixedCosts);
  const [taxConfig, setTaxConfig] = useLocalStorage<TaxConfig>('pricing-app-tax-config', mockTaxConfig);
  const [priceHistory, setPriceHistory] = useLocalStorage<PriceHistory[]>('pricing-app-price-history', mockPriceHistory);
  const [rawCompetitorPrices, setCompetitorPrices] = useLocalStorage<unknown[]>('pricing-app-competitor-prices', mockCompetitorPrices);
  
  // Aplicar sanitização aos dados brutos (sempre calcula dinamicamente)
  const competitorPrices = useMemo(() => {
    return sanitizeCompetitorPrices(rawCompetitorPrices);
  }, [rawCompetitorPrices]);
  
  // Migração silenciosa: limpar dados antigos com campos extras (executa uma vez)
  useEffect(() => {
    if (migrationDone.current) return;
    migrationDone.current = true;
    
    if (needsMigration(rawCompetitorPrices)) {
      const sanitized = sanitizeCompetitorPrices(rawCompetitorPrices);
      if (sanitized.length > 0) {
        setCompetitorPrices(sanitized);
        console.log('[Migração] Dados de concorrentes limpos automaticamente - campos extras removidos');
      }
    }
  }, [rawCompetitorPrices, setCompetitorPrices]);
  
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
  
  // Update competitor price (user-editable)
  const updateCompetitorPrice = useCallback((productId: string, price: number | null) => {
    setCompetitorPrices(prev => {
      const sanitized = sanitizeCompetitorPrices(prev);
      const existing = sanitized.find(cp => cp.productId === productId);
      if (existing) {
        return sanitized.map(cp => 
          cp.productId === productId 
            ? { ...cp, competitorPrice: price } 
            : cp
        );
      }
      return [...sanitized, { id: Date.now().toString(), productId, competitorPrice: price }];
    });
  }, [setCompetitorPrices]);
  
  // Derived data: Competitors based on current products and user-entered prices
  const competitors = useMemo<Competitor[]>(() => {
    return products
      .filter(p => p.status === 'active')
      .map(product => {
        // Find user-entered competitor price
        const priceData = competitorPrices.find(cp => cp.productId === product.id);
        const competitorPrice = priceData?.competitorPrice ?? null;
        
        // Calculate difference and status only if price is provided
        let difference = 0;
        let status: Competitor['status'] = 'competitive';
        
        if (competitorPrice !== null && competitorPrice > 0) {
          difference = ((product.currentPrice - competitorPrice) / competitorPrice) * 100;
          status = difference <= 0 ? 'competitive' : 
                   difference <= 5 ? 'attention' : 
                   'above_market';
        }
        
        return {
          id: `comp-${product.id}`,
          productId: product.id,
          productName: product.name,
          competitorPrice,
          ourPrice: product.currentPrice,
          difference: Math.round(difference * 10) / 10,
          status
        };
      });
  }, [products, competitorPrices]);
  
  // Reset to defaults
  const resetToDefaults = useCallback(() => {
    setProducts(mockProducts);
    setSuppliers(mockSuppliers);
    setFixedCosts(mockFixedCosts);
    setTaxConfig(mockTaxConfig);
    setPriceHistory(mockPriceHistory);
    setCompetitorPrices(mockCompetitorPrices);
    toast({ 
      title: 'Dados restaurados', 
      description: 'Todos os dados foram restaurados para os valores padrão.'
    });
  }, [setProducts, setSuppliers, setFixedCosts, setTaxConfig, setPriceHistory, setCompetitorPrices, toast]);
  
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
    updateCompetitorPrice,
    priceHistory,
    resetToDefaults,
  };
  
  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
